import fs from 'fs';
import { resolve } from 'path';
import spawn from 'cross-spawn';
import decompress from 'decompress';
import { deleteAsync } from 'del';
import got from 'got';
import stream from 'stream';
import { promisify } from 'util';

const pipeline = promisify(stream.pipeline);

// Read config
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

function getTweegoZipLink(): string {
    const binaries = config.tweego.binaries[process.platform as string];
    return binaries[process.arch] || binaries.x86;
}

export function getTweegoBinaryPath(): string {
    return resolve(
        config.tweego.dir,
        config.tweego.binaries[process.platform as string].name
    );
}

async function downloadAndExtract(link: string, to: string): Promise<void> {
    const filePath = link.split('/').pop()!;
    await deleteAsync(filePath);
    await pipeline(got.stream(link), fs.createWriteStream(filePath));
    await decompress(filePath, to);
    await deleteAsync(filePath);
}

async function installTweego(): Promise<void> {
    console.log(`[install] Tweego (${config.tweego.binaries.version}) for ${process.platform}-${process.arch}...`);
    try {
        const zipLink = getTweegoZipLink();
        await downloadAndExtract(zipLink, config.tweego.dir);
        console.log('[install] Tweego installed.');
    } catch (e: any) {
        console.error('[install] Failed to install Tweego:', e.message);
        process.exit(1);
    }
}

async function installSugarCube(): Promise<void> {
    console.log(`[install] SugarCube StoryFormat (${config.tweego.storyFormats.sugarcube.version})...`);
    try {
        const zipLink = config.tweego.storyFormats.sugarcube.link;
        const extractTo = resolve(config.tweego.dir, 'storyformats');
        await downloadAndExtract(zipLink, extractTo);
        console.log('[install] SugarCube installed.');
    } catch (e: any) {
        console.error('[install] Failed to install SugarCube:', e.message);
        process.exit(1);
    }
}

export async function install(): Promise<void> {
    await installTweego();
    await installSugarCube();
}

export function verifyInstall(): boolean {
    const tweego = getTweegoBinaryPath();
    if (!fs.existsSync(tweego)) {
        return false;
    }

    // Verify executable permissions on unix systems
    if (['linux', 'darwin'].includes(process.platform)) {
        try {
            fs.accessSync(tweego, fs.constants.X_OK);
        } catch (err) {
            console.error(`${tweego} does not have execute permissions.`);
            console.error(`Run: chmod +x ${tweego}`);
            process.exit(1);
        }
    }

    return true;
}

export function runTweego(): { success: boolean; error?: string } {
    const tweegoBinary = getTweegoBinaryPath();

    // Auto-install if missing
    if (!verifyInstall()) {
        console.log('[tweego] Not installed. Installing...');
        // Note: For sync context, we spawn the install script
        const result = spawn.sync('npx', ['tsx', '.build/tweego.ts', '--install'], { stdio: 'inherit' });
        if (result.status !== 0) {
            const error = '[tweego] Install failed';
            console.error(error);
            return { success: false, error };
        }
    }

    const options = [
        ...config.tweego.options,
        '--head=src/head-content.html',
        '--module=dist/styles/app.bundle.css',
        '--output=dist/index.html',
        ...(process.env.NODE_ENV !== 'production' ? ['-t'] : []),
        'src/story',
        'dist/scripts',
    ];

    console.log('[tweego] Building story...');

    const result = spawn.sync(tweegoBinary, options, {
        env: { ...process.env, TWEEGO_PATH: resolve(config.tweego.dir, 'storyformats') },
        stdio: 'pipe',
    });

    if (result.status !== 0) {
        // Capture both stdout and stderr as Tweego sometimes prints errors to stdout
        const output = (result.stderr?.toString() || '') + (result.stdout?.toString() || '');
        console.error('[tweego] Build failed:\n', output);
        return { success: false, error: output };
    }

    console.log('[tweego] Done.\n');
    return { success: true };
}

// CLI
const args = process.argv.slice(2);

if (args.includes('--install')) {
    install().then(() => {
        console.log('[install] Done.');
    });
} else if (args.includes('--verify')) {
    if (verifyInstall()) {
        console.log('[tweego] Installation verified.');
    } else {
        console.log('[tweego] Not installed.');
        process.exit(1);
    }
} else if (args.includes('--build')) {
    runTweego();
}

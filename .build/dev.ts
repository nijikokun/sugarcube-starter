import { build } from 'vite';
import chokidar from 'chokidar';
import { resolve } from 'path';
import browserSync from 'browser-sync';
import { runTweego } from './tweego.ts';

// Colors for console output
const c = {
    reset: '\x1b[0m',
    dim: '\x1b[2m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

function log(prefix: string, color: string, msg: string) {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    console.log(`${c.dim}${time}${c.reset} ${color}[${prefix}]${c.reset} ${msg}`);
}

// Debounce helper
function debounce<T extends (...args: any[]) => void>(fn: T, ms: number): T {
    let timer: NodeJS.Timeout;
    return ((...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    }) as T;
}

async function dev() {
    const cwd = process.cwd();

    // Initial build
    log('dev', c.blue, 'Building...');
    await build({ configFile: './vite.config.ts', logLevel: 'warn' });

    // Start browser-sync
    const bs = browserSync.create();

    await new Promise<void>((resolve) => {
        bs.init({
            server: './dist',
            port: 4321,
            open: true,
            notify: false,
            ui: false,
            logLevel: 'silent',
            files: [
                // CSS injection (no full reload)
                { match: 'dist/**/*.css', fn: (event, file) => bs.reload('*.css') },
            ],
        }, () => {
            log('server', c.green, 'http://localhost:4321');
            resolve();
        });
    });

    // Debounced rebuild functions
    const rebuildTweego = debounce(() => {
        runTweego();
        bs.reload();
    }, 100);

    const rebuildAssets = debounce(() => {
        bs.reload();
    }, 100);

    // Watch patterns
    const watchPaths = [
        resolve(cwd, 'src/story'),           // .twee files
        resolve(cwd, 'src/head-content.html'), // head content
    ];

    log('watch', c.cyan, `Watching: ${watchPaths.map(p => p.replace(cwd, '.')).join(', ')}`);

    const tweeWatcher = chokidar.watch(watchPaths, {
        ignored: /(^|[\/\\])\../,
        persistent: true,
        usePolling: true,
        interval: 300,
    });

    tweeWatcher
        .on('ready', () => log('watch', c.cyan, 'Ready'))
        .on('change', (path) => {
            log('change', c.yellow, path.replace(cwd, '.'));
            rebuildTweego();
        })
        .on('error', (err) => log('error', c.magenta, String(err)));

    // Watch JS/CSS with Vite
    log('vite', c.magenta, 'Watching assets...\n');
    await build({
        configFile: './vite.config.ts',
        build: { watch: {}, emptyOutDir: false },
        logLevel: 'warn',
        plugins: [{
            name: 'reload-on-build',
            closeBundle() {
                rebuildAssets();
            }
        }]
    });

    // Graceful shutdown
    const cleanup = () => {
        log('dev', c.blue, 'Shutting down...');
        tweeWatcher.close();
        bs.exit();
        process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
}

dev().catch(console.error);

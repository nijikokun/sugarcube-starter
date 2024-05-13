import fs from "fs";
import ora from "ora";
import chalk from "chalk";
import { deleteAsync } from "del";
import open from "open";
import mvdir from "mvdir";
import webpack from 'webpack';
import spawn from "cross-spawn";
import chokidar from "chokidar";
import SliveServer from "slive-server";
import { Installer } from "./tweego_installer.js";
import { config } from "./build_config.js";
import { webpackConfig } from "./webpack_dev.js";

const getBuildSpinner = () => {
  return ora({ prefixText: chalk.gray(`[   builder]`)});
}

const verifyTweegoInstall = async () => {
  const spinner = getBuildSpinner(true);
  spinner.start(`Verifying installation.`);

  // Verify correct tweego installation
  const tweego = Installer.getTweegoBinaryPath();
  if (!fs.existsSync(tweego)) {
    await Installer.install();
  }

  // Verify executable permissions on unix systems.
  if (["linux", "darwin"].includes(process.platform)) {
    try {
      fs.accessSync(tweego, fs.constants.X_OK);
    } catch (err) {
      console.error(`${tweego} does not have permissions to execute.
    
      Run the following command to ensure tweego is an executable:
    
    \tchmod +x ${tweego}
`);
      process.exit(1);
    }
  }

  spinner.succeed();
};

const watchDirectory = (directory, onChangeFn) => {
  return chokidar
    .watch(directory, {
      ignoreInitial: true,
      interval: 500,
      binaryInterval: 900,
    })
    .on("all", onChangeFn);
};

const runTweego = () => {
  const spinner = getBuildSpinner(true);
  spinner.start(`Build story...`);

  let options = [
    ...config.tweego.options,
    `--head=${config.webpack_dist.index.input_head}`,
    `--module=${config.webpack_dist.styles.output}`,
    `--output=${config.webpack_dist.index.output}`,
  ];

  // Add debug mode when debug
  if (process.env.NODE_ENV === "development") {
    options.push(`-t`);
  }

  // Add input file
  options.push(config.webpack_dist.index.input);

  // Add scripts
  options.push(config.webpack_dist.scripts.output);

  // Tweego result
  let result;

  // Run Tweego
  try {
    result = spawn.sync(Installer.getTweegoBinaryPath(), options, {
      env: { ...process.env, TWEEGO_PATH: [config.tweego.dir, 'storyformats'].join('/') },
      stdio: "pipe",
    });

    const output = result.stdout ? result.stdout.toString() : '';
    const errors = result.stderr ? result.stderr.toString() : '';

    if (result.signal) {
      // Process was terminated by a signal
      spinner.fail(`Build terminated by signal: ${result.signal}`);
    } else if (result.status !== 0) {
      // Process exited with an error code
      spinner.fail('Build failed.');
      console.error(`\n`, errors || output);
    } else {
      spinner.succeed('Build story.');
    }
  } catch (error) {
    spinner.fail('An error occurred while building story:');
    console.error(error);
  }

  return result;
};

const moveFiles = async () => {
  const spinner = getBuildSpinner(true);
  
  try {
    // Cleanup output directory
    spinner.start(`Clean dist dir...`);
    await deleteAsync([config.webpack_dist.output_dir]);
    spinner.succeed(`Clean dist dir.`);

    // Move media files
    spinner.start(`Move media files...`);
    await mvdir(
      config.webpack_dist.media.input,
      config.webpack_dist.media.output,
      { log: false }
    );
    spinner.succeed(`Move media files.`);
  
    // Move font files
    spinner.start(`Move font files...`);
    await mvdir(
      config.webpack_dist.fonts.input,
      config.webpack_dist.fonts.output,
      { log: false }
    );
    spinner.succeed(`Move font files.`);
  
    // Move stylesheets
    spinner.start(`Move stylesheets...`);
    await mvdir(
      config.webpack_dist.styles.input,
      config.webpack_dist.styles.output,
      { log: false }
    );
    spinner.succeed(`Move stylesheets.`);
  
    // Move scripts
    spinner.start(`Move scripts...`);
    await mvdir(
      config.webpack_dist.scripts.input,
      config.webpack_dist.scripts.output,
      { log: false }
    );
    spinner.succeed(`Move scripts.`);
  } catch (e) {
    spinner.fail('An error occurred during file move process:');
    console.error(e);
  }
};

const runWebpack = (config) => {
  const spinner = getBuildSpinner(true);
  spinner.start(`Build assets...`);

  return new Promise((res, rej) => {
    webpack(config, (err, stats) => {
      if (err) {
        spinner.fail('Build failed.');
        console.error(err.stack || err);

        if (err.details) {
          console.error(err.details);
        }

        return [err.stack || err, null];
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        spinner.fail('Build completed with errors.');
        console.error(info.errors);
        return [info.errors, null];
      }
    
      if (stats.hasWarnings()) {
        spinner.warn('Build completed with warnings.');
        console.warn(info.warnings);
      }

      if (!stats.hasErrors() && !stats.hasWarnings()) {
        spinner.succeed('Build assets.');
      }

      return res([null, stats]);
    });
  });
};

const runWebpackDev = () => {
  return runWebpack(webpackConfig);
};

const runLocalServer = () => {
  const serverConfig = {
    host: "0.0.0.0",
    port: 4321,
    wait: 500,
    watch: [config.webpack_dist.output_dir, '.fake'].join('/'), // we will be manually reloading the server, so point to a fake directory.
    root: config.webpack_dist.output_dir,
    verbose: true,
    ...(config.server || {}),
  };

  // Start Server
  SliveServer.start(serverConfig);

  // Open in browser
  if (!serverConfig.disable_open) {
    let host = serverConfig.host == "0.0.0.0" ? "127.0.0.1" : serverConfig.host;
    open(`http://${host}:${serverConfig.port}/index.html`);
  }

  // Return instance
  return SliveServer;
};

export {
  verifyTweegoInstall,
  runLocalServer,
  runWebpack,
  runWebpackDev,
  runTweego,
  watchDirectory,
  moveFiles,
  getBuildSpinner,
};

import fs from "fs";
import del from "del";
import open from "open";
import mvdir from "mvdir";
import webpack from 'webpack';
import spawn from "cross-spawn";
import chokidar from "chokidar";
import SliveServer from "slive-server";
import { Installer } from "./tweego_installer.js";
import { config } from "./build_config.js";
import { webpackConfig } from "./webpack_dev.js";

const verifyTweegoInstall = async () => {
  const tweego = Installer.getTweegoBinaryPath();

  // Verify correct tweego installation
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

  return spawn.sync(Installer.getTweegoBinaryPath(), options, {
    env: { ...process.env, TWEEGO_PATH: [config.tweego.dir, 'storyformats'].join('/') },
    stdio: "inherit",
  });
};

const moveFiles = async () => {
  // Cleanup
  await del([config.webpack_dist.output_dir]);

  // Move files
  await mvdir(
    config.webpack_dist.media.input,
    config.webpack_dist.media.output,
    { log: false }
  );
  await mvdir(
    config.webpack_dist.fonts.input,
    config.webpack_dist.fonts.output,
    { log: false }
  );
  await mvdir(
    config.webpack_dist.styles.input,
    config.webpack_dist.styles.output,
    { log: false }
  );
  await mvdir(
    config.webpack_dist.scripts.input,
    config.webpack_dist.scripts.output,
    { log: false }
  );
};

const runWebpack = (config) => {
  return new Promise((res, rej) => {
    webpack(config, (err, stats) => {
      if (err) {
        if (err.details) {
          console.error(`[builder] [webpack] ${err.details}`);
        }

        return [err.stack || err, null];
      }
      
      const info = stats.toJson();

      if (stats.hasErrors()) {
        return [info.errors, null];
      }
    
      if (stats.hasWarnings()) {
        console.warn(`[builder] [webpack] ${info.warnings}`);
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
};

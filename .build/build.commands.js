const chokidar = require("chokidar");
const webpack = require("webpack");
const spawn = require("cross-spawn");
const mvdir = require("mvdir");
const slive = require("slive-server");
const open = require("open");
const del = require("del");
const fs = require("fs");
const installer = require("./tweego.installer");
const config = require("../config.json");

const verifyTweegoInstall = async () => {
  const tweego = installer.getTweegoBinaryPath();

  // Verify correct tweego installation
  if (!fs.existsSync(tweego)) {
    await installer.install();
  }

  // Verify executable permissions on unix systems.
  if (["linux", "darwin"].includes(process.platform)) {
    try {
      fs.accessSync(tweego, fs.constants.X_OK);
    } catch (err) {
      console.error(`${tweego} does not have permissions to execute.
    If you are on a Unix-based system you can grant permissions with 'chmod +x ${tweego}'`);
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
    `--module=${config.webpack_dist.scripts.output}`,
    `--output=${config.webpack_dist.index.output}`,
  ];

  // Add debug mode when debug
  if (process.env.NODE_ENV === "development") {
    options.push(`-t`);
  }

  // Add input file
  options.push(config.webpack_dist.index.input);

  return spawn.sync(installer.getTweegoBinaryPath(), options, {
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
      if (err || stats.hasErrors()) {
        return rej([err, null]);
      }

      return res([null, stats]);
    });
  });
};

const runWebpackDev = () => {
  return runWebpack(require("./webpack.dev"));
};

const runLocalServer = () => {
  const serverConfig = {
    host: "0.0.0.0",
    port: 4321,
    wait: 500,
    watch: config.webpack_dist.output_dir,
    root: config.webpack_dist.output_dir,
    verbose: false,
    ...(config.server || {}),
  };

  // Start Server
  slive.start(serverConfig);

  // Open in browser
  if (!serverConfig.disable_open) {
    let host = serverConfig.host == "0.0.0.0" ? "127.0.0.1" : serverConfig.host;
    open(`http://${host}:${serverConfig.port}/index.html`);
  }

  // Return instance
  return slive;
};

module.exports = {
  verifyTweegoInstall,
  runLocalServer,
  runWebpack,
  runWebpackDev,
  runTweego,
  watchDirectory,
  moveFiles,
};

const config = require("../config.json");
const debounce = require("debounce");

const {
  verifyTweegoInstall,
  watchDirectory,
  runWebpackDev,
  runLocalServer,
  runTweego,
  moveFiles,
} = require("./build.commands");

class Builder {
  constructor() {
    this.running = false;
    this.pendingBuild = false;
    this.shuttingDown = false;
    this.process = false;
    this.server = false;

    this.start();
  }

  async start() {
    try {
      await verifyTweegoInstall();
      await this.runBuild("init");
      await this.startWatching();
      await this.startLocalServer();
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }

  async stop() {
    console.log(`[builder] Shutting down.`);
    this.shuttingDown = true;
    this.pendingBuild = false;
    await this.stopWatching();
    await this.stopLocalServer();
  }

  async startLocalServer() {
    console.log(`[builder] Starting local server.`);
    this.server = runLocalServer();
  }

  async stopLocalServer() {
    console.log(`[builder] Stopped local server.`);
    this.server.shutdown();
  }

  async startWatching() {
    console.log(`[builder] Starting watcher.`);
    this.process = watchDirectory(
      config["webpack"]["watch_dir"],
      debounce((e, p) => this.runBuild(e, p), 500)
    );
  }

  async stopWatching() {
    console.log(`[builder] Stopped watching.`);
    return this.process.close();
  }

  async runBuild(event, path) {
    if (this.shuttingDown) {
      return;
    }

    if (event === "error") {
      return console.error(path);
    }

    if (this.running) {
      this.pendingBuild = event;
      return;
    }

    // Start build
    console.log(`[builder] [${event}] Running build.`);
    this.running = true;
    this.pendingBuild = false;

    // Run webpack
    let [err, res] = await runWebpackDev();
    if (err) return console.error(`[builder] [${event}] ${err}`);

    // Move files
    await moveFiles();

    // Run tweego
    runTweego();

    // Complete build
    console.log(`[builder] Build finished.`);
    this.running = false;

    if (this.pendingBuild) {
      await this.runBuild(this.pendingBuild);
    }
  }
}

// Initialize builder
let builder = new Builder();

// Handle close signals
process.on("SIGTERM", async () => {
  await builder.stop();
  process.exit();
});
process.on("SIGINT", async () => {
  await builder.stop();
  process.exit();
});

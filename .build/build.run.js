const {
  verifyTweegoInstall,
  runWebpackDev,
  runTweego,
  moveFiles,
} = require("./build.commands");

(async () => {
  // Verify tweego is installed
  await verifyTweegoInstall();

  // Run webpack
  let [err, res] = await runWebpackDev();
  if (err) throw new Error(err);

  // Move files
  await moveFiles();

  // Run tweego
  runTweego();
})();

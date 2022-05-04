import {
  verifyTweegoInstall,
  runWebpackDev,
  runTweego,
  moveFiles,
}  from "./build_commands.js";

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

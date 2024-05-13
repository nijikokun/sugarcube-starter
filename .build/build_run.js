import {
  verifyTweegoInstall,
  runWebpackDev,
  runTweego,
  moveFiles,
  getBuildSpinner
}  from "./build_commands.js";

(async () => {  
  const spinner = getBuildSpinner(true);
  spinner.start(`Running build.`);

  // Verify tweego is installed
  await verifyTweegoInstall();
  
  // Run webpack
  let [err, res] = await runWebpackDev();
  if (err) throw new Error(err);
  
  // Move files
  await moveFiles();
  
  // Run tweego
  runTweego();
  
  // Completed
  spinner.succeed(`Build completed.`)
})();

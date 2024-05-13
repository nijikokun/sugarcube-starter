import decompress from "decompress";
import fs from "fs";
import { deleteAsync } from "del";
import ora from "ora";
import chalk from 'chalk';
import got from "got";
import stream from "stream";
import { config } from "./build_config.js";
import { promisify } from "util";

const pipeline = promisify(stream.pipeline);

const getInstallSpinner = () => {
  return ora({ prefixText: chalk.gray(`[installing]`)});
}

export class Installer {
  static async downloadAndExtract(link, to) {
    const filePath = link.split("/").pop();

    // Ensure clean entry
    await deleteAsync(filePath);
    // Download
    await pipeline(got.stream(link), fs.createWriteStream(filePath));
    // Unzip
    await decompress(filePath, to);
    // Cleanup
    await deleteAsync(filePath);
  }

  static async installTweego() {
    const spinner = getInstallSpinner(true);
    spinner.start(`Tweego (${config.tweego.binaries.version}) for ${process.platform}-${process.arch}`);

    try {
      const zipLink = Installer.getTweegoZipLink();
      await Installer.downloadAndExtract(zipLink, config.tweego.dir);
      spinner.succeed();
    } catch (e) {
      spinner.fail(`Failed to install Tweego.\n\n${e}`);
    }
  }

  static async installSugarCubeStoryFormat() {
    const spinner = getInstallSpinner(true);
    spinner.start(`SugarCube StoryFormat (${config.tweego.storyFormats.sugarcube.version})`);
    try {
      const zipLink = config.tweego.storyFormats.sugarcube.link;
      const extractTo = [config.tweego.dir, "storyformats"].join("/")
      await Installer.downloadAndExtract(zipLink, extractTo);
      spinner.succeed();
    } catch (e) {
      spinner.fail(`Failed to install SugarCube StoryFormat.\n\n${e}`);
    }
  }

  static async install() {
    await Installer.installTweego();
    await Installer.installSugarCubeStoryFormat();
  }

  static getTweegoZipLink() {
    const binaries = config.tweego.binaries[process.platform];
    return binaries[process.arch] || binaries.x86;
  }

  static getTweegoBinaryPath() {
    return [
      config.tweego.dir,
      config.tweego.binaries[process.platform].name,
    ].join("/");
  }
}

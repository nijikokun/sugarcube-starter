import decompress from "decompress";
import fs from "fs";
import del from "del";
import got from "got";
import stream from "stream";
import { config } from "./build_config.js";
import { promisify } from "util";

const pipeline = promisify(stream.pipeline);

export class Installer {
  static async downloadAndExtract(link, to) {
    const filePath = link.split("/").pop();

    // Ensure clean entry
    await del(filePath);
    // Download
    await pipeline(got.stream(link), fs.createWriteStream(filePath));
    // Unzip
    await decompress(filePath, to);
    // Cleanup
    await del(filePath);
  }

  static async installTweego() {
    console.log(
      `[installer] Installing Tweego (${config.tweego.binaries.version}) for ${process.platform} ${process.arch}`
    );
    const zipLink = Installer.getTweegoZipLink();
    await Installer.downloadAndExtract(zipLink, config.tweego.dir);
  }

  static async installSugarCubeStoryFormat() {
    console.log(
      `[installer] Installing SugarCube (${config.tweego.storyFormats.sugarcube.version}) StoryFormat`
    );
    const zipLink = config.tweego.storyFormats.sugarcube.link;
    await Installer.downloadAndExtract(
      zipLink,
      [config.tweego.dir, "storyformats"].join("/")
    );
  }

  static async install() {
    await Installer.installTweego();
    await Installer.installSugarCubeStoryFormat();
    console.log(``);
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

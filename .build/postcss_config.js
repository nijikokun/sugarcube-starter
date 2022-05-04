import csso from 'postcss-csso';
import postcssPresetEnv from "postcss-preset-env";
import { config } from "./build_config.js";

export const postcssConfig = {
  loader: "postcss-loader",
  options: {
    postcssOptions: {
      plugins: [
        postcssPresetEnv(config.postcss["preset-env"]),
        csso(config.postcss.csso),
      ],
    },
  },
};

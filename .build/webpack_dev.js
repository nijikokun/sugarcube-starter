import path from "path";
import babel from "@babel/core";
import postcss from "postcss";
import { fileURLToPath } from 'url';
import { config } from "./build_config.js";
import { postcssConfig } from "./postcss_config.js";
import CopyPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import WebpackConcatenateFilesPlugin from "webpack-concat-files-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extractCSS = () =>
  new MiniCssExtractPlugin({
    filename: config.webpack.styles.output,
  });

const concatVendorFiles = () =>
  new WebpackConcatenateFilesPlugin({
    bundles: [
      {
        src: [[config.webpack.vendor.input, "**/*.js"].join("/")],
        dest: [config.webpack.output_dir, config.webpack.vendor.output_js].join(
          "/"
        ),
        transforms: {
          after: async (code) => {
            const minifiedCode = await babel.transform(code, {
              presets: [
                "@babel/preset-env",
                [
                  "minify",
                  {
                    builtIns: false,
                    evaluate: false,
                    mangle: false,
                  },
                ],
              ],
            });
            return minifiedCode.code;
          },
        },
      },
      {
        src: [[config.webpack.vendor.input, "**/*.css"].join("/")],
        dest: [
          config.webpack.output_dir,
          config.webpack.vendor.output_css,
        ].join("/"),
        transforms: {
          after: async (code) => {
            const minifiedCode = await postcss(
              postcssConfig.options.postcssOptions.plugins
            ).process(code, { from: undefined });
            return minifiedCode.css;
          },
        },
      },
    ],
  });

const copyAssets = () =>
  new CopyPlugin({
    patterns: [
      {
        from: "**/*",
        context: config.webpack.media.input,
        to: config.webpack.media.output,
        noErrorOnMissing: true,
      },
      {
        from: "**/*",
        context: config.webpack.fonts.input,
        to: config.webpack.fonts.output,
        noErrorOnMissing: true,
      },
    ],
  });

const rulesScripts = {
  test: /\.(ts)$/,
  exclude: /node_modules/,
  // here we only transpile to avoid out of memory issues
  use: [{ loader: "ts-loader", options: { transpileOnly: true } }],
};

const rulesStyles = {
  test: /\.(scss|sass|css)$/,
  use: [
    MiniCssExtractPlugin.loader,
    // only use url: false to avoid image processing issues
    { loader: "css-loader", options: { url: false } },
    postcssConfig,
    "sass-loader",
  ],
};

export const webpackConfig = {
  mode: process.env.NODE_ENV,
  entry: {
    app: path.resolve(__dirname, "..", config.webpack.app.input),
  },
  devtool: "inline-source-map",
  plugins: [extractCSS(), concatVendorFiles(), copyAssets()],
  module: {
    rules: [rulesScripts, rulesStyles],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: config.webpack.app.output,
    path: path.resolve(__dirname, "..", config.webpack.output_dir),
    clean: true,
  },
};

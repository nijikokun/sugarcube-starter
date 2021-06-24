const path = require("path");
const config = require("../config.json");
const babel = require("@babel/core");
const postcss = require("postcss");
const postcssConfig = require("./postcss.config");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackConcatPlugin = require("webpack-concat-files-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const extractCSS = () =>
  new MiniCssExtractPlugin({
    filename: config.webpack.styles.output,
  });

const concatVendorFiles = () =>
  new WebpackConcatPlugin({
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
  test: /\.(js)$/,
  exclude: /node_modules/,
  use: ["babel-loader"],
};

const rulesStyles = {
  test: /\.(scss|sass|css)$/,
  use: [
    MiniCssExtractPlugin.loader,
    "css-loader",
    postcssConfig,
    "sass-loader",
  ],
};

module.exports = {
  mode: "development",
  entry: {
    app: path.resolve(__dirname, "..", config.webpack.app.input),
  },
  devtool: "inline-source-map",
  plugins: [extractCSS(), concatVendorFiles(), copyAssets()],
  module: {
    rules: [rulesScripts, rulesStyles],
  },
  resolve: {
    extensions: [".js"],
  },
  output: {
    filename: config.webpack.app.output,
    path: path.resolve(__dirname, "..", config.webpack.output_dir),
    clean: true,
  },
};

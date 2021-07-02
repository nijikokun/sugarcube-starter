const config = require("../config.json");

module.exports = {
  loader: "postcss-loader",
  options: {
    postcssOptions: {
      plugins: [
        require("postcss-preset-env")(config.postcss["preset-env"]),
        require("postcss-csso")(config.postcss.csso),
      ],
    },
  },
};

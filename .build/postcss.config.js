const config = require("../config.json");

module.exports = {
  loader: "postcss-loader",
  options: {
    postcssOptions: {
      plugins: [
        require("postcss-font-magician")(config["postcss"]["font-magician"]),
        require("postcss-preset-env")(config["postcss"]["preset-env"]),
        require("cssnano")(config["postcss"]["cssnano"]),
      ],
    },
  },
};

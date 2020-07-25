process.env.VUE_MATGO_VERSION = require("./package.json").version;

module.exports = {
  configureWebpack: {
    devtool: "source-map"
  }
};

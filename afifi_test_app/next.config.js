const { parsed: localEnv } = require("dotenv").config();

const webpack = require("webpack");
const apiKey = JSON.stringify(process.env.SHOPIFY_API_KEY);

module.exports = {
  webpack: (config, { dev }) => {
    const env = { API_KEY: apiKey };
    config.plugins.push(new webpack.DefinePlugin(env));

    if (dev) {
      config.devtool = "cheap-module-source-map";
    }
    // Add ESM support for .mjs files in webpack 4
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });

    config.node = {
      fs: "empty",
    };

    return config;
  },
};

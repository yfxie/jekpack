const path = require('path');
const getWebpackConfigPath = require('../../lib/utils/get-webpack-config-path');
const baseConfig = require(getWebpackConfigPath('config/webpack/base.js'));
const merge = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const APP_PATH = process.env.APP_PATH || process.cwd();

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    path: path.join(APP_PATH, 'dist/assets'),
    filename: '[name]-[chunkhash].js',
  },
  plugins: [
    new OptimizeCSSAssetsPlugin({}),
  ]
});
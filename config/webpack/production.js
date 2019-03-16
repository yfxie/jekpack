const path = require('path');
const baseConfig = require('./base');
const merge = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const APP_PATH = process.env.APP_PATH || process.cwd();

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    path: path.join(APP_PATH, 'dist/assets'),
    filename: '[name]-[hash].js',
  },
  plugins: [
    new OptimizeCSSAssetsPlugin({}),
  ]
});
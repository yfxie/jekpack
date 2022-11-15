const path = require('path');
const getConfigFilePath = require(path.resolve(process.env.JEKPACK_ROOT, 'lib/utils/getConfigFilePath'));
const baseConfig = require(getConfigFilePath('config/webpack/base.js'));
const merge = require('webpack-merge');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    path: path.resolve(process.env.JEKPACK_CONTEXT, 'dist/assets'),
    filename: '[name]-[chunkhash].js',
  },
  plugins: [
    new CssMinimizerPlugin({}),
  ]
});
const webpackMerge = require('webpack-merge'); // this module must be installed by yourself.
const webpack = require('webpack');
const defaultBaseConfig = require('@bincode/jekpack/config/webpack/base');

module.exports = webpackMerge(defaultBaseConfig, {
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
    }),
  ]
});
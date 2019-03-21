const path = require('path');
const getWebpackConfigPath = require('../../lib/utils/get-webpack-config-path');
const baseConfig = require(getWebpackConfigPath('config/webpack/base.js'));
const webpack = require('webpack');
const merge = require('webpack-merge');

const APP_PATH = process.env.APP_PATH || process.cwd();
const ASSET_PATH = path.join(APP_PATH, 'src/assets');

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    path: path.join(APP_PATH, 'tmp/dist/assets'),
  },
  devServer: {
    open: true,
    hot: true,
    contentBase: path.join(APP_PATH, 'tmp/dist'),
    watchContentBase: true,
    stats: 'minimal'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    {
      apply(compiler) {
        compiler.hooks.emit.tapAsync('WatchForChangesPlugin', (compilation, callback) => {
          // watch for changes to automatic entrypoints
          compilation.contextDependencies.add(ASSET_PATH);
          callback();
        });
      },
    }
  ]
});
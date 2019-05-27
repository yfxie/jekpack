const path = require('path');
const getConfigFilePath = require(path.resolve(process.env.JEKPACK_ROOT, 'lib/utils/getConfigFilePath'));
const baseConfig = require(getConfigFilePath('config/webpack/base.js'));
const webpack = require('webpack');
const merge = require('webpack-merge');

const ASSET_PATH = path.resolve(process.env.JEKPACK_CONTEXT, 'src/assets');

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(process.env.JEKPACK_CONTEXT, 'tmp/dist/assets'),
  },
  devServer: {
    hot: true,
    contentBase: path.join(process.env.JEKPACK_CONTEXT, 'tmp/dist'),
    watchContentBase: true,
    stats: {
      all: false,
      timings: true,
      errors: true,
    }
  },
  plugins: [
    {
      apply(compiler) {
        compiler.hooks.emit.tapAsync('WatchForChangesPlugin', (compilation, callback) => {
          // watch for changes to automatic entrypoints
          compilation.contextDependencies.add(ASSET_PATH);
          callback();
        });
      },
    }
  ],
  watchOptions: {
    ignored: /manifest\.json/
  },

});
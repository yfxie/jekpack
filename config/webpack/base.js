const path = require('path');
const glob = require('glob');

const getConfigFilePath = require(path.resolve(process.env.JEKPACK_ROOT, 'lib/utils/getConfigFilePath'));
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const ASSET_PATH = path.join(process.env.JEKPACK_CONTEXT, 'src/assets');


const devMode = process.env.NODE_ENV !== 'production';

const entryGenerator = () => {
  const pageEntries = glob.sync('**/main.{js,scss}', {
    cwd: ASSET_PATH,
  }).reduce((output, path) => {
    output[path.replace(/\.(js|scss)$/g, '')] = path;
    return output;
  }, {});

  return {
    ...pageEntries,
  }
};

module.exports = {
  context: process.env.JEKPACK_ROOT,
  entry: entryGenerator,
  output: {
    publicPath: '/assets/',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          devMode ? 'style-loader' : MiniCSSExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: path.dirname(getConfigFilePath('postcss.config.js')),
              }
            }
          },
          { loader: 'sass-loader', options: { includePaths: [path.join(ASSET_PATH, 'stylesheets')] } },
        ]
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'images/[name].[hash:8].[ext]',
              limit: 4096,
            },
          },
        ]
      },
    ]
  },
  resolve: {
    modules: [
      ASSET_PATH,
      path.resolve(process.env.JEKPACK_CONTEXT, 'node_modules'),
      path.resolve(process.env.JEKPACK_ROOT, 'node_modules'),
    ],
  },
  plugins: [
    new FixStyleOnlyEntriesPlugin(),
    new MiniCSSExtractPlugin({
      filename: '[name]-[chunkhash].css',
    }),
    new WebpackAssetsManifest({
      writeToDisk: true,
      publicPath: true,
    }),
  ],
};
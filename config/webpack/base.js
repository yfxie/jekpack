const path = require('path');
const glob = require('glob');
const devMode = process.env.NODE_ENV !== 'production';

const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const APP_PATH = process.env.APP_PATH || process.cwd();
const ASSET_PATH = path.join(APP_PATH, 'src/assets');
const JEKPACK_PATH = path.join(__dirname, '../..');

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
  context: JEKPACK_PATH,
  entry: entryGenerator,
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          devMode ? 'style-loader' : MiniCSSExtractPlugin.loader,
          'css-loader',
          { loader: 'postcss-loader', options: { config: { path: JEKPACK_PATH } } },
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'assets/images/[name].[hash:8].[ext]',
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
      path.resolve(JEKPACK_PATH, 'node_modules'),
      path.resolve(APP_PATH, 'node_modules'),
    ],
  },
  plugins: [
    new FixStyleOnlyEntriesPlugin(),
    new MiniCSSExtractPlugin({
      filename: '[name]-[hash].css',
    }),
    new WebpackAssetsManifest({
      writeToDisk: true,
    }),
  ],
};
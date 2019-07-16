const path = require('path');
const glob = require('glob');

const getConfigFilePath = require(path.resolve(process.env.JEKPACK_ROOT, 'lib/utils/getConfigFilePath'));
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const ASSET_PATH = path.join(process.env.JEKPACK_CONTEXT, 'src/assets');
const CopyPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

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
        test: /\.(sa|sc|c)ss$/,
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
        test: /\.(jpg|jpeg|png|gif|tiff|ico|svg|eot|otf|ttf|woff|woff2)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'media/[name].[hash:8].[ext]',
            }
          }
        ]
      }
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
    new ManifestPlugin({
      writeToFileEmit: true,
      map: (file) => {
        file.name = file.name.replace(/(\.[a-f0-9]{32})(\..*)$/, '$2');
        return file;
      },
    }),
    new CopyPlugin([
      {
        from: path.resolve(ASSET_PATH, 'media'),
        to: 'media/[name].[hash].[ext]',
        toType: 'template',
      },
    ], {
      // always copy for solving the issue of missing assets in manifest after rebuilding
      copyUnmodified: true,
      ignore: [
        '.DS_Store',
        '.gitkeep',
        '.keep'
      ]
    }),
    new MiniCSSExtractPlugin({
      filename: '[name]-[chunkhash].css',
    }),
  ],
};
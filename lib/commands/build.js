const ora = require('ora');
const chalk = require('chalk');
const webpack = require('webpack');
const rm = require('rimraf');
const commands = require('./index');
const path = require('path');
const getConfigFilePath = require('../utils/getConfigFilePath');


module.exports = async(sourcePath, destPath, args) => {
  process.env.NODE_ENV = 'production';
  process.env.JEKPACK_MANIFEST_PATH = path.resolve(destPath, 'assets/manifest.json');

  const webpackConfig = require(getConfigFilePath('config/webpack/production.js'));
  const spinner = ora('building for production...');

  spinner.start();

  await new Promise(resolve => rm(destPath, err => {
    if (err) throw err;
    resolve();
  }));

  await new Promise(resolve => webpack(webpackConfig, (err, stats) => {
    if (err) throw err;
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n');
    resolve();
  }));

  await commands.jekyll(sourcePath, destPath);

  console.log(chalk.cyan('  Build complete.\n'));
  spinner.stop();
};


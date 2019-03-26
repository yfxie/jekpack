const ora = require('ora');
const chalk = require('chalk');
const webpack = require('webpack');
const execa = require('execa');
const rm = require('rimraf');
const commands = require('./index');
const path = require('path');


module.exports = (sourcePath, destPath, args) => {
  process.env.NODE_ENV = 'production';
  process.env.JEKPACK_MANIFEST_PATH = path.join(destPath, 'assets/manifest.json');

  const spinner = ora('building for production...');
  spinner.start();

  const getConfigFilePath = require('../utils/getConfigFilePath');
  const webpackConfig = require(getConfigFilePath('config/webpack/production.js'));


  rm(destPath, err => {
    if (err) throw err;

    webpack(webpackConfig, (err, stats) => {
      spinner.stop();
      if (err) throw err;
      process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n');

      console.log(chalk.cyan('  Build complete.\n'));
      commands.jekyll(sourcePath, destPath);

    })
  });
};



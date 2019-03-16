process.env.NODE_ENV = 'production';

const ora = require('ora');
const chalk = require('chalk');
const webpack = require('webpack');
const rm = require('rimraf');
const path = require('path');

const getWebpackConfigPath = require('../lib/utils/get-webpack-config-path');
const webpackConfig = require(getWebpackConfigPath('config/webpack/production.js'));
const spinner = ora('building for production...');
const { execSync } = require('child_process');

const APP_PATH = process.env.APP_PATH || process.cwd();
const DIST_PATH = path.join(APP_PATH, 'dist');
const SOURCE_PATH = path.join(APP_PATH, 'src');
const TMP_DIST_PATH = path.join(APP_PATH, 'tmp/dist');
const JEKPACK_PATH = path.join(__dirname, '..');

const JEKYLL_DIST_PATH = path.join(APP_PATH, 'tmp/dist');
spinner.start();

rm(DIST_PATH, err => {
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


    try {
      execSync(`JEKYLL_ENV=production bundle exec jekyll build -s ${SOURCE_PATH} -d ${TMP_DIST_PATH} --config config/jekyll.yml`, {
        cwd: JEKPACK_PATH,
        stdio: 'inherit'
      });
      execSync(`cp -r ${JEKYLL_DIST_PATH}/ ${DIST_PATH}/`, {
        cwd: APP_PATH,
      });
    } catch (e) {
      process.exit(1);
    }

  })
});

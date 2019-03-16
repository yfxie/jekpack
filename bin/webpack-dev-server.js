#!/usr/bin/env node
const path = require('path');
const execSync = require('child_process').execSync;
const getWebpackConfigPath = require('../lib/utils/get-webpack-config-path');
const APP_PATH = process.cwd();
const JEKPACK_PATH = path.join(__dirname, '..');

const configPath = getWebpackConfigPath('config/webpack/development.js');

try {
  execSync(`APP_PATH=${APP_PATH} npx webpack-dev-server --config ${configPath} --disableHostCheck=true`, {
    cwd: JEKPACK_PATH,
    stdio: 'inherit'
  });
} catch (e) {
  process.exit(1);
}

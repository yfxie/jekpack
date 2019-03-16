#!/usr/bin/env node
const program = require('commander');
const concurrently = require('concurrently');
const path = require('path');
const execSync = require('child_process').execSync;
const JEKPACK_PATH = path.join(__dirname, '..');
const APP_PATH = process.cwd();

program
  .command('dev')
  .action(() => {
    concurrently([
      `node ${path.join(JEKPACK_PATH, 'bin/webpack-dev-server.js')}`,
      `node ${path.join(JEKPACK_PATH, 'bin/jekyll-watch.js')}`
    ],{
      prefix: 'jekpack',
      killOthers: ['failure', 'success'],
    }).then(() => {

    }, () => {

    });

  });
program
  .command('jekyll')
  .action(() => {
    execSync(`node ${path.join(JEKPACK_PATH, 'bin/jekyll-watch.js')}`, {
      stdio: 'inherit'
    });
  });

program
  .command('build')
  .action(() => {
    execSync(`APP_PATH=${APP_PATH} node bin/build.js`, {
      cwd: JEKPACK_PATH,
      stdio: 'inherit'
    });
  });
program.parse(process.argv);
#!/usr/bin/env node
const program = require('commander');
const concurrently = require('concurrently');
const path = require('path');
const execSync = require('child_process').execSync;
const JEKPACK_PATH = path.join(__dirname, '..');
const APP_PATH = process.cwd();
const s3EasyDeploy = require('s3-easy-deploy');

require('dotenv').config({ path: path.resolve(APP_PATH, '.env') });

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

program
  .command('deploy <bucket>')
  .description('deploy the distribution to s3 bucket')
  .option('-p, --private', 'upload files with private ACL')
  .option('--cloud-front-id <cloudFrontId>', 'The CloudFront distribution id')
  .action((bucket, options)=> {
    const config = {
      bucket,
      concurrentRequests: 30,
      publicRoot: path.join(APP_PATH, 'dist'),
    };
    if (options.private) {
      config.acl = 'private';
    }
    if (options.cloudFrontId) {
      config.cloudFrontId = options.cloudFrontId;
    }
    s3EasyDeploy.deploy(config);
  });

program.parse(process.argv);
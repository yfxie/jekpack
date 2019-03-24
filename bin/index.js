#!/usr/bin/env node
const program = require('commander');
const concurrently = require('concurrently');
const path = require('path');
const execSync = require('child_process').execSync;
const JEKPACK_PATH = path.join(__dirname, '..');
const APP_PATH = process.cwd();
const s3EasyDeploy = require('s3-easy-deploy');
const commands = require('../lib/commands');

process.env.JEKPACK_CONTEXT = process.cwd();
process.env.JEKPACK_ROOT = JEKPACK_PATH;

require('dotenv').config({ path: path.resolve(APP_PATH, '.env') });

program
  .command('new <project-name>')
  .action(projectName => {
    commands.new(projectName);
  });

program
  .command('dev')
  .action(() => {
    concurrently([
      { name: 'jekyll', command: `jekpack jekyll --watch`, prefixColor: 'blue'},
      { name: 'webpack-dev-server', command: `node ${path.join(JEKPACK_PATH, 'bin/webpack-dev-server.js')}`, prefixColor: 'green'},
    ],{
      killOthers: ['failure', 'success'],
    }).then(() => {
    }, () => {
    });
  });

program
  .command('jekyll')
  .option('-s, --source-path [path]', 'source path', path.join(process.env.JEKPACK_CONTEXT, 'src'))
  .option('-d, --dest-path [path]', 'destination path', path.join(process.env.JEKPACK_CONTEXT, 'tmp/dist'))
  .option('--watch', 'watch mode')
  .action((options) => {
    commands.jekyll(options.sourcePath, options.destPath, options);
  });

program
  .command('build')
  .option('-s, --source-path [path]', 'source path', path.join(process.env.JEKPACK_CONTEXT, 'src'))
  .option('-d, --dest-path [path]', 'destination path', path.join(process.env.JEKPACK_CONTEXT, 'dist'))
  .action((options) => {
    commands.build(options.sourcePath, options.destPath, options);
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
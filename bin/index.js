#!/usr/bin/env node
const program = require('commander');
const concurrently = require('concurrently');
const path = require('path');
const s3EasyDeploy = require('s3-easy-deploy');
const getConfigFilePath = require('../lib/utils/getConfigFilePath');
const commands = require('../lib/commands');
const fs = require('fs-extra');
const pkg = require('../package');

process.env.JEKPACK_CONTEXT = process.cwd();
process.env.JEKPACK_ROOT =  path.join(__dirname, '..');

require('dotenv').config({ path: path.resolve(process.env.JEKPACK_CONTEXT, '.env') });

program
  .version(pkg.version);

program
  .command('new <project-name>')
  .option('--force', 'Overwriting if the project directory already exists.')
  .action((projectName, options) => {
    const _options = { force: options.force };
    commands.new(projectName, _options);
  });

program
  .command('dev')
  .option('-s, --source-path <path>', 'source path', 'src')
  .option('-d, --dest-path <path>', 'destination path', 'tmp/dist')
  .action((options) => {
    const sourcePath = path.resolve(process.env.JEKPACK_CONTEXT, options.sourcePath);
    const destPath = path.resolve(process.env.JEKPACK_CONTEXT, options.destPath);

    fs.removeSync(destPath);

    return concurrently([
      { name: 'jekyll', command: `jekpack jekyll -s ${sourcePath} -d ${destPath} --watch`, prefixColor: 'blue'},
      { name: 'webpack-dev-server', command: `jekpack webpack-dev-server`, prefixColor: 'green' },
    ],{
      killOthers: ['failure', 'success'],
    }).catch((e) => {
      process.exit(1);
    });
  });

program
  .command('jekyll')
  .option('-s, --source-path <path>', 'source path', 'src')
  .option('-d, --dest-path <path>', 'destination path', 'tmp/dist')
  .option('-w, --watch', 'watch mode',false)
  .action((options) => {
    const _options = { watch: Boolean(options.watch) };
    const sourcePath = path.resolve(process.env.JEKPACK_CONTEXT, options.sourcePath);
    const destPath = path.resolve(process.env.JEKPACK_CONTEXT, options.destPath);
    commands.jekyll(sourcePath, destPath, _options);
  });

program
  .command('webpack-dev-server')
  .option('-c, --config <path>', 'config')
  .action((options) => {
    const configPath = options.config ?
      path.resolve(process.env.JEKPACK_CONTEXT, options.config) :
      getConfigFilePath('config/webpack/development.js');
    commands.webpackDevServer(configPath);
  });

program
  .command('build')
  .option('-s, --source-path <path>', 'source path', 'src')
  .option('-d, --dest-path <path>', 'destination path', 'dist')
  .action((options) => {
    const _options = {};
    const sourcePath = path.resolve(process.env.JEKPACK_CONTEXT, options.sourcePath);
    const destPath = path.resolve(process.env.JEKPACK_CONTEXT, options.destPath);
    commands.build(sourcePath, destPath, _options);
  });

program
  .command('deploy <bucket>')
  .description('deploy the distribution to s3 bucket')
  .option('-d, --destination <directory>', 'The destination directory to be uploaded', 'dist')
  .option('-a, --acl <acl>', 'Upload files with specified ACL')
  .option('--cloud-front-id <cloudFrontId>', 'The CloudFront distribution id')
  .option('-r, --redirect-rules <redirectRules>', 'The path of json file with redirect rules. the json file is an array with { key, to }.')
  .action((bucket, options)=> {
    const publicRoot = path.resolve(process.env.JEKPACK_CONTEXT, options.destination);
    const config = {
      bucket,
      concurrentRequests: 30,
      publicRoot,
      ...(options.acl ? { acl: options.acl } : {}),
      ...(options.cloudFrontId ? { cloudFrontId: options.cloudFrontId } : {}),
    };
    s3EasyDeploy.deploy(config).then(() => {
      if (options.redirectRules) {
        const filePath = path.resolve(process.env.JEKPACK_CONTEXT, options.redirectRules);
        return commands.deployRedirectRules(bucket, filePath);
      }
    });
  });

program
  .command('check')
  .description('Verifies that the dependencies required by jekpack are installed.')
  .action(() => {
    commands.check();
  });

program
  .command('bundle')
  .description('Install the ruby dependencies.')
  .action(() => {
    commands.bundle();
  });

program.parse(process.argv);

module.exports = program;
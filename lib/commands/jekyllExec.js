const execa = require('execa');
const path = require('path');
const fs = require('fs-extra');

const genJekyllConfig = require('../utils/genJekyllConfig');

const cmdRequireConfig = [
  'build', 'b',
  'serve', 'server', 's',
  'clean',
];

module.exports = async(args, options = {}) => {
  const jekyllCMD = args[0];
  const requireConfig = cmdRequireConfig.includes(jekyllCMD) || options.requireConfig;

  const configPath = 'config/jekyll.yml';
  const defaultConfigPath = path.resolve(process.env.JEKPACK_ROOT, configPath);
  const hostConfigPath = path.resolve(process.env.JEKPACK_CONTEXT || process.cwd(), configPath);
  const hostGemfileExists = fs.existsSync(path.resolve(process.env.JEKPACK_CONTEXT, 'Gemfile'));
  const configDest = path.resolve(process.env.JEKPACK_CONTEXT, 'tmp/jekyll.yml');

  // build merged config
  const content = await genJekyllConfig(defaultConfigPath, hostConfigPath);
  await fs.mkdir(path.resolve(process.env.JEKPACK_CONTEXT, 'tmp'), { recursive: true });
  await fs.writeFile(configDest, content);


  try {
    await execa('bundle', [
      'exec',
      'jekyll',
      ...args,
      ...(requireConfig ? ['-c', [configDest, fs.existsSync(hostConfigPath) ? hostConfigPath : ''].filter(Boolean).join(',')] : []),
      '--trace',
    ], {
      cwd: hostGemfileExists ? process.env.JEKPACK_CONTEXT : process.env.JEKPACK_ROOT,
      stdio: 'inherit'
    });
  } catch (e) {
    process.exit(1);
  }
};
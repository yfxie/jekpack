const execa = require('execa');
const path = require('path');
const fs = require('fs');

module.exports = async(sourcePath, destPath, args = {}) => {
  const configPath = 'config/jekyll.yml';
  const defaultConfigPath = path.resolve(process.env.JEKPACK_ROOT, configPath);
  const hostConfigPath = path.resolve(process.env.JEKPACK_CONTEXT || process.cwd(), configPath);
  const hostGemfileExists = fs.existsSync(path.resolve(process.env.JEKPACK_CONTEXT, 'Gemfile'));

  try {
    await execa('bundle', [
      'exec',
      'jekyll',
      'build',
      ...(args.watch ? ['--watch'] : []),
      ...['-s', sourcePath],
      ...['-d', destPath],
      ...['-c', [defaultConfigPath, fs.existsSync(hostConfigPath) ? hostConfigPath : ''].filter(Boolean).join(',')],
    ], {
      cwd: hostGemfileExists ? process.env.JEKPACK_CONTEXT : process.env.JEKPACK_ROOT,
      stdio: 'inherit'
    });
  } catch (e) {
    process.exit(1);
  }
};
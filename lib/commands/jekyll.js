const execa = require('execa');
const path = require('path');
const fs = require('fs');

module.exports = (sourcePath, destPath, args = {}) => {
  const configPath = 'config/jekyll.yml';
  const hostConfigPath = path.resolve(process.env.JEKPACK_CONTEXT || process.cwd(), configPath);

  try {
    execa('bundle', [
      'exec',
      'jekyll',
      'build',
      ...(args.watch ? ['--watch'] : []),
      ...['-s', sourcePath],
      ...['-d', destPath],
      ...['-c', [configPath, fs.existsSync(hostConfigPath) ? hostConfigPath : ''].filter(Boolean).join(',')],
    ], {
      cwd: process.env.JEKPACK_ROOT,
      stdio: 'inherit'
    });
  } catch (e) {
    process.exit(1);
  }
};
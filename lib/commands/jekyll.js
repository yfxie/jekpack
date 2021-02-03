const jekyllExec = require('./jekyllExec');

module.exports = async(sourcePath, destPath, args = {}) => {
  await jekyllExec([
    'build',
    ...['-s', sourcePath],
    ...['-d', destPath],
    ...(args.watch ? ['--watch'] : []),
  ], {});
};
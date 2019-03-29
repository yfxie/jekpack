const path = require('path');
const execa = require('execa');

module.exports = (projectName, options = {}) => {
  options = {
    force: true,
    cwd: path.resolve(process.env.JEKPACK_ROOT, '__tests__/tmp'),
    ...options
  };

  const projectRoot = path.resolve(options.cwd, projectName);
  const binPath = require.resolve(path.resolve(process.env.JEKPACK_ROOT, 'bin'));

  const execute = (command, args = [], options = {}) => execa(command, args, { cwd: projectRoot, ...options });

  return execa(binPath, [
    'new',
    projectName,
    ...(options.force ? ['--force'] : []),
  ], {
    cwd: options.cwd,
    stdio: 'inherit'
  }).then(() =>
    ({
      execute,
      projectRoot,
      src: path.resolve(projectRoot, 'src'),
      dist: path.resolve(projectRoot, 'dist'),
    })
  );
};
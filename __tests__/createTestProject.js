const path = require('path');
const execa = require('execa');

module.exports = (projectName, cwd) => {
  const projectRoot = path.resolve(cwd, name);
  const binPath = require.resolve('jekpack/bin');

  return execa(binPath, [
    'create',
    projectName,
  ], {
    cwd,
    stdio: 'inherit'
  });
};
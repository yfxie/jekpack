const execa = require('execa');

module.exports = dir => {
  let hasYarn;
  try {
    execa('yarn --version', [], { stdio: 'ignore' });
    hasYarn = true;
  } catch (e) {
    hasYarn = false;
  }

  const command = hasYarn ? 'yarn' : 'npm';
  const args = hasYarn ? [] : ['install'];
  execa(command, args, {
    cwd: dir,
    stdio: 'inherit'
  });

};
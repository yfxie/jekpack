const execa = require('execa');

module.exports = (configPath, args = {}) => {
  try {
    execa('webpack-dev-server', [
      ...['--config', configPath],
      ...['--disableHostCheck', 'true'],
    ], {
      cwd: process.env.JEKPACK_CONTEXT,
      stdio: 'inherit',
    });
  } catch (e) {
    process.exit(1);
  }
};
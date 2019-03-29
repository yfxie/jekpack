const execa = require('execa');

module.exports = async(versionCmd) => {
  try {
    const [cmd, ...args] = versionCmd.split(' ');
    const { stdout } = await execa(cmd, args);
    return stdout;
  } catch (e) {
    return '';
  }
};

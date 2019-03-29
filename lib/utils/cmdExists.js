const commandExistsSync = require('command-exists').sync;
const execa = require('execa');

module.exports = async(cmd) => {
  const [_cmd, ...args] = cmd.split(' ');
  if (args.length) {
    try {
      await execa(_cmd, args);
      return true;
    } catch (e) {
      return false;
    }
  } else {
    return commandExistsSync(_cmd);
  }
};
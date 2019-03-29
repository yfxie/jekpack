const path = require('path');
const fs = require('fs-extra');
const execa = require('execa');
const check = require('./check');
const chalk = require('chalk');

module.exports = async() => {
  const hostGemfileExists = fs.existsSync(path.resolve(process.env.JEKPACK_CONTEXT, 'Gemfile'));

  const checkPass = await check({ checkList: ['Ruby', 'Bundler'] });

  if (!checkPass) {
    return console.log(
      chalk.red.bold('  All dependencies described above must be installed.'),
    )
  }

  try {
    await execa('bundle', [], {
      cwd: hostGemfileExists ? process.env.JEKPACK_CONTEXT : process.env.JEKPACK_ROOT,
      stdio: 'inherit'
    });
    console.log(
      chalk.green.bold('All dependencies get ready!\n'),
      chalk.green.bold('🚀 start dev server:\n'), chalk.cyan.bold('    jekpack dev')
    )
  } catch (e) {
    process.exit(1);
  }
};
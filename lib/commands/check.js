const chalk = require('chalk');
const cmdExists = require('../utils/cmdExists');
const getCmdVersion = require('../utils/getCmdVersion');

const dependencies = [
  {
    name: 'Ruby',
    cmd: 'ruby',
    versionCmd: 'ruby -v',
    hint: '$ \\curl -sSL https://get.rvm.io | bash -s stable --ruby',
  },
  {
    name: 'Bundler',
    cmd: 'bundle',
    versionCmd: 'bundle -v',
    hint: '# you must install ruby first.\n$ gem install bundler'
  },
  {
    name: 'Jekyll',
    cmd: 'bundle show jekyll',
    versionCmd: 'bundle exec jekyll -v',
    hint: '$ jekpack bundle'
  }
];

module.exports = async(options = {}) => {
  options = {
    verbose: true,
    checkList: dependencies.map(d => d.name),
    ...options
  };
  const _dependencies = options.checkList.map(name => dependencies.find(d => d.name === name));

  return await Promise.all(
    _dependencies.map(async(dependency) => {
      const pass = await cmdExists(dependency.cmd);

      if (options.verbose) {
        const version = pass ? (await getCmdVersion(dependency.versionCmd)) : '';
        const theChalk = pass ? chalk.green.bold : chalk.red.bold;
        console.log(`${
          theChalk(
            '',
            pass ? '✅' : '❌',
            '',
            dependency.name,
            ...(version ? ['-', version] : []),
          )}`
        );

        if (!pass) {
          console.log('    install the dependency via:');
          console.log(
            chalk.cyan(
              dependency.hint.split("\n").map(message => `    ${message}`).join("\n")
            )
          );
        }
      }

      return pass;
    })
  ).then(results => results.every(Boolean));
};
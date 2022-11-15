const path = require('path');
const fs = require('fs-extra');
const semver = require('semver');
const inquirer = require('inquirer');
const chalk = require('chalk');
const writeFiles = require('../utils/writeFiles');
const installDependencies = require('../utils/installDependencies');
const {option} = require("commander");

const link = (src, dest) => {
  fs.ensureDirSync(path.dirname(dest));
  fs.symlink(src, dest)
};

const getLatestMinor = () => {
  const version = require(path.join(process.env.JEKPACK_ROOT, 'package.json')).version;
  return `${semver.major(version)}.${semver.minor(version)}.0`;
};

const resolveGenerators = generators => Object.keys(generators).map(id =>
  ({
    id,
    apply: require(
      require.resolve(`./generator/${id}`, {
        paths: [process.env.JEKPACK_ROOT]
      }),
    ),
    options: generators[id],
  })
);

module.exports = async(projectName, options = {}) => {
  options = {
    cwd: process.env.JEKPACK_CONTEXT,
    ...options
  };

  const isTest = process.env.JEKPACK_TEST;
  const projectRoot = path.resolve(options.cwd, projectName);
  const files = {};

  if (fs.existsSync(projectRoot)) {
    if (options.force) {
      await fs.remove(projectRoot);
    } else {
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: `${chalk.green(projectRoot)} already exists:`,
          choices: [
            { name: 'Overwrite', value: 'overwrite' },
            { name: 'Cancel', value: false }
          ]
        }
      ]);
      switch(action) {
        case 'overwrite':
          await fs.remove(projectRoot);
          break;
        default:
          return;
      }
    }
  }

  const generators = {
    skeleton: {
      templateData: {
        projectName
      },
    }
  };

  resolveGenerators(generators).forEach(({ id, apply, options }) => {
    apply({ files, options });
  });

  writeFiles(projectRoot, files);

  const pkg = {
    name: projectName,
    version: '1.0.0',
    private: true,
    devDependencies: {
      '@bincode/jekpack': `^${getLatestMinor()}`,
    },
    scripts: {
      dev: 'jekpack dev',
      build: 'jekpack build',
      bundle: 'jekpack bundle'
    }
  };

  writeFiles(projectRoot, {
    'package.json': JSON.stringify(pkg, null, 2)
  });

  if (isTest) {
    link(require.resolve(path.resolve(process.env.JEKPACK_ROOT, 'bin')), path.join(projectRoot, 'node_modules', '.bin', 'jekpack'));
  } else {
    if (!options.skipNpmInstall) {
      installDependencies(projectRoot);
    }
  }
};



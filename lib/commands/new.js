const path = require('path');
const fs = require('fs-extra');
const semver = require('semver');
const inquirer = require('inquirer');
const chalk = require('chalk');
const writeFiles = require('../utils/writeFiles');
const installDependencies = require('../utils/installDependencies');

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

const writeFiles = (dir, files) => {
  Object.keys(files).forEach(rawPath => {
    const filePath = path.join(dir, rawPath);
    fs.ensureDirSync(path.dirname(filePath));
    fs.writeFileSync(filePath, files[rawPath]);
  });
};

const installDependencies = (dir) => {
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

module.exports = (projectName) => {
  const isTest = process.env.JEKPACK_TEST;
  const projectRoot = path.resolve(process.cwd(), projectName);
  const files = {};

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
  };

  writeFiles(projectRoot, {
    'package.json': JSON.stringify(pkg, null, 2)
  });

  if (isTest) {
    link(require.resolve(path.resolve(process.env.JEKPACK_ROOT, 'bin')), path.join(projectRoot, 'node_modules', '.bin', 'jekpack'));
  } else {
    installDependencies(projectRoot);
  }
};



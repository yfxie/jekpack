const path = require('path');
const execa = require('execa');
const fs = require('fs-extra');

module.exports = (projectName, options = {}) => {
  options = {
    force: true,
    cwd: path.resolve(process.env.JEKPACK_ROOT, '__tests__/tmp'),
    ...options
  };

  const projectRoot = path.resolve(options.cwd, projectName);
  const binPath = require.resolve(path.resolve(process.env.JEKPACK_ROOT, 'bin'));

  const resolve = _path => path.resolve(projectRoot, _path);
  const src = resolve('src');
  const dist = resolve('dist');
  const tmpDist = resolve('tmp/dist');

  const execute = (command, args = [], options = {}) => execa(command, args, { cwd: projectRoot, ...options });
  const clearDist = () => {
    fs.removeSync(dist);
    fs.removeSync(tmpDist);
  };
  const readFile = file => fs.readFileSync(resolve(file), 'utf8');
  const exists = file => fs.existsSync(resolve(file));
  const write = (file, content) => {
    const filePath = resolve(file);
    fs.ensureDirSync(path.dirname(filePath));
    fs.writeFileSync(filePath, content);
  };

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
      src,
      dist,
      resolve,
      tmpDist,
      clearDist,
      readFile,
      write,
      exists
    })
  );
};
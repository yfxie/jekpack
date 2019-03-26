const path = require('path');
const globby = require('globby');
const ejs = require('ejs');
const fs = require('fs');

module.exports = ({ files, options }) => {
  const source = path.join(__dirname, 'template');
  const _files = globby.sync(['**/*'], {
    cwd: source,
  });

  for (const rawPath of _files) {
    const sourcePath = path.resolve(source, rawPath);
    const template = fs.readFileSync(sourcePath, 'utf-8');
    files[rawPath] = ejs.render(template, options.templateData);
  }
};
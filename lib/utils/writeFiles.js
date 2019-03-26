const fs = require('fs-extra');
const path = require('path');

module.exports = (dir, files) => {
  Object.keys(files).forEach(rawPath => {
    const filePath = path.join(dir, rawPath);
    fs.ensureDirSync(path.dirname(filePath));
    fs.writeFileSync(filePath, files[rawPath]);
  });
};
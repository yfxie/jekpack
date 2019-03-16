const fs = require('fs');
const path = require('path');
const APP_PATH = process.env.APP_PATH || process.cwd();
const JEKPACK_PATH = path.join(__dirname, '../..');

module.exports = (configPath) => {
  const hostPath = path.join(APP_PATH, configPath);
  const myPath = path.join(JEKPACK_PATH, configPath);
  if (fs.existsSync(hostPath)) {
    return hostPath;
  } else {
    return myPath;
  }
};
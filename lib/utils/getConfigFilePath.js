const fs = require('fs');
const path = require('path');

module.exports = (configPath) => {
  const hostPath = path.join(process.env.JEKPACK_CONTEXT, configPath);
  const myPath = path.join(process.env.JEKPACK_ROOT, configPath);
  if (fs.existsSync(hostPath)) {
    return hostPath;
  } else {
    return myPath;
  }
};
const jsYaml = require('js-yaml');
const fs = require('fs-extra');
const path = require('path');

module.exports = async(defaultConfigPath, hostConfigPath) => {
  const defaultConfig = jsYaml.load(await fs.readFile(defaultConfigPath));
  defaultConfig.plugins_dir = path.resolve(process.env.JEKPACK_ROOT, defaultConfig.plugins_dir);

  if (fs.existsSync(hostConfigPath)) {
    // Todo: provide a way to merge host and default config(override or merge)
    // for now, using jekyll -c config1 config2 as alternative way
  }

  return jsYaml.dump(defaultConfig);
};
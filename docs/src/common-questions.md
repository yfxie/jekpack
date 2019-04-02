---
layout: default
page_name: Common Questions
---

**Have any example built with Jekpack?**

The documentation site you are reading is built with Jekpack. see [the source code](https://github.com/yfxie/jekpack/tree/master/docs).

**How can I include the output CSS and JS files?**

As previously mentioned, only files named `main.js` or `main.scss` will be considered entry files. 
Follow this convention, unnecessary chunks will not be compiled and it's obvious to know which files are entrypoints.
In HTML, you can use the syntax like {% raw %}`{% asset_tag some/js/file.css %}`{% endraw %}, then Jekyll will parse it to correspond result.

You might ask a question, why `<script src="..."></script>` will be the output for CSS files.
A simple answer is to keep the Webpack HRM function working fine. When you build distribution, the result will turn to `<link rel="stylesheet" href="..."/>`.  


**What is the `src/assets/media` folder?**

This folder is prepared for static assets like images.
Assume you have an image located at `src/assets/media/jekpack.jpg`.
In HTML, {% raw %}{% asset_path jekpack.jpg %}{% endraw %} will return the output path of the image.
If you want to refer it in `.scss` files, see:
```scss
body {
  background: url(~media/jekpack.jpg);
}
```

**How can I customize Webpack config?**

Just create the config files with the same path:
`config/webpack/base.js`,
`config/webpack/development.js`,
`config/webpack/production.js`.
For each of them, return the config object with webpack specs.

This example describes how to extend from the default config:
```js
// hello-world/config/webpack/base.js
const webpackMerge = require('webpack-merge'); // this module must be installed by yourself.
const webpack = require('jekpack/node_modules/webpack');
const defaultBaseConfig = require('jekpack/config/webpack/base');
 
module.exports = webpackMerge(config, {
  plugins: [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
    }),
  ]
});
```

**How can I customize Jekyll config**

Just create the config file at `config/jekyll.yml`.
Jekpack will load both default and your configs at the same time.

Any question not mentioned above? [Open an issue](https://github.com/yfxie/jekpack/issues).


# Jekpack [![npm version](https://badge.fury.io/js/%40bincode%2Fjekpack.svg)](https://badge.fury.io/js/%40bincode%2Fjekpack) [![Build Status](https://travis-ci.org/yfxie/jekpack.svg?branch=master)](https://travis-ci.org/yfxie/jekpack) [![codecov](https://codecov.io/gh/yfxie/jekpack/branch/master/graph/badge.svg)](https://codecov.io/gh/yfxie/jekpack)

[Jekyll](https://jekyllrb.com/) is a powerful tool for static sites and 
[Webpack](https://webpack.js.org/) is the first choice to pack assets. 
**Jekpack** is the integration of Jekyll and Webpack to make them work together.

Jekpack is for multi pages static sites. 
If you prefer the SPA(single page application), 
Webpack + HtmlWebpackPlugin might be another better choice.

Why
---

**Zero config**

The Jekpack works without configuration. 
The default config is good enough to build common static sites.
  
**Clean Project**

We made your project tree as clean as possible. 
The minimal file tree might look like the following:

```
├── src             
│   ├── _includes   <= Jekyll includes folder
│   ├── _layouts    <= Jekyll layouts folder
│   ├── assets      <= Webpack is responsible to this folder
│   └── index.html
├── node_modules
├── package.json
└── yarn.lock
```

**Flexible**

the default config for both Jekyll and Webpack all can be modified(see the example).

**Deploy**

Yes. The function of deployment is also in this pack for you.
By the one command `jekpack deploy <s3 bucket>`, the dist will be deployed to the AWS S3 bucket.

Getting Started
---

**Install**

```
$ npm install -g @bincode/jekpack # or yarn global add @bincode/jekpack
```

**Create a project**

```
$ jekpack new hello-world
```

**Install the dependencies**

```
$ cd hello-world
$ jekpack bundle
``` 

**Start Dev Servers**

```
$ jekpack dev
```

Jekyll and Webpack are working together now.
All you need to know is only follow the Jekyll rules to code everything inside the src folder.
Read [Jekyll Documentation](https://jekyllrb.com/docs/pages/) for more details, if you are not familiar with it.

All files located at `assets` folder are managed by webpack.
For all files named `main.js`(inside assets/javascripts) and 
`main.scss`(inside assets/stylesheets) will be considered as entry files,
these files will be pack via webpack. 
In HTML, include these files via `{% asset_tag main.css %}`, `{% asset_tag main.js%}`.
For example, a file located at `src/assets/stylesheets/some/page/main.scss` can be included via `{% asset_tag some/page/main.css %}`. 


**Build Distribution**

```
$ jekpack build
```

the default output location is `./dist`

**Deploy to S3**

```
$ jekpack deploy your-bucket-name
```

If you plan take S3 as website hosting. This command is helpful for you.
Be sure the environment variables
`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are set already before you run the command.

For make life easier, you can create a file with name `.env`, which contains the following:
```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```
These environment variables will be loaded at the beginning of jekpack commands.

If you use CloudFront along with S3,
the argument `--cloud-front-id` can be used to create invalidations. 
```
jekpack deploy your-bucket-name --cloud-front-id your-cloud-front-id
```

Common Questions
---

**What is about the `src/assets/media` folder?**

This folder is prepared for static assets like images.
Assume you have an image located at `src/assets/media/jekpack.jpg`.
In HTML, `{% asset_path jekpack.jpg %}` will return the output path of the image.
If you want to refer it in `.scss` files, see:
```
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
```
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

Any question not mentioned above? Open an issue.
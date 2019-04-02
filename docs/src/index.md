---
layout: default
page_name: Welcome
---


[![npm version](https://badge.fury.io/js/%40bincode%2Fjekpack.svg)](https://badge.fury.io/js/%40bincode%2Fjekpack) [![Build Status](https://travis-ci.org/yfxie/jekpack.svg?branch=master)](https://travis-ci.org/yfxie/jekpack) [![codecov](https://codecov.io/gh/yfxie/jekpack/branch/master/graph/badge.svg)](https://codecov.io/gh/yfxie/jekpack)

[Jekyll](https://jekyllrb.com/) is a powerful tool for static sites and 
[Webpack](https://webpack.js.org/) is the first choice to pack assets. 
**Jekpack** is the integration of Jekyll and Webpack to make them work together ❤.

You may never hear about Jekyll or not familiar with Webpack. It's ok to get started Jekpack👌. 
Start learning Jekyll by using Jekpack.

Jekpack is for multi pages static sites. 
If you prefer the SPA(single page application), 
Webpack + HtmlWebpackPlugin might be another better choice 👈.

---

Highlights
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
└── package.json
```

**Flexible**

the default config for both Jekyll and Webpack all can be modified(see the example).

**Deploy**

Yes. The function of deployment is also in this pack for you.
By the one command `jekpack deploy <s3 bucket>`, the dist will be deployed to the AWS S3 bucket.


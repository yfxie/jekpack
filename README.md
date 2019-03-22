# JekPack

Jekyll is a powerful tool for static sites and Webpack is the first choice to pack assets. 
Jekpack is the integration of Jekyll and Webpack, 
let you happy build your static site.  

Jekpack is for multi pages static sites. If you prefer the SPA(single page application), Webpack + HtmlWebpackPlugin will be suggested.

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
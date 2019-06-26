[
  'build',
  'bundle',
  'check',
  'jekyll',
  'new',
  'webpackDevServer',
  'deployRedirectRules',
].forEach(m =>
  module.exports[m] = require(`./${m}`)
);
[
  'build',
  'bundle',
  'check',
  'jekyll',
  'jekyllExec',
  'new',
  'webpackDevServer',
  'deployRedirectRules',
].forEach(m =>
  module.exports[m] = require(`./${m}`)
);
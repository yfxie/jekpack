[
  'build',
  'bundle',
  'check',
  'jekyll',
  'new',
  'webpackDevServer',
].forEach(m =>
  module.exports[m] = require(`./${m}`)
);
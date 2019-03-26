[
  'build',
  'jekyll',
  'new',
  'webpackDevServer',
].forEach(m =>
  module.exports[m] = require(`./${m}`)
);
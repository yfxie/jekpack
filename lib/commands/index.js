[
  'build',
  'jekyll',
  'new',
].forEach(m =>
  module.exports[m] = require(`./${m}`)
);
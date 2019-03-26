const path = require('path');

process.argv = ['', ''];
process.env.JEKPACK_TEST = true;
process.env.JEKPACK_TEST_CWD = path.resolve(__dirname, 'tmp');
process.env.JEKPACK_ROOT = path.resolve(__dirname, '..');
process.env.JEKPACK_BIN_PATH = require.resolve(path.resolve(process.env.JEKPACK_ROOT, 'bin'));


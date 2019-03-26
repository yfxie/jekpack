const fs = require('fs');
const path = require('path');

describe('test getConfigFilePath', () => {
  const ORIGINAL_ENV = process.env;
  const testConfigPath = path.resolve(process.env.JEKPACK_TEST_CWD, 'test-config.js');

  beforeEach(() => {
    process.env = {...ORIGINAL_ENV};
    process.env.JEKPACK_ROOT = '/';
    process.env.JEKPACK_CONTEXT = process.env.JEKPACK_TEST_CWD;
    fs.openSync(testConfigPath, 'w');
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  test('returns default file path', () => {
    const getConfigFilePath = require('lib/utils/getConfigFilePath');
    expect(getConfigFilePath('test.js')).toBe('/test.js');
  });

  test('returns the host file if it exists', () => {
    const getConfigFilePath = require('lib/utils/getConfigFilePath');
    expect(getConfigFilePath('test-config.js')).toBe(testConfigPath);
  });
});
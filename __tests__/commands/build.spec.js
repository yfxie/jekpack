jest.setTimeout(60000);

jest.spyOn(console, 'error').mockImplementation(jest.fn());
jest.spyOn(console, 'log').mockImplementation(jest.fn());
jest.spyOn(process.stdout, 'write').mockImplementation(jest.fn());

const path = require('path');
const create = require('createTestProject');
const fs = require('fs-extra');

describe('test the build command', () => {
  let testProject;
  beforeEach(async() => {
    jest.mock('webpack', () => jest.fn((config, cb) => cb(null, 'foo')));
    jest.mock('rimraf', () => jest.fn((path, cb) => cb()));
    jest.mock('lib/commands/jekyll');
    jest.mock('ora', () => () => ({
      stop: jest.fn(),
      start: jest.fn(),
    }));
    jest.mock('mini-css-extract-plugin', () => {
      const mock = jest.fn();
      mock.loader = '';
      return mock;
    });
    jest.mock('hard-source-webpack-plugin', () => jest.fn());
    testProject = await create('test-commands-build');
    process.env.JEKPACK_CONTEXT = testProject.projectRoot;
  });

  test('build', async() => {
    const commands = require('lib/commands');
    const jekyll = require('lib/commands/jekyll');
    const webpack = require('webpack');

    const defaultConfig = require(path.resolve(process.env.JEKPACK_ROOT, 'config/webpack/production.js'));
    await commands.build(testProject.src, testProject.dist);

    expect(webpack).toHaveBeenCalledWith(defaultConfig, expect.any(Function));
    expect(jekyll).toHaveBeenCalledWith(testProject.src, testProject.dist);
  });

  test('when rm failed', async() => {
    jest.mock('rimraf', () => jest.fn((path, cb) => cb('rm-exception')));

    const webpack = require('webpack');
    const commands = require('lib/commands');
    const jekyll = require('lib/commands/jekyll');
    let exception;

    try {
      await commands.build(testProject.src, testProject.dist);
    } catch (e) {
      exception = e;
    }

    expect(exception).toBe('rm-exception');
    expect(webpack).not.toHaveBeenCalled();
    expect(jekyll).not.toHaveBeenCalled();
  });

  test('when webpack failed', async() => {
    jest.mock('webpack', () => jest.fn((config, cb) => cb('webpack-exception', 'foo')));
    const commands = require('lib/commands');
    const webpack = require('webpack');
    const jekyll = require('lib/commands/jekyll');

    let exception;
    try {
      await commands.build(testProject.src, testProject.dist);
    } catch (e) {
      exception = e;
    }

    expect(exception).toBe('webpack-exception');
    expect(webpack).toHaveBeenCalled();
    expect(jekyll).not.toHaveBeenCalled();
  });

  describe('E2E', () => {
    beforeEach(() => {
      jest.unmock('webpack');
      jest.unmock('lib/commands/jekyll');
      jest.unmock('mini-css-extract-plugin');
      jest.unmock('hard-source-webpack-plugin');
      jest.unmock('rimraf');
      jest.mock('execa');
    });

    test('', async() => {
      const execa = require('execa');
      const originalExeca = jest.requireActual('execa');
      execa.mockImplementation((cmd, args, options) => originalExeca(cmd, args, { ...options, stdio: 'pipe' }));
      const commands = require('lib/commands');
      await commands.build(testProject.src, testProject.dist);

      expect(fs.existsSync(path.resolve(testProject.dist, 'assets', 'manifest.json'))).toBe(true);
      expect(fs.existsSync(path.resolve(testProject.dist, 'index.html'))).toBe(true);
    })
  });
});
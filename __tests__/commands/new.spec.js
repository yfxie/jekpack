jest.mock('inquirer');
jest.mock('lib/utils/installDependencies');

const commands = require('lib/commands');
const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const installDependencies = require('lib/utils/installDependencies');

describe('test the new command', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  test('create a new project', async() => {
    await commands.new('test-new', { force: true, cwd: process.env.JEKPACK_TEST_CWD });
  });

  test('should install dependencies unless test mode', async() => {
    delete process.env.JEKPACK_TEST;
    await commands.new('test-new', { force: true, cwd: process.env.JEKPACK_TEST_CWD });
    const projectRoot = path.resolve(process.env.JEKPACK_TEST_CWD, 'test-new');
    expect(installDependencies).toHaveBeenCalledWith(projectRoot);
  });

  describe('the project already exists', () => {
    const
      testDir = path.resolve(process.env.JEKPACK_TEST_CWD, 'test-new'),
      testFilePath = path.resolve(testDir, 'test-file');

    beforeEach(() => {
      fs.removeSync(testDir);
      fs.ensureDirSync(testDir);
      fs.writeFileSync(testFilePath, 'hello world');
    });

    test('cancel the prompt', async() => {
      inquirer.prompt = jest.fn().mockResolvedValue({ action: '' });
      await commands.new('test-new', { cwd: process.env.JEKPACK_TEST_CWD });
      expect(fs.existsSync(testFilePath)).toBe(true);
      expect(fs.readdirSync(testDir).length).toBe(1);
    });

    test('pick the overwrite option', async() => {
      inquirer.prompt = jest.fn().mockResolvedValue({ action: 'overwrite' });
      await commands.new('test-new', { cwd: process.env.JEKPACK_TEST_CWD });
      expect(fs.existsSync(testFilePath)).toBe(false);
    });
  });
});

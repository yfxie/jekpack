const path = require('path');
const create = require('createTestProject');
const fs = require('fs-extra');

describe('test the jekyll command', () => {
  const defaultConfigPath = path.resolve(process.env.JEKPACK_ROOT, 'config/jekyll.yml');
  let testProject;

  beforeEach(async() => {
    testProject = await create('test-commands-jekyll');
    process.env.JEKPACK_CONTEXT = testProject.projectRoot;
  });

  it('default', async() => {
    jest.mock('execa');

    const execa = require('execa');
    const commands = require('lib/commands');
    await commands.jekyll(testProject.src, testProject.dist);

    expect(execa).toHaveBeenCalledWith(
      'bundle',
      command2Args(`exec jekyll build -s ${testProject.src} -d ${testProject.dist} -c ${defaultConfigPath}`),
      expect.any(Object),
    );
  });

  it('test watch mode', async() => {
    jest.mock('execa');

    const execa = require('execa');
    const commands = require('lib/commands');
    await commands.jekyll(testProject.src, testProject.dist, { watch: true });
    expect(execa).toHaveBeenCalledWith(
      'bundle',
      expect.arrayContaining(['--watch']),
      expect.any(Object),
    );
  });

  it('load the both configs, when the config of host exists', async() => {
    jest.mock('execa');

    const execa = require('execa');
    const hostConfigPath = path.resolve(testProject.projectRoot, 'config/jekyll.yml');
    const commands = require('lib/commands');
    fs.ensureDirSync(path.dirname(hostConfigPath));
    fs.openSync(hostConfigPath, 'w');

    await commands.jekyll(testProject.src, testProject.dist);

    expect(execa).toHaveBeenCalledWith(
      'bundle',
      command2Args(`exec jekyll build -s ${testProject.src} -d ${testProject.dist} -c ${defaultConfigPath},${hostConfigPath}`),
      expect.any(Object),
    );
  });

  test('when an exception is thrown', async() => {
    jest.mock('execa', () => jest.fn(() => { throw 'jekyll-exception' }));
    const exitMock = jest.spyOn(process, 'exit').mockImplementation(jest.fn());
    const commands = require('lib/commands');

    await commands.jekyll(testProject.src, testProject.dist);

    expect(exitMock).toHaveBeenCalledWith(1);
  });
});
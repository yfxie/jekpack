const path = require('path');
const create = require('createTestProject');

describe('test the jekyll-exec command', () => {
  let tmpConfigPath;
  let testProject;

  beforeEach(async() => {
    testProject = await create('test-commands-jekyll');
    process.env.JEKPACK_CONTEXT = testProject.projectRoot;
    tmpConfigPath = path.resolve(process.env.JEKPACK_CONTEXT, 'tmp/jekyll.yml');
  });

  it('test jekyll help command', async() => {
    jest.mock('execa');

    const execa = require('execa');
    const commands = require('lib/commands');
    await commands.jekyllExec(['help']);

    expect(execa).toHaveBeenCalledWith(
      'bundle',
      command2Args(`exec jekyll help --trace`),
      expect.any(Object),
    );
  });
});
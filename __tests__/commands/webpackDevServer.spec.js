const create = require('createTestProject');

describe('test the webpack-dev-server command', () => {
  let testProject;

  beforeEach(async() => {
    jest.resetModules();
    testProject = await create('test-commands-webpack-dev-server');
    process.env.JEKPACK_CONTEXT = testProject.projectRoot;
  });

  it('default', async() => {
    jest.mock('execa');

    const execa = require('execa');
    const commands = require('lib/commands');
    await commands.webpackDevServer('my-config-path');

    expect(execa).toHaveBeenCalledWith(
      'webpack-dev-server',
      expect.arrayContaining(command2Args(`--config my-config-path`)),
      expect.any(Object),
    );
  });

  test('when an exception is thrown', async() => {
    jest.mock('execa', () => jest.fn(() => { throw 'jekyll-exception' }));

    const exitMock = jest.spyOn(process, 'exit').mockImplementation(jest.fn());
    const commands = require('lib/commands');

    await commands.webpackDevServer('my-config-path');

    expect(exitMock).toHaveBeenCalledWith(1);
  });
});
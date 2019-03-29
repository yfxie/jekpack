const create = require('createTestProject');

jest.spyOn(console, 'log').mockImplementation(jest.fn());

describe('test the bundle command', () => {
  let testProject;

  beforeEach(async() => {
    testProject = await create('test-commands-bundle');
    process.env.JEKPACK_CONTEXT = testProject.projectRoot;
  });

  beforeEach(() => {
    jest.mock('execa');
    jest.mock('lib/commands/check');
  });

  test('called bundle install when all dependencies are installed', async() => {
    const execa = require('execa');
    const commands = require('lib/commands');
    commands.check.mockReturnValue(true);

    await commands.bundle();

    expect(execa).toHaveBeenCalledWith('bundle', expect.any(Array), expect.any(Object));
  });

  test('return if the result of check command is false', async() => {
    const execa = require('execa');
    const commands = require('lib/commands');
    commands.check.mockReturnValue(false);

    await commands.bundle();

    expect(execa).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('All dependencies described above must be installed'));
  });

  test('exit with code 1 if any exception', async() => {
    const exitMock = jest.spyOn(process, 'exit').mockImplementation(jest.fn());
    const execa = require('execa');
    const commands = require('lib/commands');
    execa.mockImplementation(() => { throw 'exception' });
    commands.check.mockReturnValue(true);

    await commands.bundle();

    expect(exitMock).toHaveBeenCalledWith(1);
  });
});
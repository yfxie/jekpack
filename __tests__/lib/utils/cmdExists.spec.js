describe('test cmdExists', () => {
  beforeEach(() => {
    jest.mock('execa');
    jest.mock('command-exists');
  });

  test('returns the result from command-exists if the cmd is without args', async() => {
    const commandExists = require('command-exists');
    const spy = jest.spyOn(commandExists, 'sync');
    const cmdExists = require('lib/utils/cmdExists');

    spy.mockReturnValue(true);
    const resultShouldBeTrue = await cmdExists('ruby');
    expect(resultShouldBeTrue).toBe(true);

    spy.mockReturnValue(false);
    const resultShouldBeFalse = await cmdExists('ruby');
    expect(resultShouldBeFalse).toBe(false);
  });

  test('returns the result through execa if the cmd is with args', async() => {
    const execa = require('execa');
    const commandExists = require('command-exists');
    jest.spyOn(commandExists, 'sync');
    const cmdExists = require('lib/utils/cmdExists');

    const result = await cmdExists('bundle exec jekyll -v');

    expect(execa).toHaveBeenCalledWith('bundle', command2Args('exec jekyll -v'));
    expect(result).toBe(true);
    expect(commandExists.sync).not.toHaveBeenCalled();
  });

  test('returns false if exception is thrown', async() => {
    const execa = require('execa');
    execa.mockImplementation(jest.fn(() => { throw 'exception' }));
    const cmdExists = require('lib/utils/cmdExists');

    const result = await cmdExists('bundle exec jekyll -v');

    expect(result).toBe(false);
  });
});
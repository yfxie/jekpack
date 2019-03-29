jest.spyOn(console, 'log').mockImplementation(jest.fn());

describe('test the check command', () => {
  beforeEach(() => {
    jest.mock('lib/utils/getCmdVersion');
    jest.mock('lib/utils/cmdExists');
  });

  test('returns true when all dependencies installed', async() => {
    const cmdExists = require('lib/utils/cmdExists');
    cmdExists.mockReturnValue(true);

    const commands = require('lib/commands');
    const result = await commands.check();

    expect(result).toBe(true);
  });

  test('returns false if any dependency is missing', async() => {
    const cmdExists = require('lib/utils/cmdExists');
    cmdExists.mockReturnValueOnce(true).mockReturnValue(false);

    const commands = require('lib/commands');
    const result = await commands.check();

    expect(result).toBe(false);
  });
});
describe('test getCmdVersion', () => {
  beforeEach(() => {
    jest.mock('execa');
  });

  test('returns the result from stdout', async() => {
    const execa = require('execa');
    const getCmdVersion = require('lib/utils/getCmdVersion');
    execa.mockResolvedValue({ stdout: '2.6.1' });

    const result = await getCmdVersion('ruby -v');

    expect(result).toBe('2.6.1');
    expect(execa).toHaveBeenCalledWith('ruby', ['-v']);
  });

  test('return blank if exception is thrown', async() => {
    const execa = require('execa');
    const getCmdVersion = require('lib/utils/getCmdVersion');
    execa.mockImplementation(jest.fn(() => { throw 'exception' }));

    const result = await getCmdVersion('cmd-not-found -v');

    expect(result).toBe('');
  });
});
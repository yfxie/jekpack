
describe('installDependencies', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.mock('execa');
  });

  test('yarn', () => {
    const execa = require('execa');
    const installDependencies = require('lib/utils/installDependencies');
    installDependencies(process.env.JEKPACK_TEST_CWD);
    expect(execa.mock.calls[1][0]).toEqual('yarn');
    expect(execa.mock.calls[1][1]).toEqual([]);
  });

  test('npm', () => {
    const execa = require('execa');
    execa.mockImplementationOnce(() => {
      throw new Error();
    });
    const installDependencies = require('lib/utils/installDependencies');

    installDependencies(process.env.JEKPACK_TEST_CWD);
    expect(execa.mock.calls[1][0]).toEqual('npm');
    expect(execa.mock.calls[1][1]).toEqual(['install']);
  });
});

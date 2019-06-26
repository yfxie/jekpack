const create = require('createTestProject');
let testProject;

describe('test the deployRedirectRules command', () => {
  beforeEach(async() => {
    testProject = await create('test-commands-deployRedirectRules');
    process.env.JEKPACK_CONTEXT = testProject.projectRoot;
    testProject.write('redirect-rules.json', JSON.stringify([
      { key: 'index.html', to: '/tw/' },
      { key: 'tw/1-series/index.html', to: '/tw/1-series/plus/' },
    ]));
  });

  it('put objects', async() => {
    jest.mock('aws-sdk/clients/s3', () => jest.fn());

    const S3 = require('aws-sdk/clients/s3');
    S3.prototype.putObject = jest.fn((params, cb) => cb(null, {}));
    const commands = require('lib/commands');
    await commands.deployRedirectRules('my-site', testProject.resolve('redirect-rules.json'));

    expect(S3.prototype.putObject).toHaveBeenCalledWith({
      Bucket: 'my-site',
      Key: 'index.html',
      WebsiteRedirectLocation: '/tw/',
    }, expect.any(Function));

    expect(S3.prototype.putObject).toHaveBeenCalledWith({
      Bucket: 'my-site',
      Key: 'tw/1-series/index.html',
      WebsiteRedirectLocation: '/tw/1-series/plus/',
    }, expect.any(Function));
  });

  it('raise exception for any failure', async() => {
    jest.mock('aws-sdk/clients/s3', () => jest.fn());
    const exitMock = jest.spyOn(process, 'exit').mockImplementation(jest.fn());

    const S3 = require('aws-sdk/clients/s3');
    let i = 0;
    S3.prototype.putObject = jest.fn((params, cb) => cb(i++, {}));
    const commands = require('lib/commands');
    await commands.deployRedirectRules('my-site', testProject.resolve('redirect-rules.json'));

    expect(exitMock).toHaveBeenCalledWith(1);
  });
});
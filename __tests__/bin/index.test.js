const path = require('path');

const resolveCommand = cmd => ['', '', ...cmd.split(' ')];

describe('test CLI', () => {
  test('the new command', () => {
    const commands = require('lib/commands');
    const bin = require('bin');

    jest.mock('lib/commands', () => ({
      new: jest.fn(),
    }));

    bin.parse(resolveCommand('new test-project --force'));
    expect(commands.new).toHaveBeenCalledWith('test-project', { force: true });
  });

  test('the dev command', () => {
    jest.mock('concurrently', () => jest.fn().mockResolvedValue());

    const concurrently = require('concurrently');
    const bin = require('bin');

    bin.parse(resolveCommand('dev'));

    const concurrentlyCommands = concurrently.mock.calls[0][0];
    expect(concurrentlyCommands[0].command).toMatch(/^jekpack jekyll/);
    expect(concurrentlyCommands[1].command).toMatch(/^jekpack webpack/);
  });

  test('the dev command with exception', async() => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(jest.fn());
    jest.mock('concurrently', () => jest.fn().mockRejectedValue(new Error('error')));

    const bin = require('bin');

    await bin.parse(resolveCommand('dev'));

    expect(mockExit).toHaveBeenCalledWith(1);
  });

  test('the jekyll command', () => {
    jest.spyOn(process, 'cwd').mockReturnValue('/abc');
    jest.mock('lib/commands', () => ({ jekyll: jest.fn(), }));

    const bin = require('bin');
    const commands = require('lib/commands');

    bin.parse(resolveCommand('jekyll'));
    expect(commands.jekyll).toHaveBeenCalledWith('/abc/src', '/abc/tmp/dist', { watch: false })
  });

  test('the webpack-dev-server command', () => {
    jest.spyOn(process, 'cwd').mockReturnValue(process.env.JEKPACK_ROOT);
    jest.mock('lib/commands', () => ({ webpackDevServer: jest.fn(), }));

    const commands = require('lib/commands');
    const bin = require('bin');

    const defaultConfig = path.resolve(process.env.JEKPACK_ROOT, 'config/webpack/development.js');
    bin.parse(resolveCommand('webpack-dev-server'));
    expect(commands.webpackDevServer).toHaveBeenCalledWith(defaultConfig);

    const specifiedConfig = path.resolve(process.env.JEKPACK_ROOT, 'config/webpack/development.js');
    bin.parse(resolveCommand('webpack-dev-server -c config/production.js'));
    expect(commands.webpackDevServer).toHaveBeenCalledWith(specifiedConfig);
  });

  test('the build command', () => {
    jest.spyOn(process, 'cwd').mockReturnValue('/abc');
    jest.mock('lib/commands', () => ({ build: jest.fn(), }));

    const commands = require('lib/commands');
    const bin = require('bin');

    bin.parse(resolveCommand('build'));
    expect(commands.build).toHaveBeenCalledWith('/abc/src', '/abc/dist', {});

    bin.parse(resolveCommand('build -s input -d output'));
    expect(commands.build).toHaveBeenCalledWith('/abc/input', '/abc/output', {});
  });

  test('the deploy command', () => {
    jest.spyOn(process, 'cwd').mockReturnValue('/abc');
    jest.mock('s3-easy-deploy', () => ({ deploy: jest.fn(() => ({ then: jest.fn(fn => fn()) })), }));
    jest.mock('lib/commands', () => ({ deployRedirectRules: jest.fn(), }));

    const s3EasyDeploy = require('s3-easy-deploy');
    const bin = require('bin');
    const commands = require('lib/commands');

    bin.parse(resolveCommand('deploy my-site'));
    expect(s3EasyDeploy.deploy).toHaveBeenCalledWith({
      bucket: 'my-site',
      concurrentRequests: expect.anything(),
      publicRoot: '/abc/dist',
    });

    bin.parse(resolveCommand('deploy my-site -a private --cloud-front-id abc -d ../abc'));
    expect(s3EasyDeploy.deploy).toHaveBeenCalledWith({
      bucket: expect.anything(),
      concurrentRequests: expect.anything(),
      publicRoot: '/abc',
      acl: 'private',
      cloudFrontId: 'abc',
    });

    bin.parse(resolveCommand('deploy my-site -r redirect-rules.json'));
    expect(commands.deployRedirectRules).toHaveBeenCalledWith('my-site', '/abc/redirect-rules.json');
  });

  test('the check command', () => {
    jest.mock('lib/commands', () => ({ check: jest.fn(), }));

    const commands = require('lib/commands');
    const bin = require('bin');

     bin.parse(resolveCommand('check'));

    expect(commands.check).toHaveBeenCalled();
  });

  test('the bundle command', () => {
    jest.mock('lib/commands', () => ({ bundle: jest.fn(), }));

    const commands = require('lib/commands');
    const bin = require('bin');

     bin.parse(resolveCommand('bundle'));

    expect(commands.bundle).toHaveBeenCalled();
  });

});



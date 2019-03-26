const path = require('path');

const resolveCommand = cmd => ['', '', ...cmd.split(' ')];

describe('test CLI', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('the new command', async() => {
    const commands = require('lib/commands');
    const bin = require('bin');

    jest.mock('lib/commands', () => ({
      new: jest.fn(),
    }));

    bin.parse(resolveCommand('new test-project --force'));
    expect(commands.new).toHaveBeenCalledWith('test-project', { force: true });
  });

  test('the dev command', async() => {
    const concurrently = require('concurrently');
    const bin = require('bin');
    jest.mock('concurrently', () => jest.fn().mockResolvedValue());

    bin.parse(resolveCommand('dev'));

    const concurrentlyCommands = concurrently.mock.calls[0][0];
    expect(concurrentlyCommands[0].command).toMatch(/^jekpack jekyll/);
    expect(concurrentlyCommands[1].command).toMatch(/^jekpack webpack/);
  });

  test('the dev command with exception', async() => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(jest.fn());
    const bin = require('bin');
    jest.mock('concurrently', () => jest.fn().mockRejectedValue(new Error('error')));

    await bin.parse(resolveCommand('dev'));
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  test('the jekyll command', async() => {
    jest.spyOn(process, 'cwd').mockReturnValue('/abc');
    jest.mock('lib/commands', () => ({ jekyll: jest.fn(), }));

    const bin = require('bin');
    const commands = require('lib/commands');

    bin.parse(resolveCommand('jekyll'));
    expect(commands.jekyll).toHaveBeenCalledWith('/abc/src', '/abc/tmp/dist', { watch: false })
  });

  test('the webpack-dev-server command', async() => {
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

  test('the build command', async() => {
    jest.spyOn(process, 'cwd').mockReturnValue('/abc');
    jest.mock('lib/commands', () => ({ build: jest.fn(), }));

    const commands = require('lib/commands');
    const bin = require('bin');

    bin.parse(resolveCommand('build'));
    expect(commands.build).toHaveBeenCalledWith('/abc/src', '/abc/dist', {});

    bin.parse(resolveCommand('build -s input -d output'));
    expect(commands.build).toHaveBeenCalledWith('/abc/input', '/abc/output', {});
  });

  test('the deploy command', async() => {
    jest.spyOn(process, 'cwd').mockReturnValue('/abc');
    jest.mock('s3-easy-deploy', () => ({ deploy: jest.fn(), }));

    const s3EasyDeploy = require('s3-easy-deploy');
    const bin = require('bin');

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
  });
});



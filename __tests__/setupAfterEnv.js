const ORIGINAL_ENV = process.env;

global.command2Args = cmd => cmd.split(/\s+/);

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
});


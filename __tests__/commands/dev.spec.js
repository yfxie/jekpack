jest.setTimeout(60000);

const create = require('createTestProject');
const testDev = require('testDev');

test('dev', async() => {
  const project = await create('test-dev');

  await testDev(
    () => project.execute('jekpack', ['dev']),
    ({ page }) => {

    }
  );
});

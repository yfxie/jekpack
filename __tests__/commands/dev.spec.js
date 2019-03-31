jest.setTimeout(60000);

const create = require('createTestProject');
const testDev = require('testDev');

describe('test the dev command', () => {

  describe('E2E', () => {
    let testProject;

    beforeEach(async() => {
      testProject = await create('test-commands-dev');
    });

    test('generate correct files', async() => {
      await testDev(
        () => testProject.execute('jekpack', ['dev']),
        async() => {
          expect(testProject.exists('tmp/dist/index.html')).toBe(true);
          expect(testProject.exists('tmp/dist/assets/manifest.json')).toBe(true);

          const manifest = require(testProject.resolve('tmp/dist/assets/manifest.json'));
          const page = testProject.readFile('tmp/dist/index.html');

          expect(page).toMatch(manifest['javascripts/main.js']);
          expect(page).toMatch(manifest['stylesheets/main.js']);
        }
      );
    });

    test('the stylesheet and javascript are included in the output page', async() => {
      await testDev(
        () => testProject.execute('jekpack', ['dev']),
        async({ page, onJekyllUpdate, onWebpackUpdate }) => {
          testProject.write('src/assets/stylesheets/main.scss', 'body{ background: red; }');
          await onWebpackUpdate();
          await sleep(1000);
          const html = await page.content();
          expect(html).toMatch('background: red;');
        }
      );
    });
  });
});

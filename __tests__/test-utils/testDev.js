const puppeteer = require('puppeteer');

module.exports = async(startDev, testCB, options = {}) => {
  const URLPattern = /http:\/\/[^/]+\//;
  const JEKYLL_READY_PATTERN = /done in [0-9.]+ seconds/;
  const WEBPACK_READY_PATTERN = /webpack \d+\.\d+\.\d+ compiled/;

  await new Promise((resolve, reject) => {
    const devChild = startDev();
    let devOut = '', webpackReady = false, jekyllReady = false, url, lock = false, finished = false;

    let jekyllUpdateResolve = () => {}, webpackUpdateResolve = () => {};
    const onJekyllUpdate = () => new Promise(resolve => jekyllUpdateResolve = resolve);
    const onWebpackUpdate = () => new Promise(resolve => webpackUpdateResolve = resolve);

    const startTest = async() => {
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: process.env.CHROME_BIN || null,
      });
      const page = await browser.newPage();
      await page.goto(url);

      try {
        await testCB({ browser, page, onJekyllUpdate, onWebpackUpdate });
        finished = true;
      } catch (e) {
        console.log(e);
      }

      await browser.close();
      devChild.kill();
    };

    devChild.stdout.on('data', (data) => {
      const dataString = data.toString();
      devOut += dataString;

      if (dataString.match(URLPattern)) {
        url = dataString.match(URLPattern)[0];
      }
      if (dataString.match(WEBPACK_READY_PATTERN)) {
        webpackReady = true;
      }
      if (dataString.match(JEKYLL_READY_PATTERN)) {
        jekyllReady = true;
      }

      if (jekyllReady && webpackReady) {
        if (!lock) {
          lock = true;
          startTest();
        } else {
          if (dataString.match(JEKYLL_READY_PATTERN)) {
            jekyllUpdateResolve();
          }
          if (dataString.match(WEBPACK_READY_PATTERN)) {
            webpackUpdateResolve();
          }
        }
      }
    });

    devChild.on('exit', code => {
      if (code === 0 || finished) {
        resolve();
      } else {
        console.log(devOut);
        reject(`exit with ${code}`);
      }
    });

  });
};
const puppeteer = require('puppeteer');
let browser;

module.exports = async(startDev, testCB, options = {}) => {
  const URLPattern = /http:\/\/[^/]+\//;

  return new Promise((resolve, reject) => {
    const devChild = startDev();
    let devOut = '';

    const exit = () => {
      devChild.stdin.write('close');
    };

    devChild.stdout.on('data', async(data) => {
      const dataString = data.toString();
      devOut += dataString;

      const urlMatch = dataString.match(URLPattern);
      if (urlMatch) {
        let url = urlMatch[0];

        browser = browser || await puppeteer.launch({
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          executablePath: process.env.CHROME_BIN || null,
        });
        const page = await browser.newPage();
        await page.goto(url);

        await testCB({ browser, page, });
        await browser.close();
        exit();
        resolve();
      }
    });

    devChild.on('exit', code => {
      if (code === 0) {
        resolve();
      } else {
        console.log(devOut);
        reject(`exit with ${code}`);
      }
    });

  });
};
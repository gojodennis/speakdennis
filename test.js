const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://build.nvidia.com/nvidia/parakeet-tdt-0_6b-v2', {waitUntil: 'networkidle2'});
  const text = await page.evaluate(() => document.body.innerText);
  const elements = await page.$$eval('pre', pres => pres.map(p => p.innerText));
  console.log("PRE TAGS:", elements);
  await browser.close();
})();

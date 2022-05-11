require('dotenv').config({path: __dirname + '/.env'})
const puppeteer = require('puppeteer');
const login = require('./actions/login');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768});
  await login(page, 'Europe 50', 'tr');
  

  /* await browser.close(); */
})();
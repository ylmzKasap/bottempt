require('dotenv').config({path: __dirname + '/.env'})
const puppeteer = require('puppeteer');
const login = require('./actions/login');
const { get_resources } = require('./actions/resourceUtils');
const { regularTown } = require('./data/townInfo');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768});
  await login(page, 'Europe 50', 'tr');

  setInterval(async () => console.log(await get_resources(page)), 2000)

  /* await page
    .waitForSelector("path[class='buildingSlot9']")
    .then(async (selector) => {
        await selector.hover();  
    }); */
  

  /* await browser.close(); */
})();
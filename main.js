require('dotenv').config({path: __dirname + '/.env'});
const puppeteer = require('puppeteer-extra');
const db = require('./data/db_info');

const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const { log_in, get_url }  = require('./actions/login');
const { layouts, buildings } = require('./data/town_info');
const { tokmak_it } = require('./actions/units');
const { upgrade_building } = require('./actions/buildings');
const { escape_soldiers } = require('./actions/attack');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768});

  await log_in(page, 'Europe 50', 'tr');
  const gameUrl = await get_url(page);

  // Escape soldiers
  const rallyPage = await browser.newPage();
  await rallyPage.goto(`${gameUrl}/dorf2.php`);
  await rallyPage.waitForSelector('#villageContent');
  setInterval(async () => await escape_soldiers(rallyPage, gameUrl, [-38, 40]), 14000);

  // Create units
  const tokmakPage = await browser.newPage();
  await tokmakPage.goto(`${gameUrl}/dorf2.php`);
  await tokmakPage.waitForSelector('#villageContent');
  setInterval(async () => await tokmak_it(tokmakPage), 120000);

  // Upgrade buildings
  const cityPage = await browser.newPage();
  setInterval(async () => await upgrade_building(cityPage, gameUrl, 'academy', 20), 44000);
  
  /* // Upgrade resources
  setInterval(() => upgrade_resources(page, 'iron', 9), 30000);
  setInterval(() => upgrade_resources(page, 'forest', 11), 45000);
  setInterval(() => upgrade_resources(page, 'clay', 10), 75000);
  setInterval(() => upgrade_resources(page, 'crop', 8), 105000); */

  /* await browser.close(); */
})();
require('dotenv').config({path: __dirname + '/.env'})
const puppeteer = require('puppeteer');
const db = require('./data/db_info');

const { log_in, get_url }  = require('./actions/login');
const { get_resources, upgrade_resources } = require('./actions/resources');
const { layouts } = require('./data/town_info');
const { get_square, analyze_tiles } = require('./actions/map');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768});

  await log_in(page, 'Europe 50', 'tr');
  const gameUrl = await get_url(page);

  /* 
  // Upgrade resources
  setInterval(() => upgrade_resources(page, 'iron', 9), 30000);
  setInterval(() => upgrade_resources(page, 'forest', 11), 45000);
  setInterval(() => upgrade_resources(page, 'clay', 9), 75000);
  setInterval(() => upgrade_resources(page, 'crop', 8), 105000);
 */

  await analyze_tiles(db, page, [-34, 37], 20);

  /* await browser.close(); */
})();
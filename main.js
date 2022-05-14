require('dotenv').config({path: __dirname + '/.env'})
const puppeteer = require('puppeteer');
const db = require('./data/db_info');

const { log_in, get_url }  = require('./actions/login');
const { get_resources, upgrade_resources } = require('./actions/resources');
const { blockingWait } = require('./actions/utils');
const { layouts, buildings } = require('./data/town_info');
const { get_square, analyze_tiles } = require('./actions/map');
const { tokmak_it } = require('./actions/units');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768});

  await log_in(page, 'Europe 50', 'tr');
  const gameUrl = await get_url(page);

  const tokmakPage = await browser.newPage();
  await tokmakPage.goto(`${gameUrl}/dorf2.php`);
  await tokmakPage.waitForSelector('#villageContent');
  
  const cityPage = await browser.newPage();

  
  async function building_is_upgradable(buildingElem) {
    const buildingState = await buildingElem.evaluate(x => x.previousElementSibling.className);
    return !/notNow|maxLevel|underConstruction/.test(buildingState);
  }

  async function upgrade_building(page, building, maxLevel) {
    await page.bringToFront();
    await page.goto(`${gameUrl}/dorf2.php`);
    await page.waitForSelector('#villageContent');

    const buildingElem = await page.$(
      `#villageContent > div.buildingSlot > img[class*="building ${buildings[building]}"]`);

    const buildingUpgradable = await building_is_upgradable(buildingElem);
    const buildingLevel = await buildingElem.evaluate(x => x.previousElementSibling.getAttribute('data-level'));

    if (parseInt(buildingLevel) >= maxLevel) {
      console.log(`${building} is already at the specified max level.`);
      return;
    }
    
    if (buildingUpgradable) {
      await buildingElem.click();
      await page.waitForSelector('h1.titleInHeader');

      const upgradeButton = await page.$('div.upgradeButtonsContainer > div.section1 > button');
      console.log(`Upgraded ${building}`);
      await upgradeButton.click();
    }
    blockingWait(2);
  }

  setInterval(async () => await upgrade_building(cityPage, 'embassy', 5), 223512);
  setInterval(async () => await upgrade_building(cityPage, 'stonemason', 10), 23512);
  setInterval(async () => await upgrade_building(cityPage, 'marketplace', 12), 17123);
  setInterval(async () => await upgrade_building(cityPage, 'cranny', 10), 47505);
  setInterval(async () => await upgrade_building(cityPage, 'rally_point', 10), 31521);
  setInterval(async () => await upgrade_building(cityPage, 'residence', 10), 12412);
  setInterval(async () => await tokmak_it(tokmakPage), 120000);
  
  /* // Upgrade resources
  setInterval(() => upgrade_resources(page, 'iron', 9), 30000);
  setInterval(() => upgrade_resources(page, 'forest', 11), 45000);
  setInterval(() => upgrade_resources(page, 'clay', 10), 75000);
  setInterval(() => upgrade_resources(page, 'crop', 8), 105000); */


  /* await browser.close(); */
})();
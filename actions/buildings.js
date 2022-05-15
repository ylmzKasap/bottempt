const { buildings } = require('../data/town_info');
const { blockingWait } = require('../actions/utils');
const { get_url } = require('./login');

async function building_is_upgradable(buildingElem) {
    const buildingState = await buildingElem.evaluate(x => x.previousElementSibling.className);
    return !/notNow|maxLevel|underConstruction/.test(buildingState);
  }

  async function upgrade_building(page, gameUrl, building, maxLevel) {
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

module.exports = {
    building_is_upgradable, upgrade_building
}
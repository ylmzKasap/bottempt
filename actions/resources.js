const { layouts } = require('../data/town_info');

async function get_resources(page) {
    let resources = [];

    await page
        .waitForSelector('a.stockBarButton')
        .then(async () => {
            const allResources = await page.$$('a.stockBarButton');
            for (let i = 0; i < allResources.length - 1; i++) {
                const resource = await allResources[i].evaluate(x => x.innerText);
                resources.push(resource);
            }
        })

    return {
        'wood': resources[0],
        'clay': resources[1],
        'iron': resources[2],
        'crop': resources[3]
    };
}

async function is_upgradable(page, building_id) {
    const statusRaw = await page.$(`a.buildingSlot${building_id}`);

    if (!statusRaw) {
        console.log(`Could not locate the element ${building_id}`);
    }

    const status = await statusRaw.evaluate(x => x.className);
    return !(/notNow/.test(status)) && !(/underConstruction/.test(status));
}

async function get_building_level(page, building_id) {
    const statusRaw = await page.$(`a.buildingSlot${building_id} > div`);

    if (!statusRaw) {
        console.log(`Could not locate the element ${building_id}`);
    }

    const level = await statusRaw.evaluate(x => x.textContent);
    return parseInt(level);
}

async function upgrade_building(page, building_id) {
    const element = await page.$(`a.buildingSlot${building_id}`);
    element.click();

    await page
      .waitForSelector('.upgradeButtonsContainer > div > button')
      .then(elem => elem.click());
  }

async function upgrade_resources(page, resourceType, maxLevel, villageType='village-3') {
    const tilesToUpgrade = layouts[villageType][resourceType];
    let tileLevels = {};

    if (!tilesToUpgrade) {
      console.log('Tile not found.')
      return;
    }

    for (const tile of tilesToUpgrade) {
      tileLevels[tile] = await get_building_level(page, tile);
    }

    let upgraded = false;
    for (const tile of tilesToUpgrade) {
      const upgradeAvailable = await is_upgradable(page, tile);

      if (!upgradeAvailable) {
        continue;
      }

      if (tileLevels[tile] < maxLevel ) {
        await upgrade_building(page, tile);
        console.log(`Upgraded building ${tile}`);
        upgraded = true;
      }
    }

    if (!upgraded) {
        console.log(`No ${resourceType} to upgrade.`)
    }
  }

module.exports = {
    get_resources, is_upgradable, get_building_level, upgrade_resources
}
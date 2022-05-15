const { buildings } = require('../data/town_info');
const { blockingWait } = require('./utils');

async function being_attacked(page) {
    await page.bringToFront();

    const inRaid = await page.$('table.inRaid');
    const inAttack = await page.$('table.inAttack');

    blockingWait(2);

    if (inRaid || inAttack) {
    return true;
    } else {
    return false;
    }
}

async function go_to_rally (page, gameUrl) {
    async function open_rally() {
      await page.goto(`${gameUrl}/dorf2.php`);
      await page.waitForSelector('#villageContent');

      const rallyPoint = await page.$(
        `#villageContent > div.buildingSlot > img[class*="building ${buildings['rally_point']}"]`);

      await rallyPoint.click();
      await page.waitForSelector('h1.titleInHeader');

      const rallyUrl = await page.url();
      await page.goto(`${rallyUrl}&tt=1`);
      await page.waitForSelector('h1.titleInHeader');
    }

    const currentUrl = await page.url();
    if (!(/&tt=1/).test(currentUrl)) {
      await open_rally();
    }
  }

async function escape_soldiers (page, gameUrl, coords) {
    await go_to_rally(page, gameUrl);
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

    const attacked = await being_attacked(page);

    const unitCountsRaw = await page.$$('.spacer + [class$="troop_details"] td.unit');
    let unitCounts = [];

    for (const elem of unitCountsRaw) {
      const count = await elem.evaluate(x => x.innerText);
      unitCounts.push(parseInt(count));
    }
    const totalUnits = unitCounts.reduce((a, b) => a + b);

    if (attacked && totalUnits >= 5) {
      const pagUrl = await page.url();
      const armyUrl = pagUrl.replace('&tt=1', '&tt=2');
      await page.goto(armyUrl);
      await page.waitForSelector("#troops");

      const units = await page.$$('#troops a[href="#"]');
      for (const unit of units) {
        await unit.click();
      }

      await page.type('input[name="x"]', `${coords[0]}`);
      await page.type('input[name="y"]', `${coords[1]}`);

      const pillageButton = await page.$('.option label:last-of-type input');
      await pillageButton.click();

      const submitButton = await page.$('button[type="submit"]');
      await submitButton.click();

      await page.waitForSelector('.rallyPointConfirm');
      const confirmButtın = await page.$('button.rallyPointConfirm');
      await confirmButtın.click();
    }
    blockingWait(2);
  }

module.exports = {
    being_attacked, escape_soldiers
}
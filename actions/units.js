const { buildings } = require('../data/town_info');
const { blockingWait } = require('./utils');

async function tokmak_it(page) {
    async function create_tokmak(page) {
      const tokmakInput = await page.$('div.troop1 > div.details > div.cta > input');
      await page.evaluate(() => document.querySelector('div.troop1 > div.details > div.cta > input').value = "")
      await tokmakInput.type('10');
      console.log('Created 10 tokmak.')
      page.keyboard.press('Enter');
    }

    await page.bringToFront();
    const barracks = await page.$(
      `#villageContent > div.buildingSlot > img[class*="building ${buildings['barracks']}"]`);
    
    if (barracks) {
        await barracks.click();
    }
    
    await page.waitForSelector('.contentTitle');

    const elemTime = await page.$('table.under_progress :nth-last-child(2) > td.dur > span.timer');
    if (!elemTime) {
      await create_tokmak(page);
      return;
    }

    const timeLeft = await elemTime.evaluate(x => x.getAttribute('value'));

    if (timeLeft < 3600) {
      await create_tokmak(page);
    }
    blockingWait(2);
}

module.exports = {
    tokmak_it
}
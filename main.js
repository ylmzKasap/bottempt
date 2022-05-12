require('dotenv').config({path: __dirname + '/.env'})
const puppeteer = require('puppeteer');
const db = require('./data/db_info');
const { add_oasis } = require('./data/db_utils');

const { log_in, get_url }  = require('./actions/login');
const { get_resources, upgrade_resources } = require('./actions/resources');
const { layouts } = require('./data/town_info');
const { get_square } = require('./actions/map');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768});

  await log_in(page, 'Europe 50', 'tr');
  const gameUrl = await get_url(page);

  setInterval(() => upgrade_resources(page, 'iron', 8), 30000);
  setInterval(() => upgrade_resources(page, 'forest', 8), 45000);
  setInterval(() => upgrade_resources(page, 'clay', 8), 75000);
  setInterval(() => upgrade_resources(page, 'crop', 7), 105000);


  /* async function get_oasis(page, townCord, radius) {
    const allSquares = get_square(townCord, radius);
    const allOasis = [];

    for (const square of allSquares) {
      await page.goto(`${gameUrl}/position_details.php?x=${[square[0]]}&y=${[square[1]]}`);

      await page
        .waitForSelector("#tileDetails")
        .then(async (elem) => {
          const elemClass = await elem.evaluate(x => x.className);
          if (elemClass.match(/oasis/)){
            allOasis.push(square);
          } else {
            console.log(elemClass);
          }
        });
    }
    return allOasis;
  }

  const allOasis = await get_oasis(page, [-34, 37], 5);
  for (const oasis of allOasis) {
    await add_oasis(db, oasis, 'oasis');
  } */

  /* await browser.close(); */
})();
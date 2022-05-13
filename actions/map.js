const { arraysEqual, cartProd } = require('./utils');
const { get_url } = require('../actions/login');
const { add_oasis, add_village } = require('../data/db_utils');

function get_vicinity(coord, radius) {
    let coordArray = [coord];

    for (let i = 1; i <= radius; i++) {
        coordArray.unshift(coord - i);
        coordArray.push(coord + i);
    }

    return coordArray;
}

function get_square(center, radius, exclusions=[]) {
    const allCoord = cartProd(get_vicinity(center[0], radius), get_vicinity(center[1], radius));
    const centerFiltered = allCoord.filter(x => !arraysEqual(x, center));
    
    const stringifiedExclusions = exclusions.map(x => JSON.stringify(x));
    const exclusionFiltered = centerFiltered.filter(x =>
        !stringifiedExclusions.includes(JSON.stringify(x)));

    return exclusionFiltered;
}

async function analyze_tiles(db, page, townCord, radius) {
    const gameUrl = await get_url(page);
    const allSquares = get_square(townCord, radius);

    for (const square of allSquares) {
      await page.goto(`${gameUrl}/position_details.php?x=${[square[0]]}&y=${[square[1]]}`);

      const element = await page.waitForSelector("#tileDetails");
      const elemClass = await element.evaluate(x => x.className);

      if (elemClass.match(/landscape/)) {
        continue;
      }

      if (elemClass.match(/oasis/)) {
        await add_oasis(db, square);
        continue;
      }

      const layout = elemClass.split(' ')[1];
      const player = await page.$('tr > td.player > a');

      if (!player) {
        const distanceRaw = await page.$('div#map_details table:last-child td:last-child');
        let distance = await distanceRaw.evaluate(x => x.innerText);
        distance = `${parseFloat(distance)}`;

        await add_village(db, {
          'coordinate': square,
          'type': 'empty_village',
          'layout': layout,
          'distance': distance});
        }

      if (player) {
        const distanceRaw = await page.$('#village_info > tbody > tr:last-child > td');
        let distance = await distanceRaw.evaluate(x => x.innerText);
        distance = `${parseFloat(distance)}`;

        await add_village(db, {
          'coordinate': square,
          'type': 'village',
          'layout': layout,
          'distance': distance})
        }
      }
}

module.exports = {
    get_square, analyze_tiles
}
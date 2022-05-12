async function log_in(page, serverToLogin, country) {
    await page.goto(`https://www.travian.com/${country}`, {
    waitUntil: 'networkidle2',
  });

  const cookieButton = await page.$('#cmpbntyestxt');
  if (cookieButton) {
      cookieButton.click();
  }

  await page
    .waitForSelector("a[href='#login']")
    .then(async (selector) => {
        await selector.click();  
    });

  await page
    .waitForSelector('div.worldName')
      .then(async () => {
        const allServers = await page.$$('div.worldName');
        for (const server of allServers) {
            const serverName = await server.evaluate(x => x.textContent);
            
            if (serverName === serverToLogin) {
                await server.click();
                break;
            }
        }
    })
    
    await page
        .waitForSelector('input[name="usernameOrEmail"]')
        .then(async () => {
            await page.type('input[name="usernameOrEmail"]', process.env['PLAYERNAME']);
            await page.type('input[name="password"]', process.env['PLAYERPASSWORD']);
            await page.keyboard.press('Enter');
        });

    return;
}

async function get_url(page) {
    const url = await page
        .waitForSelector('a.stockBarButton')
        .then(async () => {
            const mainUrl = page.url();
            const urlRegex = /.*travian.com/
            return mainUrl.match(urlRegex)[0];
        });
    return url;
}

module.exports = {log_in, get_url}
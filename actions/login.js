module.exports = async function log_in(page, serverToLogin, country) {
    await page.goto(`https://www.travian.com/${country}`, {
    waitUntil: 'networkidle2',
  });

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
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
        'brick': resources[1],
        'iron': resources[2],
        'wheat': resources[3]
    };
}

module.exports = {
    "get_resources": get_resources
}
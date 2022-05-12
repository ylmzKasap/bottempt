const { arraysEqual, cartProd } = require('./utils');

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

module.exports = {
    get_square
}
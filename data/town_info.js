const layouts = {
    "village-3": {
        "forest": [1, 3, 14, 17],
        "clay": [5, 6, 16, 18],
        "iron": [4, 7, 10, 11],
        "crop": [2, 8, 9, 12, 13, 15]
    }
}

const layoutInfo = {
    "village-1": "3-3-3-9",
    "village-3": "4-4-4-6",
    "village-6": "1-1-1-15",
    "village-12": "5-4-3-6"
}

const buildings = {
    'rally_point': 'g16',
    'stable': 'g20',
    'barracks': 'g19',
    'granary': 'g11',
    'academy': 'g22',
    'warehouse': 'g10',
    'embassy': 'g18',
    'cranny': 'g23',
    'marketplace': 'g17',
    'main_building': 'g15',
    'smithy': 'g13',
    'residence': 'g25',
    'grain_mill': 'g8',
    'sawmill': 'g5',
    'brickyard': 'g6',
    'iron_foundry': 'g7',
    "hero's_mansion": 'g37',
    "workshop": "g21",
    "hospital": "g46",
    "stonemason": "g34"
}

module.exports = {
    layouts, buildings
}
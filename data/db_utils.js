async function create_tile_table(db) {
    await db.query(`CREATE TABLE tiles (
        tile_id BIGSERIAL PRIMARY KEY NOT NULL,
        coordinate integer[] UNIQUE NOT NULL,
        type VARCHAR(30) NOT NULL,
        layout VARCHAR(30),
        distance VARCHAR(30)
    );`).catch(err => console.log(err));
}

async function get_tile(db, coordinate) {
    const getQuery = `SELECT * FROM tiles
        WHERE coordinate = $1`
    
    const tile = await db.query(getQuery, [coordinate])
        .then(t => t.rows)
        .catch(err => console.log(err.code));
    
    return tile;
}

async function add_oasis(db, coordinate, type) {
    const addQuery = `INSERT INTO tiles (
        coordinate, type) VALUES ($1, $2);`
    
    await db.query(addQuery, [coordinate, type]);
}

module.exports = {
    create_tile_table, get_tile, add_oasis
}
async function create_tile_table(db) {
    await db.query(`CREATE TABLE tiles (
        tile_id BIGSERIAL PRIMARY KEY NOT NULL,
        coordinate integer[] UNIQUE NOT NULL,
        type VARCHAR(30) NOT NULL,
        layout VARCHAR(30),
        distance VARCHAR(30),
        pillagable BOOLEAN NOT NULL,
        last_visited DATE
    );`).catch(err => console.log(err));
}

async function get_tile(db, coordinate) {
    const getQuery = `SELECT * FROM tiles WHERE coordinate = $1`
    
    const tile = await db.query(getQuery, [coordinate])
        .then(t => t.rows)
        .catch(err => console.log(err.code));
    
    return tile;
}

async function add_oasis(db, coordinate) {
    const addQuery = `
        INSERT INTO tiles 
            (coordinate, type, pillagable)
        VALUES
            ($1, $2, $3);`
    
    await db.query(addQuery, [coordinate, 'oasis', true])
        .catch(err => console.log(`Error: ${err.code}`));
}

async function add_village(db, info) {
    const { coordinate, type, layout, distance } = info;
    const addQuery = `
        INSERT INTO tiles 
            (coordinate, type, layout, distance, pillagable)
        VALUES
            ($1, $2, $3, $4, $5);`
    
    await db.query(addQuery, [coordinate, type, layout, distance, false])
        .catch(err => console.log(`Error: ${err.code}`));
}

module.exports = {
    create_tile_table, get_tile, add_oasis, add_village
}
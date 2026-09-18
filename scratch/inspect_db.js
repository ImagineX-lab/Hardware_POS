const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.env.APPDATA, 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

async function inspect() {
    const items = await new Promise((res, rej) => {
        db.all('SELECT name, category, subCategory, unit, packSize, packUnit, loosePrice, sellPrice, qty FROM items ORDER BY id DESC LIMIT 50', [], (err, rows) => {
            if (err) rej(err); else res(rows);
        });
    });
    console.log('Recent 50 items:');
    items.forEach(it => console.log(JSON.stringify(it)));

    const categories = await new Promise((res, rej) => {
        db.all('SELECT DISTINCT category, subCategory FROM items ORDER BY category, subCategory', [], (err, rows) => {
            if (err) rej(err); else res(rows);
        });
    });
    console.log('\nAll Category pairs:');
    categories.forEach(c => console.log(`${c.category} -> ${c.subCategory}`));

    // Search for any existing cable/wire items
    const cables = await new Promise((res, rej) => {
        db.all("SELECT * FROM items WHERE name LIKE '%cable%' OR name LIKE '%wire%' OR name LIKE '%Kelani%' OR name LIKE '%Sun%' OR category LIKE '%විදුලි%'", [], (err, rows) => {
            if (err) rej(err); else res(rows);
        });
    });
    console.log('\nExisting Cable / Electrical items:');
    cables.forEach(c => console.log(JSON.stringify(c)));

    // Search for blades / discs / උදලු
    const blades = await new Promise((res, rej) => {
        db.all("SELECT * FROM items WHERE name LIKE '%disc%' OR name LIKE '%තල%' OR name LIKE '%උදලු%'", [], (err, rows) => {
            if (err) rej(err); else res(rows);
        });
    });
    console.log('\nExisting Blades / Discs:');
    blades.forEach(b => console.log(JSON.stringify(b)));

    // Search for gum / glue / silicone / putty
    const gums = await new Promise((res, rej) => {
        db.all("SELECT * FROM items WHERE name LIKE '%gum%' OR name LIKE '%glue%' OR name LIKE '%silicone%' OR name LIKE '%araldite%' OR name LIKE '%multibond%' OR name LIKE '%eurofix%' OR name LIKE '%putty%' OR name LIKE '%පොටි%' OR name LIKE '%ගම්%'", [], (err, rows) => {
            if (err) rej(err); else res(rows);
        });
    });
    console.log('\nExisting Gums / Glues / Putty:');
    gums.forEach(g => console.log(JSON.stringify(g)));

    db.close();
}

inspect();

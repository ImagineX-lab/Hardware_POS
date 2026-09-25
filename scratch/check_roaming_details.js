const sqlite3 = require('sqlite3').verbose();
const path = 'C:\\Users\\Saluka\\AppData\\Roaming\\hardware-pos\\pos.db';
const db = new sqlite3.Database(path);

const checkQueries = [
  "SELECT id, name, category, subCategory, unit, qty, sellPrice FROM items WHERE name LIKE '%1 1/2%ශොකට්%' OR name LIKE '%1 1/2%Socket%' OR name LIKE '%Gate%' OR name LIKE '%ඇස්බැ%' OR name LIKE '%L Bow%' OR name LIKE '%T slon%' OR name LIKE '%1 1/2%Arpico%'",
  "SELECT id, name, category, subCategory, unit, qty, sellPrice FROM items WHERE id BETWEEN 420 AND 460"
];

db.all(checkQueries[1], [], (err, rows) => {
  if (err) console.error(err);
  console.log('--- IDs 420 to 460 in Roaming DB ---');
  rows.forEach(r => console.log(`[${r.id}] ${r.name} | ${r.category} > ${r.subCategory} | Unit: ${r.unit} | Qty: ${r.qty} | Price: ${r.sellPrice}`));
  
  db.all(checkQueries[0], [], (err2, rows2) => {
    if (err2) console.error(err2);
    console.log('\n--- Specific matches in Roaming DB ---');
    rows2.forEach(r => console.log(`[${r.id}] ${r.name} | ${r.category} > ${r.subCategory} | Unit: ${r.unit} | Qty: ${r.qty} | Price: ${r.sellPrice}`));
    db.close();
  });
});

const sqlite3 = require('sqlite3').verbose();
const path = 'C:\\Users\\Saluka\\AppData\\Roaming\\hardware-pos\\pos.db';
const db = new sqlite3.Database(path);

db.all("SELECT id, name, category, subCategory, unit, qty, sellPrice FROM items WHERE subCategory IN ('S-lon බට', 'Anton/National/Arpico බට', 'Sloan බට', 'ලෝකල් බට') OR name LIKE '%බට%' ORDER BY id", [], (err, rows) => {
  if (err) console.error(err);
  console.log(`Found ${rows ? rows.length : 0} items:`);
  rows.forEach(r => console.log(`[${r.id}] ${r.name} | Cat: ${r.category} > ${r.subCategory} | Unit: ${r.unit} | Qty: ${r.qty} | Price: ${r.sellPrice}`));
  db.close();
});

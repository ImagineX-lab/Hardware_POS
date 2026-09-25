const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join('d:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db');
const db = new Database(dbPath, { readonly: true });

const matchNames = [
  '100kg තරාදි',
  'ඉලෙක්ට්රික් තරාදි',
  'කොමොඩ් ඇණ',
  'ඩ්රිල් කටු',
  'Ronghui',
  'OURUISI',
  'දම් වැල්',
];

const results = [];
for (const term of matchNames) {
  const rows = db.prepare(`SELECT id, name, category, subCategory, unit, qty, sellPrice, loosePrice, barcode FROM items WHERE name LIKE ?`).all(`%${term}%`);
  results.push(...rows);
}

if (results.length === 0) {
  console.log('No matching items found.');
} else {
  console.log(`Found ${results.length} existing matching items:`);
  for (const r of results) {
    console.log(`[${r.id}] "${r.name}" | Cat: ${r.category} > ${r.subCategory} | Unit: ${r.unit} | Qty: ${r.qty} | Price: ${r.sellPrice} | Loose: ${r.loosePrice} | Barcode: ${r.barcode}`);
  }
}
db.close();

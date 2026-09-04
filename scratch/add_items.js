const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'backend', 'pos.db');
const db = new sqlite3.Database(dbPath);

const items = [
  { name: 'Aluminium \u0db6\u0dcf\u0dbd\u0dca\u0daf\u0dd2 - \u0dbd\u0ddc\u0d9a\u0dd4', category: 'Buckets', unit: 'pcs', costPrice: 0, sellPrice: 960, qty: 0, reorderLevel: 5 },
  { name: 'Aluminium \u0db6\u0dcf\u0dbd\u0dca\u0daf\u0dd2 - \u0db4\u0ddc\u0da9\u0dd2', category: 'Buckets', unit: 'pcs', costPrice: 0, sellPrice: 850, qty: 0, reorderLevel: 5 },
  { name: 'Plastic \u0db6\u0dcf\u0dbd\u0dca\u0daf\u0dd2', category: 'Buckets', unit: 'pcs', costPrice: 0, sellPrice: 850, qty: 0, reorderLevel: 5 },
  { name: '\u0d9a\u0ddc\u0dc4\u0dd4 \u0d9a\u0ddc\u0dc3\u0dd4', category: 'Cleaning', unit: 'pcs', costPrice: 0, sellPrice: 5, qty: 0, reorderLevel: 5 },
  { name: 'Plastic \u0d9a\u0ddc\u0dc3\u0dd4', category: 'Cleaning', unit: 'pcs', costPrice: 0, sellPrice: 5, qty: 0, reorderLevel: 5 },
  { name: '\u0db8\u0d9a\u0dd4\u0dbd\u0dd4 \u0daf\u0dbd\u0dca \u0d9a\u0da9\u0db1 \u0d87\u0dc0\u0dcf', category: 'Cleaning', unit: 'pcs', costPrice: 0, sellPrice: 6, qty: 0, reorderLevel: 5 },
  { name: 'Mop', category: 'Cleaning', unit: 'pcs', costPrice: 0, sellPrice: 3, qty: 0, reorderLevel: 5 },
  { name: 'Wiper', category: 'Cleaning', unit: 'pcs', costPrice: 0, sellPrice: 4, qty: 0, reorderLevel: 5 },
  { name: 'Toilet \u0d9a\u0ddc\u0dc3\u0dd4', category: 'Cleaning', unit: 'pcs', costPrice: 0, sellPrice: 5, qty: 0, reorderLevel: 5 },
  { name: 'Plastic \u0dbb\u0dd0\u0d9a\u0dca\u0d9a\u0dcf', category: 'Storage', unit: 'pcs', costPrice: 0, sellPrice: 3, qty: 0, reorderLevel: 5 }
];

const sql = `INSERT INTO items (name, barcode, category, subCategory, unit, costPrice, sellPrice, qty, reorderLevel, description, image, packSize, packUnit, loosePrice, createdAt) VALUES (?, '', ?, '', ?, ?, ?, ?, ?, '', '', 1, '', 0, ?)`;

(async () => {
  for (const item of items) {
    await new Promise((resolve, reject) => {
      db.run(sql, [item.name, item.category, item.unit, item.costPrice, item.sellPrice, item.qty, item.reorderLevel, Date.now()], function(err) {
        if (err) { console.error('Error:', item.name, err.message); reject(err); }
        else { console.log('Added:', item.name, '- ID:', this.lastID); resolve(); }
      });
    });
  }
  db.close(() => console.log('\nAll items added successfully!'));
})();

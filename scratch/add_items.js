const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'backend', 'pos.db');
const db = new sqlite3.Database(dbPath);

const items = [
  { name: 'Aluminium බාල්දි - ලොකු', category: 'ගෘහ උපකරණ', unit: 'pcs', costPrice: 0, sellPrice: 960, qty: 0, reorderLevel: 5 },
  { name: 'Aluminium බාල්දි - පොඩි', category: 'ගෘහ උපකරණ', unit: 'pcs', costPrice: 0, sellPrice: 850, qty: 0, reorderLevel: 5 },
  { name: 'Plastic බාල්දි', category: 'ගෘහ උපකරණ', unit: 'pcs', costPrice: 0, sellPrice: 850, qty: 0, reorderLevel: 5 },
  { name: 'කොහු කොසු', category: 'ගෘහ උපකරණ', unit: 'pcs', costPrice: 0, sellPrice: 5, qty: 0, reorderLevel: 5 },
  { name: 'Plastic කොසු', category: 'ගෘහ උපකරණ', unit: 'pcs', costPrice: 0, sellPrice: 5, qty: 0, reorderLevel: 5 },
  { name: 'මකුලු දල් කඩන ඇවා', category: 'ගෘහ උපකරණ', unit: 'pcs', costPrice: 0, sellPrice: 6, qty: 0, reorderLevel: 5 },
  { name: 'Mop', category: 'ගෘහ උපකරණ', unit: 'pcs', costPrice: 0, sellPrice: 3, qty: 0, reorderLevel: 5 },
  { name: 'Wiper', category: 'ගෘහ උපකරණ', unit: 'pcs', costPrice: 0, sellPrice: 4, qty: 0, reorderLevel: 5 },
  { name: 'Toilet කොසු', category: 'ගෘහ උපකරණ', unit: 'pcs', costPrice: 0, sellPrice: 5, qty: 0, reorderLevel: 5 },
  { name: 'Plastic රැක්කා', category: 'ගෘහ උපකරණ', unit: 'pcs', costPrice: 0, sellPrice: 3, qty: 0, reorderLevel: 5 }
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

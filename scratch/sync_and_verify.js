const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const targetItems = [
  { name: '6" - 0.30 අමානෝ Gate ෂීට්', category: 'සෙවිලි උපකරණ', subCategory: 'Amano Sheets', unit: 'ft', costPrice: 0, sellPrice: 320, qty: 0, packSize: 1, packUnit: 'ft', loosePrice: 320, description: '6" - 0.30 Amano Gate Sheet (අඩිය රු. 320)' },
  { name: '6" - 0.25 අමානෝ Gate ෂීට්', category: 'සෙවිලි උපකරණ', subCategory: 'Amano Sheets', unit: 'ft', costPrice: 0, sellPrice: 250, qty: 0, packSize: 1, packUnit: 'ft', loosePrice: 250, description: '6" - 0.25 Amano Gate Sheet (අඩිය රු. 250)' },
  { name: '6" - 0.20 අමානෝ Gate ෂීට්', category: 'සෙවිලි උපකරණ', subCategory: 'Amano Sheets', unit: 'ft', costPrice: 0, sellPrice: 200, qty: 0, packSize: 1, packUnit: 'ft', loosePrice: 200, description: '6" - 0.20 Amano Gate Sheet (අඩිය රු. 200)' },
  { name: '5" - 0.30 අමානෝ Gate ෂීට්', category: 'සෙවිලි උපකරණ', subCategory: 'Amano Sheets', unit: 'ft', costPrice: 0, sellPrice: 320, qty: 0, packSize: 1, packUnit: 'ft', loosePrice: 320, description: '5" - 0.30 Amano Gate Sheet (අඩිය රු. 320)' },
  { name: '5" - 0.25 අමානෝ Gate ෂීට්', category: 'සෙවිලි උපකරණ', subCategory: 'Amano Sheets', unit: 'ft', costPrice: 0, sellPrice: 250, qty: 0, packSize: 1, packUnit: 'ft', loosePrice: 250, description: '5" - 0.25 Amano Gate Sheet (අඩිය රු. 250)' },
  { name: '5" - 0.20 අමානෝ Gate ෂීට්', category: 'සෙවිලි උපකරණ', subCategory: 'Amano Sheets', unit: 'ft', costPrice: 0, sellPrice: 200, qty: 0, packSize: 1, packUnit: 'ft', loosePrice: 200, description: '5" - 0.20 Amano Gate Sheet (අඩිය රු. 200)' },
  { name: '4" - 0.30 අමානෝ Gate ෂීට්', category: 'සෙවිලි උපකරණ', subCategory: 'Amano Sheets', unit: 'ft', costPrice: 0, sellPrice: 320, qty: 0, packSize: 1, packUnit: 'ft', loosePrice: 320, description: '4" - 0.30 Amano Gate Sheet (අඩිය රු. 320)' },
  { name: '4" - 0.25 අමානෝ Gate ෂීට්', category: 'සෙවිලි උපකරණ', subCategory: 'Amano Sheets', unit: 'ft', costPrice: 0, sellPrice: 250, qty: 0, packSize: 1, packUnit: 'ft', loosePrice: 250, description: '4" - 0.25 Amano Gate Sheet (අඩිය රු. 250)' },
  { name: '4" - 0.20 අමානෝ Gate ෂීට්', category: 'සෙවිලි උපකරණ', subCategory: 'Amano Sheets', unit: 'ft', costPrice: 0, sellPrice: 200, qty: 0, packSize: 1, packUnit: 'ft', loosePrice: 200, description: '4" - 0.20 Amano Gate Sheet (අඩිය රු. 200)' },
  { name: 'ඇස්බැස්ටෝ sheet අඩි 6 (අලියා sheet)', category: 'සෙවිලි උපකරණ', subCategory: 'ඇස්බැස්ටෝස් sheets', unit: 'sheet', costPrice: 0, sellPrice: 3500, qty: 50, packSize: 1, packUnit: 'sheet', loosePrice: 0, description: 'ඇස්බැස්ටෝ sheet (අලියා sheet) - අඩි 6: රු. 3,500' },
  { name: 'ඇස්බැස්ටෝ sheet අඩි 8 (අලියා sheet)', category: 'සෙවිලි උපකරණ', subCategory: 'ඇස්බැස්ටෝස් sheets', unit: 'sheet', costPrice: 0, sellPrice: 4950, qty: 81, packSize: 1, packUnit: 'sheet', loosePrice: 0, description: 'ඇස්බැස්ටෝ sheet (අලියා sheet) - අඩි 8: රු. 4,950' },
  { name: 'ඇස්බැස්ටෝ sheet අඩි 10 (අලියා sheet)', category: 'සෙවිලි උපකරණ', subCategory: 'ඇස්බැස්ටෝස් sheets', unit: 'sheet', costPrice: 0, sellPrice: 5800, qty: 13, packSize: 1, packUnit: 'sheet', loosePrice: 0, description: 'ඇස්බැස්ටෝ sheet (අලියා sheet) - අඩි 10: රු. 5,800' },
  { name: 'ඇස්බැස්ටෝ sheet අඩි 12 (අලියා sheet)', category: 'සෙවිලි උපකරණ', subCategory: 'ඇස්බැස්ටෝස් sheets', unit: 'sheet', costPrice: 0, sellPrice: 6950, qty: 20, packSize: 1, packUnit: 'sheet', loosePrice: 0, description: 'ඇස්බැස්ටෝ sheet (අලියා sheet) - අඩි 12: රු. 6,950' },
  { name: '1 1/2" ශොකට් (නෝමල්)', category: 'පයිප්ප හා සනිටරි', subCategory: 'Anton/National/Arpico බට', unit: 'pcs', costPrice: 0, sellPrice: 280, qty: 50, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: '1 1/2" Normal Socket' },
  { name: '1 1/2" ශොකට් (S-lon)', category: 'පයිප්ප හා සනිටරි', subCategory: 'S-lon බට', unit: 'pcs', costPrice: 0, sellPrice: 250, qty: 3, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: '1 1/2" S-lon Socket' },
  { name: '1/2" T (S-lon)', category: 'පයිප්ප හා සනිටරි', subCategory: 'S-lon බට', unit: 'pcs', costPrice: 0, sellPrice: 100, qty: 50, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: '1/2" T Socket (S-lon)' },
  { name: '1" L Bow (නෝමල්)', category: 'පයිප්ප හා සනිටරි', subCategory: 'Anton/National/Arpico බට', unit: 'pcs', costPrice: 0, sellPrice: 120, qty: 50, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: '1" L Bow (Normal) / අගල L Bow' },
  { name: '1" L Bow (S-lon)', category: 'පයිප්ප හා සනිටරි', subCategory: 'S-lon බට', unit: 'pcs', costPrice: 0, sellPrice: 150, qty: 25, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: '1" L Bow (S-lon) / අගල L Bow (S-lon)' },
  { name: '1 1/2" ශොකට් (Arpico)', category: 'පයිප්ප හා සනිටරි', subCategory: 'Anton/National/Arpico බට', unit: 'pcs', costPrice: 0, sellPrice: 220, qty: 50, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: '1 1/2" Arpico Socket' }
];

const dbPaths = [
  'D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\hardware-pos\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\Hardware POS\\pos.db',
];

function processAll() {
  for (const p of dbPaths) {
    if (!fs.existsSync(p)) continue;
    const db = new sqlite3.Database(p);
    
    db.serialize(() => {
      // Find and remove any duplicates by name
      db.all("SELECT name, count(*) as cnt, min(id) as keep_id FROM items GROUP BY name HAVING count(*) > 1", [], (err, rows) => {
        if (err) console.error(err);
        if (rows && rows.length > 0) {
          rows.forEach(r => {
            db.run("DELETE FROM items WHERE name = ? AND id != ?", [r.name, r.keep_id], (delErr) => {
              if (delErr) console.error(delErr);
              else console.log(`[${p}] Removed duplicates for "${r.name}" (kept ID ${r.keep_id})`);
            });
          });
        }
      });

      // Verify all items are updated correctly
      targetItems.forEach(item => {
        db.run(
          `UPDATE items SET category = ?, subCategory = ?, unit = ?, costPrice = ?, sellPrice = ?, qty = ?, packSize = ?, packUnit = ?, loosePrice = ?, description = ? WHERE name = ?`,
          [item.category, item.subCategory, item.unit, item.costPrice, item.sellPrice, item.qty, item.packSize, item.packUnit, item.loosePrice, item.description, item.name],
          function(err) {
            if (err) console.error(err);
          }
        );
      });
    });

    setTimeout(() => {
      db.all("SELECT id, name, unit, qty, sellPrice, barcode FROM items WHERE name IN (" + targetItems.map(() => '?').join(',') + ") ORDER BY name", targetItems.map(i => i.name), (err, rows) => {
        console.log(`\nVerified ${rows ? rows.length : 0} items in ${p}`);
        db.close();
      });
    }, 1500);
  }
}

processAll();

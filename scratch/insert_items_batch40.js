const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. Sun Box Cup | 34 | 100
  {
    name: 'Sun Box Cup',
    matchNames: ['Sun Box Cup', 'sun box cup', 'sunbox cup'],
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 100,
    qty: 34,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 2. 20mm Lock | 9 | 200
  {
    name: '20mm Lock',
    matchNames: ['20mm Lock', '20mm lock', '20 mm lock'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'අගල් (Locks)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 200,
    qty: 9,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 3. 25mm Lock | 19 | 250
  {
    name: '25mm Lock',
    matchNames: ['25mm Lock', '25mm lock', '25 mm lock'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'අගල් (Locks)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 250,
    qty: 19,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 4. 40mm Lock | 7 | 350
  {
    name: '40mm Lock',
    matchNames: ['40mm Lock', '40mm lock', '40 mm lock'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'අගල් (Locks)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 350,
    qty: 7,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 5. 30mm Lock | 1 | 300
  {
    name: '30mm Lock',
    matchNames: ['30mm Lock', '30mm lock', '30 mm lock'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'අගල් (Locks)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 300,
    qty: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 6. 50mm Lock | 10 | 750
  {
    name: '50mm Lock',
    matchNames: ['50mm Lock', '50mm lock', '50 mm lock'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'අගල් (Locks)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 7. 60mm Lock | 1 | 850
  {
    name: '60mm Lock',
    matchNames: ['60mm Lock', '60mm lock', '60 mm lock'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'අගල් (Locks)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 850,
    qty: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 8. 50mm (KPL) Lock | 3 | 950
  {
    name: '50mm (KPL) Lock',
    matchNames: ['50mm (KPL) Lock', '50mm KPL lock', '50 mm KPL lock'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'අගල් (Locks)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 950,
    qty: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 9. 63mm (KPL) Lock | 6 | 1200
  {
    name: '63mm (KPL) Lock',
    matchNames: ['63mm (KPL) Lock', '63mm KPL lock', '63 mm KPL lock'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'අගල් (Locks)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 6,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 10. BOYA Lock | 2 | 560
  {
    name: 'BOYA Lock',
    matchNames: ['BOYA Lock', 'boya lock', 'Boya Lock'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'අගල් (Locks)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 560,
    qty: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 11. Wajra Lock 40mm | 5 | 700
  {
    name: 'Wajra Lock 40mm',
    matchNames: ['Wajra Lock 40mm', 'wajra lock 40mm', 'Wajra 40mm lock'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'අගල් (Locks)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 700,
    qty: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 12. Lock Set 350 | 2 | 350
  {
    name: 'Lock Set (350)',
    matchNames: ['Lock Set (350)', 'Lock Set 350', 'lock set 350'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'අගල් (Locks)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 350,
    qty: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 13. Lock Set 325 | 4 | 325
  {
    name: 'Lock Set (325)',
    matchNames: ['Lock Set (325)', 'Lock Set 325', 'lock set 325'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'අගල් (Locks)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 325,
    qty: 4,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 14. Lock Set 225 | 2 | 225
  {
    name: 'Lock Set (225)',
    matchNames: ['Lock Set (225)', 'Lock Set 225', 'lock set 225'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'අගල් (Locks)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 225,
    qty: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 15. Purasada punkalas | 3 | 650
  {
    name: 'පුරසදා පුංකලස්',
    matchNames: ['පුරසදා පුංකලස්', 'Purasada punkalas', 'purasada punkalas'],
    category: 'ගෘහ උපකරණ',
    subCategory: 'ගෘහ උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 650,
    qty: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 16. Sinck Tap (large) Kevin | 2 | 4550
  {
    name: 'Sink Tap Kevin (Large)',
    matchNames: ['Sink Tap Kevin (Large)', 'Sinck Tap (large) Kevin', 'sink tap kevin large'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'සනිටරි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4550,
    qty: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 17. Sinck Tap (large) 3600 | 1 | 3600
  {
    name: 'Sink Tap (Large) 3600',
    matchNames: ['Sink Tap (Large) 3600', 'Sinck Tap (large) 3600', 'sink tap large 3600'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'සනිටරි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 3600,
    qty: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 18. Sinck Tap (large) J Look | 1 | 850
  {
    name: 'Sink Tap J Look (Large)',
    matchNames: ['Sink Tap J Look (Large)', 'Sinck Tap (large) J Look', 'sink tap J look large'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'සනිටරි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 850,
    qty: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 19. Sinck Tap (large)water link | 2 | 650
  {
    name: 'Sink Tap Water Link (Large)',
    matchNames: ['Sink Tap Water Link (Large)', 'Sinck Tap (large)water link', 'sink tap water link large'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'සනිටරි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 650,
    qty: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 20. Sinck Tap (large)mango/G | 1 | 730
  {
    name: 'Sink Tap Mango/G (Large)',
    matchNames: ['Sink Tap Mango/G (Large)', 'Sinck Tap (large)mango/G', 'sink tap mango large'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'සනිටරි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 730,
    qty: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 21. Sinck Tap (large)Fullrain | 3 | 4950
  {
    name: 'Sink Tap Fullrain (Large)',
    matchNames: ['Sink Tap Fullrain (Large)', 'Sinck Tap (large)Fullrain', 'sink tap fullrain large'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'සනිටරි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4950,
    qty: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 22. Sinck Tap (large)VENUS | 1 | 3250
  {
    name: 'Sink Tap VENUS (Large)',
    matchNames: ['Sink Tap VENUS (Large)', 'Sinck Tap (large)VENUS', 'sink tap venus large'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'සනිටරි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 3250,
    qty: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 23. Sinck Tap (large)FRINKO | 1 | 1300
  {
    name: 'Sink Tap FRINKO (Large)',
    matchNames: ['Sink Tap FRINKO (Large)', 'Sinck Tap (large)FRINKO', 'sink tap frinko large'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'සනිටරි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1300,
    qty: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 24. Sinck Tap (large)OPALLO | 3 | 1200
  {
    name: 'Sink Tap OPALLO (Large)',
    matchNames: ['Sink Tap OPALLO (Large)', 'Sinck Tap (large)OPALLO', 'sink tap opallo large'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'සනිටරි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 25. Sinck Tap (large)2750 | 2 | 2750
  {
    name: 'Sink Tap (Large) 2750',
    matchNames: ['Sink Tap (Large) 2750', 'Sinck Tap (large)2750', 'sink tap large 2750'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'සනිටරි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2750,
    qty: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 26. Sinck Tap (large)Green/F | 3 | 1250
  {
    name: 'Sink Tap Green/F (Large)',
    matchNames: ['Sink Tap Green/F (Large)', 'Sinck Tap (large)Green/F', 'sink tap green large'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'සනිටරි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1250,
    qty: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 27. Sink push 1250 | 3 | 1250
  {
    name: 'Sink Push (1250)',
    matchNames: ['Sink Push (1250)', 'Sink push 1250', 'sink push 1250'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'සනිටරි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1250,
    qty: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 28. Sink push 850 | 2 | 850
  {
    name: 'Sink Push (850)',
    matchNames: ['Sink Push (850)', 'Sink push 850', 'sink push 850'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'සනිටරි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 850,
    qty: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
];

function generateBarcode() {
  return '20' + Math.floor(Math.random() * 9999999999).toString().padStart(10, '0');
}

const dbPaths = [
  'D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\hardware-pos\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\Hardware POS\\pos.db',
];

function processDatabase(dbPath) {
  return new Promise((resolve) => {
    if (!fs.existsSync(dbPath)) {
      console.log(`[SKIP] DB not found: ${dbPath}`);
      return resolve();
    }

    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error(`[ERROR] Cannot open ${dbPath}:`, err.message);
        return resolve();
      }
    });

    db.serialize(() => {
      let completed = 0;
      const total = itemsToAdd.length;

      itemsToAdd.forEach((item) => {
        const placeholders = item.matchNames.map(() => 'name = ?').join(' OR ');
        const checkSql = `SELECT id, name, qty, sellPrice FROM items WHERE ${placeholders}`;

        db.get(checkSql, item.matchNames, (err, existing) => {
          if (err) {
            console.error(`[ERROR] Checking "${item.name}":`, err.message);
          } else if (existing) {
            console.log(`[EXISTS] "${existing.name}" (ID:${existing.id}) | Qty:${existing.qty} | Price:${existing.sellPrice} — skipping`);
          } else {
            const barcode = generateBarcode();
            const insertSql = `
              INSERT INTO items (name, category, subCategory, unit, costPrice, sellPrice, qty, packSize, packUnit, loosePrice, barcode)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            db.run(
              insertSql,
              [
                item.name, item.category, item.subCategory, item.unit,
                item.costPrice, item.sellPrice, item.qty,
                item.packSize, item.packUnit, item.loosePrice, barcode,
              ],
              function (err) {
                if (err) {
                  console.error(`[ERROR] Inserting "${item.name}":`, err.message);
                } else {
                  console.log(`[INSERT] "${item.name}" | ID:${this.lastID} | Qty:${item.qty} | Price:${item.sellPrice} | Barcode:${barcode}`);
                }
              }
            );
          }

          completed++;
          if (completed === total) {
            db.close(() => {
              console.log(`\n✅ Done: ${dbPath}\n`);
              resolve();
            });
          }
        });
      });
    });
  });
}

(async () => {
  for (const dbPath of dbPaths) {
    await processDatabase(dbPath);
  }
  console.log('🎉 All databases processed!');
})();

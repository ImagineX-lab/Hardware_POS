const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. B/Sky 100ml | 2 | 350
  {
    name: 'E/M (B/Sky) 100ml',
    matchNames: ['E/M (B/Sky) 100ml', 'B/Sky 100ml', 'B/Sky paint 100ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 350,
    qty: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 2. Black 100ml | 20 | 300
  {
    name: 'E/M (Black) 100ml',
    matchNames: ['E/M (Black) 100ml', 'Black 100ml', 'Black paint 100ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 300,
    qty: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 3. Grey 50ml | 10 | 195
  {
    name: 'E/M (Grey) 50ml',
    matchNames: ['E/M (Grey) 50ml', 'Grey 50ml', 'Grey paint 50ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 195,
    qty: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 4. Red 50ml | 2 | 220
  {
    name: 'E/M (Red) 50ml',
    matchNames: ['E/M (Red) 50ml', 'Red 50ml', 'Red paint 50ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 220,
    qty: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 5. Red 100ml | 8 | 300
  {
    name: 'E/M (Red) 100ml',
    matchNames: ['E/M (Red) 100ml', 'Red 100ml', 'Red paint 100ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 300,
    qty: 8,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 6. R/O 100ml | 4 | 375
  {
    name: 'E/M (R/O) 100ml',
    matchNames: ['E/M (R/O) 100ml', 'R/O 100ml', 'R/O paint 100ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 375,
    qty: 4,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 7. (Br) 100ml Relose | 2 | 350
  {
    name: 'E/M (Br) Reoluse 100ml',
    matchNames: ['E/M (Br) Reoluse 100ml', '(Br) 100ml Relose', 'Br Relose 100ml', 'Br Reoluse 100ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 350,
    qty: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 8. Grey opel | 4 | 900
  {
    name: 'Grey Opel',
    matchNames: ['Grey Opel', 'Grey opel', 'grey opel paint'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 900,
    qty: 4,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 9. (B) Relouse 200ml | 1 | 890
  {
    name: 'E/M (B) Reoluse 200ml',
    matchNames: ['E/M (B) Reoluse 200ml', '(B) Relouse 200ml', 'B Relouse 200ml', 'B Reoluse 200ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 890,
    qty: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 10. (P) wall master 200ml | 3 | 950
  {
    name: 'E/M (P) wall master 200ml',
    matchNames: ['E/M (P) wall master 200ml', '(P) wall master 200ml', 'P wall master 200ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 950,
    qty: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 11. C/L wall master 200ml | 4 | 690
  {
    name: 'E/M (C/L) wall master 200ml',
    matchNames: ['E/M (C/L) wall master 200ml', 'C/L wall master 200ml', 'C/L wallmaster 200ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 690,
    qty: 4,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 12. H/H wall master 200ml | 2 | 690
  {
    name: 'E/M (H/H) wall master 200ml',
    matchNames: ['E/M (H/H) wall master 200ml', 'H/H wall master 200ml', 'H/H wallmaster 200ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 690,
    qty: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 13. G/Y wall master 200ml | 3 | 690
  {
    name: 'E/M (G/Y) wall master 200ml',
    matchNames: ['E/M (G/Y) wall master 200ml', 'G/Y wall master 200ml', 'G/Y wallmaster 200ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 690,
    qty: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 14. J/Y wall master 200ml | 4 | 690
  {
    name: 'E/M (J/Y) wall master 200ml',
    matchNames: ['E/M (J/Y) wall master 200ml', 'J/Y wall master 200ml', 'J/Y wallmaster 200ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 690,
    qty: 4,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 15. A/B wall master 200ml | 3 | 690
  {
    name: 'E/M (A/B) wall master 200ml',
    matchNames: ['E/M (A/B) wall master 200ml', 'A/B wall master 200ml', 'A/B wallmaster 200ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 690,
    qty: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 16. R/B wall master 200ml | 3 | 690
  {
    name: 'E/M (R/B) wall master 200ml',
    matchNames: ['E/M (R/B) wall master 200ml', 'R/B wall master 200ml', 'R/B wallmaster 200ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 690,
    qty: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 17. P/B wall master 200ml | 1 | 690
  {
    name: 'E/M (P/B) wall master 200ml',
    matchNames: ['E/M (P/B) wall master 200ml', 'P/B wall master 200ml', 'P/B wallmaster 200ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 690,
    qty: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 18. S/P/2 wall master 200ml | 3 | 690
  {
    name: 'E/M (S/P/2) wall master 200ml',
    matchNames: ['E/M (S/P/2) wall master 200ml', 'S/P/2 wall master 200ml', 'S/P/2 wallmaster 200ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 690,
    qty: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 19. R wall master 200ml | 6 | 690
  {
    name: 'E/M (R) wall master 200ml',
    matchNames: ['E/M (R) wall master 200ml', 'R wall master 200ml', 'R wallmaster 200ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 690,
    qty: 6,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 20. W KSS 200ml | 3 | 860
  {
    name: 'E/M (W) KSS 200ml',
    matchNames: ['E/M (W) KSS 200ml', 'W KSS 200ml', 'W KSS paint 200ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 860,
    qty: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 21. G/R wall master 200ml | 3 | 840
  {
    name: 'E/M (G/R) wall master 200ml',
    matchNames: ['E/M (G/R) wall master 200ml', 'G/R wall master 200ml', 'G/R wallmaster 200ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 840,
    qty: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 22. (P) KSS 200ml | 3 | 520
  {
    name: 'E/M (P) KSS 200ml',
    matchNames: ['E/M (P) KSS 200ml', '(P) KSS 200ml', 'P KSS 200ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 520,
    qty: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 23. (W) Relouse 200ml | 6 | 890
  {
    name: 'E/M (W) Reoluse 200ml',
    matchNames: ['E/M (W) Reoluse 200ml', '(W) Relouse 200ml', 'W Relouse 200ml', 'W Reoluse 200ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 890,
    qty: 6,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 24. M/W Relouse 200ml | 2 | 890
  {
    name: 'E/M (M/W) Reoluse 200ml',
    matchNames: ['E/M (M/W) Reoluse 200ml', 'M/W Relouse 200ml', 'M/W Reoluse 200ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 890,
    qty: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 25. G Relouse 200ml | 3 | 810
  {
    name: 'E/M (G) Reoluse 200ml',
    matchNames: ['E/M (G) Reoluse 200ml', 'G Relouse 200ml', 'G Reoluse 200ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 810,
    qty: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 26. B/M Relouse 200ml | 1 | 810
  {
    name: 'E/M (B/M) Reoluse 200ml',
    matchNames: ['E/M (B/M) Reoluse 200ml', 'B/M Relouse 200ml', 'B/M Reoluse 200ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 810,
    qty: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 27. A/B Relouse 200ml | 1 | 770
  {
    name: 'E/M (A/B) Reoluse 200ml',
    matchNames: ['E/M (A/B) Reoluse 200ml', 'A/B Relouse 200ml', 'A/B Reoluse 200ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 770,
    qty: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 28. D/B Relouse 200ml | 1 | 560
  {
    name: 'E/M (D/B) Reoluse 200ml',
    matchNames: ['E/M (D/B) Reoluse 200ml', 'D/B Relouse 200ml', 'D/B Reoluse 200ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 560,
    qty: 1,
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

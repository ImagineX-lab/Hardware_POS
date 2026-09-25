const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. Sink push 750 | 3 | 750
  {
    name: 'Sink Push (750)',
    matchNames: ['Sink Push (750)', 'Sink push 750', 'sink push 750'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'සනිටරි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 3,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
  },
  // 2. Sink push 1200 | 6 | 1200
  {
    name: 'Sink Push (1200)',
    matchNames: ['Sink Push (1200)', 'Sink push 1200', 'sink push 1200'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'සනිටරි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 6,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
  },
  // 3. Sink push 650 | 1 | 650
  {
    name: 'Sink Push (650)',
    matchNames: ['Sink Push (650)', 'Sink push 650', 'sink push 650'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'සනිටරි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 650,
    qty: 1,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
  },
  // 4. රතු කුඩු Tin 1kg | 17 | 1500
  {
    name: 'රතු කුඩු Tin 1kg',
    matchNames: ['රතු කුඩු Tin 1kg', 'ratu kudu tin 1kg', 'red powder tin 1kg'],
    category: 'පින්තාරු',
    subCategory: 'කුඩු / Powder',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1500,
    qty: 17,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
  },
  // 5. කළු කුඩු Tin 1kg | 5 | 1500
  {
    name: 'කළු කුඩු Tin 1kg',
    matchNames: ['කළු කුඩු Tin 1kg', 'kalu kudu tin 1kg', 'black powder tin 1kg'],
    category: 'පින්තාරු',
    subCategory: 'කුඩු / Powder',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1500,
    qty: 5,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
  },
  // 6. කළු කුඩු Tin 5kg | 2 | 5500
  {
    name: 'කළු කුඩු Tin 5kg',
    matchNames: ['කළු කුඩු Tin 5kg', 'kalu kudu tin 5kg', 'black powder tin 5kg'],
    category: 'පින්තාරු',
    subCategory: 'කුඩු / Powder',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 5500,
    qty: 2,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
  },
  // 7. රතු කුඩු Tin 500g | 4 | 750
  {
    name: 'රතු කුඩු Tin 500g',
    matchNames: ['රතු කුඩු Tin 500g', 'ratu kudu tin 500g', 'red powder tin 500g'],
    category: 'පින්තාරු',
    subCategory: 'කුඩු / Powder',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 4,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
  },
  // 8. DEZOL glue 350ml | 5 | 290
  {
    name: 'DEZOL Glue 350ml',
    matchNames: ['DEZOL Glue 350ml', 'DEZOL glue 350ml', 'dezol glue 350ml'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇලවුම් (Adhesive)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 290,
    qty: 5,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
  },
  // 9. DEZOL glue 100ml | 3 | 125
  {
    name: 'DEZOL Glue 100ml',
    matchNames: ['DEZOL Glue 100ml', 'DEZOL glue 100ml', 'dezol glue 100ml'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇලවුම් (Adhesive)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 125,
    qty: 3,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
  },
  // 10. CHEMIFIX 500g | 10 | 890
  {
    name: 'CHEMIFIX 500g',
    matchNames: ['CHEMIFIX 500g', 'chemifix 500g', 'Chemifix 500g'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇලවුම් (Adhesive)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 890,
    qty: 10,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
  },
  // 11. CHEMIFIX 1kg | 2 | 1720
  {
    name: 'CHEMIFIX 1kg',
    matchNames: ['CHEMIFIX 1kg', 'chemifix 1kg', 'Chemifix 1kg'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇලවුම් (Adhesive)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1720,
    qty: 2,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
  },
  // 12. CHEMIFIX 250g | 7 | 490
  {
    name: 'CHEMIFIX 250g',
    matchNames: ['CHEMIFIX 250g', 'chemifix 250g', 'Chemifix 250g'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇලවුම් (Adhesive)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 490,
    qty: 7,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
  },
  // 13. Rite Fix 100ml | 3 | 315
  {
    name: 'Rite Fix 100ml',
    matchNames: ['Rite Fix 100ml', 'rite fix 100ml', 'RiteFix 100ml'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇලවුම් (Adhesive)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 315,
    qty: 3,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
  },
  // 14. DEZOL glue 40g | 6 | 60
  {
    name: 'DEZOL Glue 40g',
    matchNames: ['DEZOL Glue 40g', 'DEZOL glue 40g', 'dezol glue 40g'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇලවුම් (Adhesive)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 60,
    qty: 6,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
  },
  // 15. dash pintop-2 (Green) | 10 | 390
  {
    name: 'Dash Pintop-2 (Green)',
    matchNames: ['Dash Pintop-2 (Green)', 'dash pintop-2 (Green)', 'dash pintop2 green'],
    category: 'ගෘහ උපකරණ',
    subCategory: 'පිරිසිදුකාරක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 390,
    qty: 10,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
  },
  // 16. dash pintop-2 (purple) | 5 | 390
  {
    name: 'Dash Pintop-2 (Purple)',
    matchNames: ['Dash Pintop-2 (Purple)', 'dash pintop-2 (purple)', 'dash pintop2 purple'],
    category: 'ගෘහ උපකරණ',
    subCategory: 'පිරිසිදුකාරක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 390,
    qty: 5,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
  },
  // 17. TITAN ture polish 200ml | 2 | 590
  {
    name: 'TITAN Tyre Polish 200ml',
    matchNames: ['TITAN Tyre Polish 200ml', 'TITAN ture polish 200ml', 'titan tyre polish 200ml', 'titan ture polish 200ml'],
    category: 'ගෘහ උපකරණ',
    subCategory: 'පිරිසිදුකාරක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 590,
    qty: 2,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
  },
  // 18. (W) 50ml | 5 | 160
  {
    name: 'E/M (W) 50ml',
    matchNames: ['E/M (W) 50ml', '(W) 50ml', 'W paint 50ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 160,
    qty: 5,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
  },
  // 19. (P) 100ml | 20 | 310
  {
    name: 'E/M (P) 100ml',
    matchNames: ['E/M (P) 100ml', '(P) 100ml', 'P paint 100ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 310,
    qty: 20,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
  },
  // 20. (Y) 100ml | 17 | 310
  {
    name: 'E/M (Y) 100ml',
    matchNames: ['E/M (Y) 100ml', '(Y) 100ml', 'Y paint 100ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 310,
    qty: 17,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
  },
  // 21. (Br) 50ml | 9 | 195
  {
    name: 'E/M (Br) 50ml',
    matchNames: ['E/M (Br) 50ml', '(Br) 50ml', 'Br paint 50ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 195,
    qty: 9,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
  },
  // 22. (or) 50ml | 4 | 195
  {
    name: 'E/M (Or) 50ml',
    matchNames: ['E/M (Or) 50ml', '(or) 50ml', 'Or paint 50ml', 'orange paint 50ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 195,
    qty: 4,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
  },
  // 23. (or) 100ml | 10 | 310
  {
    name: 'E/M (Or) 100ml',
    matchNames: ['E/M (Or) 100ml', '(or) 100ml', 'Or paint 100ml', 'orange paint 100ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 310,
    qty: 10,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
  },
  // 24. (Br) 100ml | 9 | 310
  {
    name: 'E/M (Br) 100ml',
    matchNames: ['E/M (Br) 100ml', '(Br) 100ml', 'Br paint 100ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 310,
    qty: 9,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
  },
  // 25. (Blue) 100ml | 6 | 310
  {
    name: 'E/M (Blue) 100ml',
    matchNames: ['E/M (Blue) 100ml', '(Blue) 100ml', 'Blue paint 100ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 310,
    qty: 6,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
  },
  // 26. (sky) 50ml | 2 | 200
  {
    name: 'E/M (Sky) 50ml',
    matchNames: ['E/M (Sky) 50ml', '(sky) 50ml', 'sky paint 50ml', 'sky blue paint 50ml'],
    category: 'පින්තාරු',
    subCategory: 'ඊනෙල් / මැට් (E/M)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 200,
    qty: 2,
    packSize: 1, packUnit: 'pcs', loosePrice: 0,
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

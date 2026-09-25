const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. A/c M(B) purelac 1L | 10 | 2200
  {
    name: 'A/C M(B) Purelac 1L',
    matchNames: [
      'A/c M(B) purelac 1L',
      'A/C M(B) Purelac 1L',
      'A/c M(B) purelac 1l',
      'Purelac A/C M(B) 1L',
      'purelac a/c m(b) 1l'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 10,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Purelac Anticorrosive Paint M(B) 1L (පියුර්ලැක් ඇන්ටිකොරෝසිව් 1L) - රු. 2,200'
  },
  // 2. A/c (B) purelac 1L | 2 | 2200
  {
    name: 'A/C (B) Purelac 1L',
    matchNames: [
      'A/c (B) purelac 1L',
      'A/C (B) Purelac 1L',
      'A/c (B) purelac 1l',
      'Purelac A/C (B) 1L',
      'purelac a/c (b) 1l'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Purelac Anticorrosive Paint (B) 1L (පියුර්ලැක් ඇන්ටිකොරෝසිව් (B) 1L) - රු. 2,200'
  },
  // 3. A/c (G) purelac 1L | 2 | 2200
  {
    name: 'A/C (G) Purelac 1L',
    matchNames: [
      'A/c (G) purelac 1L',
      'A/C (G) Purelac 1L',
      'A/c (G) purelac 1l',
      'Purelac A/C (G) 1L',
      'purelac a/c (g) 1l'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Purelac Anticorrosive Paint Green 1L (පියුර්ලැක් ඇන්ටිකොරෝසිව් කොළ 1L) - රු. 2,200'
  },
  // 4. A/c (R) Reoluse 1L | 3 | 2200
  {
    name: 'A/C (R) Reoluxe 1L',
    matchNames: [
      'A/c (R) Reoluse 1L',
      'A/C (R) Reoluxe 1L',
      'A/c (R) Reoluxe 1L',
      'Reoluxe A/C (R) 1L',
      'reoluxe a/c (r) 1l'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluxe Anticorrosive Paint Red 1L (රියෝලක්ස් ඇන්ටිකොරෝසිව් රතු 1L) - රු. 2,200'
  },
  // 5. A/c (B) Reoluse 1L | 6 | 2200
  {
    name: 'A/C (B) Reoluxe 1L',
    matchNames: [
      'A/c (B) Reoluse 1L',
      'A/C (B) Reoluxe 1L',
      'A/c (B) Reoluxe 1L',
      'Reoluxe A/C (B) 1L',
      'reoluxe a/c (b) 1l'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluxe Anticorrosive Paint (B) 1L (රියෝලක්ස් ඇන්ටිකොරෝසිව් (B) 1L) - රු. 2,200'
  },
  // 6. A/c (W) Reoluse 1L | 2 | 2500
  {
    name: 'A/C (W) Reoluxe 1L',
    matchNames: [
      'A/c (W) Reoluse 1L',
      'A/C (W) Reoluxe 1L',
      'A/c (W) Reoluxe 1L',
      'Reoluxe A/C (W) 1L',
      'reoluxe a/c (w) 1l'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2500,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluxe Anticorrosive Paint White 1L (රියෝලක්ස් ඇන්ටිකොරෝසිව් සුදු 1L) - රු. 2,500'
  },
  // 7. A/c (W) Reoluse 500ml | 3 | 1300
  {
    name: 'A/C (W) Reoluxe 500ml',
    matchNames: [
      'A/c (W) Reoluse 500ml',
      'A/C (W) Reoluxe 500ml',
      'A/c (W) Reoluxe 500ml',
      'Reoluxe A/C (W) 500ml',
      'reoluxe a/c (w) 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1300,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluxe Anticorrosive Paint White 500ml (රියෝලක්ස් ඇන්ටිකොරෝසිව් සුදු 500ml) - රු. 1,300'
  },
  // 8. A/c (R) Reoluse 500ml | 4 | 1200
  {
    name: 'A/C (R) Reoluxe 500ml',
    matchNames: [
      'A/c (R) Reoluse 500ml',
      'A/C (R) Reoluxe 500ml',
      'A/c (R) Reoluxe 500ml',
      'Reoluxe A/C (R) 500ml',
      'reoluxe a/c (r) 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluxe Anticorrosive Paint Red 500ml (රියෝලක්ස් ඇන්ටිකොරෝසිව් රතු 500ml) - රු. 1,200'
  },
  // 9. A/c (B) J CHEM 1L | 2 | 1750
  {
    name: 'A/C (B) J CHEM 1L',
    matchNames: [
      'A/c (B) J CHEM 1L',
      'A/C (B) J CHEM 1L',
      'A/C (B) JCHEM 1L',
      'jchem a/c (b) 1l',
      'J CHEM A/C (B) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1750,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'J CHEM Anticorrosive Paint (B) 1L (ජයකෙම් ඇන්ටිකොරෝසිව් 1L) - රු. 1,750'
  },
  // 10. A/c (W) KSS 1L | 2 | 2200
  {
    name: 'A/C (W) KSS 1L',
    matchNames: [
      'A/c (W) KSS 1L',
      'A/C (W) KSS 1L',
      'KSS A/C (W) 1L',
      'kss a/c (w) 1l'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'KSS Anticorrosive Paint White 1L (KSS ඇන්ටිකොරෝසිව් සුදු 1L) - රු. 2,200'
  },
  // 11. A/c (B) Robbialac 500ml | 2 | 1200
  {
    name: 'A/C (B) Robbialac 500ml',
    matchNames: [
      'A/c (B) Robbialac 500ml',
      'A/C (B) Robbialac 500ml',
      'Robbialac A/C (B) 500ml',
      'robbialac a/c (b) 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Robbialac Anticorrosive Paint (B) 500ml (රොබියලැක් ඇන්ටිකොරෝසිව් 500ml) - රු. 1,200'
  },
  // 12. A/c (G) purelac 500ml | 2 | 1200
  {
    name: 'A/C (G) Purelac 500ml',
    matchNames: [
      'A/c (G) purelac 500ml',
      'A/C (G) Purelac 500ml',
      'Purelac A/C (G) 500ml',
      'purelac a/c (g) 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Purelac Anticorrosive Paint Green 500ml (පියුර්ලැක් ඇන්ටිකොරෝසිව් කොළ 500ml) - රු. 1,200'
  },
  // 13. A/c M(B) Reoluse 200ml | 6 | 600
  {
    name: 'A/C M(B) Reoluxe 200ml',
    matchNames: [
      'A/c M(B) Reoluse 200ml',
      'A/C M(B) Reoluxe 200ml',
      'A/c M(B) Reoluxe 200ml',
      'Reoluxe A/C M(B) 200ml',
      'reoluxe a/c m(b) 200ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 600,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluxe Anticorrosive Paint M(B) 200ml (රියෝලක්ස් ඇන්ටිකොරෝසිව් 200ml) - රු. 600'
  },
  // 14. A/c (G) KSS 200ml | 5 | 500
  {
    name: 'A/C (G) KSS 200ml',
    matchNames: [
      'A/c (G) KSS 200ml',
      'A/C (G) KSS 200ml',
      'KSS A/C (G) 200ml',
      'kss a/c (g) 200ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 500,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'KSS Anticorrosive Paint Green 200ml (KSS ඇන්ටිකොරෝසිව් කොළ 200ml) - රු. 500'
  },
  // 15. A/c (B) KSS 200ml | 2 | 500
  {
    name: 'A/C (B) KSS 200ml',
    matchNames: [
      'A/c (B) KSS 200ml',
      'A/C (B) KSS 200ml',
      'KSS A/C (B) 200ml',
      'kss a/c (b) 200ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 500,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'KSS Anticorrosive Paint (B) 200ml (KSS ඇන්ටිකොරෝසිව් (B) 200ml) - රු. 500'
  },
  // 16. A/c (R) KSS 200ml | 2 | 500
  {
    name: 'A/C (R) KSS 200ml',
    matchNames: [
      'A/c (R) KSS 200ml',
      'A/C (R) KSS 200ml',
      'KSS A/C (R) 200ml',
      'kss a/c (r) 200ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 500,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'KSS Anticorrosive Paint Red 200ml (KSS ඇන්ටිකොරෝසිව් රතු 200ml) - රු. 500'
  },
  // 17. A/c (B) Standard paint 200ml | 12 | 600
  {
    name: 'A/C (B) Standard Paint 200ml',
    matchNames: [
      'A/c (B) Standard paint 200ml',
      'A/C (B) Standard Paint 200ml',
      'Standard Paint A/C (B) 200ml',
      'standard a/c (b) 200ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 600,
    qty: 12,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Standard Anticorrosive Paint (B) 200ml (ස්ටෑන්ඩර්ඩ් ඇන්ටිකොරෝසිව් 200ml) - රු. 600'
  },
  // 18. A/c (R) Standard paint | 6 | 600
  {
    name: 'A/C (R) Standard Paint 200ml',
    matchNames: [
      'A/c (R) Standard paint',
      'A/C (R) Standard Paint',
      'A/C (R) Standard Paint 200ml',
      'Standard Paint A/C (R) 200ml',
      'standard a/c (r) 200ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 600,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Standard Anticorrosive Paint Red 200ml (ස්ටෑන්ඩර්ඩ් ඇන්ටිකොරෝසිව් රතු 200ml) - රු. 600'
  },
  // 19. A/c (B) Robbialac 200ml | 1 | 500
  {
    name: 'A/C (B) Robbialac 200ml',
    matchNames: [
      'A/c (B) Robbialac 200ml',
      'A/C (B) Robbialac 200ml',
      'Robbialac A/C (B) 200ml',
      'robbialac a/c (b) 200ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 500,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Robbialac Anticorrosive Paint (B) 200ml (රොබියලැක් ඇන්ටිකොරෝසිව් 200ml) - රු. 500'
  },
  // 20. Seelar (Y) J CHEM 1L | 4 | 2200
  {
    name: 'Sealer (Y) J CHEM 1L',
    matchNames: [
      'Seelar (Y) J CHEM 1L',
      'Sealer (Y) J CHEM 1L',
      'Sealer (Y) JCHEM 1L',
      'jchem sealer (y) 1l',
      'Seelar (Y) JCHEM 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'J CHEM Sanding Sealer (Y) 1L (ජයකෙම් සීලර් 1L) - රු. 2,200'
  },
  // 21. Seelar (Jackwood) J CHEM 1L | 2 | 2500
  {
    name: 'Sealer (Jackwood) J CHEM 1L',
    matchNames: [
      'Seelar (Jackwood) J CHEM 1L',
      'Sealer (Jackwood) J CHEM 1L',
      'Sealer (Jackwood) JCHEM 1L',
      'jchem sealer jackwood 1l',
      'Seelar (Jackwood) JCHEM 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2500,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'J CHEM Wood Sealer Jackwood 1L (ජයකෙම් කොස් පැහැ සීලර් 1L) - රු. 2,500'
  },
  // 22. Seelar (Mahogani) J CHEM 1L | 4 | 2500
  {
    name: 'Sealer (Mahogani) J CHEM 1L',
    matchNames: [
      'Seelar (Mahogani) J CHEM 1L',
      'Sealer (Mahogani) J CHEM 1L',
      'Sealer (Mahogany) J CHEM 1L',
      'jchem sealer mahogani 1l',
      'Seelar (Mahogani) JCHEM 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2500,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'J CHEM Wood Sealer Mahogani 1L (ජයකෙම් මහෝගනී පැහැ සීලර් 1L) - රු. 2,500'
  },
  // 23. Seelar (Teak) J CHEM 1L | 2 | 2200
  {
    name: 'Sealer (Teak) J CHEM 1L',
    matchNames: [
      'Seelar (Teak) J CHEM 1L',
      'Sealer (Teak) J CHEM 1L',
      'Sealer (Teak) JCHEM 1L',
      'jchem sealer teak 1l',
      'Seelar (Teak) JCHEM 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'J CHEM Wood Sealer Teak 1L (ජයකෙම් තේක්ක පැහැ සීලර් 1L) - රු. 2,200'
  }
];

function generateBarcode(existingBarcodes) {
  for (let i = 0; i < 1000; i++) {
    const randomPart = Math.floor(1000000000 + Math.random() * 9000000000);
    const code = '20' + String(randomPart);
    if (!existingBarcodes.has(code)) {
      existingBarcodes.add(code);
      return code;
    }
  }
  const fallback = '20' + Date.now().toString().slice(-10);
  existingBarcodes.add(fallback);
  return fallback;
}

async function processDb(targetDbPath) {
  if (!fs.existsSync(targetDbPath)) {
    console.log(`Skipping non-existent DB: ${targetDbPath}`);
    return;
  }

  console.log(`\n========================================`);
  console.log(`Processing Database: ${targetDbPath}`);
  console.log(`========================================`);

  const db = new sqlite3.Database(targetDbPath);

  const run = (q, p = []) => new Promise((res, rej) => db.run(q, p, function(err) { if (err) rej(err); else res(this); }));
  const get = (q, p = []) => new Promise((res, rej) => db.get(q, p, (err, row) => { if (err) rej(err); else res(row); }));
  const all = (q, p = []) => new Promise((res, rej) => db.all(q, p, (err, rows) => { if (err) rej(err); else res(rows); }));

  const existingItems = await all('SELECT id, name, barcode FROM items');
  const existingBarcodes = new Set(existingItems.map(i => (i.barcode || '').trim()).filter(Boolean));

  let added = 0;
  let updated = 0;

  for (const item of itemsToAdd) {
    let existing = null;
    for (const matchName of item.matchNames) {
      existing = await get('SELECT id, name, qty, sellPrice, barcode FROM items WHERE LOWER(TRIM(name)) = LOWER(TRIM(?))', [matchName]);
      if (existing) break;
    }

    if (existing) {
      let barcode = (existing.barcode || '').trim();
      if (!barcode) {
        barcode = generateBarcode(existingBarcodes);
      }
      await run(
        `UPDATE items 
         SET name = ?, barcode = ?, category = ?, subCategory = ?, unit = ?, costPrice = ?, sellPrice = ?, qty = ?, reorderLevel = ?, packSize = ?, packUnit = ?, loosePrice = ?, description = ?
         WHERE id = ?`,
        [item.name, barcode, item.category, item.subCategory, item.unit, item.costPrice, item.sellPrice, item.qty, item.reorderLevel, item.packSize || 1, item.packUnit || 'pcs', item.loosePrice || 0, item.description, existing.id]
      );
      console.log(`🔄 Updated item: ID ${existing.id} -> ${item.name} | Qty: ${item.qty} | Price: Rs. ${item.sellPrice} | Barcode: ${barcode}`);
      updated++;
    } else {
      const barcode = generateBarcode(existingBarcodes);
      const res = await run(
        `INSERT INTO items (name, barcode, category, subCategory, unit, costPrice, sellPrice, qty, reorderLevel, packSize, packUnit, loosePrice, description, image, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', ?)`,
        [item.name, barcode, item.category, item.subCategory, item.unit, item.costPrice, item.sellPrice, item.qty, item.reorderLevel, item.packSize || 1, item.packUnit || 'pcs', item.loosePrice || 0, item.description, Date.now()]
      );
      console.log(`✅ Added new item: ID ${res.lastID} -> ${item.name} | Qty: ${item.qty} | Price: Rs. ${item.sellPrice} | Barcode: ${barcode}`);
      added++;
    }
  }

  console.log(`Summary for ${path.basename(targetDbPath)}: Added: ${added}, Updated: ${updated}, Total items in batch: ${itemsToAdd.length}`);
  db.close();
}

async function main() {
  const dbPaths = [
    path.join(__dirname, '..', 'backend', 'pos.db')
  ];

  if (process.env.APPDATA) {
    dbPaths.push(path.join(process.env.APPDATA, 'hardware-pos', 'pos.db'));
    dbPaths.push(path.join(process.env.APPDATA, 'Hardware POS', 'pos.db'));
  }

  const uniquePaths = [...new Set(dbPaths)];

  for (const p of uniquePaths) {
    await processDb(p);
  }

  console.log('\n🎉 Batch 30 A/C & Sealer Paint items added/updated successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

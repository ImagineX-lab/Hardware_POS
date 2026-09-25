const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. E/M (G/Y) Reoluse 500ml | 1 | 1500
  {
    name: 'E/M (G/Y) Reoluse 500ml',
    matchNames: [
      'E/M (G/Y) Reoluse 500ml',
      'E/M (G/Y) reoluse 500ml',
      'e/m (g/y) reoluse 500ml',
      'E/M (G/Y) Reoluxe 500ml',
      'Reoluse E/M (G/Y) 500ml',
      'Reoluxe E/M (G/Y) 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1500,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluse Emulsion Paint (G/Y) 500ml (රියෝලක්ස් එමල්ෂන් සායම් 500ml) - රු. 1,500'
  },
  // 2. E/M (R) Robialac 500ml | 3 | 1500
  {
    name: 'E/M (R) Robbialac 500ml',
    matchNames: [
      'E/M (R) Robbialac 500ml',
      'E/M (R) Robialac 500ml',
      'e/m (r) robialac 500ml',
      'Robbialac E/M (R) 500ml',
      'Robialac E/M (R) 500ml',
      'E/M (R) robbialac 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1500,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Robbialac Emulsion Paint Red (R) 500ml (රොබියලැක් එමල්ෂන් රතු සායම් 500ml) - රු. 1,500'
  },
  // 3. E/M (R) wall master 500ml | 3 | 1500
  {
    name: 'E/M (R) Wall Master 500ml',
    matchNames: [
      'E/M (R) Wall Master 500ml',
      'E/M (R) wall master 500ml',
      'e/m (r) wall master 500ml',
      'Wall Master E/M (R) 500ml',
      'Wall Master (R) 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1500,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Wall Master Emulsion Paint Red (R) 500ml (වෝල් මාස්ටර් එමල්ෂන් රතු සායම් 500ml) - රු. 1,500'
  },
  // 4. W/M primer 1L nature paint | 9 | 2000
  {
    name: 'W/M Primer 1L Nature Paint',
    matchNames: [
      'W/M Primer 1L Nature Paint',
      'W/M primer 1L nature paint',
      'w/m primer 1l nature paint',
      'Nature Paint W/M Primer 1L',
      'Nature Paint Wall Primer 1L',
      'W/M Primer Nature Paint 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2000,
    qty: 9,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Nature Paint Wall Primer 1L (නේචර් පේන්ට් වෝල් ප්‍රයිමර් 1L) - රු. 2,000'
  },
  // 5. W/M primer 500ml nature paint | 9 | 1100
  {
    name: 'W/M Primer 500ml Nature Paint',
    matchNames: [
      'W/M Primer 500ml Nature Paint',
      'W/M primer 500ml nature paint',
      'w/m primer 500ml nature paint',
      'Nature Paint W/M Primer 500ml',
      'Nature Paint Wall Primer 500ml',
      'W/M Primer Nature Paint 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1100,
    qty: 9,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Nature Paint Wall Primer 500ml (නේචර් පේන්ට් වෝල් ප්‍රයිමර් 500ml) - රු. 1,100'
  },
  // 6. E/M (W/G) wall master 1L | 3 | 2200
  {
    name: 'E/M (W/G) Wall Master 1L',
    matchNames: [
      'E/M (W/G) Wall Master 1L',
      'E/M (W/G) wall master 1L',
      'e/m (w/g) wall master 1l',
      'Wall Master E/M (W/G) 1L',
      'Wall Master (W/G) 1L'
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
    description: 'Wall Master Emulsion Paint (W/G) 1L (වෝල් මාස්ටර් එමල්ෂන් සායම් 1L) - රු. 2,200'
  },
  // 7. E/M (B) wall master 1L | 3 | 2200
  {
    name: 'E/M (B) Wall Master 1L',
    matchNames: [
      'E/M (B) Wall Master 1L',
      'E/M (B) wall master 1L',
      'e/m (b) wall master 1l',
      'Wall Master E/M (B) 1L',
      'Wall Master (B) 1L'
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
    description: 'Wall Master Emulsion Paint (B) 1L (වෝල් මාස්ටර් එමල්ෂන් සායම් 1L) - රු. 2,200'
  },
  // 8. E/M (G/R) wall master 1L | 3 | 2200
  {
    name: 'E/M (G/R) Wall Master 1L',
    matchNames: [
      'E/M (G/R) Wall Master 1L',
      'E/M (G/R) wall master 1L',
      'e/m (g/r) wall master 1l',
      'Wall Master E/M (G/R) 1L',
      'Wall Master (G/R) 1L'
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
    description: 'Wall Master Emulsion Paint (G/R) 1L (වෝල් මාස්ටර් එමල්ෂන් සායම් 1L) - රු. 2,200'
  },
  // 9. E/M (R) wall master 1L | 3 | 2200
  {
    name: 'E/M (R) Wall Master 1L',
    matchNames: [
      'E/M (R) Wall Master 1L',
      'E/M (R) wall master 1L',
      'e/m (r) wall master 1l',
      'Wall Master E/M (R) 1L',
      'Wall Master (R) 1L'
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
    description: 'Wall Master Emulsion Paint Red (R) 1L (වෝල් මාස්ටර් එමල්ෂන් රතු සායම් 1L) - රු. 2,200'
  },
  // 10. E/M (G/B) wall master 1L | 2 | 2500
  {
    name: 'E/M (G/B) Wall Master 1L',
    matchNames: [
      'E/M (G/B) Wall Master 1L',
      'E/M (G/B) wall master 1L',
      'e/m (g/b) wall master 1l',
      'Wall Master E/M (G/B) 1L',
      'Wall Master (G/B) 1L'
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
    description: 'Wall Master Emulsion Paint (G/B) 1L (වෝල් මාස්ටර් එමල්ෂන් සායම් 1L) - රු. 2,500'
  },
  // 11. E/M (P) wall master 1L| 1 | 2500
  {
    name: 'E/M (P) Wall Master 1L',
    matchNames: [
      'E/M (P) Wall Master 1L',
      'E/M (P) wall master 1L',
      'e/m (p) wall master 1l',
      'Wall Master E/M (P) 1L',
      'Wall Master (P) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2500,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Wall Master Emulsion Paint (P) 1L (වෝල් මාස්ටර් එමල්ෂන් සායම් 1L) - රු. 2,500'
  },
  // 12. E/M (J/Y) wall master 1L | 1 | 2500
  {
    name: 'E/M (J/Y) Wall Master 1L',
    matchNames: [
      'E/M (J/Y) Wall Master 1L',
      'E/M (J/Y) wall master 1L',
      'e/m (j/y) wall master 1l',
      'Wall Master E/M (J/Y) 1L',
      'Wall Master (J/Y) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2500,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Wall Master Emulsion Paint (J/Y) 1L (වෝල් මාස්ටර් එමල්ෂන් සායම් 1L) - රු. 2,500'
  },
  // 13. E/M (D/G) wall master 1L | 3 | 2500
  {
    name: 'E/M (D/G) Wall Master 1L',
    matchNames: [
      'E/M (D/G) Wall Master 1L',
      'E/M (D/G) wall master 1L',
      'e/m (d/g) wall master 1l',
      'Wall Master E/M (D/G) 1L',
      'Wall Master (D/G) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2500,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Wall Master Emulsion Paint (D/G) 1L (වෝල් මාස්ටර් එමල්ෂන් සායම් 1L) - රු. 2,500'
  },
  // 14. E/M (H/H) wall master 1L| 3 | 2200
  {
    name: 'E/M (H/H) Wall Master 1L',
    matchNames: [
      'E/M (H/H) Wall Master 1L',
      'E/M (H/H) wall master 1L',
      'e/m (h/h) wall master 1l',
      'Wall Master E/M (H/H) 1L',
      'Wall Master (H/H) 1L'
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
    description: 'Wall Master Emulsion Paint (H/H) 1L (වෝල් මාස්ටර් එමල්ෂන් සායම් 1L) - රු. 2,200'
  },
  // 15. E/M (K/C) Multilac 1L | 3 | 2200
  {
    name: 'E/M (K/C) Multilac 1L',
    matchNames: [
      'E/M (K/C) Multilac 1L',
      'E/M (K/C) multilac 1L',
      'e/m (k/c) multilac 1l',
      'Multilac E/M (K/C) 1L',
      'Multilac (K/C) 1L'
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
    description: 'Multilac Emulsion Paint (K/C) 1L (මල්ටිලැක් එමල්ෂන් සායම් 1L) - රු. 2,200'
  },
  // 16. E/M (C/S) Multilac 1L | 2 | 2200
  {
    name: 'E/M (C/S) Multilac 1L',
    matchNames: [
      'E/M (C/S) Multilac 1L',
      'E/M (C/S) multilac 1L',
      'e/m (c/s) multilac 1l',
      'Multilac E/M (C/S) 1L',
      'Multilac (C/S) 1L'
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
    description: 'Multilac Emulsion Paint (C/S) 1L (මල්ටිලැක් එමල්ෂන් සායම් 1L) - රු. 2,200'
  },
  // 17. E/M (L) Multilac 1L | 4 | 2200
  {
    name: 'E/M (L) Multilac 1L',
    matchNames: [
      'E/M (L) Multilac 1L',
      'E/M (L) multilac 1L',
      'e/m (l) multilac 1l',
      'Multilac E/M (L) 1L',
      'Multilac (L) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac Emulsion Paint (L) 1L (මල්ටිලැක් එමල්ෂන් සායම් 1L) - රු. 2,200'
  },
  // 18. E/M (R) Multilac 1L | 1 | 2200
  {
    name: 'E/M (R) Multilac 1L',
    matchNames: [
      'E/M (R) Multilac 1L',
      'E/M (R) multilac 1L',
      'e/m (r) multilac 1l',
      'Multilac E/M (R) 1L',
      'Multilac (R) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac Emulsion Paint Red (R) 1L (මල්ටිලැක් එමල්ෂන් රතු සායම් 1L) - රු. 2,200'
  },
  // 19. E/M (B/W) Multilac 1L | 4 | 2520
  {
    name: 'E/M (B/W) Multilac 1L',
    matchNames: [
      'E/M (B/W) Multilac 1L',
      'E/M (B/W)Multilac 1L',
      'E/M (B/W) multilac 1L',
      'e/m (b/w) multilac 1l',
      'Multilac E/M (B/W) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2520,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac Emulsion Paint Brilliant White (B/W) 1L (මල්ටිලැක් එමල්ෂන් සුදු සායම් 1L) - රු. 2,520'
  },
  // 20. E/M (B) nature paint 1L | 5 | 2000
  {
    name: 'E/M (B) Nature Paint 1L',
    matchNames: [
      'E/M (B) Nature Paint 1L',
      'E/M (B) nature paint 1L',
      'e/m (b) nature paint 1l',
      'Nature Paint E/M (B) 1L',
      'Nature Paint (B) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2000,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Nature Paint Emulsion Paint (B) 1L (නේචර් පේන්ට් එමල්ෂන් සායම් 1L) - රු. 2,000'
  },
  // 21. E/M (B/W) nature paint 1L | 4 | 2000
  {
    name: 'E/M (B/W) Nature Paint 1L',
    matchNames: [
      'E/M (B/W) Nature Paint 1L',
      'E/M (B/W) nature paint 1L',
      'e/m (b/w) nature paint 1l',
      'Nature Paint E/M (B/W) 1L',
      'Nature Paint (B/W) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2000,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Nature Paint Emulsion Paint Brilliant White (B/W) 1L (නේචර් පේන්ට් එමල්ෂන් සුදු සායම් 1L) - රු. 2,000'
  },
  // 22. E/M (W/H) KANSAI 1L | 2 | 2500
  {
    name: 'E/M (W/H) Kansai 1L',
    matchNames: [
      'E/M (W/H) Kansai 1L',
      'E/M (W/H) KANSAI 1L',
      'e/m (w/h) kansai 1l',
      'Kansai E/M (W/H) 1L',
      'KANSAI E/M (W/H) 1L',
      'Kansai (W/H) 1L'
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
    description: 'Kansai Emulsion Paint (W/H) 1L (කැන්සායි එමල්ෂන් සායම් 1L) - රු. 2,500'
  },
  // 23. E/M (B/B) KANSAI 1L | 1 | 2500
  {
    name: 'E/M (B/B) Kansai 1L',
    matchNames: [
      'E/M (B/B) Kansai 1L',
      'E/M (B/B) KANSAI 1L',
      'e/m (b/b) kansai 1l',
      'Kansai E/M (B/B) 1L',
      'KANSAI E/M (B/B) 1L',
      'Kansai (B/B) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2500,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Kansai Emulsion Paint (B/B) 1L (කැන්සායි එමල්ෂන් සායම් 1L) - රු. 2,500'
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

  console.log('\n🎉 Batch 34 Paint items added/updated successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

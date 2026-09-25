const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. E/M (G/Br) wall master 500ml | 5 | 1200
  {
    name: 'E/M (G/Br) Wall Master 500ml',
    matchNames: [
      'E/M (G/Br) Wall Master 500ml',
      'E/M (G/Br) wall master 500ml',
      'e/m (g/br) wall master 500ml',
      'Wall Master E/M (G/Br) 500ml',
      'Wall Master (G/Br) 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Wall Master Emulsion Paint (G/Br) 500ml (වෝල් මාස්ටර් එමල්ෂන් සායම් 500ml) - රු. 1,200'
  },
  // 2. E/M (B/Br) wall master 500ml | 2 | 1200
  {
    name: 'E/M (B/Br) Wall Master 500ml',
    matchNames: [
      'E/M (B/Br) Wall Master 500ml',
      'E/M (B/Br) wall master 500ml',
      'e/m (b/br) wall master 500ml',
      'Wall Master E/M (B/Br) 500ml',
      'Wall Master (B/Br) 500ml'
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
    description: 'Wall Master Emulsion Paint (B/Br) 500ml (වෝල් මාස්ටර් එමල්ෂන් සායම් 500ml) - රු. 1,200'
  },
  // 3. E/M (G/Br) Reoluse 500ml | 2 | 1500
  {
    name: 'E/M (G/Br) Reoluse 500ml',
    matchNames: [
      'E/M (G/Br) Reoluse 500ml',
      'E/M (G/Br) reoluse 500ml',
      'e/m (g/br) reoluse 500ml',
      'E/M (G/Br) Reoluxe 500ml',
      'Reoluse E/M (G/Br) 500ml',
      'Reoluxe E/M (G/Br) 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1500,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluse Emulsion Paint (G/Br) 500ml (රියෝලක්ස් එමල්ෂන් සායම් 500ml) - රු. 1,500'
  },
  // 4. E/M (L/G) Reoluse 500ml | 1 | 1500
  {
    name: 'E/M (L/G) Reoluse 500ml',
    matchNames: [
      'E/M (L/G) Reoluse 500ml',
      'E/M (L/G) reoluse 500ml',
      'e/m (l/g) reoluse 500ml',
      'E/M (L/G) Reoluxe 500ml',
      'Reoluse E/M (L/G) 500ml',
      'Reoluxe E/M (L/G) 500ml'
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
    description: 'Reoluse Emulsion Paint (L/G) 500ml (රියෝලක්ස් එමල්ෂන් සායම් 500ml) - රු. 1,500'
  },
  // 5. E/M (S/V) Reoluse 500ml | 2 | 1200
  {
    name: 'E/M (S/V) Reoluse 500ml',
    matchNames: [
      'E/M (S/V) Reoluse 500ml',
      'E/M (S/V) reoluse 500ml',
      'e/m (s/v) reoluse 500ml',
      'E/M (S/V) Reoluxe 500ml',
      'Reoluse E/M (S/V) 500ml',
      'Reoluxe E/M (S/V) 500ml'
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
    description: 'Reoluse Emulsion Paint (S/V) 500ml (රියෝලක්ස් එමල්ෂන් සායම් 500ml) - රු. 1,200'
  },
  // 6. E/M (A/B) Reoluse 500ml | 3 | 1500
  {
    name: 'E/M (A/B) Reoluse 500ml',
    matchNames: [
      'E/M (A/B) Reoluse 500ml',
      'E/M (A/B) reoluse 500ml',
      'e/m (a/b) reoluse 500ml',
      'E/M (A/B) Reoluxe 500ml',
      'Reoluse E/M (A/B) 500ml',
      'Reoluxe E/M (A/B) 500ml'
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
    description: 'Reoluse Emulsion Paint (A/B) 500ml (රියෝලක්ස් එමල්ෂන් සායම් 500ml) - රු. 1,500'
  },
  // 7. E/M (B/M) Reoluse 500ml | 1 | 1200
  {
    name: 'E/M (B/M) Reoluse 500ml',
    matchNames: [
      'E/M (B/M) Reoluse 500ml',
      'E/M (B/M) reoluse 500ml',
      'e/m (b/m) reoluse 500ml',
      'E/M (B/M) Reoluxe 500ml',
      'Reoluse E/M (B/M) 500ml',
      'Reoluxe E/M (B/M) 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluse Emulsion Paint (B/M) 500ml (රියෝලක්ස් එමල්ෂන් සායම් 500ml) - රු. 1,200'
  },
  // 8. E/M (Y) KSS paints 500ml | 3 | 1200
  {
    name: 'E/M (Y) KSS Paint 500ml',
    matchNames: [
      'E/M (Y) KSS Paint 500ml',
      'E/M (Y) KSS paints 500ml',
      'E/M (Y) KSS 500ml',
      'e/m (y) kss paints 500ml',
      'KSS E/M (Y) 500ml',
      'KSS Paint E/M (Y) 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'KSS Emulsion Paint Yellow (Y) 500ml (KSS එමල්ෂන් කහ සායම් 500ml) - රු. 1,200'
  },
  // 9 & 13. E/M (G/Y) wall master 500ml | 1 + 6 = 7 | 1200
  {
    name: 'E/M (G/Y) Wall Master 500ml',
    matchNames: [
      'E/M (G/Y) Wall Master 500ml',
      'E/M (G/Y) wall master 500ml',
      'e/m (g/y) wall master 500ml',
      'Wall Master E/M (G/Y) 500ml',
      'Wall Master (G/Y) 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 7, // 1 + 6 = 7
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Wall Master Emulsion Paint (G/Y) 500ml (වෝල් මාස්ටර් එමල්ෂන් සායම් 500ml) - රු. 1,200'
  },
  // 10. E/M (W/A) wall master 500ml | 5 | 1200
  {
    name: 'E/M (W/A) Wall Master 500ml',
    matchNames: [
      'E/M (W/A) Wall Master 500ml',
      'E/M (W/A) wall master 500ml',
      'e/m (w/a) wall master 500ml',
      'Wall Master E/M (W/A) 500ml',
      'Wall Master (W/A) 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Wall Master Emulsion Paint (W/A) 500ml (වෝල් මාස්ටර් එමල්ෂන් සායම් 500ml) - රු. 1,200'
  },
  // 11. E/M (H/H) wall master 500ml | 1 | 1200
  {
    name: 'E/M (H/H) Wall Master 500ml',
    matchNames: [
      'E/M (H/H) Wall Master 500ml',
      'E/M (H/H) wall master 500ml',
      'e/m (h/h) wall master 500ml',
      'Wall Master E/M (H/H) 500ml',
      'Wall Master (H/H) 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Wall Master Emulsion Paint (H/H) 500ml (වෝල් මාස්ටර් එමල්ෂන් සායම් 500ml) - රු. 1,200'
  },
  // 12. E/M (D/G) wall master 500ml | 2 | 1200
  {
    name: 'E/M (D/G) Wall Master 500ml',
    matchNames: [
      'E/M (D/G) Wall Master 500ml',
      'E/M (D/G) wall master 500ml',
      'e/m (d/g) wall master 500ml',
      'Wall Master E/M (D/G) 500ml',
      'Wall Master (D/G) 500ml'
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
    description: 'Wall Master Emulsion Paint (D/G) 500ml (වෝල් මාස්ටර් එමල්ෂන් සායම් 500ml) - රු. 1,200'
  },
  // 14. E/M (B) wall master 500ml | 7 | 1200
  {
    name: 'E/M (B) Wall Master 500ml',
    matchNames: [
      'E/M (B) Wall Master 500ml',
      'E/M (B) wall master 500ml',
      'e/m (b) wall master 500ml',
      'Wall Master E/M (B) 500ml',
      'Wall Master (B) 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 7,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Wall Master Emulsion Paint (B) 500ml (වෝල් මාස්ටර් එමල්ෂන් සායම් 500ml) - රු. 1,200'
  },
  // 15. E/M (S/B) wall master 500ml | 3 | 1200
  {
    name: 'E/M (S/B) Wall Master 500ml',
    matchNames: [
      'E/M (S/B) Wall Master 500ml',
      'E/M (S/B) wall master 500ml',
      'e/m (s/b) wall master 500ml',
      'Wall Master E/M (S/B) 500ml',
      'Wall Master (S/B) 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Wall Master Emulsion Paint (S/B) 500ml (වෝල් මාස්ටර් එමල්ෂන් සායම් 500ml) - රු. 1,200'
  },
  // 16. E/M (P/B) wall master 500ml | 6 | 1200
  {
    name: 'E/M (P/B) Wall Master 500ml',
    matchNames: [
      'E/M (P/B) Wall Master 500ml',
      'E/M (P/B) wall master 500ml',
      'e/m (p/b) wall master 500ml',
      'Wall Master E/M (P/B) 500ml',
      'Wall Master (P/B) 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Wall Master Emulsion Paint (P/B) 500ml (වෝල් මාස්ටර් එමල්ෂන් සායම් 500ml) - රු. 1,200'
  },
  // 17. E/M (M/S) wall master 500ml | 2 | 1200
  {
    name: 'E/M (M/S) Wall Master 500ml',
    matchNames: [
      'E/M (M/S) Wall Master 500ml',
      'E/M (M/S) wall master 500ml',
      'e/m (m/s) wall master 500ml',
      'Wall Master E/M (M/S) 500ml',
      'Wall Master (M/S) 500ml'
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
    description: 'Wall Master Emulsion Paint (M/S) 500ml (වෝල් මාස්ටර් එමල්ෂන් සායම් 500ml) - රු. 1,200'
  },
  // 18. E/M (A/B) wall master 500ml | 3 | 1200
  {
    name: 'E/M (A/B) Wall Master 500ml',
    matchNames: [
      'E/M (A/B) Wall Master 500ml',
      'E/M (A/B) wall master 500ml',
      'e/m (a/b) wall master 500ml',
      'Wall Master E/M (A/B) 500ml',
      'Wall Master (A/B) 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Wall Master Emulsion Paint (A/B) 500ml (වෝල් මාස්ටර් එමල්ෂන් සායම් 500ml) - රු. 1,200'
  },
  // 19. E/M (B) Purelac 500ml | 4 | 1500
  {
    name: 'E/M (B) Purelac 500ml',
    matchNames: [
      'E/M (B) Purelac 500ml',
      'E/M (B) purelac 500ml',
      'e/m (b) purelac 500ml',
      'Purelac E/M (B) 500ml',
      'Purelac (B) 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1500,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Purelac Emulsion Paint (B) 500ml (පියුර්ලැක් එමල්ෂන් සායම් 500ml) - රු. 1,500'
  },
  // 20. E/M (P) KSS 500ml | 3 | 1500
  {
    name: 'E/M (P) KSS 500ml',
    matchNames: [
      'E/M (P) KSS 500ml',
      'E/M (P) kss 500ml',
      'e/m (p) kss 500ml',
      'KSS E/M (P) 500ml',
      'KSS Paint (P) 500ml'
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
    description: 'KSS Emulsion Paint (P) 500ml (KSS එමල්ෂන් සායම් 500ml) - රු. 1,500'
  },
  // 21. E/M (B/W) Multilac 500ml | 4 | 1500
  {
    name: 'E/M (B/W) Multilac 500ml',
    matchNames: [
      'E/M (B/W) Multilac 500ml',
      'E/M (B/W) multilac 500ml',
      'e/m (b/w) multilac 500ml',
      'Multilac E/M (B/W) 500ml',
      'Multilac 500ml B/W',
      'Multilac (B/W) 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1500,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac Emulsion Paint Brilliant White (B/W) 500ml (මල්ටිලැක් එමල්ෂන් සුදු සායම් 500ml) - රු. 1,500'
  },
  // 22. E/M (B) KSS 500ml | 1 | 1200
  {
    name: 'E/M (B) KSS 500ml',
    matchNames: [
      'E/M (B) KSS 500ml',
      'E/M (B) kss 500ml',
      'e/m (b) kss 500ml',
      'KSS E/M (B) 500ml',
      'KSS Paint (B) 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'KSS Emulsion Paint (B) 500ml (KSS එමල්ෂන් සායම් 500ml) - රු. 1,200'
  },
  // 23. E/M (B) Reoluse 500ml | 4 | 1500
  {
    name: 'E/M (B) Reoluse 500ml',
    matchNames: [
      'E/M (B) Reoluse 500ml',
      'E/M (B) reoluse 500ml',
      'e/m (b) reoluse 500ml',
      'E/M (B) Reoluxe 500ml',
      'Reoluse E/M (B) 500ml',
      'Reoluxe E/M (B) 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1500,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluse Emulsion Paint (B) 500ml (රියෝලක්ස් එමල්ෂන් සායම් 500ml) - රු. 1,500'
  },
  // 24. E/M (M/B) Reoluse 500ml | 3 | 1500
  {
    name: 'E/M (M/B) Reoluse 500ml',
    matchNames: [
      'E/M (M/B) Reoluse 500ml',
      'E/M (M/B) reoluse 500ml',
      'e/m (m/b) reoluse 500ml',
      'E/M (M/B) Reoluxe 500ml',
      'Reoluse E/M (M/B) 500ml',
      'Reoluxe E/M (M/B) 500ml'
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
    description: 'Reoluse Emulsion Paint (M/B) 500ml (රියෝලක්ස් එමල්ෂන් සායම් 500ml) - රු. 1,500'
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

  console.log('\n🎉 Batch 33 Paint (E/M 500ml) items added/updated successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

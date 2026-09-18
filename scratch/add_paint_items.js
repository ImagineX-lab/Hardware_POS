const http = require('http');

const items = [
  { name: 'JAT Filler 1l', category: 'සායම් හා රසායනික', subCategory: 'Filler', unit: 'pcs', costPrice: 0, sellPrice: 650, qty: 7, reorderLevel: 5, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'JAT Filler 1L - රු. 650', barcode: '' },
  { name: 'Robbialac Filler 4l', category: 'සායම් හා රසායනික', subCategory: 'Filler', unit: 'pcs', costPrice: 0, sellPrice: 2000, qty: 2, reorderLevel: 2, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Robbialac Filler 4L - රු. 2,000', barcode: '' },
  { name: 'Robbialac Filler 10l', category: 'සායම් හා රසායනික', subCategory: 'Filler', unit: 'pcs', costPrice: 0, sellPrice: 4500, qty: 4, reorderLevel: 2, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Robbialac Filler 10L - රු. 4,500', barcode: '' },
  { name: 'JAT B/W 1l (E)', category: 'සායම් හා රසායනික', subCategory: 'Emulsion', unit: 'pcs', costPrice: 0, sellPrice: 1000, qty: 9, reorderLevel: 5, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'JAT Brilliant White 1L Emulsion - රු. 1,000', barcode: '' },
  { name: 'JAT B/W 4l (E)', category: 'සායම් හා රසායනික', subCategory: 'Emulsion', unit: 'pcs', costPrice: 0, sellPrice: 4000, qty: 5, reorderLevel: 3, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'JAT Brilliant White 4L Emulsion - රු. 4,000', barcode: '' },
  { name: 'Superlac B/W 4l (E)', category: 'සායම් හා රසායනික', subCategory: 'Emulsion', unit: 'pcs', costPrice: 0, sellPrice: 3800, qty: 2, reorderLevel: 2, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Superlac Brilliant White 4L Emulsion - රු. 3,800', barcode: '' },
  { name: 'Pure Lac (Lily White) 4l (E)', category: 'සායම් හා රසායනික', subCategory: 'Emulsion', unit: 'pcs', costPrice: 0, sellPrice: 4500, qty: 7, reorderLevel: 3, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Pure Lac Lily White 4L Emulsion - රු. 4,500', barcode: '' },
  { name: 'Robbialac B/W 10l', category: 'සායම් හා රසායනික', subCategory: 'Emulsion', unit: 'pcs', costPrice: 0, sellPrice: 10000, qty: 2, reorderLevel: 2, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Robbialac Brilliant White 10L - රු. 10,000', barcode: '' },
  { name: 'Superlac B/W 4l', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 4000, qty: 3, reorderLevel: 2, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Superlac Brilliant White 4L - රු. 4,000', barcode: '' },
  { name: 'Robbialac 1l (Butter Milk)', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 1400, qty: 4, reorderLevel: 3, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Robbialac 1L Butter Milk - රු. 1,400', barcode: '' },
  { name: 'Robbialac 1l Apple White', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 1200, qty: 5, reorderLevel: 3, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Robbialac 1L Apple White - රු. 1,200', barcode: '' },
  { name: 'Multidec 1l (Butter Milk)', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 1200, qty: 1, reorderLevel: 2, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Multidec 1L Butter Milk - රු. 1,200', barcode: '' },
  { name: 'Robbialac 1l (Blissful)', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 1200, qty: 4, reorderLevel: 3, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Robbialac 1L Blissful - රු. 1,200', barcode: '' },
  { name: 'Robbialac 1l Blue Lake', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 1200, qty: 2, reorderLevel: 2, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Robbialac 1L Blue Lake - රු. 1,200', barcode: '' },
  { name: 'Robbialac 1l Island Water', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 1200, qty: 3, reorderLevel: 2, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Robbialac 1L Island Water - රු. 1,200', barcode: '' },
  { name: 'Robbialac 1l Ice Blue', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 1200, qty: 2, reorderLevel: 2, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Robbialac 1L Ice Blue - රු. 1,200', barcode: '' },
  { name: 'Robbialac 1l Robin Yellow', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 1200, qty: 5, reorderLevel: 3, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Robbialac 1L Robin Yellow - රු. 1,200', barcode: '' },
  { name: 'Robbialac 1l Fresh Lime', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 1200, qty: 3, reorderLevel: 2, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Robbialac 1L Fresh Lime - රු. 1,200', barcode: '' },
  { name: 'Robbialac 1l Lime', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 1200, qty: 5, reorderLevel: 3, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Robbialac 1L Lime - රු. 1,200', barcode: '' },
  { name: 'Robbialac 1l Echo Lake', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 1200, qty: 2, reorderLevel: 2, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Robbialac 1L Echo Lake - රු. 1,200', barcode: '' },
  { name: 'Robbialac 1l Sunset Coral', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 1200, qty: 3, reorderLevel: 2, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Robbialac 1L Sunset Coral - රු. 1,200', barcode: '' },
  { name: 'Robbialac 1l Spice', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 1200, qty: 4, reorderLevel: 2, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Robbialac 1L Spice - රු. 1,200', barcode: '' },
  { name: 'Robbialac 1l Baby Pink', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 1200, qty: 2, reorderLevel: 2, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Robbialac 1L Baby Pink - රු. 1,200', barcode: '' },
  { name: 'Robbialac 1l Sista', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 1200, qty: 2, reorderLevel: 2, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Robbialac 1L Sista - රු. 1,200', barcode: '' },
  { name: 'Robbialac 1l Star Green', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 1200, qty: 2, reorderLevel: 2, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Robbialac 1L Star Green - රු. 1,200', barcode: '' },
  { name: 'Robbialac 1l Emerald Green', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 1200, qty: 1, reorderLevel: 2, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Robbialac 1L Emerald Green - රු. 1,200', barcode: '' },
  { name: 'Robbialac 1l Marble Grey', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 1200, qty: 1, reorderLevel: 2, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Robbialac 1L Marble Grey - රු. 1,200', barcode: '' },
  { name: 'Robbialac 1l Country Cream', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 1200, qty: 1, reorderLevel: 2, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Robbialac 1L Country Cream - රු. 1,200', barcode: '' },
  { name: 'Robbialac 1l Flint Grey', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 1200, qty: 1, reorderLevel: 2, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Robbialac 1L Flint Grey - රු. 1,200', barcode: '' },
  { name: 'Multidec 1l Botarace', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 1200, qty: 1, reorderLevel: 2, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Multidec 1L Botarace - රු. 1,200', barcode: '' },
  { name: 'Multidec 1l Lime', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 1200, qty: 2, reorderLevel: 2, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Multidec 1L Lime - රු. 1,200', barcode: '' },
  { name: 'Multidec 1l Sunflower', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 1200, qty: 1, reorderLevel: 2, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Multidec 1L Sunflower - රු. 1,200', barcode: '' },
  { name: 'Multidec 4l Butter Milk', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 4000, qty: 5, reorderLevel: 2, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Multidec 4L Butter Milk - රු. 4,000', barcode: '' },
  { name: 'Robbialac 4l Baby Pink', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 4000, qty: 6, reorderLevel: 2, packSize: 1, packUnit: 'pcs', loosePrice: 0, description: 'Robbialac 4L Baby Pink - රු. 4,000', barcode: '' },
];

async function addItem(item) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(item);
    const options = {
      hostname: '127.0.0.1',
      port: 3000,
      path: '/api/items',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve(json);
        } catch(e) {
          resolve({ error: body });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log(`Adding ${items.length} items...\n`);
  let success = 0;
  let fail = 0;
  for (const item of items) {
    try {
      const result = await addItem(item);
      if (result && result.id) {
        console.log(`✅ Added: ${item.name} (ID: ${result.id})`);
        success++;
      } else {
        console.log(`❌ Failed: ${item.name} -> ${JSON.stringify(result)}`);
        fail++;
      }
    } catch (err) {
      console.log(`❌ Error: ${item.name} -> ${err.message}`);
      fail++;
    }
  }
  console.log(`\n✅ Success: ${success} | ❌ Failed: ${fail}`);
}

main();

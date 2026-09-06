const fs = require('fs');
const path = require('path');

const brainDir = 'C:/Users/HP/.gemini/antigravity-ide/brain/8c863030-f34b-41ad-9571-0c98787e915e';

const toBase64 = (filename) => {
  const full = path.join(brainDir, filename);
  if (!fs.existsSync(full)) return null;
  return 'data:image/jpeg;base64,' + fs.readFileSync(full).toString('base64');
};

async function fetchBase64(url) {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  return 'data:image/jpeg;base64,' + Buffer.from(buf).toString('base64');
}

async function main() {
  console.log('Fetching existing items...');
  const itemsRes = await fetch('http://127.0.0.1:3000/api/items');
  const items = await itemsRes.json();
  console.log('Total items found:', items.length);

  // Load generated images
  const boxBarImg = toBase64('steel_box_bar_1788637448675.jpg');
  const lBarImg = toBase64('steel_l_bar_1788637473945.jpg');
  const flatBarImg = toBase64('steel_flat_bar_1788637496794.jpg');
  const nailsImg = toBase64('iron_nails_1788637520093.jpg');
  const casingImg = toBase64('wire_casing_1788637545490.jpg');
  const tileMortarImg = toBase64('tile_mortar_1788637575308.jpg');

  console.log('Fetching supplemental web images...');
  const tapImg = await fetchBase64('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80');
  const puttyImg = await fetchBase64('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80');
  const doorImg = await fetchBase64('https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&q=80');
  const blocksImg = await fetchBase64('https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=400&q=80');
  const bucketImg = await fetchBase64('https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&q=80');

  // Build reference map from items that already have images
  const existingMap = {};
  items.filter(i => i.image && i.image.trim().length > 10).forEach(i => {
    existingMap[i.name.trim().toLowerCase()] = i.image;
  });

  const getExisting = (nameKeyword) => {
    const key = Object.keys(existingMap).find(k => k.includes(nameKeyword.toLowerCase()));
    return key ? existingMap[key] : null;
  };

  const meshImg = getExisting('ගනකන් දැල') || getExisting('දැල');
  const barbedWireImg = getExisting('කටු කම්බි');
  const stirrupImg = getExisting('කම්බි සිරප්');
  const amanoSheetImg = getExisting('amano sheet') || getExisting('ටකරන්');
  const cementImg = getExisting('tokyo සිමෙන්ති') || getExisting('සිමෙන්ති');
  const thinnerImg = getExisting('ටිනර් 20l') || getExisting('ටිනර්');
  const woodPreservativeImg = getExisting('දැව ආරක්ෂක');
  const conduitYellowImg = getExisting('කහ');
  const conduitWhiteImg = getExisting('සුදු');
  const toiletBrushImg = getExisting('toilet කොසු');
  const plasticBroomImg = getExisting('ප්ලාස්ටික් කොසු');
  const mopImg = getExisting('මොප්');
  const wiperImg = getExisting('වයිෆර්');
  const cobwebImg = getExisting('මකුළු දැල්');
  const rakeImg = getExisting('රේක්ක');
  const wheelbarrowImg = getExisting('විල්බැරැක්ක');
  const pipeImg = getExisting('බට');

  let updatedCount = 0;

  for (const item of items) {
    if (item.image && item.image.trim().length > 10) continue;

    const n = item.name.toLowerCase();
    const cat = (item.category || '').toLowerCase();
    let imgToAssign = null;

    // YAKADA (Iron)
    if (n.includes('box bar')) imgToAssign = boxBarImg;
    else if (n.includes('l bar')) imgToAssign = lBarImg;
    else if (n.includes('පට්ටම')) imgToAssign = flatBarImg;
    
    // NAILS
    else if (n.includes('ඇණ') || n.includes('බෝල්ට්')) imgToAssign = nailsImg;

    // ELECTRICAL
    else if (n.includes('කේසින්')) imgToAssign = casingImg;
    else if (n.includes('කන්ඩියුට්') && (n.includes('කහ') || n.includes('නම'))) imgToAssign = conduitYellowImg || casingImg;
    else if (n.includes('කන්ඩියුට්')) imgToAssign = conduitWhiteImg || casingImg;

    // MORTAR & CEMENT
    else if (n.includes('මොටාර්')) imgToAssign = tileMortarImg;
    else if (n.includes('සිමෙන්ති කැට')) imgToAssign = blocksImg;
    else if (n.includes('සිමෙන්ති')) imgToAssign = cementImg;

    // PAINTS & CHEMICALS
    else if (n.includes('පොටි')) imgToAssign = puttyImg;
    else if (n.includes('ටිනර්') || n.includes('ටර්පන්ටයිම්')) imgToAssign = thinnerImg;
    else if (n.includes('දැව ආරක්ෂක')) imgToAssign = woodPreservativeImg;

    // ROOFING & AMANO
    else if (n.includes('sheet') || n.includes('ශීට්') || n.includes('ටකරන්') || n.includes('අමානෝ') || n.includes('පීලි') || n.includes('ෆ්ලෑශින්')) {
      imgToAssign = amanoSheetImg;
    }

    // WIRE & MESH
    else if (n.includes('දැල්') || n.includes('දැල')) imgToAssign = meshImg;
    else if (n.includes('බයින්ඩින්') || n.includes('කම්බි')) imgToAssign = barbedWireImg || stirrupImg;

    // SANITARY & PIPES
    else if (n.includes('ටොයිලට් දොර') || n.includes('දොර')) imgToAssign = doorImg;
    else if (n.includes('tap') || n.includes('ටැප්')) imgToAssign = tapImg;
    else if (n.includes('බට')) imgToAssign = pipeImg;

    // HOUSEHOLD & CLEANING
    else if (n.includes('බාල්දි')) imgToAssign = bucketImg;
    else if (n.includes('කොහු කොසු') || n.includes('ප්ලාස්ටික් කොසු') || n.includes('කොසු')) imgToAssign = plasticBroomImg;
    else if (n.includes('toilet කොසු')) imgToAssign = toiletBrushImg;
    else if (n.includes('mop') || n.includes('මොප්')) imgToAssign = mopImg;
    else if (n.includes('wiper') || n.includes('වයිෆර්') || n.includes('වයිපර්')) imgToAssign = wiperImg;
    else if (n.includes('මකුලු') || n.includes('මකුළු')) imgToAssign = cobwebImg;
    else if (n.includes('රැක්කා') || n.includes('රේක්ක')) imgToAssign = rakeImg;
    else if (n.includes('විල්බැරැක්ක')) imgToAssign = wheelbarrowImg;
    else if (n.includes('අලවංගු') || n.includes('ඉනි') || n.includes('උදලු')) imgToAssign = flatBarImg || boxBarImg;

    // Fallback by category
    if (!imgToAssign) {
      if (cat.includes('යකඩ')) imgToAssign = boxBarImg;
      else if (cat.includes('ගොඩනැගිලි')) imgToAssign = tileMortarImg;
      else if (cat.includes('විදුලි')) imgToAssign = casingImg;
      else if (cat.includes('සායම්')) imgToAssign = puttyImg;
      else if (cat.includes('සෙවිලි')) imgToAssign = amanoSheetImg;
      else if (cat.includes('පයිප්ප')) imgToAssign = pipeImg;
      else if (cat.includes('ගෘහ')) imgToAssign = bucketImg;
    }

    if (imgToAssign) {
      // Update item via API
      const patch = Object.assign({}, item, { image: imgToAssign });
      const putRes = await fetch(`http://127.0.0.1:3000/api/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch)
      });
      if (putRes.ok) {
        updatedCount++;
        console.log(`[${updatedCount}] Updated: #${item.id} - ${item.name} (${item.category})`);
      } else {
        console.error(`Failed to update: #${item.id} - ${item.name}`);
      }
    } else {
      console.warn(`No image found for: #${item.id} - ${item.name}`);
    }
  }

  console.log(`\nSuccessfully updated ${updatedCount} items with relevant images!`);

  // Verification
  const verifyRes = await fetch('http://127.0.0.1:3000/api/items');
  const verifyItems = await verifyRes.json();
  const withImgs = verifyItems.filter(i => i.image && i.image.trim().length > 10).length;
  console.log(`Verification: ${withImgs} / ${verifyItems.length} items now have photos!`);
}

main().catch(err => console.error(err));

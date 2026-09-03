/* =========================================================
   HardwarePOS — Barcode System
   - Web Audio API Sound Feedback
   - Code 128 SVG Barcode Generator (Pure JS, Offline)
   - Auto Barcode Generator
   - Barcode Label Sticker Printing
   - Camera Barcode Scanner (BarcodeDetector API / WebRTC)
   - Hardware USB / Bluetooth Scanner Listener
   ========================================================= */

const BarcodeSystem = {
  audioCtx: null,

  // Initialize Web Audio Context on user interaction
  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  },

  // Audio feedback for scanner
  playBeep(success = true) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (success) {
        // High-pitched, crisp checkout scanner chime (1800Hz -> 2400Hz)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.exponentialRampToValueAtTime(2400, now + 0.08);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

        osc.start(now);
        osc.stop(now + 0.09);
      } else {
        // Low buzz error tone (320Hz -> 180Hz)
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(180, now + 0.18);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {
      console.warn("Audio feedback error:", e);
    }
  },

  // Generate unique 12-digit standard in-store barcode
  generateBarcode() {
    let code = '';
    const existing = new Set(DB.data.items.map(i => (i.barcode || '').trim()));
    for (let attempts = 0; attempts < 100; attempts++) {
      // In-store standard starts with 20-29
      const randomPart = Math.floor(1000000000 + Math.random() * 9000000000);
      code = '20' + String(randomPart);
      if (!existing.has(code)) {
        return code;
      }
    }
    return '20' + Date.now().toString().slice(-10);
  },

  /* ---------------- CODE 128 BARCODE GENERATOR (PURE JS) ---------------- */
  // Encodes text to Code 128B patterns
  encodeCode128(text) {
    text = String(text || '').trim();
    if (!text) text = '000000';

    // Code 128B pattern table (107 patterns)
    const patterns = [
      "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213",
      "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
      "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211",
      "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
      "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331",
      "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
      "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214",
      "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
      "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141",
      "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141",
      "114131", "311141", "411131", "211412", "211214", "211232", "2331112"
    ];

    // Start with Code 128B start symbol (code 104)
    let checksum = 104;
    const sequence = [patterns[104]];

    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      let val = charCode - 32;
      if (val < 0 || val > 95) val = 0;
      checksum += val * (i + 1);
      sequence.push(patterns[val]);
    }

    const checkVal = checksum % 103;
    sequence.push(patterns[checkVal]);
    sequence.push(patterns[106]); // Stop pattern

    const fullCode = sequence.join('');
    let totalModules = 0;
    for (let c of fullCode) totalModules += parseInt(c, 10);

    return { text, fullCode, totalModules };
  },

  // Generates SVG string for Code 128 barcode
  generateCode128SVG(text, options = {}) {
    const { text: cleanText, fullCode, totalModules } = this.encodeCode128(text);
    const width = options.width || 220;
    const height = options.height || 60;
    const showText = options.showText !== false;
    const fontSize = options.fontSize || 13;

    const margin = options.margin !== undefined ? options.margin : 8;
    const barAreaWidth = width - (margin * 2);
    const moduleWidth = barAreaWidth / totalModules;
    const barHeight = showText ? height - fontSize - 5 : height;

    let svgBars = '';
    let currentX = margin;
    let isBar = true;

    for (let digit of fullCode) {
      const w = parseInt(digit, 10) * moduleWidth;
      if (isBar) {
        svgBars += `<rect x="${currentX.toFixed(2)}" y="2" width="${w.toFixed(2)}" height="${barHeight}" fill="#000000" />`;
      }
      currentX += w;
      isBar = !isBar;
    }

    const textSvg = showText
      ? `<text x="${(width / 2).toFixed(2)}" y="${height - 2}" text-anchor="middle" font-family="monospace, 'Courier New', sans-serif" font-size="${fontSize}" font-weight="700" fill="#000000">${escapeHTML(cleanText)}</text>`
      : '';

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="${height}" style="display:block; margin:0 auto; background:#ffffff;">
      ${svgBars}
      ${textSvg}
    </svg>`;
  },

  // Draw Code 128 barcode directly on HTML5 Canvas Context
  drawBarcodeOnCanvas(ctx, text, x, y, width, height, options = {}) {
    const showText = options.showText !== false;
    const fontSize = options.fontSize || 14;
    const { text: cleanText, fullCode, totalModules } = this.encodeCode128(text);

    const moduleWidth = width / totalModules;
    const barHeight = showText ? height - fontSize - 4 : height;

    ctx.fillStyle = options.barColor || '#000000';
    let currentX = x;
    let isBar = true;

    for (let digit of fullCode) {
      const w = parseInt(digit, 10) * moduleWidth;
      if (isBar) {
        ctx.fillRect(Math.round(currentX), Math.round(y), Math.max(1, Math.round(w)), Math.round(barHeight));
      }
      currentX += w;
      isBar = !isBar;
    }

    if (showText) {
      ctx.fillStyle = options.textColor || '#000000';
      ctx.font = `bold ${fontSize}px "Courier New", monospace, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(String(cleanText), x + (width / 2), y + height);
    }
  },

  // Creates high-res canvas of the complete sticker label (Shop + Item + Barcode + Price)
  createLabelStickerCanvas(item, barcodeVal, shopName, layout = '30x15') {
    const canvas = document.createElement('canvas');
    
    if (layout === '30x15') {
      // 30mm x 15mm at high resolution (300+ DPI equivalent ratio: 708px x 354px)
      const scale = 3;
      const width = 354 * scale;  // 1062px
      const height = 177 * scale; // 531px
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // White Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Price String
      const priceStr = typeof fmt === 'function' ? fmt(item.sellPrice) : `රු. ${item.sellPrice}`;
      ctx.fillStyle = '#000000';
      ctx.font = `900 ${28 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      const priceWidth = ctx.measureText(priceStr).width;
      ctx.fillText(priceStr, width - (16 * scale), 14 * scale);

      // Item Name on top left
      ctx.font = `700 ${24 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Iskoola Pota", sans-serif`;
      ctx.textAlign = 'left';
      let itemName = (item.name || '').trim();
      const maxItemWidth = width - priceWidth - (40 * scale);
      if (ctx.measureText(itemName).width > maxItemWidth) {
        while (itemName.length > 0 && ctx.measureText(itemName + '...').width > maxItemWidth) {
          itemName = itemName.slice(0, -1);
        }
        itemName += '...';
      }
      ctx.fillText(itemName, 16 * scale, 16 * scale);

      // Barcode filling main body
      const bcWidth = width - (24 * scale);
      const bcHeight = height - (64 * scale);
      const bcX = 12 * scale;
      const bcY = 52 * scale;

      this.drawBarcodeOnCanvas(ctx, barcodeVal, bcX, bcY, bcWidth, bcHeight, {
        fontSize: 22 * scale,
        barColor: '#000000',
        textColor: '#000000'
      });

      return canvas;
    }

    // Default / standard sticker layout (50x30mm / 40x25mm)
    const scale = 2;
    const width = 280 * scale;  // 560px
    const height = 180 * scale; // 360px
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Rounded border
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2 * scale;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(6 * scale, 6 * scale, width - (12 * scale), height - (12 * scale), 8 * scale);
      ctx.stroke();
    } else {
      ctx.strokeRect(6 * scale, 6 * scale, width - (12 * scale), height - (12 * scale));
    }

    // Shop Name
    ctx.fillStyle = '#64748b';
    ctx.font = `800 ${11 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const sName = (shopName || 'HARDWAREPOS').toUpperCase();
    ctx.fillText(sName, width / 2, 14 * scale);

    // Item Name
    ctx.fillStyle = '#0f172a';
    ctx.font = `700 ${13.5 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Iskoola Pota", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    let itemName = (item.name || '').trim();
    const maxTextWidth = width - (32 * scale);
    if (ctx.measureText(itemName).width > maxTextWidth) {
      while (itemName.length > 0 && ctx.measureText(itemName + '...').width > maxTextWidth) {
        itemName = itemName.slice(0, -1);
      }
      itemName += '...';
    }
    ctx.fillText(itemName, width / 2, 30 * scale);

    // Barcode
    const bcWidth = 220 * scale;
    const bcHeight = 66 * scale;
    const bcX = (width - bcWidth) / 2;
    const bcY = 56 * scale;
    this.drawBarcodeOnCanvas(ctx, barcodeVal, bcX, bcY, bcWidth, bcHeight, {
      fontSize: 12 * scale,
      barColor: '#000000',
      textColor: '#0f172a'
    });

    // Price
    ctx.fillStyle = '#0f172a';
    ctx.font = `900 ${16 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Iskoola Pota", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    const priceText = typeof fmt === 'function' ? fmt(item.sellPrice) : `රු. ${item.sellPrice}`;
    ctx.fillText(priceText, width / 2, height - (14 * scale));

    return canvas;
  },

  // Creates high-res canvas of just the barcode with text
  createBarcodeOnlyCanvas(barcodeVal) {
    const canvas = document.createElement('canvas');
    const scale = 2;
    const width = 240 * scale;  // 480px
    const height = 90 * scale;  // 180px
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Quiet zone (pure white)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const bcWidth = width - (24 * scale);
    const bcHeight = height - (20 * scale);
    const bcX = 12 * scale;
    const bcY = 8 * scale;

    this.drawBarcodeOnCanvas(ctx, barcodeVal, bcX, bcY, bcWidth, bcHeight, {
      fontSize: 13 * scale,
      barColor: '#000000',
      textColor: '#0f172a'
    });

    return canvas;
  },

  // Download Sticker Label as PNG image
  downloadLabelPNG(item, barcodeVal, shopName, layout = '30x15') {
    const canvas = this.createLabelStickerCanvas(item, barcodeVal, shopName, layout);
    const filename = this.getDownloadFilename('label', item.name, barcodeVal, 'png');
    this.saveCanvasToFile(canvas, filename);
  },

  // Download Barcode image only as PNG
  downloadBarcodePNG(barcodeVal, itemName = 'item') {
    const canvas = this.createBarcodeOnlyCanvas(barcodeVal);
    const filename = this.getDownloadFilename('barcode', itemName, barcodeVal, 'png');
    this.saveCanvasToFile(canvas, filename);
  },

  // Download Vector Barcode SVG file
  downloadBarcodeSVG(barcodeVal, itemName = 'item') {
    const svgContent = this.generateCode128SVG(barcodeVal, { width: 260, height: 80, fontSize: 13 });
    const filename = this.getDownloadFilename('barcode', itemName, barcodeVal, 'svg');
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    this.triggerDownloadBlob(blob, filename);
  },

  // Generate safe filename for download
  getDownloadFilename(prefix, itemName, barcodeVal, ext = 'png') {
    const cleanName = String(itemName || 'item')
      .trim()
      .replace(/[\\/:*?"<>|]/g, '_')
      .replace(/\s+/g, '_')
      .slice(0, 25);
    const cleanCode = String(barcodeVal || '').replace(/[^a-zA-Z0-9_-]/g, '');
    return `${prefix}_${cleanName}_${cleanCode}.${ext}`;
  },

  // Save Canvas to file (Blob with DataURL fallback)
  saveCanvasToFile(canvas, filename) {
    if (canvas.toBlob) {
      canvas.toBlob((blob) => {
        if (blob) {
          this.triggerDownloadBlob(blob, filename);
        } else {
          this.triggerDownloadDataUrl(canvas.toDataURL('image/png'), filename);
        }
      }, 'image/png');
    } else {
      this.triggerDownloadDataUrl(canvas.toDataURL('image/png'), filename);
    }
  },

  triggerDownloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  },

  triggerDownloadDataUrl(dataUrl, filename) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  },

  /* ---------------- BARCODE LABEL STICKER PRINT & DOWNLOAD MODAL ---------------- */
  async openLabelPrintModal(itemId, preferredBarcode = null) {
    const item = DB.getItem(itemId);
    if (!item) {
      toast("භාණ්ඩය සොයාගත නොහැකි විය", "err");
      return;
    }

    let barcodeVal = (preferredBarcode || item.barcode || '').trim();
    let isNewlyGenerated = false;
    if (!barcodeVal) {
      barcodeVal = BarcodeSystem.generateBarcode();
      isNewlyGenerated = true;
    }

    // Persist barcode to DB immediately so the first generated barcode is saved and never changes!
    if ((item.barcode || '').trim() !== barcodeVal) {
      item.barcode = barcodeVal;
      try {
        await DB.updateItem(item.id, { barcode: barcodeVal });
        if (typeof App !== 'undefined' && App.render) {
          App.render();
        }
      } catch (err) {
        console.error("Failed to save barcode:", err);
      }
    }

    const shopName = (DB.data.settings && DB.data.settings.shopName) || 'HardwarePOS';

    openModal({
      title: `${t('barcode_print_title') || '🖨 Barcode ලේබල් මුද්‍රණය'} — ${escapeHTML(item.name)}`,
      bodyHTML: `
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:16px;">
          <div>
            <div class="field">
              <label class="field-label">${t('barcode_copies') || 'පිටපත් ගණන (Copies)'}</label>
              <input type="number" class="input" id="lblCopies" min="1" max="100" value="1" style="font-weight:700; font-size:16px;">
            </div>
            <div class="field">
              <label class="field-label">${t('barcode_paper_size') || 'ස්ටිකර් ප්‍රමාණය / Layout'}</label>
              <select class="input" id="lblLayout" style="font-weight:700;">
                <option value="30x15" selected>🏷 Thermal Sticker 30mm x 15mm (කුඩා - Small Fit)</option>
                <option value="40x25">🏷 Thermal Sticker 40mm x 25mm</option>
                <option value="50x25">🏷 Thermal Sticker 50mm x 25mm</option>
                <option value="50x30">🏷 Thermal Sticker 50mm x 30mm (මධ්‍යම - Medium)</option>
                <option value="single">🏷 Generic Thermal Sticker (Single)</option>
                <option value="2col">📄 A4 / Sheet (2 Columns)</option>
                <option value="3col">📄 A4 / Sheet (3 Columns)</option>
              </select>
            </div>
            <div style="background:var(--paper); border:1px solid var(--border); border-radius:8px; padding:10px; font-size:12.5px; color:var(--charcoal);">
              <div>📦 <b>${escapeHTML(item.name)}</b></div>
              <div style="margin-top:2px;">💰 මිල: <b>${fmt(item.sellPrice)}</b></div>
              <div style="margin-top:2px;">🏷 Barcode: <code style="font-weight:bold; color:var(--primary); font-size:13px;">${escapeHTML(barcodeVal)}</code></div>
              ${isNewlyGenerated ? `<div style="margin-top:6px; font-size:11.5px; color:#16a34a; font-weight:700;"><i class="ph ph-check-circle"></i> Barcode එක සාදා මෙම භාණ්ඩයට ස්ථිරව සුරකින ලදී</div>` : ''}
            </div>
          </div>
          <div>
            <label class="field-label">Sticker Live Preview</label>
            <div id="labelLivePreview" style="background:#f8fafc; border:2px dashed var(--border); border-radius:8px; padding:12px; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:170px; box-shadow:0 2px 6px rgba(0,0,0,0.05);">
              <!-- Rendered preview -->
            </div>
            <div style="margin-top:10px; display:flex; gap:6px; justify-content:center; flex-wrap:wrap;">
              <button type="button" class="btn btn-sm btn-outline" id="quickDlStickerBtn" title="Download Sticker Image (PNG)" style="font-size:11.5px; padding:5px 9px; display:inline-flex; align-items:center; gap:4px;">
                <i class="ph ph-download-simple"></i> Sticker (PNG)
              </button>
              <button type="button" class="btn btn-sm btn-outline" id="quickDlBarcodeBtn" title="Download Barcode Only (PNG)" style="font-size:11.5px; padding:5px 9px; display:inline-flex; align-items:center; gap:4px;">
                <i class="ph ph-barcode"></i> Barcode (PNG)
              </button>
              <button type="button" class="btn btn-sm btn-outline" id="quickDlSvgBtn" title="Download Vector SVG" style="font-size:11.5px; padding:5px 9px; display:inline-flex; align-items:center; gap:4px;">
                <i class="ph ph-file-code"></i> SVG
              </button>
            </div>
          </div>
        </div>
      `,
      footHTML: `
        <button class="btn btn-outline" data-close>${t('cancel')}</button>
        <button class="btn btn-outline" id="doDownloadBarcodeOnlyBtn" title="Barcode පමණක් PNG ලෙස බාගත කරන්න" style="display:inline-flex; align-items:center; gap:6px;">
          <i class="ph ph-barcode"></i> Barcode PNG
        </button>
        <button class="btn btn-outline" id="doDownloadLabelBtn" style="font-weight:700; border-color:var(--primary); color:var(--primary); display:inline-flex; align-items:center; gap:6px;">
          <i class="ph ph-download-simple"></i> ${t('barcode_download_label') || 'Sticker (PNG) Download'}
        </button>
        <button class="btn btn-primary" id="doPrintBarcodeBtn" style="font-weight:800;">
          <i class="ph ph-printer"></i> ${t('receipt_print') || 'Print කරන්න'}
        </button>
      `,
      onMount: (wrap) => {
        const previewEl = wrap.querySelector('#labelLivePreview');
        const copiesInp = wrap.querySelector('#lblCopies');
        const layoutSel = wrap.querySelector('#lblLayout');

        const updatePreview = () => {
          if (!previewEl) return;
          const layout = layoutSel.value;
          
          if (layout === '30x15') {
            const svg = BarcodeSystem.generateCode128SVG(barcodeVal, { width: 220, height: 50, margin: 2, fontSize: 11 });
            previewEl.innerHTML = `
              <div style="font-size:11px; font-weight:700; color:var(--primary); margin-bottom:6px; text-align:center;">🏷 30mm x 15mm Sticker Preview</div>
              <div style="width:240px; height:120px; border:2px dashed #94a3b8; border-radius:6px; padding:6px; background:#fff; font-family:var(--font-base); display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 2px 8px rgba(0,0,0,0.08); margin:0 auto;">
                <div style="display:flex; justify-content:space-between; align-items:center; width:100%; font-size:11px; line-height:1.1; color:#0f172a; font-weight:700;">
                  <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:62%; font-weight:700;">${escapeHTML(item.name)}</span>
                  <span style="font-weight:900; font-size:12px; color:#0f172a;">${fmt(item.sellPrice)}</span>
                </div>
                <div style="width:100%; flex:1; display:flex; align-items:center; justify-content:center; margin-top:2px;">
                  ${svg}
                </div>
              </div>
            `;
          } else if (layout === '40x25') {
            const svg = BarcodeSystem.generateCode128SVG(barcodeVal, { width: 220, height: 50, margin: 4, fontSize: 11 });
            previewEl.innerHTML = `
              <div style="font-size:11px; font-weight:700; color:var(--primary); margin-bottom:6px; text-align:center;">🏷 40mm x 25mm Sticker Preview</div>
              <div style="width:240px; height:150px; border:2px dashed #94a3b8; border-radius:6px; padding:8px; background:#fff; font-family:var(--font-base); display:flex; flex-direction:column; justify-content:space-between; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,0.08); margin:0 auto;">
                <div style="font-size:10px; font-weight:800; text-transform:uppercase; color:#64748b;">${escapeHTML(shopName)}</div>
                <div style="font-size:12px; font-weight:700; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHTML(item.name)}</div>
                ${svg}
                <div style="font-size:13.5px; font-weight:900; color:#0f172a;">${fmt(item.sellPrice)}</div>
              </div>
            `;
          } else {
            const svg = BarcodeSystem.generateCode128SVG(barcodeVal, { width: 190, height: 50, fontSize: 12 });
            previewEl.innerHTML = `
              <div style="font-size:11px; font-weight:700; color:var(--primary); margin-bottom:6px; text-align:center;">🏷 Standard Sticker Preview</div>
              <div style="text-align:center; max-width:210px; border:2px dashed #94a3b8; border-radius:6px; padding:8px 6px; background:#fff; font-family:var(--font-base); box-shadow:0 2px 8px rgba(0,0,0,0.08); margin:0 auto;">
                <div style="font-size:10px; font-weight:800; text-transform:uppercase; color:#64748b; letter-spacing:0.5px; margin-bottom:2px;">${escapeHTML(shopName)}</div>
                <div style="font-size:12.5px; font-weight:700; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:4px;">${escapeHTML(item.name)}</div>
                ${svg}
                <div style="font-size:14px; font-weight:800; color:#0f172a; margin-top:3px;">${fmt(item.sellPrice)}</div>
              </div>
            `;
          }
        };

        updatePreview();
        copiesInp.addEventListener('input', updatePreview);
        layoutSel.addEventListener('change', updatePreview);

        const handleDownloadLabel = () => {
          const layout = layoutSel.value;
          BarcodeSystem.downloadLabelPNG(item, barcodeVal, shopName, layout);
          toast("✅ Barcode Sticker එක බාගත විය!", "ok");
        };

        const handleDownloadBarcode = () => {
          BarcodeSystem.downloadBarcodePNG(barcodeVal, item.name);
          toast("✅ Barcode රූපය බාගත විය!", "ok");
        };

        const handleDownloadSvg = () => {
          BarcodeSystem.downloadBarcodeSVG(barcodeVal, item.name);
          toast("✅ Barcode SVG ගොනුව බාගත විය!", "ok");
        };

        wrap.querySelector('#doDownloadLabelBtn')?.addEventListener('click', handleDownloadLabel);
        wrap.querySelector('#quickDlStickerBtn')?.addEventListener('click', handleDownloadLabel);
        wrap.querySelector('#doDownloadBarcodeOnlyBtn')?.addEventListener('click', handleDownloadBarcode);
        wrap.querySelector('#quickDlBarcodeBtn')?.addEventListener('click', handleDownloadBarcode);
        wrap.querySelector('#quickDlSvgBtn')?.addEventListener('click', handleDownloadSvg);

        wrap.querySelector('#doPrintBarcodeBtn')?.addEventListener('click', () => {
          const copies = Math.max(1, Math.min(100, Number(copiesInp.value) || 1));
          const layout = layoutSel.value;
          BarcodeSystem.printLabels(item, barcodeVal, copies, layout, shopName);
        });
      }
    });
  },

  // Print Barcode stickers using iframe / print window
  printLabels(item, barcodeVal, copies, layout, shopName) {
    let pageCss = '';
    let labelHTML = '';

    if (layout === '30x15') {
      const svgCode = BarcodeSystem.generateCode128SVG(barcodeVal, { width: 220, height: 50, margin: 2, fontSize: 11 });
      pageCss = `
        @page {
          size: 30mm 15mm;
          margin: 0;
        }
        html, body {
          width: 30mm;
          height: 15mm;
          margin: 0;
          padding: 0;
          background: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
          -webkit-print-color-adjust: exact;
        }
        .barcode-container {
          display: block;
          margin: 0;
          padding: 0;
        }
        .barcode-sticker {
          width: 30mm;
          height: 15mm;
          box-sizing: border-box;
          padding: 0.5mm 1mm;
          page-break-after: always;
          break-after: page;
          page-break-inside: avoid;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: #ffffff;
        }
        .stk-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          font-size: 7.5pt;
          line-height: 1.1;
          color: #000000;
          font-weight: 700;
        }
        .stk-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 60%;
          font-size: 7.5pt;
          font-weight: 700;
          color: #000000;
        }
        .stk-price {
          font-size: 8.5pt;
          font-weight: 900;
          white-space: nowrap;
          color: #000000;
        }
        .stk-barcode {
          width: 100%;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stk-barcode svg {
          width: 100% !important;
          height: 10.5mm !important;
          max-height: 100%;
          display: block;
        }
      `;

      for (let i = 0; i < copies; i++) {
        labelHTML += `
          <div class="barcode-sticker">
            <div class="stk-header">
              <span class="stk-name">${escapeHTML(item.name)}</span>
              <span class="stk-price">${fmt(item.sellPrice)}</span>
            </div>
            <div class="stk-barcode">${svgCode}</div>
          </div>
        `;
      }
    } else if (layout === '40x25') {
      const svgCode = BarcodeSystem.generateCode128SVG(barcodeVal, { width: 220, height: 55, margin: 4, fontSize: 11 });
      pageCss = `
        @page {
          size: 40mm 25mm;
          margin: 0;
        }
        html, body {
          width: 40mm;
          height: 25mm;
          margin: 0;
          padding: 0;
          background: #ffffff;
        }
        .barcode-container { display: block; margin: 0; padding: 0; }
        .barcode-sticker {
          width: 40mm;
          height: 25mm;
          box-sizing: border-box;
          padding: 1mm 1.5mm;
          page-break-after: always;
          break-after: page;
          page-break-inside: avoid;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: center;
          background: #ffffff;
        }
        .stk-shop { font-size: 7.5pt; font-weight: 800; text-transform: uppercase; color: #475569; }
        .stk-name { font-size: 8.5pt; font-weight: 700; color: #000; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 1px 0; }
        .stk-barcode svg { width: 100% !important; height: 14mm !important; display: block; }
        .stk-price { font-size: 10pt; font-weight: 900; color: #000; }
      `;

      for (let i = 0; i < copies; i++) {
        labelHTML += `
          <div class="barcode-sticker">
            <div class="stk-shop">${escapeHTML(shopName)}</div>
            <div class="stk-name">${escapeHTML(item.name)}</div>
            <div class="stk-barcode">${svgCode}</div>
            <div class="stk-price">${fmt(item.sellPrice)}</div>
          </div>
        `;
      }
    } else if (layout === '50x25' || layout === '50x30') {
      const hMm = layout === '50x30' ? '30mm' : '25mm';
      const svgCode = BarcodeSystem.generateCode128SVG(barcodeVal, { width: 220, height: 60, margin: 4, fontSize: 12 });
      pageCss = `
        @page {
          size: 50mm ${hMm};
          margin: 0;
        }
        html, body {
          width: 50mm;
          height: ${hMm};
          margin: 0;
          padding: 0;
          background: #ffffff;
        }
        .barcode-container { display: block; margin: 0; padding: 0; }
        .barcode-sticker {
          width: 50mm;
          height: ${hMm};
          box-sizing: border-box;
          padding: 1.5mm 2mm;
          page-break-after: always;
          break-after: page;
          page-break-inside: avoid;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: center;
          background: #ffffff;
        }
        .stk-shop { font-size: 8pt; font-weight: 800; text-transform: uppercase; color: #475569; }
        .stk-name { font-size: 9.5pt; font-weight: 700; color: #000; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 1px 0; }
        .stk-barcode svg { width: 100% !important; height: ${layout === '50x30' ? '17mm' : '14mm'} !important; display: block; }
        .stk-price { font-size: 11pt; font-weight: 900; color: #000; }
      `;

      for (let i = 0; i < copies; i++) {
        labelHTML += `
          <div class="barcode-sticker">
            <div class="stk-shop">${escapeHTML(shopName)}</div>
            <div class="stk-name">${escapeHTML(item.name)}</div>
            <div class="stk-barcode">${svgCode}</div>
            <div class="stk-price">${fmt(item.sellPrice)}</div>
          </div>
        `;
      }
    } else {
      // Generic single sticker / A4 Sheet layouts (2col, 3col, single)
      const svgCode = BarcodeSystem.generateCode128SVG(barcodeVal, { width: 180, height: 48, fontSize: 11 });
      const gridStyle = layout === 'single'
        ? `display: flex; flex-direction: column; align-items: center; gap: 8px;`
        : layout === '2col'
          ? `display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 10px;`
          : `display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; padding: 10px;`;

      pageCss = `
        @page {
          margin: ${layout === 'single' ? '2mm' : '8mm'};
          size: auto;
        }
        .barcode-container {
          ${gridStyle}
        }
        .barcode-sticker {
          width: ${layout === 'single' ? '48mm' : '100%'};
          max-width: 220px;
          padding: 4px 6px;
          text-align: center;
          border: 1px dashed #cbd5e1;
          border-radius: 4px;
          page-break-inside: avoid;
          background: #ffffff;
        }
        .stk-shop { font-size: 9px; font-weight: 800; text-transform: uppercase; color: #475569; }
        .stk-name { font-size: 11.5px; font-weight: 700; color: #000; line-height: 1.2; margin: 2px 0 1px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .stk-barcode svg { display: block; margin: 0 auto; max-width: 100%; height: auto; }
        .stk-price { font-size: 13px; font-weight: 800; color: #000; line-height: 1.1; margin-top: 2px; }
      `;

      for (let i = 0; i < copies; i++) {
        labelHTML += `
          <div class="barcode-sticker">
            <div class="stk-shop">${escapeHTML(shopName)}</div>
            <div class="stk-name">${escapeHTML(item.name)}</div>
            <div class="stk-barcode">${svgCode}</div>
            <div class="stk-price">${fmt(item.sellPrice)}</div>
          </div>
        `;
      }
    }

    const printWin = window.open('', '_blank', 'width=800,height=600');
    if (!printWin) {
      toast("Pop-up window blocked. Please allow popups to print barcode labels.", "err");
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print Barcodes - ${escapeHTML(item.name)}</title>
        <style>
          @page {
            margin: ${layout === 'single' ? '2mm' : '8mm'};
            size: auto;
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            background: #fff;
            color: #000;
          }
          .barcode-container {
            ${gridStyle}
          }
          .barcode-sticker {
            width: ${layout === 'single' ? '48mm' : '100%'};
            max-width: 220px;
            padding: 4px 6px;
            text-align: center;
            border: 1px dashed #cbd5e1;
            border-radius: 4px;
            page-break-inside: avoid;
            background: #fff;
          }
          .stk-shop {
            font-size: 9px;
            font-weight: 800;
            text-transform: uppercase;
            color: #475569;
            line-height: 1.1;
          }
          .stk-name {
            font-size: 11.5px;
            font-weight: 700;
            color: #000;
            line-height: 1.2;
            margin: 2px 0 1px 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .stk-barcode svg {
            display: block;
            margin: 0 auto;
            max-width: 100%;
            height: auto;
          }
          .stk-price {
            font-size: 13px;
            font-weight: 800;
            color: #000;
            line-height: 1.1;
            margin-top: 2px;
          }
          @media print {
            .barcode-sticker {
              border: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="barcode-container">
          ${labelHTML}
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 800);
          };
        </script>
      </body>
      </html>
    `);
    printWin.document.close();
  },

  /* ---------------- CAMERA BARCODE SCANNER MODAL ---------------- */
  activeStream: null,
  activeVideoEl: null,
  isScanning: false,

  openCameraScanner(onDetectedCallback) {
    let currentFacingMode = 'environment'; // Back camera default

    openModal({
      title: t('barcode_cam_title') || '📷 Barcode Camera Scanner',
      bodyHTML: `
        <div style="display:flex; flex-direction:column; align-items:center; position:relative; overflow:hidden; border-radius:10px; background:#0f172a; min-height:280px;">
          <video id="barcodeVideo" autoplay playsinline muted style="width:100%; max-height:360px; object-fit:cover; border-radius:10px;"></video>
          
          <!-- Scanner Target Overlay -->
          <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none;">
            <div style="width:240px; height:140px; border:2px solid #22c55e; border-radius:12px; box-shadow:0 0 0 9999px rgba(0,0,0,0.45); position:relative;">
              <div style="position:absolute; left:0; right:0; top:50%; height:2px; background:linear-gradient(90deg, transparent, #ef4444, transparent); box-shadow:0 0 8px #ef4444; animation: scanPulse 1.8s infinite ease-in-out;"></div>
            </div>
          </div>

          <div id="camStatusMsg" style="position:absolute; bottom:10px; left:10px; right:10px; text-align:center; background:rgba(0,0,0,0.7); color:#fff; font-size:12px; font-weight:600; padding:6px 10px; border-radius:6px;">
            ${t('barcode_cam_instruction') || 'භාණ්ඩයේ Barcode එක කැමරාව ඉදිරියෙන් තබන්න...'}
          </div>
        </div>
        <style>
          @keyframes scanPulse {
            0% { top: 15%; opacity: 0.3; }
            50% { top: 85%; opacity: 1; }
            100% { top: 15%; opacity: 0.3; }
          }
        </style>
      `,
      footHTML: `
        <button class="btn btn-outline" id="switchCamBtn" type="button"><i class="ph ph-camera-rotate"></i> ${t('barcode_cam_switch') || 'කැමරාව මාරු කරන්න'}</button>
        <button class="btn btn-outline" data-close>${t('close')}</button>
      `,
      onMount: (wrap) => {
        const video = wrap.querySelector('#barcodeVideo');
        const statusEl = wrap.querySelector('#camStatusMsg');
        const switchBtn = wrap.querySelector('#switchCamBtn');
        BarcodeSystem.activeVideoEl = video;
        BarcodeSystem.isScanning = true;

        const startCamera = async (facing) => {
          if (BarcodeSystem.activeStream) {
            BarcodeSystem.activeStream.getTracks().forEach(t => t.stop());
          }
          try {
            statusEl.textContent = "කැමරාව ආරම්භ වෙමින් පවතී...";
            const stream = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
              audio: false
            });
            BarcodeSystem.activeStream = stream;
            video.srcObject = stream;
            await video.play();
            statusEl.textContent = t('barcode_cam_instruction') || 'භාණ්ඩයේ Barcode එක කැමරාව ඉදිරියෙන් තබන්න...';
            BarcodeSystem.runDetectionLoop(video, onDetectedCallback);
          } catch (err) {
            console.error("Camera access failed:", err);
            statusEl.innerHTML = `<span style="color:#f87171;">⚠️ කැමරාවට ප්‍රවේශ විය නොහැකි විය. Permission ලබා දී ඇත්දැයි බලන්න.</span>`;
          }
        };

        startCamera(currentFacingMode);

        switchBtn.addEventListener('click', () => {
          currentFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
          startCamera(currentFacingMode);
        });
      }
    });

    // Clean up camera stream when modal is closed
    const modalWrap = document.getElementById('activeModal');
    if (modalWrap) {
      modalWrap.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-close') || e.target.id === 'activeModal') {
          BarcodeSystem.isScanning = false;
          if (BarcodeSystem.activeStream) {
            BarcodeSystem.activeStream.getTracks().forEach(t => t.stop());
            BarcodeSystem.activeStream = null;
          }
          BarcodeSystem.activeVideoEl = null;
        }
      });
    }
  },

  // Detection loop using Browser BarcodeDetector API or fallback
  async runDetectionLoop(video, callback) {
    if ('BarcodeDetector' in window) {
      try {
        const formats = ['ean_13', 'ean_8', 'code_128', 'code_39', 'upc_a', 'upc_e', 'qr_code', 'data_matrix'];
        const detector = new window.BarcodeDetector({ formats });

        const detect = async () => {
          if (!BarcodeSystem.isScanning || !video || video.readyState < 2) {
            if (BarcodeSystem.isScanning) requestAnimationFrame(detect);
            return;
          }
          try {
            const barcodes = await detector.detect(video);
            if (barcodes && barcodes.length > 0) {
              const code = barcodes[0].rawValue;
              if (code) {
                BarcodeSystem.playBeep(true);
                BarcodeSystem.isScanning = false;
                if (BarcodeSystem.activeStream) {
                  BarcodeSystem.activeStream.getTracks().forEach(t => t.stop());
                  BarcodeSystem.activeStream = null;
                }
                closeModal();
                if (typeof callback === 'function') {
                  callback(code);
                }
                return;
              }
            }
          } catch (e) {
            // detection cycle error, keep looping
          }
          if (BarcodeSystem.isScanning) {
            requestAnimationFrame(detect);
          }
        };
        detect();
        return;
      } catch (e) {
        console.warn("BarcodeDetector error, using manual entry", e);
      }
    }
    
    const statusEl = document.getElementById('camStatusMsg');
    if (statusEl) {
      statusEl.innerHTML = `<span>ℹ️ මෙම බ්‍රවුසරයේ BarcodeDetector නැත. කරුණාකර USB Scanner එකෙන් හෝ කෙලින්ම Type කරන්න.</span>`;
    }
  },

  /* ---------------- HARDWARE USB / BLUETOOTH SCANNER GLOBAL LISTENER ---------------- */
  buffer: '',
  lastKeyTime: 0,

  initGlobalScanner() {
    window.addEventListener('keydown', (e) => {
      // Ignore navigation / special control keys
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'].includes(e.key)) {
        return;
      }

      const now = Date.now();
      const timeDiff = now - BarcodeSystem.lastKeyTime;
      BarcodeSystem.lastKeyTime = now;

      // When Enter key is pressed
      if (e.key === 'Enter') {
        const activeEl = document.activeElement;
        const inSaleSearch = activeEl && activeEl.id === 'saleSearch';
        const inBarcodeField = activeEl && activeEl.id === 'f_barcode';

        // 1. If buffer has collected rapid scanner keystrokes (at least 3 characters)
        if (BarcodeSystem.buffer.length >= 3 && timeDiff < 150) {
          const scannedCode = BarcodeSystem.buffer.trim();
          BarcodeSystem.buffer = '';
          e.preventDefault();
          BarcodeSystem.handleScannedBarcode(scannedCode);
          return;
        }

        // 2. If user scanned or typed into saleSearch input and pressed Enter
        if (inSaleSearch && activeEl.value.trim()) {
          const query = activeEl.value.trim();
          const item = DB.getItemByBarcode(query);
          const sale = DB.findSaleByBarcode ? DB.findSaleByBarcode(query) : null;
          if (item || sale) {
            e.preventDefault();
            activeEl.value = '';
            BarcodeSystem.handleScannedBarcode(query);
            return;
          }
        }

        // Reset buffer on Enter
        BarcodeSystem.buffer = '';
        return;
      }

      // Printable single character key
      if (e.key.length === 1) {
        // If typing interval is within fast scanner timing (or starting new buffer)
        if (timeDiff > 120) {
          // Reset buffer if delay too long (manual slow typing)
          BarcodeSystem.buffer = e.key;
        } else {
          BarcodeSystem.buffer += e.key;
        }
      }
    }, true);
  },

  // Central handler when a barcode is scanned by Hardware or Camera scanner
  handleScannedBarcode(code) {
    code = String(code || '').trim();
    if (!code) return;

    // 0. CHECK IF THIS IS A BILL / INVOICE BARCODE!
    const billSale = DB.findSaleByBarcode ? DB.findSaleByBarcode(code) : null;
    if (billSale) {
      BarcodeSystem.playBeep(true);
      Views.sale.showReceipt(billSale);
      toast(`🧾 බිල්පත #${billSale.id} විවෘත විය! (${billSale.lines.length} items - ${fmt(billSale.total)})`, 'ok');

      // Clear search inputs if they contain the code
      const searchInp = document.getElementById('saleSearch');
      if (searchInp) {
        searchInp.value = '';
        const suggest = document.getElementById('saleSuggest');
        if (suggest) {
          suggest.style.display = 'none';
          suggest.innerHTML = '';
        }
      }
      const histSearch = document.getElementById('historySearch');
      if (histSearch) {
        histSearch.value = String(billSale.id);
        if (typeof Views.history !== 'undefined' && Views.history.tableHTML) {
          Views.history.searchQ = String(billSale.id);
          const histWrap = document.getElementById('histTableWrap');
          if (histWrap) {
            histWrap.innerHTML = Views.history.tableHTML();
            Views.history.bindRowActions();
          }
        }
      }
      return;
    }

    // A. If an Item Modal with #f_barcode is currently open, populate the field
    const barcodeInput = document.getElementById('f_barcode');
    if (barcodeInput && barcodeInput.offsetParent !== null) {
      barcodeInput.value = code;
      BarcodeSystem.playBeep(true);
      toast(`${t('barcode_scanned') || 'Barcode එක සටහන් විය'}: ${code}`, 'ok');
      barcodeInput.focus();
      return;
    }

    // B. If on Sale / POS view, lookup item and add to cart
    if (App.currentView === 'sale') {
      const item = DB.getItemByBarcode(code);
      if (item) {
        BarcodeSystem.playBeep(true);
        Views.sale.addToCart(item.id);
        Views.sale.applyCustomerHardwareDiscount();
        toast(`✅ ${item.name} (Cart +1)`, 'ok');
        
        // Clear sale search if it contained the barcode
        const searchInp = document.getElementById('saleSearch');
        if (searchInp) {
          searchInp.value = '';
          const suggest = document.getElementById('saleSuggest');
          if (suggest) suggest.innerHTML = '';
        }
      } else {
        // Barcode not found in inventory
        BarcodeSystem.playBeep(false);
        toast(`⚠️ Barcode <b>${escapeHTML(code)}</b> හමු නොවුණි!`, 'err');

        // Show prompt to quickly add this item with prefilled barcode
        BarcodeSystem.promptQuickAddItem(code);
      }
      return;
    }

    // C. If on Stock / Items view, search for this barcode
    if (App.currentView === 'stock') {
      const searchInp = document.getElementById('itemsSearch') || document.getElementById('stockSearch');
      if (searchInp) {
        searchInp.value = code;
        searchInp.dispatchEvent(new Event('input'));
        BarcodeSystem.playBeep(true);
      }
    }
  },

  // Prompt to quickly add unknown scanned barcode
  promptQuickAddItem(scannedBarcode) {
    const existingModal = document.getElementById('activeModal');
    if (existingModal) return;

    openModal({
      title: '➕ අලුත් භාණ්ඩයක් එක් කරන්නද?',
      bodyHTML: `
        <div style="text-align:center; padding:10px 0;">
          <div style="font-size:36px; margin-bottom:8px;">📦</div>
          <p style="font-size:14.5px; color:var(--charcoal); margin-bottom:12px;">
            ස්කෑන් කළ Barcode එක: <b style="font-family:monospace; color:var(--primary); font-size:16px;">${escapeHTML(scannedBarcode)}</b>
          </p>
          <p class="text-muted small">
            මෙම Barcode එක සහිත භාණ්ඩයක් තවම System එකේ නැත. දැන්ම අලුත් භාණ්ඩයක් ලෙස ඇතුළත් කිරීමට අවශ්‍යද?
          </p>
        </div>
      `,
      footHTML: `
        <button class="btn btn-outline" data-close>${t('cancel')}</button>
        <button class="btn btn-primary" id="confirmAddScannedBtn">＋ භාණ්ඩය ඇතුළත් කරන්න</button>
      `,
      onMount: (wrap) => {
        wrap.querySelector('#confirmAddScannedBtn').addEventListener('click', () => {
          closeModal();
          Views.items.openAddModal({ barcode: scannedBarcode });
        });
      }
    });
  }
};

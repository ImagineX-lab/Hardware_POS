/* =========================================================
   HardwarePOS — Views
   Each view has: render (returns HTML string) + bind (attach events)
   ========================================================= */

const Views = {};
let cart = []; // { itemId, name, unit, unitPrice, qty, maxQty }

/* ================= GLOBAL PAGE HEADER TEMPLATE =================
   Usage: Views.renderPageHeader({ icon, title, count, search, actions })
   - icon    : Phosphor icon class name (e.g. 'ph-package')
   - title   : Page title string
   - count   : (optional) number shown as a badge beside the title
   - search  : (optional) { id, placeholder, value }
   - actions : (optional) [{ id, label, cls }]  cls defaults to 'btn-primary'
   ================================================================ */
Views.renderPageHeader = function ({ icon = '', title = '', count = null, search = null, actions = [] } = {}) {
  const countBadge = (count !== null && count !== undefined)
    ? `<span class="page-header-count">${count}</span>`
    : '';
  const iconHTML = icon ? `<i class="ph ${icon} page-header-icon"></i>` : '';
  const searchHTML = search
    ? `<input class="input" id="${search.id}" placeholder="${search.placeholder || ''}" style="width:220px" value="${search.value || ''}">`
    : '';
  const actionsHTML = actions.map(a =>
    `<button class="btn ${a.cls || 'btn-primary'}" id="${a.id}">${a.label}</button>`
  ).join('');

  return `
    <div class="page-header">
      <div class="page-header-left">
        ${iconHTML}
        <h2 class="page-header-title">${title}${countBadge}</h2>
      </div>
      <div class="page-header-right">
        ${searchHTML}
        ${actionsHTML}
      </div>
    </div>`;
};


/* ================= DASHBOARD ================= */
Views.dashboard = {
  render() {
    const items = DB.allItems();
    const low = DB.lowStockItems();
    const today = DB.todaySales();
    const todayTotal = today.reduce((s, x) => s + x.total, 0);
    const credit = DB.totalCreditOutstanding();
    const recent = DB.allSales().slice(0, 6);

    return `
      <div class="grid grid-4">
        <div class="card stat-card">
          <div class="stat-label">${t('dash_total_items')}</div>
          <div class="stat-value">${items.length}</div>
          <div class="stat-sub">${t('dash_item_types')}</div>
        </div>
        <div class="card stat-card accent-danger">
          <div class="stat-label">${t('dash_low_stock')}</div>
          <div class="stat-value">${low.length}</div>
          <div class="stat-sub">${t('dash_below_reorder')}</div>
        </div>
        <div class="card stat-card accent-success">
          <div class="stat-label">${t('dash_today_sales')}</div>
          <div class="stat-value" style="font-size:24px">${fmt(todayTotal)}</div>
          <div class="stat-sub">${today.length} ${t('dash_bills')}</div>
        </div>
        <div class="card stat-card accent-orange">
          <div class="stat-label">${t('dash_credit_due')}</div>
          <div class="stat-value" style="font-size:24px">${fmt(credit)}</div>
          <div class="stat-sub">${DB.allCustomers().length} ${t('dash_customers_count')}</div>
        </div>
      </div>

      <div class="grid grid-2 mt-20">
        <div class="card">
          <div class="card-title">${t('dash_low_stock_items')}</div>
          <div class="card-sub">${t('dash_low_stock_sub')}</div>
          ${low.length ? `
            <div class="table-wrap">
              <table>
                <thead><tr><th>${t('dash_item')}</th><th class="num">${t('dash_stock')}</th><th class="num">${t('dash_reorder')}</th></tr></thead>
                <tbody>
                  ${low.slice(0, 6).map(i => `
                    <tr>
                      <td>${escapeHTML(i.name)}</td>
                      <td class="num">${i.qty} ${escapeHTML(i.unit)}</td>
                      <td class="num text-muted">${i.reorderLevel}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : `<div class="empty-state"><div class="em-ico">✅</div><h3>${t('dash_all_good')}</h3></div>`}
        </div>

        <div class="card">
          <div class="card-title">${t('dash_recent_sales')}</div>
          <div class="card-sub">${t('dash_recent_sales_sub')}</div>
          ${recent.length ? `
            <div class="table-wrap">
              <table>
                <thead><tr><th>#</th><th>${t('dash_date')}</th><th>${t('dash_type')}</th><th class="num">${t('dash_amount')}</th><th></th></tr></thead>
                <tbody>
                  ${recent.map(s => `
                    <tr data-dash-sale-row="${s.id}" style="cursor:pointer;" title="${t('hist_preview')}">
                      <td>#${s.id}</td>
                      <td>${fmtDate(s.date)}</td>
                      <td>${s.paymentType === 'credit' ? `<span class="pill pill-warn">${t('word_credit')}</span>` : `<span class="pill pill-ok">${t('word_cash')}</span>`}</td>
                      <td class="num">${fmt(s.total)}</td>
                      <td><button class="icon-btn" data-view-sale="${s.id}" title="${t('hist_preview')}"><i class="ph ph-eye"></i></button></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : `<div class="empty-state"><div class="em-ico"><i class="ph ph-receipt"></i></div><h3>${t('dash_no_sales')}</h3></div>`}
        </div>
      </div>
    `;
  },
  bind() {
    document.querySelectorAll('[data-dash-sale-row]').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('[data-view-sale]')) return;
        const id = Number(row.dataset.dashSaleRow);
        const sale = DB.allSales().find(s => s.id === id);
        if (sale) Views.sale.showReceipt(sale);
      });
    });
    document.querySelectorAll('[data-view-sale]').forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = Number(b.dataset.viewSale);
        const sale = DB.allSales().find(s => s.id === id);
        if (sale) Views.sale.showReceipt(sale);
      });
    });
  }
};

/* ================= SALE / BILLING ================= */
Views.sale = {
  currentCategory: 'All',
  payType: 'cash',
  selectedCustomer: null,
  amountPaid: '',

  /* ===== MULTI-CART SESSION SYSTEM ===== */
  sessions: [{ cart: [], payType: 'cash', selectedCustomer: null, amountPaid: '', discount: 0 }],
  activeIdx: 0,

  saveSession() {
    const discEl = document.getElementById('saleDiscount');
    Views.sale.sessions[Views.sale.activeIdx] = {
      cart: cart.map(i => Object.assign({}, i)),
      payType: Views.sale.payType || 'cash',
      selectedCustomer: Views.sale.selectedCustomer,
      amountPaid: Views.sale.amountPaid,
      discount: discEl ? Number(discEl.value) : 0
    };
  },

  loadSession(idx) {
    const s = Views.sale.sessions[idx];
    cart = s.cart.map(i => Object.assign({}, i));
    Views.sale.payType = s.payType || 'cash';
    Views.sale.selectedCustomer = s.selectedCustomer || null;
    Views.sale.amountPaid = s.amountPaid || '';
  },

  switchTab(idx) {
    Views.sale.saveSession();
    Views.sale.activeIdx = idx;
    Views.sale.loadSession(idx);
    App.render();
  },

  addTab() {
    if (Views.sale.sessions.length >= 3) { toast(t('sale_max_tabs'), 'err'); return; }
    Views.sale.saveSession();
    Views.sale.sessions.push({ cart: [], payType: 'cash', selectedCustomer: null, amountPaid: '', discount: 0 });
    Views.sale.activeIdx = Views.sale.sessions.length - 1;
    Views.sale.loadSession(Views.sale.activeIdx);
    App.render();
  },

  closeTab(idx) {
    if (idx === 0 || idx >= Views.sale.sessions.length) return;
    Views.sale.sessions.splice(idx, 1);
    const newIdx = Math.min(Views.sale.activeIdx, Views.sale.sessions.length - 1);
    Views.sale.activeIdx = newIdx;
    Views.sale.loadSession(newIdx);
    App.render();
  },

  tabsHTML() {
    const tabsHtml = Views.sale.sessions.map((s, i) => {
      const isActive = (i === Views.sale.activeIdx);
      const count = isActive ? cart.length : s.cart.length;
      const isMain = (i === 0);
      const label = isMain ? (t('sale_main_bill') || '🛒 Main Bill') : (t('sale_quick_tab') || '⚡ Quick Sale');
      const custShort = s.selectedCustomer ? ` · ${s.selectedCustomer.name.split(' ')[0]}` : '';
      const badgeHTML = count > 0 ? `<span class="cart-tab-badge">${count}</span>` : '';
      const closeHTML = !isMain ? `<span class="cart-tab-x" data-tab-close="${i}" title="Close">✕</span>` : '';
      return `<div class="cart-tab${isActive ? ' active' : ''}${isMain ? ' main-tab' : ''}" data-tab-idx="${i}">
        <span class="cart-tab-label">${label}${custShort}</span>${badgeHTML}${closeHTML}
      </div>`;
    }).join('');
    const addBtn = Views.sale.sessions.length < 3
      ? `<div class="cart-tab cart-tab-new" id="addCartTabBtn" title="${t('sale_quick_tab_add') || 'Add Quick Sale'}"><i class="ph ph-lightning"></i> ${t('sale_quick_tab_add') || '+ Quick Sale'}</div>`
      : '';
    return `<div class="cart-tabs-wrap">${tabsHtml}${addBtn}</div>`;
  },

  render() {
    cart = cart || [];
    if (!Views.sale.payType) Views.sale.payType = 'cash';
    return `
      <div class="sale-layout">
      <div class="card">
          <div style="display:flex; gap:8px; align-items:center; margin-bottom:8px;">
            <div style="position:relative; flex:1;">
              <input class="input" id="saleSearch" placeholder="${t('sale_search_placeholder')} (නම හෝ Barcode Scan කරන්න...)" autocomplete="off" style="padding-left:36px; font-weight:600;">
              <i class="ph ph-barcode" style="position:absolute; left:10px; top:50%; transform:translateY(-50%); font-size:20px; color:var(--text-muted);"></i>
              <div id="saleSuggest" style="position:absolute; z-index:10; width:100%; top:100%;"></div>
            </div>
            <button type="button" class="btn btn-outline" id="posCamScanBtn" title="${t('barcode_camera_scan') || 'Camera Scanner'}" style="height:42px; padding:0 12px; display:inline-flex; align-items:center; gap:5px; font-weight:700; white-space:nowrap;">
              <i class="ph ph-camera" style="font-size:18px;"></i>
              <span>Scan</span>
            </button>
          </div>
          
          <div class="pos-categories" id="posCategories">
            ${Views.sale.categoriesHTML()}
          </div>
          
          <div class="pos-item-grid" id="posItemGrid">
            ${Views.sale.posGridHTML()}
          </div>
        </div>

        <div class="card" style="padding:14px; display:flex; flex-direction:column; gap:6px;">
          <div class="cart-tabs-bar">${Views.sale.tabsHTML()}</div>
          <div class="cart-list-wrap" id="cartBox" style="padding:0;">${Views.sale.cartHTML()}</div>

          <div class="totals-box" id="totalsBox" style="margin-top:auto; padding:6px 0 4px 0; border-top:1px dashed var(--border);">${Views.sale.totalsHTML()}</div>

          <!-- Payment Method Selector -->
          <div class="field" style="margin-bottom:4px;">
            <label class="field-label" style="margin-bottom:2px; font-size:12px;">${t('sale_pay_method')}</label>
            <div class="pay-toggle" style="margin:0; height:34px;">
              <button type="button" id="payCashBtn" style="padding:4px 8px; font-size:13px;" class="${Views.sale.payType === 'cash' ? 'active' : ''}">${t('sale_cash')}</button>
              <button type="button" id="payCreditBtn" style="padding:4px 8px; font-size:13px;" class="credit ${Views.sale.payType === 'credit' ? 'active' : ''}">${t('sale_credit')}</button>
            </div>
          </div>

          <!-- Customer Selection Box (For Cash or Credit) -->
          <div class="field" id="customerSelectionField" style="margin-bottom:4px; display:${Views.sale.payType === 'credit' ? 'block' : 'none'};">
            <label class="field-label" style="margin-bottom:2px; font-size:12px;">${t('sale_customer')} <small class="text-muted">(${Views.sale.payType === 'credit' ? 'අවශ්‍යයි' : 'විකල්පයි'})</small></label>
            <div id="customerSelectionWrap">
              ${Views.sale.customerWidgetHTML()}
            </div>
          </div>

          <!-- Amount Paid & Change Due / Short for Cash -->
          <div class="field" id="amountPaidWrap" style="display:${Views.sale.payType === 'cash' ? 'block' : 'none'}; margin-bottom:4px;">
            <label class="field-label" style="margin-bottom:2px; font-size:12px;">${t('sale_amount_paid')}</label>
            <input class="input" id="saleAmountPaid" type="number" min="0" step="any" placeholder="0.00" value="${Views.sale.amountPaid || ''}" style="height:36px; padding:6px 10px; font-size:15px;" autocomplete="off">
            
            <!-- Message when amount paid is less than total -->
            <div id="amountShortWrap" class="amount-short-box" style="display:none; margin-top:4px; padding:6px 10px;">
              <span style="font-size:12px; display:inline-flex; align-items:center; gap:4px;">
                <i class="ph ph-warning-circle" style="font-size:15px;"></i> මුදල අඩුයි!
              </span>
              <span style="font-size:13.5px; font-weight:800;">තව රු. <span id="amountShortAmount">0.00</span> ක් මදි</span>
            </div>

            <!-- Message when amount paid is sufficient / Change due -->
            <div id="changeDueWrap" class="change-due-box" style="display:none; margin-top:4px; padding:6px 10px;">
              <span style="font-size:12.5px; display:inline-flex; align-items:center; gap:4px;">
                <i class="ph ph-check-circle" style="font-size:15px;"></i> ${t('sale_change_due')}
              </span>
              <span id="changeDueAmount" style="font-size:14.5px; font-weight:700;">0.00</span>
            </div>
          </div>

          <!-- Overall Discount Field -->
          <div class="field" style="margin-bottom:6px;">
            <label class="field-label" style="margin-bottom:2px; font-size:12px;">${t('sale_discount')}</label>
            <input class="input" id="saleDiscount" type="number" min="0" step="any" value="0" style="height:36px; padding:6px 10px; font-size:15px;">
          </div>

          <button class="btn btn-primary btn-block" id="completeSaleBtn" style="padding:10px; font-size:15px; height:42px;">${t('sale_complete_btn')}</button>
          <button class="btn btn-outline btn-block" id="clearCartBtn" style="padding:6px; font-size:13px; margin-top:2px;">${t('sale_clear_cart')}</button>
        </div>
      </div>
    `;
  },

  customerWidgetHTML() {
    if (Views.sale.selectedCustomer) {
      const c = Views.sale.selectedCustomer;
      const isHardware = c.customerType === 'hardware';
      return `
        <div class="selected-cust-card">
          <div>
            <div class="cust-name-title"><i class="ph ph-user"></i> ${escapeHTML(c.name)} ${isHardware ? `<span class="pill pill-ok" style="font-size:10px; margin-left:4px;">${t('cust_tab_hardwares')}</span>` : ''}</div>
            <div class="cust-meta">
              ${c.phone ? `📞 ${escapeHTML(c.phone)}` : ''} 
              ${c.nic ? ` • 🆔 ${escapeHTML(c.nic)}` : ''}
              ${c.balance > 0 ? ` • <span style="color:var(--danger); font-weight:700;">${t('word_due')}: ${fmt(c.balance)}</span>` : ''}
              ${isHardware && c.discountPercent > 0 ? ` • <span style="color:var(--orange-dark); font-weight:700;">${t('cust_hardware_discount_badge')}: ${c.discountPercent}%</span>` : ''}
            </div>
          </div>
          <button type="button" class="icon-btn" id="unselectCustBtn" style="font-size:18px;" title="Unselect">&times;</button>
        </div>
      `;
    }
    return `
      <div style="position:relative;">
        <input class="input" id="saleCustomerSearch" placeholder="${t('cust_search_ph')}" autocomplete="off">
        <div id="custSuggestBox" class="cust-suggest" style="display:none;"></div>
      </div>
    `;
  },

  categoriesHTML() {
    const items = DB.allItems();
    const cats = ['All', ...new Set(items.map(i => i.category || 'Uncategorized'))].filter(Boolean);
    return `
      <select class="input" id="posCategorySelect" style="width:100%; font-weight:bold; font-size:14px; background-color:var(--paper); margin-bottom:4px;">
        ${cats.map(c => `<option value="${escapeHTML(c)}" ${Views.sale.currentCategory === c ? 'selected' : ''}>${escapeHTML(c === 'All' ? t('hist_filter_all') || 'All Categories' : c)}</option>`).join('')}
      </select>
    `;
  },

  posGridHTML() {
    let items = DB.allItems();
    if (Views.sale.currentCategory !== 'All') {
      items = items.filter(i => (i.category || 'Uncategorized') === Views.sale.currentCategory);
    }
    const q = (document.getElementById('saleSearch')?.value || '').trim();
    if (q) {
      items = items.filter(i => Singlish.match(i.name, q) || Singlish.match(i.category || '', q) || Singlish.match(i.description || '', q) || (i.barcode && i.barcode.toLowerCase().includes(q.toLowerCase())));
    }
    if (!items.length) {
      return `<div class="empty-state" style="grid-column:1/-1; padding:40px 20px;"><div class="em-ico"><i class="ph ph-package"></i></div><h3>${t('sale_no_matches') || 'No items'}</h3></div>`;
    }
    return items.map(i => `
      <div class="pos-item-card ${i.qty <= 0 ? 'out-of-stock' : ''}" data-grid-item="${i.id}">
        <div class="pos-item-img">
          ${i.image
        ? `<img src="${i.image}" alt="${escapeHTML(i.name)}" style="width:100%; height:100%; object-fit:cover;">`
        : `<i class="ph ph-package" style="font-size:28px; line-height:1; color:var(--text-muted);"></i>`
      }
        </div>
        <div class="item-name"><b>${escapeHTML(i.name)}</b></div>
        <div class="item-desc text-muted">${escapeHTML(i.description || '')}</div>
        <div>
          <div class="item-price">${fmt(i.sellPrice)}</div>
          <div class="item-cost">${t('items_cost_price')}: <b>${fmt(i.costPrice || 0)}</b></div>
          <div class="item-qty">${i.qty} ${escapeHTML(i.unit)}</div>
        </div>
      </div>
    `).join('');
  },

  calcLineDiscount(l) {
    const origPrice = (l.originalPrice !== undefined && l.originalPrice > 0) ? l.originalPrice : l.unitPrice;
    const effectiveDisc = Math.max(0, origPrice - l.unitPrice);
    const d = (l.discount !== undefined && l.discount > 0) ? l.discount : effectiveDisc;
    if (!d) return 0;
    const type = l.discountType || (DB.data.settings && DB.data.settings.defaultDiscType) || 'unit';
    if (type === 'line') return d;
    return Math.round(d * (Number(l.qty) || 1) * 100) / 100;
  },

  cartHTML() {
    if (!cart.length) return `<div class="empty-state" style="padding:20px 10px"><div class="em-ico"><i class="ph ph-shopping-cart"></i></div><h3>${t('sale_empty_cart')}</h3><div class="small">${t('sale_empty_cart_sub')}</div></div>`;
    return cart.map((l, idx) => {
      const origPrice = (l.originalPrice !== undefined && l.originalPrice > 0) ? l.originalPrice : l.unitPrice;
      const effectiveDisc = Math.max(0, origPrice - l.unitPrice);
      const lineTotal = Math.max(0, l.qty * l.unitPrice);
      const isDiscounted = (l.unitPrice < origPrice);
      // Stock warning: show badge if cart qty is at or near max
      const stockWarn = l.qty >= l.maxQty;
      const stockNear = !stockWarn && l.qty >= l.maxQty * 0.8 && l.maxQty > 1;
      return `
        <div class="cart-row" style="padding:6px 0; border-bottom:1px solid var(--border);">
          <div class="cart-row-top" style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:4px;">
            <div style="flex:1; min-width:0;">
              <div class="cart-item-name" style="font-size:15px; font-weight:700; color:var(--charcoal);">${escapeHTML(l.name)}</div>
              ${l.looseInfo ? `
                <div style="margin-top:2px; display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:700; color:#b45309; background:#fef3c7; border:1px solid #fde68a; border-radius:4px; padding:1px 6px;">
                  <span>⚖️ ලිහිල්: ${escapeHTML(l.looseInfo.shortText || '')}</span>
                  <span style="font-size:10px; color:#92400e; font-weight:600;">(Stock: -${l.qty} ${escapeHTML(l.unit)})</span>
                </div>` : ''}
              ${stockWarn ? `<div style="margin-top:3px; display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:700; color:#b91c1c; background:#fef2f2; border:1px solid #fecaca; border-radius:4px; padding:2px 7px;"><i class="ph ph-warning-circle"></i> Stock සීමාව ඇත්තේ ${l.maxQty} ${escapeHTML(l.unit)} ක් පමණයි!</div>` : ''}
              ${stockNear ? `<div style="margin-top:3px; display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:600; color:#92400e; background:#fffbeb; border:1px solid #fde68a; border-radius:4px; padding:2px 7px;"><i class="ph ph-warning"></i> Stock ඇත්තේ ${l.maxQty} ${escapeHTML(l.unit)} ක් පමණයි</div>` : ''}
            </div>
            <button class="icon-btn" data-remove-idx="${idx}" title="${t('delete')}" style="font-size:16px; padding:2px 6px; border:none; background:none; color:var(--steel); cursor:pointer;">✕</button>
          </div>
          <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
            <div style="display:flex; align-items:center; gap:4px; flex-wrap:wrap;">
              <span style="font-size:11px; font-weight:700; color:var(--steel);">QTY</span>
              <input type="number" min="0.0001" step="any" max="${l.maxQty}" value="${l.qty}" data-qty-idx="${idx}" class="input" style="width:65px; height:32px; padding:4px 6px; font-size:14px; text-align:center; border-color:${stockWarn ? '#ef4444' : 'var(--border)'}; background:${stockWarn ? '#fef2f2' : '#fff'};" title="Quantity (max: ${l.maxQty} ${escapeHTML(l.unit)})">
              
              <div style="display:inline-flex; align-items:center; gap:4px; margin-left:2px;">
                <div style="display:inline-flex; flex-direction:column; align-items:flex-end; line-height:1.1;">
                  <span style="font-size:10px; font-weight:700; color:var(--steel); white-space:nowrap;">Disc Price</span>
                  <span style="font-size:11px; font-weight:800; color:var(--steel);">Rs.</span>
                </div>
                <input type="number" min="0" step="any" placeholder="${origPrice}" value="${l.unitPrice}" data-price-idx="${idx}" data-discount-idx="${idx}" class="input" style="width:75px; height:32px; padding:4px 4px; font-size:13.5px; font-weight:700; text-align:center; border-radius:6px; background:${isDiscounted ? '#ecfdf5' : '#fff'}; color:${isDiscounted ? '#047857' : 'inherit'}; border-color:${isDiscounted ? '#6ee7b7' : 'var(--border)'};" title="විකුණන මිල (Discount Price / Unit Selling Price)">
              </div>

              <!-- LOOSE CALCULATOR BUTTON RIGHT NEXT TO PRICE -->
              <button type="button" class="btn-loose-toggle" data-loose-idx="${idx}" title="ලිහිල් විකිනීම සහ මිනුම් පරිවර්තනය [Shortcut: L] (kg, g, අගුල්, අඩි, L, ml, pcs...)" style="height:32px; padding:0 8px; font-size:11.5px; font-weight:700; border:1px solid ${l.looseInfo ? '#f59e0b' : 'var(--border)'}; border-radius:6px; background:${l.looseInfo ? '#fef3c7' : '#f8fafc'}; color:${l.looseInfo ? '#b45309' : '#334155'}; cursor:pointer; display:inline-flex; align-items:center; gap:3px; white-space:nowrap; transition:all 0.15s ease;">
                <span>⚖️</span>
                <span>${l.looseInfo ? escapeHTML(l.looseInfo.shortText || 'ලිහිල්') : 'ලිහිල්'}</span>
              </button>
            </div>
            <div style="text-align:right;">
              <div class="cart-row-price" style="font-size:16px; font-weight:700; color:var(--primary-dark);">
                ${fmt(lineTotal)}
              </div>
              ${isDiscounted ? `
                <div style="font-size:11px; color:var(--success); font-weight:700; display:flex; align-items:center; justify-content:flex-end; gap:4px;" title="මුල් මිල: Rs ${fmt(origPrice)} | එකකට රු. ${fmt(effectiveDisc)} අඩුවුණා">
                  <span style="font-size:10px; color:#b45309; background:#fef3c7; border:1px solid #fde68a; border-radius:3px; padding:0 4px; font-weight:700;">අඩුයි</span>
                  <span>(-${fmt(effectiveDisc * l.qty)})</span>
                </div>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  calcSubtotal() {
    return cart.reduce((s, l) => {
      const orig = (l.originalPrice !== undefined && l.originalPrice > 0) ? l.originalPrice : l.unitPrice;
      return s + l.qty * orig;
    }, 0);
  },

  calcItemDiscounts() {
    return cart.reduce((s, l) => {
      const orig = (l.originalPrice !== undefined && l.originalPrice > 0) ? l.originalPrice : l.unitPrice;
      const effectiveDisc = Math.max(0, orig - l.unitPrice);
      return s + (l.qty * effectiveDisc);
    }, 0);
  },

  calcTotal() {
    const subtotal = Views.sale.calcSubtotal();
    const itemDiscounts = Views.sale.calcItemDiscounts();
    const discountEl = document.getElementById('saleDiscount');
    const overallDiscount = discountEl ? Number(discountEl.value) || 0 : 0;
    return Math.max(0, subtotal - (itemDiscounts + overallDiscount));
  },

  totalsHTML() {
    const subtotal = Views.sale.calcSubtotal();
    const itemDiscounts = Views.sale.calcItemDiscounts();
    const discountEl = document.getElementById('saleDiscount');
    const overallDiscount = discountEl ? Number(discountEl.value) || 0 : 0;
    const totalDiscount = itemDiscounts + overallDiscount;
    const total = Math.max(0, subtotal - totalDiscount);
    return `
      <div class="totals-line"><span>${t('sale_subtotal')}</span><span>${fmt(subtotal)}</span></div>
      <div class="totals-line"><span>${t('sale_discount')}</span><span>- ${fmt(totalDiscount)}</span></div>
      <div class="totals-line grand"><span>${t('sale_total')}</span><span>${fmt(total)}</span></div>
    `;
  },

  refreshCart() {
    document.getElementById('cartBox').innerHTML = Views.sale.cartHTML();
    document.getElementById('totalsBox').innerHTML = Views.sale.totalsHTML();
    Views.sale.updateChangeDue();
    Views.sale.bindCartRows();
  },

  updateChangeDue() {
    const paidInput = document.getElementById('saleAmountPaid');
    const paidVal = paidInput ? paidInput.value.trim() : (Views.sale.amountPaid !== undefined && Views.sale.amountPaid !== '' ? String(Views.sale.amountPaid).trim() : '');
    const paid = Number(paidVal) || 0;
    Views.sale.amountPaid = paidVal !== '' ? paidVal : '';
    const total = Views.sale.calcTotal();

    const changeWrap = document.getElementById('changeDueWrap');
    const shortWrap = document.getElementById('amountShortWrap');
    const changeAmtEl = document.getElementById('changeDueAmount');
    const shortAmtEl = document.getElementById('amountShortAmount');

    if (paidInput) {
      paidInput.classList.remove('input-error', 'input-success');
    }

    if (!paidVal || isNaN(paid) || paid <= 0) {
      if (changeWrap) changeWrap.style.display = 'none';
      if (shortWrap) shortWrap.style.display = 'none';
      return;
    }

    if (total > 0 && paid < total) {
      const shortDiff = total - paid;
      if (changeWrap) changeWrap.style.display = 'none';
      if (shortWrap) {
        shortWrap.style.display = 'flex';
        if (shortAmtEl) shortAmtEl.textContent = fmt(shortDiff);
      }
      if (paidInput) paidInput.classList.add('input-error');
    } else {
      const change = Math.max(0, paid - total);
      if (shortWrap) shortWrap.style.display = 'none';
      if (changeWrap) {
        changeWrap.style.display = 'flex';
        if (changeAmtEl) changeAmtEl.textContent = fmt(change);
      }
      if (paidInput) paidInput.classList.add('input-success');
    }
  },

  applyCustomerHardwareDiscount() {
    if (Views.sale.selectedCustomer && Views.sale.selectedCustomer.customerType === 'hardware' && Views.sale.selectedCustomer.discountPercent > 0) {
      const subtotal = Views.sale.calcSubtotal();
      const disc = Math.round((subtotal * (Views.sale.selectedCustomer.discountPercent / 100)) * 100) / 100;
      const discountEl = document.getElementById('saleDiscount');
      if (discountEl) {
        discountEl.value = disc;
        Views.sale.refreshCart();
      }
    }
  },

  bindCartRows() {
    document.querySelectorAll('[data-qty-idx]').forEach(inp => {
      inp.addEventListener('change', (e) => {
        const idx = Number(e.target.dataset.qtyIdx);
        let v = Number(e.target.value) || 0.0001;
        const maxQ = cart[idx].maxQty;
        if (v > maxQ) {
          // Show specific stock limit warning
          const msg = (t('sale_stock_limit') || 'Stock ප්‍රමාණවත් නැහැ! Stock ඇත්තේ {avail} {unit} ක් පමණයි.')
            .replace('{avail}', maxQ)
            .replace('{unit}', cart[idx].unit || '');
          toast(msg, 'err');
          v = maxQ;
          e.target.value = maxQ;
        }
        v = Math.max(0.0001, Math.min(v, maxQ));
        v = Math.round(v * 10000) / 10000;
        cart[idx].qty = v;
        Views.sale.refreshCart();
        Views.sale.applyCustomerHardwareDiscount();
      });
    });
    document.querySelectorAll('[data-price-idx], [data-discount-idx]').forEach(inp => {
      inp.addEventListener('change', (e) => {
        const idx = Number(e.target.dataset.priceIdx !== undefined ? e.target.dataset.priceIdx : e.target.dataset.discountIdx);
        let v = Number(e.target.value);
        if (isNaN(v) || v < 0) v = 0;
        cart[idx].unitPrice = v;
        const orig = (cart[idx].originalPrice !== undefined && cart[idx].originalPrice > 0) ? cart[idx].originalPrice : v;
        cart[idx].discount = Math.max(0, orig - v);
        Views.sale.refreshCart();
      });
    });
    document.querySelectorAll('[data-loose-idx]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = Number(e.currentTarget.dataset.looseIdx);
        Views.sale.openLooseModal(idx);
      });
    });
    document.querySelectorAll('[data-remove-idx]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = Number(e.target.dataset.removeIdx);
        cart.splice(idx, 1);
        Views.sale.refreshCart();
        Views.sale.applyCustomerHardwareDiscount();
      });
    });

    // Helper to focus bottom payment controls from cart
    const focusBottomControls = () => {
      const activeBtn = Views.sale.payType === 'cash' ? document.getElementById('payCashBtn') : document.getElementById('payCreditBtn');
      if (activeBtn) {
        activeBtn.focus();
      } else {
        const custInp = document.getElementById('saleCustomerSearch');
        const paidInp = document.getElementById('saleAmountPaid');
        const discInp = document.getElementById('saleDiscount');
        const target = (custInp && custInp.offsetParent !== null) ? custInp : (paidInp && paidInp.offsetParent !== null) ? paidInp : discInp;
        if (target) {
          target.focus();
          if (typeof target.select === 'function') target.select();
        }
      }
    };

    // Arrow keys navigation between Cart rows (QTY, Disc Price, Loose Button) and fields below Total
    document.querySelectorAll('[data-qty-idx], [data-discount-idx]').forEach(inp => {
      inp.addEventListener('focus', (e) => {
        if (typeof e.target.select === 'function') e.target.select();
        e.target.closest('.cart-row')?.scrollIntoView({ block: 'nearest' });
      });

      inp.addEventListener('keydown', (e) => {
        const isQty = e.target.hasAttribute('data-qty-idx');
        const idx = Number(isQty ? e.target.dataset.qtyIdx : e.target.dataset.discountIdx);

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextInp = document.querySelector(isQty ? `[data-qty-idx="${idx + 1}"]` : `[data-discount-idx="${idx + 1}"]`);
          if (nextInp) {
            nextInp.focus();
            if (typeof nextInp.select === 'function') nextInp.select();
          } else {
            focusBottomControls();
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevInp = document.querySelector(isQty ? `[data-qty-idx="${idx - 1}"]` : `[data-discount-idx="${idx - 1}"]`);
          if (prevInp) {
            prevInp.focus();
            if (typeof prevInp.select === 'function') prevInp.select();
          } else {
            const searchInp = document.getElementById('saleSearch');
            if (searchInp) {
              searchInp.focus();
              if (typeof searchInp.select === 'function') searchInp.select();
            }
          }
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          if (isQty) {
            const discInp = document.querySelector(`[data-discount-idx="${idx}"]`);
            if (discInp) {
              discInp.focus();
              if (typeof discInp.select === 'function') discInp.select();
            }
          } else {
            // From discount input -> move right to Loose (ලිහිල්) button
            const looseBtn = document.querySelector(`[data-loose-idx="${idx}"]`);
            if (looseBtn) {
              looseBtn.focus();
            } else if (idx === cart.length - 1) {
              focusBottomControls();
            }
          }
        } else if (e.key === 'ArrowLeft') {
          if (!isQty) {
            e.preventDefault();
            const qtyInp = document.querySelector(`[data-qty-idx="${idx}"]`);
            if (qtyInp) {
              qtyInp.focus();
              if (typeof qtyInp.select === 'function') qtyInp.select();
            }
          } else if (idx > 0) {
            // From QTY of current row -> move left to previous row's loose button
            e.preventDefault();
            const prevLoose = document.querySelector(`[data-loose-idx="${idx - 1}"]`);
            if (prevLoose) prevLoose.focus();
          }
        } else if (e.key === 'l' || e.key === 'L' || e.code === 'KeyL') {
          e.preventDefault();
          const looseBtn = document.querySelector(`[data-loose-idx="${idx}"]`);
          if (looseBtn) {
            looseBtn.focus();
            looseBtn.scrollIntoView({ block: 'nearest' });
          }
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
          if (e.key === 'Delete' || e.target.value === '' || e.shiftKey || e.altKey) {
            e.preventDefault();
            cart.splice(idx, 1);
            Views.sale.refreshCart();
            Views.sale.applyCustomerHardwareDiscount();
            const targetIdx = Math.min(idx, cart.length - 1);
            if (targetIdx >= 0) {
              const nextTarget = document.querySelector(`[data-qty-idx="${targetIdx}"]`);
              if (nextTarget) {
                nextTarget.focus();
                if (typeof nextTarget.select === 'function') nextTarget.select();
              }
            } else {
              const searchInp = document.getElementById('saleSearch');
              if (searchInp) searchInp.focus();
            }
          }
        } else if (e.key === 'Enter') {
          e.preventDefault();
          e.target.blur();
        }
      });
    });

    // Arrow keys & keyboard shortcuts for Loose (ලිහිල්) buttons
    document.querySelectorAll('[data-loose-idx]').forEach(btn => {
      btn.addEventListener('keydown', (e) => {
        const idx = Number(e.currentTarget.dataset.looseIdx);

        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const discInp = document.querySelector(`[data-discount-idx="${idx}"]`);
          if (discInp) {
            discInp.focus();
            if (typeof discInp.select === 'function') discInp.select();
          }
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          if (idx < cart.length - 1) {
            const nextQty = document.querySelector(`[data-qty-idx="${idx + 1}"]`);
            if (nextQty) {
              nextQty.focus();
              if (typeof nextQty.select === 'function') nextQty.select();
            }
          } else {
            focusBottomControls();
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextLoose = document.querySelector(`[data-loose-idx="${idx + 1}"]`);
          if (nextLoose) {
            nextLoose.focus();
          } else {
            focusBottomControls();
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevLoose = document.querySelector(`[data-loose-idx="${idx - 1}"]`);
          if (prevLoose) {
            prevLoose.focus();
          } else {
            const searchInp = document.getElementById('saleSearch');
            if (searchInp) {
              searchInp.focus();
              if (typeof searchInp.select === 'function') searchInp.select();
            }
          }
        } else if (e.key === 'l' || e.key === 'L' || e.code === 'KeyL' || e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
          e.preventDefault();
          Views.sale.openLooseModal(idx);
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
          e.preventDefault();
          cart.splice(idx, 1);
          Views.sale.refreshCart();
          Views.sale.applyCustomerHardwareDiscount();
          const targetIdx = Math.min(idx, cart.length - 1);
          if (targetIdx >= 0) {
            const nextTarget = document.querySelector(`[data-loose-idx="${targetIdx}"]`) || document.querySelector(`[data-qty-idx="${targetIdx}"]`);
            if (nextTarget) nextTarget.focus();
          } else {
            const searchInp = document.getElementById('saleSearch');
            if (searchInp) searchInp.focus();
          }
        }
      });
    });
  },

  bind() {
    const searchInp = document.getElementById('saleSearch');
    const suggestBox = document.getElementById('saleSuggest');
    const camBtn = document.getElementById('posCamScanBtn');
    let selectedIndex = -1;

    if (camBtn) {
      camBtn.addEventListener('click', () => {
        BarcodeSystem.openCameraScanner((scanned) => {
          BarcodeSystem.handleScannedBarcode(scanned);
        });
      });
    }

    if (searchInp) {
      searchInp.addEventListener('input', () => {
        selectedIndex = -1;
        const q = searchInp.value.trim();
        const grid = document.getElementById('posItemGrid');
        if (grid) {
          grid.innerHTML = Views.sale.posGridHTML();
          Views.sale.bindGrid();
        }
        if (!q) { suggestBox.innerHTML = ''; return; }

        // Check if query matches a Bill Barcode
        const billSale = DB.findSaleByBarcode ? DB.findSaleByBarcode(q) : null;
        if (billSale) {
          suggestBox.innerHTML = `
            <div class="search-suggest">
              <div class="suggest-row" data-open-bill="${billSale.id}" style="background:#f0fdf4; border-bottom:2px solid #bbf7d0; cursor:pointer;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <div style="width:36px; height:36px; border-radius:6px; background:#dcfce7; color:#15803d; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0;">
                    <i class="ph ph-receipt"></i>
                  </div>
                  <div>
                    <div class="s-name" style="color:#15803d; font-weight:800;">🧾 බිල්පත (Bill) #${billSale.id} — <code style="font-size:11.5px; color:#166534;">${escapeHTML(billSale.barcode || ('BILL-' + billSale.id))}</code></div>
                    <div class="s-meta" style="color:#166534;">${billSale.lines.length} items • ${fmtDate(billSale.date)} • ${billSale.paymentType === 'credit' ? `ණයට (${escapeHTML(billSale.customerName || '')})` : 'මුදල්'} • <b>${fmt(billSale.total)}</b></div>
                  </div>
                </div>
                <div style="font-weight:800; color:#15803d;">${fmt(billSale.total)}</div>
              </div>
            </div>`;
          suggestBox.querySelector('[data-open-bill]').addEventListener('click', () => {
            searchInp.value = '';
            suggestBox.innerHTML = '';
            Views.sale.showReceipt(billSale);
          });
          return;
        }

        const matches = DB.allItems().filter(i => Singlish.match(i.name, q) || Singlish.match(i.category || '', q) || Singlish.match(i.description || '', q) || (i.barcode && i.barcode.toLowerCase().includes(q.toLowerCase()))).slice(0, 8);
        if (!matches.length) {
          suggestBox.innerHTML = `<div class="search-suggest"><div class="suggest-row text-muted">${t('sale_no_matches')}</div></div>`;
          return;
        }
        suggestBox.innerHTML = `<div class="search-suggest">${matches.map(i => `
          <div class="suggest-row" data-add-item="${i.id}">
            <div style="display:flex; align-items:center; gap:10px;">
              <div style="width:36px; height:36px; border-radius:6px; overflow:hidden; background:var(--paper); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                ${i.image ? `<img src="${i.image}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="ph ph-package" style="font-size:18px;"></i>`}
              </div>
              <div>
                <div class="s-name">${escapeHTML(i.name)}</div>
                <div class="s-meta">${i.barcode ? `<b style="font-family:monospace; color:var(--primary);"><i class="ph ph-barcode"></i> ${escapeHTML(i.barcode)}</b> • ` : ''}${escapeHTML(i.category)} • ${t('word_qty')}: ${i.qty} ${escapeHTML(i.unit)} • ${t('items_cost_price')}: ${fmt(i.costPrice || 0)}</div>
              </div>
            </div>
            <div style="font-weight:700">${fmt(i.sellPrice)}</div>
          </div>
        `).join('')}</div>`;
        suggestBox.querySelectorAll('[data-add-item]').forEach(row => {
          row.addEventListener('click', () => {
            const id = Number(row.dataset.addItem);
            Views.sale.addToCart(id);
            searchInp.value = ''; suggestBox.innerHTML = '';
            if (grid) {
              grid.innerHTML = Views.sale.posGridHTML();
              Views.sale.bindGrid();
            }
            searchInp.blur();
          });
        });
      });

      searchInp.addEventListener('keydown', (e) => {
        const rows = suggestBox.querySelectorAll('[data-add-item]');
        const rawQ = searchInp.value.trim();

        // Helper to highlight row at selectedIndex
        function updateSelection() {
          rows.forEach((r, idx) => {
            if (idx === selectedIndex) {
              r.classList.add('selected-row');
              r.scrollIntoView({ block: 'nearest' });
            } else {
              r.classList.remove('selected-row');
            }
          });
        }

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (rows.length === 0) return;
          selectedIndex = (selectedIndex + 1) % rows.length;
          updateSelection();
          return;
        }

        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (rows.length === 0) return;
          selectedIndex = selectedIndex <= 0 ? rows.length - 1 : selectedIndex - 1;
          updateSelection();
          return;
        }

        if (e.key === 'Escape') {
          suggestBox.innerHTML = '';
          selectedIndex = -1;
          return;
        }

        if (e.key === 'Enter') {
          e.preventDefault();
          // Check if exact barcode matches a bill first
          const exactSale = DB.findSaleByBarcode ? DB.findSaleByBarcode(rawQ) : null;
          if (exactSale) {
            searchInp.value = '';
            suggestBox.innerHTML = '';
            BarcodeSystem.handleScannedBarcode(rawQ);
            return;
          }

          // 1. Check if exact barcode matches an item
          const exactBarcodeItem = DB.getItemByBarcode(rawQ);
          if (exactBarcodeItem) {
            BarcodeSystem.handleScannedBarcode(rawQ);
            searchInp.value = '';
            suggestBox.innerHTML = '';
            const grid = document.getElementById('posItemGrid');
            if (grid) {
              grid.innerHTML = Views.sale.posGridHTML();
              Views.sale.bindGrid();
            }
            return;
          }

          // 2. Select from dropdown suggestions
          if (rows.length > 0) {
            const targetIdx = (selectedIndex >= 0 && selectedIndex < rows.length) ? selectedIndex : 0;
            rows[targetIdx].click();
          }
          searchInp.blur();
          return;
        }
      });
    }

    Views.sale.bindCustomerSearch();

    const payCashBtn = document.getElementById('payCashBtn');
    const payCreditBtn = document.getElementById('payCreditBtn');

    if (payCashBtn && payCreditBtn) {
      payCashBtn.addEventListener('click', () => Views.sale.setPayType('cash'));
      payCreditBtn.addEventListener('click', () => Views.sale.setPayType('credit'));

      const handlePayBtnKeydown = (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          if (Views.sale.payType === 'cash') {
            Views.sale.setPayType('credit');
            payCreditBtn.focus();
          } else {
            Views.sale.setPayType('cash');
            payCashBtn.focus();
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          const custInp = document.getElementById('saleCustomerSearch');
          const unselectBtn = document.getElementById('unselectCustBtn');
          const paidInp = document.getElementById('saleAmountPaid');
          const target = (custInp && custInp.offsetParent !== null) ? custInp :
                         (unselectBtn && unselectBtn.offsetParent !== null) ? unselectBtn :
                         (paidInp && paidInp.offsetParent !== null) ? paidInp :
                         document.getElementById('saleDiscount');
          if (target) {
            target.focus();
            if (typeof target.select === 'function') target.select();
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const lastIdx = cart.length - 1;
          if (lastIdx >= 0) {
            const targetInp = document.querySelector(`[data-discount-idx="${lastIdx}"]`) || document.querySelector(`[data-qty-idx="${lastIdx}"]`);
            if (targetInp) {
              targetInp.focus();
              if (typeof targetInp.select === 'function') targetInp.select();
            }
          }
        }
      };

      payCashBtn.addEventListener('keydown', handlePayBtnKeydown);
      payCreditBtn.addEventListener('keydown', handlePayBtnKeydown);
    }

    const discEl = document.getElementById('saleDiscount');
    if (discEl) {
      discEl.addEventListener('focus', (e) => {
        if (typeof e.target.select === 'function') e.target.select();
      });
      discEl.addEventListener('input', () => {
        document.getElementById('totalsBox').innerHTML = Views.sale.totalsHTML();
        Views.sale.updateChangeDue();
      });
      discEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          document.getElementById('completeSaleBtn')?.click();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          const completeBtn = document.getElementById('completeSaleBtn');
          if (completeBtn) completeBtn.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const paidInp = document.getElementById('saleAmountPaid');
          const custInp = document.getElementById('saleCustomerSearch');
          const unselectBtn = document.getElementById('unselectCustBtn');
          const target = (paidInp && paidInp.offsetParent !== null) ? paidInp : 
                         (custInp && custInp.offsetParent !== null) ? custInp : 
                         (unselectBtn && unselectBtn.offsetParent !== null) ? unselectBtn : null;
          if (target) {
            target.focus();
            if (typeof target.select === 'function') target.select();
          } else {
            const activeBtn = Views.sale.payType === 'cash' ? payCashBtn : payCreditBtn;
            if (activeBtn) {
              activeBtn.focus();
            } else {
              const lastIdx = cart.length - 1;
              const targetInp = document.querySelector(`[data-discount-idx="${lastIdx}"]`) || document.querySelector(`[data-qty-idx="${lastIdx}"]`);
              if (targetInp) { targetInp.focus(); if (typeof targetInp.select === 'function') targetInp.select(); }
            }
          }
        }
      });
    }

    const paidEl = document.getElementById('saleAmountPaid');
    if (paidEl) {
      paidEl.addEventListener('focus', (e) => {
        if (typeof e.target.select === 'function') e.target.select();
      });
      paidEl.addEventListener('input', (e) => {
        Views.sale.amountPaid = e.target.value;
        Views.sale.updateChangeDue();
      });
      paidEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          document.getElementById('completeSaleBtn')?.click();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          const discEl = document.getElementById('saleDiscount');
          if (discEl) { discEl.focus(); if (typeof discEl.select === 'function') discEl.select(); }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const custInp = document.getElementById('saleCustomerSearch');
          const unselectBtn = document.getElementById('unselectCustBtn');
          const target = (custInp && custInp.offsetParent !== null) ? custInp :
                         (unselectBtn && unselectBtn.offsetParent !== null) ? unselectBtn : null;
          if (target) {
            target.focus();
            if (typeof target.select === 'function') target.select();
          } else {
            const activeBtn = Views.sale.payType === 'cash' ? payCashBtn : payCreditBtn;
            if (activeBtn) activeBtn.focus();
          }
        }
      });
    }


    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
      clearCartBtn.addEventListener('click', () => {
        cart = [];
        Views.sale.refreshCart();
      });
      clearCartBtn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          const completeBtn = document.getElementById('completeSaleBtn');
          if (completeBtn) completeBtn.focus();
        }
      });
    }

    const completeSaleBtn = document.getElementById('completeSaleBtn');
    if (completeSaleBtn) {
      completeSaleBtn.addEventListener('click', Views.sale.completeSale);
      completeSaleBtn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          const discEl = document.getElementById('saleDiscount');
          if (discEl) {
            discEl.focus();
            if (typeof discEl.select === 'function') discEl.select();
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          const clearBtn = document.getElementById('clearCartBtn');
          if (clearBtn) clearBtn.focus();
        }
      });
    }

    Views.sale.bindCartRows();
    Views.sale.bindGrid();
    Views.sale.bindTabs();
    if (searchInp) setTimeout(() => searchInp.focus(), 100);
  },

  bindTabs() {
    // Tab click to switch
    document.querySelectorAll('[data-tab-idx]').forEach(tab => {
      tab.addEventListener('click', (e) => {
        if (e.target.closest('[data-tab-close]')) return;
        const idx = Number(tab.dataset.tabIdx);
        if (idx !== Views.sale.activeIdx) Views.sale.switchTab(idx);
      });
    });
    // Tab × to close
    document.querySelectorAll('[data-tab-close]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = Number(btn.dataset.tabClose);
        Views.sale.closeTab(idx);
      });
    });
    // Add new quick sale tab
    document.getElementById('addCartTabBtn')?.addEventListener('click', () => {
      Views.sale.addTab();
    });
  },


  bindCustomerSearch() {
    const custWrap = document.getElementById('customerSelectionWrap');
    if (!custWrap) return;

    const unselectBtn = document.getElementById('unselectCustBtn');
    if (unselectBtn) {
      unselectBtn.addEventListener('click', () => {
        Views.sale.selectedCustomer = null;
        custWrap.innerHTML = Views.sale.customerWidgetHTML();
        Views.sale.bindCustomerSearch();
        Views.sale.applyCustomerHardwareDiscount();
      });
      unselectBtn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const paidInp = document.getElementById('saleAmountPaid');
          const discInp = document.getElementById('saleDiscount');
          const target = (paidInp && paidInp.offsetParent !== null) ? paidInp : discInp;
          if (target) {
            target.focus();
            if (typeof target.select === 'function') target.select();
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const activeBtn = Views.sale.payType === 'cash' ? document.getElementById('payCashBtn') : document.getElementById('payCreditBtn');
          if (activeBtn) {
            activeBtn.focus();
          } else {
            const lastIdx = cart.length - 1;
            const targetInp = document.querySelector(`[data-discount-idx="${lastIdx}"]`) || document.querySelector(`[data-qty-idx="${lastIdx}"]`);
            if (targetInp) {
              targetInp.focus();
              if (typeof targetInp.select === 'function') targetInp.select();
            }
          }
        }
      });
      return;
    }

    const searchInp = document.getElementById('saleCustomerSearch');
    const suggestBox = document.getElementById('custSuggestBox');
    if (!searchInp || !suggestBox) return;

    let custSelectedIndex = -1;

    searchInp.addEventListener('focus', (e) => {
      if (typeof e.target.select === 'function') e.target.select();
    });

    searchInp.addEventListener('keydown', (e) => {
      const items = suggestBox.querySelectorAll('.cust-suggest-item');
      const isVisible = suggestBox.style.display === 'block' && items.length > 0;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (isVisible) {
          custSelectedIndex = (custSelectedIndex + 1) % items.length;
          updateCustSelection(items);
        } else {
          const paidInp = document.getElementById('saleAmountPaid');
          const discInp = document.getElementById('saleDiscount');
          const target = (paidInp && paidInp.offsetParent !== null) ? paidInp : discInp;
          if (target) { target.focus(); if (typeof target.select === 'function') target.select(); }
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (isVisible && custSelectedIndex > 0) {
          custSelectedIndex = custSelectedIndex - 1;
          updateCustSelection(items);
        } else if (isVisible && custSelectedIndex === 0) {
          custSelectedIndex = -1;
          updateCustSelection(items);
        } else {
          const activeBtn = Views.sale.payType === 'cash' ? document.getElementById('payCashBtn') : document.getElementById('payCreditBtn');
          if (activeBtn) {
            activeBtn.focus();
          } else {
            const lastIdx = cart.length - 1;
            const targetInp = document.querySelector(`[data-discount-idx="${lastIdx}"]`) || document.querySelector(`[data-qty-idx="${lastIdx}"]`);
            if (targetInp) { targetInp.focus(); if (typeof targetInp.select === 'function') targetInp.select(); }
          }
        }
      } else if (e.key === 'Enter') {
        if (isVisible) {
          e.preventDefault();
          if (custSelectedIndex >= 0 && custSelectedIndex < items.length) {
            items[custSelectedIndex].click();
          } else if (items.length > 0) {
            items[0].click();
          }
        }
      }

      function updateCustSelection(itemList) {
        itemList.forEach((item, idx) => {
          if (idx === custSelectedIndex) {
            item.classList.add('selected-row');
            item.style.background = 'var(--primary-light)';
            item.style.borderColor = 'var(--primary)';
          } else {
            item.classList.remove('selected-row');
            item.style.background = '';
            item.style.borderColor = '';
          }
        });
      }
    });

    searchInp.addEventListener('input', () => {
      custSelectedIndex = -1;
      const q = searchInp.value.trim();
      if (!q) {
        suggestBox.style.display = 'none';
        suggestBox.innerHTML = '';
        return;
      }

      const matches = DB.searchCustomers(q).slice(0, 6);
      let html = matches.map(c => {
        const isHardware = c.customerType === 'hardware';
        return `
          <div class="cust-suggest-item" data-select-cust="${c.id}">
            <div>
              <div style="font-weight:700;">${escapeHTML(c.name)} ${isHardware ? `<span class="pill pill-ok" style="font-size:10px;">${t('cust_tab_hardwares')}</span>` : ''}</div>
              <div class="small text-muted">${c.phone ? `📞 ${escapeHTML(c.phone)}` : ''}${c.nic ? ` • 🆔 ${escapeHTML(c.nic)}` : ''}${c.balance > 0 ? ` • ${t('word_due')} ${fmt(c.balance)}` : ''}</div>
            </div>
            ${isHardware && c.discountPercent > 0 ? `<div style="font-weight:700; font-size:11px; color:var(--orange-dark);">${c.discountPercent}% off</div>` : ''}
          </div>
        `;
      }).join('');

      html += `
        <div class="cust-suggest-item quick-add-item" id="quickAddCustRow">
          ${t('cust_quick_add')} ("${escapeHTML(q)}")
        </div>
      `;

      suggestBox.innerHTML = html;
      suggestBox.style.display = 'block';

      suggestBox.querySelectorAll('[data-select-cust]').forEach(row => {
        row.addEventListener('click', () => {
          const id = Number(row.dataset.selectCust);
          const c = DB.getCustomer(id);
          if (c) {
            Views.sale.selectedCustomer = c;
            custWrap.innerHTML = Views.sale.customerWidgetHTML();
            Views.sale.bindCustomerSearch();
            Views.sale.applyCustomerHardwareDiscount();
            setTimeout(() => {
              if (Views.sale.payType === 'credit') {
                const discEl = document.getElementById('saleDiscount');
                if (discEl) { discEl.focus(); if (typeof discEl.select === 'function') discEl.select(); }
              } else {
                const paidInp = document.getElementById('saleAmountPaid');
                if (paidInp) { paidInp.focus(); if (typeof paidInp.select === 'function') paidInp.select(); }
              }
            }, 50);
          }
        });
      });

      const quickBtn = document.getElementById('quickAddCustRow');
      if (quickBtn) {
        quickBtn.addEventListener('click', () => {
          suggestBox.style.display = 'none';
          Views.sale.openQuickAddModal(q);
        });
      }
    });
  },

  openQuickAddModal(initialText) {
    const isPhone = /^[0-9+\s-]{4,}$/.test(initialText);
    const initialName = isPhone ? '' : initialText;
    const initialPhone = isPhone ? initialText : '';

    openModal({
      title: t('cust_quick_add_title'),
      bodyHTML: `
        <div class="field">
          <label class="field-label">${t('cust_form_name')}</label>
          <input class="input" id="qc_name" value="${escapeHTML(initialName)}" placeholder="${t('cust_form_name_ph')}">
          <div class="field-error-msg" id="qc_name_err"></div>
        </div>
        <div class="grid grid-2">
          <div class="field">
            <label class="field-label">${t('cust_form_phone')}</label>
            <input class="input" id="qc_phone" value="${escapeHTML(initialPhone)}" placeholder="${t('cust_form_phone_ph')}">
            <div class="field-error-msg" id="qc_phone_err"></div>
          </div>
          <div class="field">
            <label class="field-label">${t('cust_form_type')}</label>
            <select class="input" id="qc_type">
              <option value="customer">${t('cust_type_retail')}</option>
              <option value="hardware">${t('cust_type_hardware')}</option>
            </select>
          </div>
        </div>
        <div class="field" id="qc_discount_wrap" style="display:none;">
          <label class="field-label">${t('cust_form_discount')}</label>
          <input class="input" id="qc_discount" type="number" min="0" max="100" value="0">
          <div class="field-error-msg" id="qc_discount_err"></div>
        </div>
        <div class="grid grid-2">
          <div class="field"><label class="field-label">${t('cust_form_address')}</label><input class="input" id="qc_address"></div>
          <div class="field">
            <label class="field-label">${t('cust_form_nic')}</label>
            <input class="input" id="qc_nic" placeholder="e.g. 199012345678 / 901234567V">
            <div class="field-error-msg" id="qc_nic_err"></div>
          </div>
        </div>
      `,
      footHTML: `<button class="btn btn-outline" data-close>${t('cancel')}</button><button class="btn btn-primary" id="saveQCustBtn">${t('confirm')}</button>`,
      onMount: (wrap) => {
        const nameInp = wrap.querySelector('#qc_name');
        const nameErr = wrap.querySelector('#qc_name_err');
        const phoneInp = wrap.querySelector('#qc_phone');
        const phoneErr = wrap.querySelector('#qc_phone_err');
        const nicInp = wrap.querySelector('#qc_nic');
        const nicErr = wrap.querySelector('#qc_nic_err');
        const typeSelect = wrap.querySelector('#qc_type');
        const discWrap = wrap.querySelector('#qc_discount_wrap');
        const discInp = wrap.querySelector('#qc_discount');
        const discErr = wrap.querySelector('#qc_discount_err');

        typeSelect.addEventListener('change', () => {
          discWrap.style.display = typeSelect.value === 'hardware' ? 'block' : 'none';
        });

        // Realtime input listeners to clear errors and format
        nameInp.addEventListener('input', () => clearInputError(nameInp, nameErr));
        phoneInp.addEventListener('input', () => clearInputError(phoneInp, phoneErr));
        nicInp.addEventListener('input', () => {
          clearInputError(nicInp, nicErr);
          const pos = nicInp.selectionStart;
          nicInp.value = nicInp.value.toUpperCase();
          if (pos !== null) nicInp.setSelectionRange(pos, pos);
        });
        if (discInp) discInp.addEventListener('input', () => clearInputError(discInp, discErr));

        wrap.querySelector('#saveQCustBtn').addEventListener('click', async () => {
          // 1. Validate Name
          const nameVal = Validators.validateName(nameInp.value);
          if (!nameVal.valid) {
            setInputError(nameInp, nameErr, nameVal.error);
            toast(nameVal.error, 'err');
            nameInp.focus();
            return;
          }

          // 2. Validate Phone
          const phoneVal = Validators.validatePhone(phoneInp.value);
          if (!phoneVal.valid) {
            setInputError(phoneInp, phoneErr, phoneVal.error);
            toast(phoneVal.error, 'err');
            phoneInp.focus();
            return;
          }

          // 3. Validate NIC
          const nicVal = Validators.validateNIC(nicInp.value);
          if (!nicVal.valid) {
            setInputError(nicInp, nicErr, nicVal.error);
            toast(nicVal.error, 'err');
            nicInp.focus();
            return;
          }

          // 4. Validate Discount
          let discount = 0;
          if (typeSelect.value === 'hardware') {
            discount = Number(discInp?.value) || 0;
            if (discount < 0 || discount > 100) {
              setInputError(discInp, discErr, t('cust_err_discount'));
              toast(t('cust_err_discount'), 'err');
              discInp.focus();
              return;
            }
          }

          const newC = await DB.addCustomer({
            name: nameVal.value,
            phone: phoneVal.value,
            nic: nicVal.value,
            address: wrap.querySelector('#qc_address').value.trim(),
            customerType: typeSelect.value,
            discountPercent: discount
          });

          closeModal();
          toast(t('cust_added'), 'ok');
          Views.sale.selectedCustomer = newC;
          const custWrap = document.getElementById('customerSelectionWrap');
          if (custWrap) {
            custWrap.innerHTML = Views.sale.customerWidgetHTML();
            Views.sale.bindCustomerSearch();
            Views.sale.applyCustomerHardwareDiscount();
            setTimeout(() => {
              if (Views.sale.payType === 'credit') {
                const discEl = document.getElementById('saleDiscount');
                if (discEl) { discEl.focus(); if (typeof discEl.select === 'function') discEl.select(); }
              } else {
                const paidInp = document.getElementById('saleAmountPaid');
                if (paidInp) { paidInp.focus(); if (typeof paidInp.select === 'function') paidInp.select(); }
              }
            }, 50);
          }
        });
      }
    });
  },

  bindGrid() {
    const categorySelect = document.getElementById('posCategorySelect');
    if (categorySelect) {
      categorySelect.addEventListener('change', (e) => {
        Views.sale.currentCategory = e.target.value;
        document.getElementById('posItemGrid').innerHTML = Views.sale.posGridHTML();
        Views.sale.bindGrid();
      });
    }

    document.querySelectorAll('.cat-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        Views.sale.currentCategory = e.target.dataset.cat;
        document.getElementById('posCategories').innerHTML = Views.sale.categoriesHTML();
        document.getElementById('posItemGrid').innerHTML = Views.sale.posGridHTML();
        Views.sale.bindGrid();
      });
    });

    document.querySelectorAll('[data-grid-item]').forEach(card => {
      card.addEventListener('click', (e) => {
        const id = Number(e.currentTarget.dataset.gridItem);
        Views.sale.addToCart(id);
        Views.sale.applyCustomerHardwareDiscount();
      });
    });
  },

  setPayType(type) {
    Views.sale.payType = type;
    document.getElementById('payCashBtn').classList.toggle('active', type === 'cash');
    document.getElementById('payCreditBtn').classList.toggle('active', type === 'credit');
    const paidWrap = document.getElementById('amountPaidWrap');
    if (paidWrap) paidWrap.style.display = type === 'cash' ? 'block' : 'none';
    const custField = document.getElementById('customerSelectionField');
    if (custField) custField.style.display = type === 'credit' ? 'block' : 'none';
    Views.sale.updateChangeDue();
  },

  addToCart(itemId) {
    const item = DB.getItem(itemId);
    if (!item) return;
    if (item.qty <= 0) { toast(t('sale_out_of_stock'), 'err'); return; }
    const existing = cart.find(l => l.itemId === itemId);
    if (existing) {
      if (existing.qty < existing.maxQty) {
        existing.qty += 1;
      } else {
        // Show specific message with exact available stock count
        const msg = (t('sale_stock_limit') || 'Stock ප්‍රමාණවත් නැහැ! Stock ඇත්තේ {avail} {unit} ක් පමණයි.')
          .replace('{avail}', existing.maxQty)
          .replace('{unit}', existing.unit || item.unit || '');
        toast(msg, 'err');
        return;
      }
    } else {
      cart.push({
        itemId,
        name: item.name,
        image: item.image,
        unit: item.unit,
        originalPrice: item.sellPrice,
        unitPrice: item.sellPrice,
        costPrice: item.costPrice || 0,
        qty: 1,
        maxQty: item.qty,
        packSize: item.packSize || 1,
        packUnit: item.packUnit || '',
        loosePrice: item.loosePrice || 0,
        discount: 0,
        discountType: (DB.data.settings && DB.data.settings.defaultDiscType) || 'unit'
      });
    }
    Views.sale.refreshCart();
    const cartBox = document.getElementById('cartBox');
    if (cartBox) {
      cartBox.scrollTop = cartBox.scrollHeight;
    }
  },

  openLooseModal(idx) {
    const item = cart[idx];
    if (!item) return;

    // Detect packaging details from item name or unit
    let defaultPackSize = 1;
    let defaultPackUnit = item.unit || 'pcs';
    let defaultLooseUnit = item.unit || 'pcs';

    const nameLower = (item.name || '').toLowerCase();
    const matchWeight = nameLower.match(/(\d+(?:\.\d+)?)\s*(kg|g|කිලෝ|ග්‍රෑම්)/i);
    const matchVolume = nameLower.match(/(\d+(?:\.\d+)?)\s*(l|ml|ltr|ලීටර්|මිලිලීටර්)/i);
    const matchLength = nameLower.match(/(\d+(?:\.\d+)?)\s*(ft|in|m|cm|අඩි|අඟල්|මීටර්)/i);

    // Units that are containers/packs — auto-detect measurement from item name
    const containerUnits = ['bag', 'box', 'pkt', 'roll', 'bundle', 'bottle', 'can', 'tube', 'set', 'pair', 'sheet', 'length', 'cube', 'sqft'];
    if (containerUnits.includes(item.unit)) {
      if (matchWeight) {
        defaultPackSize = parseFloat(matchWeight[1]) || 50;
        defaultPackUnit = matchWeight[2].toLowerCase().startsWith('g') && !matchWeight[2].toLowerCase().startsWith('kg') ? 'g' : 'kg';
        defaultLooseUnit = defaultPackUnit;
      } else if (matchVolume) {
        defaultPackSize = parseFloat(matchVolume[1]) || 1;
        defaultPackUnit = matchVolume[2].toLowerCase().startsWith('ml') ? 'ml' : 'L';
        defaultLooseUnit = defaultPackUnit;
      } else if (matchLength) {
        defaultPackSize = parseFloat(matchLength[1]) || 1;
        defaultPackUnit = matchLength[2].includes('in') || matchLength[2].includes('අඟල්') ? 'in' : (matchLength[2].includes('m') ? 'm' : 'ft');
        defaultLooseUnit = defaultPackUnit;
      } else if (nameLower.includes('50kg') || nameLower.includes('50 kg') || nameLower.includes('සිමෙන්ති')) {
        defaultPackSize = 50;
        defaultPackUnit = 'kg';
        defaultLooseUnit = 'kg';
      }
    } else if (item.unit === 'kg') {
      defaultPackSize = 1;
      defaultPackUnit = 'kg';
      defaultLooseUnit = 'kg';
    } else if (item.unit === 'g') {
      defaultPackSize = 1000;
      defaultPackUnit = 'g';
      defaultLooseUnit = 'g';
    } else if (item.unit === 'L') {
      defaultPackSize = 1;
      defaultPackUnit = 'L';
      defaultLooseUnit = 'L';
    } else if (item.unit === 'ml') {
      defaultPackSize = 1000;
      defaultPackUnit = 'ml';
      defaultLooseUnit = 'ml';
    } else if (item.unit === 'ft') {
      defaultPackSize = 1;
      defaultPackUnit = 'ft';
      defaultLooseUnit = 'ft';
    } else if (item.unit === 'm') {
      defaultPackSize = 1;
      defaultPackUnit = 'm';
      defaultLooseUnit = 'm';
    }

    // Priority: Saved packaging details configured on the Item itself
    const dbItem = DB.getItem(item.itemId);
    const configuredPackSize = (dbItem && Number(dbItem.packSize) > 0) ? Number(dbItem.packSize) : ((Number(item.packSize) > 0) ? Number(item.packSize) : null);
    const configuredPackUnit = (dbItem && dbItem.packUnit) ? dbItem.packUnit : (item.packUnit || null);
    const configuredLoosePrice = (dbItem && Number(dbItem.loosePrice) > 0) ? Number(dbItem.loosePrice) : (Number(item.loosePrice) || 0);

    if (configuredPackSize) {
      defaultPackSize = configuredPackSize;
    }
    if (configuredPackUnit) {
      defaultPackUnit = configuredPackUnit;
      defaultLooseUnit = configuredPackUnit;
    }

    const curLoose = item.looseInfo || {};
    const initPackSize = curLoose.packSize || defaultPackSize;
    const initPackUnit = curLoose.packUnit || defaultPackUnit;
    const initLooseUnit = curLoose.looseUnit || defaultLooseUnit;
    const initLooseQty = (curLoose.looseQty !== undefined && curLoose.looseQty !== null) ? curLoose.looseQty : 1;
    const initCustomPrice = (curLoose.customLooseUnitPrice !== undefined && curLoose.customLooseUnitPrice !== null)
      ? curLoose.customLooseUnitPrice
      : (configuredLoosePrice > 0 ? configuredLoosePrice : '');

    const unitOptions = [
      { val: 'kg', label: 'kg (කිලෝ)' },
      { val: 'g', label: 'g (ග්‍රෑම්)' },
      { val: 'in', label: 'අඟල් (in)' },
      { val: 'ft', label: 'අඩි (ft)' },
      { val: 'm', label: 'මීටර් (m)' },
      { val: 'cm', label: 'සෙ.මී. (cm)' },
      { val: 'L', label: 'ලීටර් (L)' },
      { val: 'ml', label: 'මිලිලීටර් (ml)' },
      { val: 'pcs', label: 'කෑලි (pcs)' }
    ];

    const getUnitFactor = (fromU, toU) => {
      fromU = (fromU || '').toLowerCase().trim();
      toU = (toU || '').toLowerCase().trim();
      // Normalize aliases
      if (fromU === 'ltr') fromU = 'l';
      if (toU === 'ltr') toU = 'l';
      if (fromU === toU) return 1;
      // Weight
      if (fromU === 'g' && toU === 'kg') return 0.001;
      if (fromU === 'kg' && toU === 'g') return 1000;
      // Length
      if ((fromU === 'in' || fromU === 'agal' || fromU === 'අඟල්') && (toU === 'ft' || toU === 'adi' || toU === 'අඩි')) return 1 / 12;
      if ((fromU === 'ft' || fromU === 'adi' || fromU === 'අඩි') && (toU === 'in' || toU === 'agal' || toU === 'අඟල්')) return 12;
      if (fromU === 'cm' && toU === 'm') return 0.01;
      if (fromU === 'm' && toU === 'cm') return 100;
      if ((fromU === 'in' || fromU === 'agal' || fromU === 'අඟල්') && toU === 'm') return 0.0254;
      if ((fromU === 'in' || fromU === 'agal' || fromU === 'අඟල්') && toU === 'cm') return 2.54;
      if (fromU === 'm' && (toU === 'in' || toU === 'agal' || toU === 'අඟල්')) return 39.3701;
      if (fromU === 'cm' && (toU === 'in' || toU === 'agal' || toU === 'අඟල්')) return 0.393701;
      if (fromU === 'ft' && toU === 'm') return 0.3048;
      if (fromU === 'm' && toU === 'ft') return 3.28084;
      if (fromU === 'ft' && toU === 'cm') return 30.48;
      // Volume
      if (fromU === 'ml' && toU === 'l') return 0.001;
      if (fromU === 'l' && toU === 'ml') return 1000;
      // Unknown cross-unit combination — return 0 to indicate incompatible units
      // This prevents silent wrong price calculation
      return 0;
    };

    const modalBody = `
      <div style="font-family:'Noto Sans Sinhala', sans-serif;">
        <!-- Item Info Header -->
        <div style="background:var(--bg-card, #f1f5f9); border-radius:8px; padding:10px 14px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:16px; font-weight:800; color:var(--charcoal);">${escapeHTML(item.name)}</div>
            <div style="font-size:12px; color:var(--steel); margin-top:2px;">
              මිල: <b style="color:var(--primary); font-size:13px;">${fmt(item.unitPrice)}</b> / ${escapeHTML(item.unit)} &nbsp;•&nbsp; Stock: <b>${item.maxQty}</b>
            </div>
          </div>
          <span style="font-size:22px;">⚖️</span>
        </div>

        <!-- Mode Toggle -->
        <div style="display:flex; background:#f1f5f9; border-radius:8px; padding:3px; margin-bottom:14px; gap:3px;">
          <button type="button" id="lm_tab_qty" style="flex:1; padding:7px 0; font-size:13px; font-weight:700; border:none; border-radius:6px; cursor:pointer; background:white; color:var(--primary); box-shadow:0 1px 4px rgba(0,0,0,0.12); transition:all 0.15s;">
            📏 ප්‍රමාණය
          </button>
          <button type="button" id="lm_tab_cash" style="flex:1; padding:7px 0; font-size:13px; font-weight:700; border:none; border-radius:6px; cursor:pointer; background:transparent; color:var(--steel); transition:all 0.15s;">
            💵 මුදල
          </button>
        </div>

        <!-- Qty Mode Section -->
        <div id="lm_qty_section">
          <!-- Quantity + Unit -->
          <div style="margin-bottom:12px;">
            <label style="font-size:13px; font-weight:700; color:var(--charcoal); display:block; margin-bottom:6px;">📏 ප්‍රමාණය සහ මිනුම:</label>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <input type="number" id="lm_loose_qty" class="input" min="0.0001" step="any" value="${initLooseQty}" placeholder="ප්‍රමාණය" autofocus style="font-size:22px; font-weight:900; text-align:center; height:50px; border:2px solid var(--primary);">
              <select id="lm_loose_unit" class="input" style="font-size:14px; font-weight:700; height:50px; border:2px solid var(--primary-light, #bae6fd);">
                ${unitOptions.map(u => `<option value="${u.val}" ${initLooseUnit === u.val ? 'selected' : ''}>${u.label}</option>`).join('')}
              </select>
            </div>
          </div>
          <!-- Presets -->
          <div style="margin-bottom:14px;">
            <div id="lm_presets" style="display:flex; flex-wrap:wrap; gap:6px;"></div>
          </div>
        </div>

        <!-- Cash Mode Section -->
        <div id="lm_cash_section" style="display:none;">
          <div style="margin-bottom:10px;">
            <label style="font-size:13px; font-weight:700; color:var(--charcoal); display:block; margin-bottom:6px;">ඉල්ලූ මුදල (රු.):</label>
            <input type="number" id="lm_cash_amount" class="input" min="1" step="any" placeholder="උදා: 100" style="font-size:22px; font-weight:900; text-align:center; height:46px; border:2px solid #f59e0b; width:100%;">
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px;">
            ${[50, 100, 150, 200, 250, 500, 1000, 2000].map(amt => `
              <button type="button" class="btn-cash-chip" data-cash="${amt}" style="padding:5px 10px; font-size:12px; font-weight:700; background:#fffbeb; border:1px solid #fde68a; border-radius:6px; cursor:pointer; color:#92400e;">
                රු.${amt}
              </button>
            `).join('')}
          </div>
          <div id="lm_cash_qty_show" style="font-size:12px; color:var(--steel); font-weight:700; margin-bottom:10px; text-align:center;"></div>
        </div>

        <!-- Result Box -->
        <div style="background:#f0fdf4; border:2px solid #86efac; border-radius:10px; padding:12px 14px; text-align:center; margin-bottom:12px;">
          <div style="font-size:12px; font-weight:700; color:#15803d; margin-bottom:2px;">අයවන මුළු මුදල:</div>
          <div id="lm_res_price" style="font-size:26px; font-weight:900; color:#166534; line-height:1.2;">රු. 0.00</div>
          <div style="font-size:12px; color:#15803d; margin-top:4px; font-weight:600;">
            Stock එකෙන් අඩු වන්නේ: <b id="lm_res_stock" style="color:#14532d; font-size:13px;">0</b>
          </div>
        </div>

        <div id="lm_stock_warning" style="display:none; background:#fef2f2; border:1px solid #fecaca; color:#b91c1c; font-size:12px; font-weight:700; padding:8px 10px; border-radius:6px; margin-bottom:10px; text-align:center;">
          ⚠️ ඉල්ලූ ප්‍රමාණය පවතින Stock එකට වඩා වැඩියි!
        </div>
      </div>
    `;

    openModal({
      title: '⚖️ ලිහිල් විකිණීම (Loose Sale)',
      bodyHTML: modalBody,
      footHTML: `
        <div style="display:flex; justify-content:space-between; width:100%; align-items:center; gap:8px;">
          <div>
            ${item.looseInfo ? `<button type="button" class="btn btn-outline" id="lm_reset_btn" style="color:var(--danger); border-color:var(--danger); font-size:12px; padding:6px 10px;">සාමාන්‍ය විකිණීමට</button>` : ''}
          </div>
          <div style="display:flex; gap:8px;">
            <button type="button" class="btn btn-outline" data-close style="padding:8px 14px;">අයින් වන්න</button>
            <button type="button" class="btn btn-primary" id="lm_apply_btn" style="min-width:130px; font-weight:800; font-size:14px; padding:8px 16px;">✔ හරි (Cart එකට)</button>
          </div>
        </div>
      `,
      wide: false,
      onMount: (wrap) => {
        let activeMode = 'qty';
        const looseQtyEl = wrap.querySelector('#lm_loose_qty');
        const looseUnitEl = wrap.querySelector('#lm_loose_unit');
        const cashAmountEl = wrap.querySelector('#lm_cash_amount');
        const cashQtyShowEl = wrap.querySelector('#lm_cash_qty_show');
        const resPriceEl = wrap.querySelector('#lm_res_price');
        const resStockEl = wrap.querySelector('#lm_res_stock');
        const stockWarnEl = wrap.querySelector('#lm_stock_warning');
        const presetsWrap = wrap.querySelector('#lm_presets');
        const tabQtyBtn = wrap.querySelector('#lm_tab_qty');
        const tabCashBtn = wrap.querySelector('#lm_tab_cash');
        const qtySec = wrap.querySelector('#lm_qty_section');
        const cashSec = wrap.querySelector('#lm_cash_section');

        const setTab = (mode) => {
          activeMode = mode;
          if (mode === 'qty') {
            tabQtyBtn.style.background = 'white';
            tabQtyBtn.style.color = 'var(--primary)';
            tabQtyBtn.style.boxShadow = '0 1px 4px rgba(0,0,0,0.12)';
            tabCashBtn.style.background = 'transparent';
            tabCashBtn.style.color = 'var(--steel)';
            tabCashBtn.style.boxShadow = 'none';
            qtySec.style.display = 'block';
            cashSec.style.display = 'none';
            setTimeout(() => looseQtyEl && looseQtyEl.focus(), 50);
          } else {
            tabCashBtn.style.background = 'white';
            tabCashBtn.style.color = '#b45309';
            tabCashBtn.style.boxShadow = '0 1px 4px rgba(0,0,0,0.12)';
            tabQtyBtn.style.background = 'transparent';
            tabQtyBtn.style.color = 'var(--steel)';
            tabQtyBtn.style.boxShadow = 'none';
            qtySec.style.display = 'none';
            cashSec.style.display = 'block';
            setTimeout(() => cashAmountEl && cashAmountEl.focus(), 50);
          }
          calc();
        };

        tabQtyBtn.addEventListener('click', () => setTab('qty'));
        tabCashBtn.addEventListener('click', () => setTab('cash'));

        const updatePresets = () => {
          const lUnit = looseUnitEl.value;
          let chips = [];
          // Each chip: { val, lbl, switchUnit? }
          // switchUnit: if set, clicking this chip ALSO changes the unit dropdown
          if (lUnit === 'kg') chips = [
            { val: 100,  lbl: '100g',   switchUnit: 'g'  },
            { val: 250,  lbl: '250g',   switchUnit: 'g'  },
            { val: 500,  lbl: '500g',   switchUnit: 'g'  },
            { val: 750,  lbl: '750g',   switchUnit: 'g'  },
            { val: 1,    lbl: '1 kg',   switchUnit: 'kg' },
            { val: 2,    lbl: '2 kg',   switchUnit: 'kg' },
            { val: 5,    lbl: '5 kg',   switchUnit: 'kg' }
          ];
          else if (lUnit === 'g') chips = [
            { val: 100,  lbl: '100g'  },
            { val: 250,  lbl: '250g'  },
            { val: 500,  lbl: '500g'  },
            { val: 750,  lbl: '750g'  },
            { val: 1000, lbl: '1000g' }
          ];
          else if (lUnit === 'in') chips = [
            { val: 3,  lbl: '3 අඟල්'  },
            { val: 6,  lbl: '6 අඟල්'  },
            { val: 12, lbl: '12 අඟල්' },
            { val: 18, lbl: '18 අඟල්' },
            { val: 24, lbl: '24 අඟල්' }
          ];
          else if (lUnit === 'ft') chips = [
            { val: 0.5, lbl: '1/2 අඩිය' },
            { val: 1,   lbl: '1 අඩිය'  },
            { val: 2,   lbl: '2 අඩි'   },
            { val: 3,   lbl: '3 අඩි'   },
            { val: 5,   lbl: '5 අඩි'   },
            { val: 10,  lbl: '10 අඩි'  }
          ];
          else if (lUnit === 'L') chips = [
            { val: 50,  lbl: '50 ml',  switchUnit: 'ml' },
            { val: 100, lbl: '100 ml', switchUnit: 'ml' },
            { val: 250, lbl: '250 ml', switchUnit: 'ml' },
            { val: 500, lbl: '500 ml', switchUnit: 'ml' },
            { val: 1,   lbl: '1 L',    switchUnit: 'L'  },
            { val: 2,   lbl: '2 L',    switchUnit: 'L'  },
            { val: 4,   lbl: '4 L',    switchUnit: 'L'  },
            { val: 5,   lbl: '5 L',    switchUnit: 'L'  }
          ];
          else if (lUnit === 'ml') chips = [
            { val: 50,  lbl: '50 ml'  },
            { val: 100, lbl: '100 ml' },
            { val: 250, lbl: '250 ml' },
            { val: 500, lbl: '500 ml' },
            { val: 750, lbl: '750 ml' },
            { val: 1000,lbl: '1000 ml'}
          ];
          else chips = [{ val: 1, lbl: '1' }, { val: 2, lbl: '2' }, { val: 5, lbl: '5' }, { val: 10, lbl: '10' }, { val: 20, lbl: '20' }];

          presetsWrap.innerHTML = chips.map(c =>
            `<button type="button" class="btn-loose-preset" data-val="${c.val}" ${c.switchUnit ? `data-switch-unit="${c.switchUnit}"` : ''} style="padding:4px 9px; font-size:11.5px; font-weight:700; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; cursor:pointer; color:var(--charcoal);">
              ${c.lbl}
            </button>
          `).join('');

          presetsWrap.querySelectorAll('.btn-loose-preset').forEach(btn => {
            btn.addEventListener('click', () => {
              looseQtyEl.value = btn.dataset.val;
              // Switch unit dropdown if the chip specifies a different unit
              if (btn.dataset.switchUnit && btn.dataset.switchUnit !== looseUnitEl.value) {
                looseUnitEl.value = btn.dataset.switchUnit;
                updatePresets(); // rebuild chip list for new unit
              }
              calc();
            });
          });
        };

        const calc = () => {
          const packSize = Math.max(0.0001, Number(initPackSize) || 1);
          const packUnit = initPackUnit || 'pcs';
          const looseUnit = looseUnitEl.value;
          const unitPrice = item.unitPrice;
          let calcLooseQty = 0, stockQty = 0, linePrice = 0;

          // If custom loose unit price configured on item
          const hasCustomPrice = initCustomPrice !== '' && Number(initCustomPrice) > 0;
          const autoLooseUnitPrice = (() => {
            if (unitPrice <= 0) return 0;
            const factor = getUnitFactor(packUnit, looseUnit);
            const looseUnitsPerPack = packSize * factor;
            return looseUnitsPerPack > 0 ? unitPrice / looseUnitsPerPack : 0;
          })();
          const effectiveLooseUnitPrice = hasCustomPrice ? (Number(initCustomPrice) * getUnitFactor(looseUnit, packUnit)) : autoLooseUnitPrice;

          if (activeMode === 'qty') {
            calcLooseQty = Math.max(0, parseFloat(looseQtyEl.value) || 0);
            if (hasCustomPrice) {
              linePrice = calcLooseQty * effectiveLooseUnitPrice;
              const factor = getUnitFactor(looseUnit, packUnit);
              stockQty = (calcLooseQty * factor) / packSize;
            } else {
              const factor = getUnitFactor(looseUnit, packUnit);
              stockQty = (calcLooseQty * factor) / packSize;
              linePrice = stockQty * unitPrice;
            }
          } else {
            const cash = Math.max(0, parseFloat(cashAmountEl.value) || 0);
            linePrice = cash;
            if (hasCustomPrice && effectiveLooseUnitPrice > 0) {
              const looseUnitsGiven = cash / effectiveLooseUnitPrice;
              calcLooseQty = Math.round(looseUnitsGiven * 1000) / 1000;
              const factor = getUnitFactor(looseUnit, packUnit);
              stockQty = (looseUnitsGiven * factor) / packSize;
            } else {
              stockQty = unitPrice > 0 ? (cash / unitPrice) : 0;
              const effectiveInPack = stockQty * packSize;
              const factor = getUnitFactor(packUnit, looseUnit);
              calcLooseQty = Math.round(effectiveInPack * factor * 1000) / 1000;
            }
            if (cashQtyShowEl) {
              cashQtyShowEl.textContent = cash > 0
                ? `➜ ලැබෙන්නේ: ${calcLooseQty} ${looseUnit} (Stock: ${Math.round(stockQty * 10000)/10000} ${item.unit})`
                : '';
            }
          }

          resPriceEl.textContent = fmt(linePrice);
          const displayStock = Math.round(stockQty * 10000) / 10000;
          resStockEl.textContent = `${displayStock} ${item.unit} (${calcLooseQty} ${looseUnit})`;

          if (stockQty > item.maxQty) {
            stockWarnEl.style.display = 'block';
          } else {
            stockWarnEl.style.display = 'none';
          }

          return { stockQty: displayStock, calcLooseQty, linePrice, packSize, packUnit, looseUnit, customLooseUnitPrice: hasCustomPrice ? Number(initCustomPrice) : null };
        };

        looseQtyEl.addEventListener('input', calc);
        looseUnitEl.addEventListener('change', () => { updatePresets(); calc(); });
        cashAmountEl.addEventListener('input', calc);

        wrap.querySelectorAll('.btn-cash-chip').forEach(b => {
          b.addEventListener('click', () => { cashAmountEl.value = b.dataset.cash; calc(); });
        });

        updatePresets();
        calc();

        // Apply action
        const applyAction = () => {
          const res = calc();
          if (res.stockQty <= 0) {
            toast('කරුණාකර වලංගු ප්‍රමාණයක් ඇතුළත් කරන්න', 'err');
            return;
          }
          if (res.stockQty > item.maxQty) {
            toast(t('sale_exceeds_stock'), 'err');
            return;
          }

          item.qty = res.stockQty;
          item.unitPrice = res.linePrice > 0 && res.stockQty > 0 ? (res.linePrice / res.stockQty) : item.unitPrice;
          item.looseInfo = {
            isLoose: true,
            looseQty: res.calcLooseQty,
            looseUnit: res.looseUnit,
            packSize: res.packSize,
            packUnit: res.packUnit,
            customLooseUnitPrice: res.customLooseUnitPrice,
            shortText: `${res.calcLooseQty} ${res.looseUnit}${res.customLooseUnitPrice ? ` @ රු.${res.customLooseUnitPrice}/${res.packUnit}` : ''}`,
            fullText: `${res.calcLooseQty} ${res.looseUnit} (${res.packSize} ${res.packUnit} පැකේජයකින්)${res.customLooseUnitPrice ? ` — custom රු.${res.customLooseUnitPrice}/${res.packUnit}` : ''}`
          };

          closeModal();
          Views.sale.refreshCart();
          Views.sale.applyCustomerHardwareDiscount();
          toast(`ලිහිල් විකිණීම Cart එකට යෙදුවා: ${item.looseInfo.shortText}`, 'ok');
        };

        const applyBtn = wrap.querySelector('#lm_apply_btn');
        const closeBtn = wrap.querySelector('[data-close]');
        const resetBtn = wrap.querySelector('#lm_reset_btn');

        applyBtn?.addEventListener('click', applyAction);

        const focusElement = (el) => {
          if (!el) return;
          el.focus();
          if (typeof el.select === 'function') el.select();
        };

        // Select all text on focus for inputs
        [looseQtyEl, cashAmountEl].forEach(inp => {
          if (inp) inp.addEventListener('focus', () => inp.select());
        });

        // 1. Qty input keydown
        looseQtyEl?.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            focusElement(looseUnitEl);
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            focusElement(applyBtn);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            focusElement(tabQtyBtn);
          } else if (e.key === 'Enter') {
            e.preventDefault();
            applyAction();
          }
        });

        // 2. Loose Unit select keydown
        looseUnitEl?.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            focusElement(looseQtyEl);
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            focusElement(applyBtn);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            focusElement(tabCashBtn);
          } else if (e.key === 'Enter') {
            e.preventDefault();
            applyAction();
          }
        });

        // 3. Cash amount input keydown
        cashAmountEl?.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            focusElement(applyBtn);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            focusElement(tabCashBtn);
          } else if (e.key === 'Enter') {
            e.preventDefault();
            applyAction();
          }
        });

        // 6. Mode Tabs keydown
        tabQtyBtn?.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            setTab('cash');
            focusElement(tabCashBtn);
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            focusElement(looseQtyEl);
          }
        });

        tabCashBtn?.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            setTab('qty');
            focusElement(tabQtyBtn);
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            focusElement(cashAmountEl);
          }
        });

        // 7. Footer buttons keydown
        applyBtn?.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            focusElement(packSizeEl);
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            focusElement(closeBtn || resetBtn);
          }
        });

        closeBtn?.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            focusElement(applyBtn);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            focusElement(packSizeEl);
          } else if (e.key === 'ArrowLeft' && resetBtn) {
            e.preventDefault();
            focusElement(resetBtn);
          }
        });

        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            item.qty = 1;
            item.looseInfo = null;
            closeModal();
            Views.sale.refreshCart();
            Views.sale.applyCustomerHardwareDiscount();
            toast('සාමාන්‍ය විකිණීමට මාරු කළා', 'ok');
          });
          resetBtn.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
              e.preventDefault();
              focusElement(closeBtn || applyBtn);
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              focusElement(packSizeEl);
            }
          });
        }
      }
    });
  },

  async completeSale() {
    if (!cart.length) { toast(t('sale_empty_cart'), 'err'); return; }
    const payType = Views.sale.payType;
    let customerId = null;
    let customerName = '';

    if (Views.sale.selectedCustomer) {
      customerId = Views.sale.selectedCustomer.id;
      customerName = Views.sale.selectedCustomer.name;
    }

    if (payType === 'credit') {
      if (!customerId) { toast(t('sale_select_credit_customer'), 'err'); return; }
    }

    const itemDiscounts = Views.sale.calcItemDiscounts();
    const overallDiscount = Number(document.getElementById('saleDiscount')?.value) || 0;
    const discount = overallDiscount + itemDiscounts;
    const total = Views.sale.calcTotal();
    const paidInput = document.getElementById('saleAmountPaid');
    const paidVal = paidInput ? paidInput.value.trim() : (Views.sale.amountPaid !== undefined && Views.sale.amountPaid !== '' ? String(Views.sale.amountPaid).trim() : '');
    const amountPaid = Number(paidVal) || 0;

    // Validate cash payment: Must be entered and must not be less than total
    if (payType === 'cash') {
      if (total > 0) {
        if (!paidVal || isNaN(amountPaid) || amountPaid <= 0) {
          toast(`කරුණාකර ලැබුණු මුදල ඇතුළත් කරන්න! (නියමිත මුදල: රු. ${fmt(total)})`, 'err');
          if (paidInput) {
            paidInput.classList.add('input-error');
            paidInput.focus();
            if (typeof paidInput.select === 'function') paidInput.select();
          }
          return;
        }

        if (amountPaid < total) {
          const shortDiff = total - amountPaid;
          toast(`ලැබුණු මුදල අඩුයි! බිල මුද්‍රණය කළ නොහැක. (තව රු. ${fmt(shortDiff)} ක් අවශ්‍යයි)`, 'err');
          if (paidInput) {
            paidInput.classList.add('input-error');
            paidInput.focus();
            if (typeof paidInput.select === 'function') paidInput.select();
          }
          return;
        }
      }
    }

    const changeAmount = Math.max(0, amountPaid - total);

    const lines = cart.map(l => ({
      itemId: l.itemId,
      name: l.name,
      barcode: l.barcode || (DB.getItem(l.itemId)?.barcode || ''),
      unit: l.unit,
      qty: l.qty,
      unitPrice: l.unitPrice,
      originalPrice: (l.originalPrice !== undefined && l.originalPrice > 0) ? l.originalPrice : l.unitPrice,
      discount: Math.max(0, ((l.originalPrice !== undefined && l.originalPrice > 0) ? l.originalPrice : l.unitPrice) - l.unitPrice),
      discountType: l.discountType || (DB.data.settings && DB.data.settings.defaultDiscType) || 'unit',
      lineDiscountTotal: Views.sale.calcLineDiscount(l),
      looseInfo: l.looseInfo || null
    }));

    const sale = await DB.createSale({ lines, paymentType: payType, customerId, customerName, discount, amountPaid, changeAmount });
    toast(`${t('sale_success')}#${sale.id}`, 'ok');
    cart = [];
    document.getElementById('saleDiscount').value = 0;
    Views.sale.amountPaid = '';
    Views.sale.selectedCustomer = null;
    Views.sale.setPayType('cash');
    Views.sale.refreshCart();
    Views.sale.printReceiptDirect(sale);
    App.updateSidebarCounts();
    // If this was a Quick Sale tab (not primary), close it to return to the main bill
    if (Views.sale.activeIdx > 0) {
      const closedIdx = Views.sale.activeIdx;
      Views.sale.sessions.splice(closedIdx, 1);
      Views.sale.activeIdx = 0;
      Views.sale.loadSession(0);
      App.render();
    }
  },

  getReceiptHTML(sale) {
    const shopName = (DB.data.settings && DB.data.settings.shopName) || 'HardwarePOS';
    const shopDesc = (DB.data.settings && DB.data.settings.shopDescription) || '';
    const logo = (DB.data.settings && DB.data.settings.logo) || '';
    const rawLogoSize = Number(DB.data.settings && DB.data.settings.logoSize) || 50;
    const logoSize = Math.min(Math.max(rawLogoSize * 1.8, 85), 150);

    return `
      <div class="receipt" id="printArea">
        ${logo ? `<div style="text-align:center; margin-bottom:6px;"><img class="receipt-logo" src="${logo}" alt="Logo" style="height:${logoSize}px; max-height:140px; max-width:250px; object-fit:contain; margin:0 auto; display:block;"></div>` : ''}
        <h2>${escapeHTML(shopName)}</h2>
        ${shopDesc ? `<div class="r-center" style="font-size:9.5px; color:#222; margin-bottom:3px; white-space:pre-line;">${escapeHTML(shopDesc)}</div>` : ''}
        
        <div style="border-top:1px dashed #000; border-bottom:1px dashed #000; padding:2px 0; margin:3px 0; font-size:10px; width:100%; box-sizing:border-box;">
          <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
            <span><b>INVOICE #${sale.id}</b></span>
            <span style="font-size:9.5px;">${(()=>{ const d=new Date(sale.date); return d.toLocaleDateString('en-GB') + ' ' + d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}); })()}</span>
          </div>
          ${sale.customerName ? `<div style="margin-top:2px; font-size:9.5px;">ගනුදෙනුකරු: <b>${escapeHTML(sale.customerName)}</b></div>` : ''}
        </div>

        <table style="width:100%; border-collapse:collapse; margin:2px 0; font-size:9.5px; table-layout:fixed; box-sizing:border-box;">
          <thead>
            <tr style="border-bottom:1px dashed #000;">
              <th style="text-align:left; padding:2px 0; width:36%;">විස්තරය</th>
              <th style="text-align:center; width:20%; padding:2px 0;">ගණන</th>
              <th style="text-align:right; width:20%; padding:2px 0;">මිල</th>
              <th style="text-align:right; width:24%; padding:2px 0;">එකතුව</th>
            </tr>
          </thead>
          <tbody>
            ${sale.lines.map(l => {
              const origPrice = (l.originalPrice !== undefined && l.originalPrice > 0) ? l.originalPrice : l.unitPrice;
              const hasDisc = (l.unitPrice < origPrice);
              const lineTot = l.qty * l.unitPrice;
              return `
                <tr>
                  <td colspan="4" style="padding-top:2px; font-weight:700; color:#000; font-size:10px; word-break:break-word;">${escapeHTML(l.name)}</td>
                </tr>
                <tr style="border-bottom:1px dotted #ccc;">
                  <td style="padding-bottom:2px; font-size:9px; color:#444; word-break:break-word;">
                    ${l.looseInfo ? `[ලිහිල්: ${escapeHTML(l.looseInfo.shortText || '')}]` : ''}
                    ${hasDisc ? `[Disc: -${(origPrice - l.unitPrice).toLocaleString('en-LK', {minimumFractionDigits:2})}]` : ''}
                  </td>
                  <td style="text-align:center; padding-bottom:2px; font-size:9.5px; white-space:nowrap;">
                    ${l.looseInfo ? `${l.looseInfo.looseQty} ${escapeHTML(l.looseInfo.looseUnit)}` : `${l.qty} ${escapeHTML(l.unit || '')}`}
                  </td>
                  <td style="text-align:right; padding-bottom:2px; font-size:9.5px; white-space:nowrap;">
                    ${(l.unitPrice).toLocaleString('en-LK', {minimumFractionDigits:2, maximumFractionDigits:2})}
                  </td>
                  <td style="text-align:right; padding-bottom:2px; font-weight:700; font-size:9.5px; white-space:nowrap;">
                    ${(lineTot).toLocaleString('en-LK', {minimumFractionDigits:2, maximumFractionDigits:2})}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div style="border-top:1px dashed #000; padding-top:2px; margin-top:2px; width:100%; box-sizing:border-box;">
          <div class="receipt-totals-row"><span>${t('sale_subtotal')} (Subtotal):</span><span>${fmt(sale.subtotal)}</span></div>
          ${sale.discount > 0 ? `<div class="receipt-totals-row"><span>${t('sale_discount')} (Discount):</span><span>- ${fmt(sale.discount)}</span></div>` : ''}
          <div class="receipt-totals-row grand">
            <span style="font-size:11px; font-weight:800;">ශුද්ධ එකතුව (TOTAL):</span>
            <span style="font-size:12px; font-weight:800;">${fmt(sale.total)}</span>
          </div>
          <div class="receipt-totals-row" style="margin-top:1px;">
            <span>ගෙවීම් ක්‍රමය (Payment):</span>
            <b>${sale.paymentType === 'credit' ? `ණයට (Credit) - ${escapeHTML(sale.customerName || '')}` : 'මුදල් (Cash)'}</b>
          </div>
          ${sale.paymentType === 'cash' && sale.amountPaid > 0 ? `
            <div class="receipt-totals-row"><span>ගෙවූ මුදල (Paid):</span><span>${fmt(sale.amountPaid)}</span></div>
            <div class="receipt-totals-row" style="font-weight:700;"><span>ඉතිරි මුදල (Change):</span><span>${fmt(sale.changeAmount)}</span></div>
          ` : ''}
        </div>

        <div style="text-align:center; margin-top:4px; border-top:1px dashed #000; padding-top:4px;">
          <div style="font-weight:700; font-size:10px; margin-bottom:1px;">${t('receipt_thanks')}</div>
          <div style="font-size:8.5px; color:#222; margin-bottom:3px; line-height:1.25;">භාණ්ඩ ආපසු භාරදීමේදී මෙම බිල්පත ඉදිරිපත් කිරීම අනිවාර්ය වේ.</div>
          
          <div style="margin:3px 0; display:flex; flex-direction:column; align-items:center; justify-content:center;">
            ${typeof BarcodeSystem !== 'undefined' ? BarcodeSystem.generateCode128SVG(sale.barcode || ('BILL-' + sale.id), { width: 140, height: 32, fontSize: 8 }) : ''}
          </div>
          <div style="font-size:9.5px; font-weight:700; color:#000; margin-top:5px; text-align:center; letter-spacing:0.2px;">
            ImagineX Software Solution - 0761945587
          </div>
        </div>
      </div>
    `;
  },

  async printReceiptDirect(sale) {
    const html = Views.sale.getReceiptHTML(sale);
    let hiddenContainer = document.getElementById('directPrintContainer');
    if (!hiddenContainer) {
      hiddenContainer = document.createElement('div');
      hiddenContainer.id = 'directPrintContainer';
      document.body.appendChild(hiddenContainer);
    }
    hiddenContainer.innerHTML = html;

    if (window.electronAPI && typeof window.electronAPI.printReceipt === 'function') {
      try {
        await window.electronAPI.printReceipt({ silent: true });
      } catch (err) {
        console.error('Direct print error:', err);
        window.print();
      }
    } else {
      window.print();
    }

    setTimeout(() => {
      if (hiddenContainer && hiddenContainer.parentNode) {
        hiddenContainer.parentNode.removeChild(hiddenContainer);
      }
    }, 1500);
  },

  showReceipt(sale) {
    const html = Views.sale.getReceiptHTML(sale);
    openModal({
      title: `${t('hist_preview') || 'බිල්පත'} #${sale.id} (80mm Thermal)`,
      bodyHTML: html,
      footHTML: `
        <button class="btn btn-outline" data-close>${t('close')}</button>
        <button class="btn btn-primary" id="printReceiptBtn"><i class="ph ph-printer"></i> ${t('receipt_print') || 'Print කරන්න'}</button>
      `,
      wide: false,
      onMount: (wrap) => {
        wrap.querySelector('#printReceiptBtn').addEventListener('click', () => {
          if (window.electronAPI && typeof window.electronAPI.printReceipt === 'function') {
            window.electronAPI.printReceipt({ silent: true });
          } else {
            window.print();
          }
        });
      }
    });
  }
};

/* ================= ITEMS ================= */
Views.items = {
  searchQ: '',
  selectedCategory: 'all',
  groupByCategory: false,

  render() {
    const allItems = DB.allItems();
    const categories = [...new Set(allItems.map(i => (i.category || '').trim()).filter(Boolean))].sort();
    const catCounts = {};
    allItems.forEach(i => {
      const c = (i.category || '').trim() || 'වෙනත්';
      catCounts[c] = (catCounts[c] || 0) + 1;
    });

    const currentCat = Views.items.selectedCategory || 'all';

    return `
      ${Views.renderPageHeader({
      icon: 'ph-package',
      title: t('items_list'),
      count: allItems.length,
      search: { id: 'itemsSearch', placeholder: t('search_placeholder'), value: Views.items.searchQ },
      actions: [{ id: 'addItemBtn', label: t('items_add_btn'), cls: 'btn-primary' }]
    })}

      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; gap:12px; flex-wrap:wrap;">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <select class="input" id="itemsCategorySelect" style="width:190px; cursor:pointer;" title="කාණ්ඩය අනුව තෝරන්න">
            <option value="all" ${currentCat === 'all' ? 'selected' : ''}>📁 සියලුම කාණ්ඩ (${allItems.length})</option>
            ${categories.map(c => `<option value="${escapeHTML(c)}" ${currentCat === c ? 'selected' : ''}>📁 ${escapeHTML(c)} (${catCounts[c] || 0})</option>`).join('')}
            ${catCounts['වෙනත්'] ? `<option value="වෙනත්" ${currentCat === 'වෙනත්' ? 'selected' : ''}>🏷️ වෙනත් (${catCounts['වෙනත්']})</option>` : ''}
          </select>

          <button class="btn btn-sm ${Views.items.groupByCategory ? 'btn-primary' : 'btn-outline'}" id="itemsGroupByToggle" title="කාණ්ඩ අනුව වෙන් කර බලන්න" style="height:36px; padding:0 12px; display:inline-flex; align-items:center; gap:6px;">
            <i class="ph ph-squares-four" style="font-size:16px;"></i> ${Views.items.groupByCategory ? 'කාණ්ඩ අනුව (ක්‍රියාත්මකයි)' : 'කාණ්ඩ අනුව වෙන්කරන්න'}
          </button>
        </div>
      </div>

      <div id="itemsTableWrap">${Views.items.tableHTML()}</div>
    `;
  },

  tableHTML() {
    let list = DB.allItems();
    const q = (Views.items.searchQ || '').trim();
    if (q) list = list.filter(i => Singlish.match(i.name, q) || Singlish.match(i.category || '', q) || Singlish.match(i.subCategory || '', q) || Singlish.match(i.description || '', q) || (i.barcode && i.barcode.toLowerCase().includes(q.toLowerCase())));

    const currentCat = Views.items.selectedCategory || 'all';
    if (currentCat !== 'all') {
      if (currentCat === 'වෙනත්') {
        list = list.filter(i => !i.category || (i.category || '').trim() === 'වෙනත්' || (i.category || '').trim() === '');
      } else {
        list = list.filter(i => (i.category || '').trim() === currentCat);
      }
    }

    if (!list.length) return `<div class="card"><div class="empty-state"><div class="em-ico"><i class="ph ph-package"></i></div><h3>${t('items_no_items')}</h3><div class="small">${currentCat !== 'all' ? `"${escapeHTML(currentCat)}" කාණ්ඩයේ භාණ්ඩ කිසිවක් නැත.` : t('items_no_items_sub')}</div></div></div>`;

    const renderRow = (i) => {
      const status = i.qty <= 0 ? `<span class="pill pill-danger">${t('status_out')}</span>`
        : i.qty <= i.reorderLevel ? `<span class="pill pill-warn">${t('status_low')}</span>`
          : `<span class="pill pill-ok">${t('status_ok')}</span>`;
      return `
        <tr>
          <td>
            <div style="width:36px; height:36px; border-radius:6px; overflow:hidden; background:var(--paper); display:flex; align-items:center; justify-content:center; border:1px solid var(--border);">
              ${i.image ? `<img src="${i.image}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="ph ph-package" style="font-size:18px;"></i>`}
            </div>
          </td>
          <td>
            <b>${escapeHTML(i.name)}</b>
            ${i.barcode ? `<div style="font-size:11px; font-family:monospace; color:var(--primary); font-weight:700;"><i class="ph ph-barcode"></i> ${escapeHTML(i.barcode)}</div>` : ''}
          </td>
          <td>
            <span class="cat-badge-click" data-cat-click="${escapeHTML(i.category || 'වෙනත්')}" title="මෙම කාණ්ඩය පමණක් බලන්න" style="cursor:pointer; display:inline-flex; align-items:center; gap:4px; font-weight:600; color:var(--primary);">
              <i class="ph ph-folder" style="font-size:13px;"></i> ${escapeHTML(i.category || 'වෙනත්')}
            </span>
            ${i.subCategory ? `<div style="font-size:11px; color:var(--steel); margin-top:2px;">↳ ${escapeHTML(i.subCategory)}</div>` : ''}
          </td>
          <td class="num">${fmt(i.costPrice)}</td>
          <td class="num">${fmt(i.sellPrice)}</td>
          <td class="num">${i.qty} ${escapeHTML(i.unit)}</td>
          <td>${status}</td>
          <td>
            <button class="icon-btn" data-print-barcode="${i.id}" title="${t('barcode_print_label') || 'Print Barcode'}"><i class="ph ph-barcode"></i></button>
            <button class="icon-btn" data-edit-item="${i.id}" title="${t('items_edit')}">✎</button>
            <button class="icon-btn" data-del-item="${i.id}" title="${t('delete')}"><i class="ph ph-trash"></i></button>
          </td>
        </tr>`;
    };

    if (Views.items.groupByCategory) {
      const groups = {};
      list.forEach(i => {
        const cat = (i.category || '').trim() || 'වෙනත්';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(i);
      });

      const catKeys = Object.keys(groups).sort();
      return catKeys.map(cat => {
        const catItems = groups[cat];
        const catTotalQty = catItems.reduce((acc, it) => acc + (Number(it.qty) || 0), 0);
        const catTotalVal = catItems.reduce((acc, it) => acc + ((Number(it.costPrice) || 0) * (Number(it.qty) || 0)), 0);

        return `
          <div class="category-group-card" style="margin-bottom:20px; background:var(--card); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
            <div style="background:var(--paper); padding:10px 16px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); flex-wrap:wrap; gap:8px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <i class="ph ph-folder-open" style="font-size:18px; color:var(--primary);"></i>
                <h3 style="margin:0; font-size:15px; font-weight:700; color:var(--charcoal);">${escapeHTML(cat)}</h3>
                <span class="pill pill-ok" style="font-size:11px; padding:1px 8px;">${catItems.length} items</span>
              </div>
              <div style="font-size:12px; color:var(--steel); display:flex; gap:14px;">
                <span>තොග ප්‍රමාණය: <b style="color:var(--charcoal);">${catTotalQty}</b></span>
                <span>තොග වටිනාකම: <b style="color:var(--primary);">${fmt(catTotalVal)}</b></span>
              </div>
            </div>
            <div class="table-wrap" style="border:none; border-radius:0;">
              <table>
                <thead><tr>
                  <th style="width:46px;">Photo</th><th>${t('items_name')}</th><th>${t('items_category')}</th><th class="num">${t('items_cost_price')}</th><th class="num">${t('items_sell_price')}</th>
                  <th class="num">${t('word_qty')}</th><th>${t('items_status')}</th><th></th>
                </tr></thead>
                <tbody>
                  ${catItems.map(renderRow).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
      }).join('');
    }

    return `
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th style="width:46px;">Photo</th><th>${t('items_name')}</th><th>${t('items_category')}</th><th class="num">${t('items_cost_price')}</th><th class="num">${t('items_sell_price')}</th>
            <th class="num">${t('word_qty')}</th><th>${t('items_status')}</th><th></th>
          </tr></thead>
          <tbody>
            ${list.map(renderRow).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  formHTML(item) {
    const v = item || { name: '', barcode: '', category: '', subCategory: '', unit: 'pcs', costPrice: '', sellPrice: '', qty: '', reorderLevel: 5, packSize: '', packUnit: '', loosePrice: '', image: '', description: '' };
    const existingCategories = [...new Set(DB.data.items.map(i => i.category).filter(c => c && c.trim()))].sort();
    const catOptions = existingCategories.map(c => `<div class="combo-opt" data-val="${escapeHTML(c)}">${escapeHTML(c)}</div>`).join('');
    // sub-category options for the current category
    const existingSubCats = [...new Set(DB.data.items.filter(i => i.category === v.category).map(i => i.subCategory).filter(s => s && s.trim()))].sort();
    const subCatOptions = existingSubCats.map(s => `<div class="combo-opt" data-val="${escapeHTML(s)}">${escapeHTML(s)}</div>`).join('');
    const unitsList = [
      { val: 'pcs', label: 'pcs (කෑලි)' },
      { val: 'kg', label: 'kg (කිලෝග්‍රෑම්)' },
      { val: 'g', label: 'g (ග්‍රෑම්)' },
      { val: 'L', label: 'L (ලීටර්)' },
      { val: 'ml', label: 'ml (මිලිලීටර්)' },
      { val: 'bag', label: 'bag (මලු / බෑග්)' },
      { val: 'box', label: 'box (පෙට්ටි)' },
      { val: 'm', label: 'm (මීටර්)' },
      { val: 'ft', label: 'ft (අඩි)' },
      { val: 'set', label: 'set (කට්ටල)' },
      { val: 'roll', label: 'roll (රෝල්)' },
      { val: 'sheet', label: 'sheet (තහඩු / ෂීට්)' },
      { val: 'bundle', label: 'bundle (බණ්ඩල් / මිටි)' },
      { val: 'pkt', label: 'pkt (පැකට්)' },
      { val: 'pair', label: 'pair (යුගල)' },
      { val: 'cube', label: 'cube (කියුබ්)' },
      { val: 'sqft', label: 'sqft (වර්ග අඩි)' },
      { val: 'can', label: 'can (කෑන්)' },
      { val: 'bottle', label: 'bottle (බෝතල්)' },
      { val: 'tube', label: 'tube (ටියුබ්)' },
      { val: 'length', label: 'length (දිග / බට)' }
    ];
    let unitOptsHTML = unitsList.map(u => `<option value="${u.val}" ${v.unit === u.val ? 'selected' : ''}>${u.label}</option>`).join('');
    if (v.unit && !unitsList.some(u => u.val === v.unit)) {
      unitOptsHTML += `<option value="${escapeHTML(v.unit)}" selected>${escapeHTML(v.unit)}</option>`;
    }
    return `
      <!-- Image Upload -->
      <div class="field" style="margin-bottom:14px;">
        <label class="field-label">Item Photo / Item Pinthuraya</label>
        <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
          <div id="imgPreviewWrap" style="width:80px; height:80px; border-radius:10px; overflow:hidden; border:2px dashed var(--border); display:flex; align-items:center; justify-content:center; background:var(--paper); flex-shrink:0;">
            ${v.image ? `<img id="imgPreview" src="${v.image}" style="width:100%; height:100%; object-fit:cover;">` : `<span id="imgPreview" style="font-size:28px;">📷</span>`}
          </div>
          <div style="flex:1; min-width:160px;">
            <label for="f_image_file" class="btn btn-outline" style="cursor:pointer; display:inline-block; margin-bottom:6px;">📁 Photo Select කරන්න</label>
            <input type="file" id="f_image_file" accept="image/*" style="display:none;">
            <input type="hidden" id="f_image" value="${escapeHTML(v.image || '')}"><br>
            <span class="small text-muted">JPG, PNG, WebP accept කරයි (max 2MB)</span>
          </div>
        </div>
      </div>

      <!-- Barcode Section -->
      <div class="field" style="margin-bottom:14px; background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:10px; padding:10px 12px;">
        <label class="field-label" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; color:#1e293b; font-weight:700;">
          <span style="display:inline-flex; align-items:center; gap:6px;"><i class="ph ph-barcode" style="font-size:18px; color:var(--primary);"></i> ${t('barcode_label') || 'බාර්කෝඩ් (Barcode)'}</span>
          <span class="small text-muted" style="font-size:11px;">(USB Scanner / Camera / Auto-Generate)</span>
        </label>
        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          <div style="position:relative; flex:1; min-width:180px;">
            <input class="input" id="f_barcode" value="${escapeHTML(v.barcode || '')}" placeholder="${t('barcode_placeholder') || 'Scan or enter barcode...'}" style="padding-left:36px; font-family:monospace; font-weight:700; font-size:14px; letter-spacing:1px;" autocomplete="off">
            <i class="ph ph-barcode" style="position:absolute; left:10px; top:50%; transform:translateY(-50%); font-size:18px; color:var(--text-muted);"></i>
          </div>
          <button type="button" class="btn btn-outline" id="btnGenBarcode" title="Generate Barcode" style="padding:0 10px; height:38px; display:inline-flex; align-items:center; gap:4px; font-weight:600;">
            <i class="ph ph-dice-three"></i> <span>${t('barcode_generate') || 'Generate'}</span>
          </button>
          <button type="button" class="btn btn-outline" id="btnCamScanBarcode" title="Camera Scan" style="padding:0 10px; height:38px; display:inline-flex; align-items:center; gap:4px; font-weight:600;">
            <i class="ph ph-camera"></i> <span>Scan</span>
          </button>
          ${v.id ? `
          <button type="button" class="btn btn-outline" id="btnPrintBarcodeModalBtn" title="Print Sticker" style="padding:0 10px; height:38px; display:inline-flex; align-items:center; gap:4px; font-weight:600;">
            <i class="ph ph-printer"></i> <span>Sticker</span>
          </button>` : ''}
        </div>
        <div id="barcodePreviewWrap" style="margin-top:8px; ${v.barcode ? 'display:block;' : 'display:none;'}">
          <!-- Live SVG Barcode Preview -->
        </div>
      </div>

      <div class="grid grid-2">
        <div class="field"><label class="field-label">Description</label><textarea class="input" id="f_desc" placeholder="Enter item description..." style="min-height:50px;">${escapeHTML(v.description || '')}</textarea></div>
        <div class="field"><label class="field-label">${t('items_form_name')}</label><input class="input" id="f_name" value="${escapeHTML(v.name)}" placeholder="${t('items_form_name_ph')}"></div>
        <div class="field">
          <label class="field-label">${t('items_form_cat')}</label>
          <div class="combo-wrap" id="comboCatWrap">
            <input class="combo-input" id="f_category" value="${escapeHTML(v.category)}" placeholder="${t('items_form_cat_ph')}" autocomplete="off">
            <button type="button" class="combo-arrow" id="comboCatArrow" tabindex="-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="combo-dropdown" id="comboCatDrop">
              ${catOptions || '<div class="combo-opt combo-no-match">කිසිදු category එකක් නැත</div>'}
            </div>
          </div>
        </div>
        <div class="field">
          <label class="field-label">${t('items_form_subcat')}</label>
          <div class="combo-wrap" id="comboSubCatWrap">
            <input class="combo-input" id="f_subCategory" value="${escapeHTML(v.subCategory || '')}" placeholder="${t('items_form_subcat_ph')}" autocomplete="off">
            <button type="button" class="combo-arrow" id="comboSubCatArrow" tabindex="-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="combo-dropdown" id="comboSubCatDrop">
              ${subCatOptions || '<div class="combo-opt combo-no-match">Sub category නැත. ටයිප් කරන්න.</div>'}
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-2">
        <div class="field"><label class="field-label">${t('items_form_unit')}</label>
          <select class="input" id="f_unit">
            ${unitOptsHTML}
          </select>
        </div>
        <div class="field"><label class="field-label">${t('items_form_reorder')}</label><input class="input" id="f_reorder" type="number" min="0" step="any" value="${v.reorderLevel}"></div>
      </div>
      <div class="grid grid-2">
        <div class="field"><label class="field-label">${t('items_form_cost')}</label><input class="input" id="f_cost" type="number" min="0" step="0.01" value="${v.costPrice}"></div>
        <div class="field"><label class="field-label">${t('items_form_sell')}</label><input class="input" id="f_sell" type="number" min="0" step="0.01" value="${v.sellPrice}"></div>
      </div>
      <div class="field" style="margin-bottom:12px;">
        <label class="field-label">${t('items_form_qty')}</label>
        <input class="input" id="f_qty" type="number" min="0" step="any" value="${v.qty}">
        <div class="small text-muted" style="margin-top:4px;">* කොටස්/ලිහිල් (loose) වශයෙන් විකිණීමට decimal values (උදා: 0.5kg, 2.5m) භාවිතා කළ හැක.</div>
      </div>

      <!-- Packaging & Loose Sale Configuration -->
      <div style="background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%); border: 1.5px solid #93c5fd; border-radius: 10px; padding: 12px 14px; margin-top: 10px; margin-bottom: 6px;">
        <div style="font-size: 13px; font-weight: 800; color: #1e40af; display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span>📦 ලිහිල් විකිණීම් සැකසුම් (Loose Sale / Packaging Details)</span>
          </div>
          <span style="font-size: 10.5px; font-weight: 700; color: #1e40af; background: #dbeafe; padding: 2px 7px; border-radius: 5px;">Optional</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
          <div class="field" style="margin-bottom:0;">
            <label class="field-label" style="font-size:11.5px; font-weight:700; color:#1e3a8a;">මුළු බෑගයේ / පැකට්ටුවේ ප්‍රමාණය</label>
            <input class="input" id="f_packSize" type="number" min="0.0001" step="any" value="${v.packSize || ''}" placeholder="උදා: 50">
            <div class="small text-muted" style="font-size:10px; margin-top:2px;">උදා: සිමෙන්ති බෑගයකට 50, බටයකට 20</div>
          </div>
          <div class="field" style="margin-bottom:0;">
            <label class="field-label" style="font-size:11.5px; font-weight:700; color:#1e3a8a;">පැකට් මිනුම් ඒකකය</label>
            <select class="input" id="f_packUnit">
              <option value="" ${!v.packUnit ? 'selected' : ''}>-- ඒකකය --</option>
              <option value="kg" ${v.packUnit === 'kg' ? 'selected' : ''}>kg (කිලෝග්‍රෑම්)</option>
              <option value="g" ${v.packUnit === 'g' ? 'selected' : ''}>g (ග්‍රෑම්)</option>
              <option value="ft" ${v.packUnit === 'ft' ? 'selected' : ''}>ft (අඩි)</option>
              <option value="in" ${v.packUnit === 'in' ? 'selected' : ''}>in (අඟල්)</option>
              <option value="m" ${v.packUnit === 'm' ? 'selected' : ''}>m (මීටර්)</option>
              <option value="cm" ${v.packUnit === 'cm' ? 'selected' : ''}>cm (සෙ.මී.)</option>
              <option value="L" ${v.packUnit === 'L' ? 'selected' : ''}>L (ලීටර්)</option>
              <option value="ml" ${v.packUnit === 'ml' ? 'selected' : ''}>ml (මිලිලීටර්)</option>
              <option value="pcs" ${v.packUnit === 'pcs' ? 'selected' : ''}>pcs (කෑලි)</option>
            </select>
            <div class="small text-muted" style="font-size:10px; margin-top:2px;">බෑගයේ ප්‍රමාණයේ ඒකකය</div>
          </div>
          <div class="field" style="margin-bottom:0;">
            <label class="field-label" style="font-size:11.5px; font-weight:700; color:#92400e;">ලිහිල් ඒකක මිල (රු.)</label>
            <input class="input" id="f_loosePrice" type="number" min="0" step="any" value="${v.loosePrice || ''}" placeholder="Auto (හිස්ව තබන්න)">
            <div class="small text-muted" style="font-size:10px; margin-top:2px;">උදා: 1kg = රු.80 (නැතහොත් Auto)</div>
          </div>
        </div>
      </div>
    `;
  },

  bindImageUpload() {
    const fileInput = document.getElementById('f_image_file');
    const hiddenInput = document.getElementById('f_image');
    const previewWrap = document.getElementById('imgPreviewWrap');
    if (!fileInput || !hiddenInput || !previewWrap) return;
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 400;
          let w = img.width, h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
            else { w = Math.round((w * maxDim) / h); h = maxDim; }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const resizedBase64 = canvas.toDataURL('image/jpeg', 0.75);
          hiddenInput.value = resizedBase64;
          previewWrap.innerHTML = `<img id="imgPreview" src="${resizedBase64}" style="width:100%; height:100%; object-fit:cover;">`;
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  },

  bindBarcodeControls(item) {
    const barcodeInp = document.getElementById('f_barcode');
    const genBtn = document.getElementById('btnGenBarcode');
    const camBtn = document.getElementById('btnCamScanBarcode');
    const printBtn = document.getElementById('btnPrintBarcodeModalBtn');
    const previewWrap = document.getElementById('barcodePreviewWrap');

    const updatePreview = () => {
      if (!previewWrap || !barcodeInp) return;
      const code = barcodeInp.value.trim();
      if (code) {
        previewWrap.style.display = 'block';
        previewWrap.innerHTML = `
          <div style="background:#fff; border:1px solid #cbd5e1; border-radius:6px; padding:6px 10px; display:inline-flex; align-items:center; gap:10px; flex-wrap:wrap;">
            ${BarcodeSystem.generateCode128SVG(code, { width: 140, height: 36, fontSize: 10 })}
            <span class="small text-muted" style="font-size:11px;">Scannable Code 128</span>
            <button type="button" class="btn btn-sm btn-outline" id="btnPreviewDlBarcode" title="Download Barcode (PNG)" style="height:28px; padding:2px 8px; font-size:11px; display:inline-flex; align-items:center; gap:4px; margin-left:auto;">
              <i class="ph ph-download-simple"></i> Download
            </button>
          </div>
        `;
        previewWrap.querySelector('#btnPreviewDlBarcode')?.addEventListener('click', (e) => {
          e.preventDefault();
          const itemName = document.getElementById('f_name')?.value || (item && item.name) || 'item';
          BarcodeSystem.downloadBarcodePNG(code, itemName);
          toast("✅ Barcode රූපය බාගත විය!", "ok");
        });
      } else {
        previewWrap.style.display = 'none';
        previewWrap.innerHTML = '';
      }
    };

    if (barcodeInp) {
      barcodeInp.addEventListener('input', updatePreview);
      updatePreview();
    }

    if (genBtn && barcodeInp) {
      genBtn.addEventListener('click', () => {
        const current = barcodeInp.value.trim();
        if (current) {
          confirmAction("දැනටමත් Barcode එකක් ඇත. එය අලුත් Barcode එකකින් වෙනස් කිරීමට අවශ්‍යද?", () => {
            barcodeInp.value = BarcodeSystem.generateBarcode();
            updatePreview();
            BarcodeSystem.playBeep(true);
            toast("නව Barcode එකක් සාදන ලදී!", "ok");
          });
          return;
        }
        barcodeInp.value = BarcodeSystem.generateBarcode();
        updatePreview();
        BarcodeSystem.playBeep(true);
        toast("නව Barcode එකක් සාදන ලදී!", "ok");
      });
    }

    if (camBtn && barcodeInp) {
      camBtn.addEventListener('click', () => {
        BarcodeSystem.openCameraScanner((scanned) => {
          barcodeInp.value = scanned;
          updatePreview();
          toast(`Barcode එක සටහන් විය: ${scanned}`, 'ok');
        });
      });
    }

    if (printBtn && item && item.id) {
      printBtn.addEventListener('click', async () => {
        const currentBarcode = barcodeInp ? barcodeInp.value.trim() : '';
        await BarcodeSystem.openLabelPrintModal(item.id, currentBarcode);
        if (barcodeInp && item.barcode) {
          barcodeInp.value = item.barcode;
          updatePreview();
        }
      });
    }
  },

  openAddModal(initialData = null) {
    openModal({
      title: t('items_add_btn'),
      bodyHTML: Views.items.formHTML(initialData),
      footHTML: `<button class="btn btn-outline" data-close>${t('cancel')}</button><button class="btn btn-primary" id="saveItemBtn">${t('confirm')}</button>`,
      onMount: () => {
        Views.items.bindCategoryCombo();
        Views.items.bindSubCategoryCombo();
        Views.items.bindImageUpload();
        Views.items.bindBarcodeControls(initialData);
        document.getElementById('saveItemBtn').addEventListener('click', async () => {
          const name = document.getElementById('f_name').value.trim();
          const barcode = document.getElementById('f_barcode')?.value.trim() || '';
          const sell = document.getElementById('f_sell').value;
          const qty = document.getElementById('f_qty').value;
          const desc = document.getElementById('f_desc').value.trim();
          const image = document.getElementById('f_image').value;
          const category = document.getElementById('f_category').value.trim() || 'වෙනත්';
          const subCategory = document.getElementById('f_subCategory')?.value.trim() || '';
          if (!name) { toast(t('items_err_name'), 'err'); return; }
          if (sell === '') { toast(t('items_err_sell'), 'err'); return; }
          if (qty === '') { toast(t('items_err_qty'), 'err'); return; }

          if (barcode && DB.data.items.some(i => (i.barcode || '').trim().toLowerCase() === barcode.toLowerCase())) {
            toast(t('barcode_duplicate') || "මෙම Barcode එක දැනටමත් වෙනත් භාණ්ඩයකට පවතී!", 'err');
            return;
          }

          try {
            await DB.addItem({
              name, barcode, category, subCategory,
              unit: document.getElementById('f_unit').value,
              costPrice: document.getElementById('f_cost').value,
              sellPrice: sell, qty: Number(qty) || 0, reorderLevel: document.getElementById('f_reorder').value,
              packSize: Number(document.getElementById('f_packSize')?.value) || 1,
              packUnit: document.getElementById('f_packUnit')?.value || '',
              loosePrice: Number(document.getElementById('f_loosePrice')?.value) || 0,
              description: desc, image: image
            });
            closeModal();
            toast(t('items_added'), 'ok');
            App.render();
          } catch (err) {
            console.error("Failed to add item:", err);
            toast("භාණ්ඩය එකතු කිරීමට නොහැකි විය!", "err");
          }
        });
      }
    });
  },

  bindCategoryCombo() {
    const input = document.getElementById('f_category');
    const arrow = document.getElementById('comboCatArrow');
    const drop = document.getElementById('comboCatDrop');
    if (!input || !arrow || !drop) return;

    // Predefined hardware store categories
    const HARDWARE_CATEGORIES = [
      'යකඩ',
      'ගොඩනැගිලි උපකරණ',
      'විදුලි උපකරණ',
      'සෙවිලි උපකරණ',
      'ගෘහ උපකරණ',
      'පයිප්ප හා සනිටරි',
      'ඇණ හා බෝල්ට්',
      'සායම් හා රසායනික',
      'දැව හා ලෑලි',
      'ජනෙල් හා දොර',
      'ඉදිකිරීම් බඩු',
      'සිමෙන්ති හා වැලි',
      'ගල් හා ඇඹරීම',
      'ආරක්ෂක උපකරණ',
      'මිනුම් උපකරණ',
      'යාන්ත්‍රික උපකරණ',
      'වෙනත්',
    ];

    const dbCats = [...new Set(DB.data.items.map(i => i.category).filter(c => c && c.trim()))];
    // Merge: predefined first, then any extra from DB not already in list
    const allCats = [...new Set([...HARDWARE_CATEGORIES, ...dbCats])];

    function renderOpts(filter) {
      const raw = (filter || '').trim();
      const q = raw.toLowerCase();
      const matched = q ? allCats.filter(c => c.toLowerCase().includes(q)) : allCats;

      let html = matched.map(c =>
        `<div class="combo-opt" data-val="${escapeHTML(c)}">${escapeHTML(c)}</div>`
      ).join('');

      if (raw && !allCats.some(c => c.toLowerCase() === q)) {
        html += `<div class="combo-opt combo-opt-new" data-val="${escapeHTML(raw)}" style="color:var(--orange-dark); font-weight:bold; border-top:1px dashed var(--border);"><i class="ph ph-plus"></i> අලුත් Category ලෙස භාවිත කරන්න: "<b>${escapeHTML(raw)}</b>"</div>`;
      }

      if (!html) {
        html = '<div class="combo-opt combo-no-match">ලැයිස්තුවේ නැත. අලුත් Category නමක් ටයිප් කරන්න.</div>';
      }

      drop.innerHTML = html;
      drop.querySelectorAll('.combo-opt[data-val]').forEach(opt => {
        opt.addEventListener('mousedown', e => { e.preventDefault(); input.value = opt.dataset.val; closeCombo(); });
      });
    }

    function openCombo() {
      renderOpts(input.value);
      drop.classList.add('open');
      arrow.classList.add('open');
    }
    function closeCombo() {
      drop.classList.remove('open');
      arrow.classList.remove('open');
    }
    function toggleCombo() {
      drop.classList.contains('open') ? closeCombo() : openCombo();
    }

    arrow.addEventListener('click', e => { e.stopPropagation(); toggleCombo(); input.focus(); });
    input.addEventListener('focus', () => openCombo());
    input.addEventListener('input', () => renderOpts(input.value));
    document.addEventListener('click', function handler(e) {
      if (!document.getElementById('comboCatWrap')) { document.removeEventListener('click', handler); return; }
      if (!document.getElementById('comboCatWrap').contains(e.target)) closeCombo();
    });
    input.addEventListener('keydown', e => { if (e.key === 'Escape' || e.key === 'Tab') closeCombo(); });

    renderOpts('');
  },

  bindSubCategoryCombo() {
    const catInput = document.getElementById('f_category');
    const input = document.getElementById('f_subCategory');
    const arrow = document.getElementById('comboSubCatArrow');
    const drop = document.getElementById('comboSubCatDrop');
    if (!input || !arrow || !drop) return;

    function getSubCats() {
      const currentCat = (catInput?.value || '').trim();
      return [...new Set(
        DB.data.items
          .filter(i => !currentCat || (i.category || '').trim() === currentCat)
          .map(i => i.subCategory)
          .filter(s => s && s.trim())
      )].sort();
    }

    function renderOpts(filter) {
      const raw = (filter || '').trim();
      const q = raw.toLowerCase();
      const allSubs = getSubCats();
      const matched = q ? allSubs.filter(s => s.toLowerCase().includes(q)) : allSubs;

      let html = matched.map(s =>
        `<div class="combo-opt" data-val="${escapeHTML(s)}">${escapeHTML(s)}</div>`
      ).join('');

      if (raw && !allSubs.some(s => s.toLowerCase() === q)) {
        html += `<div class="combo-opt combo-opt-new" data-val="${escapeHTML(raw)}" style="color:var(--orange-dark); font-weight:bold; border-top:1px dashed var(--border);"><i class="ph ph-plus"></i> අලුත් Sub Category: "<b>${escapeHTML(raw)}</b>"</div>`;
      }

      if (!html) {
        html = `<div class="combo-opt combo-no-match">${getSubCats().length === 0 ? 'Sub category නැත. ටයිප් කරන්න.' : 'ලැයිස්තුවේ නැත.'}</div>`;
      }

      drop.innerHTML = html;
      drop.querySelectorAll('.combo-opt[data-val]').forEach(opt => {
        opt.addEventListener('mousedown', e => { e.preventDefault(); input.value = opt.dataset.val; closeCombo(); });
      });
    }

    function openCombo() { renderOpts(input.value); drop.classList.add('open'); arrow.classList.add('open'); }
    function closeCombo() { drop.classList.remove('open'); arrow.classList.remove('open'); }
    function toggleCombo() { drop.classList.contains('open') ? closeCombo() : openCombo(); }

    arrow.addEventListener('click', e => { e.stopPropagation(); toggleCombo(); input.focus(); });
    input.addEventListener('focus', () => openCombo());
    input.addEventListener('input', () => renderOpts(input.value));
    document.addEventListener('click', function handler(e) {
      if (!document.getElementById('comboSubCatWrap')) { document.removeEventListener('click', handler); return; }
      if (!document.getElementById('comboSubCatWrap').contains(e.target)) closeCombo();
    });
    input.addEventListener('keydown', e => { if (e.key === 'Escape' || e.key === 'Tab') closeCombo(); });

    // When main category changes, reset & re-render sub-category options
    if (catInput) {
      catInput.addEventListener('change', () => { input.value = ''; renderOpts(''); });
      catInput.addEventListener('input', () => { input.value = ''; renderOpts(''); });
    }

    renderOpts('');
  },

  openEditModal(id) {
    const item = DB.getItem(id);
    if (!item) return;
    openModal({
      title: t('items_edit'),
      bodyHTML: Views.items.formHTML(item),
      footHTML: `<button class="btn btn-outline" data-close>${t('cancel')}</button><button class="btn btn-primary" id="saveItemBtn">${t('update')}</button>`,
      onMount: () => {
        Views.items.bindCategoryCombo();
        Views.items.bindSubCategoryCombo();
        Views.items.bindImageUpload();
        Views.items.bindBarcodeControls(item);
        document.getElementById('saveItemBtn').addEventListener('click', async () => {
          const name = document.getElementById('f_name').value.trim();
          const barcode = document.getElementById('f_barcode')?.value.trim() || '';
          if (!name) { toast(t('items_err_name'), 'err'); return; }

          if (barcode && DB.data.items.some(i => i.id !== id && (i.barcode || '').trim().toLowerCase() === barcode.toLowerCase())) {
            toast(t('barcode_duplicate') || "මෙම Barcode එක දැනටමත් වෙනත් භාණ්ඩයකට පවතී!", 'err');
            return;
          }

          try {
            await DB.updateItem(id, {
              name, barcode, category: document.getElementById('f_category').value.trim() || 'වෙනත්',
              subCategory: document.getElementById('f_subCategory')?.value.trim() || '',
              unit: document.getElementById('f_unit').value,
              costPrice: Number(document.getElementById('f_cost').value) || 0,
              sellPrice: Number(document.getElementById('f_sell').value) || 0,
              description: document.getElementById('f_desc').value.trim(),
              image: document.getElementById('f_image').value,
              qty: Number(document.getElementById('f_qty').value) || 0,
              reorderLevel: Number(document.getElementById('f_reorder').value) || 0,
              packSize: Number(document.getElementById('f_packSize')?.value) || 1,
              packUnit: document.getElementById('f_packUnit')?.value || '',
              loosePrice: Number(document.getElementById('f_loosePrice')?.value) || 0
            });
            closeModal();
            toast(t('items_updated'), 'ok');
            App.render();
          } catch (err) {
            console.error("Failed to update item:", err);
            toast("භාණ්ඩය යාවත්කාලීන කිරීමට නොහැකි විය!", "err");
          }
        });
      }
    });
  },

  refreshItemsView() {
    const currentCat = Views.items.selectedCategory || 'all';
    const catSelect = document.getElementById('itemsCategorySelect');
    if (catSelect) catSelect.value = currentCat;

    const groupToggle = document.getElementById('itemsGroupByToggle');
    if (groupToggle) {
      groupToggle.className = `btn btn-sm ${Views.items.groupByCategory ? 'btn-primary' : 'btn-outline'}`;
      groupToggle.innerHTML = `<i class="ph ph-squares-four" style="font-size:16px;"></i> ${Views.items.groupByCategory ? 'කාණ්ඩ අනුව (ක්‍රියාත්මකයි)' : 'කාණ්ඩ අනුව වෙන්කරන්න'}`;
    }

    const wrap = document.getElementById('itemsTableWrap');
    if (wrap) {
      wrap.innerHTML = Views.items.tableHTML();
      Views.items.bindRowActions();
      Views.items.bindCategoryRowClicks();
    }
  },

  bindCategoryRowClicks() {
    document.querySelectorAll('[data-cat-click]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        Views.items.selectedCategory = el.dataset.catClick;
        Views.items.refreshItemsView();
      });
    });
  },

  bind() {
    document.getElementById('addItemBtn')?.addEventListener('click', Views.items.openAddModal);
    const search = document.getElementById('itemsSearch');
    if (search) {
      search.addEventListener('input', () => {
        Views.items.searchQ = search.value;
        document.getElementById('itemsTableWrap').innerHTML = Views.items.tableHTML();
        Views.items.bindRowActions();
        Views.items.bindCategoryRowClicks();
      });
      setTimeout(() => search.focus(), 100);
    }

    const catSelect = document.getElementById('itemsCategorySelect');
    if (catSelect) {
      catSelect.addEventListener('change', (e) => {
        Views.items.selectedCategory = e.target.value;
        Views.items.refreshItemsView();
      });
    }

    const groupToggle = document.getElementById('itemsGroupByToggle');
    if (groupToggle) {
      groupToggle.addEventListener('click', () => {
        Views.items.groupByCategory = !Views.items.groupByCategory;
        Views.items.refreshItemsView();
      });
    }

    Views.items.bindRowActions();
    Views.items.bindCategoryRowClicks();
  },
  bindRowActions() {
    document.querySelectorAll('[data-print-barcode]').forEach(b => {
      b.addEventListener('click', () => BarcodeSystem.openLabelPrintModal(Number(b.dataset.printBarcode)));
    });
    document.querySelectorAll('[data-edit-item]').forEach(b => {
      b.addEventListener('click', () => Views.items.openEditModal(Number(b.dataset.editItem)));
    });
    document.querySelectorAll('[data-del-item]').forEach(b => {
      b.addEventListener('click', () => {
        const id = Number(b.dataset.delItem);
        const item = DB.getItem(id);
        confirmAction(`"${escapeHTML(item.name)}" ${t('items_del_confirm')}`, async () => {
          await DB.deleteItem(id);
          toast(t('items_deleted'), 'ok');
          App.render();
        });
      });
    });
  }
};


/* ================= STOCK REPORT & LOW STOCK ================= */
Views.stock = {
  activeTab: 'items', // 'items' | 'report'
  itemsSearchQ: '',
  reportSearchQ: '',
  filterType: 'all', // 'all' | 'low'
  selectedCategory: 'all',
  groupByCategory: false,
  reportCategory: 'all',

  render() {
    return `
      <div class="page-header" style="margin-bottom: 12px;">
        <div class="page-header-left">
          <i class="ph ph-archive-box page-header-icon"></i>
          <h2 class="page-header-title">තොග කළමනාකරණය (Stock Management)</h2>
        </div>
      </div>

      <div class="tabs-nav mb-20" style="display:flex; gap:10px; margin-bottom:16px; border-bottom:1px solid var(--border); padding-bottom:8px;">
        <button class="btn btn-sm ${Views.stock.activeTab === 'items' ? 'btn-primary' : 'btn-outline'}" id="stockTabItemsBtn">📦 භාණ්ඩ ලැයිස්තුව (Items List)</button>
        <button class="btn btn-sm ${Views.stock.activeTab === 'report' ? 'btn-primary' : 'btn-outline'}" id="stockTabReportBtn">📊 තොග වාර්තාව (Stock Report)</button>
      </div>

      <div id="stockTabContent">
        ${Views.stock.activeTab === 'items' ? Views.stock.itemsTabHTML() : Views.stock.reportTabHTML()}
      </div>
    `;
  },

  itemsTabHTML() {
    const allItems = DB.allItems();
    const categories = [...new Set(allItems.map(i => (i.category || '').trim()).filter(Boolean))].sort();
    
    // Calculate counts per category
    const catCounts = {};
    allItems.forEach(i => {
      const c = (i.category || '').trim() || 'වෙනත්';
      catCounts[c] = (catCounts[c] || 0) + 1;
    });

    const currentCat = Views.stock.selectedCategory || 'all';

    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; gap:12px; flex-wrap:wrap;">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; flex:1;">
          <input class="input" id="itemsSearch" placeholder="🔍 සොයන්න (නම, කාණ්ඩය, barcode...)" style="width:230px" value="${escapeHTML(Views.stock.itemsSearchQ || '')}">
          
          <select class="input" id="itemsCategorySelect" style="width:190px; cursor:pointer;" title="කාණ්ඩය අනුව තෝරන්න">
            <option value="all" ${currentCat === 'all' ? 'selected' : ''}>📁 සියලුම කාණ්ඩ (${allItems.length})</option>
            ${categories.map(c => `<option value="${escapeHTML(c)}" ${currentCat === c ? 'selected' : ''}>📁 ${escapeHTML(c)} (${catCounts[c] || 0})</option>`).join('')}
            ${catCounts['වෙනත්'] ? `<option value="වෙනත්" ${currentCat === 'වෙනත්' ? 'selected' : ''}>🏷️ වෙනත් (${catCounts['වෙනත්']})</option>` : ''}
          </select>

          <button class="btn btn-sm ${Views.stock.groupByCategory ? 'btn-primary' : 'btn-outline'}" id="itemsGroupByToggle" title="කාණ්ඩ අනුව වෙන් කර බලන්න" style="height:36px; padding:0 12px; display:inline-flex; align-items:center; gap:6px;">
            <i class="ph ph-squares-four" style="font-size:16px;"></i> ${Views.stock.groupByCategory ? 'කාණ්ඩ අනුව (ක්‍රියාත්මකයි)' : 'කාණ්ඩ අනුව වෙන්කරන්න'}
          </button>
        </div>

        <button class="btn btn-primary" id="addItemBtn">＋ අලුත් භාණ්ඩයක් එක් කරන්න</button>
      </div>

      <div id="itemsTableWrap">${Views.stock.itemsTableHTML()}</div>
    `;
  },

  reportTabHTML() {
    const allItems = DB.allItems();
    const lowItems = DB.lowStockItems();
    const totalValue = DB.stockValue();
    const categories = [...new Set(allItems.map(i => (i.category || '').trim()).filter(Boolean))].sort();

    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; gap:16px; flex-wrap:wrap;">
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <input class="input" id="stockSearch" placeholder="🔍 සොයන්න (භාණ්ඩයේ නම...)" style="width:230px" value="${escapeHTML(Views.stock.reportSearchQ || '')}">
          <select class="input" id="stockFilter" style="width:180px">
            <option value="all" ${Views.stock.filterType === 'all' ? 'selected' : ''}>සියලුම තොග</option>
            <option value="low" ${Views.stock.filterType === 'low' ? 'selected' : ''}>⚠ අඩු තොග පමණක් (${lowItems.length})</option>
          </select>
          <select class="input" id="stockCategoryFilter" style="width:180px">
            <option value="all" ${(Views.stock.reportCategory || 'all') === 'all' ? 'selected' : ''}>📁 සියලුම කාණ්ඩ</option>
            ${categories.map(c => `<option value="${escapeHTML(c)}" ${(Views.stock.reportCategory || 'all') === c ? 'selected' : ''}>📁 ${escapeHTML(c)}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="grid grid-3 mb-20" style="margin-bottom:16px;">
        <div class="card stat-card">
          <div class="stat-label">මුළු භාණ්ඩ ගණන</div>
          <div class="stat-value">${allItems.length}</div>
          <div class="stat-sub">සියලු භාණ්ඩ වර්ග</div>
        </div>
        <div class="card stat-card accent-danger">
          <div class="stat-label">අඩු තොග සහිත භාණ්ඩ</div>
          <div class="stat-value" style="color:${lowItems.length > 0 ? 'var(--danger)' : 'var(--success)'}">${lowItems.length}</div>
          <div class="stat-sub">Reorder level එකට ළඟින්/පහළින්</div>
        </div>
        <div class="card stat-card accent-success">
          <div class="stat-label">${t('stock_total_val') || 'තොගයේ මුළු වටිනාකම'}</div>
          <div class="stat-value" style="font-size:22px">${fmt(totalValue)}</div>
          <div class="stat-sub">ගැනුම් වටිනාකම එකතුව</div>
        </div>
      </div>

      <div id="stockTableWrap">${Views.stock.reportTableHTML()}</div>
    `;
  },

  itemsTableHTML() {
    let list = DB.allItems();
    const q = (Views.stock.itemsSearchQ || '').trim();
    if (q) {
      list = list.filter(i => Singlish.match(i.name, q) || Singlish.match(i.category || '', q) || Singlish.match(i.subCategory || '', q) || Singlish.match(i.description || '', q) || (i.barcode && i.barcode.toLowerCase().includes(q.toLowerCase())));
    }

    const currentCat = Views.stock.selectedCategory || 'all';
    if (currentCat !== 'all') {
      if (currentCat === 'වෙනත්') {
        list = list.filter(i => !i.category || (i.category || '').trim() === 'වෙනත්' || (i.category || '').trim() === '');
      } else {
        list = list.filter(i => (i.category || '').trim() === currentCat);
      }
    }

    if (!list.length) {
      return `<div class="card"><div class="empty-state"><div class="em-ico"><i class="ph ph-package"></i></div><h3>${t('items_no_items')}</h3><div class="small">${currentCat !== 'all' ? `"${escapeHTML(currentCat)}" කාණ්ඩයේ භාණ්ඩ කිසිවක් නැත.` : t('items_no_items_sub')}</div></div></div>`;
    }

    const renderRow = (i) => {
      const status = i.qty <= 0 ? `<span class="pill pill-danger">${t('status_out')}</span>`
        : i.qty <= i.reorderLevel ? `<span class="pill pill-warn">${t('status_low')}</span>`
          : `<span class="pill pill-ok">${t('status_ok')}</span>`;
      return `
        <tr>
          <td>
            <div style="width:36px; height:36px; border-radius:6px; overflow:hidden; background:var(--paper); display:flex; align-items:center; justify-content:center; border:1px solid var(--border);">
              ${i.image ? `<img src="${i.image}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="ph ph-package" style="font-size:18px;"></i>`}
            </div>
          </td>
          <td>
            <b>${escapeHTML(i.name)}</b>
            ${i.barcode ? `<div style="font-size:11px; font-family:monospace; color:var(--primary); font-weight:700;"><i class="ph ph-barcode"></i> ${escapeHTML(i.barcode)}</div>` : ''}
          </td>
          <td>
            <span class="cat-badge-click" data-cat-click="${escapeHTML(i.category || 'වෙනත්')}" title="මෙම කාණ්ඩය පමණක් බලන්න" style="cursor:pointer; display:inline-flex; align-items:center; gap:4px; font-weight:600; color:var(--primary);">
              <i class="ph ph-folder" style="font-size:13px;"></i> ${escapeHTML(i.category || 'වෙනත්')}
            </span>
            ${i.subCategory ? `<div style="font-size:11px; color:var(--steel); margin-top:2px;">↳ ${escapeHTML(i.subCategory)}</div>` : ''}
          </td>
          <td class="num">${fmt(i.costPrice)}</td>
          <td class="num"><b>${fmt(i.sellPrice)}</b></td>
          <td class="num">${i.qty} ${escapeHTML(i.unit || '')}</td>
          <td>${status}</td>
          <td>
            <button class="icon-btn" data-print-barcode="${i.id}" title="${t('barcode_print_label') || 'Print Barcode'}"><i class="ph ph-barcode"></i></button>
            <button class="icon-btn" data-edit-item="${i.id}" title="${t('items_edit')}"><i class="ph ph-pencil-simple"></i></button>
            <button class="icon-btn" data-del-item="${i.id}" title="${t('delete')}"><i class="ph ph-trash"></i></button>
          </td>
        </tr>
      `;
    };

    // If Group by Category is active:
    if (Views.stock.groupByCategory) {
      const groups = {};
      list.forEach(i => {
        const cat = (i.category || '').trim() || 'වෙනත්';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(i);
      });

      const catKeys = Object.keys(groups).sort();
      return catKeys.map(cat => {
        const catItems = groups[cat];
        const catTotalQty = catItems.reduce((acc, it) => acc + (Number(it.qty) || 0), 0);
        const catTotalVal = catItems.reduce((acc, it) => acc + ((Number(it.costPrice) || 0) * (Number(it.qty) || 0)), 0);

        return `
          <div class="category-group-card" style="margin-bottom:20px; background:var(--card); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
            <div style="background:var(--paper); padding:10px 16px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); flex-wrap:wrap; gap:8px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <i class="ph ph-folder-open" style="font-size:18px; color:var(--primary);"></i>
                <h3 style="margin:0; font-size:15px; font-weight:700; color:var(--charcoal);">${escapeHTML(cat)}</h3>
                <span class="pill pill-ok" style="font-size:11px; padding:1px 8px;">${catItems.length} items</span>
              </div>
              <div style="font-size:12px; color:var(--steel); display:flex; gap:14px;">
                <span>තොග ප්‍රමාණය: <b style="color:var(--charcoal);">${catTotalQty}</b></span>
                <span>තොග වටිනාකම: <b style="color:var(--primary);">${fmt(catTotalVal)}</b></span>
              </div>
            </div>
            <div class="table-wrap" style="border:none; border-radius:0;">
              <table>
                <thead><tr>
                  <th style="width:46px;">Photo</th><th>${t('items_name')}</th><th>${t('items_category')}</th><th class="num">${t('items_cost_price')}</th><th class="num">${t('items_sell_price')}</th>
                  <th class="num">${t('word_qty')}</th><th>${t('items_status')}</th><th></th>
                </tr></thead>
                <tbody>
                  ${catItems.map(renderRow).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
      }).join('');
    }

    // Default single table view:
    return `
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th style="width:46px;">Photo</th><th>${t('items_name')}</th><th>${t('items_category')}</th><th class="num">${t('items_cost_price')}</th><th class="num">${t('items_sell_price')}</th>
            <th class="num">${t('word_qty')}</th><th>${t('items_status')}</th><th></th>
          </tr></thead>
          <tbody>
            ${list.map(renderRow).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  reportTableHTML() {
    let list = DB.allItems();
    const q = (Views.stock.reportSearchQ || '').trim();
    if (q) {
      list = list.filter(i => Singlish.match(i.name || '', q) || Singlish.match(i.category || '', q) || (i.barcode && i.barcode.toLowerCase().includes(q.toLowerCase())));
    }

    if (Views.stock.filterType === 'low') {
      list = list.filter(i => i.qty <= i.reorderLevel).sort((a, b) => a.qty - b.qty);
    }

    const currentRepCat = Views.stock.reportCategory || 'all';
    if (currentRepCat !== 'all') {
      list = list.filter(i => (i.category || '').trim() === currentRepCat);
    }

    if (!list.length) {
      return `<div class="card"><div class="empty-state"><div class="em-ico"><i class="ph ph-archive-box"></i></div><h3>${Views.stock.filterType === 'low' ? 'අඩු තොග සහිත භාණ්ඩ නැත' : t('items_no_items')}</h3></div></div>`;
    }

    return `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th style="width:46px;">Photo</th>
              <th>${t('items_name')}</th>
              <th>${t('items_category')}</th>
              <th class="num">${t('dash_stock')}</th>
              <th>${t('stock_level')}</th>
              <th class="num">${t('dash_reorder')}</th>
              <th class="num">${t('stock_value')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${list.map(i => {
      const isOut = i.qty <= 0;
      const isLow = i.qty <= i.reorderLevel;
      const ratio = i.reorderLevel > 0 ? Math.min(1, i.qty / (i.reorderLevel * 3)) : (i.qty > 0 ? 1 : 0);
      const color = isOut ? 'var(--danger)' : isLow ? 'var(--yellow)' : 'var(--success)';

      const statusTag = isOut
        ? `<span class="pill pill-danger" style="margin-left:6px;">${t('status_out')}</span>`
        : isLow
          ? `<span class="pill pill-warn" style="margin-left:6px;">${t('status_low')}</span>`
          : ``;

      return `
                <tr style="${isOut ? 'background:rgba(239,68,68,0.07); border-left:3px solid var(--danger);' : isLow ? 'background:rgba(245,158,11,0.07); border-left:3px solid var(--yellow);' : ''}">
                  <td>
                    <div style="width:36px; height:36px; border-radius:6px; overflow:hidden; background:var(--paper); display:flex; align-items:center; justify-content:center; border:1px solid var(--border);">
                      ${i.image ? `<img src="${i.image}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="ph ph-package" style="font-size:18px;"></i>`}
                    </div>
                  </td>
                  <td>
                    <b>${escapeHTML(i.name)}</b>${statusTag}
                    ${i.barcode ? `<div style="font-size:11px; font-family:monospace; color:var(--primary); font-weight:700;"><i class="ph ph-barcode"></i> ${escapeHTML(i.barcode)}</div>` : ''}
                  </td>
                  <td class="text-muted">${escapeHTML(i.category)}</td>
                  <td class="num" style="font-weight:700; color:${color}">${i.qty} ${escapeHTML(i.unit)}</td>
                  <td style="min-width:110px"><div class="stock-meter"><div style="width:${ratio * 100}%; background:${color}"></div></div></td>
                  <td class="num text-muted">${i.reorderLevel}</td>
                  <td class="num"><b>${fmt(i.qty * i.costPrice)}</b></td>
                  <td>
                    <button class="btn btn-sm ${isLow ? 'btn-primary' : 'btn-outline'}" data-restock="${i.id}">＋ තොග එකතු කරන්න</button>
                  </td>
                </tr>
              `;
    }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  refreshItemsView() {
    const currentCat = Views.stock.selectedCategory || 'all';
    
    // Update select
    const catSelect = document.getElementById('itemsCategorySelect');
    if (catSelect) catSelect.value = currentCat;

    // Update group toggle button text and style
    const groupToggle = document.getElementById('itemsGroupByToggle');
    if (groupToggle) {
      groupToggle.className = `btn btn-sm ${Views.stock.groupByCategory ? 'btn-primary' : 'btn-outline'}`;
      groupToggle.innerHTML = `<i class="ph ph-squares-four" style="font-size:16px;"></i> ${Views.stock.groupByCategory ? 'කාණ්ඩ අනුව (ක්‍රියාත්මකයි)' : 'කාණ්ඩ අනුව වෙන්කරන්න'}`;
    }

    // Re-render table wrap
    const wrap = document.getElementById('itemsTableWrap');
    if (wrap) {
      wrap.innerHTML = Views.stock.itemsTableHTML();
      Views.stock.bindRowActions();
      Views.stock.bindCategoryRowClicks();
    }
  },

  bindCategoryRowClicks() {
    document.querySelectorAll('[data-cat-click]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        Views.stock.selectedCategory = el.dataset.catClick;
        Views.stock.refreshItemsView();
      });
    });
  },

  bind() {
    const btnItems = document.getElementById('stockTabItemsBtn');
    const btnReport = document.getElementById('stockTabReportBtn');

    if (btnItems) {
      btnItems.addEventListener('click', () => {
        Views.stock.activeTab = 'items';
        App.render();
      });
    }
    if (btnReport) {
      btnReport.addEventListener('click', () => {
        Views.stock.activeTab = 'report';
        App.render();
      });
    }

    if (Views.stock.activeTab === 'items') {
      document.getElementById('addItemBtn')?.addEventListener('click', Views.items.openAddModal);
      const search = document.getElementById('itemsSearch');
      if (search) {
        search.addEventListener('input', () => {
          Views.stock.itemsSearchQ = search.value;
          document.getElementById('itemsTableWrap').innerHTML = Views.stock.itemsTableHTML();
          Views.stock.bindRowActions();
          Views.stock.bindCategoryRowClicks();
        });
        setTimeout(() => search.focus(), 100);
      }

      // Category select dropdown
      const catSelect = document.getElementById('itemsCategorySelect');
      if (catSelect) {
        catSelect.addEventListener('change', (e) => {
          Views.stock.selectedCategory = e.target.value;
          Views.stock.refreshItemsView();
        });
      }

      // Group by Category toggle
      const groupToggle = document.getElementById('itemsGroupByToggle');
      if (groupToggle) {
        groupToggle.addEventListener('click', () => {
          Views.stock.groupByCategory = !Views.stock.groupByCategory;
          Views.stock.refreshItemsView();
        });
      }

      Views.stock.bindCategoryRowClicks();
    } else {
      const search = document.getElementById('stockSearch');
      if (search) {
        search.addEventListener('input', () => {
          Views.stock.reportSearchQ = search.value;
          document.getElementById('stockTableWrap').innerHTML = Views.stock.reportTableHTML();
          Views.stock.bindRowActions();
        });
        setTimeout(() => search.focus(), 100);
      }

      const filter = document.getElementById('stockFilter');
      if (filter) {
        filter.addEventListener('change', (e) => {
          Views.stock.filterType = e.target.value;
          document.getElementById('stockTableWrap').innerHTML = Views.stock.reportTableHTML();
          Views.stock.bindRowActions();
        });
      }

      const catFilter = document.getElementById('stockCategoryFilter');
      if (catFilter) {
        catFilter.addEventListener('change', (e) => {
          Views.stock.reportCategory = e.target.value;
          document.getElementById('stockTableWrap').innerHTML = Views.stock.reportTableHTML();
          Views.stock.bindRowActions();
        });
      }
    }

    Views.stock.bindRowActions();
  },

  bindRowActions() {
    if (Views.stock.activeTab === 'items') {
      document.querySelectorAll('[data-print-barcode]').forEach(b => {
        b.addEventListener('click', () => BarcodeSystem.openLabelPrintModal(Number(b.dataset.printBarcode)));
      });
      document.querySelectorAll('[data-edit-item]').forEach(b => {
        b.addEventListener('click', () => Views.items.openEditModal(Number(b.dataset.editItem)));
      });
      document.querySelectorAll('[data-del-item]').forEach(b => {
        b.addEventListener('click', () => {
          const id = Number(b.dataset.delItem);
          const item = DB.getItem(id);
          confirmAction(`"${escapeHTML(item.name)}" ${t('items_del_confirm')}`, async () => {
            await DB.deleteItem(id);
            toast(t('items_deleted'), 'ok');
            App.render();
          });
        });
      });
    } else {
      document.querySelectorAll('[data-restock]').forEach(b => {
        b.addEventListener('click', () => {
          const id = Number(b.dataset.restock);
          const item = DB.getItem(id);
          if (!item) return;

          openModal({
            title: `"${escapeHTML(item.name)}" ${t('ls_add_stock_title')}`,
            bodyHTML: `
              <div class="field"><label class="field-label">${t('ls_current')}</label><input class="input" value="${item.qty} ${escapeHTML(item.unit)}" disabled></div>
              <div class="field"><label class="field-label">එකතු කරන ප්‍රමාණය (Qty to Add)</label><input class="input" id="restockQty" type="number" min="0.01" step="any" value="10"></div>
            `,
            footHTML: `<button class="btn btn-outline" data-close>${t('cancel')}</button><button class="btn btn-primary" id="restockSaveBtn">${t('ls_add_btn')}</button>`,
            onMount: () => {
              document.getElementById('restockSaveBtn').addEventListener('click', async () => {
                const add = Number(document.getElementById('restockQty').value) || 0;
                if (add <= 0) { toast(t('ls_err_qty'), 'err'); return; }
                try {
                  await DB.updateItem(id, { qty: item.qty + add });
                  closeModal();
                  toast(t('ls_updated'), 'ok');
                  App.render();
                } catch (err) {
                  console.error("Failed to update stock:", err);
                  toast('තොගය යාවත්කාලීන කිරීමට නොහැකි විය!', 'err');
                }
              });
            }
          });
        });
      });
    }
  }
};

/* ================= CUSTOMERS (CREDIT / NAYATA) ================= */
Views.customers = {
  searchQ: '',
  activeTab: 'hardwares', // 'hardwares' | 'retail'

  render() {
    const hardwaresCount = DB.getHardwareCustomers().length;
    const retailCount = DB.getRetailCustomers().length;

    return `
      ${Views.renderPageHeader({
      icon: 'ph-users',
      title: t('cust_title'),
      count: DB.allCustomers().length,
      search: { id: 'custSearch', placeholder: t('search_placeholder'), value: Views.customers.searchQ },
      actions: [{ id: 'addCustBtn', label: t('cust_add_btn'), cls: 'btn-primary' }]
    })}

      <div class="cust-subtabs">
        <button class="cust-tab-btn ${Views.customers.activeTab === 'hardwares' ? 'active' : ''}" data-cust-tab="hardwares">
          <i class="ph ph-buildings"></i> ${t('cust_tab_hardwares')} (${hardwaresCount})
        </button>
        <button class="cust-tab-btn ${Views.customers.activeTab === 'retail' ? 'active' : ''}" data-cust-tab="retail">
          <i class="ph ph-user"></i> ${t('cust_tab_customers')} (${retailCount})
        </button>
      </div>

      <div id="custTableWrap">${Views.customers.tableHTML()}</div>
    `;
  },

  tableHTML() {
    let list = Views.customers.activeTab === 'hardwares' ? DB.getHardwareCustomers() : DB.getRetailCustomers();
    const q = (Views.customers.searchQ || '').trim();
    if (q) list = list.filter(c => Singlish.match(c.name, q) || (c.phone || '').includes(q) || (c.nic || '').toLowerCase().includes(q.toLowerCase()) || Singlish.match(c.address || '', q));
    if (!list.length) return `<div class="card"><div class="empty-state"><div class="em-ico"><i class="ph ph-user"></i></div><h3>${t('cust_no_cust')}</h3><div class="small">${t('cust_no_cust_sub')}</div></div></div>`;
    return `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>${t('cust_name')}</th>
              <th>${t('cust_form_nic')}</th>
              <th>${t('cust_phone')}</th>
              <th>${t('cust_address')}</th>
              ${Views.customers.activeTab === 'hardwares' ? `<th>${t('cust_hardware_discount_badge')}</th>` : ''}
              <th class="num">${t('cust_due')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${list.map(c => `
              <tr>
                <td><b>${escapeHTML(c.name)}</b></td>
                <td>${c.nic ? `<span class="pill pill-outline" style="font-family:monospace; font-weight:600;">🆔 ${escapeHTML(c.nic)}</span>` : '-'}</td>
                <td>${escapeHTML(c.phone) || '-'}</td>
                <td class="text-muted">${escapeHTML(c.address) || '-'}</td>
                ${Views.customers.activeTab === 'hardwares' ? `<td><span class="pill pill-ok">${c.discountPercent || 0}% Discount</span></td>` : ''}
                <td class="num">${c.balance > 0 ? `<span style="color:var(--danger); font-weight:700">${fmt(c.balance)}</span>` : `<span class="pill pill-ok">${t('cust_zero')}</span>`}</td>
                <td>
                  <button class="btn btn-sm btn-outline" data-view-cust="${c.id}">${t('cust_details')}</button>
                  <button class="icon-btn" data-edit-cust="${c.id}" title="${t('items_edit')}"><i class="ph ph-pencil-simple"></i></button>
                  <button class="icon-btn" data-del-cust="${c.id}" title="${t('delete')}"><i class="ph ph-trash"></i></button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  openAddModal() {
    openModal({
      title: t('cust_add_btn'),
      bodyHTML: `
        <div class="field">
          <label class="field-label">${t('cust_form_name')}</label>
          <input class="input" id="c_name" placeholder="${t('cust_form_name_ph')}">
          <div class="field-error-msg" id="c_name_err"></div>
        </div>
        <div class="grid grid-2">
          <div class="field">
            <label class="field-label">${t('cust_form_phone')}</label>
            <input class="input" id="c_phone" placeholder="${t('cust_form_phone_ph')}">
            <div class="field-error-msg" id="c_phone_err"></div>
          </div>
          <div class="field">
            <label class="field-label">${t('cust_form_type')}</label>
            <select class="input" id="c_type">
              <option value="hardware" ${Views.customers.activeTab === 'hardwares' ? 'selected' : ''}>${t('cust_type_hardware')}</option>
              <option value="customer" ${Views.customers.activeTab === 'retail' ? 'selected' : ''}>${t('cust_type_retail')}</option>
            </select>
          </div>
        </div>
        <div class="grid grid-2">
          <div class="field" id="c_discount_wrap">
            <label class="field-label">${t('cust_form_discount')}</label>
            <input class="input" id="c_discount" type="number" min="0" max="100" value="0">
            <div class="field-error-msg" id="c_discount_err"></div>
          </div>
          <div class="field">
            <label class="field-label">${t('cust_form_limit')}</label>
            <input class="input" id="c_limit" type="number" min="0" value="0">
            <div class="field-error-msg" id="c_limit_err"></div>
          </div>
        </div>
        <div class="field"><label class="field-label">${t('cust_form_address')}</label><input class="input" id="c_address"></div>
        <div class="field">
          <label class="field-label">${t('cust_form_nic')}</label>
          <input class="input" id="c_nic" placeholder="e.g. 199012345678 / 901234567V">
          <div class="field-error-msg" id="c_nic_err"></div>
        </div>
      `,
      footHTML: `<button class="btn btn-outline" data-close>${t('cancel')}</button><button class="btn btn-primary" id="saveCustBtn">${t('confirm')}</button>`,
      onMount: (wrap) => {
        const nameInp = wrap.querySelector('#c_name');
        const nameErr = wrap.querySelector('#c_name_err');
        const phoneInp = wrap.querySelector('#c_phone');
        const phoneErr = wrap.querySelector('#c_phone_err');
        const nicInp = wrap.querySelector('#c_nic');
        const nicErr = wrap.querySelector('#c_nic_err');
        const typeSelect = wrap.querySelector('#c_type');
        const discWrap = wrap.querySelector('#c_discount_wrap');
        const discInp = wrap.querySelector('#c_discount');
        const discErr = wrap.querySelector('#c_discount_err');
        const limitInp = wrap.querySelector('#c_limit');
        const limitErr = wrap.querySelector('#c_limit_err');

        const toggleDisc = () => { discWrap.style.display = typeSelect.value === 'hardware' ? 'block' : 'none'; };
        toggleDisc();
        typeSelect.addEventListener('change', toggleDisc);

        // Realtime clear errors & uppercase NIC
        nameInp.addEventListener('input', () => clearInputError(nameInp, nameErr));
        phoneInp.addEventListener('input', () => clearInputError(phoneInp, phoneErr));
        nicInp.addEventListener('input', () => {
          clearInputError(nicInp, nicErr);
          const pos = nicInp.selectionStart;
          nicInp.value = nicInp.value.toUpperCase();
          if (pos !== null) nicInp.setSelectionRange(pos, pos);
        });
        if (discInp) discInp.addEventListener('input', () => clearInputError(discInp, discErr));
        if (limitInp) limitInp.addEventListener('input', () => clearInputError(limitInp, limitErr));

        wrap.querySelector('#saveCustBtn').addEventListener('click', async () => {
          // 1. Validate Name
          const nameVal = Validators.validateName(nameInp.value);
          if (!nameVal.valid) {
            setInputError(nameInp, nameErr, nameVal.error);
            toast(nameVal.error, 'err');
            nameInp.focus();
            return;
          }

          // 2. Validate Phone
          const phoneVal = Validators.validatePhone(phoneInp.value);
          if (!phoneVal.valid) {
            setInputError(phoneInp, phoneErr, phoneVal.error);
            toast(phoneVal.error, 'err');
            phoneInp.focus();
            return;
          }

          // 3. Validate NIC
          const nicVal = Validators.validateNIC(nicInp.value);
          if (!nicVal.valid) {
            setInputError(nicInp, nicErr, nicVal.error);
            toast(nicVal.error, 'err');
            nicInp.focus();
            return;
          }

          // 4. Validate Credit Limit
          const creditLimit = Number(limitInp.value);
          if (isNaN(creditLimit) || creditLimit < 0) {
            setInputError(limitInp, limitErr, t('cust_err_limit'));
            toast(t('cust_err_limit'), 'err');
            limitInp.focus();
            return;
          }

          // 5. Validate Discount
          let discount = 0;
          if (typeSelect.value === 'hardware') {
            discount = Number(discInp?.value) || 0;
            if (discount < 0 || discount > 100) {
              setInputError(discInp, discErr, t('cust_err_discount'));
              toast(t('cust_err_discount'), 'err');
              discInp.focus();
              return;
            }
          }

          await DB.addCustomer({
            name: nameVal.value,
            phone: phoneVal.value,
            nic: nicVal.value,
            address: wrap.querySelector('#c_address').value.trim(),
            creditLimit,
            customerType: typeSelect.value,
            discountPercent: discount
          });

          closeModal();
          toast(t('cust_added'), 'ok');
          App.render();
        });
      }
    });
  },

  openEditModal(id) {
    const c = DB.getCustomer(id);
    if (!c) return;
    openModal({
      title: t('items_edit') + ' - ' + escapeHTML(c.name),
      bodyHTML: `
        <div class="field">
          <label class="field-label">${t('cust_form_name')}</label>
          <input class="input" id="ce_name" value="${escapeHTML(c.name)}" placeholder="${t('cust_form_name_ph')}">
          <div class="field-error-msg" id="ce_name_err"></div>
        </div>
        <div class="grid grid-2">
          <div class="field">
            <label class="field-label">${t('cust_form_phone')}</label>
            <input class="input" id="ce_phone" value="${escapeHTML(c.phone || '')}" placeholder="${t('cust_form_phone_ph')}">
            <div class="field-error-msg" id="ce_phone_err"></div>
          </div>
          <div class="field">
            <label class="field-label">${t('cust_form_type')}</label>
            <select class="input" id="ce_type">
              <option value="hardware" ${c.customerType === 'hardware' ? 'selected' : ''}>${t('cust_type_hardware')}</option>
              <option value="customer" ${c.customerType === 'customer' ? 'selected' : ''}>${t('cust_type_retail')}</option>
            </select>
          </div>
        </div>
        <div class="grid grid-2">
          <div class="field" id="ce_discount_wrap">
            <label class="field-label">${t('cust_form_discount')}</label>
            <input class="input" id="ce_discount" type="number" min="0" max="100" value="${c.discountPercent || 0}">
            <div class="field-error-msg" id="ce_discount_err"></div>
          </div>
          <div class="field">
            <label class="field-label">${t('cust_form_limit')}</label>
            <input class="input" id="ce_limit" type="number" min="0" value="${c.creditLimit || 0}">
            <div class="field-error-msg" id="ce_limit_err"></div>
          </div>
        </div>
        <div class="field"><label class="field-label">${t('cust_form_address')}</label><input class="input" id="ce_address" value="${escapeHTML(c.address || '')}"></div>
        <div class="field">
          <label class="field-label">${t('cust_form_nic')}</label>
          <input class="input" id="ce_nic" value="${escapeHTML(c.nic || '')}" placeholder="e.g. 199012345678 / 901234567V">
          <div class="field-error-msg" id="ce_nic_err"></div>
        </div>
      `,
      footHTML: `<button class="btn btn-outline" data-close>${t('cancel')}</button><button class="btn btn-primary" id="updateCustBtn">${t('confirm')}</button>`,
      onMount: (wrap) => {
        const nameInp = wrap.querySelector('#ce_name');
        const nameErr = wrap.querySelector('#ce_name_err');
        const phoneInp = wrap.querySelector('#ce_phone');
        const phoneErr = wrap.querySelector('#ce_phone_err');
        const nicInp = wrap.querySelector('#ce_nic');
        const nicErr = wrap.querySelector('#ce_nic_err');
        const typeSelect = wrap.querySelector('#ce_type');
        const discWrap = wrap.querySelector('#ce_discount_wrap');
        const discInp = wrap.querySelector('#ce_discount');
        const discErr = wrap.querySelector('#ce_discount_err');
        const limitInp = wrap.querySelector('#ce_limit');
        const limitErr = wrap.querySelector('#ce_limit_err');

        const toggleDisc = () => { discWrap.style.display = typeSelect.value === 'hardware' ? 'block' : 'none'; };
        toggleDisc();
        typeSelect.addEventListener('change', toggleDisc);

        // Realtime clear errors & uppercase NIC
        nameInp.addEventListener('input', () => clearInputError(nameInp, nameErr));
        phoneInp.addEventListener('input', () => clearInputError(phoneInp, phoneErr));
        nicInp.addEventListener('input', () => {
          clearInputError(nicInp, nicErr);
          const pos = nicInp.selectionStart;
          nicInp.value = nicInp.value.toUpperCase();
          if (pos !== null) nicInp.setSelectionRange(pos, pos);
        });
        if (discInp) discInp.addEventListener('input', () => clearInputError(discInp, discErr));
        if (limitInp) limitInp.addEventListener('input', () => clearInputError(limitInp, limitErr));

        wrap.querySelector('#updateCustBtn').addEventListener('click', async () => {
          // 1. Validate Name
          const nameVal = Validators.validateName(nameInp.value);
          if (!nameVal.valid) {
            setInputError(nameInp, nameErr, nameVal.error);
            toast(nameVal.error, 'err');
            nameInp.focus();
            return;
          }

          // 2. Validate Phone
          const phoneVal = Validators.validatePhone(phoneInp.value);
          if (!phoneVal.valid) {
            setInputError(phoneInp, phoneErr, phoneVal.error);
            toast(phoneVal.error, 'err');
            phoneInp.focus();
            return;
          }

          // 3. Validate NIC
          const nicVal = Validators.validateNIC(nicInp.value);
          if (!nicVal.valid) {
            setInputError(nicInp, nicErr, nicVal.error);
            toast(nicVal.error, 'err');
            nicInp.focus();
            return;
          }

          // 4. Validate Credit Limit
          const creditLimit = Number(limitInp.value);
          if (isNaN(creditLimit) || creditLimit < 0) {
            setInputError(limitInp, limitErr, t('cust_err_limit'));
            toast(t('cust_err_limit'), 'err');
            limitInp.focus();
            return;
          }

          // 5. Validate Discount
          let discount = 0;
          if (typeSelect.value === 'hardware') {
            discount = Number(discInp?.value) || 0;
            if (discount < 0 || discount > 100) {
              setInputError(discInp, discErr, t('cust_err_discount'));
              toast(t('cust_err_discount'), 'err');
              discInp.focus();
              return;
            }
          }

          await DB.updateCustomer(id, {
            name: nameVal.value,
            phone: phoneVal.value,
            nic: nicVal.value,
            address: wrap.querySelector('#ce_address').value.trim(),
            creditLimit,
            customerType: typeSelect.value,
            discountPercent: discount
          });

          closeModal();
          toast(currentLang === 'si' ? 'ගනුදෙනුකරු යාවත්කාලීන විය!' : 'Customer updated successfully', 'ok');
          App.render();
        });
      }
    });
  },


  openDetailModal(id) {
    const c = DB.getCustomer(id);
    if (!c) return;
    openModal({
      title: c.name,
      wide: true,
      bodyHTML: `
        <div class="grid grid-2">
          <div>
            <div class="small text-muted">${t('cust_phone')}</div>
            <div style="font-weight:600; margin-bottom:8px;">${escapeHTML(c.phone) || '-'}</div>
            <div class="small text-muted">${t('cust_form_nic')}</div>
            <div style="font-weight:600; margin-bottom:8px;">${escapeHTML(c.nic) || '-'}</div>
            <div class="small text-muted">${t('cust_address')}</div>
            <div style="font-weight:600; margin-bottom:8px;">${escapeHTML(c.address) || '-'}</div>
            <div class="small text-muted">${t('cust_form_type')}</div>
            <div style="font-weight:600;">${c.customerType === 'hardware' ? `${t('cust_type_hardware')} (${c.discountPercent || 0}% discount)` : t('cust_type_retail')}</div>
          </div>
          <div>
            <div class="small text-muted">${t('cust_curr_due')}</div>
            <div style="font-size:22px; font-weight:700; color:${c.balance > 0 ? 'var(--danger)' : 'var(--success)'}">${fmt(c.balance)}</div>
          </div>
        </div>

        <div class="card" style="background:var(--paper); margin-top:16px; box-shadow:none;">
          <div class="card-title">${t('cust_record_payment_title')}</div>
          <div class="flex gap-8" style="align-items:flex-end;">
            <div class="field" style="flex:1; margin-bottom:0;"><label class="field-label">${t('cust_payment_amount')}</label><input class="input" id="paymentAmt" type="number" min="1"></div>
            <button class="btn btn-success" id="recordPaymentBtn">${t('cust_record_payment_btn')}</button>
          </div>
        </div>

        <div class="mt-20">
          <div class="card-title">${t('cust_history')}</div>
          ${c.ledger.length ? `
            <div class="table-wrap">
              <table>
                <thead><tr><th>${t('dash_date')}</th><th>${t('word_type')}</th><th class="num">${t('sale_payment')}</th></tr></thead>
                <tbody>
                  ${c.ledger.map(l => {
        let itemsHtml = '';
        if (l.type === 'sale' && l.saleId) {
          const sale = DB.allSales().find(s => s.id === l.saleId);
          if (sale && sale.lines && sale.lines.length) {
            itemsHtml = `
              <div style="margin-top:6px; padding:6px 10px; background:var(--bg-card, #f8fafc); border:1px solid var(--border); border-radius:6px; font-size:12px;">
                <table style="width:100%; border-collapse:collapse; margin:0;">
                  <tbody>
                    ${sale.lines.map(line => {
                      const lineTotal = line.qty * line.unitPrice;
                      const qtyText = line.looseInfo ? `${line.looseInfo.looseQty} ${escapeHTML(line.looseInfo.looseUnit || '')}` : `${line.qty} ${escapeHTML(line.unit || '')}`;
                      return `
                        <tr style="border-bottom:1px dashed var(--border);">
                          <td style="padding:3px 0; font-weight:600; color:var(--charcoal);">• ${escapeHTML(line.name)}</td>
                          <td style="padding:3px 8px; text-align:center; color:var(--steel); font-size:11px; white-space:nowrap;">${qtyText} × ${fmt(line.unitPrice)}</td>
                          <td style="padding:3px 0; text-align:right; font-weight:700; color:var(--charcoal); white-space:nowrap;">${fmt(lineTotal)}</td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
                ${(sale.discount > 0) ? `
                  <div style="display:flex; justify-content:space-between; margin-top:4px; font-size:11px; color:var(--steel); border-top:1px solid var(--border); padding-top:4px;">
                    <span>Subtotal: ${fmt(sale.subtotal)} | Disc: -${fmt(sale.discount)}</span>
                    <span style="font-weight:700; color:var(--primary-dark);">Total: ${fmt(sale.total)}</span>
                  </div>
                ` : ''}
              </div>
            `;
          }
        }
        return `
                    <tr>
                      <td style="vertical-align:top; padding-top:12px;">${fmtDate(l.date)}</td>
                      <td style="vertical-align:top; padding-top:12px;">
                        ${l.type === 'sale' ? `<span class="pill pill-warn">${t('cust_type_sale')}</span>` : `<span class="pill pill-ok">${t('cust_type_pay')}</span>`} 
                        <span class="small text-muted" style="display:inline-block; margin-left:6px;">${escapeHTML(l.note || '')}</span>
                        ${itemsHtml}
                      </td>
                      <td class="num" style="vertical-align:top; padding-top:12px;">${l.type === 'sale' ? '+' : '-'} ${fmt(l.amount)}</td>
                    </tr>
                    `;
      }).join('')}
                </tbody>
              </table>
            </div>
          ` : `<div class="text-muted small">${t('cust_history_empty')}</div>`}
        </div>
      `,
      footHTML: `<button class="btn btn-outline" data-close>${t('close')}</button>`,
      onMount: () => {
        document.getElementById('recordPaymentBtn').addEventListener('click', async () => {
          const amt = Number(document.getElementById('paymentAmt').value) || 0;
          if (amt <= 0) { toast(t('cust_err_amt'), 'err'); return; }
          await DB.recordPayment(id, amt);
          toast(t('cust_pay_recorded'), 'ok');
          closeModal();
          App.render();
        });
      }
    });
  },

  bind() {
    document.getElementById('addCustBtn').addEventListener('click', Views.customers.openAddModal);

    document.querySelectorAll('[data-cust-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        Views.customers.activeTab = e.currentTarget.dataset.custTab;
        document.querySelectorAll('[data-cust-tab]').forEach(b => b.classList.toggle('active', b === e.currentTarget));
        document.getElementById('custTableWrap').innerHTML = Views.customers.tableHTML();
        Views.customers.bindRowActions();
      });
    });

    const search = document.getElementById('custSearch');
    if (search) {
      search.addEventListener('input', () => {
        Views.customers.searchQ = search.value;
        document.getElementById('custTableWrap').innerHTML = Views.customers.tableHTML();
        Views.customers.bindRowActions();
      });
      setTimeout(() => search.focus(), 100);
    }
    Views.customers.bindRowActions();
  },

  bindRowActions() {
    document.querySelectorAll('[data-view-cust]').forEach(b => {
      b.addEventListener('click', () => Views.customers.openDetailModal(Number(b.dataset.viewCust)));
    });
    document.querySelectorAll('[data-edit-cust]').forEach(b => {
      b.addEventListener('click', () => Views.customers.openEditModal(Number(b.dataset.editCust)));
    });
    document.querySelectorAll('[data-del-cust]').forEach(b => {
      b.addEventListener('click', () => {
        const id = Number(b.dataset.delCust);
        const c = DB.getCustomer(id);
        if (c.balance > 0) { toast(t('cust_err_del_due'), 'err'); return; }
        confirmAction(`"${escapeHTML(c.name)}" ${t('items_del_confirm')}`, async () => {
          await DB.deleteCustomer(id);
          toast(t('items_deleted'), 'ok');
          App.render();
        });
      });
    });
  }
};

/* ================= SALES HISTORY ================= */
Views.history = {
  filterType: 'all',
  searchQ: '',
  filterDate: '',
  render() {
    return `
      <div class="page-header">
        <div class="page-header-left">
          <i class="ph ph-clock-counter-clockwise page-header-icon"></i>
          <h2 class="page-header-title">${t('hist_title')}</h2>
        </div>
        <div class="page-header-right" style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <input class="input" id="historySearch" placeholder="🔍 බිල් No / පාරිභෝගිකයා / බඩු..." style="width:230px" value="${escapeHTML(Views.history.searchQ || '')}">
          <input class="input" id="historyDateFilter" type="date" style="width:150px" value="${escapeHTML(Views.history.filterDate || '')}" title="දිනයෙන් පෙරන්න">
          <select class="input" id="histFilter" style="width:140px">
            <option value="all" ${Views.history.filterType === 'all' ? 'selected' : ''}>${t('hist_filter_all')}</option>
            <option value="cash" ${Views.history.filterType === 'cash' ? 'selected' : ''}>${t('hist_filter_cash')}</option>
            <option value="credit" ${Views.history.filterType === 'credit' ? 'selected' : ''}>${t('hist_filter_credit')}</option>
          </select>
          <button class="btn btn-danger btn-sm" id="clearAllSalesBtn" title="${t('hist_clear_all_btn')}" style="padding:7px 12px; font-size:13px; display:inline-flex; align-items:center; gap:6px; white-space:nowrap;">
            <i class="ph ph-trash" style="font-size:16px;"></i> ${t('hist_clear_all_btn')}
          </button>
        </div>
      </div>
      <div id="histTableWrap">${Views.history.tableHTML()}</div>
    `;
  },
  tableHTML() {
    let sales = DB.allSales();
    
    // Filter by type
    if (Views.history.filterType !== 'all') {
      sales = sales.filter(s => s.paymentType === Views.history.filterType);
    }
    
    // Filter by date picker
    const filterDate = Views.history.filterDate;
    if (filterDate) {
      sales = sales.filter(s => {
        const d = new Date(s.date);
        const ymd = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        return ymd === filterDate;
      });
    }

    // Filter by search query (which includes searching by date formats!)
    const q = (Views.history.searchQ || '').trim();
    if (q) {
      sales = sales.filter(s => {
        const idStr = String(s.id);
        const billCode = (s.barcode || ('bill-' + s.id)).toLowerCase();
        const custName = (s.customerName || '').toLowerCase();
        const itemsStr = s.lines.map(l => l.name).join(' ').toLowerCase();
        
        // Date formats to match
        const d = new Date(s.date);
        const ymd = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        const dmy = String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth()+1).padStart(2, '0') + '/' + d.getFullYear();
        const formattedDate = fmtDate(s.date);
        
        return idStr.includes(q) ||
          billCode.includes(q.toLowerCase()) ||
          custName.includes(q.toLowerCase()) ||
          itemsStr.includes(q.toLowerCase()) ||
          Singlish.match(s.customerName || '', q) ||
          ymd.includes(q) ||
          dmy.includes(q) ||
          formattedDate.toLowerCase().includes(q.toLowerCase());
      });
    }

    if (!sales.length) return `<div class="card"><div class="empty-state"><div class="em-ico"><i class="ph ph-receipt"></i></div><h3>${t('hist_no_sales')}</h3></div></div>`;
    return `
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>${t('dash_date')}</th><th>${t('hist_items')}</th><th>${t('sale_payment')}</th><th class="num">${t('sale_total')}</th><th></th></tr></thead>
          <tbody>
            ${sales.map(s => `
              <tr data-sale-row="${s.id}" style="cursor:pointer;" title="${t('hist_preview')}">
                <td>#${s.id}</td>
                <td>${fmtDate(s.date)}</td>
                <td class="small">${s.lines.map(l => escapeHTML(l.name) + ' ' + (l.looseInfo ? `[${l.looseInfo.shortText}]` : 'x' + l.qty)).join(', ')}</td>
                <td>${s.paymentType === 'credit' ? `<span class="pill pill-warn">${t('word_credit')}</span> <span class="small text-muted">${escapeHTML(s.customerName)}</span>` : `<span class="pill pill-ok">${t('word_cash')}</span>`}</td>
                <td class="num" style="font-weight:700">${fmt(s.total)}</td>
                <td style="white-space:nowrap;">
                  <button class="icon-btn" data-view-sale="${s.id}" title="${t('hist_preview')}" style="color:var(--primary); margin-right:4px;"><i class="ph ph-eye" style="font-size:18px;"></i></button>
                  <button class="icon-btn" data-del-sale="${s.id}" title="${t('hist_del_title')}"><i class="ph ph-trash" style="font-size:18px;"></i></button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },
  bind() {
    const search = document.getElementById('historySearch');
    if (search) {
      search.addEventListener('input', () => {
        Views.history.searchQ = search.value;
        document.getElementById('histTableWrap').innerHTML = Views.history.tableHTML();
        Views.history.bindRowActions();
      });
      search.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const q = search.value.trim();
          const sale = DB.findSaleByBarcode ? DB.findSaleByBarcode(q) : null;
          if (sale) {
            Views.sale.showReceipt(sale);
            return;
          }
          const firstViewBtn = document.querySelector('#histTableWrap [data-view-sale]');
          if (firstViewBtn) firstViewBtn.click();
        }
      });
    }

    const dateFilter = document.getElementById('historyDateFilter');
    if (dateFilter) {
      dateFilter.addEventListener('input', () => {
        Views.history.filterDate = dateFilter.value;
        document.getElementById('histTableWrap').innerHTML = Views.history.tableHTML();
        Views.history.bindRowActions();
      });
    }

    document.getElementById('histFilter').addEventListener('change', (e) => {
      Views.history.filterType = e.target.value;
      document.getElementById('histTableWrap').innerHTML = Views.history.tableHTML();
      Views.history.bindRowActions();
    });

    const clearBtn = document.getElementById('clearAllSalesBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        const count = DB.allSales().length;
        if (count === 0) {
          toast(currentLang === 'si' ? 'මකා දැමීමට බිල්පත් නැත!' : 'No bills to clear!', 'err');
          return;
        }
        confirmAction(t('hist_clear_all_confirm'), async () => {
          await DB.clearAllSales(true);
          toast(t('hist_clear_all_success'), 'ok');
          document.getElementById('histTableWrap').innerHTML = Views.history.tableHTML();
          Views.history.bindRowActions();
          App.updateSidebarCounts();
          if (typeof App.render === 'function') App.render();
        });
      });
    }

    Views.history.bindRowActions();
  },
  bindRowActions() {
    document.querySelectorAll('[data-view-sale]').forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = Number(b.dataset.viewSale);
        const sale = DB.allSales().find(s => s.id === id);
        if (sale) Views.sale.showReceipt(sale);
      });
    });

    document.querySelectorAll('tr[data-sale-row]').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('[data-del-sale]') || e.target.closest('[data-view-sale]')) return;
        const id = Number(row.dataset.saleRow);
        const sale = DB.allSales().find(s => s.id === id);
        if (sale) Views.sale.showReceipt(sale);
      });
    });

    document.querySelectorAll('[data-del-sale]').forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = Number(b.dataset.delSale);
        confirmAction(t('hist_del_confirm'), async () => {
          await DB.deleteSale(id);
          toast(t('hist_deleted'), 'ok');
          document.getElementById('histTableWrap').innerHTML = Views.history.tableHTML();
          Views.history.bindRowActions();
          App.updateSidebarCounts();
        });
      });
    });
  }
};

/* ================= SETTINGS ================= */
Views.settings = {
  render() {
    const s = DB.data.settings || {};
    const logoSize = Number(s.logoSize) || 38;
    const fontSize = Number(s.fontSize) || 15;
    const hasLogo = Boolean(s.logo);

    return `
      ${Views.renderPageHeader({
        icon: 'ph-gear',
        title: t('settings_title')
      })}

      <div class="grid grid-2">
        <div class="card">
          <div class="card-title">${t('settings_shop_details')}</div>
          <div class="field mt-14">
            <label class="field-label">${t('settings_shop_name')}</label>
            <input class="input" id="shopNameInput" value="${escapeHTML(s.shopName || '')}">
          </div>

          <div class="field mt-14">
            <label class="field-label">${t('settings_shop_description')}</label>
            <textarea class="input" id="shopDescInput" rows="3" placeholder="${t('settings_shop_description_ph')}" style="resize:vertical; min-height:64px; line-height:1.5;">${escapeHTML(s.shopDescription || '')}</textarea>
            <div class="card-sub" style="font-size:11px; margin-top:4px;">${currentLang === 'si' ? 'Invoice / Receipt eke pennaui' : 'This will appear on the printed Invoice / Receipt'}</div>
          </div>

          <div style="border-top: 1px solid var(--border); margin-top: 18px; padding-top: 16px;">
            <div class="card-title">${t('settings_logo_title')}</div>
            <div class="field mt-14">
              <label class="field-label">${t('settings_logo_upload')}</label>
              <input type="file" id="logoFileInput" accept="image/*" class="input">
            </div>

            <div id="logoPreviewWrap" class="mt-14" style="display: ${hasLogo ? 'flex' : 'none'}; align-items: center; gap: 14px; background: var(--paper); padding: 12px; border-radius: 8px;">
              <img id="settingsLogoPreview" src="${s.logo || ''}" alt="Logo Preview" style="height: ${logoSize}px; max-height: 120px; object-fit: contain; border-radius: 6px;">
              <button class="btn btn-danger" id="removeLogoBtn" style="font-size: 12px; padding: 6px 12px;">${t('settings_logo_remove')}</button>
            </div>

            <div class="field mt-14">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <label class="field-label" style="margin-bottom: 0;">${t('settings_logo_size')}</label>
                <span id="logoSizeVal" class="pill" style="font-weight: 700;">${logoSize}px</span>
              </div>
              <input type="range" id="logoSizeRange" min="20" max="160" step="2" value="${logoSize}" style="width: 100%; cursor: pointer;">
            </div>
          </div>

          <div style="border-top: 1px solid var(--border); margin-top: 18px; padding-top: 16px;">
            <div class="card-title">${t('settings_font_size')}</div>
            <div class="card-sub" style="font-size: 12px; margin-bottom: 10px; color: var(--steel);">${t('settings_font_size_desc')}</div>
            <div class="field mt-14">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <label class="field-label" style="margin-bottom: 0;">${t('settings_font_size')}</label>
                <span id="fontSizeVal" class="pill" style="font-weight: 700;">${fontSize}px</span>
              </div>
              <input type="range" id="fontSizeRange" min="12" max="22" step="1" value="${fontSize}" style="width: 100%; cursor: pointer;">
            </div>
          </div>

          <div style="border-top: 1px solid var(--border); margin-top: 18px; padding-top: 16px;">
            <div class="card-title">${t('settings_default_disc_type')}</div>
            <div class="card-sub" style="font-size: 12px; margin-bottom: 10px; color: var(--steel);">${t('settings_default_disc_type_desc')}</div>
            <div class="field mt-14">
              <select class="input" id="defaultDiscTypeSelect">
                <option value="unit" ${(s.defaultDiscType || 'unit') === 'unit' ? 'selected' : ''}>${t('disc_type_unit')}</option>
                <option value="line" ${s.defaultDiscType === 'line' ? 'selected' : ''}>${t('disc_type_line')}</option>
              </select>
            </div>
          </div>

          <button class="btn btn-primary mt-18" id="saveShopDetailsBtn">${t('save')}</button>
        </div>

        <div class="card">
          <div class="card-title">${t('settings_backup_title')}</div>
          <div class="card-sub">${t('settings_backup_sub')}</div>
          <button class="btn btn-outline btn-block" id="exportBtn">${t('settings_export_btn')}</button>
          <div class="mt-14">
            <label class="field-label">${t('settings_restore_lbl')}</label>
            <input type="file" id="importFile" accept=".json" class="input">
          </div>
          <div class="mt-20" style="border-top:1px solid var(--border); padding-top:14px;">
            <button class="btn btn-danger btn-block" id="wipeBtn">${t('settings_wipe_btn')}</button>
          </div>
        </div>
      </div>

      <div class="card mt-20" style="max-width:420px">
        <div class="card-title">${currentLang === 'si' ? 'භාෂාව / Language' : 'Language / භාෂාව'}</div>
        <div class="card-sub" style="margin-bottom:14px">${currentLang === 'si' ? 'අදාල භාෂාව තෝරන්න' : 'Select your preferred language'}</div>
        <div style="display:flex; gap:10px;">
          <button class="btn ${currentLang === 'si' ? 'btn-primary' : 'btn-outline'}" id="langSiBtn" style="flex:1; font-size:14px;">
            ${currentLang === 'si' ? '✓ ' : ''}සිංහල
          </button>
          <button class="btn ${currentLang === 'en' ? 'btn-primary' : 'btn-outline'}" id="langEnBtn" style="flex:1; font-size:14px;">
            ${currentLang === 'en' ? '✓ ' : ''}English
          </button>
        </div>
      </div>
    `;
  },
  bind() {
    let currentLogoBase64 = DB.data.settings.logo || '';

    // Logo Upload
    const logoFileInput = document.getElementById('logoFileInput');
    const logoPreviewWrap = document.getElementById('logoPreviewWrap');
    const settingsLogoPreview = document.getElementById('settingsLogoPreview');
    const removeLogoBtn = document.getElementById('removeLogoBtn');

    if (logoFileInput) {
      logoFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          currentLogoBase64 = ev.target.result;
          if (settingsLogoPreview) settingsLogoPreview.src = currentLogoBase64;
          if (logoPreviewWrap) logoPreviewWrap.style.display = 'flex';
          
          DB.data.settings.logo = currentLogoBase64;
          App.applySettings();
        };
        reader.readAsDataURL(file);
      });
    }

    if (removeLogoBtn) {
      removeLogoBtn.addEventListener('click', async () => {
        currentLogoBase64 = '';
        if (logoPreviewWrap) logoPreviewWrap.style.display = 'none';
        if (logoFileInput) logoFileInput.value = '';
        DB.data.settings.logo = '';
        App.applySettings();
        await DB.updateSettings({ logo: '' });
        toast(t('settings_saved'), 'ok');
      });
    }

    // Logo Size Slider
    const logoSizeRange = document.getElementById('logoSizeRange');
    const logoSizeVal = document.getElementById('logoSizeVal');
    if (logoSizeRange) {
      logoSizeRange.addEventListener('input', (e) => {
        const val = Number(e.target.value) || 38;
        if (logoSizeVal) logoSizeVal.textContent = val + 'px';
        if (settingsLogoPreview) settingsLogoPreview.style.height = val + 'px';
        DB.data.settings.logoSize = val;
        App.applySettings();
      });
      logoSizeRange.addEventListener('change', async (e) => {
        const val = Number(e.target.value) || 38;
        await DB.updateSettings({ logoSize: val });
      });
    }

    // Font Size Slider
    const fontSizeRange = document.getElementById('fontSizeRange');
    const fontSizeVal = document.getElementById('fontSizeVal');
    if (fontSizeRange) {
      fontSizeRange.addEventListener('input', (e) => {
        const val = Number(e.target.value) || 15;
        if (fontSizeVal) fontSizeVal.textContent = val + 'px';
        DB.data.settings.fontSize = val;
        App.applySettings();
      });
      fontSizeRange.addEventListener('change', async (e) => {
        const val = Number(e.target.value) || 15;
        await DB.updateSettings({ fontSize: val });
      });
    }

    // Save Shop Details & Logo Button
    const saveShopDetailsBtn = document.getElementById('saveShopDetailsBtn');
    if (saveShopDetailsBtn) {
      saveShopDetailsBtn.addEventListener('click', async () => {
        const shopName = document.getElementById('shopNameInput').value.trim() || 'රත්න හාඩ්වෙයාර්';
        const shopDescription = document.getElementById('shopDescInput')?.value.trim() || '';
        const logoSize = Number(document.getElementById('logoSizeRange')?.value) || 38;
        const fontSize = Number(document.getElementById('fontSizeRange')?.value) || 15;
        
        await DB.updateSettings({
          shopName,
          shopDescription,
          logo: currentLogoBase64,
          logoSize,
          fontSize
        });
        App.applySettings();
        toast(t('settings_saved'), 'ok');
      });
    }

    // Backup & Restore & Language
    document.getElementById('exportBtn')?.addEventListener('click', async () => {
      const blob = new Blob([JSON.stringify(await DB.exportJSON(), null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const d = new Date().toISOString().slice(0, 10);
      a.href = url; a.download = `hardwarepos-backup-${d}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast(t('settings_backup_dl'), 'ok');
    });

    document.getElementById('importFile')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        confirmAction(t('settings_restore_confirm'), async () => {
          try {
            await DB.importJSON(ev.target.result);
            toast(t('settings_restore_ok'), 'ok');
            App.render();
          } catch (err) {
            toast(t('settings_restore_err'), 'err');
          }
        });
      };
      reader.readAsText(file);
    });

    document.getElementById('wipeBtn')?.addEventListener('click', () => {
      confirmAction(t('settings_wipe_confirm'), async () => {
        await DB.wipeAll();
        toast(t('settings_wiped'), 'ok');
        App.render();
      });
    });

    document.getElementById('langSiBtn')?.addEventListener('click', () => setLanguage('si'));
    document.getElementById('langEnBtn')?.addEventListener('click', () => setLanguage('en'));
  }
};

/* ================= PURCHASES (කඩේට ගත් බිල්පත්) ================= */
Views.purchases = {
  searchQ: '',
  filterStatus: 'all', // 'all' | 'due' | 'paid'
  filterDate: '',

  render() {
    const purchases = DB.allPurchases();
    const totalAmount = purchases.reduce((s, p) => s + (p.totalAmount || 0), 0);
    const totalDue = purchases.reduce((s, p) => s + (p.dueAmount || 0), 0);
    const dueCount = purchases.filter(p => (p.dueAmount || 0) > 0).length;

    return `
      <div class="page-header">
        <div class="page-header-left">
          <i class="ph ph-truck page-header-icon"></i>
          <h2 class="page-header-title">කඩේට ගත් බිල්පත් කළමනාකරණය <span class="page-header-count">${purchases.length}</span></h2>
        </div>
        <div class="page-header-right">
          <input class="input" id="purchasesSearch" placeholder="🔍 සැපයුම්කරු / බිල් No..." style="width:220px" value="${escapeHTML(Views.purchases.searchQ)}">
          <input class="input" id="purchasesDateFilter" type="date" style="width:150px" value="${escapeHTML(Views.purchases.filterDate || '')}" title="දිනයෙන් පෙරන්න">
          <select class="input" id="purchasesStatusFilter" style="width:150px">
            <option value="all" ${Views.purchases.filterStatus === 'all' ? 'selected' : ''}>සියලු බිල්පත්</option>
            <option value="due" ${Views.purchases.filterStatus === 'due' ? 'selected' : ''}>ගෙවීමට ඇති බිල්</option>
            <option value="paid" ${Views.purchases.filterStatus === 'paid' ? 'selected' : ''}>සම්පූර්ණ ගෙවූ බිල්</option>
          </select>
          <button class="btn btn-primary" id="addPurchaseBtn">＋ අලුත් බිලක් එක් කරන්න</button>
        </div>
      </div>

      <div class="grid grid-3 mb-20" style="margin-bottom:16px;">
        <div class="card stat-card">
          <div class="stat-label">මුළු ගත් බිල්පත් ගණන</div>
          <div class="stat-value">${purchases.length}</div>
          <div class="stat-sub">සැපයුම්කරුවන්ගේ බිල්පත්</div>
        </div>
        <div class="card stat-card accent-success">
          <div class="stat-label">මුළු ගත් බිල්පත් වටිනාකම</div>
          <div class="stat-value" style="font-size:22px">${fmt(totalAmount)}</div>
          <div class="stat-sub">සියලු බිල්පත් මුදල</div>
        </div>
        <div class="card stat-card accent-orange">
          <div class="stat-label">සැපයුම්කරුවන්ට ගෙවීමට ඇති හිඟ මුදල</div>
          <div class="stat-value" style="font-size:22px; color:var(--danger);">${fmt(totalDue)}</div>
          <div class="stat-sub">${dueCount} ක් ගෙවීමට ඇත</div>
        </div>
      </div>

      <div id="purchasesTableWrap">${Views.purchases.tableHTML()}</div>
    `;
  },

  viewImageModal(imgSrc, titleText) {
    if (!imgSrc) return;
    openModal({
      title: `📷 ${escapeHTML(titleText || 'බිල්පතේ ඡායාරූපය')}`,
      wide: true,
      bodyHTML: `
        <div style="text-align:center; background:#0e1117; padding:16px; border-radius:8px; overflow:auto; max-height:75vh;">
          <img src="${imgSrc}" style="max-width:100%; height:auto; border-radius:4px; box-shadow:0 4px 12px rgba(0,0,0,0.5);">
        </div>
      `,
      footHTML: `<button class="btn btn-outline" data-close>වහන්න (Close)</button>`
    });
  },

  tableHTML() {
    let list = DB.allPurchases();
    
    // Filter by date picker
    const filterDate = Views.purchases.filterDate;
    if (filterDate) {
      list = list.filter(p => {
        const d = new Date(p.date);
        const ymd = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        return ymd === filterDate;
      });
    }

    const q = (Views.purchases.searchQ || '').trim();
    if (q) {
      list = list.filter(p => {
        const d = new Date(p.date);
        const ymd = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        const dmy = String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth()+1).padStart(2, '0') + '/' + d.getFullYear();
        const formattedDate = fmtDate(p.date);
        
        return Singlish.match(p.supplierName || '', q) ||
          (p.billNo || '').toLowerCase().includes(q.toLowerCase()) ||
          Singlish.match(p.note || '', q) ||
          ymd.includes(q) ||
          dmy.includes(q) ||
          formattedDate.toLowerCase().includes(q.toLowerCase());
      });
    }
    if (Views.purchases.filterStatus === 'due') {
      list = list.filter(p => (p.dueAmount || 0) > 0);
    } else if (Views.purchases.filterStatus === 'paid') {
      list = list.filter(p => (p.dueAmount || 0) <= 0);
    }

    if (!list.length) return `<div class="card"><div class="empty-state"><div class="em-ico"><i class="ph ph-truck"></i></div><h3>කඩේට ගත් බිල්පත් නැත</h3><div class="small">"+ අලුත් බිලක් එක් කරන්න" ක්ලික් කරන්න</div></div></div>`;

    return `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th># / දිනය</th>
              <th>ඡායාරූපය</th>
              <th>සැපයුම්කරු (Supplier)</th>
              <th>බිල් No</th>
              <th>භාණ්ඩ විස්තරය</th>
              <th class="num">මුළු මුදල</th>
              <th class="num">ගෙවූ මුදල</th>
              <th class="num">හිඟ මුදල</th>
              <th>තත්ත්වය</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${list.map(p => {
      const statusBadge = (p.dueAmount || 0) <= 0
        ? `<span class="pill pill-ok">සම්පූර්ණ ගෙවා ඇත</span>`
        : (p.paidAmount || 0) > 0
          ? `<span class="pill pill-warn">කොටසක් ගෙවා ඇත</span>`
          : `<span class="pill pill-danger">හිඟ ඇත</span>`;

      const itemsText = Array.isArray(p.items) && p.items.length
        ? p.items.map(i => `${escapeHTML(i.name)} (${i.qty} ${escapeHTML(i.unit || '')})`).join(', ')
        : '-';

      return `
                <tr>
                  <td><b>#${p.id}</b><br><span class="small text-muted">${fmtDate(p.date)}</span></td>
                  <td>
                    ${p.image ? `
                      <div data-view-bill-img="${p.id}" style="width:38px; height:38px; border-radius:6px; overflow:hidden; cursor:pointer; border:1px solid var(--border); background:#f0f0f0; display:flex; align-items:center; justify-content:center;" title="බිල්පතේ Photo එක බලන්න">
                        <img src="${p.image}" style="width:100%; height:100%; object-fit:cover;">
                      </div>
                    ` : `<span class="text-muted small">-</span>`}
                  </td>
                  <td><b>${escapeHTML(p.supplierName || 'වෙනත්')}</b></td>
                  <td>${escapeHTML(p.billNo || '-')}</td>
                  <td class="small" style="max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${escapeHTML(itemsText)}">${itemsText}</td>
                  <td class="num"><b>${fmt(p.totalAmount)}</b></td>
                  <td class="num text-muted">${fmt(p.paidAmount)}</td>
                  <td class="num">${p.dueAmount > 0 ? `<span style="color:var(--danger); font-weight:700;">${fmt(p.dueAmount)}</span>` : `<span class="pill pill-ok">රු. 0.00</span>`}</td>
                  <td>${statusBadge}</td>
                  <td>
                    ${p.image ? `<button class="btn btn-sm btn-outline" data-view-bill-img="${p.id}"><i class="ph ph-image"></i> 📷 Photo</button>` : ''}
                    <button class="btn btn-sm btn-outline" data-view-purchase="${p.id}">👁 විස්තර / ගෙවීම්</button>
                    <button class="icon-btn" data-del-purchase="${p.id}" title="මකන්න"><i class="ph ph-trash"></i></button>
                  </td>
                </tr>
              `;
    }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  openAddPurchaseModal() {
    let purchaseItems = [];
    const existingItems = DB.allItems();

    function renderModalItemsHTML() {
      if (!purchaseItems.length) {
        return `<div class="text-muted small" style="padding:10px 0; text-align:center;">භාණ්ඩ එකතු කර නැත. පහතින් එකතු කරන්න.</div>`;
      }
      return `
        <table class="table" style="font-size:12px; margin-bottom:8px; width:100%;">
          <thead>
            <tr>
              <th>භාණ්ඩය</th>
              <th style="width:70px;">ප්‍රමාණය</th>
              <th style="width:90px;">ඒකක මිල</th>
              <th class="num" style="width:90px;">එකතුව</th>
              <th style="width:30px;"></th>
            </tr>
          </thead>
          <tbody>
            ${purchaseItems.map((item, idx) => `
              <tr>
                <td><b>${escapeHTML(item.name)}</b></td>
                <td>${item.qty} ${escapeHTML(item.unit || '')}</td>
                <td>${fmt(item.costPrice)}</td>
                <td class="num"><b>${fmt(item.qty * item.costPrice)}</b></td>
                <td><button type="button" class="icon-btn" data-remove-pitem="${idx}">&times;</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    function calcModalTotal() {
      return purchaseItems.reduce((s, i) => s + (i.qty * i.costPrice), 0);
    }

    openModal({
      title: "＋ කඩේට ගත් අලුත් බිලක් එකතු කරන්න",
      wide: true,
      bodyHTML: `
        <div class="grid grid-3">
          <div class="field">
            <label class="field-label">සැපයුම්කරු / සමාගමේ නම (Supplier)</label>
            <input class="input" id="pb_supplier" placeholder="උදා: DSI, Tokyo Cement, S-Lon">
          </div>
          <div class="field">
            <label class="field-label">බිල් අංකය (Invoice / Bill No)</label>
            <input class="input" id="pb_billNo" placeholder="උදා: INV-1042">
          </div>
          <div class="field">
            <label class="field-label">දිනය</label>
            <input class="input" id="pb_date" type="date" value="${new Date().toISOString().slice(0, 10)}">
          </div>
        </div>

        <div class="card" style="background:var(--paper); padding:12px; margin-bottom:14px; box-shadow:none;">
          <div class="card-title" style="font-size:13px; margin-bottom:8px;"><i class="ph ph-package"></i> ගත් භාණ්ඩ ලැයිස්තුව</div>
          <div id="modalItemsTableWrap">${renderModalItemsHTML()}</div>

          <div style="background:#fff; border:1px solid var(--border); border-radius:8px; padding:8px; margin-top:8px;">
            <div class="grid grid-4" style="gap:8px; align-items:flex-end;">
              <div class="field" style="margin:0; grid-column:span 2;">
                <label class="field-label" style="font-size:11px;">භාණ්ඩය තෝරන්න හෝ නම ටයිප් කරන්න</label>
                <input class="input" id="pi_name" placeholder="භාණ්ඩයේ නම..." list="existingItemsList">
                <datalist id="existingItemsList">
                  ${existingItems.map(i => `<option value="${escapeHTML(i.name)}">${escapeHTML(i.category || '')}</option>`).join('')}
                </datalist>
              </div>
              <div class="field" style="margin:0;">
                <label class="field-label" style="font-size:11px;">ප්‍රමාණය (Qty)</label>
                <input class="input" id="pi_qty" type="number" step="any" min="0.01" value="1">
              </div>
              <div class="field" style="margin:0;">
                <label class="field-label" style="font-size:11px;">ගැනුම් මිල (Unit Cost)</label>
                <input class="input" id="pi_cost" type="number" step="any" min="0" placeholder="0.00">
              </div>
            </div>
            <button type="button" class="btn btn-sm btn-outline mt-8" id="addPItemBtn" style="width:100%;">＋ භාණ්ඩය ලැයිස්තුවට එකතු කරන්න</button>
          </div>
        </div>

        <div class="grid grid-2">
          <div class="field">
            <label class="field-label">මුළු බිල්පත් වටිනාකම (රු.)</label>
            <input class="input" id="pb_total" type="number" step="any" min="0" placeholder="0.00" style="font-weight:700; font-size:16px;">
          </div>
          <div class="field">
            <label class="field-label">අද ගෙවූ මුදල (Amount Paid, රු.)</label>
            <input class="input" id="pb_paid" type="number" step="any" min="0" placeholder="0.00" style="font-weight:700; font-size:16px;">
          </div>
        </div>

        <div class="field" style="margin-top:14px;">
          <label class="field-label">📷 බිල්පතේ ඡායාරූපය (Bill Image / Photo)</label>
          <div style="background:var(--paper); padding:12px; border-radius:8px; border:1px solid var(--border);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
              <div style="display:flex; gap:8px; align-items:center;">
                <label for="pb_image_file" class="btn btn-sm btn-outline" style="cursor:pointer; display:inline-flex; align-items:center; gap:6px; margin:0;">
                  <i class="ph ph-image"></i> 📁 Photo එකක් තෝරන්න
                </label>
                <input type="file" id="pb_image_file" accept="image/*" style="display:none;">
                <input type="hidden" id="pb_image_data" value="">
                <button type="button" class="btn btn-sm btn-outline danger" id="pb_remove_img_btn" style="display:none;"><i class="ph ph-trash"></i> ✕ ඉවත් කරන්න</button>
              </div>
              <button type="button" class="btn btn-sm btn-outline" id="pb_zoom_preview_btn" style="display:none; font-size:11px;"><i class="ph ph-magnifying-glass-plus"></i> 🔍 විශාල කර බලන්න</button>
            </div>

            <!-- Live Preview Box -->
            <div id="pb_img_preview_box" style="display:none; text-align:center; background:#000; border-radius:8px; overflow:hidden; border:1px solid var(--border); max-height:220px; cursor:pointer;" title="විශාල කර බලන්න">
              <img id="pb_img_preview_el" src="" style="max-width:100%; max-height:220px; object-fit:contain; margin:0 auto; display:block;">
            </div>
            
            <div id="pb_img_hint" class="small text-muted" style="margin-top:6px;">සැපයුම්කරු දුන් බිල්පතේ / ලැබීම් සටහනේ Photo එකක් තෝරාගත් විට මෙහි Preview එක පෙනෙනු ඇත.</div>
          </div>
        </div>

        <div class="field" style="margin-top:10px;">
          <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-weight:600;">
            <input type="checkbox" id="pb_autoStock" checked>
            <span>☑ මෙම භාණ්ඩ කඩේ තොගයට (Stock Qty) ස්වයංක්‍රීයව එකතු කරන්න</span>
          </label>
        </div>

        <div class="field">
          <label class="field-label">විස්තර / සටහන් (Notes)</label>
          <textarea class="input" id="pb_note" placeholder="අමතර විස්තර..." style="min-height:45px;"></textarea>
        </div>
      `,
      footHTML: `<button class="btn btn-outline" data-close>${t('cancel')}</button><button class="btn btn-primary" id="savePurchaseBtn">✔ බිල සුරකින්න</button>`,
      onMount: (wrap) => {
        const totalInp = wrap.querySelector('#pb_total');
        const paidInp = wrap.querySelector('#pb_paid');
        const nameInp = wrap.querySelector('#pi_name');
        const qtyInp = wrap.querySelector('#pi_qty');
        const costInp = wrap.querySelector('#pi_cost');

        const fileInput = wrap.querySelector('#pb_image_file');
        const hiddenImgInput = wrap.querySelector('#pb_image_data');
        const previewBox = wrap.querySelector('#pb_img_preview_box');
        const previewImgEl = wrap.querySelector('#pb_img_preview_el');
        const removeBtn = wrap.querySelector('#pb_remove_img_btn');
        const zoomBtn = wrap.querySelector('#pb_zoom_preview_btn');
        const hintEl = wrap.querySelector('#pb_img_hint');

        if (fileInput) {
          fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
              const img = new Image();
              img.onload = () => {
                const maxDim = 1200;
                let w = img.width, h = img.height;
                if (w > maxDim || h > maxDim) {
                  if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
                  else { w = Math.round((w * maxDim) / h); h = maxDim; }
                }
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                const resizedBase64 = canvas.toDataURL('image/jpeg', 0.8);
                hiddenImgInput.value = resizedBase64;
                
                previewImgEl.src = resizedBase64;
                previewBox.style.display = 'block';
                removeBtn.style.display = 'inline-flex';
                zoomBtn.style.display = 'inline-flex';
                if (hintEl) hintEl.textContent = 'ඡායාරූපය සාර්ථකව තෝරා ගන්නා ලදී. (Preview එක මත ක්ලික් කිරීමෙන් විශාල කර බැලිය හැක)';
              };
              img.src = e.target.result;
            };
            reader.readAsDataURL(file);
          });
        }

        const openAddZoom = () => {
          if (hiddenImgInput.value) {
            Views.purchases.viewImageModal(hiddenImgInput.value, 'බිල්පතේ ඡායාරූපය Preview');
          }
        };
        zoomBtn?.addEventListener('click', openAddZoom);
        previewBox?.addEventListener('click', openAddZoom);

        if (removeBtn) {
          removeBtn.addEventListener('click', () => {
            fileInput.value = '';
            hiddenImgInput.value = '';
            previewImgEl.src = '';
            previewBox.style.display = 'none';
            removeBtn.style.display = 'none';
            zoomBtn.style.display = 'none';
            if (hintEl) hintEl.textContent = 'සැපයුම්කරු දුන් බිල්පතේ / ලැබීම් සටහනේ Photo එකක් තෝරාගත් විට මෙහි Preview එක පෙනෙනු ඇත.';
          });
        }

        nameInp.addEventListener('change', () => {
          const val = nameInp.value.trim();
          const match = existingItems.find(i => i.name.toLowerCase() === val.toLowerCase());
          if (match && match.costPrice) {
            costInp.value = match.costPrice;
          }
        });

        function updateModalItemsList() {
          wrap.querySelector('#modalItemsTableWrap').innerHTML = renderModalItemsHTML();
          const calculatedTotal = calcModalTotal();
          if (calculatedTotal > 0) {
            totalInp.value = calculatedTotal;
            paidInp.value = calculatedTotal;
          }
          wrap.querySelectorAll('[data-remove-pitem]').forEach(btn => {
            btn.addEventListener('click', (e) => {
              const idx = Number(e.currentTarget.dataset.removePitem);
              purchaseItems.splice(idx, 1);
              updateModalItemsList();
            });
          });
        }

        wrap.querySelector('#addPItemBtn').addEventListener('click', () => {
          const name = nameInp.value.trim();
          const qty = Number(qtyInp.value) || 0;
          const cost = Number(costInp.value) || 0;
          if (!name) { toast('කරුණාකර භාණ්ඩයේ නම ඇතුළත් කරන්න', 'err'); return; }
          if (qty <= 0) { toast('ප්‍රමාණය 0 ට වැඩි විය යුතුය', 'err'); return; }

          const matchedItem = existingItems.find(i => i.name.toLowerCase() === name.toLowerCase());

          purchaseItems.push({
            itemId: matchedItem ? matchedItem.id : null,
            name,
            qty,
            unit: matchedItem ? matchedItem.unit : 'pcs',
            costPrice: cost
          });

          nameInp.value = '';
          qtyInp.value = '1';
          costInp.value = '';
          updateModalItemsList();
        });

        wrap.querySelector('#savePurchaseBtn').addEventListener('click', async () => {
          const supplierName = wrap.querySelector('#pb_supplier').value.trim();
          const billNo = wrap.querySelector('#pb_billNo').value.trim();
          const dateStr = wrap.querySelector('#pb_date').value;
          const totalAmount = Number(totalInp.value) || calcModalTotal() || 0;
          const paidAmount = Number(paidInp.value) || 0;
          const autoUpdateStock = wrap.querySelector('#pb_autoStock').checked;
          const note = wrap.querySelector('#pb_note').value.trim();
          const image = hiddenImgInput ? hiddenImgInput.value : '';

          if (!supplierName && !billNo && !purchaseItems.length && !image) {
            toast('කරුණාකර සැපයුම්කරුගේ නම, බිල් අංකය හෝ බිල්පතේ Photo එකක් ඇතුළත් කරන්න', 'err');
            return;
          }

          try {
            await DB.addPurchase({
              supplierName: supplierName || 'වෙනත් සැපයුම්කරු',
              billNo,
              date: dateStr ? new Date(dateStr).getTime() : Date.now(),
              items: purchaseItems,
              totalAmount,
              paidAmount,
              autoUpdateStock,
              note,
              image
            });
            closeModal();
            toast('කඩේට ගත් බිල සාර්ථකව සුරකින ලදී!', 'ok');
            App.render();
          } catch (err) {
            console.error("Failed to add purchase:", err);
            toast('බිල සුරැකීමට නොහැකි විය!', 'err');
          }
        });
      }
    });
  },

  openDetailModal(id) {
    const p = DB.getPurchase(id);
    if (!p) return;
    const due = p.dueAmount || 0;

    openModal({
      title: `ගත් බිල #${p.id} — ${escapeHTML(p.supplierName)}`,
      wide: true,
      bodyHTML: `
        <div class="grid grid-3 mb-14">
          <div>
            <div class="small text-muted">සැපයුම්කරු (Supplier)</div>
            <div style="font-weight:700; font-size:16px;">${escapeHTML(p.supplierName)}</div>
          </div>
          <div>
            <div class="small text-muted">බිල් අංකය (Invoice No)</div>
            <div style="font-weight:600;">${escapeHTML(p.billNo || '-')}</div>
          </div>
          <div>
            <div class="small text-muted">දිනය</div>
            <div style="font-weight:600;">${fmtDate(p.date)}</div>
          </div>
        </div>

        <div class="grid grid-3 mb-14" style="background:var(--paper); padding:10px; border-radius:8px;">
          <div>
            <div class="small text-muted">මුළු බිල්පත් වටිනාකම</div>
            <div style="font-weight:700; font-size:16px;">${fmt(p.totalAmount)}</div>
          </div>
          <div>
            <div class="small text-muted">ගෙවූ මුදල</div>
            <div style="font-weight:700; font-size:16px; color:var(--success);">${fmt(p.paidAmount)}</div>
          </div>
          <div>
            <div class="small text-muted">හිඟ මුදල (Due Amount)</div>
            <div style="font-weight:700; font-size:16px; color:${due > 0 ? 'var(--danger)' : 'var(--success)'}">${fmt(due)}</div>
          </div>
        </div>

        <div class="card mb-14" style="background:var(--paper); padding:12px; box-shadow:none; border:1px solid var(--border);">
          <div class="card-title" style="font-size:13px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
            <span><i class="ph ph-image"></i> බිල්පතේ ඡායාරූපය (Bill Photo)</span>
            <div style="display:flex; gap:6px;">
              ${p.image ? `
                <button class="btn btn-sm btn-outline" id="btnZoomBillImg" style="font-size:11px;"><i class="ph ph-magnifying-glass-plus"></i> විශාල කර බලන්න</button>
                <label for="detailBillImgFile" class="btn btn-sm btn-outline" style="font-size:11px; cursor:pointer; margin:0;"><i class="ph ph-pencil-simple"></i> වෙනස් කරන්න</label>
                <button class="btn btn-sm btn-outline danger" id="btnRemoveDetailBillImg" style="font-size:11px;"><i class="ph ph-trash"></i> මකන්න</button>
              ` : `
                <label for="detailBillImgFile" class="btn btn-sm btn-outline" style="font-size:11px; cursor:pointer; margin:0;"><i class="ph ph-plus"></i> 📷 Photo එකක් එකතු කරන්න</label>
              `}
              <input type="file" id="detailBillImgFile" accept="image/*" style="display:none;">
            </div>
          </div>
          ${p.image ? `
            <div style="max-height:260px; overflow:hidden; border-radius:8px; border:1px solid var(--border); text-align:center; background:#000; cursor:pointer;" id="imgBillContainer" title="විශාල කර බලන්න">
              <img src="${p.image}" style="max-width:100%; max-height:260px; object-fit:contain;">
            </div>
          ` : `
            <div style="text-align:center; padding:16px; border:2px dashed var(--border); border-radius:8px; background:#fff; color:var(--text-muted);">
              <div>මෙම බිල සඳහා තවම ඡායාරූපයක් (Photo) එකතු කර නැත.</div>
              <label for="detailBillImgFile" class="btn btn-sm btn-outline mt-8" style="cursor:pointer; display:inline-block;"><i class="ph ph-image"></i> 📁 Photo එකක් තෝරන්න</label>
            </div>
          `}
        </div>

        ${Array.isArray(p.items) && p.items.length ? `
          <div class="card-title mt-14" style="font-size:13px;"><i class="ph ph-package"></i> ගත් භාණ්ඩ විස්තරය</div>
          <div class="table-wrap mb-14" style="margin-top:6px;">
            <table>
              <thead>
                <tr>
                  <th>භාණ්ඩය</th>
                  <th class="num">ප්‍රමාණය</th>
                  <th class="num">ඒකක ගැනුම් මිල</th>
                  <th class="num">එකතුව</th>
                </tr>
              </thead>
              <tbody>
                ${p.items.map(i => `
                  <tr>
                    <td><b>${escapeHTML(i.name)}</b></td>
                    <td class="num">${i.qty} ${escapeHTML(i.unit || '')}</td>
                    <td class="num">${fmt(i.costPrice)}</td>
                    <td class="num"><b>${fmt(i.qty * i.costPrice)}</b></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ``}

        ${p.note ? `
          <div class="mb-14">
            <div class="small text-muted">සටහන්:</div>
            <div style="font-style:italic;">${escapeHTML(p.note)}</div>
          </div>
        ` : ``}

        ${due > 0 ? `
          <div class="card" style="background:var(--paper); box-shadow:none; border:1px solid var(--orange);">
            <div class="card-title" style="color:var(--orange-dark);">💰 සැපයුම්කරුට මුදල් ගෙවීම සටහන් කරන්න</div>
            <div class="flex gap-8 mt-8" style="align-items:flex-end;">
              <div class="field" style="flex:1; margin-bottom:0;">
                <label class="field-label">ගෙවන මුදල (රු.)</label>
                <input class="input" id="pPayAmt" type="number" step="any" min="1" max="${due}" value="${due}">
              </div>
              <button class="btn btn-success" id="recordPPayBtn">✔ ගෙවීම සටහන් කරන්න</button>
            </div>
          </div>
        ` : `<div class="pill pill-ok" style="display:inline-block; margin-top:8px;">✅ මෙම බිල සඳහා සම්පූර්ණයෙන්ම ගෙවා ඇත.</div>`}
      `,
      footHTML: `<button class="btn btn-outline" data-close>${t('close')}</button>`,
      onMount: (wrap) => {
        if (p.image) {
          const openZoom = () => Views.purchases.viewImageModal(p.image, `${p.supplierName} - ${p.billNo || 'බිල්පත'}`);
          wrap.querySelector('#btnZoomBillImg')?.addEventListener('click', openZoom);
          wrap.querySelector('#imgBillContainer')?.addEventListener('click', openZoom);
        }

        const fileInp = wrap.querySelector('#detailBillImgFile');
        if (fileInp) {
          fileInp.addEventListener('change', () => {
            const file = fileInp.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
              const img = new Image();
              img.onload = async () => {
                const maxDim = 1200;
                let w = img.width, h = img.height;
                if (w > maxDim || h > maxDim) {
                  if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
                  else { w = Math.round((w * maxDim) / h); h = maxDim; }
                }
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                const resizedBase64 = canvas.toDataURL('image/jpeg', 0.8);
                try {
                  await DB.updatePurchase(id, { image: resizedBase64 });
                  toast('බිල්පතේ ඡායාරූපය සාර්ථකව යාවත්කාලීන විය!', 'ok');
                  closeModal();
                  Views.purchases.openDetailModal(id);
                  App.render();
                } catch (err) {
                  toast('ඡායාරූපය සුරැකීමට නොහැකි විය!', 'err');
                }
              };
              img.src = e.target.result;
            };
            reader.readAsDataURL(file);
          });
        }

        const removeImgBtn = wrap.querySelector('#btnRemoveDetailBillImg');
        if (removeImgBtn) {
          removeImgBtn.addEventListener('click', () => {
            confirmAction('මෙම බිල්පතේ ඡායාරූපය ඉවත් කිරීමට තහවුරු කරන්නද?', async () => {
              try {
                await DB.updatePurchase(id, { image: '' });
                toast('ඡායාරූපය ඉවත් කරන ලදී', 'ok');
                closeModal();
                Views.purchases.openDetailModal(id);
                App.render();
              } catch (err) {
                toast('ඡායාරූපය ඉවත් කිරීමට නොහැකි විය!', 'err');
              }
            });
          });
        }

        const payBtn = wrap.querySelector('#recordPPayBtn');
        if (payBtn) {
          payBtn.addEventListener('click', async () => {
            const amt = Number(wrap.querySelector('#pPayAmt').value) || 0;
            if (amt <= 0) { toast('කරුණාකර නිවැරදි මුදලක් ඇතුළත් කරන්න', 'err'); return; }
            try {
              await DB.recordPurchasePayment(id, amt);
              toast('ගෙවීම සාර්ථකව සටහන් විය!', 'ok');
              closeModal();
              App.render();
            } catch (err) {
              console.error("Failed to record payment:", err);
              toast('ගෙවීම සටහන් කිරීමට නොහැකි විය!', 'err');
            }
          });
        }
      }
    });
  },

  bind() {
    document.getElementById('addPurchaseBtn')?.addEventListener('click', Views.purchases.openAddPurchaseModal);

    const search = document.getElementById('purchasesSearch');
    if (search) {
      search.addEventListener('input', () => {
        Views.purchases.searchQ = search.value;
        document.getElementById('purchasesTableWrap').innerHTML = Views.purchases.tableHTML();
        Views.purchases.bindRowActions();
      });
    }

    const dateFilter = document.getElementById('purchasesDateFilter');
    if (dateFilter) {
      dateFilter.addEventListener('input', () => {
        Views.purchases.filterDate = dateFilter.value;
        document.getElementById('purchasesTableWrap').innerHTML = Views.purchases.tableHTML();
        Views.purchases.bindRowActions();
      });
    }

    const statusFilter = document.getElementById('purchasesStatusFilter');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        Views.purchases.filterStatus = e.target.value;
        document.getElementById('purchasesTableWrap').innerHTML = Views.purchases.tableHTML();
        Views.purchases.bindRowActions();
      });
    }

    Views.purchases.bindRowActions();
  },

  bindRowActions() {
    document.querySelectorAll('[data-view-bill-img]').forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = Number(b.dataset.viewBillImg);
        const p = DB.getPurchase(id);
        if (p && p.image) {
          Views.purchases.viewImageModal(p.image, `${p.supplierName} - ${p.billNo || 'බිල්පත'}`);
        }
      });
    });

    document.querySelectorAll('[data-view-purchase]').forEach(b => {
      b.addEventListener('click', () => Views.purchases.openDetailModal(Number(b.dataset.viewPurchase)));
    });

    document.querySelectorAll('[data-del-purchase]').forEach(b => {
      b.addEventListener('click', () => {
        const id = Number(b.dataset.delPurchase);
        confirmAction('මෙම ගත් බිල පද්ධතියෙන් ඉවත් කිරීමට තහවුරු කරන්නද?', async () => {
          try {
            await DB.deletePurchase(id);
            toast('ගත් බිල ඉවත් කරන ලදී', 'ok');
            App.render();
          } catch (err) {
            console.error("Failed to delete purchase:", err);
            toast('ඉවත් කිරීමට නොහැකි විය', 'err');
          }
        });
      });
    });
  }
};

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
          <div style="position:relative;">
            <input class="input" id="saleSearch" placeholder="${t('sale_search_placeholder')}" autocomplete="off">
            <div id="saleSuggest" style="position:absolute; z-index:10; width:100%; top:100%;"></div>
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
          <div class="cart-list-wrap" id="cartBox" style="padding:0; flex:1; min-height:0;">${Views.sale.cartHTML()}</div>

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

          <!-- Amount Paid & Change Due for Cash -->
          <div class="field" id="amountPaidWrap" style="display:${Views.sale.payType === 'cash' ? 'block' : 'none'}; margin-bottom:4px;">
            <label class="field-label" style="margin-bottom:2px; font-size:12px;">${t('sale_amount_paid')}</label>
            <input class="input" id="saleAmountPaid" type="number" min="0" step="any" placeholder="0.00" value="${Views.sale.amountPaid || ''}" style="height:36px; padding:6px 10px; font-size:15px;">
            <div id="changeDueWrap" class="change-due-box" style="display:${(Number(Views.sale.amountPaid) > 0) ? 'flex' : 'none'}; margin-top:4px; padding:6px 10px;">
              <span style="font-size:13px;">${t('sale_change_due')}</span>
              <span id="changeDueAmount" style="font-size:15px; font-weight:700;">${fmt(Math.max(0, (Number(Views.sale.amountPaid) || 0) - Views.sale.calcTotal()))}</span>
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
      items = items.filter(i => Singlish.match(i.name, q) || Singlish.match(i.category || '', q) || Singlish.match(i.description || '', q));
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
    const d = Number(l.discount) || 0;
    if (!d) return 0;
    const type = l.discountType || (DB.data.settings && DB.data.settings.defaultDiscType) || 'unit';
    if (type === 'line') return d;
    return Math.round(d * (Number(l.qty) || 1) * 100) / 100;
  },

  cartHTML() {
    if (!cart.length) return `<div class="empty-state" style="padding:20px 10px"><div class="em-ico"><i class="ph ph-shopping-cart"></i></div><h3>${t('sale_empty_cart')}</h3><div class="small">${t('sale_empty_cart_sub')}</div></div>`;
    return cart.map((l, idx) => {
      const lineDisc = Views.sale.calcLineDiscount(l);
      const lineTotal = Math.max(0, l.qty * l.unitPrice - lineDisc);
      const isPerUnit = (l.discountType || (DB.data.settings && DB.data.settings.defaultDiscType) || 'unit') === 'unit';
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
            </div>
            <button class="icon-btn" data-remove-idx="${idx}" title="${t('delete')}" style="font-size:16px; padding:2px 6px; border:none; background:none; color:var(--steel); cursor:pointer;">✕</button>
          </div>
          <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
            <div style="display:flex; align-items:center; gap:4px; flex-wrap:wrap;">
              <span style="font-size:11px; font-weight:700; color:var(--steel);">QTY</span>
              <input type="number" min="0.0001" step="any" max="${l.maxQty}" value="${l.qty}" data-qty-idx="${idx}" class="input" style="width:65px; height:32px; padding:4px 6px; font-size:14px; text-align:center;" title="Quantity">
              
              <span style="font-size:11px; font-weight:700; color:var(--steel); margin-left:4px;">DISC</span>
              <div style="display:inline-flex; align-items:center;">
                <input type="number" min="0" step="any" placeholder="0" value="${l.discount || ''}" data-discount-idx="${idx}" class="input" style="width:60px; height:32px; padding:4px 6px; font-size:14px; text-align:center; border-top-right-radius:0; border-bottom-right-radius:0;" title="Discount">
                <button type="button" class="btn-disc-toggle" data-disc-type-toggle="${idx}" title="${isPerUnit ? 'එකකට Discount: Rs ' + (l.discount||0) + ' x ' + l.qty + ' QTY = ' + fmt(lineDisc) + ' (Click to switch to Total Line Discount)' : 'මුළු බිලටම Fixed Discount: ' + fmt(lineDisc) + ' (Click to switch to Per Unit Discount)'}" style="height:32px; padding:0 6px; font-size:11px; font-weight:700; border:1px solid var(--border); border-left:none; border-top-right-radius:6px; border-bottom-right-radius:6px; background:${isPerUnit ? 'var(--primary-light, #e0f2fe)' : '#f1f5f9'}; color:${isPerUnit ? 'var(--primary, #0284c7)' : '#475569'}; cursor:pointer; white-space:nowrap;">
                  ${isPerUnit ? '/එකකට' : '/මුළු'}
                </button>
              </div>

              <!-- LOOSE CALCULATOR BUTTON RIGHT NEXT TO DISCOUNT -->
              <button type="button" class="btn-loose-toggle" data-loose-idx="${idx}" title="ලිහිල් විකිණීම සහ මිනුම් පරිවර්තනය (kg, g, අඟල්, අඩි, L, ml, pcs...)" style="height:32px; padding:0 8px; font-size:11.5px; font-weight:700; border:1px solid ${l.looseInfo ? '#f59e0b' : 'var(--border)'}; border-radius:6px; background:${l.looseInfo ? '#fef3c7' : '#f8fafc'}; color:${l.looseInfo ? '#b45309' : '#334155'}; cursor:pointer; display:inline-flex; align-items:center; gap:3px; white-space:nowrap; transition:all 0.15s ease;">
                <span>⚖️</span>
                <span>${l.looseInfo ? escapeHTML(l.looseInfo.shortText || 'ලිහිල්') : 'ලිහිල්'}</span>
              </button>
            </div>
            <div style="text-align:right;">
              <div class="cart-row-price" style="font-size:16px; font-weight:700; color:var(--primary-dark);">
                ${fmt(lineTotal)}
              </div>
              ${(l.discount > 0 && isPerUnit && l.qty > 1) ? `<div style="font-size:10.5px; color:var(--success); font-weight:600;">(-${fmt(lineDisc)})</div>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  calcSubtotal() {
    return cart.reduce((s, l) => s + l.qty * l.unitPrice, 0);
  },

  calcItemDiscounts() {
    return cart.reduce((s, l) => s + Views.sale.calcLineDiscount(l), 0);
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
    const paid = Number(document.getElementById('saleAmountPaid')?.value) || Number(Views.sale.amountPaid) || 0;
    Views.sale.amountPaid = paid > 0 ? paid : '';
    const total = Views.sale.calcTotal();
    const change = Math.max(0, paid - total);
    const wrap = document.getElementById('changeDueWrap');
    const amtEl = document.getElementById('changeDueAmount');
    if (wrap && amtEl) {
      wrap.style.display = paid > 0 ? 'flex' : 'none';
      amtEl.textContent = fmt(change);
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
        v = Math.max(0.0001, Math.min(v, cart[idx].maxQty));
        v = Math.round(v * 10000) / 10000;
        cart[idx].qty = v;
        Views.sale.refreshCart();
        Views.sale.applyCustomerHardwareDiscount();
      });
    });
    document.querySelectorAll('[data-discount-idx]').forEach(inp => {
      inp.addEventListener('change', (e) => {
        const idx = Number(e.target.dataset.discountIdx);
        let v = Number(e.target.value) || 0;
        v = Math.max(0, v);
        cart[idx].discount = v;
        Views.sale.refreshCart();
      });
    });
    document.querySelectorAll('[data-disc-type-toggle]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = Number(e.currentTarget.dataset.discTypeToggle);
        const currType = cart[idx].discountType || (DB.data.settings && DB.data.settings.defaultDiscType) || 'unit';
        cart[idx].discountType = currType === 'line' ? 'unit' : 'line';
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

    // Arrow keys navigation between Cart rows and fields below Total
    document.querySelectorAll('[data-qty-idx], [data-discount-idx]').forEach(inp => {
      inp.addEventListener('focus', (e) => {
        if (typeof e.target.select === 'function') e.target.select();
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
            // From last item in cart -> move down to Cash/Credit selector
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
          } else if (idx === cart.length - 1) {
            // From last item's discount field -> move to Cash/Credit selector
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
          }
        } else if (e.key === 'ArrowLeft' && !isQty) {
          e.preventDefault();
          const qtyInp = document.querySelector(`[data-qty-idx="${idx}"]`);
          if (qtyInp) {
            qtyInp.focus();
            if (typeof qtyInp.select === 'function') qtyInp.select();
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
  },

  bind() {
    const searchInp = document.getElementById('saleSearch');
    const suggestBox = document.getElementById('saleSuggest');
    let selectedIndex = -1;

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
        const matches = DB.allItems().filter(i => Singlish.match(i.name, q) || Singlish.match(i.category || '', q) || Singlish.match(i.description || '', q)).slice(0, 8);
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
                <div class="s-meta">${escapeHTML(i.category)} • ${t('word_qty')}: ${i.qty} ${escapeHTML(i.unit)} • ${t('items_cost_price')}: ${fmt(i.costPrice || 0)}</div>
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

        if (e.key === 'ArrowDown') {
          if (rows.length > 0) {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % rows.length;
            updateSelection();
          } else {
            const firstQty = document.querySelector('[data-qty-idx="0"]');
            if (firstQty) {
              e.preventDefault();
              firstQty.focus();
              if (typeof firstQty.select === 'function') firstQty.select();
            }
          }
        } else if (e.key === 'ArrowUp') {
          if (!rows.length) return;
          e.preventDefault();
          selectedIndex = selectedIndex - 1;
          if (selectedIndex < 0) selectedIndex = rows.length - 1;
          updateSelection();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (rows.length > 0) {
            if (selectedIndex >= 0 && selectedIndex < rows.length) {
              rows[selectedIndex].click();
            } else {
              rows[0].click();
            }
          }
          searchInp.blur();
        }

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
        <div class="field"><label class="field-label">${t('cust_form_name')}</label><input class="input" id="qc_name" value="${escapeHTML(initialName)}" placeholder="${t('cust_form_name_ph')}"></div>
        <div class="grid grid-2">
          <div class="field"><label class="field-label">${t('cust_form_phone')}</label><input class="input" id="qc_phone" value="${escapeHTML(initialPhone)}" placeholder="${t('cust_form_phone_ph')}"></div>
          <div class="field"><label class="field-label">${t('cust_form_type')}</label>
            <select class="input" id="qc_type">
              <option value="customer">${t('cust_type_retail')}</option>
              <option value="hardware">${t('cust_type_hardware')}</option>
            </select>
          </div>
        </div>
        <div class="field" id="qc_discount_wrap" style="display:none;"><label class="field-label">${t('cust_form_discount')}</label><input class="input" id="qc_discount" type="number" min="0" max="100" value="0"></div>
        <div class="grid grid-2">
          <div class="field"><label class="field-label">${t('cust_form_address')}</label><input class="input" id="qc_address"></div>
          <div class="field"><label class="field-label">${t('cust_form_nic')}</label><input class="input" id="qc_nic" placeholder="e.g. 199012345678 / 901234567V"></div>
        </div>
      `,
      footHTML: `<button class="btn btn-outline" data-close>${t('cancel')}</button><button class="btn btn-primary" id="saveQCustBtn">${t('confirm')}</button>`,
      onMount: (wrap) => {
        const typeSelect = wrap.querySelector('#qc_type');
        const discWrap = wrap.querySelector('#qc_discount_wrap');
        typeSelect.addEventListener('change', () => {
          discWrap.style.display = typeSelect.value === 'hardware' ? 'block' : 'none';
        });

        wrap.querySelector('#saveQCustBtn').addEventListener('click', async () => {
          const name = wrap.querySelector('#qc_name').value.trim();
          if (!name) { toast(t('cust_err_name'), 'err'); return; }
          const newC = await DB.addCustomer({
            name,
            phone: wrap.querySelector('#qc_phone').value,
            nic: wrap.querySelector('#qc_nic')?.value || '',
            address: wrap.querySelector('#qc_address').value,
            customerType: typeSelect.value,
            discountPercent: Number(wrap.querySelector('#qc_discount')?.value) || 0
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
  },

  addToCart(itemId) {
    const item = DB.getItem(itemId);
    if (!item) return;
    if (item.qty <= 0) { toast(t('sale_out_of_stock'), 'err'); return; }
    const existing = cart.find(l => l.itemId === itemId);
    if (existing) {
      if (existing.qty < existing.maxQty) { existing.qty += 1; }
      else { toast(t('sale_exceeds_stock'), 'err'); }
    } else {
      cart.push({
        itemId,
        name: item.name,
        image: item.image,
        unit: item.unit,
        unitPrice: item.sellPrice,
        costPrice: item.costPrice || 0,
        qty: 1,
        maxQty: item.qty,
        discount: 0,
        discountType: (DB.data.settings && DB.data.settings.defaultDiscType) || 'unit'
      });
    }
    Views.sale.refreshCart();
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

    if (item.unit === 'bag' || item.unit === 'box' || item.unit === 'pkt' || item.unit === 'roll' || item.unit === 'bundle') {
      if (matchWeight) {
        defaultPackSize = parseFloat(matchWeight[1]) || 50;
        defaultPackUnit = matchWeight[2].startsWith('g') ? 'g' : 'kg';
        defaultLooseUnit = defaultPackUnit;
      } else if (matchVolume) {
        defaultPackSize = parseFloat(matchVolume[1]) || 1;
        defaultPackUnit = matchVolume[2].startsWith('ml') ? 'ml' : 'L';
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

    const curLoose = item.looseInfo || {};
    const initPackSize = curLoose.packSize || defaultPackSize;
    const initPackUnit = curLoose.packUnit || defaultPackUnit;
    const initLooseUnit = curLoose.looseUnit || defaultLooseUnit;
    const initLooseQty = (curLoose.looseQty !== undefined && curLoose.looseQty !== null) ? curLoose.looseQty : 1;

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
      return 1;
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
          <div style="margin-bottom:12px;">
            <label style="font-size:13px; font-weight:700; color:var(--charcoal); display:block; margin-bottom:6px;">දෙන ප්‍රමාණය සහ මිනුම:</label>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <input type="number" id="lm_loose_qty" class="input" min="0.0001" step="any" value="${initLooseQty}" placeholder="ප්‍රමාණය" autofocus style="font-size:20px; font-weight:900; text-align:center; height:46px; border:2px solid var(--primary);">
              <select id="lm_loose_unit" class="input" style="font-size:14px; font-weight:700; height:46px; border:2px solid var(--primary-light, #bae6fd);">
                ${unitOptions.map(u => `<option value="${u.val}" ${initLooseUnit === u.val ? 'selected' : ''}>${u.label}</option>`).join('')}
              </select>
            </div>
          </div>
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

        <!-- Simple Pack Size -->
        <div style="background:#f8fafc; border:1px dashed var(--border); border-radius:8px; padding:8px 12px; margin-bottom:14px;">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
            <span style="font-size:12px; font-weight:700; color:var(--steel);">මුළු බෑගයේ / පැකට් එකේ ප්‍රමාණය:</span>
            <div style="display:flex; align-items:center; gap:4px;">
              <input type="number" id="lm_pack_size" class="input" min="0.0001" step="any" value="${initPackSize}" style="width:65px; height:32px; font-size:13px; font-weight:800; text-align:center; padding:2px 4px;">
              <select id="lm_pack_unit" class="input" style="height:32px; font-size:12px; font-weight:700; padding:2px 4px;">
                ${unitOptions.map(u => `<option value="${u.val}" ${initPackUnit === u.val ? 'selected' : ''}>${u.val}</option>`).join('')}
              </select>
            </div>
          </div>
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
        const packSizeEl = wrap.querySelector('#lm_pack_size');
        const packUnitEl = wrap.querySelector('#lm_pack_unit');
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
          if (lUnit === 'kg') chips = [{ val: 0.25, lbl: '250g' }, { val: 0.5, lbl: '500g' }, { val: 1, lbl: '1kg' }, { val: 2, lbl: '2kg' }, { val: 2.5, lbl: '2.5kg' }, { val: 5, lbl: '5kg' }];
          else if (lUnit === 'g') chips = [{ val: 100, lbl: '100g' }, { val: 250, lbl: '250g' }, { val: 500, lbl: '500g' }, { val: 750, lbl: '750g' }, { val: 1000, lbl: '1000g' }];
          else if (lUnit === 'in') chips = [{ val: 3, lbl: '3 අඟල්' }, { val: 6, lbl: '6 අඟල්' }, { val: 12, lbl: '12 අඟල්' }, { val: 18, lbl: '18 අඟල්' }, { val: 24, lbl: '24 අඟල්' }];
          else if (lUnit === 'ft') chips = [{ val: 0.5, lbl: '1/2 අඩිය' }, { val: 1, lbl: '1 අඩිය' }, { val: 2, lbl: '2 අඩි' }, { val: 3, lbl: '3 අඩි' }, { val: 5, lbl: '5 අඩි' }, { val: 10, lbl: '10 අඩි' }];
          else if (lUnit === 'L') chips = [{ val: 0.25, lbl: '250ml' }, { val: 0.5, lbl: '500ml' }, { val: 1, lbl: '1L' }, { val: 2, lbl: '2L' }, { val: 4, lbl: '4L' }];
          else if (lUnit === 'ml') chips = [{ val: 50, lbl: '50ml' }, { val: 100, lbl: '100ml' }, { val: 250, lbl: '250ml' }, { val: 500, lbl: '500ml' }];
          else chips = [{ val: 1, lbl: '1' }, { val: 2, lbl: '2' }, { val: 5, lbl: '5' }, { val: 10, lbl: '10' }, { val: 20, lbl: '20' }];

          presetsWrap.innerHTML = chips.map(c => `
            <button type="button" class="btn-loose-preset" data-val="${c.val}" style="padding:4px 9px; font-size:11.5px; font-weight:700; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; cursor:pointer; color:var(--charcoal);">
              ${c.lbl}
            </button>
          `).join('');

          presetsWrap.querySelectorAll('.btn-loose-preset').forEach(btn => {
            btn.addEventListener('click', () => {
              looseQtyEl.value = btn.dataset.val;
              calc();
            });
          });
        };

        const calc = () => {
          const packSize = Math.max(0.0001, parseFloat(packSizeEl.value) || 1);
          const packUnit = packUnitEl.value;
          const looseUnit = looseUnitEl.value;
          const unitPrice = item.unitPrice;
          let calcLooseQty = 0, stockQty = 0, linePrice = 0;

          if (activeMode === 'qty') {
            calcLooseQty = Math.max(0, parseFloat(looseQtyEl.value) || 0);
            const factor = getUnitFactor(looseUnit, packUnit);
            stockQty = (calcLooseQty * factor) / packSize;
            linePrice = stockQty * unitPrice;
          } else {
            const cash = Math.max(0, parseFloat(cashAmountEl.value) || 0);
            linePrice = cash;
            stockQty = unitPrice > 0 ? (cash / unitPrice) : 0;
            const effectiveInPack = stockQty * packSize;
            const factor = getUnitFactor(packUnit, looseUnit);
            calcLooseQty = Math.round(effectiveInPack * factor * 1000) / 1000;
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

          return { stockQty: displayStock, calcLooseQty, linePrice, packSize, packUnit, looseUnit };
        };

        packSizeEl.addEventListener('input', calc);
        packUnitEl.addEventListener('change', calc);
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
          item.looseInfo = {
            isLoose: true,
            looseQty: res.calcLooseQty,
            looseUnit: res.looseUnit,
            packSize: res.packSize,
            packUnit: res.packUnit,
            shortText: `${res.calcLooseQty} ${res.looseUnit}`,
            fullText: `${res.calcLooseQty} ${res.looseUnit} (${res.packSize} ${res.packUnit} පැකේජයකින්)`
          };

          closeModal();
          Views.sale.refreshCart();
          Views.sale.applyCustomerHardwareDiscount();
          toast(`ලිහිල් විකිණීම Cart එකට යෙදුවා: ${item.looseInfo.shortText}`, 'ok');
        };

        wrap.querySelector('#lm_apply_btn').addEventListener('click', applyAction);

        wrap.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            applyAction();
          }
        });

        const resetBtn = wrap.querySelector('#lm_reset_btn');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            item.qty = 1;
            item.looseInfo = null;
            closeModal();
            Views.sale.refreshCart();
            Views.sale.applyCustomerHardwareDiscount();
            toast('සාමාන්‍ය විකිණීමට මාරු කළා', 'ok');
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
    const overallDiscount = Number(document.getElementById('saleDiscount').value) || 0;
    const discount = overallDiscount + itemDiscounts;
    const amountPaid = Number(document.getElementById('saleAmountPaid')?.value) || Number(Views.sale.amountPaid) || 0;
    const total = Views.sale.calcTotal();
    const changeAmount = Math.max(0, amountPaid - total);

    const lines = cart.map(l => ({
      itemId: l.itemId,
      name: l.name,
      unit: l.unit,
      qty: l.qty,
      unitPrice: l.unitPrice,
      discount: l.discount || 0,
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
    Views.sale.showReceipt(sale);
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

  showReceipt(sale) {
    const html = `
      <div class="receipt" id="printArea">
        ${DB.data.settings.logo ? `<img class="receipt-watermark" src="${DB.data.settings.logo}" alt="Watermark Logo">` : ''}
        <h2>${escapeHTML(DB.data.settings.shopName || 'රත්න හාඩ්වෙයාර්')}</h2>
        ${DB.data.settings.shopDescription ? `<div class="r-center" style="font-size:12px; font-weight:700; color:#111; margin-top:2px; margin-bottom:4px; white-space:pre-line; font-family:'Noto Sans Sinhala', sans-serif; line-height:1.6;">${escapeHTML(DB.data.settings.shopDescription)}</div>` : ''}
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; margin:4px 0;">
          <span>${(()=>{ const d=new Date(sale.date); return d.toLocaleDateString('en-GB'); })()}</span>
          <span>${(()=>{ const d=new Date(sale.date); return d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}); })()}</span>
          <span>#${sale.id}</span>
        </div>
        <hr>
        <table>
          <thead><tr><th style="text-align:left">${t('receipt_qty')}</th><th class="num">${t('word_qty')}</th><th class="num">${t('receipt_amount') || t('sale_total')}</th></tr></thead>
          <tbody>
            ${sale.lines.map(l => `
              <tr>
                <td>
                  ${escapeHTML(l.name)}
                  ${l.looseInfo ? `<div style="font-size:10px; color:#555; font-weight:600;">[ලිහිල්: ${escapeHTML(l.looseInfo.shortText || '')}]</div>` : ''}
                </td>
                <td class="num">${l.looseInfo ? `${l.looseInfo.looseQty} ${escapeHTML(l.looseInfo.looseUnit)}` : `${l.qty} ${escapeHTML(l.unit || '')}`}</td>
                <td class="num">${fmt(l.qty * l.unitPrice)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <hr>
        <div style="display:flex; justify-content:space-between;"><span>${t('sale_subtotal')}</span><span>${fmt(sale.subtotal)}</span></div>
        <div style="display:flex; justify-content:space-between;"><span>${t('sale_discount')}</span><span>${fmt(sale.discount)}</span></div>
        <div style="display:flex; justify-content:space-between; font-weight:700; font-size:14px;"><span>${t('sale_total')}</span><span>${fmt(sale.total)}</span></div>
        <div style="display:flex; justify-content:space-between; margin-top:4px;"><span>${t('sale_payment')}</span><span>${sale.paymentType === 'credit' ? `${t('word_credit')} - ${escapeHTML(sale.customerName)}` : t('word_cash')}</span></div>
        ${sale.paymentType === 'cash' && sale.amountPaid > 0 ? `
          <div style="display:flex; justify-content:space-between; margin-top:4px;"><span>${t('sale_amount_paid')}</span><span>${fmt(sale.amountPaid)}</span></div>
          <div style="display:flex; justify-content:space-between; font-weight:700;"><span>${t('sale_change_due')}</span><span>${fmt(sale.changeAmount)}</span></div>
        ` : ''}
        <hr>
        <div class="r-center">${t('receipt_thanks')}</div>
        <div class="r-center" style="font-size: 10px; font-weight: 700; color: #111; margin-top: 6px; border-top: 1px dashed #999; padding-top: 6px; line-height: 1.5; font-family: 'Noto Sans Sinhala', sans-serif;">භාණ්ඩය ආපසු භාරදීමේදී මෙම බිල්පත/ඉන්වොයිසිය ඉදිරිපත් කිරීම අනිවාර්ය වේ</div>
        <div class="r-center" style="font-size: 9px; color: #111; margin-top: 8px; border-top: 1px dotted #ccc; padding-top: 4px;">imagineX software solution - 0761945587</div>
      </div>
    `;
    openModal({
      title: `${t('hist_preview') || 'බිල්පත'} #${sale.id}`,
      bodyHTML: html,
      footHTML: `
        <button class="btn btn-outline" data-close>${t('close')}</button>
        <button class="btn btn-primary" id="printReceiptBtn">${t('receipt_print')}</button>
      `,
      wide: false,
      onMount: (wrap) => {
        wrap.querySelector('#printReceiptBtn').addEventListener('click', () => window.print());
      }
    });
  }
};

/* ================= ITEMS ================= */
Views.items = {
  searchQ: '',
  render() {
    return `
      ${Views.renderPageHeader({
      icon: 'ph-package',
      title: t('items_list'),
      count: DB.allItems().length,
      search: { id: 'itemsSearch', placeholder: t('search_placeholder'), value: Views.items.searchQ },
      actions: [{ id: 'addItemBtn', label: t('items_add_btn'), cls: 'btn-primary' }]
    })}
      <div id="itemsTableWrap">${Views.items.tableHTML()}</div>
    `;
  },

  tableHTML() {
    let list = DB.allItems();
    const q = (Views.items.searchQ || '').trim();
    if (q) list = list.filter(i => Singlish.match(i.name, q) || Singlish.match(i.category || '', q) || Singlish.match(i.description || '', q));
    if (!list.length) return `<div class="card"><div class="empty-state"><div class="em-ico"><i class="ph ph-package"></i></div><h3>${t('items_no_items')}</h3><div class="small">${t('items_no_items_sub')}</div></div></div>`;
    return `
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th style="width:46px;">Photo</th><th>${t('items_name')}</th><th>${t('items_category')}</th><th class="num">${t('items_cost_price')}</th><th class="num">${t('items_sell_price')}</th>
            <th class="num">${t('word_qty')}</th><th>${t('items_status')}</th><th></th>
          </tr></thead>
          <tbody>
            ${list.map(i => {
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
                <td><b>${escapeHTML(i.name)}</b></td>
                <td class="text-muted">${escapeHTML(i.category)}</td>
                <td class="num">${fmt(i.costPrice)}</td>
                <td class="num">${fmt(i.sellPrice)}</td>
                <td class="num">${i.qty} ${escapeHTML(i.unit)}</td>
                <td>${status}</td>
                <td>
                  <button class="icon-btn" data-edit-item="${i.id}" title="${t('items_edit')}">✎</button>
                  <button class="icon-btn" data-del-item="${i.id}" title="${t('delete')}"><i class="ph ph-trash"></i></button>
                </td>
              </tr>`;
    }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  formHTML(item) {
    const v = item || { name: '', category: '', unit: 'pcs', costPrice: '', sellPrice: '', qty: '', reorderLevel: 5, image: '', description: '' };
    const existingCategories = [...new Set(DB.data.items.map(i => i.category).filter(c => c && c.trim()))].sort();
    const catOptions = existingCategories.map(c => `<div class="combo-opt" data-val="${escapeHTML(c)}">${escapeHTML(c)}</div>`).join('');
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
      <div class="field">
        <label class="field-label">${t('items_form_qty')}</label>
        <input class="input" id="f_qty" type="number" min="0" step="any" value="${v.qty}">
        <div class="small text-muted" style="margin-top:4px;">* කොටස්/ලිහිල් (loose) වශයෙන් විකිණීමට decimal values (උදා: 0.5kg, 2.5m) භාවිතා කළ හැක.</div>
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

  openAddModal() {
    openModal({
      title: t('items_add_btn'),
      bodyHTML: Views.items.formHTML(null),
      footHTML: `<button class="btn btn-outline" data-close>${t('cancel')}</button><button class="btn btn-primary" id="saveItemBtn">${t('confirm')}</button>`,
      onMount: () => {
        Views.items.bindCategoryCombo();
        Views.items.bindImageUpload();
        document.getElementById('saveItemBtn').addEventListener('click', async () => {
          const name = document.getElementById('f_name').value.trim();
          const sell = document.getElementById('f_sell').value;
          const qty = document.getElementById('f_qty').value;
          const desc = document.getElementById('f_desc').value.trim();
          const image = document.getElementById('f_image').value;
          const category = document.getElementById('f_category').value.trim() || 'වෙනත්';
          if (!name) { toast(t('items_err_name'), 'err'); return; }
          if (sell === '') { toast(t('items_err_sell'), 'err'); return; }
          if (qty === '') { toast(t('items_err_qty'), 'err'); return; }
          try {
            await DB.addItem({
              name, category,
              unit: document.getElementById('f_unit').value,
              costPrice: document.getElementById('f_cost').value,
              sellPrice: sell, qty: Number(qty) || 0, reorderLevel: document.getElementById('f_reorder').value,
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

    const allCats = [...new Set(DB.data.items.map(i => i.category).filter(c => c && c.trim()))].sort();

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

  openEditModal(id) {
    const item = DB.getItem(id);
    if (!item) return;
    openModal({
      title: t('items_edit'),
      bodyHTML: Views.items.formHTML(item),
      footHTML: `<button class="btn btn-outline" data-close>${t('cancel')}</button><button class="btn btn-primary" id="saveItemBtn">${t('update')}</button>`,
      onMount: () => {
        Views.items.bindCategoryCombo();
        Views.items.bindImageUpload();
        document.getElementById('saveItemBtn').addEventListener('click', async () => {
          const name = document.getElementById('f_name').value.trim();
          if (!name) { toast(t('items_err_name'), 'err'); return; }
          try {
            await DB.updateItem(id, {
              name, category: document.getElementById('f_category').value.trim() || 'වෙනත්',
              unit: document.getElementById('f_unit').value,
              costPrice: Number(document.getElementById('f_cost').value) || 0,
              sellPrice: Number(document.getElementById('f_sell').value) || 0,
              description: document.getElementById('f_desc').value.trim(),
              image: document.getElementById('f_image').value,
              qty: Number(document.getElementById('f_qty').value) || 0,
              reorderLevel: Number(document.getElementById('f_reorder').value) || 0
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

  bind() {
    document.getElementById('addItemBtn').addEventListener('click', Views.items.openAddModal);
    const search = document.getElementById('itemsSearch');
    search.addEventListener('input', () => {
      Views.items.searchQ = search.value;
      document.getElementById('itemsTableWrap').innerHTML = Views.items.tableHTML();
      Views.items.bindRowActions();
    });
    Views.items.bindRowActions();
    setTimeout(() => search.focus(), 100);
  },
  bindRowActions() {
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

  render() {
    const allItems = DB.allItems();
    const lowItems = DB.lowStockItems();
    const totalValue = DB.stockValue();

    return `
      <div class="page-header" style="margin-bottom: 12px;">
        <div class="page-header-left">
          <i class="ph ph-archive-box page-header-icon"></i>
          <h2 class="page-header-title">තොග කළමනාකරණය (Stock Management)</h2>
        </div>
      </div>

      <div class="tabs-nav mb-20" style="display:flex; gap:10px; margin-bottom:20px; border-bottom:1px solid var(--border); padding-bottom:8px;">
        <button class="btn btn-sm ${Views.stock.activeTab === 'items' ? 'btn-primary' : 'btn-outline'}" id="stockTabItemsBtn">📦 භාණ්ඩ ලැයිස්තුව (Items List)</button>
        <button class="btn btn-sm ${Views.stock.activeTab === 'report' ? 'btn-primary' : 'btn-outline'}" id="stockTabReportBtn">📊 තොග වාර්තාව (Stock Report)</button>
      </div>

      <div id="stockTabContent">
        ${Views.stock.activeTab === 'items' ? Views.stock.itemsTabHTML() : Views.stock.reportTabHTML()}
      </div>
    `;
  },

  itemsTabHTML() {
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; gap:16px; flex-wrap:wrap;">
        <input class="input" id="itemsSearch" placeholder="🔍 සොයන්න (නම, කාණ්ඩය...)" style="width:260px" value="${escapeHTML(Views.stock.itemsSearchQ || '')}">
        <button class="btn btn-primary" id="addItemBtn">＋ අලුත් භාණ්ඩයක් එක් කරන්න</button>
      </div>
      <div id="itemsTableWrap">${Views.stock.itemsTableHTML()}</div>
    `;
  },

  reportTabHTML() {
    const allItems = DB.allItems();
    const lowItems = DB.lowStockItems();
    const totalValue = DB.stockValue();

    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; gap:16px; flex-wrap:wrap;">
        <input class="input" id="stockSearch" placeholder="🔍 සොයන්න (භාණ්ඩයේ නම...)" style="width:260px" value="${escapeHTML(Views.stock.reportSearchQ || '')}">
        <select class="input" id="stockFilter" style="width:200px">
          <option value="all" ${Views.stock.filterType === 'all' ? 'selected' : ''}>සියලුම තොග</option>
          <option value="low" ${Views.stock.filterType === 'low' ? 'selected' : ''}>⚠ අඩු තොග පමණක් (${lowItems.length})</option>
        </select>
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
    if (q) list = list.filter(i => Singlish.match(i.name, q) || Singlish.match(i.category || '', q) || Singlish.match(i.description || '', q));
    if (!list.length) return `<div class="card"><div class="empty-state"><div class="em-ico"><i class="ph ph-package"></i></div><h3>${t('items_no_items')}</h3><div class="small">${t('items_no_items_sub')}</div></div></div>`;
    return `
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th style="width:46px;">Photo</th><th>${t('items_name')}</th><th>${t('items_category')}</th><th class="num">${t('items_cost_price')}</th><th class="num">${t('items_sell_price')}</th>
            <th class="num">${t('word_qty')}</th><th>${t('items_status')}</th><th></th>
          </tr></thead>
          <tbody>
            ${list.map(i => {
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
                <td><b>${escapeHTML(i.name)}</b></td>
                <td>${escapeHTML(i.category || 'වෙනත්')}</td>
                <td class="num">${fmt(i.costPrice)}</td>
                <td class="num"><b>${fmt(i.sellPrice)}</b></td>
                <td class="num">${i.qty} ${escapeHTML(i.unit || '')}</td>
                <td>${status}</td>
                <td>
                  <button class="icon-btn" data-edit-item="${i.id}" title="${t('items_edit')}"><i class="ph ph-pencil-simple"></i></button>
                  <button class="icon-btn" data-del-item="${i.id}" title="${t('delete')}"><i class="ph ph-trash"></i></button>
                </td>
              </tr>
            `;
    }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  reportTableHTML() {
    let list = DB.allItems();
    const q = (Views.stock.reportSearchQ || '').trim();
    if (q) {
      list = list.filter(i => Singlish.match(i.name || '', q) || Singlish.match(i.category || '', q));
    }

    if (Views.stock.filterType === 'low') {
      list = list.filter(i => i.qty <= i.reorderLevel).sort((a, b) => a.qty - b.qty);
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
                  <td><b>${escapeHTML(i.name)}</b>${statusTag}</td>
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
        });
        setTimeout(() => search.focus(), 100);
      }
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
    }

    Views.stock.bindRowActions();
  },

  bindRowActions() {
    if (Views.stock.activeTab === 'items') {
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
        <div class="field"><label class="field-label">${t('cust_form_name')}</label><input class="input" id="c_name" placeholder="${t('cust_form_name_ph')}"></div>
        <div class="grid grid-2">
          <div class="field"><label class="field-label">${t('cust_form_phone')}</label><input class="input" id="c_phone" placeholder="${t('cust_form_phone_ph')}"></div>
          <div class="field"><label class="field-label">${t('cust_form_type')}</label>
            <select class="input" id="c_type">
              <option value="hardware" ${Views.customers.activeTab === 'hardwares' ? 'selected' : ''}>${t('cust_type_hardware')}</option>
              <option value="customer" ${Views.customers.activeTab === 'retail' ? 'selected' : ''}>${t('cust_type_retail')}</option>
            </select>
          </div>
        </div>
        <div class="grid grid-2">
          <div class="field" id="c_discount_wrap"><label class="field-label">${t('cust_form_discount')}</label><input class="input" id="c_discount" type="number" min="0" max="100" value="0"></div>
          <div class="field"><label class="field-label">${t('cust_form_limit')}</label><input class="input" id="c_limit" type="number" min="0" value="0"></div>
        </div>
        <div class="field"><label class="field-label">${t('cust_form_address')}</label><input class="input" id="c_address"></div>
        <div class="field"><label class="field-label">${t('cust_form_nic')}</label><input class="input" id="c_nic"></div>
      `,
      footHTML: `<button class="btn btn-outline" data-close>${t('cancel')}</button><button class="btn btn-primary" id="saveCustBtn">${t('confirm')}</button>`,
      onMount: (wrap) => {
        const typeSelect = wrap.querySelector('#c_type');
        const discWrap = wrap.querySelector('#c_discount_wrap');
        const toggleDisc = () => { discWrap.style.display = typeSelect.value === 'hardware' ? 'block' : 'none'; };
        toggleDisc();
        typeSelect.addEventListener('change', toggleDisc);

        wrap.querySelector('#saveCustBtn').addEventListener('click', async () => {
          const name = wrap.querySelector('#c_name').value.trim();
          if (!name) { toast(t('cust_err_name'), 'err'); return; }
          await DB.addCustomer({
            name,
            phone: wrap.querySelector('#c_phone').value,
            nic: wrap.querySelector('#c_nic').value,
            address: wrap.querySelector('#c_address').value,
            creditLimit: wrap.querySelector('#c_limit').value,
            customerType: typeSelect.value,
            discountPercent: Number(wrap.querySelector('#c_discount').value) || 0
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
        <div class="field"><label class="field-label">${t('cust_form_name')}</label><input class="input" id="ce_name" value="${escapeHTML(c.name)}" placeholder="${t('cust_form_name_ph')}"></div>
        <div class="grid grid-2">
          <div class="field"><label class="field-label">${t('cust_form_phone')}</label><input class="input" id="ce_phone" value="${escapeHTML(c.phone || '')}" placeholder="${t('cust_form_phone_ph')}"></div>
          <div class="field"><label class="field-label">${t('cust_form_type')}</label>
            <select class="input" id="ce_type">
              <option value="hardware" ${c.customerType === 'hardware' ? 'selected' : ''}>${t('cust_type_hardware')}</option>
              <option value="customer" ${c.customerType === 'customer' ? 'selected' : ''}>${t('cust_type_retail')}</option>
            </select>
          </div>
        </div>
        <div class="grid grid-2">
          <div class="field" id="ce_discount_wrap"><label class="field-label">${t('cust_form_discount')}</label><input class="input" id="ce_discount" type="number" min="0" max="100" value="${c.discountPercent || 0}"></div>
          <div class="field"><label class="field-label">${t('cust_form_limit')}</label><input class="input" id="ce_limit" type="number" min="0" value="${c.creditLimit || 0}"></div>
        </div>
        <div class="field"><label class="field-label">${t('cust_form_address')}</label><input class="input" id="ce_address" value="${escapeHTML(c.address || '')}"></div>
        <div class="field"><label class="field-label">${t('cust_form_nic')}</label><input class="input" id="ce_nic" value="${escapeHTML(c.nic || '')}"></div>
      `,
      footHTML: `<button class="btn btn-outline" data-close>${t('cancel')}</button><button class="btn btn-primary" id="updateCustBtn">${t('confirm')}</button>`,
      onMount: (wrap) => {
        const typeSelect = wrap.querySelector('#ce_type');
        const discWrap = wrap.querySelector('#ce_discount_wrap');
        const toggleDisc = () => { discWrap.style.display = typeSelect.value === 'hardware' ? 'block' : 'none'; };
        toggleDisc();
        typeSelect.addEventListener('change', toggleDisc);

        wrap.querySelector('#updateCustBtn').addEventListener('click', async () => {
          const name = wrap.querySelector('#ce_name').value.trim();
          if (!name) { toast(t('cust_err_name'), 'err'); return; }
          await DB.updateCustomer(id, {
            name,
            phone: wrap.querySelector('#ce_phone').value,
            nic: wrap.querySelector('#ce_nic').value,
            address: wrap.querySelector('#ce_address').value,
            creditLimit: wrap.querySelector('#ce_limit').value,
            customerType: typeSelect.value,
            discountPercent: Number(wrap.querySelector('#ce_discount').value) || 0
          });
          closeModal();
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
            itemsHtml = `<div style="margin-top:4px; font-size:12px; color:var(--text-color); opacity:0.8; line-height:1.4;">` +
              sale.lines.map(line => `• ${escapeHTML(line.name)} (${line.looseInfo ? `[ලිහිල්: ${line.looseInfo.shortText}]` : `x${line.qty}`})`).join('<br>') +
              `</div>`;
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
        <div class="page-header-right">
          <input class="input" id="historySearch" placeholder="🔍 බිල් No / පාරිභෝගිකයා / බඩු..." style="width:230px" value="${escapeHTML(Views.history.searchQ || '')}">
          <input class="input" id="historyDateFilter" type="date" style="width:150px" value="${escapeHTML(Views.history.filterDate || '')}" title="දිනයෙන් පෙරන්න">
          <select class="input" id="histFilter" style="width:160px">
            <option value="all" ${Views.history.filterType === 'all' ? 'selected' : ''}>${t('hist_filter_all')}</option>
            <option value="cash" ${Views.history.filterType === 'cash' ? 'selected' : ''}>${t('hist_filter_cash')}</option>
            <option value="credit" ${Views.history.filterType === 'credit' ? 'selected' : ''}>${t('hist_filter_credit')}</option>
          </select>
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
        const custName = (s.customerName || '').toLowerCase();
        const itemsStr = s.lines.map(l => l.name).join(' ').toLowerCase();
        
        // Date formats to match
        const d = new Date(s.date);
        const ymd = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        const dmy = String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth()+1).padStart(2, '0') + '/' + d.getFullYear();
        const formattedDate = fmtDate(s.date);
        
        return idStr.includes(q) ||
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
              <img id="settingsLogoPreview" src="${s.logo || ''}" alt="Logo Preview" style="height: ${logoSize}px; max-height: 80px; object-fit: contain; border-radius: 6px;">
              <button class="btn btn-danger" id="removeLogoBtn" style="font-size: 12px; padding: 6px 12px;">${t('settings_logo_remove')}</button>
            </div>

            <div class="field mt-14">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <label class="field-label" style="margin-bottom: 0;">${t('settings_logo_size')}</label>
                <span id="logoSizeVal" class="pill" style="font-weight: 700;">${logoSize}px</span>
              </div>
              <input type="range" id="logoSizeRange" min="20" max="100" step="2" value="${logoSize}" style="width: 100%; cursor: pointer;">
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

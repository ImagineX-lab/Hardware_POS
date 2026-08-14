/* =========================================================
   HardwarePOS — Views
   Each view has: render (returns HTML string) + bind (attach events)
   ========================================================= */

const Views = {};
let cart = []; // { itemId, name, unit, unitPrice, qty, maxQty }

/* ================= DASHBOARD ================= */
Views.dashboard = {
  render(){
    const items = DB.allItems();
    const low = DB.lowStockItems();
    const today = DB.todaySales();
    const todayTotal = today.reduce((s,x)=>s+x.total,0);
    const credit = DB.totalCreditOutstanding();
    const recent = DB.allSales().slice(0,6);

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

      ${low.length ? `
      <div class="stripe-banner mt-20">
        <span class="stripe-ico">⚠</span>
        <div>
          <b>${low.length} ${t('dash_low_stock_banner')}</b>
          <div class="small" style="font-weight:500">${t('dash_low_stock_banner_sub')}</div>
        </div>
      </div>` : ``}

      <div class="grid grid-2 mt-20">
        <div class="card">
          <div class="card-title">${t('dash_low_stock_items')}</div>
          <div class="card-sub">${t('dash_low_stock_sub')}</div>
          ${low.length ? `
            <div class="table-wrap">
              <table>
                <thead><tr><th>${t('dash_item')}</th><th class="num">${t('dash_stock')}</th><th class="num">${t('dash_reorder')}</th></tr></thead>
                <tbody>
                  ${low.slice(0,6).map(i=>`
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
                <thead><tr><th>#</th><th>${t('dash_date')}</th><th>${t('dash_type')}</th><th class="num">${t('dash_amount')}</th></tr></thead>
                <tbody>
                  ${recent.map(s=>`
                    <tr>
                      <td>${s.id}</td>
                      <td>${fmtDate(s.date)}</td>
                      <td>${s.paymentType==='credit' ? `<span class="pill pill-warn">${t('word_credit')}</span>` : `<span class="pill pill-ok">${t('word_cash')}</span>`}</td>
                      <td class="num">${fmt(s.total)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : `<div class="empty-state"><div class="em-ico">🧾</div><h3>${t('dash_no_sales')}</h3></div>`}
        </div>
      </div>
    `;
  },
  bind(){}
};

/* ================= SALE / BILLING ================= */
Views.sale = {
  currentCategory: 'All',
  payType: 'cash',
  selectedCustomer: null,
  amountPaid: '',

  render(){
    cart = cart || [];
    if(!Views.sale.payType) Views.sale.payType = 'cash';
    return `
      <div class="sale-layout">
        <div class="card" style="display:flex; flex-direction:column; overflow:hidden;">
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

        <div class="card" style="display:flex; flex-direction:column; overflow:hidden;">
          <div class="card-title" style="margin-bottom:10px">${t('sale_cart')}</div>
          <div class="cart-list-wrap" id="cartBox">${Views.sale.cartHTML()}</div>

          <div class="totals-box" id="totalsBox" style="margin-top:auto; padding-top:10px; border-top:none;">${Views.sale.totalsHTML()}</div>

          <!-- Customer Selection Box (For Cash or Credit) -->
          <div class="field mt-8" style="margin-bottom:6px;">
            <label class="field-label" style="margin-bottom:4px;">${t('sale_customer')} <small class="text-muted">(${Views.sale.payType==='credit'?'අවශ්‍යයි':'විකල්පයි'})</small></label>
            <div id="customerSelectionWrap">
              ${Views.sale.customerWidgetHTML()}
            </div>
          </div>
          
          <div class="field mt-8" style="margin-bottom:6px;">
            <div class="pay-toggle" style="margin:0;">
              <button type="button" id="payCashBtn" class="${Views.sale.payType==='cash'?'active':''}">${t('sale_cash')}</button>
              <button type="button" id="payCreditBtn" class="credit ${Views.sale.payType==='credit'?'active':''}">${t('sale_credit')}</button>
            </div>
          </div>

          <!-- Amount Paid & Change Due for Cash -->
          <div class="field mt-8" id="amountPaidWrap" style="display:${Views.sale.payType==='cash'?'block':'none'}; margin-bottom:6px;">
            <label class="field-label" style="margin-bottom:4px;">${t('sale_amount_paid')}</label>
            <input class="input" id="saleAmountPaid" type="number" min="0" step="any" placeholder="0.00" value="${Views.sale.amountPaid || ''}">
            <div id="changeDueWrap" class="change-due-box" style="display:${(Number(Views.sale.amountPaid) > 0)?'flex':'none'};">
              <span>${t('sale_change_due')}</span>
              <span id="changeDueAmount" style="font-size:16px;">${fmt(Math.max(0, (Number(Views.sale.amountPaid) || 0) - Views.sale.calcTotal()))}</span>
            </div>
          </div>

          <div class="field" style="margin-bottom:12px; display:flex; align-items:center; gap:10px; margin-top:4px;">
            <label class="field-label" style="margin:0;">${t('sale_discount')}</label>
            <input class="input" id="saleDiscount" type="number" min="0" step="any" value="0" style="flex:1;">
          </div>

          <button class="btn btn-primary btn-block" id="completeSaleBtn" style="padding:13px; font-size:15px;">${t('sale_complete_btn')}</button>
          <button class="btn btn-outline btn-block mt-8" id="clearCartBtn">${t('sale_clear_cart')}</button>
        </div>
      </div>
    `;
  },

  customerWidgetHTML(){
    if (Views.sale.selectedCustomer) {
      const c = Views.sale.selectedCustomer;
      const isHardware = c.customerType === 'hardware';
      return `
        <div class="selected-cust-card">
          <div>
            <div class="cust-name-title">👤 ${escapeHTML(c.name)} ${isHardware ? `<span class="pill pill-ok" style="font-size:10px; margin-left:4px;">${t('cust_tab_hardwares')}</span>` : ''}</div>
            <div class="cust-meta">
              ${c.phone ? `📞 ${escapeHTML(c.phone)}` : ''} 
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

  categoriesHTML(){
    const items = DB.allItems();
    const cats = ['All', ...new Set(items.map(i => i.category || 'Uncategorized'))].filter(Boolean);
    return `
      <select class="input" id="posCategorySelect" style="width:100%; font-weight:bold; font-size:14px; background-color:var(--paper); margin-bottom:4px;">
        ${cats.map(c => `<option value="${escapeHTML(c)}" ${Views.sale.currentCategory === c ? 'selected' : ''}>${escapeHTML(c === 'All' ? t('hist_filter_all') || 'All Categories' : c)}</option>`).join('')}
      </select>
    `;
  },

  posGridHTML(){
    let items = DB.allItems();
    if (Views.sale.currentCategory !== 'All') {
      items = items.filter(i => (i.category || 'Uncategorized') === Views.sale.currentCategory);
    }
    if (!items.length) {
      return `<div class="empty-state" style="grid-column:1/-1; padding:40px 20px;"><div class="em-ico">📦</div><h3>${t('sale_no_matches')||'No items'}</h3></div>`;
    }
    return items.map(i => `
      <div class="pos-item-card ${i.qty <= 0 ? 'out-of-stock' : ''}" data-grid-item="${i.id}">
        <div class="item-name">${escapeHTML(i.name)}</div>
        <div>
          <div class="item-price">${fmt(i.sellPrice)}</div>
          <div class="item-qty">${i.qty} ${escapeHTML(i.unit)}</div>
        </div>
      </div>
    `).join('');
  },

  cartHTML(){
    if(!cart.length) return `<div class="empty-state" style="padding:30px 10px"><div class="em-ico">🛒</div><h3>${t('sale_empty_cart')}</h3><div class="small">${t('sale_empty_cart_sub')}</div></div>`;
    return cart.map((l,idx)=>`
      <div class="cart-row">
        <div>
          <div class="cart-item-name">${escapeHTML(l.name)}</div>
          <div class="cart-item-meta">${fmt(l.unitPrice)} / ${escapeHTML(l.unit)} • ${t('word_qty')}: ${l.maxQty}</div>
        </div>
        <input type="number" min="0.01" step="any" max="${l.maxQty}" value="${l.qty}" data-qty-idx="${idx}" class="input">
        <div class="num" style="text-align:right; font-weight:700;">${fmt(l.qty*l.unitPrice)}</div>
        <button class="icon-btn" data-remove-idx="${idx}" title="${t('delete')}">✕</button>
      </div>
    `).join('');
  },

  calcSubtotal(){
    return cart.reduce((s,l)=>s+l.qty*l.unitPrice,0);
  },

  calcTotal(){
    const subtotal = Views.sale.calcSubtotal();
    const discountEl = document.getElementById('saleDiscount');
    const discount = discountEl ? Number(discountEl.value)||0 : 0;
    return Math.max(0, subtotal - discount);
  },

  totalsHTML(){
    const subtotal = Views.sale.calcSubtotal();
    const discountEl = document.getElementById('saleDiscount');
    const discount = discountEl ? Number(discountEl.value)||0 : 0;
    const total = Math.max(0, subtotal - discount);
    return `
      <div class="totals-line"><span>${t('sale_subtotal')}</span><span>${fmt(subtotal)}</span></div>
      <div class="totals-line"><span>${t('sale_discount')}</span><span>- ${fmt(discount)}</span></div>
      <div class="totals-line grand"><span>${t('sale_total')}</span><span>${fmt(total)}</span></div>
    `;
  },

  refreshCart(){
    document.getElementById('cartBox').innerHTML = Views.sale.cartHTML();
    document.getElementById('totalsBox').innerHTML = Views.sale.totalsHTML();
    Views.sale.updateChangeDue();
    Views.sale.bindCartRows();
  },

  updateChangeDue(){
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

  applyCustomerHardwareDiscount(){
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

  bindCartRows(){
    document.querySelectorAll('[data-qty-idx]').forEach(inp=>{
      inp.addEventListener('change', (e)=>{
        const idx = Number(e.target.dataset.qtyIdx);
        let v = Number(e.target.value) || 0.01;
        v = Math.max(0.01, Math.min(v, cart[idx].maxQty));
        v = Math.round(v * 100) / 100;
        cart[idx].qty = v;
        Views.sale.refreshCart();
        Views.sale.applyCustomerHardwareDiscount();
      });
    });
    document.querySelectorAll('[data-remove-idx]').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const idx = Number(e.target.dataset.removeIdx);
        cart.splice(idx,1);
        Views.sale.refreshCart();
        Views.sale.applyCustomerHardwareDiscount();
      });
    });
  },

  bind(){
    const searchInp = document.getElementById('saleSearch');
    const suggestBox = document.getElementById('saleSuggest');
    let selectedIndex = -1;

    if (searchInp) {
      searchInp.addEventListener('input', ()=>{
        selectedIndex = -1;
        const q = searchInp.value.trim().toLowerCase();
        if(!q){ suggestBox.innerHTML=''; return; }
        const matches = DB.allItems().filter(i=>i.name.toLowerCase().includes(q) || (i.category||'').toLowerCase().includes(q)).slice(0,8);
        if(!matches.length){
          suggestBox.innerHTML = `<div class="search-suggest"><div class="suggest-row text-muted">${t('sale_no_matches')}</div></div>`;
          return;
        }
        suggestBox.innerHTML = `<div class="search-suggest">${matches.map(i=>`
          <div class="suggest-row" data-add-item="${i.id}">
            <div>
              <div class="s-name">${escapeHTML(i.name)}</div>
              <div class="s-meta">${escapeHTML(i.category)} • ${t('word_qty')}: ${i.qty} ${escapeHTML(i.unit)}</div>
            </div>
            <div style="font-weight:700">${fmt(i.sellPrice)}</div>
          </div>
        `).join('')}</div>`;
        suggestBox.querySelectorAll('[data-add-item]').forEach(row=>{
          row.addEventListener('click', ()=>{
            const id = Number(row.dataset.addItem);
            Views.sale.addToCart(id);
            searchInp.value=''; suggestBox.innerHTML=''; searchInp.focus();
          });
        });
      });

      searchInp.addEventListener('keydown', (e) => {
        const rows = suggestBox.querySelectorAll('[data-add-item]');
        if (!rows.length) return;
        
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          selectedIndex = (selectedIndex + 1) % rows.length;
          updateSelection();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          selectedIndex = selectedIndex - 1;
          if (selectedIndex < 0) selectedIndex = rows.length - 1;
          updateSelection();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < rows.length) {
            rows[selectedIndex].click();
          } else if (rows.length > 0) {
            rows[0].click();
          }
        }

        function updateSelection() {
          rows.forEach((r, idx) => {
            if (idx === selectedIndex) {
              r.classList.add('selected-row');
              r.style.background = 'var(--bg-hover)';
              r.style.borderColor = 'var(--primary)';
            } else {
              r.classList.remove('selected-row');
              r.style.background = '';
              r.style.borderColor = '';
            }
          });
        }
      });
    }

    Views.sale.bindCustomerSearch();

    document.getElementById('payCashBtn').addEventListener('click', ()=>Views.sale.setPayType('cash'));
    document.getElementById('payCreditBtn').addEventListener('click', ()=>Views.sale.setPayType('credit'));
    
    const discEl = document.getElementById('saleDiscount');
    if (discEl) {
      discEl.addEventListener('input', ()=>{
        document.getElementById('totalsBox').innerHTML = Views.sale.totalsHTML();
        Views.sale.updateChangeDue();
      });
    }

    const paidEl = document.getElementById('saleAmountPaid');
    if (paidEl) {
      paidEl.addEventListener('input', (e)=>{
        Views.sale.amountPaid = e.target.value;
        Views.sale.updateChangeDue();
      });
    }

    document.getElementById('clearCartBtn').addEventListener('click', ()=>{
      cart = [];
      Views.sale.refreshCart();
    });
    document.getElementById('completeSaleBtn').addEventListener('click', Views.sale.completeSale);

    Views.sale.bindCartRows();
    Views.sale.bindGrid();
    if(searchInp) setTimeout(() => searchInp.focus(), 100);
  },

  bindCustomerSearch(){
    const custWrap = document.getElementById('customerSelectionWrap');
    if(!custWrap) return;

    const unselectBtn = document.getElementById('unselectCustBtn');
    if (unselectBtn) {
      unselectBtn.addEventListener('click', ()=>{
        Views.sale.selectedCustomer = null;
        custWrap.innerHTML = Views.sale.customerWidgetHTML();
        Views.sale.bindCustomerSearch();
      });
      return;
    }

    const searchInp = document.getElementById('saleCustomerSearch');
    const suggestBox = document.getElementById('custSuggestBox');
    if (!searchInp || !suggestBox) return;

    searchInp.addEventListener('input', ()=>{
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
              <div class="small text-muted">${c.phone ? `📞 ${escapeHTML(c.phone)}` : ''} ${c.balance > 0 ? ` • ${t('word_due')} ${fmt(c.balance)}` : ''}</div>
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
        row.addEventListener('click', ()=>{
          const id = Number(row.dataset.selectCust);
          const c = DB.getCustomer(id);
          if (c) {
            Views.sale.selectedCustomer = c;
            custWrap.innerHTML = Views.sale.customerWidgetHTML();
            Views.sale.bindCustomerSearch();
            Views.sale.applyCustomerHardwareDiscount();
          }
        });
      });

      const quickBtn = document.getElementById('quickAddCustRow');
      if (quickBtn) {
        quickBtn.addEventListener('click', ()=>{
          suggestBox.style.display = 'none';
          Views.sale.openQuickAddModal(q);
        });
      }
    });
  },

  openQuickAddModal(initialText){
    const isPhone = /^[0-9+\s-]{4,}$/.test(initialText);
    const initialName = isPhone ? '' : initialText;
    const initialPhone = isPhone ? initialText : '';

    openModal({
      title: t('cust_quick_add_title'),
      bodyHTML:`
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
        <div class="field"><label class="field-label">${t('cust_form_address')}</label><input class="input" id="qc_address"></div>
      `,
      footHTML:`<button class="btn btn-outline" data-close>${t('cancel')}</button><button class="btn btn-primary" id="saveQCustBtn">${t('confirm')}</button>`,
      onMount:(wrap)=>{
        const typeSelect = wrap.querySelector('#qc_type');
        const discWrap = wrap.querySelector('#qc_discount_wrap');
        typeSelect.addEventListener('change', ()=>{
          discWrap.style.display = typeSelect.value === 'hardware' ? 'block' : 'none';
        });

        wrap.querySelector('#saveQCustBtn').addEventListener('click', async ()=>{
          const name = wrap.querySelector('#qc_name').value.trim();
          if(!name){ toast(t('cust_err_name'),'err'); return; }
          const newC = await DB.addCustomer({
            name,
            phone: wrap.querySelector('#qc_phone').value,
            address: wrap.querySelector('#qc_address').value,
            customerType: typeSelect.value,
            discountPercent: Number(wrap.querySelector('#qc_discount')?.value) || 0
          });
          closeModal();
          toast(t('cust_added'),'ok');
          Views.sale.selectedCustomer = newC;
          const custWrap = document.getElementById('customerSelectionWrap');
          if (custWrap) {
            custWrap.innerHTML = Views.sale.customerWidgetHTML();
            Views.sale.bindCustomerSearch();
            Views.sale.applyCustomerHardwareDiscount();
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

  setPayType(type){
    Views.sale.payType = type;
    document.getElementById('payCashBtn').classList.toggle('active', type==='cash');
    document.getElementById('payCreditBtn').classList.toggle('active', type==='credit');
    const paidWrap = document.getElementById('amountPaidWrap');
    if (paidWrap) paidWrap.style.display = type === 'cash' ? 'block' : 'none';
  },

  addToCart(itemId){
    const item = DB.getItem(itemId);
    if(!item) return;
    if(item.qty <= 0){ toast(t('sale_out_of_stock'), 'err'); return; }
    const existing = cart.find(l=>l.itemId===itemId);
    if(existing){
      if(existing.qty < existing.maxQty){ existing.qty += 1; }
      else { toast(t('sale_exceeds_stock'), 'err'); }
    } else {
      cart.push({ itemId, name:item.name, unit:item.unit, unitPrice:item.sellPrice, qty:1, maxQty:item.qty });
    }
    Views.sale.refreshCart();
  },

  async completeSale(){
    if(!cart.length){ toast(t('sale_empty_cart'), 'err'); return; }
    const payType = Views.sale.payType;
    let customerId = null;
    let customerName = '';

    if (Views.sale.selectedCustomer) {
      customerId = Views.sale.selectedCustomer.id;
      customerName = Views.sale.selectedCustomer.name;
    }

    if(payType==='credit'){
      if(!customerId){ toast(t('sale_select_credit_customer'), 'err'); return; }
    }

    const discount = Number(document.getElementById('saleDiscount').value)||0;
    const amountPaid = Number(document.getElementById('saleAmountPaid')?.value) || Number(Views.sale.amountPaid) || 0;
    const total = Views.sale.calcTotal();
    const changeAmount = Math.max(0, amountPaid - total);

    const lines = cart.map(l=>({ itemId:l.itemId, name:l.name, unit:l.unit, qty:l.qty, unitPrice:l.unitPrice }));

    const sale = await DB.createSale({ lines, paymentType:payType, customerId, customerName, discount, amountPaid, changeAmount });
    toast(`${t('sale_success')}#${sale.id}`, 'ok');
    cart = [];
    document.getElementById('saleDiscount').value = 0;
    Views.sale.amountPaid = '';
    Views.sale.selectedCustomer = null;
    Views.sale.setPayType('cash');
    Views.sale.refreshCart();
    Views.sale.showReceipt(sale);
    App.updateSidebarCounts();
  },

  showReceipt(sale){
    const html = `
      <div class="receipt" id="printArea">
        <h2>${escapeHTML(DB.data.settings.shopName || 'HardwarePOS')}</h2>
        <div class="r-center">${t('receipt_title')}<br>${fmtDate(sale.date)} • ${t('receipt_thanks')} #${sale.id}</div>
        <hr>
        <table>
          <thead><tr><th style="text-align:left">${t('receipt_qty')}</th><th class="num">${t('word_qty')}</th><th class="num">${t('receipt_amount') || t('sale_total')}</th></tr></thead>
          <tbody>
            ${sale.lines.map(l=>`
              <tr>
                <td>${escapeHTML(l.name)}</td>
                <td class="num">${l.qty} ${escapeHTML(l.unit||'')}</td>
                <td class="num">${fmt(l.qty*l.unitPrice)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <hr>
        <div style="display:flex; justify-content:space-between;"><span>${t('sale_subtotal')}</span><span>${fmt(sale.subtotal)}</span></div>
        <div style="display:flex; justify-content:space-between;"><span>${t('sale_discount')}</span><span>${fmt(sale.discount)}</span></div>
        <div style="display:flex; justify-content:space-between; font-weight:700; font-size:14px;"><span>${t('sale_total')}</span><span>${fmt(sale.total)}</span></div>
        <div style="display:flex; justify-content:space-between; margin-top:4px;"><span>${t('sale_payment')}</span><span>${sale.paymentType==='credit' ? `${t('word_credit')} - ${escapeHTML(sale.customerName)}` : t('word_cash')}</span></div>
        ${sale.paymentType==='cash' && sale.amountPaid > 0 ? `
          <div style="display:flex; justify-content:space-between; margin-top:4px;"><span>${t('sale_amount_paid')}</span><span>${fmt(sale.amountPaid)}</span></div>
          <div style="display:flex; justify-content:space-between; font-weight:700;"><span>${t('sale_change_due')}</span><span>${fmt(sale.changeAmount)}</span></div>
        ` : ''}
        <hr>
        <div class="r-center">${t('receipt_thanks')}</div>
      </div>
    `;
    openModal({
      title:t('receipt_completed'),
      bodyHTML: html,
      footHTML:`
        <button class="btn btn-outline" data-close>${t('close')}</button>
        <button class="btn btn-primary" id="printReceiptBtn">${t('receipt_print')}</button>
      `,
      wide:false,
      onMount:(wrap)=>{
        wrap.querySelector('#printReceiptBtn').addEventListener('click', ()=>window.print());
      }
    });
  }
};

/* ================= ITEMS ================= */
Views.items = {
  searchQ:'',
  render(){
    return `
      <div class="section-head">
        <h2>${t('items_list')} (${DB.allItems().length})</h2>
        <div class="flex gap-8">
          <input class="input" id="itemsSearch" placeholder="${t('search_placeholder')}" style="width:220px" value="${escapeHTML(Views.items.searchQ)}">
          <button class="btn btn-primary" id="addItemBtn">${t('items_add_btn')}</button>
        </div>
      </div>
      <div id="itemsTableWrap">${Views.items.tableHTML()}</div>
    `;
  },

  tableHTML(){
    let list = DB.allItems();
    const q = Views.items.searchQ.toLowerCase();
    if(q) list = list.filter(i=>i.name.toLowerCase().includes(q) || (i.category||'').toLowerCase().includes(q));
    if(!list.length) return `<div class="card"><div class="empty-state"><div class="em-ico">📦</div><h3>${t('items_no_items')}</h3><div class="small">${t('items_no_items_sub')}</div></div></div>`;
    return `
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>${t('items_name')}</th><th>${t('items_category')}</th><th class="num">${t('items_cost_price')}</th><th class="num">${t('items_sell_price')}</th>
            <th class="num">${t('word_qty')}</th><th>${t('items_status')}</th><th></th>
          </tr></thead>
          <tbody>
            ${list.map(i=>{
              const status = i.qty<=0 ? `<span class="pill pill-danger">${t('status_out')}</span>`
                : i.qty<=i.reorderLevel ? `<span class="pill pill-warn">${t('status_low')}</span>`
                : `<span class="pill pill-ok">${t('status_ok')}</span>`;
              return `
              <tr>
                <td><b>${escapeHTML(i.name)}</b></td>
                <td class="text-muted">${escapeHTML(i.category)}</td>
                <td class="num">${fmt(i.costPrice)}</td>
                <td class="num">${fmt(i.sellPrice)}</td>
                <td class="num">${i.qty} ${escapeHTML(i.unit)}</td>
                <td>${status}</td>
                <td>
                  <button class="icon-btn" data-edit-item="${i.id}" title="${t('items_edit')}">✎</button>
                  <button class="icon-btn" data-del-item="${i.id}" title="${t('delete')}">🗑</button>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  formHTML(item){
    const v = item || {name:'',category:'',unit:'pcs',costPrice:'',sellPrice:'',qty:'',reorderLevel:5};
    const existingCategories = [...new Set(DB.data.items.map(i => i.category).filter(c => c && c.trim()))].sort();
    const catOptions = existingCategories.map(c => `<div class="combo-opt" data-val="${escapeHTML(c)}">${escapeHTML(c)}</div>`).join('');
    return `
      <div class="grid grid-2">
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
            ${['pcs','kg','g','L','ml','bag','box','m','ft','set','roll','sheet','bundle'].map(u=>`<option value="${u}" ${v.unit===u?'selected':''}>${u}</option>`).join('')}
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

  openAddModal(){
    openModal({
      title:t('items_add_btn'),
      bodyHTML: Views.items.formHTML(null),
      footHTML:`<button class="btn btn-outline" data-close>${t('cancel')}</button><button class="btn btn-primary" id="saveItemBtn">${t('confirm')}</button>`,
      onMount:()=>{
        Views.items.bindCategoryCombo();
        document.getElementById('saveItemBtn').addEventListener('click', async ()=>{
          const name = document.getElementById('f_name').value.trim();
          const sell = document.getElementById('f_sell').value;
          const qty = document.getElementById('f_qty').value;
          if(!name){ toast(t('items_err_name'),'err'); return; }
          if(sell===''){ toast(t('items_err_sell'),'err'); return; }
          if(qty===''){ toast(t('items_err_qty'),'err'); return; }
          await DB.addItem({
            name, category:document.getElementById('f_category').value,
            unit:document.getElementById('f_unit').value,
            costPrice:document.getElementById('f_cost').value,
            sellPrice:sell, qty:Number(qty)||0, reorderLevel:document.getElementById('f_reorder').value
          });
          closeModal();
          toast(t('items_added'),'ok');
          App.render();
        });
      }
    });
  },

  bindCategoryCombo(){
    const input = document.getElementById('f_category');
    const arrow = document.getElementById('comboCatArrow');
    const drop  = document.getElementById('comboCatDrop');
    if(!input || !arrow || !drop) return;

    const allCats = [...new Set(DB.data.items.map(i => i.category).filter(c => c && c.trim()))].sort();

    function renderOpts(filter){
      const q = (filter || '').trim().toLowerCase();
      const matched = q ? allCats.filter(c => c.toLowerCase().includes(q)) : allCats;
      if(!matched.length){
        drop.innerHTML = '<div class="combo-opt combo-no-match">ගැළපෙන category එකක් නැත</div>';
      } else {
        drop.innerHTML = matched.map(c =>
          `<div class="combo-opt" data-val="${escapeHTML(c)}">${escapeHTML(c)}</div>`
        ).join('');
        drop.querySelectorAll('.combo-opt[data-val]').forEach(opt =>{
          opt.addEventListener('mousedown', e =>{ e.preventDefault(); input.value = opt.dataset.val; closeCombo(); });
        });
      }
    }

    function openCombo(){
      renderOpts(input.value);
      drop.classList.add('open');
      arrow.classList.add('open');
    }
    function closeCombo(){
      drop.classList.remove('open');
      arrow.classList.remove('open');
    }
    function toggleCombo(){
      drop.classList.contains('open') ? closeCombo() : openCombo();
    }

    arrow.addEventListener('click', e =>{ e.stopPropagation(); toggleCombo(); input.focus(); });
    input.addEventListener('focus', ()=> openCombo());
    input.addEventListener('input', ()=> renderOpts(input.value));
    document.addEventListener('click', function handler(e){
      if(!document.getElementById('comboCatWrap')){ document.removeEventListener('click', handler); return; }
      if(!document.getElementById('comboCatWrap').contains(e.target)) closeCombo();
    });
    input.addEventListener('keydown', e=>{ if(e.key==='Escape'||e.key==='Tab') closeCombo(); });

    renderOpts('');
  },

  openEditModal(id){
    const item = DB.getItem(id);
    if(!item) return;
    openModal({
      title:t('items_edit'),
      bodyHTML: Views.items.formHTML(item),
      footHTML:`<button class="btn btn-outline" data-close>${t('cancel')}</button><button class="btn btn-primary" id="saveItemBtn">${t('update')}</button>`,
      onMount:()=>{
        Views.items.bindCategoryCombo();
        document.getElementById('saveItemBtn').addEventListener('click', async ()=>{
          const name = document.getElementById('f_name').value.trim();
          if(!name){ toast(t('items_err_name'),'err'); return; }
          await DB.updateItem(id, {
            name, category:document.getElementById('f_category').value,
            unit:document.getElementById('f_unit').value,
            costPrice:Number(document.getElementById('f_cost').value)||0,
            sellPrice:Number(document.getElementById('f_sell').value)||0,
            qty:Number(document.getElementById('f_qty').value)||0,
            reorderLevel:Number(document.getElementById('f_reorder').value)||0
          });
          closeModal();
          toast(t('items_updated'),'ok');
          App.render();
        });
      }
    });
  },

  bind(){
    document.getElementById('addItemBtn').addEventListener('click', Views.items.openAddModal);
    const search = document.getElementById('itemsSearch');
    search.addEventListener('input', ()=>{
      Views.items.searchQ = search.value;
      document.getElementById('itemsTableWrap').innerHTML = Views.items.tableHTML();
      Views.items.bindRowActions();
    });
    Views.items.bindRowActions();
    setTimeout(() => search.focus(), 100);
  },
  bindRowActions(){
    document.querySelectorAll('[data-edit-item]').forEach(b=>{
      b.addEventListener('click', ()=>Views.items.openEditModal(Number(b.dataset.editItem)));
    });
    document.querySelectorAll('[data-del-item]').forEach(b=>{
      b.addEventListener('click', ()=>{
        const id = Number(b.dataset.delItem);
        const item = DB.getItem(id);
        confirmAction(`"${escapeHTML(item.name)}" ${t('items_del_confirm')}`, async ()=>{
          await DB.deleteItem(id);
          toast(t('items_deleted'),'ok');
          App.render();
        });
      });
    });
  }
};

/* ================= STOCK ================= */
Views.stock = {
  render(){
    const items = DB.allItems();
    const totalValue = DB.stockValue();
    return `
      <div class="section-head">
        <h2>${t('stock_report')}</h2>
        <div class="text-muted small">${t('stock_total_val')} <b>${fmt(totalValue)}</b></div>
      </div>
      ${!items.length ? `<div class="card"><div class="empty-state"><div class="em-ico">🗄</div><h3>${t('items_no_items')}</h3></div></div>` : `
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>${t('items_name')}</th><th>${t('items_category')}</th><th class="num">${t('dash_stock')}</th><th>${t('stock_level')}</th><th class="num">${t('stock_value')}</th>
          </tr></thead>
          <tbody>
            ${items.map(i=>{
              const ratio = i.reorderLevel>0 ? Math.min(1, i.qty/(i.reorderLevel*3)) : (i.qty>0?1:0);
              const color = i.qty<=0 ? 'var(--danger)' : i.qty<=i.reorderLevel ? 'var(--yellow)' : 'var(--success)';
              return `
              <tr>
                <td><b>${escapeHTML(i.name)}</b></td>
                <td class="text-muted">${escapeHTML(i.category)}</td>
                <td class="num">${i.qty} ${escapeHTML(i.unit)}</td>
                <td style="min-width:120px"><div class="stock-meter"><div style="width:${ratio*100}%; background:${color}"></div></div></td>
                <td class="num">${fmt(i.qty*i.costPrice)}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>`}
    `;
  },
  bind(){}
};

/* ================= LOW STOCK ================= */
Views.lowstock = {
  render(){
    const low = DB.lowStockItems().sort((a,b)=>a.qty-b.qty);
    return `
      <div class="section-head"><h2>${t('ls_title')}</h2></div>
      ${low.length ? `
      <div class="stripe-banner mt-8" style="margin-bottom:16px;">
        <span class="stripe-ico">⚠</span>
        <div><b>${low.length} ${t('ls_banner')}</b></div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>${t('items_name')}</th><th>${t('items_category')}</th><th class="num">${t('ls_current')}</th><th class="num">${t('dash_reorder')}</th><th></th></tr></thead>
          <tbody>
            ${low.map(i=>`
              <tr>
                <td><b>${escapeHTML(i.name)}</b></td>
                <td class="text-muted">${escapeHTML(i.category)}</td>
                <td class="num">${i.qty===0 ? `<span class="pill pill-danger">${t('status_out')}</span>` : `<span style="color:var(--danger); font-weight:700">${i.qty} ${escapeHTML(i.unit)}</span>`}</td>
                <td class="num text-muted">${i.reorderLevel}</td>
                <td><button class="btn btn-sm btn-primary" data-restock="${i.id}">${t('ls_add_btn')}</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : `<div class="card"><div class="empty-state"><div class="em-ico">✅</div><h3>${t('ls_all_normal')}</h3><div class="small">${t('ls_no_low')}</div></div></div>`}
    `;
  },
  bind(){
    document.querySelectorAll('[data-restock]').forEach(b=>{
      b.addEventListener('click', ()=>{
        const id = Number(b.dataset.restock);
        const item = DB.getItem(id);
        openModal({
          title:`"${escapeHTML(item.name)}" ${t('ls_add_stock_title')}`,
          bodyHTML:`
            <div class="field"><label class="field-label">${t('ls_current')}</label><input class="input" value="${item.qty} ${escapeHTML(item.unit)}" disabled></div>
            <div class="field"><label class="field-label">${t('ls_add_qty')}</label><input class="input" id="restockQty" type="number" min="0.01" step="any" value="10"></div>
          `,
          footHTML:`<button class="btn btn-outline" data-close>${t('cancel')}</button><button class="btn btn-primary" id="restockSaveBtn">${t('ls_add_btn')}</button>`,
          onMount:()=>{
            document.getElementById('restockSaveBtn').addEventListener('click', async ()=>{
              const add = Number(document.getElementById('restockQty').value)||0;
              if(add<=0){ toast(t('ls_err_qty'),'err'); return; }
              await DB.updateItem(id, {qty:item.qty+add});
              closeModal();
              toast(t('ls_updated'),'ok');
              App.render();
            });
          }
        });
      });
    });
  }
};

/* ================= CUSTOMERS (CREDIT / NAYATA) ================= */
Views.customers = {
  searchQ:'',
  activeTab: 'hardwares', // 'hardwares' | 'retail'

  render(){
    const hardwaresCount = DB.getHardwareCustomers().length;
    const retailCount = DB.getRetailCustomers().length;

    return `
      <div class="section-head">
        <h2>${t('cust_title')} (${DB.allCustomers().length})</h2>
        <div class="flex gap-8">
          <input class="input" id="custSearch" placeholder="${t('search_placeholder')}" style="width:220px" value="${escapeHTML(Views.customers.searchQ)}">
          <button class="btn btn-primary" id="addCustBtn">${t('cust_add_btn')}</button>
        </div>
      </div>

      <div class="cust-subtabs">
        <button class="cust-tab-btn ${Views.customers.activeTab==='hardwares'?'active':''}" data-cust-tab="hardwares">
          🏢 ${t('cust_tab_hardwares')} (${hardwaresCount})
        </button>
        <button class="cust-tab-btn ${Views.customers.activeTab==='retail'?'active':''}" data-cust-tab="retail">
          👤 ${t('cust_tab_customers')} (${retailCount})
        </button>
      </div>

      <div id="custTableWrap">${Views.customers.tableHTML()}</div>
    `;
  },

  tableHTML(){
    let list = Views.customers.activeTab === 'hardwares' ? DB.getHardwareCustomers() : DB.getRetailCustomers();
    const q = Views.customers.searchQ.toLowerCase();
    if(q) list = list.filter(c=>c.name.toLowerCase().includes(q) || (c.phone||'').includes(q));
    if(!list.length) return `<div class="card"><div class="empty-state"><div class="em-ico">👤</div><h3>${t('cust_no_cust')}</h3><div class="small">${t('cust_no_cust_sub')}</div></div></div>`;
    return `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>${t('cust_name')}</th>
              <th>${t('cust_phone')}</th>
              <th>${t('cust_address')}</th>
              ${Views.customers.activeTab==='hardwares' ? `<th>${t('cust_hardware_discount_badge')}</th>` : ''}
              <th class="num">${t('cust_due')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${list.map(c=>`
              <tr>
                <td><b>${escapeHTML(c.name)}</b></td>
                <td>${escapeHTML(c.phone)||'-'}</td>
                <td class="text-muted">${escapeHTML(c.address)||'-'}</td>
                ${Views.customers.activeTab==='hardwares' ? `<td><span class="pill pill-ok">${c.discountPercent||0}% Discount</span></td>` : ''}
                <td class="num">${c.balance>0 ? `<span style="color:var(--danger); font-weight:700">${fmt(c.balance)}</span>` : `<span class="pill pill-ok">${t('cust_zero')}</span>`}</td>
                <td>
                  <button class="btn btn-sm btn-outline" data-view-cust="${c.id}">${t('cust_details')}</button>
                  <button class="icon-btn" data-del-cust="${c.id}" title="${t('delete')}">🗑</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  openAddModal(){
    openModal({
      title:t('cust_add_btn'),
      bodyHTML:`
        <div class="field"><label class="field-label">${t('cust_form_name')}</label><input class="input" id="c_name" placeholder="${t('cust_form_name_ph')}"></div>
        <div class="grid grid-2">
          <div class="field"><label class="field-label">${t('cust_form_phone')}</label><input class="input" id="c_phone" placeholder="${t('cust_form_phone_ph')}"></div>
          <div class="field"><label class="field-label">${t('cust_form_type')}</label>
            <select class="input" id="c_type">
              <option value="hardware" ${Views.customers.activeTab==='hardwares'?'selected':''}>${t('cust_type_hardware')}</option>
              <option value="customer" ${Views.customers.activeTab==='retail'?'selected':''}>${t('cust_type_retail')}</option>
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
      footHTML:`<button class="btn btn-outline" data-close>${t('cancel')}</button><button class="btn btn-primary" id="saveCustBtn">${t('confirm')}</button>`,
      onMount:(wrap)=>{
        const typeSelect = wrap.querySelector('#c_type');
        const discWrap = wrap.querySelector('#c_discount_wrap');
        const toggleDisc = () => { discWrap.style.display = typeSelect.value === 'hardware' ? 'block' : 'none'; };
        toggleDisc();
        typeSelect.addEventListener('change', toggleDisc);

        wrap.querySelector('#saveCustBtn').addEventListener('click', async ()=>{
          const name = wrap.querySelector('#c_name').value.trim();
          if(!name){ toast(t('cust_err_name'),'err'); return; }
          await DB.addCustomer({
            name,
            phone: wrap.querySelector('#c_phone').value,
            nic: wrap.querySelector('#c_nic').value,
            address: wrap.querySelector('#c_address').value,
            creditLimit: wrap.querySelector('#c_limit').value,
            customerType: typeSelect.value,
            discountPercent: Number(wrap.querySelector('#c_discount').value)||0
          });
          closeModal();
          toast(t('cust_added'),'ok');
          App.render();
        });
      }
    });
  },

  openDetailModal(id){
    const c = DB.getCustomer(id);
    if(!c) return;
    openModal({
      title: c.name,
      wide:true,
      bodyHTML:`
        <div class="grid grid-2">
          <div>
            <div class="small text-muted">${t('cust_phone')}</div>
            <div style="font-weight:600; margin-bottom:8px;">${escapeHTML(c.phone)||'-'}</div>
            <div class="small text-muted">${t('cust_address')}</div>
            <div style="font-weight:600; margin-bottom:8px;">${escapeHTML(c.address)||'-'}</div>
            <div class="small text-muted">${t('cust_form_type')}</div>
            <div style="font-weight:600;">${c.customerType==='hardware'? `${t('cust_type_hardware')} (${c.discountPercent||0}% discount)` : t('cust_type_retail')}</div>
          </div>
          <div>
            <div class="small text-muted">${t('cust_curr_due')}</div>
            <div style="font-size:22px; font-weight:700; color:${c.balance>0?'var(--danger)':'var(--success)'}">${fmt(c.balance)}</div>
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
                  ${c.ledger.map(l=>`
                    <tr>
                      <td>${fmtDate(l.date)}</td>
                      <td>${l.type==='sale' ? `<span class="pill pill-warn">${t('cust_type_sale')}</span>` : `<span class="pill pill-ok">${t('cust_type_pay')}</span>`} <span class="small text-muted">${escapeHTML(l.note||'')}</span></td>
                      <td class="num">${l.type==='sale'?'+':'-'} ${fmt(l.amount)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : `<div class="text-muted small">${t('cust_history_empty')}</div>`}
        </div>
      `,
      footHTML:`<button class="btn btn-outline" data-close>${t('close')}</button>`,
      onMount:()=>{
        document.getElementById('recordPaymentBtn').addEventListener('click', async ()=>{
          const amt = Number(document.getElementById('paymentAmt').value)||0;
          if(amt<=0){ toast(t('cust_err_amt'),'err'); return; }
          await DB.recordPayment(id, amt);
          toast(t('cust_pay_recorded'),'ok');
          closeModal();
          App.render();
        });
      }
    });
  },

  bind(){
    document.getElementById('addCustBtn').addEventListener('click', Views.customers.openAddModal);

    document.querySelectorAll('[data-cust-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        Views.customers.activeTab = e.currentTarget.dataset.custTab;
        document.querySelectorAll('[data-cust-tab]').forEach(b=>b.classList.toggle('active', b===e.currentTarget));
        document.getElementById('custTableWrap').innerHTML = Views.customers.tableHTML();
        Views.customers.bindRowActions();
      });
    });

    const search = document.getElementById('custSearch');
    if (search) {
      search.addEventListener('input', ()=>{
        Views.customers.searchQ = search.value;
        document.getElementById('custTableWrap').innerHTML = Views.customers.tableHTML();
        Views.customers.bindRowActions();
      });
      setTimeout(() => search.focus(), 100);
    }
    Views.customers.bindRowActions();
  },

  bindRowActions(){
    document.querySelectorAll('[data-view-cust]').forEach(b=>{
      b.addEventListener('click', ()=>Views.customers.openDetailModal(Number(b.dataset.viewCust)));
    });
    document.querySelectorAll('[data-del-cust]').forEach(b=>{
      b.addEventListener('click', ()=>{
        const id = Number(b.dataset.delCust);
        const c = DB.getCustomer(id);
        if(c.balance>0){ toast(t('cust_err_del_due'),'err'); return; }
        confirmAction(`"${escapeHTML(c.name)}" ${t('items_del_confirm')}`, async ()=>{
          await DB.deleteCustomer(id);
          toast(t('items_deleted'),'ok');
          App.render();
        });
      });
    });
  }
};

/* ================= SALES HISTORY ================= */
Views.history = {
  filterType:'all',
  render(){
    return `
      <div class="section-head">
        <h2>${t('hist_title')}</h2>
        <div class="flex gap-8">
          <select class="input" id="histFilter" style="width:160px">
            <option value="all" ${Views.history.filterType==='all'?'selected':''}>${t('hist_filter_all')}</option>
            <option value="cash" ${Views.history.filterType==='cash'?'selected':''}>${t('hist_filter_cash')}</option>
            <option value="credit" ${Views.history.filterType==='credit'?'selected':''}>${t('hist_filter_credit')}</option>
          </select>
        </div>
      </div>
      <div id="histTableWrap">${Views.history.tableHTML()}</div>
    `;
  },
  tableHTML(){
    let sales = DB.allSales();
    if(Views.history.filterType!=='all') sales = sales.filter(s=>s.paymentType===Views.history.filterType);
    if(!sales.length) return `<div class="card"><div class="empty-state"><div class="em-ico">🧾</div><h3>${t('hist_no_sales')}</h3></div></div>`;
    return `
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>${t('dash_date')}</th><th>${t('hist_items')}</th><th>${t('sale_payment')}</th><th class="num">${t('sale_total')}</th><th></th></tr></thead>
          <tbody>
            ${sales.map(s=>`
              <tr>
                <td>${s.id}</td>
                <td>${fmtDate(s.date)}</td>
                <td class="small">${s.lines.map(l=>escapeHTML(l.name)+' x'+l.qty).join(', ')}</td>
                <td>${s.paymentType==='credit' ? `<span class="pill pill-warn">${t('word_credit')}</span> <span class="small text-muted">${escapeHTML(s.customerName)}</span>` : `<span class="pill pill-ok">${t('word_cash')}</span>`}</td>
                <td class="num" style="font-weight:700">${fmt(s.total)}</td>
                <td><button class="icon-btn" data-del-sale="${s.id}" title="${t('hist_del_title')}">🗑</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },
  bind(){
    document.getElementById('histFilter').addEventListener('change', (e)=>{
      Views.history.filterType = e.target.value;
      document.getElementById('histTableWrap').innerHTML = Views.history.tableHTML();
      Views.history.bindRowActions();
    });
    Views.history.bindRowActions();
  },
  bindRowActions(){
    document.querySelectorAll('[data-del-sale]').forEach(b=>{
      b.addEventListener('click', ()=>{
        const id = Number(b.dataset.delSale);
        confirmAction(t('hist_del_confirm'), async ()=>{
          await DB.deleteSale(id);
          toast(t('hist_deleted'),'ok');
          App.render();
        });
      });
    });
  }
};

/* ================= SETTINGS ================= */
Views.settings = {
  render(){
    return `
      <div class="section-head"><h2>${t('settings_title')}</h2></div>
      <div class="grid grid-2">
        <div class="card">
          <div class="card-title">${t('settings_shop_details')}</div>
          <div class="field mt-14"><label class="field-label">${t('settings_shop_name')}</label>
            <input class="input" id="shopNameInput" value="${escapeHTML(DB.data.settings.shopName)}">
          </div>
          <button class="btn btn-primary" id="saveShopNameBtn">${t('save')}</button>
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
          <button class="btn ${currentLang==='si' ? 'btn-primary' : 'btn-outline'}" id="langSiBtn" style="flex:1; font-size:14px;">
            ${currentLang==='si' ? '✓ ' : ''}සිංහල
          </button>
          <button class="btn ${currentLang==='en' ? 'btn-primary' : 'btn-outline'}" id="langEnBtn" style="flex:1; font-size:14px;">
            ${currentLang==='en' ? '✓ ' : ''}English
          </button>
        </div>
      </div>
    `;
  },
  bind(){
    document.getElementById('saveShopNameBtn').addEventListener('click', async ()=>{
      const name = document.getElementById('shopNameInput').value.trim() || 'HardwarePOS';
      await DB.updateShopName(name);
      const lbl = document.getElementById('shopNameLabel');
      if (lbl) lbl.textContent = DB.data.settings.shopName;
      toast(t('settings_saved'),'ok');
    });
    document.getElementById('exportBtn').addEventListener('click', async ()=>{
      const blob = new Blob([JSON.stringify(await DB.exportJSON(), null, 2)], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const d = new Date().toISOString().slice(0,10);
      a.href = url; a.download = `hardwarepos-backup-${d}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast(t('settings_backup_dl'),'ok');
    });
    document.getElementById('importFile').addEventListener('change', (e)=>{
      const file = e.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = (ev)=>{
        confirmAction(t('settings_restore_confirm'), async ()=>{
          try{
            await DB.importJSON(ev.target.result);
            toast(t('settings_restore_ok'),'ok');
            App.render();
          }catch(err){
            toast(t('settings_restore_err'),'err');
          }
        });
      };
      reader.readAsText(file);
    });
    document.getElementById('wipeBtn').addEventListener('click', ()=>{
      confirmAction(t('settings_wipe_confirm'), async ()=>{
        await DB.wipeAll();
        toast(t('settings_wiped'),'ok');
        App.render();
      });
    });
    document.getElementById('langSiBtn').addEventListener('click', ()=>setLanguage('si'));
    document.getElementById('langEnBtn').addEventListener('click', ()=>setLanguage('en'));
  }
};

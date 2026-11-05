/* =========================================================
   HardwarePOS — Data layer (Node.js API based)
   ========================================================= */

const DB = {
  data: {
    settings: { shopName: "රත්න හාඩ්වෙයාර්" },
    items: [],
    customers: [],
    sales: [],
    purchases: []
  },

  async load(){
    try {
      const [settingsRes, itemsRes, custRes, salesRes, purchasesRes, returnsRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/items'),
        fetch('/api/customers'),
        fetch('/api/sales'),
        fetch('/api/purchases'),
        fetch('/api/returns')
      ]);
      this.data.settings = await settingsRes.json();
      this.data.items = await itemsRes.json();
      this.data.customers = await custRes.json();
      this.data.sales = await salesRes.json();
      this.data.purchases = await purchasesRes.json();
      this.data.returns = await returnsRes.json();
      if (typeof Singlish !== 'undefined' && Array.isArray(this.data.items)) {
        Singlish.preIndexAll(this.data.items);
      }
      this.invalidateItemsCache();
    } catch(err) {
      console.error("Failed to load data", err);
    }
    return this.data;
  },

  _sortedItemsCache: null,
  _searchCache: new Map(),
  invalidateItemsCache() {
    this._sortedItemsCache = null;
    this._searchCache.clear();
  },

  async reload() {
    await this.load();
  },

  /* ---------------- ITEMS ---------------- */
  async addItem(item){
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    const newItem = await res.json();
    if (typeof Singlish !== 'undefined') {
      Singlish.indexItem(newItem);
    }
    this.data.items.push(newItem);
    this.invalidateItemsCache();
    return newItem;
  },
  async updateItem(id, patch){
    const res = await fetch(`/api/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch)
    });
    if(res.ok) {
      const updated = await res.json();
      if (typeof Singlish !== 'undefined') {
        delete updated._searchIdx;
        Singlish.indexItem(updated);
      }
      const idx = this.data.items.findIndex(i => i.id === id);
      if(idx !== -1) this.data.items[idx] = updated;
      this.invalidateItemsCache();
      return updated;
    }
    return null;
  },
  async deleteItem(id){
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    this.data.items = this.data.items.filter(i => Number(i.id) !== Number(id));
    this.invalidateItemsCache();
  },
  getItem(id){ return this.data.items.find(i=>i.id===id); },
  getItemByBarcode(barcode){
    if(!barcode) return null;
    const clean = String(barcode).trim().toLowerCase();
    if(!clean) return null;
    return this.data.items.find(i => (i.barcode || '').trim().toLowerCase() === clean);
  },
  allItems(){
    if (!this._sortedItemsCache) {
      this._sortedItemsCache = this.data.items.slice().sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    return this._sortedItemsCache;
  },
  searchItems(query, category = 'All', limit = 0) {
    const q = (query || '').trim();
    const cat = category || 'All';
    const max = limit > 0 ? limit : 0;
    const cacheKey = `${cat}|${max}|${q.toLowerCase()}`;

    if (this._searchCache.has(cacheKey)) {
      return this._searchCache.get(cacheKey);
    }

    const items = this.allItems();
    const isFilteredCat = cat && cat !== 'All' && cat !== 'all';
    const isOtherCat = cat === 'වෙනත්';

    if (!q) {
      let res = items;
      if (isFilteredCat) {
        if (isOtherCat) {
          res = items.filter(i => !i.category || (i.category || '').trim() === 'වෙනත්' || (i.category || '').trim() === '');
        } else {
          res = items.filter(i => (i.category || '').trim() === cat);
        }
      }
      if (max > 0 && res.length > max) res = res.slice(0, max);
      return res;
    }

    const results = [];
    const prepared = typeof Singlish !== 'undefined' ? Singlish.prepareQuery(q) : null;
    const qLower = q.toLowerCase();

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // Fast category exclusion
      if (isFilteredCat) {
        const itemCat = (item.category || '').trim();
        if (isOtherCat) {
          if (itemCat && itemCat !== 'වෙනත්') continue;
        } else {
          if (itemCat !== cat) continue;
        }
      }

      let isMatch = false;
      if (prepared) {
        isMatch = Singlish.matchPrepared(item, prepared);
      } else {
        isMatch = (item.name || '').toLowerCase().includes(qLower) || (item.barcode || '').toLowerCase().includes(qLower);
      }

      if (isMatch) {
        results.push(item);
        if (max > 0 && results.length >= max) break;
      }
    }

    if (this._searchCache.size > 300) {
      this._searchCache.clear();
    }
    this._searchCache.set(cacheKey, results);
    return results;
  },
  lowStockItems(){ return this.allItems().filter(i=>i.qty <= i.reorderLevel); },

  /* ---------------- CUSTOMERS (Credit / Nayata) ---------------- */
  async addCustomer(c){
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(c)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to add customer');
    }
    const newCust = await res.json();
    this.data.customers.push(newCust);
    return newCust;
  },
  async updateCustomer(id, patch){
    const res = await fetch(`/api/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch)
    });
    if(res.ok) {
      const updated = await res.json();
      const idx = this.data.customers.findIndex(c => c.id === id);
      if(idx !== -1) this.data.customers[idx] = updated;
      return updated;
    }
    return null;
  },
  async deleteCustomer(id){
    await fetch(`/api/customers/${id}`, { method: 'DELETE' });
    this.data.customers = this.data.customers.filter(c => c.id !== id);
  },
  getCustomer(id){ return this.data.customers.find(c=>c.id===id); },
  allCustomers(){ return this.data.customers.slice().sort((a,b)=>a.name.localeCompare(b.name)); },
  getHardwareCustomers(){ return this.data.customers.filter(c => c.customerType === 'hardware').sort((a,b)=>a.name.localeCompare(b.name)); },
  getRetailCustomers(){ return this.data.customers.filter(c => c.customerType !== 'hardware').sort((a,b)=>a.name.localeCompare(b.name)); },
  searchCustomers(q){
    q = (q || '').trim();
    if(!q) return this.allCustomers();
    const qLower = q.toLowerCase();
    const qPrepared = (typeof Singlish !== 'undefined') ? Singlish.prepareQuery(q) : null;
    return this.data.customers.filter(c => {
      const name = (c.name || '').toLowerCase();
      const phone = (c.phone || '');
      const nic = (c.nic || '').toLowerCase();
      if (name.includes(qLower) || phone.includes(q) || nic.includes(qLower)) return true;
      if (qPrepared && typeof Singlish !== 'undefined') {
        return Singlish.matchPrepared(c, qPrepared);
      }
      return false;
    }).sort((a,b)=>a.name.localeCompare(b.name));
  },

  async recordPayment(custId, amount, note){
    const res = await fetch(`/api/customers/${custId}/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, note })
    });
    if(res.ok) {
      const updated = await res.json();
      const idx = this.data.customers.findIndex(c => c.id === custId);
      if(idx !== -1) this.data.customers[idx] = updated;
      return updated;
    }
    return null;
  },

  /* ---------------- SALES ---------------- */
  async createSale(sale){
    const res = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sale)
    });
    const newSale = await res.json();
    this.data.sales.unshift(newSale);

    // --- PERFORMANCE: Update stock + customer balance in memory, no full reload ---
    for (const line of (sale.lines || [])) {
      const item = this.data.items.find(i => i.id === line.itemId);
      if (item) {
        item.qty = Math.max(0, Math.round((item.qty - line.qty) * 10000) / 10000);
      }
    }
    if (sale.paymentType === 'credit' && sale.customerId) {
      const customer = this.data.customers.find(c => c.id === sale.customerId);
      if (customer) {
        const paidNow = Number(newSale.amountPaid) || 0;
        const creditToAdd = Math.max(0, newSale.total - paidNow);
        customer.balance = (customer.balance || 0) + creditToAdd;
        customer.ledger = customer.ledger || [];
        customer.ledger.unshift({
          id: Date.now(),
          customerId: customer.id,
          date: newSale.date || Date.now(),
          type: 'sale',
          amount: newSale.total,
          note: `බිල් #${newSale.id}`,
          saleId: newSale.id
        });
        if (paidNow > 0) {
          customer.ledger.unshift({
            id: Date.now() + 1,
            customerId: customer.id,
            date: (newSale.date || Date.now()) + 1,
            type: 'payment',
            amount: Math.min(paidNow, newSale.total),
            note: `බිල් #${newSale.id} වෙනුවෙන් අත්පිට මුදල් (Advance)`,
            saleId: newSale.id
          });
        }
      }
    }
    return newSale;
  },
  allSales(){ return this.data.sales; },
  getSale(id){
    const numId = Number(id);
    return this.data.sales.find(s => s.id === numId) || null;
  },
  findSaleByBarcode(code){
    if (!code) return null;
    const clean = String(code).trim().toLowerCase();
    if (!clean) return null;

    // 1. Check if matches BILL-XXX, INV-XXX, or #XXX format
    const match = clean.match(/^(?:bill|inv)[-_]?(\d+)$/i) || clean.match(/^#(\d+)$/);
    if (match) {
      const saleId = Number(match[1]);
      const found = this.data.sales.find(s => s.id === saleId);
      if (found) return found;
    }

    // 2. Check explicit sale.barcode match
    const explicit = this.data.sales.find(s => (s.barcode || '').trim().toLowerCase() === clean);
    if (explicit) return explicit;

    // 3. Check "bill-<id>" generated pattern
    const byGen = this.data.sales.find(s => ('bill-' + s.id) === clean);
    if (byGen) return byGen;

    return null;
  },
  async deleteSale(id){
    await fetch(`/api/sales/${id}`, { method: 'DELETE' });
    const deleted = this.data.sales.find(x => x.id === id);
    this.data.sales = this.data.sales.filter(x => x.id !== id);

    // --- PERFORMANCE: Restore stock + customer balance in memory, no full reload ---
    if (deleted) {
      for (const line of (deleted.lines || [])) {
        const item = this.data.items.find(i => i.id === line.itemId);
        if (item) {
          item.qty = Math.round((item.qty + line.qty) * 10000) / 10000;
        }
      }
      if (deleted.paymentType === 'credit' && deleted.customerId) {
        const customer = this.data.customers.find(c => c.id === deleted.customerId);
        if (customer) {
          const dTotal = Number(deleted.total) || 0;
          const dPaid = Number(deleted.amountPaid) || 0;
          const creditAdded = Math.max(0, dTotal - dPaid);
          customer.balance = Math.max(0, (customer.balance || 0) - creditAdded);
        }
      }
    }
  },
  async clearAllSales(restoreStock = true){
    const res = await fetch('/api/sales/clear-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restoreStock })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to clear sales');
    }
    // --- PERFORMANCE: Clear locally, restore stock in-memory if needed ---
    if (restoreStock) {
      for (const sale of this.data.sales) {
        for (const line of (sale.lines || [])) {
          const item = this.data.items.find(i => i.id === line.itemId);
          if (item) item.qty = Math.round((item.qty + line.qty) * 10000) / 10000;
        }
        if (sale.paymentType === 'credit' && sale.customerId) {
          const customer = this.data.customers.find(c => c.id === sale.customerId);
          if (customer) {
            const sTotal = Number(sale.total) || 0;
            const sPaid = Number(sale.amountPaid) || 0;
            customer.balance = Math.max(0, (customer.balance || 0) - Math.max(0, sTotal - sPaid));
          }
        }
      }
    }
    this.data.sales = [];
    return true;
  },

  /* ---------------- STATS ---------------- */
  todaySales(){
    const start = new Date(); start.setHours(0,0,0,0);
    return this.data.sales.filter(s=>s.date >= start.getTime());
  },
  totalCreditOutstanding(){
    return this.data.customers.reduce((s,c)=>s + Math.max(0,c.balance), 0);
  },
  stockValue(){
    return this.data.items.reduce((s,i)=>s + i.qty*i.costPrice, 0);
  },

  /* ---------------- PURCHASES (කඩේට ගත් බිල්පත්) ---------------- */
  async addPurchase(p){
    const res = await fetch('/api/purchases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p)
    });
    const newP = await res.json();
    // --- PERFORMANCE: Push to local cache, no full reload ---
    this.data.purchases.unshift(newP);
    // If auto-update-stock was used, re-sync items from server once
    if (p.autoUpdateStock) {
      const itemsRes = await fetch('/api/items');
      this.data.items = await itemsRes.json();
    }
    return newP;
  },
  async updatePurchase(id, patch){
    const res = await fetch(`/api/purchases/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch)
    });
    if(res.ok) {
      const updated = await res.json();
      // --- PERFORMANCE: Update local cache in-place, no full reload ---
      const idx = this.data.purchases.findIndex(p => p.id === id);
      if(idx !== -1) this.data.purchases[idx] = updated;
      return updated;
    }
    return null;
  },
  async deletePurchase(id){
    await fetch(`/api/purchases/${id}`, { method: 'DELETE' });
    this.data.purchases = this.data.purchases.filter(p => p.id !== id);
  },
  async recordPurchasePayment(id, amount){
    const res = await fetch(`/api/purchases/${id}/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });
    if(res.ok) {
      const updated = await res.json();
      const idx = this.data.purchases.findIndex(p => p.id === id);
      if(idx !== -1) this.data.purchases[idx] = updated;
      return updated;
    }
    return null;
  },
  allPurchases(){ return this.data.purchases.slice().sort((a,b)=>b.id - a.id); },
  getPurchase(id){ return this.data.purchases.find(p=>p.id===id); },
  totalPurchaseDue(){ return this.data.purchases.reduce((s,p)=>s + (p.dueAmount||0), 0); },

  /* ---------------- RETURNS ---------------- */
  allReturns(){ return (this.data.returns || []).slice().sort((a,b)=>b.id - a.id); },
  getReturn(id){ return (this.data.returns || []).find(r=>r.id===id); },
  todayReturns(){
    const start = new Date(); start.setHours(0,0,0,0);
    const end = new Date(); end.setHours(23,59,59,999);
    return this.allReturns().filter(r => r.date >= start.getTime() && r.date <= end.getTime());
  },
  async createReturn(ret){
    const res = await fetch('/api/returns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ret)
    });
    const newReturn = await res.json();
    this.data.returns = this.data.returns || [];
    this.data.returns.unshift(newReturn);

    // Update in-memory stock: returned items (+)
    for (const item of (newReturn.items || [])) {
      const it = this.data.items.find(i => i.id === item.itemId);
      if (it) it.qty = Math.round((it.qty + (Number(item.qty || item.returnQty) || 0)) * 10000) / 10000;
    }

    // Update in-memory stock: exchange items taken (-)
    for (const item of (newReturn.exchangeItems || [])) {
      const it = this.data.items.find(i => i.id === item.itemId);
      if (it) it.qty = Math.max(0, Math.round((it.qty - (Number(item.qty) || 0)) * 10000) / 10000);
    }

    // Update in-memory customer balance
    if (newReturn.customerId) {
      const c = this.data.customers.find(cu => cu.id === newReturn.customerId);
      if (c) {
        if (newReturn.settlementType === 'credit_deduct' && newReturn.refundAmount > 0) {
          c.balance = Math.max(0, c.balance - Number(newReturn.refundAmount));
          c.ledger = c.ledger || [];
          c.ledger.unshift({
            id: Date.now(),
            customerId: c.id,
            date: newReturn.date || Date.now(),
            type: 'payment',
            amount: newReturn.refundAmount,
            note: `රිටන්/මාරු භාණ්ඩ (${newReturn.returnNo || 'Return'})`,
            saleId: newReturn.saleId
          });
        } else if (newReturn.settlementType === 'credit_added' && newReturn.extraPaid > 0) {
          c.balance = c.balance + Number(newReturn.extraPaid);
          c.ledger = c.ledger || [];
          c.ledger.unshift({
            id: Date.now(),
            customerId: c.id,
            date: newReturn.date || Date.now(),
            type: 'sale',
            amount: newReturn.extraPaid,
            note: `භාණ්ඩ මාරුකිරීමේ අමතර ණය (${newReturn.returnNo || 'Exchange'})`,
            saleId: newReturn.saleId
          });
        }
      }
    }
    this.invalidateItemsCache();
    return newReturn;
  },
  async deleteReturn(id){
    const ret = this.getReturn(id);
    await fetch(`/api/returns/${id}`, { method: 'DELETE' });
    this.data.returns = (this.data.returns || []).filter(r => r.id !== id);

    // Revert in-memory stock
    if (ret) {
      for (const item of (ret.items || [])) {
        const it = this.data.items.find(i => i.id === item.itemId);
        if (it) it.qty = Math.max(0, Math.round((it.qty - (Number(item.qty || item.returnQty) || 0)) * 10000) / 10000);
      }
      for (const item of (ret.exchangeItems || [])) {
        const it = this.data.items.find(i => i.id === item.itemId);
        if (it) it.qty = Math.round((it.qty + (Number(item.qty) || 0)) * 10000) / 10000;
      }
      if (ret.customerId) {
        const c = this.data.customers.find(cu => cu.id === ret.customerId);
        if (c) {
          if (ret.settlementType === 'credit_deduct' && ret.refundAmount > 0) {
            c.balance = c.balance + Number(ret.refundAmount);
          } else if (ret.settlementType === 'credit_added' && ret.extraPaid > 0) {
            c.balance = Math.max(0, c.balance - Number(ret.extraPaid));
          }
        }
      }
    }
    this.invalidateItemsCache();
  },

  /* ---------------- BACKUP & SETTINGS ---------------- */
  async exportJSON(){
    const res = await fetch('/api/backup');
    return await res.json();
  },
  async importJSON(jsonStr){
    const obj = JSON.parse(jsonStr);
    await fetch('/api/backup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj)
    });
    await this.reload();
  },
  async wipeAll(){
    await fetch('/api/wipe', { method: 'POST' });
    await this.reload();
  },
  async updateSettings(settingsObj) {
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsObj)
    });
    Object.assign(this.data.settings, settingsObj);
  },
  async updateShopName(name) {
    await this.updateSettings({ shopName: name });
  }
};

function fmt(n){
  n = Number(n)||0;
  return "රු. " + n.toLocaleString('en-LK', {minimumFractionDigits:2, maximumFractionDigits:2});
}
function fmtDate(ts){
  const d = new Date(ts);
  return d.toLocaleDateString('en-GB') + " " + d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
}

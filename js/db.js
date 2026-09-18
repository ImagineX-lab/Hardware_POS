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
      const [settingsRes, itemsRes, custRes, salesRes, purchasesRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/items'),
        fetch('/api/customers'),
        fetch('/api/sales'),
        fetch('/api/purchases')
      ]);
      this.data.settings = await settingsRes.json();
      this.data.items = await itemsRes.json();
      this.data.customers = await custRes.json();
      this.data.sales = await salesRes.json();
      this.data.purchases = await purchasesRes.json();
      this.invalidateItemsCache();
    } catch(err) {
      console.error("Failed to load data", err);
    }
    return this.data;
  },

  _sortedItemsCache: null,
  invalidateItemsCache() {
    this._sortedItemsCache = null;
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
    // No full reload needed — item already removed from local cache
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
    return this.data.customers.filter(c => 
      (typeof Singlish !== 'undefined' ? Singlish.match(c.name, q) : c.name.toLowerCase().includes(q.toLowerCase())) ||
      (c.phone || '').includes(q) ||
      (c.nic || '').toLowerCase().includes(q.toLowerCase())
    ).sort((a,b)=>a.name.localeCompare(b.name));
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
        customer.balance = (customer.balance || 0) + newSale.total;
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
          customer.balance = Math.max(0, (customer.balance || 0) - deleted.total);
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
          if (customer) customer.balance = Math.max(0, (customer.balance || 0) - sale.total);
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

/* =========================================================
   HardwarePOS — Data layer (Node.js API based)
   ========================================================= */

const DB = {
  data: {
    settings: { shopName: "HardwarePOS" },
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
    } catch(err) {
      console.error("Failed to load data", err);
    }
    return this.data;
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
      return updated;
    }
    return null;
  },
  async deleteItem(id){
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    this.data.items = this.data.items.filter(i => i.id !== id);
  },
  getItem(id){ return this.data.items.find(i=>i.id===id); },
  allItems(){ return this.data.items.slice().sort((a,b)=>a.name.localeCompare(b.name)); },
  lowStockItems(){ return this.data.items.filter(i=>i.qty <= i.reorderLevel); },

  /* ---------------- CUSTOMERS (Credit / Nayata) ---------------- */
  async addCustomer(c){
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(c)
    });
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
    // Reload items and customers to get correct stock and balance
    await this.reload();
    return newSale;
  },
  allSales(){ return this.data.sales; },
  async deleteSale(id){
    await fetch(`/api/sales/${id}`, { method: 'DELETE' });
    this.data.sales = this.data.sales.filter(x => x.id !== id);
    // Reload to fix stock and customer balances
    await this.reload();
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
    await this.reload();
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
      await this.reload();
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

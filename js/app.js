/* =========================================================
   HardwarePOS — App controller
   ========================================================= */

const App = {
  currentView: 'dashboard',
  titles: {},

  updateTitles(){
    this.titles = {
      dashboard: t('nav_dashboard'),
      sale: t('nav_sale'),
      items: t('nav_items'),
      purchases: t('nav_purchases'),
      stock: t('nav_stock'),
      lowstock: t('nav_lowstock'),
      customers: t('nav_customers'),
      history: t('nav_history'),
      settings: t('nav_settings')
    };
    if (document.getElementById('viewTitle')) {
      document.getElementById('viewTitle').textContent = this.titles[this.currentView] || '';
    }
  },

  async init(){
    await DB.load();
    document.getElementById('shopNameLabel').textContent = DB.data.settings.shopName || 'HardwarePOS';
    this.setDate();
    this.updateTitles();
    document.querySelectorAll('.nav-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        this.currentView = btn.dataset.view;
        this.render();
      });
    });
    this.bindGlobalShortcuts();
    this.render();
  },

  bindGlobalShortcuts(){
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const m = document.getElementById('activeModal');
        if (m) {
          closeModal();
          e.preventDefault();
          return;
        }
      }
      
      if (e.key === 'Enter') {
        const m = document.getElementById('activeModal');
        if (m) {
          const primaryBtn = m.querySelector('.btn-primary, .btn-danger, .btn-success');
          if (primaryBtn) {
            primaryBtn.click();
            e.preventDefault();
            return;
          }
        }
      }
      
      if (e.key === 'F2') {
        e.preventDefault();
        App.currentView = 'sale';
        App.render();
      } else if (e.key === 'F3') {
        e.preventDefault();
        App.currentView = 'items';
        App.render();
      } else if (e.key === 'F4') {
        e.preventDefault();
        App.currentView = 'dashboard';
        App.render();
      }

      if (App.currentView === 'sale' && !document.getElementById('activeModal')) {
        if (e.key === 'F8') { e.preventDefault(); document.getElementById('saleDiscount')?.focus(); }
        if (e.key === 'F9') { e.preventDefault(); document.getElementById('completeSaleBtn')?.click(); }
        if (e.key === 'F10') { e.preventDefault(); document.getElementById('clearCartBtn')?.click(); }
        if (e.altKey && e.code === 'KeyC') { e.preventDefault(); Views.sale.setPayType('cash'); }
        if (e.altKey && e.code === 'KeyR') { e.preventDefault(); Views.sale.setPayType('credit'); }
        if (e.key === '/') { e.preventDefault(); document.getElementById('saleSearch')?.focus(); }
      } else if ((App.currentView === 'items' || App.currentView === 'customers') && !document.getElementById('activeModal')) {
        if (e.altKey && e.code === 'KeyN') {
          e.preventDefault();
          if (App.currentView === 'items') Views.items.openAddModal();
          if (App.currentView === 'customers') Views.customers.openAddModal();
        }
      }
    });
  },

  setDate(){
    const el = document.getElementById('todayDate');
    if(!el) return;
    const update = () => {
      const d = new Date();
      const dateStr = d.toLocaleDateString('en-GB', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
      const timeStr = d.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true });
      el.innerHTML = `<span style="font-weight:500;">${dateStr}</span> <span style="margin:0 6px; color:var(--border);">|</span> <b style="color:var(--orange-dark); font-weight:700; font-family:monospace; font-size:14px;">⏰ ${timeStr}</b>`;
    };
    update();
    setInterval(update, 1000);
  },

  render(){
    document.querySelectorAll('.nav-btn').forEach(b=>{
      b.classList.toggle('active', b.dataset.view === this.currentView);
    });
    document.getElementById('viewTitle').textContent = this.titles[this.currentView] || '';

    const view = Views[this.currentView];
    const wrap = document.getElementById('viewWrap');
    wrap.innerHTML = view.render();
    if(view.bind) view.bind();

    this.updateSidebarCounts();
    if (typeof updateStaticTranslations === 'function') {
      updateStaticTranslations();
    }
  },

  updateSidebarCounts(){
    const el = document.getElementById('lowStockCount');
    if (!el) return;
    const n = DB.lowStockItems().length;
    el.textContent = n;
    el.style.display = n>0 ? 'flex' : 'none';
  }
};

document.addEventListener('DOMContentLoaded', ()=>App.init());

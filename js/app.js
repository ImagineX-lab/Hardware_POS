/* =========================================================
   HardwarePOS — App controller
   ========================================================= */

const App = {
  currentView: 'sale',
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

  applySettings(){
    const s = DB.data.settings || {};
    
    const shopNameLabel = document.getElementById('shopNameLabel');
    if (shopNameLabel) {
      shopNameLabel.textContent = s.shopName || 'HardwarePOS';
    }

    const logoWrap = document.getElementById('brandLogoWrap');
    const logoImg = document.getElementById('brandLogoImg');
    const brandMark = document.getElementById('brandMark');
    const logoSize = Number(s.logoSize) || 38;

    document.documentElement.style.setProperty('--logo-size', logoSize + 'px');

    if (s.logo && logoWrap && logoImg) {
      logoImg.src = s.logo;
      logoImg.style.height = logoSize + 'px';
      logoWrap.style.display = 'flex';
      if (brandMark) brandMark.style.display = 'none';
    } else {
      if (logoWrap) logoWrap.style.display = 'none';
      if (brandMark) brandMark.style.display = 'flex';
    }

    // Apply font size
    const fontSize = Number(s.fontSize) || 15;
    document.body.style.zoom = fontSize / 15;
  },

  async init(){
    await DB.load();
    this.applySettings();
    this.setDate();
    this.updateTitles();
    document.querySelectorAll('.nav-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        this.currentView = btn.dataset.view;
        this.render();
      });
    });

    document.addEventListener('focusin', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) {
        if (typeof e.target.select === 'function') {
          e.target.select();
        }
      }
    });

    // Bell dropdown toggle
    document.getElementById('bellBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = document.getElementById('notifDropdown');
      if (dropdown) {
        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';
      }
    });

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('notifDropdown');
      const bellBtn = document.getElementById('bellBtn');
      if (dropdown && bellBtn && !dropdown.contains(e.target) && !bellBtn.contains(e.target)) {
        dropdown.style.display = 'none';
      }
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

      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable;

      // Universal Form & Modal Arrow Keys Navigation (ArrowDown / ArrowUp)
      if (!e.defaultPrevented && isInput) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          // If a search suggest dropdown is open, let the view handle navigation
          const activeSuggest = document.querySelector('#saleSuggest [data-add-item], #custSuggestBox .cust-suggest-item');
          if (activeSuggest) return;

          const activeEl = document.activeElement;
          const modal = document.getElementById('activeModal');
          const container = modal ? modal : (activeEl.closest('form, .card, .view-wrap, main') || document.body);
          const fields = Array.from(container.querySelectorAll('input:not([type="hidden"]), select, textarea, button.btn-primary, button.btn-success, button.btn-danger'))
            .filter(el => el.offsetParent !== null && !el.disabled && el.tabIndex !== -1);
          
          const idx = fields.indexOf(activeEl);
          if (idx !== -1) {
            if (e.key === 'ArrowDown' && idx < fields.length - 1) {
              e.preventDefault();
              const next = fields[idx + 1];
              next.focus();
              if (typeof next.select === 'function') next.select();
            } else if (e.key === 'ArrowUp' && idx > 0) {
              e.preventDefault();
              const prev = fields[idx - 1];
              prev.focus();
              if (typeof prev.select === 'function') prev.select();
            }
          }
        }
      }

      if (!isInput && !document.getElementById('activeModal')) {
        if (e.key === 's' || e.key === 'S' || e.code === 'KeyS') {
          e.preventDefault();
          const searchInp = document.getElementById('saleSearch') || document.getElementById('itemsSearch') || document.getElementById('stockSearch') || document.getElementById('custSearch') || document.getElementById('purchasesSearch');
          if (searchInp) {
            searchInp.focus();
            if (typeof searchInp.select === 'function') searchInp.select();
          }
        }
        if (e.key === 'q' || e.key === 'Q' || e.code === 'KeyQ') {
          e.preventDefault();
          const qtyInps = document.querySelectorAll('[data-qty-idx]');
          if (qtyInps.length > 0) {
            const lastQtyInp = qtyInps[qtyInps.length - 1];
            lastQtyInp.focus();
            if (typeof lastQtyInp.select === 'function') lastQtyInp.select();
          }
        }
      }

      if (App.currentView === 'sale' && !document.getElementById('activeModal')) {
        // Tab switching and creation key handlers
        const activeEl = document.activeElement;
        const isAlt = e.altKey;
        const canSwitchTabs = !isInput || (activeEl?.id === 'saleSearch' && !activeEl.value) || isAlt;

        if (!isInput && (e.key === 'n' || e.key === 'N' || e.code === 'KeyN')) {
          e.preventDefault();
          if (Views.sale && typeof Views.sale.addTab === 'function') {
            Views.sale.addTab();
          }
        } else if (canSwitchTabs && e.key === 'ArrowLeft') {
          if (Views.sale && Views.sale.sessions && Views.sale.sessions.length > 1) {
            e.preventDefault();
            let newIdx = Views.sale.activeIdx - 1;
            if (newIdx < 0) newIdx = Views.sale.sessions.length - 1;
            Views.sale.switchTab(newIdx);
          }
        } else if (canSwitchTabs && e.key === 'ArrowRight') {
          if (Views.sale && Views.sale.sessions && Views.sale.sessions.length > 1) {
            e.preventDefault();
            let newIdx = Views.sale.activeIdx + 1;
            if (newIdx >= Views.sale.sessions.length) newIdx = 0;
            Views.sale.switchTab(newIdx);
          }
        }

        if (e.altKey && (e.code === 'KeyQ' || e.key === 'q' || e.key === 'Q')) {
          e.preventDefault();
          const qtyInps = document.querySelectorAll('[data-qty-idx]');
          if (qtyInps.length > 0) {
            const lastQtyInp = qtyInps[qtyInps.length - 1];
            lastQtyInp.focus();
            if (typeof lastQtyInp.select === 'function') lastQtyInp.select();
          }
        }
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
      el.innerHTML = `<span style="font-weight:500;">${dateStr}</span> <span style="margin:0 6px; color:var(--border);">|</span> <b style="color:var(--primary); font-weight:700; font-family:monospace; font-size:14px;">${timeStr}</b>`;
    };
    update();
    setInterval(update, 1000);
  },

  render(){
    // Save current sale session before navigating away from sale view
    if (this.currentView !== 'sale' && Views.sale && Views.sale.saveSession) {
      try { Views.sale.saveSession(); } catch(e) {}
    }

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
    this.updateNotifications();
  },

  updateSidebarCounts(){
    const el = document.getElementById('lowStockCount');
    if (!el) return;
    const n = DB.lowStockItems().length;
    el.textContent = n;
    el.style.display = n>0 ? 'flex' : 'none';
  },

  updateNotifications() {
    const bellBadge = document.getElementById('bellBadge');
    const notifCount = document.getElementById('notifCount');
    const notifList = document.getElementById('notifList');
    if (!bellBadge || !notifCount || !notifList) return;

    const lowItems = DB.lowStockItems() || [];
    const count = lowItems.length;

    notifCount.textContent = count;
    if (count > 0) {
      bellBadge.style.display = 'block';
      notifCount.style.display = 'inline-block';
      notifList.innerHTML = lowItems.map(item => `
        <div class="notif-item" data-notif-item-id="${item.id}">
          <span class="notif-item-icon"><i class="ph ph-warning-octagon"></i></span>
          <div style="flex:1;">
            <div class="notif-item-title">${escapeHTML(item.name)} ${t('notif_low_stock')}</div>
            <div class="notif-item-desc">${t('notif_current')}: <b>${item.qty} ${escapeHTML(item.unit)}</b> &nbsp;•&nbsp; ${t('notif_reorder')}: <b>${item.reorderLevel}</b></div>
          </div>
        </div>
      `).join('');

      // Bind click handlers to notification items
      notifList.querySelectorAll('.notif-item').forEach(el => {
        el.addEventListener('click', () => {
          const itemId = Number(el.dataset.notifItemId);
          const item = DB.allItems().find(i => i.id === itemId);
          if (item) {
            Views.items.searchQ = item.name;
            App.currentView = 'items';
            App.render();
            // Focus and select the search input
            setTimeout(() => {
              const inp = document.getElementById('itemsSearch');
              if (inp) {
                inp.value = item.name;
                inp.focus();
                inp.select();
              }
            }, 100);
          }
          document.getElementById('notifDropdown').style.display = 'none';
        });
      });
    } else {
      bellBadge.style.display = 'none';
      notifCount.style.display = 'none';
      notifList.innerHTML = `
        <div class="notif-empty">
          <div class="notif-empty-icon"><i class="ph ph-check-circle"></i></div>
          <div class="notif-empty-text">${t('notif_empty')}</div>
        </div>
      `;
    }
  }
};

document.addEventListener('DOMContentLoaded', ()=>App.init());

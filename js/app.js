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
      shopNameLabel.textContent = s.shopName || 'රත්න හාඩ්වෙයාර්';
    }

    const logoWrap = document.getElementById('brandLogoWrap');
    const logoImg = document.getElementById('brandLogoImg');
    const brandMark = document.getElementById('brandMark');
    const logoSize = Number(s.logoSize) || 38;

    document.documentElement.style.setProperty('--logo-size', logoSize + 'px');

    const logoSrc = s.logo || 'icon.png';
    if (logoWrap && logoImg) {
      logoImg.src = logoSrc;
      logoImg.style.height = logoSize + 'px';
      logoWrap.style.display = 'flex';
    }
    // Always hide brand mark and shop name text — logo only
    if (brandMark) brandMark.style.display = 'none';
    const brandText = document.querySelector('.brand-text');
    if (brandText) brandText.style.display = 'none';

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

    // Calculator button toggle
    document.getElementById('topbarCalcBtn')?.addEventListener('click', () => {
      App.openCalculator();
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
    if (typeof BarcodeSystem !== 'undefined' && BarcodeSystem.initGlobalScanner) {
      BarcodeSystem.initGlobalScanner();
    }
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
        App.currentView = 'stock';
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
        if (e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          App.openCalculator();
          return;
        }

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
        if (e.key === 'l' || e.key === 'L' || e.code === 'KeyL') {
          e.preventDefault();
          const looseBtns = document.querySelectorAll('[data-loose-idx]');
          if (looseBtns.length > 0) {
            const lastLooseBtn = looseBtns[looseBtns.length - 1];
            lastLooseBtn.focus();
            lastLooseBtn.scrollIntoView({ block: 'nearest' });
          }
        }
      }

      if (App.currentView === 'sale' && !document.getElementById('activeModal')) {
        // Tab switching and creation key handlers
        const activeEl = document.activeElement;
        const isAlt = e.altKey;
        const isPayBtn = activeEl?.id === 'payCashBtn' || activeEl?.id === 'payCreditBtn';
        const canSwitchTabs = (!isInput && !isPayBtn) || (activeEl?.id === 'saleSearch' && !activeEl.value) || isAlt;

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
        if (e.altKey && (e.code === 'KeyL' || e.key === 'l' || e.key === 'L')) {
          e.preventDefault();
          const looseBtns = document.querySelectorAll('[data-loose-idx]');
          if (looseBtns.length > 0) {
            const lastLooseBtn = looseBtns[looseBtns.length - 1];
            lastLooseBtn.focus();
            lastLooseBtn.scrollIntoView({ block: 'nearest' });
          }
        }
        if (e.key === 'F8') { e.preventDefault(); document.getElementById('saleDiscount')?.focus(); }
        if (e.key === 'F9') { e.preventDefault(); document.getElementById('completeSaleBtn')?.click(); }
        if (e.key === 'F10') { e.preventDefault(); document.getElementById('clearCartBtn')?.click(); }
        if (e.altKey && e.code === 'KeyC') { e.preventDefault(); Views.sale.setPayType('cash'); }
        if (e.altKey && e.code === 'KeyR') { e.preventDefault(); Views.sale.setPayType('credit'); }
        if (e.key === '/') { e.preventDefault(); document.getElementById('saleSearch')?.focus(); }
      } else if (((App.currentView === 'stock' && Views.stock.activeTab === 'items') || App.currentView === 'customers') && !document.getElementById('activeModal')) {
        if (e.altKey && e.code === 'KeyN') {
          e.preventDefault();
          if (App.currentView === 'stock') Views.items.openAddModal();
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
            Views.stock.activeTab = 'report';
            Views.stock.itemsSearchQ = item.name;
            Views.stock.reportSearchQ = item.name;
            App.currentView = 'stock';
            App.render();
            // Focus and select the search input
            setTimeout(() => {
              const inp = document.getElementById('stockSearch') || document.getElementById('itemsSearch');
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
  },

  openCalculator() {
    let current = '0';
    let prev = null;
    let op = null;
    let resetNext = false;

    openModal({
      title: (typeof currentLang !== 'undefined' && currentLang === 'si') ? '🧮 කැල්කියුලේටරය (Calculator)' : '🧮 Calculator',
      bodyHTML: `
        <div class="pos-calculator">
          <div class="calc-display-wrap">
            <div class="calc-history" id="calcHistory">&nbsp;</div>
            <div class="calc-current" id="calcCurrent">0</div>
          </div>
          <div class="calc-grid">
            <button type="button" class="calc-btn calc-btn-fn" data-calc-action="clear">AC</button>
            <button type="button" class="calc-btn calc-btn-fn" data-calc-action="backspace" title="Delete"><i class="ph ph-backspace" style="font-size:18px;"></i></button>
            <button type="button" class="calc-btn calc-btn-fn" data-calc-action="percent">%</button>
            <button type="button" class="calc-btn calc-btn-op" data-calc-op="/">÷</button>
            
            <button type="button" class="calc-btn calc-btn-num" data-calc-num="7">7</button>
            <button type="button" class="calc-btn calc-btn-num" data-calc-num="8">8</button>
            <button type="button" class="calc-btn calc-btn-num" data-calc-num="9">9</button>
            <button type="button" class="calc-btn calc-btn-op" data-calc-op="*">×</button>
            
            <button type="button" class="calc-btn calc-btn-num" data-calc-num="4">4</button>
            <button type="button" class="calc-btn calc-btn-num" data-calc-num="5">5</button>
            <button type="button" class="calc-btn calc-btn-num" data-calc-num="6">6</button>
            <button type="button" class="calc-btn calc-btn-op" data-calc-op="-">−</button>
            
            <button type="button" class="calc-btn calc-btn-num" data-calc-num="1">1</button>
            <button type="button" class="calc-btn calc-btn-num" data-calc-num="2">2</button>
            <button type="button" class="calc-btn calc-btn-num" data-calc-num="3">3</button>
            <button type="button" class="calc-btn calc-btn-op" data-calc-op="+">+</button>
            
            <button type="button" class="calc-btn calc-btn-num" data-calc-action="sign">±</button>
            <button type="button" class="calc-btn calc-btn-num" data-calc-num="0">0</button>
            <button type="button" class="calc-btn calc-btn-num" data-calc-num=".">.</button>
            <button type="button" class="calc-btn calc-btn-equals" data-calc-action="equals">=</button>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px; gap:10px;">
            <button type="button" class="btn btn-outline" id="calcCopyBtn" style="flex:1; display:flex; align-items:center; justify-content:center; gap:6px; font-size:13px; padding:8px 12px;">
              <i class="ph ph-copy" style="font-size:16px;"></i> ${(typeof currentLang !== 'undefined' && currentLang === 'si') ? 'අගය Copy කරන්න' : 'Copy Result'}
            </button>
            <button type="button" class="btn btn-primary" data-close style="flex:1; font-size:13px; padding:8px 12px;">
              ${t('close')}
            </button>
          </div>
        </div>
      `,
      onMount: (wrap) => {
        const curEl = wrap.querySelector('#calcCurrent');
        const histEl = wrap.querySelector('#calcHistory');

        const updateDisplay = () => {
          if (curEl) curEl.textContent = current;
          if (histEl) {
            if (prev !== null && op !== null) {
              const opSym = op === '*' ? '×' : op === '/' ? '÷' : op === '-' ? '−' : '+';
              histEl.textContent = `${prev} ${opSym}`;
            } else {
              histEl.innerHTML = '&nbsp;';
            }
          }
        };

        const inputDigit = (digit) => {
          if (resetNext) {
            current = digit === '.' ? '0.' : digit;
            resetNext = false;
          } else {
            if (digit === '.') {
              if (!current.includes('.')) current += '.';
            } else {
              current = current === '0' ? digit : current + digit;
            }
          }
          updateDisplay();
        };

        const calculate = (first, second, operator) => {
          if (operator === '+') return first + second;
          if (operator === '-') return first - second;
          if (operator === '*') return first * second;
          if (operator === '/') return second !== 0 ? first / second : 0;
          return second;
        };

        const handleOp = (nextOp) => {
          const inputValue = parseFloat(current);
          if (prev === null) {
            prev = inputValue;
          } else if (op) {
            const result = calculate(prev, inputValue, op);
            current = String(Math.round(result * 100000000) / 100000000);
            prev = parseFloat(current);
          }
          resetNext = true;
          op = nextOp;
          updateDisplay();
        };

        const handleEquals = () => {
          if (op === null || prev === null) return;
          const inputValue = parseFloat(current);
          const result = calculate(prev, inputValue, op);
          const opSym = op === '*' ? '×' : op === '/' ? '÷' : op === '-' ? '−' : '+';
          if (histEl) histEl.textContent = `${prev} ${opSym} ${inputValue} =`;
          current = String(Math.round(result * 100000000) / 100000000);
          prev = null;
          op = null;
          resetNext = true;
          if (curEl) curEl.textContent = current;
        };

        const handleClear = () => {
          current = '0';
          prev = null;
          op = null;
          resetNext = false;
          updateDisplay();
        };

        const handleBackspace = () => {
          if (resetNext) return;
          if (current.length > 1) {
            current = current.slice(0, -1);
          } else {
            current = '0';
          }
          updateDisplay();
        };

        const handlePercent = () => {
          const val = parseFloat(current);
          current = String(Math.round((val / 100) * 100000000) / 100000000);
          updateDisplay();
        };

        const handleSign = () => {
          const val = parseFloat(current);
          current = String(val * -1);
          updateDisplay();
        };

        // Number button clicks
        wrap.querySelectorAll('[data-calc-num]').forEach(b => {
          b.addEventListener('click', () => inputDigit(b.dataset.calcNum));
        });

        // Op button clicks
        wrap.querySelectorAll('[data-calc-op]').forEach(b => {
          b.addEventListener('click', () => handleOp(b.dataset.calcOp));
        });

        // Action button clicks
        wrap.querySelectorAll('[data-calc-action]').forEach(b => {
          b.addEventListener('click', () => {
            const action = b.dataset.calcAction;
            if (action === 'clear') handleClear();
            else if (action === 'backspace') handleBackspace();
            else if (action === 'percent') handlePercent();
            else if (action === 'sign') handleSign();
            else if (action === 'equals') handleEquals();
          });
        });

        // Copy button
        const copyBtn = wrap.querySelector('#calcCopyBtn');
        if (copyBtn) {
          copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(current).then(() => {
              toast((typeof currentLang !== 'undefined' && currentLang === 'si') ? `අගය පිටපත් කරගන්නා ලදී: ${current}` : `Copied: ${current}`, 'ok');
            }).catch(() => {
              toast(`Result: ${current}`, 'ok');
            });
          });
        }

        // Keyboard listener inside modal
        const keyHandler = (e) => {
          const activeModal = document.getElementById('activeModal');
          if (!activeModal || !activeModal.contains(wrap)) {
            document.removeEventListener('keydown', keyHandler);
            return;
          }
          if (e.key >= '0' && e.key <= '9') {
            e.preventDefault();
            inputDigit(e.key);
          } else if (e.key === '.') {
            e.preventDefault();
            inputDigit('.');
          } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            e.preventDefault();
            handleOp(e.key);
          } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            handleEquals();
          } else if (e.key === 'Backspace') {
            e.preventDefault();
            handleBackspace();
          } else if (e.key === 'c' || e.key === 'C') {
            e.preventDefault();
            handleClear();
          } else if (e.key === '%') {
            e.preventDefault();
            handlePercent();
          }
        };
        document.addEventListener('keydown', keyHandler);
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', ()=>App.init());

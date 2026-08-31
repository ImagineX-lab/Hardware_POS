/* =========================================================
   HardwarePOS — UI helpers (toast, modal)
   ========================================================= */

function toast(msg, type=""){
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = "toast show " + type;
  clearTimeout(toast._t);
  toast._t = setTimeout(()=>{ el.className = "toast " + type; }, 2600);
}

function openModal({title, bodyHTML, footHTML, wide=false, onMount}){
  closeModal();
  const root = document.getElementById('modalRoot');
  const wrap = document.createElement('div');
  wrap.className = 'modal-backdrop';
  wrap.id = 'activeModal';
  wrap.innerHTML = `
    <div class="modal ${wide?'wide':''}">
      <div class="modal-head">
        <h3>${title}</h3>
        <button class="modal-close" data-close>&times;</button>
      </div>
      <div class="modal-body">${bodyHTML}</div>
      ${footHTML ? `<div class="modal-foot">${footHTML}</div>` : ''}
    </div>
  `;
  root.appendChild(wrap);
  wrap.addEventListener('click', (e)=>{
    if(e.target === wrap || e.target.hasAttribute('data-close')) closeModal();
  });
  if(onMount) onMount(wrap);
}
function closeModal(){
  const m = document.getElementById('activeModal');
  if(m) m.remove();
}

function confirmAction(message, onYes){
  openModal({
    title:t('confirm'),
    bodyHTML:`<p>${message}</p>`,
    footHTML:`
      <button class="btn btn-outline" data-close>${t('cancel')}</button>
      <button class="btn btn-danger" id="confirmYesBtn">${t('confirm')}</button>
    `,
    onMount:(wrap)=>{
      wrap.querySelector('#confirmYesBtn').addEventListener('click', ()=>{
        closeModal();
        onYes();
      });
    }
  });
}

function escapeHTML(str){
  return String(str ?? "").replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

/* =========================================================
   HardwarePOS — Validation Helpers (Phone, NIC, Form Fields)
   ========================================================= */

const Validators = {
  /**
   * Validates Sri Lankan and standard Phone Numbers.
   * Allows optional empty string.
   * Formats accepted:
   * - 07XXXXXXXX or 011XXXXXXX (10 digits starting with 0)
   * - +947XXXXXXXX (+94 followed by 9 digits)
   * - 947XXXXXXXX (94 followed by 9 digits)
   * - 7XXXXXXXX (9 digits)
   */
  validatePhone(phone) {
    if (phone === undefined || phone === null) return { valid: true, value: '', clean: '' };
    const raw = String(phone).trim();
    if (!raw) return { valid: true, value: '', clean: '' };

    const clean = raw.replace(/[\s\-\(\)\.]/g, '');
    
    const is10Digit = /^0[1-9][0-9]{8}$/.test(clean);
    const isPlus94 = /^\+94[1-9][0-9]{8}$/.test(clean);
    const is94 = /^94[1-9][0-9]{8}$/.test(clean);
    const is9Digit = /^[1-9][0-9]{8}$/.test(clean);

    if (is10Digit || isPlus94 || is94 || is9Digit) {
      let normalized = clean;
      if (isPlus94) normalized = '0' + clean.slice(3);
      else if (is94) normalized = '0' + clean.slice(2);
      else if (is9Digit) normalized = '0' + clean;
      return { valid: true, value: normalized, clean };
    }

    return {
      valid: false,
      value: raw,
      clean,
      error: typeof t === 'function' ? t('cust_err_phone') : 'දුරකථන අංකය වැරදියි! (උදා: 07XXXXXXXX / 011XXXXXXX)'
    };
  },

  /**
   * Validates Sri Lankan NIC (National Identity Card).
   * Allows optional empty string.
   * Formats accepted:
   * - Old NIC: 9 digits + V/X/v/x (e.g. 901234567V)
   * - New NIC: 12 digits (e.g. 199012345678)
   */
  validateNIC(nic) {
    if (nic === undefined || nic === null) return { valid: true, value: '', clean: '' };
    const raw = String(nic).trim();
    if (!raw) return { valid: true, value: '', clean: '' };

    const clean = raw.replace(/[\s\-\.]/g, '').toUpperCase();

    const isOldNIC = /^[0-9]{9}[VX]$/.test(clean);
    const isNewNIC = /^[0-9]{12}$/.test(clean);

    if (isOldNIC) {
      const day = parseInt(clean.substring(2, 5), 10);
      if ((day >= 1 && day <= 366) || (day >= 501 && day <= 866)) {
        return { valid: true, value: clean, clean, type: 'old' };
      }
    } else if (isNewNIC) {
      const year = parseInt(clean.substring(0, 4), 10);
      const day = parseInt(clean.substring(4, 7), 10);
      const currentYear = new Date().getFullYear();
      if (year >= 1900 && year <= currentYear && ((day >= 1 && day <= 366) || (day >= 501 && day <= 866))) {
        return { valid: true, value: clean, clean, type: 'new' };
      }
    }

    return {
      valid: false,
      value: raw,
      clean,
      error: typeof t === 'function' ? t('cust_err_nic') : 'ජාතික හැඳුනුම්පත් (NIC) අංකය වැරදියි! (උදා: 901234567V හෝ 199012345678)'
    };
  },

  /**
   * Validates customer name (required, non-empty)
   */
  validateName(name) {
    const raw = String(name || '').trim();
    if (!raw) {
      return {
        valid: false,
        value: '',
        error: typeof t === 'function' ? t('cust_err_name') : 'නම ඇතුළත් කරන්න'
      };
    }
    return { valid: true, value: raw };
  }
};

function setInputError(inputEl, errorEl, message) {
  if (!inputEl) return;
  inputEl.classList.add('is-invalid');
  inputEl.classList.remove('is-valid');
  inputEl.classList.add('shake-anim');
  setTimeout(() => inputEl.classList.remove('shake-anim'), 500);

  if (errorEl) {
    errorEl.textContent = message || '';
    errorEl.style.display = message ? 'block' : 'none';
  }
}

function clearInputError(inputEl, errorEl) {
  if (!inputEl) return;
  inputEl.classList.remove('is-invalid');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.style.display = 'none';
  }
}

function setInputValid(inputEl, errorEl) {
  if (!inputEl) return;
  inputEl.classList.remove('is-invalid');
  inputEl.classList.add('is-valid');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.style.display = 'none';
  }
}


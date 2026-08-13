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

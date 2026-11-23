document.addEventListener('DOMContentLoaded', () => {

  const isValidEmail = (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);

  /* ---------- Breath pacer (4s in / 6s out) ---------- */
  const pattern = [{ type: 'in', sec: 4 }, { type: 'out', sec: 6 }];
  const total = pattern.reduce((a, p) => a + p.sec, 0);
  const easeInOut = (x) => { x = Math.max(0, Math.min(1, x)); return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };

  const computeBreath = (t) => {
    let acc = 0, start = 0.6;
    for (let i = 0; i < pattern.length; i++) {
      const p = pattern[i];
      const end = p.type === 'in' ? 1 : 0.6;
      if (t < acc + p.sec || i === pattern.length - 1) {
        const local = Math.max(0, Math.min(p.sec, t - acc));
        const scale = start + (end - start) * easeInOut(local / p.sec);
        const label = p.type === 'in' ? 'Breathe in' : 'Breathe out';
        const count = p.type === 'in' ? Math.min(Math.ceil(p.sec), Math.floor(local) + 1) : Math.max(1, Math.ceil(p.sec - local));
        return { scale, label, count };
      }
      acc += p.sec; start = end;
    }
    return { scale: 0.6, label: 'Ready', count: '' };
  };

  const pacerBtn = document.getElementById('pacerBtn');
  const pacerCircle = document.getElementById('pacerCircle');
  const pacerState = document.getElementById('pacerState');
  const pacerCount = document.getElementById('pacerCount');
  let breathOn = false, breathStart = 0, breathTimer = null;

  const stopBreath = () => {
    if (breathTimer) { clearInterval(breathTimer); breathTimer = null; }
    breathOn = false;
    pacerBtn.textContent = 'Begin the breath';
    pacerState.textContent = 'Ready';
    pacerCount.textContent = '·';
    pacerCircle.style.transform = 'scale(.6)';
  };

  const startBreath = () => {
    breathStart = Date.now();
    breathOn = true;
    pacerBtn.textContent = 'Pause';
    if (breathTimer) clearInterval(breathTimer);
    breathTimer = setInterval(() => {
      const t = ((Date.now() - breathStart) / 1000) % total;
      const cur = computeBreath(t);
      pacerCircle.style.transform = 'scale(' + cur.scale.toFixed(3) + ')';
      pacerState.textContent = cur.label;
      pacerCount.textContent = cur.count;
    }, 50);
  };

  if (pacerBtn) {
    pacerBtn.addEventListener('click', () => breathOn ? stopBreath() : startBreath());
  }

  /* ---------- Closing prompt (persisted) ---------- */
  const setdown = document.getElementById('setdownInput');
  if (setdown) {
    try { const s = localStorage.getItem('m2a_reset_setdown'); if (s) setdown.value = s; } catch (e) {}
    setdown.addEventListener('input', () => {
      try { localStorage.setItem('m2a_reset_setdown', setdown.value); } catch (e) {}
    });
  }

  /* ---------- Lead capture (hero "Unlock the Reset") ---------- */
  const leadForm = document.getElementById('leadForm');
  const leadDone = document.getElementById('leadDone');
  const leadEmail = document.getElementById('leadEmail');

  const renderLeadState = () => {
    let saved = null;
    try { const l = localStorage.getItem('m2a_lead'); if (l) saved = JSON.parse(l); } catch (e) {}
    if (saved) {
      leadForm.classList.add('md-hidden');
      leadDone.classList.remove('md-hidden');
    } else {
      leadForm.classList.remove('md-hidden');
      leadDone.classList.add('md-hidden');
    }
  };

  if (leadForm) {
    const submitLead = () => {
      const em = (leadEmail.value || '').trim();
      if (!isValidEmail(em)) { window.alert('Please enter a valid email.'); return; }
      try { localStorage.setItem('m2a_lead', JSON.stringify({ email: em, at: Date.now() })); } catch (e) {}
      renderLeadState();
    };
    leadForm.querySelector('button').addEventListener('click', submitLead);
    leadEmail.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitLead(); });
    renderLeadState();
  }

  /* ---------- Early-access waitlist (shared across two forms) ---------- */
  const waitForms = document.querySelectorAll('[data-wait-form]');
  const waitDones = document.querySelectorAll('[data-wait-done]');

  const renderWaitState = () => {
    let saved = null;
    try { const w = localStorage.getItem('m2a_waitlist'); if (w) saved = JSON.parse(w); } catch (e) {}
    waitForms.forEach((f) => f.classList.toggle('md-hidden', !!saved));
    waitDones.forEach((d) => d.classList.toggle('md-hidden', !saved));
  };

  const submitWaitlist = (input) => {
    const em = (input.value || '').trim();
    if (!isValidEmail(em)) { window.alert('Please enter a valid email.'); return; }
    try { localStorage.setItem('m2a_waitlist', JSON.stringify({ email: em, at: Date.now() })); } catch (e) {}
    renderWaitState();
  };

  waitForms.forEach((form) => {
    const input = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button');
    btn.addEventListener('click', () => submitWaitlist(input));
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitWaitlist(input); });
  });
  renderWaitState();

  /* ---------- Nav / scroll-to ---------- */
  document.querySelectorAll('[data-scroll-to]').forEach((el) => {
    el.addEventListener('click', () => {
      const target = document.getElementById(el.getAttribute('data-scroll-to'));
      if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 96, behavior: 'smooth' });
    });
  });

});

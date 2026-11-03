/* Shared presentation helpers; no model keys or task text are collected. */
(() => {
  const page = document.body.dataset.statsPage;
  const display = data => {
    for (const key of ['visits', 'visitors']) {
      if (!Number.isSafeInteger(data[key]) || data[key] < 0) throw new Error('Invalid counter');
      document.querySelectorAll(`[data-stat="${key}"]`).forEach(el => el.textContent = data[key].toLocaleString());
    }
    document.querySelectorAll('[data-stats-status]').forEach(el => el.textContent = 'Anonymous browser counts · refreshes are not counted again in this session');
  };
  if (page) {
    const base = location.hostname === 'mas-loop-demo.hehailin.life' || ['localhost', '127.0.0.1'].includes(location.hostname)
      ? location.origin : 'https://mas-loop-demo.hehailin.life';
    let ids;
    try {
      let visitor = localStorage.getItem('mas-loop-visitor');
      if (!visitor) { visitor = crypto.randomUUID(); localStorage.setItem('mas-loop-visitor', visitor); }
      let session = sessionStorage.getItem(`mas-loop-session-${page}`);
      if (!session) { session = crypto.randomUUID(); sessionStorage.setItem(`mas-loop-session-${page}`, session); }
      ids = {page, visitor, session};
    } catch (_) { /* Read-only counts when browser storage is unavailable. */ }
    const url = ids ? `${base}/api/visit` : `${base}/api/stats?page=${page}`;
    fetch(url, {method: ids ? 'POST' : 'GET', ...(ids ? {headers:{'Content-Type':'application/json'}, body:JSON.stringify(ids)} : {}), credentials:'omit', signal:AbortSignal.timeout(8000)})
      .then(r => {if (!r.ok) throw new Error('Counter unavailable'); return r.json();})
      .then(display).catch(() => {
        document.querySelectorAll('[data-stats-status]').forEach(el => el.textContent = 'Visit statistics are temporarily unavailable.');
      });
  }
  const dialog = document.querySelector('#figure-dialog');
  if (dialog) {
    const image = dialog.querySelector('img');
    document.querySelectorAll('[data-zoom]').forEach(link => link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault(); image.src = link.href; image.alt = link.querySelector('img')?.alt || 'Full-size paper figure';
      dialog.showModal();
    }));
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {if (event.target === dialog) dialog.close();});
  }
  document.querySelectorAll('[data-copy-citation]').forEach(button => button.addEventListener('click', async () => {
    try {await navigator.clipboard.writeText(document.querySelector('#bibtex').textContent); button.textContent = 'Copied';}
    catch (_) {button.textContent = 'Select the citation below to copy';}
    setTimeout(() => button.textContent = 'Copy BibTeX', 2500);
  }));
})();

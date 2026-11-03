/* Same public CountAPI service as Skill-MAS; one hit per tab session, not unique people. */
(() => {
  const id = document.body.dataset.pageId;
  const displays = [...document.querySelectorAll('[data-view-count]')];
  if (!id || !displays.length) return;
  const localPreview = !['linhh29.github.io', 'mas-gate-demo.hehailin.life'].includes(location.hostname);
  if (localPreview) {
    displays.forEach(el => { el.textContent = 'Preview'; });
    return;
  }
  const sessionKey = `mas_gate_view_${id}`;
  let counted = false;
  try { counted = sessionStorage.getItem(sessionKey) === '1'; } catch { /* Storage may be disabled. */ }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const key = encodeURIComponent(`linhh29.github.io-${id}`);
  fetch(`https://countapi.mileshilliard.com/api/v1/${counted ? 'get' : 'hit'}/${key}`, {
    signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer'
  }).then(async response => {
    if (!response.ok) throw new Error('Count unavailable');
    const data = await response.json();
    if (data.value == null || !Number.isSafeInteger(Number(data.value)) || Number(data.value) < 0) throw new Error('Invalid count');
    try { sessionStorage.setItem(sessionKey, '1'); } catch { /* Display still works without storage. */ }
    displays.forEach(el => { el.textContent = Number(data.value).toLocaleString('en-US'); });
  }).catch(() => {
    displays.forEach(el => {
      el.textContent = 'Unavailable';
      el.closest('.view-stat').title = 'The visit counter is temporarily unavailable. The rest of the page is ready to use.';
    });
  }).finally(() => clearTimeout(timeout));
})();

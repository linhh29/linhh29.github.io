(() => {
  const dialog = document.querySelector('#figure-dialog');
  const image = dialog.querySelector('img');
  const caption = dialog.querySelector('#figure-title');
  document.querySelectorAll('figure a[data-figure]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || typeof dialog.showModal !== 'function') return;
      event.preventDefault();
      const original = link.querySelector('img');
      image.src = link.href;
      image.alt = original.alt;
      image.width = original.width;
      image.height = original.height;
      caption.textContent = original.alt;
      dialog.showModal();
    });
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  document.querySelector('#copy-citation').addEventListener('click', async event => {
    const button = event.currentTarget;
    try {
      await navigator.clipboard.writeText(document.querySelector('#citation-text').textContent);
      button.textContent = 'Copied';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('#citation-text'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = 'Selected — press Ctrl/Cmd+C';
    }
    setTimeout(() => { button.textContent = 'Copy BibTeX'; }, 3500);
  });
})();

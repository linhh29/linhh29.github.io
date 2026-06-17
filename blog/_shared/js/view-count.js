/**
 * Blog page view counter via CountAPI (countapi.mileshilliard.com).
 * Requires: <body data-blog-id="..."> and [data-blog-view-count] elements.
 */
const COUNT_API = 'https://countapi.mileshilliard.com/api/v1';
const KEY_PREFIX = 'linhh29.github.io-';

function formatCount(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function updateDisplay(count) {
  const text = formatCount(count);
  document.querySelectorAll('[data-blog-view-count]').forEach((el) => {
    el.textContent = text;
    el.closest('.blog-view-count')?.classList.remove('is-loading');
  });
}

function clearLoading() {
  document.querySelectorAll('.blog-view-count').forEach((el) => {
    el.classList.remove('is-loading');
  });
}

async function fetchCount(action, blogId) {
  const key = `${KEY_PREFIX}${blogId}`;
  const res = await fetch(`${COUNT_API}/${action}/${encodeURIComponent(key)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return Number(data.value);
}

async function trackView(blogId) {
  const sessionKey = `blog_pv_session_${blogId}`;
  const alreadyCounted = sessionStorage.getItem(sessionKey);

  const count = alreadyCounted
    ? await fetchCount('get', blogId)
    : await fetchCount('hit', blogId);

  if (!alreadyCounted) {
    sessionStorage.setItem(sessionKey, '1');
  }

  return count;
}

const blogId = document.body?.dataset?.blogId;
if (!blogId) {
  console.warn('[view-count] Missing data-blog-id on <body>.');
} else {
  trackView(blogId)
    .then(updateDisplay)
    .catch((err) => {
      console.warn('[view-count] Failed to track view:', err);
      clearLoading();
    });
}

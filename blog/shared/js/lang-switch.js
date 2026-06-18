(function () {
  'use strict';

  // Determine current language from the page URL
  const isZh = window.location.pathname.endsWith('.zh.html');
  const currentLang = isZh ? 'zh' : 'en';

  // Derive the counterpart URL
  function getCounterpartUrl() {
    const path = window.location.pathname;
    if (isZh) {
      return path.replace('.zh.html', '.html');
    }
    // Replace index.html or just the trailing slash file
    if (path.endsWith('index.html')) {
      return path.replace('index.html', 'index.zh.html');
    }
    if (path.endsWith('/')) {
      return path + 'index.zh.html';
    }
    return path.replace('.html', '.zh.html');
  }

  const counterpartUrl = getCounterpartUrl();

  function createSwitchBtn(lang, label, isActive) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lang-switch-btn' + (isActive ? ' active' : '');
    if (isActive) {
      btn.setAttribute('aria-current', 'true');
    }
    btn.setAttribute('aria-label', 'Switch to ' + label);
    btn.textContent = lang === 'zh' ? '中文' : 'English';
    if (!isActive) {
      btn.addEventListener('click', function () {
        window.location.href = counterpartUrl;
      });
    }
    return btn;
  }

  function renderSwitch(container) {
    if (!container) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'lang-switch';
    wrapper.appendChild(createSwitchBtn('en', 'English', currentLang === 'en'));
    wrapper.appendChild(createSwitchBtn('zh', 'Chinese', currentLang === 'zh'));
    container.appendChild(wrapper);
  }

  // Render into all lang-switch containers
  document.querySelectorAll('.lang-switch').forEach(function (el) {
    renderSwitch(el);
  });
})();
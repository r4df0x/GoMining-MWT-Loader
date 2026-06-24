// ==UserScript==
// @name         GoMining-MWT-Loader
// @version      1.0.4
// @downloadURL  https://raw.githubusercontent.com/r4df0x/GoMining-MWT-Loader/main/loader.js
// @updateURL    https://raw.githubusercontent.com/r4df0x/GoMining-MWT-Loader/main/loader.js
// @match        https://app.gomining.com/*
// @run-at       document-idle
// @grant        none
// @inject-into  page
// ==/UserScript==

(async () => {
  const apiUrl =
    'https://api.github.com/repos/Jasper70/GoMining-Miner-Wars-Tool/contents';

  const files = await fetch(apiUrl, { cache: 'no-store' }).then(r => r.json());

  const tracker = files
    .filter(f => /^gomining-clan-tracker-v[\d.]+\.js$/.test(f.name))
    .sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true }))
    [0];

  if (!tracker) return;

  const response = await fetch(tracker.download_url + '?v=' + Date.now(), {
    cache: 'no-store'
  });

  if (!response.ok) return;

  const code = await response.text();

  const s = document.createElement('script');
  s.textContent = code;
  document.documentElement.appendChild(s);
  s.remove();
})();

(function () {
  const targetSelector =
    '.h-flex-full.align-items-center.justify-content-center.position-relative';

  const STORAGE_KEY = 'mw_tool_autohide';

  function autohideEnabled() {
    return localStorage.getItem(STORAGE_KEY) === '1';
  }

  function addAutohideControl() {
    const containers = document.querySelectorAll('.cn-page, #gm-clan-overlay');

    containers.forEach(container => {
      if (container.querySelector('.mw-autohide-control')) return;

      const wrap = document.createElement('div');
      wrap.className = 'mw-autohide-control';
      wrap.style.cssText = `
        padding: 4px 6px;
        font-size: 11px;
        font-family: 'IBM Plex Mono', monospace;
        opacity: 0.65;
        display: flex;
        align-items: center;
        gap: 6px;
        background: transparent;
        color: inherit;
        user-select: none;
      `;

      const label = document.createElement('label');
      label.style.cssText = `
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
      `;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = autohideEnabled();

      checkbox.addEventListener('change', () => {
        localStorage.setItem(STORAGE_KEY, checkbox.checked ? '1' : '0');
        updatePageState();
      });

      label.append('Auto-Hide', checkbox);
      wrap.appendChild(label);
      container.appendChild(wrap);
    });
  }

  function updatePageState(root = document) {
    const els = root.querySelectorAll?.(targetSelector);

    if (els) {
      els.forEach(el => {
        el.className =
          'h-flex-full align-items-left ps-7 justify-content-center position-relative';
      });
    }

    const targetExists = !!document.querySelector(
      '.h-flex-full.align-items-left.justify-content-center.position-relative, ' +
      targetSelector
    );

    addAutohideControl();

    document.querySelectorAll('.cn-page, #gm-clan-overlay').forEach(el => {
      el.style.display =
        autohideEnabled() && !targetExists
          ? 'none'
          : '';
    });
  }

  updatePageState();

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) {
          updatePageState(node);
        }
      }
    }

    updatePageState();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();

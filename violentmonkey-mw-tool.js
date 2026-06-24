// ==UserScript==
// @name         Load GoMining-Miner-Wars-Tool & Align Left
// @match        https://app.gomining.com/miner-wars/*
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
  function patchAlign() {
    const el = document.querySelector(
      '.h-flex-full.align-items-center.justify-content-center.position-relative'
    );

    if (!el) return false;

    el.className =
      'h-flex-full align-items-left ps-7 justify-content-center position-relative';

    return true;
  }

  if (!patchAlign()) {
    const timer = setInterval(() => {
      if (patchAlign()) clearInterval(timer);
    }, 500);

    setTimeout(() => clearInterval(timer), 30000);
  }
})();

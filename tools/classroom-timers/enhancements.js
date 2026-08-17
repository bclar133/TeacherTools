(() => {
  'use strict';

  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const storageKey = 'ttTimers.themeFilter';

  function readFilter() {
    try { return JSON.parse(localStorage.getItem(storageKey)) || 'all'; }
    catch { return 'all'; }
  }

  function saveFilter(value) {
    try { localStorage.setItem(storageKey, JSON.stringify(value)); } catch {}
  }

  function applyThemeFilter(filter) {
    const allowed = ['all', 'minimal', 'calm', 'fun', 'action'];
    const active = allowed.includes(filter) ? filter : 'all';
    saveFilter(active);

    $$('.theme-filters button').forEach(button => {
      button.classList.toggle('active', button.dataset.themeFilter === active);
      button.setAttribute('aria-pressed', String(button.dataset.themeFilter === active));
    });

    $$('.theme-card').forEach(card => {
      const categories = (card.dataset.category || '').split(/\s+/).filter(Boolean);
      card.hidden = active !== 'all' && !categories.includes(active);
    });
  }

  $$('.theme-filters button').forEach(button => {
    button.addEventListener('click', () => applyThemeFilter(button.dataset.themeFilter));
  });
  applyThemeFilter(readFilter());

  function convertRampScene(scene) {
    if (!scene || scene.querySelector('.ramp-svg')) return;
    const ramps = $$('.ramp', scene);
    if (!ramps.length) return;

    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.classList.add('ramp-svg');
    svg.setAttribute('viewBox', '0 0 1000 600');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');

    ramps.forEach(ramp => {
      const x1 = parseFloat(ramp.style.left) || 0;
      const y1 = parseFloat(ramp.style.top) || 0;
      const length = parseFloat(ramp.style.width) || 0;
      const match = ramp.style.transform.match(/rotate\(([-\d.]+)deg\)/);
      const angle = ((match ? Number(match[1]) : 0) * Math.PI) / 180;
      const x2 = x1 + Math.cos(angle) * length;
      const y2 = y1 + Math.sin(angle) * length;
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', String(x1 * 10));
      line.setAttribute('y1', String(y1 * 6));
      line.setAttribute('x2', String(x2 * 10));
      line.setAttribute('y2', String(y2 * 6));
      svg.appendChild(line);
      ramp.remove();
    });

    scene.prepend(svg);
  }

  const sceneLayer = document.getElementById('sceneLayer');
  if (sceneLayer) {
    convertRampScene(sceneLayer.querySelector('.ramp-scene'));
    new MutationObserver(() => convertRampScene(sceneLayer.querySelector('.ramp-scene')))
      .observe(sceneLayer, { childList: true, subtree: true });
  }

  const countdownStage = document.getElementById('countdownStage');
  const countdownMessage = document.getElementById('countdownMessage');
  if (countdownStage && countdownMessage) {
    const syncFinishedState = () => countdownStage.classList.toggle('finished', /time[’']?s up/i.test(countdownMessage.textContent));
    syncFinishedState();
    new MutationObserver(syncFinishedState).observe(countdownMessage, { childList: true, characterData: true, subtree: true });
  }
})();

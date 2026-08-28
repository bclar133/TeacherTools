(() => {
  'use strict';

  const storageKey = 'teacherToolsTheme';
  const body = document.body;
  const traffic = document.querySelector('.theme-traffic');
  const levelNumber = document.getElementById('levelNumber');
  const topButton = document.getElementById('themeModeBtn');
  const topLabel = document.getElementById('themeModeLabel');
  const darkToggle = document.getElementById('darkModeToggle');

  function applyMode(mode, persist = true) {
    const next = mode === 'light' ? 'light' : 'dark';
    body.dataset.colourMode = next;
    if (darkToggle) darkToggle.checked = next === 'dark';
    const dark = next === 'dark';
    topButton?.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    if (topLabel) topLabel.textContent = dark ? 'Light mode' : 'Dark mode';
    const icon = topButton?.querySelector('.mode-icon');
    if (icon) icon.textContent = dark ? '☀' : '🌙';
    if (persist) localStorage.setItem(storageKey, next);
  }

  function updateTrafficTier() {
    if (!traffic || !levelNumber) return;
    const value = Math.max(0, Math.min(100, Number(levelNumber.textContent) || 0));
    const tier = value <= 20 ? 1 : value <= 40 ? 2 : value <= 60 ? 3 : value <= 80 ? 4 : 5;
    traffic.dataset.level = String(tier);
  }

  const saved = localStorage.getItem(storageKey);
  applyMode(saved === 'light' ? 'light' : 'dark', false);
  updateTrafficTier();

  if (levelNumber) new MutationObserver(updateTrafficTier).observe(levelNumber, { childList:true, characterData:true, subtree:true });
  darkToggle?.addEventListener('change', () => applyMode(darkToggle.checked ? 'dark' : 'light'));
  topButton?.addEventListener('click', () => applyMode(body.dataset.colourMode === 'dark' ? 'light' : 'dark'));
})();

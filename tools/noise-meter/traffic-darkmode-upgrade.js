(() => {
  'use strict';

  const storageKey = 'teacherToolsTheme';
  const body = document.body;
  const traffic = document.querySelector('.theme-traffic');
  const levelNumber = document.getElementById('levelNumber');
  const micDot = document.getElementById('micDot');
  const currentReading = document.querySelector('.current-reading');
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

  /* Session average: time-weighted from microphone start until stop. */
  let sessionAverageNumber = null;
  let sessionRunning = false;
  let weightedTotal = 0;
  let elapsedTotal = 0;
  let lastAt = 0;
  let lastLevel = 0;

  function liveLevel() {
    return Math.max(0, Math.min(100, Number(levelNumber?.textContent) || 0));
  }

  function installSessionAverage() {
    if (!currentReading || document.getElementById('sessionAverageNumber')) return;
    const parent = currentReading.parentElement;
    if (!parent) return;

    const cluster = document.createElement('div');
    cluster.className = 'reading-cluster';
    parent.insertBefore(cluster, currentReading);
    cluster.appendChild(currentReading);

    const average = document.createElement('div');
    average.className = 'session-average';
    average.innerHTML = '<span class="session-average-number" id="sessionAverageNumber">—</span><span class="session-average-label">session average</span>';
    cluster.appendChild(average);
    sessionAverageNumber = document.getElementById('sessionAverageNumber');

    const style = document.createElement('style');
    style.id = 'sessionAverageStyles';
    style.textContent = `
      .reading-cluster{display:flex;align-items:center;gap:18px;min-width:285px}
      .session-average{display:flex;align-items:baseline;gap:7px;padding-left:18px;border-left:1px solid rgba(245,240,223,.18)}
      .session-average-number{min-width:46px;font-family:var(--display-font);font-size:1.9rem;line-height:.9;font-weight:700;color:var(--gold)}
      .session-average-label{max-width:74px;color:var(--chalk-muted);font-size:.66rem;line-height:1.05;text-transform:uppercase;letter-spacing:.075em;font-weight:900}
      body[data-colour-mode="light"] .session-average{border-left-color:rgba(35,54,49,.16)}
      body[data-colour-mode="light"] .session-average-number{color:#80642c}
      body[data-colour-mode="light"] .session-average-label{color:#5b6c65}
      @media(max-width:760px){.reading-cluster{gap:11px;min-width:0}.session-average{gap:5px;padding-left:11px}.session-average-number{min-width:38px;font-size:1.55rem}.session-average-label{font-size:.58rem}}
    `;
    document.head.appendChild(style);
  }

  function renderAverage() {
    if (!sessionAverageNumber) return;
    if (elapsedTotal <= 0) {
      sessionAverageNumber.textContent = sessionRunning ? String(Math.round(lastLevel)) : '—';
      return;
    }
    sessionAverageNumber.textContent = String(Math.round(weightedTotal / elapsedTotal));
  }

  function accrue(now = performance.now()) {
    if (!sessionRunning) return;
    const elapsed = Math.max(0, now - lastAt);
    if (elapsed > 0) {
      weightedTotal += lastLevel * elapsed;
      elapsedTotal += elapsed;
      lastAt = now;
    }
    renderAverage();
  }

  function startSession() {
    weightedTotal = 0;
    elapsedTotal = 0;
    lastLevel = liveLevel();
    lastAt = performance.now();
    sessionRunning = true;
    renderAverage();
  }

  function stopSession() {
    if (!sessionRunning) return;
    accrue(performance.now());
    sessionRunning = false;
    renderAverage();
  }

  function syncMicSession() {
    const active = Boolean(micDot?.classList.contains('active'));
    if (active && !sessionRunning) startSession();
    if (!active && sessionRunning) stopSession();
  }

  function handleLevelChange() {
    updateTrafficTier();
    if (!sessionRunning) return;
    const now = performance.now();
    accrue(now);
    lastLevel = liveLevel();
    lastAt = now;
    renderAverage();
  }

  const saved = localStorage.getItem(storageKey);
  applyMode(saved === 'light' ? 'light' : 'dark', false);
  installSessionAverage();
  updateTrafficTier();
  syncMicSession();

  if (levelNumber) new MutationObserver(handleLevelChange).observe(levelNumber, { childList:true, characterData:true, subtree:true });
  if (micDot) new MutationObserver(syncMicSession).observe(micDot, { attributes:true, attributeFilter:['class'] });
  setInterval(() => { if (sessionRunning) accrue(performance.now()); }, 500);

  darkToggle?.addEventListener('change', () => applyMode(darkToggle.checked ? 'dark' : 'light'));
  topButton?.addEventListener('click', () => applyMode(body.dataset.colourMode === 'dark' ? 'light' : 'dark'));
})();

(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const state = {
    mode: 'numbers',
    muted: localStorage.getItem('chalkboxRandomiserMuted') === 'true',
    busy: false,
    history: [],
    audioContext: null
  };

  try {
    const savedHistory = JSON.parse(localStorage.getItem('chalkboxRandomiserHistory') || '[]');
    if (Array.isArray(savedHistory)) state.history = savedHistory.slice(0, 20);
  } catch (_) {}

  const els = {
    tabs: $$('.workspace-tab'),
    panels: $$('.workspace-panel'),
    muteBtn: $('#muteBtn'),
    themeBtn: $('#themeBtn'),
    fullscreenBtn: $('#fullscreenBtn'),
    presentationToolbar: $('#presentationToolbar'),
    presentationMuteBtn: $('#presentationMuteBtn'),
    presentationExitBtn: $('#presentationExitBtn'),

    minNumber: $('#minNumber'),
    maxNumber: $('#maxNumber'),
    numberCount: $('#numberCount'),
    noRepeats: $('#noRepeats'),
    generateNumberBtn: $('#generateNumberBtn'),
    generateNumberAgainBtn: $('#generateNumberAgainBtn'),
    numberResults: $('#numberResults'),
    numberStatus: $('#numberStatus'),
    numberError: $('#numberError'),

    dieSides: $('#dieSides'),
    customSidesWrap: $('#customSidesWrap'),
    customSides: $('#customSides'),
    diceCount: $('#diceCount'),
    rollDiceBtn: $('#rollDiceBtn'),
    rollDiceAgainBtn: $('#rollDiceAgainBtn'),
    diceResults: $('#diceResults'),
    diceEquation: $('#diceEquation'),
    diceTotal: $('#diceTotal'),
    diceStatus: $('#diceStatus'),
    diceError: $('#diceError'),

    flipCoinBtn: $('#flipCoinBtn'),
    flipCoinAgainBtn: $('#flipCoinAgainBtn'),
    coin: $('#coin'),
    coinResult: $('#coinResult'),
    coinStatus: $('#coinStatus'),

    historyList: $('#historyList'),
    clearHistoryBtn: $('#clearHistoryBtn')
  };

  function randomInt(min, max) {
    const span = max - min + 1;
    if (span <= 0) return min;
    if (window.crypto?.getRandomValues) {
      const maxUint = 0x100000000;
      const limit = maxUint - (maxUint % span);
      const array = new Uint32Array(1);
      do window.crypto.getRandomValues(array); while (array[0] >= limit);
      return min + (array[0] % span);
    }
    return min + Math.floor(Math.random() * span);
  }

  function clampInt(value, min, max, fallback) {
    const n = Number.parseInt(value, 10);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }

  function setMode(mode) {
    if (!['numbers', 'dice', 'coin'].includes(mode) || state.busy) return;
    state.mode = mode;
    els.tabs.forEach(tab => {
      const active = tab.dataset.workspace === mode;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    els.panels.forEach(panel => panel.classList.toggle('active', panel.dataset.panel === mode));
  }

  els.tabs.forEach(tab => tab.addEventListener('click', () => setMode(tab.dataset.workspace)));

  function getAudioContext() {
    if (state.muted) return null;
    if (!state.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      state.audioContext = new AudioCtx();
    }
    if (state.audioContext.state === 'suspended') state.audioContext.resume();
    return state.audioContext;
  }

  function tone(freq = 440, duration = 0.08, volume = 0.035, type = 'sine', delay = 0) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const start = ctx.currentTime + delay;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  function soundNumber() {
    tone(470, .06, .025, 'triangle');
    tone(650, .10, .035, 'triangle', .07);
  }

  function soundDice() {
    [0, .07, .14, .22, .31].forEach((delay, i) => tone(150 + i * 24, .045, .025, 'square', delay));
    tone(310, .08, .032, 'triangle', .43);
  }

  function soundCoin() {
    tone(780, .045, .025, 'triangle');
    tone(1050, .05, .022, 'sine', .18);
    tone(720, .09, .035, 'triangle', .78);
  }

  function updateMuteUI() {
    const icon = state.muted ? '🔇' : '🔊';
    const label = state.muted ? 'Unmute sounds' : 'Mute sounds';
    [els.muteBtn, els.presentationMuteBtn].forEach(btn => {
      if (!btn) return;
      btn.textContent = icon;
      btn.title = label;
      btn.setAttribute('aria-label', label);
      btn.setAttribute('aria-pressed', String(state.muted));
    });
  }

  function toggleMute() {
    state.muted = !state.muted;
    localStorage.setItem('chalkboxRandomiserMuted', String(state.muted));
    updateMuteUI();
    if (!state.muted) tone(520, .07, .025, 'sine');
  }

  els.muteBtn.addEventListener('click', toggleMute);
  els.presentationMuteBtn.addEventListener('click', toggleMute);
  updateMuteUI();

  function applyTheme(theme) {
    const dark = theme === 'dark';
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    els.themeBtn.textContent = dark ? '☀️' : '🌙';
    els.themeBtn.title = dark ? 'Turn on light mode' : 'Turn on dark mode';
    els.themeBtn.setAttribute('aria-label', els.themeBtn.title);
    els.themeBtn.setAttribute('aria-pressed', String(dark));
    localStorage.setItem('chalkboxRandomiserTheme', dark ? 'dark' : 'light');
  }

  const savedTheme = localStorage.getItem('chalkboxRandomiserTheme');
  const preferredTheme = savedTheme || (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(preferredTheme);
  els.themeBtn.addEventListener('click', () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));

  function setPresentation(on) {
    document.body.classList.toggle('presentation-mode', on);
    els.presentationToolbar.hidden = !on;
    els.fullscreenBtn.textContent = on ? '↙' : '⛶';
    els.fullscreenBtn.title = on ? 'Exit presentation mode' : 'Presentation mode';
  }

  async function enterPresentation() {
    setPresentation(true);
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
    } catch (_) {}
  }

  async function exitPresentation() {
    setPresentation(false);
    try {
      if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen();
    } catch (_) {}
  }

  els.fullscreenBtn.addEventListener('click', () => document.body.classList.contains('presentation-mode') ? exitPresentation() : enterPresentation());
  els.presentationExitBtn.addEventListener('click', exitPresentation);
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && document.body.classList.contains('presentation-mode')) setPresentation(false);
  });

  function saveHistory() {
    localStorage.setItem('chalkboxRandomiserHistory', JSON.stringify(state.history.slice(0, 20)));
  }

  function addHistory(type, label, icon) {
    state.history.unshift({ type, label, icon, time: Date.now() });
    state.history = state.history.slice(0, 20);
    saveHistory();
    renderHistory();
  }

  function timeLabel(timestamp) {
    try {
      return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(timestamp));
    } catch (_) {
      return '';
    }
  }

  function renderHistory() {
    els.historyList.innerHTML = '';
    if (!state.history.length) {
      const empty = document.createElement('li');
      empty.className = 'history-empty';
      empty.textContent = 'Your latest results will appear here.';
      els.historyList.append(empty);
      return;
    }

    state.history.forEach(item => {
      const li = document.createElement('li');
      li.className = 'history-item';
      const icon = document.createElement('span');
      icon.className = 'history-icon';
      icon.textContent = item.icon;
      const copy = document.createElement('span');
      copy.className = 'history-copy';
      const strong = document.createElement('strong');
      strong.textContent = item.label;
      const small = document.createElement('small');
      small.textContent = `${item.type} · ${timeLabel(item.time)}`;
      copy.append(strong, small);
      li.append(icon, copy);
      els.historyList.append(li);
    });
  }

  els.clearHistoryBtn.addEventListener('click', () => {
    state.history = [];
    saveHistory();
    renderHistory();
  });
  renderHistory();

  function numberValues(min, max, count, unique) {
    if (!unique) return Array.from({ length: count }, () => randomInt(min, max));
    const available = max - min + 1;
    const chosen = new Set();
    while (chosen.size < count && chosen.size < available) chosen.add(randomInt(min, max));
    return [...chosen];
  }

  function setNumberClass(count) {
    els.numberResults.classList.remove('single', 'multiple', 'many');
    els.numberResults.classList.add(count === 1 ? 'single' : count >= 8 ? 'many' : 'multiple');
  }

  function makeNumberChips(values, shuffling = false) {
    els.numberResults.innerHTML = '';
    setNumberClass(values.length);
    values.forEach(value => {
      const chip = document.createElement('span');
      chip.className = `number-chip${shuffling ? ' shuffling' : ''}`;
      chip.textContent = value;
      els.numberResults.append(chip);
    });
  }

  async function generateNumbers() {
    if (state.busy) return;
    els.numberError.textContent = '';

    const rawMin = Number.parseInt(els.minNumber.value, 10);
    const rawMax = Number.parseInt(els.maxNumber.value, 10);
    let count = clampInt(els.numberCount.value, 1, 20, 1);
    els.numberCount.value = count;

    if (!Number.isFinite(rawMin) || !Number.isFinite(rawMax)) {
      els.numberError.textContent = 'Enter a valid minimum and maximum.';
      return;
    }
    const min = Math.min(rawMin, rawMax);
    const max = Math.max(rawMin, rawMax);
    if (rawMin !== min) {
      els.minNumber.value = min;
      els.maxNumber.value = max;
    }

    const rangeSize = max - min + 1;
    if (els.noRepeats.checked && count > rangeSize) {
      els.numberError.textContent = `Only ${rangeSize} unique number${rangeSize === 1 ? '' : 's'} exist in this range.`;
      return;
    }

    state.busy = true;
    els.numberStatus.textContent = 'Choosing…';
    const finalValues = numberValues(min, max, count, els.noRepeats.checked);
    makeNumberChips(numberValues(min, max, count, false), true);
    soundNumber();

    const chips = $$('.number-chip', els.numberResults);
    const ticker = window.setInterval(() => {
      chips.forEach(chip => chip.textContent = randomInt(min, max));
    }, 62);

    await new Promise(resolve => window.setTimeout(resolve, 660));
    window.clearInterval(ticker);
    makeNumberChips(finalValues, false);
    els.numberStatus.textContent = count === 1 ? 'Number selected' : `${count} numbers selected`;
    addHistory('Numbers', finalValues.join(', '), '🔢');
    state.busy = false;
  }

  els.generateNumberBtn.addEventListener('click', generateNumbers);
  els.generateNumberAgainBtn.addEventListener('click', generateNumbers);
  $$('.quick-ranges button').forEach(btn => btn.addEventListener('click', () => {
    els.minNumber.value = btn.dataset.min;
    els.maxNumber.value = btn.dataset.max;
    els.numberError.textContent = '';
  }));

  function currentSides() {
    if (els.dieSides.value === 'custom') return clampInt(els.customSides.value, 2, 1000, 30);
    return Number.parseInt(els.dieSides.value, 10);
  }

  function dieShapeValue(sides) {
    return [4, 6, 8, 10, 12, 20].includes(sides) ? String(sides) : 'custom';
  }

  function createDie(value, sides, rolling = false) {
    const die = document.createElement('div');
    die.className = `die ${rolling ? 'rolling' : 'landed'}`;
    die.dataset.sides = dieShapeValue(sides);
    const number = document.createElement('span');
    number.textContent = value;
    const label = document.createElement('small');
    label.textContent = `D${sides}`;
    die.append(number, label);
    return die;
  }

  function renderDice(values, sides, rolling = false) {
    els.diceResults.innerHTML = '';
    values.forEach(value => els.diceResults.append(createDie(value, sides, rolling)));
  }

  async function rollDice() {
    if (state.busy) return;
    els.diceError.textContent = '';
    const sides = currentSides();
    const count = clampInt(els.diceCount.value, 1, 12, 1);
    els.diceCount.value = count;
    if (!Number.isFinite(sides) || sides < 2 || sides > 1000) {
      els.diceError.textContent = 'Choose between 2 and 1000 sides.';
      return;
    }
    if (els.dieSides.value === 'custom') els.customSides.value = sides;

    state.busy = true;
    els.diceStatus.textContent = 'Rolling…';
    els.diceTotal.hidden = true;
    els.diceEquation.textContent = 'Rolling…';

    const finalValues = Array.from({ length: count }, () => randomInt(1, sides));
    renderDice(Array.from({ length: count }, () => randomInt(1, sides)), sides, true);
    soundDice();

    const ticker = window.setInterval(() => {
      $$('.die span', els.diceResults).forEach(span => span.textContent = randomInt(1, sides));
    }, 85);

    await new Promise(resolve => window.setTimeout(resolve, 760));
    window.clearInterval(ticker);
    renderDice(finalValues, sides, false);

    const total = finalValues.reduce((sum, value) => sum + value, 0);
    els.diceEquation.textContent = count === 1 ? `D${sides} → ${finalValues[0]}` : finalValues.join(' + ');
    $('strong', els.diceTotal).textContent = total;
    els.diceTotal.hidden = false;
    els.diceStatus.textContent = `${count} × D${sides}`;
    addHistory('Dice', count === 1 ? `D${sides}: ${total}` : `${finalValues.join(' + ')} = ${total}`, '🎲');
    state.busy = false;
  }

  els.dieSides.addEventListener('change', () => {
    els.customSidesWrap.hidden = els.dieSides.value !== 'custom';
    els.diceError.textContent = '';
  });
  els.rollDiceBtn.addEventListener('click', rollDice);
  els.rollDiceAgainBtn.addEventListener('click', rollDice);
  $$('.dice-presets button').forEach(btn => btn.addEventListener('click', () => {
    els.diceCount.value = btn.dataset.dice;
    els.dieSides.value = btn.dataset.sides;
    els.customSidesWrap.hidden = true;
    els.diceError.textContent = '';
  }));

  async function flipCoin() {
    if (state.busy) return;
    state.busy = true;
    const result = randomInt(0, 1) === 0 ? 'Heads' : 'Tails';
    els.coinStatus.textContent = 'Flipping…';
    els.coinResult.textContent = '…';
    els.coin.classList.remove('show-heads', 'show-tails', 'flipping');
    void els.coin.offsetWidth;
    els.coin.classList.add('flipping');
    soundCoin();

    await new Promise(resolve => window.setTimeout(resolve, 1060));
    els.coin.classList.remove('flipping');
    els.coin.classList.add(result === 'Heads' ? 'show-heads' : 'show-tails');
    els.coinResult.textContent = result;
    els.coinStatus.textContent = result;
    addHistory('Coin', result, result === 'Heads' ? '🟡' : '🪙');
    state.busy = false;
  }

  els.flipCoinBtn.addEventListener('click', flipCoin);
  els.flipCoinAgainBtn.addEventListener('click', flipCoin);

  function clearMode(mode) {
    if (state.busy) return;
    if (mode === 'numbers') {
      els.numberResults.className = 'number-results single';
      els.numberResults.innerHTML = '<span class="placeholder-mark">?</span>';
      els.numberStatus.textContent = 'Ready';
      els.numberError.textContent = '';
    }
    if (mode === 'dice') {
      els.diceResults.innerHTML = '<span class="placeholder-mark">?</span>';
      els.diceEquation.textContent = 'Choose your dice and roll.';
      els.diceTotal.hidden = true;
      els.diceStatus.textContent = 'Ready';
      els.diceError.textContent = '';
    }
    if (mode === 'coin') {
      els.coin.classList.remove('flipping', 'show-tails');
      els.coin.classList.add('show-heads');
      els.coinResult.textContent = 'Ready to flip';
      els.coinStatus.textContent = 'Ready';
    }
  }

  $$('[data-clear-mode]').forEach(btn => btn.addEventListener('click', () => clearMode(btn.dataset.clearMode)));

  function repeatCurrent() {
    if (state.mode === 'numbers') generateNumbers();
    else if (state.mode === 'dice') rollDice();
    else flipCoin();
  }

  document.addEventListener('keydown', event => {
    const tag = event.target?.tagName?.toLowerCase();
    const typing = ['input', 'select', 'textarea'].includes(tag);
    if (typing && event.key !== 'Escape') return;

    if (event.code === 'Space') {
      event.preventDefault();
      repeatCurrent();
    } else if (event.key === '1') setMode('numbers');
    else if (event.key === '2') setMode('dice');
    else if (event.key === '3') setMode('coin');
    else if (event.key.toLowerCase() === 'f') {
      event.preventDefault();
      document.body.classList.contains('presentation-mode') ? exitPresentation() : enterPresentation();
    } else if (event.key === 'Escape' && document.body.classList.contains('presentation-mode')) {
      exitPresentation();
    }
  });
})();

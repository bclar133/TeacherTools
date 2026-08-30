(() => {
  'use strict';

  const theme = document.querySelector('.theme-storm');
  const levelNumber = document.getElementById('levelNumber');
  const stormScene = document.getElementById('stormScene');
  const centreCloud = theme?.querySelector('.cloud-centre');
  if (!theme || !levelNumber || !stormScene) return;

  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const lerp = (a, b, t) => a + (b - a) * t;
  const mixRgb = (a, b, t) => {
    const p = clamp(t);
    return `rgb(${Math.round(lerp(a[0], b[0], p))},${Math.round(lerp(a[1], b[1], p))},${Math.round(lerp(a[2], b[2], p))})`;
  };

  const rainLayer = document.createElement('div');
  rainLayer.className = 'storm-rain-layer';
  rainLayer.setAttribute('aria-hidden', 'true');

  const lightningLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  lightningLayer.classList.add('storm-lightning-layer');
  lightningLayer.setAttribute('aria-hidden', 'true');
  lightningLayer.setAttribute('preserveAspectRatio', 'none');

  const skyFlash = document.createElement('div');
  skyFlash.className = 'storm-sky-flash';
  skyFlash.setAttribute('aria-hidden', 'true');

  theme.appendChild(skyFlash);
  theme.appendChild(rainLayer);
  theme.appendChild(lightningLayer);

  const dropCount = 110;
  const drops = [];
  for (let i = 0; i < dropCount; i += 1) {
    const drop = document.createElement('span');
    drop.className = 'storm-drop';
    const seed = (i * 37 + 13) % 101;
    const seed2 = (i * 61 + 29) % 97;
    drop.dataset.seed = String(seed / 100);
    drop.dataset.speed = String(0.72 + (seed2 / 96) * 0.58);
    drop.style.setProperty('--drop-left', `${((i * 83 + 17) % 997) / 9.97}%`);
    drop.style.setProperty('--drop-delay', `${-((i * 47) % 170) / 20}s`);
    drop.style.setProperty('--drop-drift', `${-5 + ((i * 19) % 13)}px`);
    drop.style.setProperty('--drop-slant', `${3 + ((i * 7) % 6)}deg`);
    rainLayer.appendChild(drop);
    drops.push(drop);
  }

  let level = 0;
  let nextStrikeAt = performance.now() + 4500;

  function readLevel() {
    level = Math.max(0, Math.min(100, Number(levelNumber.textContent) || 0));
  }

  function updateStormLook() {
    readLevel();
    const sky = level / 100;
    const stormCurve = Math.pow(sky, 1.12);

    theme.style.setProperty('--storm-sky-top', mixRgb([139, 204, 235], [48, 52, 59], stormCurve));
    theme.style.setProperty('--storm-sky-bottom', mixRgb([216, 239, 248], [89, 94, 101], stormCurve));
    theme.style.setProperty('--cloud-colour', mixRgb([244, 248, 249], [68, 73, 80], Math.pow(sky, 1.18)));
    theme.style.setProperty('--storm-cloud-brightness', String(lerp(1.04, .82, stormCurve).toFixed(3)));

    const rainIntensity = clamp((level - 40) / 60);
    const activeDrops = Math.round(rainIntensity * dropCount);
    drops.forEach((drop, index) => {
      const seed = Number(drop.dataset.seed) || 0;
      const speedFactor = Number(drop.dataset.speed) || 1;
      const active = index < activeDrops;
      const opacity = active ? (0.24 + rainIntensity * 0.68) * (0.72 + seed * 0.28) : 0;
      const duration = (1.55 - rainIntensity * 1.05) * speedFactor;
      const height = 10 + rainIntensity * 22 + seed * 7;
      const width = rainIntensity > .76 && seed > .58 ? 3 : 2;
      drop.style.setProperty('--drop-opacity', opacity.toFixed(3));
      drop.style.setProperty('--drop-duration', `${Math.max(.32, duration).toFixed(3)}s`);
      drop.style.setProperty('--drop-height', `${height.toFixed(1)}px`);
      drop.style.setProperty('--drop-width', `${width}px`);
    });
  }

  function themeVisible() {
    return !theme.hidden && getComputedStyle(theme).display !== 'none';
  }

  function makeBoltPath(startX, startY, endX, endY, intensity) {
    const points = [[startX, startY]];
    const segments = 7 + Math.round(intensity * 4);
    for (let i = 1; i < segments; i += 1) {
      const t = i / segments;
      const baseX = lerp(startX, endX, t);
      const jag = (Math.random() - .5) * (28 + intensity * 44);
      const y = lerp(startY, endY, t);
      points.push([baseX + jag, y]);
    }
    points.push([endX, endY]);
    return points.map((p, i) => `${i ? 'L' : 'M'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  }

  function strikeOnce(intensity, xBias = 0) {
    const themeRect = theme.getBoundingClientRect();
    const cloudRect = (centreCloud || stormScene).getBoundingClientRect();
    if (!themeRect.width || !themeRect.height) return;

    lightningLayer.setAttribute('viewBox', `0 0 ${themeRect.width} ${themeRect.height}`);

    const cloudLeft = cloudRect.left - themeRect.left;
    const cloudTop = cloudRect.top - themeRect.top;
    const cloudWidth = cloudRect.width || themeRect.width * .28;
    const cloudHeight = cloudRect.height || 150;
    const startX = clamp((cloudLeft + cloudWidth * (.25 + Math.random() * .5) + xBias), 22, themeRect.width - 22);
    const startY = Math.max(95, cloudTop + cloudHeight * .68);
    const endY = themeRect.height - 8;
    const endX = clamp(startX + (Math.random() - .5) * themeRect.width * (.28 + intensity * .18), 18, themeRect.width - 18);
    const d = makeBoltPath(startX, startY, endX, endY, intensity);

    const glow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    glow.setAttribute('d', d);
    glow.setAttribute('class', 'storm-bolt');
    glow.setAttribute('stroke-width', String(3.2 + intensity * 3.1));

    const core = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    core.setAttribute('d', d);
    core.setAttribute('class', 'storm-bolt-core');
    core.setAttribute('stroke-width', String(1.1 + intensity * 1.25));

    lightningLayer.append(glow, core);
    window.setTimeout(() => { glow.remove(); core.remove(); }, 430);
  }

  function strikeLightning(intensity) {
    theme.style.setProperty('--storm-flash-opacity', String((.13 + intensity * .42).toFixed(2)));
    skyFlash.classList.remove('is-flashing');
    void skyFlash.offsetWidth;
    skyFlash.classList.add('is-flashing');

    strikeOnce(intensity);
    if (intensity > .78 && Math.random() < intensity * .72) {
      window.setTimeout(() => strikeOnce(intensity, (Math.random() - .5) * 130), 70 + Math.random() * 90);
    }
  }

  function scheduleNextStrike(now, lightningIntensity) {
    const slow = 5600;
    const fast = 180;
    const curved = Math.pow(1 - lightningIntensity, 2.2);
    const base = fast + (slow - fast) * curved;
    nextStrikeAt = now + base * (0.62 + Math.random() * .7);
  }

  function lightningLoop(now) {
    const lightningIntensity = clamp((level - 58) / 42);
    if (!themeVisible() || lightningIntensity <= 0) {
      nextStrikeAt = Math.max(nextStrikeAt, now + 900);
    } else if (now >= nextStrikeAt) {
      strikeLightning(lightningIntensity);
      scheduleNextStrike(now, lightningIntensity);
    }
    requestAnimationFrame(lightningLoop);
  }

  const observer = new MutationObserver(updateStormLook);
  observer.observe(levelNumber, { childList:true, characterData:true, subtree:true });
  window.addEventListener('resize', updateStormLook);

  updateStormLook();
  requestAnimationFrame(lightningLoop);
})();

(() => {
  'use strict';

  if (document.getElementById('mazeMotionFixStyleV1')) return;

  const sceneLayer = document.getElementById('sceneLayer');
  if (!sceneLayer) return;

  const style = document.createElement('style');
  style.id = 'mazeMotionFixStyleV1';
  style.textContent = `
    .maze-proper-marble{
      transform:translate(-50%,-50%) rotate(var(--maze-roll-corrected,0deg))!important;
    }
    .maze-trail-path{
      stroke:url(#mazeRainbowTrail)!important;
      opacity:.96!important;
      filter:drop-shadow(0 1px 1px rgba(20,28,38,.28));
    }
  `;
  document.head.appendChild(style);

  const SVG_NS = 'http://www.w3.org/2000/svg';
  let trackedMarble = null;
  let marbleObserver = null;
  let lastX = null;
  let lastY = null;
  let rollDegrees = 0;
  let queued = false;
  let applying = false;

  function ensureRainbowGradient(scene) {
    const trailSvg = scene?.querySelector('.maze-trail-svg');
    if (!trailSvg || trailSvg.querySelector('#mazeRainbowTrail')) return;

    let defs = trailSvg.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS(SVG_NS, 'defs');
      trailSvg.insertBefore(defs, trailSvg.firstChild);
    }

    const gradient = document.createElementNS(SVG_NS, 'linearGradient');
    gradient.id = 'mazeRainbowTrail';
    gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
    gradient.setAttribute('x1', '0');
    gradient.setAttribute('y1', '0');
    gradient.setAttribute('x2', '100');
    gradient.setAttribute('y2', '100');

    const stops = [
      ['0%', '#ff3b4d'],
      ['16%', '#ff8a24'],
      ['32%', '#ffd83d'],
      ['48%', '#48d66b'],
      ['64%', '#35b9ff'],
      ['80%', '#6e67ff'],
      ['100%', '#d94cff']
    ];

    for (const [offset, colour] of stops) {
      const stop = document.createElementNS(SVG_NS, 'stop');
      stop.setAttribute('offset', offset);
      stop.setAttribute('stop-color', colour);
      gradient.appendChild(stop);
    }

    defs.appendChild(gradient);
  }

  function syncRoll() {
    queued = false;
    const marble = trackedMarble;
    if (!marble || !marble.isConnected || applying) return;

    const board = marble.closest('.maze-proper-board');
    if (!board) return;

    const left = parseFloat(marble.style.left);
    const top = parseFloat(marble.style.top);
    const rect = board.getBoundingClientRect();
    if (!Number.isFinite(left) || !Number.isFinite(top) || !rect.width || !rect.height) return;

    const x = left / 100 * rect.width;
    const y = top / 100 * rect.height;

    if (lastX !== null && lastY !== null) {
      const dx = x - lastX;
      const dy = y - lastY;
      const distance = Math.hypot(dx, dy);

      if (distance > 0.002) {
        const size = Math.max(1, marble.getBoundingClientRect().width);
        const radius = size / 2;
        const deltaDegrees = distance / radius * (180 / Math.PI);

        // The maze route is orthogonal. Reverse the visible spin whenever the
        // direction of travel reverses, rather than always spinning one way.
        const horizontal = Math.abs(dx) >= Math.abs(dy);
        const directionSign = horizontal ? Math.sign(dx || 1) : Math.sign(dy || 1);
        rollDegrees += deltaDegrees * directionSign;

        applying = true;
        marble.style.setProperty('--maze-roll-corrected', `${rollDegrees.toFixed(2)}deg`);
        applying = false;
      }
    } else {
      applying = true;
      marble.style.setProperty('--maze-roll-corrected', '0deg');
      applying = false;
    }

    lastX = x;
    lastY = y;
  }

  function attachMarble(marble) {
    if (marble === trackedMarble) return;

    marbleObserver?.disconnect();
    trackedMarble = marble;
    lastX = null;
    lastY = null;
    rollDegrees = 0;
    queued = false;
    applying = false;

    if (!marble) return;

    const scene = marble.closest('.maze-scene');
    ensureRainbowGradient(scene);

    marbleObserver = new MutationObserver(() => {
      if (applying || queued) return;
      queued = true;
      requestAnimationFrame(syncRoll);
    });
    marbleObserver.observe(marble, { attributes:true, attributeFilter:['style'] });
    requestAnimationFrame(syncRoll);
  }

  function syncScene() {
    const scene = sceneLayer.querySelector('.maze-scene');
    if (scene) ensureRainbowGradient(scene);
    attachMarble(scene?.querySelector('.maze-proper-marble') || null);
  }

  const sceneObserver = new MutationObserver(syncScene);
  sceneObserver.observe(sceneLayer, { childList:true, subtree:true });
  window.addEventListener('resize', () => {
    lastX = null;
    lastY = null;
    requestAnimationFrame(syncRoll);
  });

  syncScene();
})();

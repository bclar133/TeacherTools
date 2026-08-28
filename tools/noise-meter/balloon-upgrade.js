(() => {
  'use strict';

  const levelNumber = document.getElementById('levelNumber');
  const balloon = document.getElementById('balloonVisual');

  if (!levelNumber || !balloon) return;

  const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

  function updateBalloonScale() {
    const level = clamp(Number(levelNumber.textContent) || 0);
    const progress = level / 100;

    /* Start a little smaller than before, while keeping the same maximum size. */
    const scale = 0.48 + progress * 0.80;
    balloon.style.setProperty('--balloon-scale', scale.toFixed(3));

    requestAnimationFrame(updateBalloonScale);
  }

  requestAnimationFrame(updateBalloonScale);
})();

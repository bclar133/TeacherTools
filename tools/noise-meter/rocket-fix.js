(() => {
  'use strict';

  const rocketTheme = document.querySelector('.theme-rocket');
  const track = rocketTheme?.querySelector('.rocket-track');
  const moon = rocketTheme?.querySelector('.moon');
  const rocket = document.getElementById('rocketVisual');
  const levelNumber = document.getElementById('levelNumber');
  const loudThreshold = document.getElementById('loudThreshold');

  if (!rocketTheme || !track || !moon || !rocket || !levelNumber || !loudThreshold) return;

  const clamp01 = (value) => Math.max(0, Math.min(1, value));

  function positionRocket() {
    if (rocketTheme.hidden || track.clientWidth <= 0 || track.clientHeight <= 0) {
      requestAnimationFrame(positionRocket);
      return;
    }

    const level = Math.max(0, Math.min(100, Number(levelNumber.textContent) || 0));
    const loud = Math.max(1, Number(loudThreshold.value) || 68);

    // Reaching the Too Loud threshold means the rocket has reached the moon.
    const progress = clamp01(level / loud);
    const angle = 46 * progress;
    const angleRad = angle * Math.PI / 180;

    const startCenterX = rocket.offsetLeft + rocket.offsetWidth / 2;
    const startCenterY = rocket.offsetTop + rocket.offsetHeight / 2;

    // Aim the rocket nose at the moon's lower-left edge, where the approach looks natural.
    const moonHitX = moon.offsetLeft + moon.offsetWidth * 0.34;
    const moonHitY = moon.offsetTop + moon.offsetHeight * 0.72;

    // The nose extends above the rocket body; account for rotation so the tip, not the body, meets the moon.
    const noseLength = rocket.offsetHeight / 2 + 42;
    const noseVectorX = Math.sin(angleRad) * noseLength;
    const noseVectorY = -Math.cos(angleRad) * noseLength;
    const endCenterX = moonHitX - noseVectorX;
    const endCenterY = moonHitY - noseVectorY;

    const endX = endCenterX - startCenterX;
    const endY = endCenterY - startCenterY;
    const arcHeight = Math.min(70, track.clientHeight * 0.11);

    const x = endX * progress;
    const y = endY * progress - Math.sin(Math.PI * progress) * arcHeight;

    rocket.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${angle.toFixed(2)}deg)`;
    rocket.style.setProperty('--flame-scale', (0.35 + progress * 1.2).toFixed(2));

    requestAnimationFrame(positionRocket);
  }

  requestAnimationFrame(positionRocket);
})();

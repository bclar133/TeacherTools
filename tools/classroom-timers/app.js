(() => {
  'use strict';

  const base = document.createElement('script');
  base.src = new URL('app-base.js', document.currentScript.src).href;
  base.async = false;

  base.addEventListener('load', () => {
    const fixStyle = document.createElement('style');
    fixStyle.id = 'roadRacerLiveSteeringFix';
    fixStyle.textContent = `
      .race-car {
        transform: translate(-50%, -50%) rotate(var(--car-angle, 0deg)) !important;
        transform-origin: 50% 50% !important;
        rotate: none !important;
      }
      .timer-stage.finished .race-car {
        transform: translate(-50%, -50%) rotate(var(--car-angle, 0deg)) !important;
        rotate: none !important;
      }
    `;
    document.head.appendChild(fixStyle);

    const sceneLayer = document.getElementById('sceneLayer');
    if (!sceneLayer) return;

    const tracked = new WeakSet();

    function attachSteering(car) {
      if (!car || tracked.has(car)) return;
      tracked.add(car);

      let lastX = null;
      let lastY = null;
      let angle = 0;
      let scheduled = false;

      const sync = () => {
        scheduled = false;
        const rect = sceneLayer.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const left = parseFloat(car.style.left);
        const top = parseFloat(car.style.top);
        if (!Number.isFinite(left) || !Number.isFinite(top)) return;

        const x = left / 100 * rect.width;
        const y = top / 100 * rect.height;

        if (lastX !== null && lastY !== null) {
          const dx = x - lastX;
          const dy = y - lastY;
          if (Math.hypot(dx, dy) > 0.12) {
            angle = Math.atan2(dy, dx) * 180 / Math.PI;
          }
        } else {
          const inlineAngle = parseFloat(car.style.rotate);
          if (Number.isFinite(inlineAngle)) angle = inlineAngle;
        }

        const next = `${angle}deg`;
        if (car.style.getPropertyValue('--car-angle') !== next) {
          car.style.setProperty('--car-angle', next);
        }

        lastX = x;
        lastY = y;
      };

      const styleObserver = new MutationObserver(() => {
        if (!scheduled) {
          scheduled = true;
          requestAnimationFrame(sync);
        }
      });
      styleObserver.observe(car, { attributes: true, attributeFilter: ['style'] });
      requestAnimationFrame(sync);
    }

    function findCar() {
      attachSteering(sceneLayer.querySelector('.race-car'));
    }

    const sceneObserver = new MutationObserver(findCar);
    sceneObserver.observe(sceneLayer, { childList: true, subtree: true });
    findCar();
  });

  document.body.appendChild(base);
})();

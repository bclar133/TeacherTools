(() => {
  'use strict';

  if (document.getElementById('dinosaurEggRefineStyleV5')) return;

  const sceneLayer = document.getElementById('sceneLayer');
  const stageStatus = document.getElementById('stageStatus');
  const display = document.getElementById('countdownDisplay');
  const minutesInput = document.getElementById('countdownMinutes');
  const secondsInput = document.getElementById('countdownSeconds');
  if (!sceneLayer || !display) return;

  const style = document.createElement('style');
  style.id = 'dinosaurEggRefineStyleV5';
  style.textContent = `
    /* Left background cluster: tree first, pond clearly to its right with a gap. */
    .xt-dino.dino-egg-upgraded .dino-up-tree.t1 {
      left: 7% !important;
      bottom: 27% !important;
      transform: scale(.68) !important;
      opacity: .78 !important;
      z-index: 1 !important;
    }

    .xt-dino.dino-egg-upgraded .dino-up-water {
      left: 18.5% !important;
      right: auto !important;
      bottom: 21.6% !important;
      width: 104px !important;
      height: 28px !important;
      z-index: 1 !important;
      opacity: .74 !important;
      filter: saturate(.86) !important;
    }

    /* Small background dinosaur stands on the grass left of the pond. */
    .xt-dino.dino-egg-upgraded .dino-up-drinker {
      left: 12.2% !important;
      right: auto !important;
      bottom: 22.4% !important;
      width: 54px !important;
      height: 34px !important;
      z-index: 1 !important;
      opacity: .60 !important;
      filter: drop-shadow(0 1px 1px rgba(0,0,0,.07)) !important;
      transform-origin: 55% 92% !important;
    }

    /* Keep the hatchling behind the shell halves. */
    .xt-dino.dino-egg-upgraded .dino-up-baby {
      z-index: 3 !important;
    }

    .xt-dino.dino-egg-upgraded .dino-up-shell-half {
      z-index: 7 !important;
      overflow: visible !important;
      position: absolute !important;
    }

    /* Hide the original shared crack overlay — cracks are mounted to each shell half below. */
    .xt-dino.dino-egg-upgraded .dino-up-cracks {
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }

    .xt-dino.dino-egg-upgraded .dino-up-shell-cracks {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
      pointer-events: none;
      z-index: 9;
    }

    .xt-dino.dino-egg-upgraded .dino-up-shell-cracks path {
      fill: none;
      stroke: #857652;
      stroke-width: 3.2;
      stroke-linecap: round;
      stroke-linejoin: round;
      opacity: 0;
      filter: drop-shadow(0 0 1px rgba(0,0,0,.06));
    }

    @media (max-width: 760px) {
      .xt-dino.dino-egg-upgraded .dino-up-tree.t1 {
        left: 4% !important;
        bottom: 27.5% !important;
        transform: scale(.52) !important;
      }

      .xt-dino.dino-egg-upgraded .dino-up-water {
        left: 16.5% !important;
        bottom: 22.2% !important;
        width: 82px !important;
        height: 22px !important;
      }

      .xt-dino.dino-egg-upgraded .dino-up-drinker {
        left: 10.4% !important;
        bottom: 23.1% !important;
        width: 42px !important;
        height: 27px !important;
      }
    }
  `;
  document.head.appendChild(style);

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const crackThresholds = [0.13, 0.25, 0.38, 0.52, 0.66, 0.79, 0.88];

  let displayedRemaining = null;
  let displayChangedAt = performance.now();
  let lastStatus = '';
  let lastScene = null;
  let raf = 0;

  function parseRemaining() {
    const parts = display.textContent.trim().split(':').map(Number);
    if (parts.some(v => !Number.isFinite(v))) return null;
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return null;
  }

  function totalSeconds() {
    return Math.max(1, (Number(minutesInput?.value) || 0) * 60 + (Number(secondsInput?.value) || 0));
  }

  function progressNow(now) {
    const current = parseRemaining();
    if (current === null) return 0;

    const status = stageStatus?.textContent.trim() || '';
    const running = status === 'Running';

    if (displayedRemaining === null || current !== displayedRemaining || status !== lastStatus) {
      displayedRemaining = current;
      displayChangedAt = now;
      lastStatus = status;
    }

    let estimated = current;
    if (running && current > 0) {
      estimated = Math.max(0, current - (now - displayChangedAt) / 1000);
    }

    return clamp(1 - estimated / totalSeconds(), 0, 1);
  }

  function patchDrinker(scene) {
    const drinker = scene.querySelector('.dino-up-drinker');
    if (!drinker || drinker.dataset.v5Patched === '1') return;

    drinker.innerHTML = `
      <svg viewBox="0 0 120 90" aria-hidden="true">
        <!-- tail -->
        <path d="M20 48 Q10 44 5 38" fill="none" stroke="#84b868" stroke-width="7" stroke-linecap="round"/>

        <!-- body -->
        <ellipse cx="46" cy="48" rx="20" ry="11" fill="#86bb69"/>

        <!-- neck and head reaching toward pond -->
        <path d="M58 44 Q72 36 85 25" fill="none" stroke="#86bb69" stroke-width="8" stroke-linecap="round"/>
        <ellipse cx="94" cy="22" rx="8" ry="6.5" fill="#8dc270"/>
        <circle cx="97" cy="20.5" r="1.4" fill="#1f2a1a"/>

        <!-- legs on grass -->
        <path d="M35 57 L33 77 M46 57 L45 78 M57 56 L59 77 M66 54 L70 75"
              fill="none" stroke="#5e8347" stroke-width="3.6" stroke-linecap="round"/>

        <!-- feet -->
        <path d="M29 77 L36 77 M41 78 L49 78 M55 77 L63 77 M67 75 L75 75"
              fill="none" stroke="#5e8347" stroke-width="2.6" stroke-linecap="round"/>

        <!-- lowered muzzle -->
        <path d="M98 24 Q103 29 101 35" fill="none" stroke="#6d9a52" stroke-width="2.2" stroke-linecap="round"/>
      </svg>
    `;

    drinker.dataset.v5Patched = '1';
  }

  function installShellCracks(scene) {
    if (!scene || scene.dataset.v5ShellCracks === '1') return;

    const sourceSvg = scene.querySelector('.dino-up-cracks');
    const leftHalf = scene.querySelector('.dino-up-shell-half.left');
    const rightHalf = scene.querySelector('.dino-up-shell-half.right');
    if (!sourceSvg || !leftHalf || !rightHalf) return;

    const sourcePaths = [...sourceSvg.querySelectorAll('path')];
    if (!sourcePaths.length) return;

    const viewBox = sourceSvg.getAttribute('viewBox') || '0 0 278 365';

    const makeOverlay = side => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', `dino-up-shell-cracks ${side}`);
      svg.setAttribute('viewBox', viewBox);
      svg.setAttribute('preserveAspectRatio', 'none');

      sourcePaths.forEach((p, i) => {
        const cp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        cp.setAttribute('d', p.getAttribute('d') || '');
        cp.dataset.crackIndex = String(i);
        svg.appendChild(cp);
      });

      return svg;
    };

    if (!leftHalf.querySelector('.dino-up-shell-cracks')) {
      leftHalf.appendChild(makeOverlay('left'));
    }
    if (!rightHalf.querySelector('.dino-up-shell-cracks')) {
      rightHalf.appendChild(makeOverlay('right'));
    }

    scene.dataset.v5ShellCracks = '1';
  }

  function syncShellCracks(scene, progress) {
    const groups = [
      [...scene.querySelectorAll('.dino-up-shell-half.left .dino-up-shell-cracks path')],
      [...scene.querySelectorAll('.dino-up-shell-half.right .dino-up-shell-cracks path')]
    ];

    groups.forEach(group => {
      group.forEach((path, i) => {
        const visible = progress >= (crackThresholds[i] ?? 1.1);
        path.style.opacity = visible ? '1' : '0';
      });
    });
  }

  function tick(now) {
    const scene = sceneLayer.querySelector('.xt-dino[data-xt-theme="dino"]');

    if (scene !== lastScene) {
      lastScene = scene || null;
      displayedRemaining = null;
    }

    if (scene) {
      patchDrinker(scene);
      installShellCracks(scene);
      syncShellCracks(scene, progressNow(now));
    }

    raf = requestAnimationFrame(tick);
  }

  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(tick);
})();
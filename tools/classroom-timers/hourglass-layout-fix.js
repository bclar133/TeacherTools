(() => {
  'use strict';

  const sceneLayer = document.getElementById('sceneLayer');
  if (!sceneLayer) return;

  const style = document.createElement('style');
  style.id = 'hourglassLayoutFixV3';
  style.textContent = `
    /* Force the Hourglass artwork to fill the entire timer stage. */
    .hourglass-scene.hourglass-upgraded {
      display:block !important;
      position:absolute !important;
      inset:0 !important;
      width:100% !important;
      height:100% !important;
      min-height:100% !important;
      overflow:hidden !important;
      background:#100d16 !important;
    }

    .hourglass-scene.hourglass-upgraded .hourglass-illustrated-bg,
    .hourglass-scene.hourglass-upgraded .hourglass-shadow-vignette,
    .hourglass-scene.hourglass-upgraded .hourglass-magic-haze {
      position:absolute !important;
      inset:0 !important;
      width:100% !important;
      height:100% !important;
      min-height:100% !important;
      pointer-events:none !important;
    }

    /* Keep the atmospheric overlays full-size, but show slightly more of the wizard artwork. */
    .hourglass-scene.hourglass-upgraded .hourglass-illustrated-bg {
      z-index:1 !important;
      background-size:100% 100%, 100% 100%, auto 94% !important;
      background-repeat:no-repeat, no-repeat, no-repeat !important;
      background-position:center, center, 68% 52% !important;
      opacity:1 !important;
      filter:brightness(.84) contrast(1.04) saturate(.94) !important;
      transform:none !important;
      transform-origin:center !important;
    }

    /* Softer vignette so the wizard remains clearly visible. */
    .hourglass-scene.hourglass-upgraded .hourglass-shadow-vignette {
      z-index:2 !important;
      background:
        radial-gradient(circle at 76% 34%, transparent 0 22%, rgba(5,4,8,.04) 38%, rgba(5,4,8,.18) 67%, rgba(4,3,7,.36) 100%),
        linear-gradient(90deg, rgba(4,3,7,.28) 0%, rgba(5,4,8,.07) 35%, rgba(5,4,8,.03) 72%, rgba(4,3,7,.14) 100%) !important;
    }

    .hourglass-scene.hourglass-upgraded .hourglass-magic-haze {
      z-index:3 !important;
      opacity:.48 !important;
    }

    /* Centre the hourglass in the full-height scene. */
    .hourglass-scene.hourglass-upgraded .hourglass {
      position:absolute !important;
      z-index:6 !important;
      left:42% !important;
      top:56% !important;
      margin:0 !important;
      transform:translate(-50%,-50%) !important;
      filter:drop-shadow(0 14px 22px rgba(0,0,0,.55)) !important;
    }

    /* Extend both glass chambers so they meet exactly at the bottleneck. */
    .hourglass-scene.hourglass-upgraded .hg-top,
    .hourglass-scene.hourglass-upgraded .hg-bottom {
      height:130px !important;
    }

    .hourglass-scene.hourglass-upgraded .hg-top {
      top:35px !important;
    }

    .hourglass-scene.hourglass-upgraded .hg-bottom {
      bottom:35px !important;
    }

    /* Sand begins just below the neck: nothing is drawn through the upper chamber. */
    .hourglass-scene.hourglass-upgraded .hg-stream {
      z-index:8 !important;
      left:113px !important;
      top:166px !important;
      width:3px !important;
      height:43px !important;
      opacity:var(--stream,1) !important;
      background:transparent !important;
      border-radius:999px !important;
      box-shadow:0 0 6px rgba(246,199,84,.25) !important;
      overflow:hidden !important;
      transform:translateX(-50%) !important;
      animation:none !important;
    }

    /* Moving bright/dark grains make the stream read as sand falling downward. */
    .hourglass-scene.hourglass-upgraded .hg-stream::before {
      content:'' !important;
      position:absolute !important;
      inset:-12px 0 0 !important;
      width:100% !important;
      height:calc(100% + 12px) !important;
      border-radius:999px !important;
      background:repeating-linear-gradient(
        180deg,
        rgba(255,247,201,.98) 0 4px,
        rgba(245,204,96,.96) 4px 8px,
        rgba(211,143,37,.84) 8px 12px
      ) !important;
      background-size:100% 12px !important;
      animation:hourglassFallingSand .30s linear infinite !important;
    }

    /* Small impact shimmer where the stream reaches the lower pile. */
    .hourglass-scene.hourglass-upgraded .hg-stream::after {
      content:'' !important;
      position:absolute !important;
      left:50% !important;
      bottom:-2px !important;
      width:9px !important;
      height:5px !important;
      transform:translateX(-50%) !important;
      border-radius:50% !important;
      background:rgba(247,201,91,.82) !important;
      filter:blur(.5px) !important;
      opacity:.75 !important;
      animation:hourglassSandImpact .36s ease-in-out infinite alternate !important;
    }

    @keyframes hourglassFallingSand {
      from { transform:translateY(0); }
      to { transform:translateY(12px); }
    }

    @keyframes hourglassSandImpact {
      from { width:7px; opacity:.55; }
      to { width:12px; opacity:.9; }
    }

    @media (max-width:760px) {
      .hourglass-scene.hourglass-upgraded .hourglass-illustrated-bg {
        background-size:100% 100%, 100% 100%, auto 90% !important;
        background-position:center, center, 67% 52% !important;
        filter:brightness(.78) contrast(1.04) saturate(.92) !important;
      }
      .hourglass-scene.hourglass-upgraded .hourglass {
        left:43% !important;
        top:57% !important;
        transform:translate(-50%,-50%) scale(.84) !important;
      }
    }
  `;
  document.head.appendChild(style);

  function syncHourglassScene() {
    const scene = sceneLayer.querySelector('.hourglass-scene');
    if (!scene) return;

    scene.querySelectorAll('.hourglass-wizard').forEach(el => el.remove());

    scene.style.position = 'absolute';
    scene.style.inset = '0';
    scene.style.width = '100%';
    scene.style.height = '100%';
  }

  const observer = new MutationObserver(syncHourglassScene);
  observer.observe(sceneLayer, { childList:true, subtree:true });
  syncHourglassScene();
})();

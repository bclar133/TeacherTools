(() => {
  'use strict';

  const sceneLayer = document.getElementById('sceneLayer');
  if (!sceneLayer) return;

  const style = document.createElement('style');
  style.id = 'hourglassLayoutFixV1';
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
      background:#050508 !important;
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

    /* The wizard fills the complete stage. Top alignment keeps his face below the timer overlay. */
    .hourglass-scene.hourglass-upgraded .hourglass-illustrated-bg {
      z-index:1 !important;
      background-size:cover !important;
      background-repeat:no-repeat !important;
      background-position:66% 0% !important;
      opacity:1 !important;
      filter:brightness(.72) contrast(1.08) saturate(.9) !important;
      transform:none !important;
      transform-origin:center !important;
    }

    /* Keep the edges atmospheric, but no longer bury the wizard's face in black. */
    .hourglass-scene.hourglass-upgraded .hourglass-shadow-vignette {
      z-index:2 !important;
      background:
        radial-gradient(circle at 76% 34%, transparent 0 18%, rgba(5,4,8,.08) 34%, rgba(5,4,8,.28) 64%, rgba(4,3,7,.55) 100%),
        linear-gradient(90deg, rgba(4,3,7,.42) 0%, rgba(5,4,8,.12) 35%, rgba(5,4,8,.06) 70%, rgba(4,3,7,.22) 100%) !important;
    }

    .hourglass-scene.hourglass-upgraded .hourglass-magic-haze {
      z-index:3 !important;
      opacity:.62 !important;
    }

    /* Centre the hourglass in the full-height scene rather than the old upper section. */
    .hourglass-scene.hourglass-upgraded .hourglass {
      position:absolute !important;
      z-index:6 !important;
      left:42% !important;
      top:56% !important;
      margin:0 !important;
      transform:translate(-50%,-50%) !important;
      filter:drop-shadow(0 14px 22px rgba(0,0,0,.55)) !important;
    }

    .hourglass-scene.hourglass-upgraded .hg-stream {
      z-index:8 !important;
      width:3px !important;
      height:50px !important;
      opacity:var(--stream,1) !important;
    }

    @media (max-width:760px) {
      .hourglass-scene.hourglass-upgraded .hourglass-illustrated-bg {
        background-position:64% 0% !important;
        filter:brightness(.66) contrast(1.08) saturate(.88) !important;
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

    /* Remove the old CSS-drawn wizard if an older cached upgrade inserted it. */
    scene.querySelectorAll('.hourglass-wizard').forEach(el => el.remove());

    /* Defensive inline sizing in case stale cached CSS wins the cascade. */
    scene.style.position = 'absolute';
    scene.style.inset = '0';
    scene.style.width = '100%';
    scene.style.height = '100%';
  }

  const observer = new MutationObserver(syncHourglassScene);
  observer.observe(sceneLayer, { childList:true, subtree:true });
  syncHourglassScene();
})();

(() => {
  'use strict';

  const sceneLayer = document.getElementById('sceneLayer');
  const stageStatus = document.getElementById('stageStatus');
  if (!sceneLayer) return;

  const style = document.createElement('style');
  style.id = 'hourglassLayoutFixV5';
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
      background:#120f19 !important;
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

    /* Brighter wizard artwork so the face and hand read clearly. */
    .hourglass-scene.hourglass-upgraded .hourglass-illustrated-bg {
      z-index:1 !important;
      background-size:100% 100%, 100% 100%, auto 96% !important;
      background-repeat:no-repeat, no-repeat, no-repeat !important;
      background-position:center, center, 68% 51% !important;
      opacity:1 !important;
      filter:brightness(1.02) contrast(1.06) saturate(.98) !important;
      transform:none !important;
      transform-origin:center !important;
    }

    /* Soften the dark overlays so the wizard remains visible in the shadows. */
    .hourglass-scene.hourglass-upgraded .hourglass-shadow-vignette {
      z-index:2 !important;
      background:
        radial-gradient(circle at 76% 34%, transparent 0 24%, rgba(5,4,8,.03) 40%, rgba(5,4,8,.12) 70%, rgba(4,3,7,.24) 100%),
        linear-gradient(90deg, rgba(4,3,7,.18) 0%, rgba(5,4,8,.04) 35%, rgba(5,4,8,.02) 72%, rgba(4,3,7,.10) 100%) !important;
    }

    .hourglass-scene.hourglass-upgraded .hourglass-magic-haze {
      z-index:3 !important;
      opacity:.36 !important;
    }

    /* Move the timer block to the middle-left for the Hourglass theme. */
    #countdownStage.theme-hourglass .time-display-wrap {
      position:absolute !important;
      left:6.5% !important;
      top:50% !important;
      right:auto !important;
      bottom:auto !important;
      transform:translateY(-50%) !important;
      width:min(30%, 300px) !important;
      z-index:12 !important;
      align-items:flex-start !important;
      text-align:left !important;
    }

    #countdownStage.theme-hourglass #countdownDisplay,
    #countdownStage.theme-hourglass #countdownMessage {
      text-align:left !important;
    }

    /* Centre the hourglass in the full-height scene. */
    .hourglass-scene.hourglass-upgraded .hourglass {
      position:absolute !important;
      z-index:6 !important;
      left:50% !important;
      top:56% !important;
      margin:0 !important;
      transform:translate(-50%,-50%) !important;
      filter:drop-shadow(0 14px 22px rgba(0,0,0,.55)) !important;
    }

    /* Extend both glass chambers so they meet exactly at the bottleneck. */
    .hourglass-scene.hourglass-upgraded .hg-top,
    .hourglass-scene.hourglass-upgraded .hg-bottom {
      height:130px !important;
      border:0 !important;
      background:rgba(225,242,247,.10) !important;
      box-shadow:inset 0 0 0 2px rgba(228,239,247,.10) !important;
    }

    .hourglass-scene.hourglass-upgraded .hg-top {
      top:35px !important;
    }

    .hourglass-scene.hourglass-upgraded .hg-bottom {
      bottom:35px !important;
    }

    /* Hide the falling stream until the countdown is actually running. */
    .hourglass-scene.hourglass-upgraded .hg-stream {
      z-index:8 !important;
      left:113px !important;
      top:166px !important;
      width:3px !important;
      height:92px !important;
      opacity:0 !important;
      visibility:hidden !important;
      background:transparent !important;
      border-radius:999px !important;
      box-shadow:0 0 6px rgba(246,199,84,.28) !important;
      overflow:hidden !important;
      transform:translateX(-50%) !important;
      animation:none !important;
    }

    .hourglass-scene.hourglass-upgraded.hourglass-running .hg-stream {
      opacity:var(--stream,1) !important;
      visibility:visible !important;
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
      width:11px !important;
      height:6px !important;
      transform:translateX(-50%) !important;
      border-radius:50% !important;
      background:rgba(247,201,91,.84) !important;
      filter:blur(.45px) !important;
      opacity:.8 !important;
      animation:hourglassSandImpact .36s ease-in-out infinite alternate !important;
    }

    @keyframes hourglassFallingSand {
      from { transform:translateY(0); }
      to { transform:translateY(12px); }
    }

    @keyframes hourglassSandImpact {
      from { width:8px; opacity:.58; }
      to { width:13px; opacity:.95; }
    }

    @media (max-width:760px) {
      .hourglass-scene.hourglass-upgraded .hourglass-illustrated-bg {
        background-size:100% 100%, 100% 100%, auto 92% !important;
        background-position:center, center, 67% 52% !important;
        filter:brightness(.94) contrast(1.04) saturate(.96) !important;
      }
      #countdownStage.theme-hourglass .time-display-wrap {
        left:5% !important;
        top:18% !important;
        transform:none !important;
        width:min(52%, 220px) !important;
      }
      .hourglass-scene.hourglass-upgraded .hourglass {
        left:50% !important;
        top:58% !important;
        transform:translate(-50%,-50%) scale(.84) !important;
      }
      .hourglass-scene.hourglass-upgraded .hg-stream {
        height:88px !important;
      }
    }
  `;
  document.head.appendChild(style);

  function syncHourglassState(scene) {
    if (!scene) return;
    const running = stageStatus?.textContent.trim() === 'Running';
    scene.classList.toggle('hourglass-running', Boolean(running));
  }

  function syncHourglassScene() {
    const scene = sceneLayer.querySelector('.hourglass-scene');
    if (!scene) return;

    scene.querySelectorAll('.hourglass-wizard').forEach(el => el.remove());

    scene.style.position = 'absolute';
    scene.style.inset = '0';
    scene.style.width = '100%';
    scene.style.height = '100%';
    syncHourglassState(scene);
  }

  const observer = new MutationObserver(syncHourglassScene);
  observer.observe(sceneLayer, { childList:true, subtree:true });

  const statusObserver = stageStatus ? new MutationObserver(() => {
    syncHourglassState(sceneLayer.querySelector('.hourglass-scene'));
  }) : null;
  statusObserver?.observe(stageStatus, { childList:true, characterData:true, subtree:true });

  syncHourglassScene();
})();

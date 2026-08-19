(() => {
  'use strict';

  const sceneLayer = document.getElementById('sceneLayer');
  const stageStatus = document.getElementById('stageStatus');
  if (!sceneLayer) return;

  const style = document.createElement('style');
  style.id = 'hourglassLayoutFixV6';
  style.textContent = `
    .hourglass-scene.hourglass-upgraded {
      display:block !important;
      position:absolute !important;
      inset:0 !important;
      width:100% !important;
      height:100% !important;
      min-height:100% !important;
      overflow:hidden !important;
      background:#17131f !important;
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

    /* Make the wizard clearly visible instead of disappearing into the shadows. */
    .hourglass-scene.hourglass-upgraded .hourglass-illustrated-bg {
      z-index:1 !important;
      background-size:100% 100%, 100% 100%, auto 98% !important;
      background-repeat:no-repeat, no-repeat, no-repeat !important;
      background-position:center, center, 69% 51% !important;
      opacity:1 !important;
      filter:brightness(1.48) contrast(1.03) saturate(1.04) !important;
      transform:none !important;
      transform-origin:center !important;
    }

    .hourglass-scene.hourglass-upgraded .hourglass-shadow-vignette {
      z-index:2 !important;
      background:
        radial-gradient(circle at 76% 34%, transparent 0 30%, rgba(5,4,8,.015) 46%, rgba(5,4,8,.05) 74%, rgba(4,3,7,.11) 100%),
        linear-gradient(90deg, rgba(4,3,7,.07) 0%, rgba(5,4,8,.015) 38%, rgba(5,4,8,.008) 74%, rgba(4,3,7,.035) 100%) !important;
    }

    .hourglass-scene.hourglass-upgraded .hourglass-magic-haze {
      z-index:3 !important;
      opacity:.14 !important;
    }

    /* Smaller timer, kept on the middle-left and clear of the hourglass. */
    #countdownStage.theme-hourglass .time-display-wrap {
      position:absolute !important;
      left:4.5% !important;
      top:50% !important;
      right:auto !important;
      bottom:auto !important;
      transform:translateY(-50%) !important;
      width:min(21%, 190px) !important;
      z-index:12 !important;
      justify-items:start !important;
      align-items:start !important;
      text-align:left !important;
      gap:.2rem !important;
    }

    #countdownStage.theme-hourglass #countdownDisplay,
    #countdownStage.theme-hourglass .time-display {
      font-size:clamp(2rem,3.25vw,2.9rem) !important;
      padding:3px 11px 4px !important;
      border-radius:12px !important;
      text-align:left !important;
    }

    #countdownStage.theme-hourglass #countdownMessage,
    #countdownStage.theme-hourglass .timer-message {
      margin-top:4px !important;
      padding:3px 8px !important;
      font-size:clamp(.68rem,.8vw,.78rem) !important;
      text-align:left !important;
    }

    .hourglass-scene.hourglass-upgraded .hourglass {
      position:absolute !important;
      z-index:6 !important;
      left:51% !important;
      top:56% !important;
      margin:0 !important;
      transform:translate(-50%,-50%) !important;
      filter:drop-shadow(0 14px 22px rgba(0,0,0,.55)) !important;
    }

    .hourglass-scene.hourglass-upgraded .hg-top,
    .hourglass-scene.hourglass-upgraded .hg-bottom {
      height:130px !important;
      border:0 !important;
      background:rgba(225,242,247,.08) !important;
      box-shadow:inset 0 0 0 2px rgba(228,239,247,.10) !important;
    }

    .hourglass-scene.hourglass-upgraded .hg-top {
      top:35px !important;
      z-index:8 !important;
    }

    /* The lower glass sits in front of the stream. Its opaque sand therefore hides the
       stream exactly where the falling grains meet the pile. */
    .hourglass-scene.hourglass-upgraded .hg-bottom {
      bottom:35px !important;
      z-index:8 !important;
    }

    .hourglass-scene.hourglass-upgraded .hg-sand-top,
    .hourglass-scene.hourglass-upgraded .hg-sand-bottom {
      box-shadow:none !important;
      border:0 !important;
    }

    .hourglass-scene.hourglass-upgraded .hg-sand-bottom {
      z-index:2 !important;
    }

    /* Stream starts at the neck and its height is updated continuously to end just
       inside the current top surface of the lower sand pile. */
    .hourglass-scene.hourglass-upgraded .hg-stream {
      z-index:7 !important;
      left:115px !important;
      top:165px !important;
      width:3px !important;
      height:var(--streamHeight,132px) !important;
      opacity:0 !important;
      visibility:hidden !important;
      background:transparent !important;
      border-radius:999px !important;
      box-shadow:0 0 5px rgba(246,199,84,.24) !important;
      overflow:hidden !important;
      transform:translateX(-50%) !important;
      animation:none !important;
      pointer-events:none !important;
    }

    .hourglass-scene.hourglass-upgraded.hourglass-running .hg-stream {
      opacity:var(--stream,1) !important;
      visibility:visible !important;
    }

    .hourglass-scene.hourglass-upgraded .hg-stream::before {
      content:'' !important;
      position:absolute !important;
      inset:-12px 0 0 !important;
      width:100% !important;
      height:calc(100% + 12px) !important;
      border-radius:999px !important;
      background:repeating-linear-gradient(
        180deg,
        rgba(255,248,205,.99) 0 3px,
        rgba(245,204,96,.96) 3px 7px,
        rgba(211,143,37,.82) 7px 11px
      ) !important;
      background-size:100% 11px !important;
      animation:hourglassFallingSand .27s linear infinite !important;
    }

    @keyframes hourglassFallingSand {
      from { transform:translateY(0); }
      to { transform:translateY(11px); }
    }

    @media (max-width:760px) {
      .hourglass-scene.hourglass-upgraded .hourglass-illustrated-bg {
        background-size:100% 100%, 100% 100%, auto 95% !important;
        background-position:center, center, 68% 52% !important;
        filter:brightness(1.34) contrast(1.03) saturate(1.02) !important;
      }

      #countdownStage.theme-hourglass .time-display-wrap {
        left:4% !important;
        top:18% !important;
        transform:none !important;
        width:min(42%, 165px) !important;
      }

      #countdownStage.theme-hourglass #countdownDisplay,
      #countdownStage.theme-hourglass .time-display {
        font-size:clamp(1.65rem,5vw,2.25rem) !important;
      }

      .hourglass-scene.hourglass-upgraded .hourglass {
        left:52% !important;
        top:58% !important;
        transform:translate(-50%,-50%) scale(.84) !important;
      }
    }
  `;
  document.head.appendChild(style);

  function syncHourglassState(scene) {
    if (!scene) return;
    const running = stageStatus?.textContent.trim() === 'Running';
    scene.classList.toggle('hourglass-running', Boolean(running));
  }

  function syncStreamToSand(scene) {
    if (!scene) return;
    const sand = scene.querySelector('.hg-sand-bottom');
    const stream = scene.querySelector('.hg-stream');
    if (!sand || !stream) return;

    const raw = sand.style.getPropertyValue('--bottomSand') || '0%';
    const percent = Math.max(0, Math.min(100, parseFloat(raw) || 0));

    /* Lower chamber is 130px tall. The stream begins at its top edge and extends
       2px into the pile; because the sand is layered above it, that overlap is hidden. */
    const streamHeight = Math.max(0, 132 - (1.30 * percent));
    stream.style.setProperty('--streamHeight', `${streamHeight.toFixed(2)}px`);
  }

  function attachSandObserver(scene) {
    const sand = scene?.querySelector('.hg-sand-bottom');
    if (!sand || sand.__hourglassStreamObserver) return;

    const observer = new MutationObserver(() => syncStreamToSand(scene));
    observer.observe(sand, { attributes:true, attributeFilter:['style'] });
    sand.__hourglassStreamObserver = observer;
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
    attachSandObserver(scene);
    syncStreamToSand(scene);
  }

  const observer = new MutationObserver(syncHourglassScene);
  observer.observe(sceneLayer, { childList:true, subtree:true });

  const statusObserver = stageStatus ? new MutationObserver(() => {
    const scene = sceneLayer.querySelector('.hourglass-scene');
    syncHourglassState(scene);
    syncStreamToSand(scene);
  }) : null;
  statusObserver?.observe(stageStatus, { childList:true, characterData:true, subtree:true });

  syncHourglassScene();
})();

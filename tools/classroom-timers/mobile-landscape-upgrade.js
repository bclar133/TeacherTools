(() => {
  'use strict';

  if (window.__mobileLandscapeUpgradeV2) return;
  window.__mobileLandscapeUpgradeV2 = true;

  const style = document.createElement('style');
  style.id = 'mobileLandscapeUpgradeStyleV2';
  style.textContent = `
    .mobile-fullscreen-entry,
    .mobile-landscape-prompt {
      display:none;
    }

    @media (max-width:900px) and (pointer:coarse) {
      /* Phones do not need desktop keyboard shortcuts. Replace them with a clear
         presentation button and keep the landscape guidance beside it. */
      #countdownWorkspace .keyboard-tip {
        display:none!important;
      }

      .mobile-fullscreen-entry {
        display:grid;
        justify-items:center;
        gap:5px;
        margin:10px auto 2px;
        width:min(100%,360px);
      }

      .mobile-fullscreen-button {
        width:100%;
        min-height:46px;
        padding:0 16px;
        border:0;
        border-radius:13px;
        color:#fff;
        background:linear-gradient(135deg,var(--violet),#4f42c8);
        box-shadow:0 8px 22px rgba(89,74,207,.24);
        font-family:var(--display,'Fredoka',sans-serif);
        font-size:.95rem;
        font-weight:800;
      }

      .mobile-fullscreen-note {
        margin:0;
        color:var(--muted);
        font-size:.66rem;
        font-weight:800;
        text-align:center;
      }

      .mobile-landscape-prompt {
        position:fixed;
        z-index:10050;
        left:50%;
        bottom:74px;
        transform:translateX(-50%);
        max-width:calc(100vw - 32px);
        padding:8px 12px;
        border:1px solid rgba(255,255,255,.28);
        border-radius:999px;
        background:rgba(9,21,35,.86);
        color:#fff;
        box-shadow:0 9px 28px rgba(0,0,0,.28);
        backdrop-filter:blur(9px);
        font-size:.69rem;
        font-weight:900;
        white-space:nowrap;
        pointer-events:none;
      }

      body.presentation-mode.mobile-landscape-needed .mobile-landscape-prompt {
        display:block;
      }

      body.presentation-mode .mobile-fullscreen-entry {
        display:none!important;
      }

      /* Keep the real timer controls available in phone presentation mode.
         They float over the active scene instead of consuming scene height. */
      body.presentation-mode #countdownWorkspace .timer-controls,
      body.presentation-mode #stopwatchWorkspace .stopwatch-actions,
      body.presentation-mode #intervalWorkspace .timer-controls,
      body.presentation-mode #focusWorkspace .timer-controls,
      body.presentation-mode #scheduleWorkspace .timer-controls {
        display:flex!important;
        position:fixed!important;
        z-index:99990!important;
        left:50%!important;
        right:auto!important;
        bottom:max(8px,env(safe-area-inset-bottom))!important;
        transform:translateX(-50%)!important;
        width:auto!important;
        max-width:calc(100vw - 20px)!important;
        margin:0!important;
        padding:6px!important;
        gap:6px!important;
        justify-content:center!important;
        flex-wrap:nowrap!important;
        border:1px solid rgba(255,255,255,.22)!important;
        border-radius:15px!important;
        background:rgba(10,22,36,.72)!important;
        box-shadow:0 8px 28px rgba(0,0,0,.28)!important;
        backdrop-filter:blur(10px)!important;
      }

      body.presentation-mode #countdownWorkspace .timer-controls .control-button,
      body.presentation-mode #stopwatchWorkspace .stopwatch-actions .control-button,
      body.presentation-mode #intervalWorkspace .timer-controls .control-button,
      body.presentation-mode #focusWorkspace .timer-controls .control-button,
      body.presentation-mode #scheduleWorkspace .timer-controls .control-button {
        flex:0 1 auto!important;
        min-width:0!important;
        min-height:42px!important;
        padding:0 11px!important;
        border-radius:10px!important;
        font-size:.78rem!important;
        white-space:nowrap!important;
      }

      body.presentation-mode #countdownWorkspace .timer-controls .primary,
      body.presentation-mode #stopwatchWorkspace .stopwatch-actions .primary,
      body.presentation-mode #intervalWorkspace .timer-controls .primary,
      body.presentation-mode #focusWorkspace .timer-controls .primary,
      body.presentation-mode #scheduleWorkspace .timer-controls .primary {
        min-width:82px!important;
      }

      /* Leave breathing room behind the floating controls on live builder screens. */
      body.presentation-mode #intervalWorkspace .builder-stage,
      body.presentation-mode #scheduleWorkspace .builder-stage,
      body.presentation-mode #focusWorkspace .focus-panel {
        padding-bottom:76px!important;
      }
    }

    @media (max-width:900px) and (pointer:coarse) and (orientation:landscape) {
      body.presentation-mode #countdownWorkspace .timer-controls,
      body.presentation-mode #stopwatchWorkspace .stopwatch-actions,
      body.presentation-mode #intervalWorkspace .timer-controls,
      body.presentation-mode #focusWorkspace .timer-controls,
      body.presentation-mode #scheduleWorkspace .timer-controls {
        bottom:max(5px,env(safe-area-inset-bottom))!important;
        padding:4px!important;
      }

      body.presentation-mode #countdownWorkspace .timer-controls .control-button,
      body.presentation-mode #stopwatchWorkspace .stopwatch-actions .control-button,
      body.presentation-mode #intervalWorkspace .timer-controls .control-button,
      body.presentation-mode #focusWorkspace .timer-controls .control-button,
      body.presentation-mode #scheduleWorkspace .timer-controls .control-button {
        min-height:38px!important;
        padding:0 10px!important;
        font-size:.74rem!important;
      }
    }
  `;
  document.head.appendChild(style);

  const phoneQuery = window.matchMedia('(max-width:900px) and (pointer:coarse)');
  const portraitQuery = window.matchMedia('(orientation:portrait)');
  const isPhoneLike = () => phoneQuery.matches;

  function makeFullscreenEntry(workspace, anchor, position = 'afterend') {
    if (!workspace || !anchor || workspace.querySelector('.mobile-fullscreen-entry')) return;

    const entry = document.createElement('div');
    entry.className = 'mobile-fullscreen-entry';
    entry.innerHTML = `
      <button class="mobile-fullscreen-button" type="button">⛶ Full screen</button>
      <p class="mobile-fullscreen-note">📱 Full screen looks best in landscape on phones.</p>
    `;

    if (position === 'append') anchor.appendChild(entry);
    else anchor.insertAdjacentElement('afterend', entry);

    entry.querySelector('.mobile-fullscreen-button')?.addEventListener('click', () => {
      document.getElementById('fullscreenBtn')?.click();
    });
  }

  const countdown = document.getElementById('countdownWorkspace');
  makeFullscreenEntry(countdown, countdown?.querySelector('.keyboard-tip'));

  const stopwatch = document.getElementById('stopwatchWorkspace');
  makeFullscreenEntry(stopwatch, stopwatch?.querySelector('.stopwatch-actions'));

  const clock = document.getElementById('clockWorkspace');
  makeFullscreenEntry(clock, clock?.querySelector('#clockStage'));

  const interval = document.getElementById('intervalWorkspace');
  makeFullscreenEntry(interval, interval?.querySelector('.builder-stage .timer-controls'));

  const focus = document.getElementById('focusWorkspace');
  makeFullscreenEntry(focus, focus?.querySelector('.timer-controls'));

  const schedule = document.getElementById('scheduleWorkspace');
  makeFullscreenEntry(schedule, schedule?.querySelector('.builder-stage .timer-controls'));

  if (!document.getElementById('mobileLandscapePrompt')) {
    const prompt = document.createElement('div');
    prompt.id = 'mobileLandscapePrompt';
    prompt.className = 'mobile-landscape-prompt';
    prompt.setAttribute('role', 'status');
    prompt.textContent = '↻ Rotate your phone to landscape for the best full-screen view';
    document.body.appendChild(prompt);
  }

  function setFallbackPrompt(show) {
    document.body.classList.toggle('mobile-landscape-needed', Boolean(show && isPhoneLike() && portraitQuery.matches));
  }

  async function lockLandscape() {
    if (!isPhoneLike() || !document.body.classList.contains('presentation-mode')) return;

    let locked = false;
    try {
      if (screen.orientation?.lock) {
        await screen.orientation.lock('landscape');
        locked = true;
      } else if (screen.lockOrientation) {
        locked = Boolean(screen.lockOrientation('landscape'));
      } else if (screen.mozLockOrientation) {
        locked = Boolean(screen.mozLockOrientation('landscape'));
      } else if (screen.msLockOrientation) {
        locked = Boolean(screen.msLockOrientation('landscape'));
      }
    } catch {}

    setFallbackPrompt(!locked);
  }

  function unlockOrientation() {
    setFallbackPrompt(false);
    try { screen.orientation?.unlock?.(); } catch {}
    try { screen.unlockOrientation?.(); } catch {}
    try { screen.mozUnlockOrientation?.(); } catch {}
    try { screen.msUnlockOrientation?.(); } catch {}
  }

  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement && document.body.classList.contains('presentation-mode')) {
      setTimeout(lockLandscape, 60);
    } else if (!document.body.classList.contains('presentation-mode')) {
      unlockOrientation();
    }
  });

  document.getElementById('fullscreenBtn')?.addEventListener('click', () => {
    if (!isPhoneLike()) return;
    setTimeout(() => {
      if (document.body.classList.contains('presentation-mode')) lockLandscape();
      else unlockOrientation();
    }, 180);
  });

  document.getElementById('presentationExitBtn')?.addEventListener('click', () => {
    setTimeout(unlockOrientation, 0);
  });

  const orientationChanged = () => {
    if (!document.body.classList.contains('presentation-mode')) return;
    if (!portraitQuery.matches) setFallbackPrompt(false);
    else if (isPhoneLike()) setTimeout(lockLandscape, 80);
  };

  portraitQuery.addEventListener?.('change', orientationChanged);
  window.addEventListener('orientationchange', orientationChanged);
})();
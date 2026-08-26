(() => {
  'use strict';

  if (window.__mobileLandscapeUpgradeV1) return;
  window.__mobileLandscapeUpgradeV1 = true;

  const style = document.createElement('style');
  style.id = 'mobileLandscapeUpgradeStyleV1';
  style.textContent = `
    .mobile-fullscreen-note,
    .mobile-landscape-prompt {
      display:none;
    }

    @media (max-width:900px) and (pointer:coarse) {
      .mobile-fullscreen-note {
        display:block;
        margin:-5px 4px 10px;
        color:var(--muted);
        font-size:.68rem;
        font-weight:800;
        text-align:center;
      }

      .mobile-landscape-prompt {
        position:fixed;
        z-index:10050;
        left:50%;
        bottom:18px;
        transform:translateX(-50%);
        max-width:calc(100vw - 32px);
        padding:9px 13px;
        border:1px solid rgba(255,255,255,.28);
        border-radius:999px;
        background:rgba(9,21,35,.86);
        color:#fff;
        box-shadow:0 9px 28px rgba(0,0,0,.28);
        backdrop-filter:blur(9px);
        font-size:.72rem;
        font-weight:900;
        white-space:nowrap;
        pointer-events:none;
      }

      body.presentation-mode.mobile-landscape-needed .mobile-landscape-prompt {
        display:block;
      }
    }
  `;
  document.head.appendChild(style);

  const topbar = document.querySelector('.topbar');
  if (topbar && !document.getElementById('mobileFullscreenNote')) {
    const note = document.createElement('p');
    note.id = 'mobileFullscreenNote';
    note.className = 'mobile-fullscreen-note';
    note.textContent = '📱 Full screen looks best in landscape on phones.';
    topbar.insertAdjacentElement('afterend', note);
  }

  if (!document.getElementById('mobileLandscapePrompt')) {
    const prompt = document.createElement('div');
    prompt.id = 'mobileLandscapePrompt';
    prompt.className = 'mobile-landscape-prompt';
    prompt.setAttribute('role', 'status');
    prompt.textContent = '↻ Rotate your phone to landscape for the best full-screen view';
    document.body.appendChild(prompt);
  }

  const phoneQuery = window.matchMedia('(max-width:900px) and (pointer:coarse)');
  const portraitQuery = window.matchMedia('(orientation:portrait)');

  const isPhoneLike = () => phoneQuery.matches;

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

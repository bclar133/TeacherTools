(() => {
  'use strict';

  const launchBtn = document.querySelector('#presentationBtn');
  const exitBtn = document.querySelector('#presentationExitBtn');
  if (!launchBtn || !exitBtn) return;

  let presentationActive = false;
  let requestedBrowserFullscreen = false;

  function setPresentation(active) {
    presentationActive = active;
    document.documentElement.classList.toggle('presentation-mode', active);
    launchBtn.setAttribute('aria-pressed', String(active));
    launchBtn.textContent = active ? '↙ Exit full screen' : '⛶ Full screen';
  }

  async function enterPresentation() {
    setPresentation(true);
    requestedBrowserFullscreen = false;

    if (document.fullscreenEnabled && document.documentElement.requestFullscreen) {
      try {
        await document.documentElement.requestFullscreen();
        requestedBrowserFullscreen = true;
      } catch (_) {
        // Presentation mode still works if the browser blocks fullscreen.
      }
    }
  }

  async function exitPresentation() {
    setPresentation(false);
    requestedBrowserFullscreen = false;

    if (document.fullscreenElement && document.exitFullscreen) {
      try { await document.exitFullscreen(); }
      catch (_) {}
    }
  }

  launchBtn.addEventListener('click', () => {
    if (presentationActive) exitPresentation();
    else enterPresentation();
  });

  exitBtn.addEventListener('click', exitPresentation);

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && presentationActive && requestedBrowserFullscreen) {
      setPresentation(false);
      requestedBrowserFullscreen = false;
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !presentationActive) return;
    if (!document.fullscreenElement) exitPresentation();
  });
})();

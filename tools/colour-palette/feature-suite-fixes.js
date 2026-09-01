(() => {
  'use strict';

  const targetName = document.getElementById('gameTargetName');
  const livePrompt = document.getElementById('gameLivePrompt');
  const goWheelButton = document.getElementById('goToGameWheel');
  if (!targetName || !livePrompt || !goWheelButton) return;

  function syncLivePrompt() {
    const name = targetName.textContent.trim();
    if (!name || name === 'Ready?' || name === 'Paused' || goWheelButton.disabled) return;
    livePrompt.innerHTML = `<p>Named colour game: <strong>${name}</strong> — click the wheel where you think it belongs.</p>`;
    livePrompt.classList.add('show');
  }

  new MutationObserver(syncLivePrompt).observe(targetName, {
    childList:true,
    characterData:true,
    subtree:true
  });
})();

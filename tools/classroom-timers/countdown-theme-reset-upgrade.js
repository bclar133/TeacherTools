(() => {
  'use strict';

  if (window.__countdownThemeResetUpgradeV1) return;
  window.__countdownThemeResetUpgradeV1 = true;

  document.addEventListener('click', event => {
    const card = event.target.closest?.('.theme-card[data-theme]');
    if (!card) return;

    const current = document.querySelector('.theme-card.active[data-theme]');
    if (!current || current === card || current.dataset.theme === card.dataset.theme) return;

    /* Reset the existing countdown before the app's normal theme-change handler runs.
       The normal handler then builds the newly selected scene at 0% progress. */
    document.getElementById('countdownResetBtn')?.click();
  }, true);
})();

(() => {
  'use strict';

  const select = document.querySelector('#dieSides');
  const wrap = document.querySelector('#customSidesWrap');
  const input = document.querySelector('#customSides');

  if (!select || !wrap || !input) return;

  function syncCustomDieField() {
    const enabled = select.value === 'custom';
    wrap.hidden = false;
    wrap.classList.toggle('disabled', !enabled);
    input.disabled = !enabled;
    input.setAttribute('aria-disabled', String(!enabled));
  }

  select.addEventListener('change', syncCustomDieField);
  syncCustomDieField();
})();

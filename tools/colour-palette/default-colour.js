(() => {
  'use strict';

  const DEFAULT_COLOUR = '#330072';
  const hexInput = document.getElementById('hexInput');

  if (!hexInput) return;

  hexInput.value = DEFAULT_COLOUR;
  hexInput.dispatchEvent(new Event('input', { bubbles:true }));
})();

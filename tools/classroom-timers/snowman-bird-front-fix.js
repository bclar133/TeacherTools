(() => {
  'use strict';

  if (document.getElementById('snowmanBirdFrontFixStyleV1')) return;

  const style = document.createElement('style');
  style.id = 'snowmanBirdFrontFixStyleV1';
  style.textContent = `
    .xt-snowman .snow2-bird {
      z-index: 999 !important;
    }
  `;

  document.head.appendChild(style);
})();

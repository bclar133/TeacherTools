(() => {
  'use strict';

  if (document.getElementById('snowmanBirdFrontFixStyleV2')) return;

  const style = document.createElement('style');
  style.id = 'snowmanBirdFrontFixStyleV2';
  style.textContent = `
    .xt-snowman .snow2-bird {
      z-index: 999 !important;
    }

    .xt-snowman .snow2-bird-crest {
      left: 15px !important;
      top: 2px !important;
      transform: rotate(-6deg) !important;
    }

    .xt-snowman .snow2-bird-crest::before {
      left: 5px !important;
      top: 0 !important;
      transform: rotate(12deg) !important;
    }

    .xt-snowman .snow2-bird-crest::after {
      left: 10px !important;
      top: 2px !important;
      transform: rotate(26deg) !important;
    }
  `;

  document.head.appendChild(style);
})();

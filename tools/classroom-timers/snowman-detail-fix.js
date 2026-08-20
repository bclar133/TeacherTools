(() => {
  'use strict';

  if (document.getElementById('snowmanDetailFixStyleV1')) return;

  const style = document.createElement('style');
  style.id = 'snowmanDetailFixStyleV1';
  style.textContent = `
    .xt-snowman .snow2-hat {
      translate: 0 12px !important;
    }

    .xt-snowman .snow2-bird-beak {
      clip-path: polygon(0 50%, 100% 0, 100% 100%) !important;
    }
  `;

  document.head.appendChild(style);
})();
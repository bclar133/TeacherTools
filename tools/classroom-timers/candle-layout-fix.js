(() => {
  'use strict';

  if (document.getElementById('candleLayoutFixStyleV1')) return;

  const style = document.createElement('style');
  style.id = 'candleLayoutFixStyleV1';
  style.textContent = `
    #countdownStage.theme-candle .time-display-wrap {
      position:absolute!important;
      left:5%!important;
      right:auto!important;
      top:7%!important;
      bottom:auto!important;
      transform:none!important;
      width:min(36%,340px)!important;
      z-index:30!important;
      justify-items:start!important;
      text-align:left!important;
    }

    #countdownStage.theme-candle #countdownDisplay,
    #countdownStage.theme-candle .time-display {
      width:auto!important;
      max-width:100%!important;
      text-align:left!important;
      white-space:nowrap!important;
    }

    #countdownStage.theme-candle #countdownMessage,
    #countdownStage.theme-candle .timer-message {
      text-align:left!important;
      justify-self:start!important;
    }

    #countdownStage.theme-candle .candle {
      left:auto!important;
      right:18%!important;
      transform:none!important;
    }

    @media (max-width:760px) {
      #countdownStage.theme-candle .time-display-wrap {
        left:3%!important;
        top:4%!important;
        width:min(47%,235px)!important;
      }

      #countdownStage.theme-candle .candle {
        right:8%!important;
        transform:scale(.88)!important;
        transform-origin:bottom right!important;
      }
    }
  `;

  document.head.appendChild(style);
})();

(() => {
  const current = document.currentScript;
  if (!current || document.getElementById('candleEffectsScript')) return;

  const effects = document.createElement('script');
  effects.id = 'candleEffectsScript';
  effects.src = new URL('candle-effects.js', current.src).href;
  effects.async = false;
  document.body.appendChild(effects);
})();

(() => {
  const current = document.currentScript;
  if (!current || document.getElementById('candleNightlifeScript')) return;

  const nightlife = document.createElement('script');
  nightlife.id = 'candleNightlifeScript';
  nightlife.src = new URL('candle-nightlife.js', current.src).href;
  nightlife.async = false;
  document.body.appendChild(nightlife);
})();

(() => {
  const current = document.currentScript;
  if (!current || document.getElementById('expandedThemesScript')) return;

  const expanded = document.createElement('script');
  expanded.id = 'expandedThemesScript';
  expanded.src = new URL('expanded-themes.js', current.src).href;
  expanded.async = false;
  document.body.appendChild(expanded);
})();

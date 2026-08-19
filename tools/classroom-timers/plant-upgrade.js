(() => {
  'use strict';

  if (document.getElementById('plantUpgradeStyle')) return;

  const style = document.createElement('style');
  style.id = 'plantUpgradeStyle';
  style.textContent = `
    /* Give the Growing Plant its own layout: plant left, timer right. */
    .plant-scene {
      --plant-x: 40%;
    }

    #countdownStage.theme-plant .time-display-wrap {
      position:absolute !important;
      left:auto !important;
      right:5% !important;
      top:50% !important;
      bottom:auto !important;
      transform:translateY(-50%) !important;
      width:min(31%, 310px) !important;
      justify-items:center !important;
      text-align:center !important;
      z-index:12 !important;
    }

    #countdownStage.theme-plant #countdownDisplay,
    #countdownStage.theme-plant .time-display {
      font-size:clamp(3.2rem,5vw,4.8rem) !important;
      text-align:center !important;
    }

    #countdownStage.theme-plant #countdownMessage,
    #countdownStage.theme-plant .timer-message {
      text-align:center !important;
    }

    /* Shift the whole plant left to make a clear timer column on the right. */
    .plant-scene .plant-pot,
    .plant-scene .plant-stem,
    .plant-scene .flower {
      left:var(--plant-x) !important;
    }

    /* Leaves now alternate clearly from one side of the stem to the other. */
    .plant-scene .leaf {
      width:76px !important;
      height:38px !important;
      border-radius:100% 0 100% 0 !important;
      background:linear-gradient(135deg,#49b965,#2f934d) !important;
      filter:drop-shadow(0 4px 4px rgba(37,93,54,.16));
    }

    .plant-scene .leaf.l1 {
      left:calc(var(--plant-x) - 75px) !important;
      bottom:38% !important;
      transform-origin:right bottom !important;
      transform:rotate(-10deg) scale(var(--leafScale,0)) !important;
    }

    .plant-scene .leaf.l2 {
      left:calc(var(--plant-x) + 3px) !important;
      bottom:47% !important;
      transform-origin:left bottom !important;
      transform:scaleX(-1) rotate(-10deg) scale(var(--leafScale,0)) !important;
    }

    .plant-scene .leaf.l3 {
      left:calc(var(--plant-x) - 75px) !important;
      bottom:57% !important;
      transform-origin:right bottom !important;
      transform:rotate(-8deg) scale(var(--leafScale,0)) !important;
    }

    .plant-scene .leaf.l4 {
      left:calc(var(--plant-x) + 3px) !important;
      bottom:65% !important;
      transform-origin:left bottom !important;
      transform:scaleX(-1) rotate(-8deg) scale(var(--leafScale,0)) !important;
    }

    /* A larger final flower, while preserving the existing bloom animation. */
    .plant-scene .flower {
      bottom:72% !important;
      width:132px !important;
      height:132px !important;
      transform:translate(-50%,50%) scale(var(--flowerScale,0)) !important;
      transform-origin:center center !important;
    }

    .plant-scene .flower .petal {
      left:45px !important;
      top:4px !important;
      width:42px !important;
      height:63px !important;
      border-radius:60% 60% 45% 45% !important;
      transform-origin:21px 62px !important;
    }

    .plant-scene .flower .petal:nth-child(2) { transform:rotate(72deg) !important; }
    .plant-scene .flower .petal:nth-child(3) { transform:rotate(144deg) !important; }
    .plant-scene .flower .petal:nth-child(4) { transform:rotate(216deg) !important; }
    .plant-scene .flower .petal:nth-child(5) { transform:rotate(288deg) !important; }

    .plant-scene .flower-core {
      left:44px !important;
      top:44px !important;
      width:44px !important;
      height:44px !important;
      box-shadow:0 3px 9px rgba(156,111,24,.22) !important;
    }

    @media (max-width:760px) {
      .plant-scene { --plant-x:38%; }

      #countdownStage.theme-plant .time-display-wrap {
        right:3% !important;
        top:18% !important;
        transform:none !important;
        width:min(43%, 190px) !important;
      }

      #countdownStage.theme-plant #countdownDisplay,
      #countdownStage.theme-plant .time-display {
        font-size:clamp(2rem,6vw,2.8rem) !important;
      }
    }
  `;

  document.head.appendChild(style);
})();

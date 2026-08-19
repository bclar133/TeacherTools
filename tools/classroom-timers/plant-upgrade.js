(() => {
  'use strict';

  if (document.getElementById('plantUpgradeStyleV2')) return;

  const style = document.createElement('style');
  style.id = 'plantUpgradeStyleV2';
  style.textContent = `
    /* Growing Plant layout: plant left, large timer right. */
    .plant-scene {
      --plant-x: 39%;
    }

    #countdownStage.theme-plant .time-display-wrap {
      position:absolute !important;
      left:auto !important;
      right:4% !important;
      top:50% !important;
      bottom:auto !important;
      transform:translateY(-50%) !important;
      width:min(36%, 370px) !important;
      justify-items:center !important;
      text-align:center !important;
      z-index:12 !important;
    }

    #countdownStage.theme-plant #countdownDisplay,
    #countdownStage.theme-plant .time-display {
      font-size:clamp(4rem,6.2vw,6rem) !important;
      padding:7px 18px 8px !important;
      text-align:center !important;
      line-height:.98 !important;
    }

    #countdownStage.theme-plant #countdownMessage,
    #countdownStage.theme-plant .timer-message {
      font-size:clamp(.9rem,1.1vw,1.05rem) !important;
      padding:5px 12px !important;
      text-align:center !important;
    }

    /* Shift the whole plant a little further left. */
    .plant-scene .plant-pot,
    .plant-scene .plant-stem,
    .plant-scene .flower {
      left:var(--plant-x) !important;
    }

    /* Leaves alternate from the left and right of the stem. */
    .plant-scene .leaf {
      width:82px !important;
      height:40px !important;
      background:linear-gradient(135deg,#49b965,#2f934d) !important;
      filter:drop-shadow(0 4px 4px rgba(37,93,54,.16));
      opacity:1;
    }

    /* Left leaves: element finishes at the stem. */
    .plant-scene .leaf.l1,
    .plant-scene .leaf.l3 {
      left:calc(var(--plant-x) - 82px) !important;
      border-radius:100% 0 100% 0 !important;
      transform-origin:right center !important;
    }

    .plant-scene .leaf.l1 {
      bottom:38% !important;
      transform:rotate(-10deg) scale(var(--leafScale,0)) !important;
    }

    .plant-scene .leaf.l3 {
      bottom:57% !important;
      transform:rotate(-7deg) scale(var(--leafScale,0)) !important;
    }

    /* Right leaves: element starts at the stem and extends to the right. */
    .plant-scene .leaf.l2,
    .plant-scene .leaf.l4 {
      left:var(--plant-x) !important;
      border-radius:0 100% 0 100% !important;
      transform-origin:left center !important;
    }

    .plant-scene .leaf.l2 {
      bottom:47% !important;
      transform:rotate(10deg) scale(var(--leafScale,0)) !important;
    }

    .plant-scene .leaf.l4 {
      bottom:65% !important;
      transform:rotate(7deg) scale(var(--leafScale,0)) !important;
    }

    /* Larger flower at the end of the countdown. */
    .plant-scene .flower {
      bottom:72% !important;
      width:176px !important;
      height:176px !important;
      transform:translate(-50%,50%) scale(var(--flowerScale,0)) !important;
      transform-origin:center center !important;
    }

    .plant-scene .flower .petal {
      left:60px !important;
      top:4px !important;
      width:56px !important;
      height:84px !important;
      border-radius:60% 60% 45% 45% !important;
      transform-origin:28px 83px !important;
    }

    .plant-scene .flower .petal:nth-child(2) { transform:rotate(72deg) !important; }
    .plant-scene .flower .petal:nth-child(3) { transform:rotate(144deg) !important; }
    .plant-scene .flower .petal:nth-child(4) { transform:rotate(216deg) !important; }
    .plant-scene .flower .petal:nth-child(5) { transform:rotate(288deg) !important; }

    .plant-scene .flower-core {
      left:59px !important;
      top:59px !important;
      width:58px !important;
      height:58px !important;
      box-shadow:0 4px 11px rgba(156,111,24,.22) !important;
    }

    @media (max-width:760px) {
      .plant-scene { --plant-x:36%; }

      #countdownStage.theme-plant .time-display-wrap {
        right:3% !important;
        top:18% !important;
        transform:none !important;
        width:min(48%, 220px) !important;
      }

      #countdownStage.theme-plant #countdownDisplay,
      #countdownStage.theme-plant .time-display {
        font-size:clamp(2.4rem,7vw,3.4rem) !important;
      }

      .plant-scene .flower {
        width:150px !important;
        height:150px !important;
      }

      .plant-scene .flower .petal {
        left:51px !important;
        width:48px !important;
        height:72px !important;
        transform-origin:24px 71px !important;
      }

      .plant-scene .flower-core {
        left:50px !important;
        top:50px !important;
        width:50px !important;
        height:50px !important;
      }
    }
  `;

  document.head.appendChild(style);
})();

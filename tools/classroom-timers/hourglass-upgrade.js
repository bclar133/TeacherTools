(() => {
  'use strict';

  const sceneLayer = document.getElementById('sceneLayer');
  if (!sceneLayer) return;

  const style = document.createElement('style');
  style.id = 'hourglassUpgradeV1';
  style.textContent = `
    .hourglass-scene.hourglass-upgraded {
      background:
        radial-gradient(circle at 50% 40%, rgba(103,78,120,.28), transparent 32%),
        radial-gradient(circle at 18% 42%, rgba(20,7,33,.78), transparent 27%),
        linear-gradient(#171321,#0b0a11) !important;
    }

    .hourglass-scene.hourglass-upgraded .hourglass {
      z-index:5;
    }

    .hourglass-scene.hourglass-upgraded .hg-stream {
      z-index:7;
      top:146px !important;
      left:113px !important;
      width:4px !important;
      height:48px !important;
      border-radius:999px;
      background:linear-gradient(180deg,#ffe492 0%,#f5c95e 55%,#d89a34 100%) !important;
      box-shadow:0 0 6px rgba(246,199,84,.32);
      opacity:var(--stream,1) !important;
      transform:translateX(-50%);
      animation:hourglassSandShimmer .42s linear infinite;
    }

    .hourglass-scene.hourglass-upgraded .hg-stream::after {
      content:'';
      position:absolute;
      left:50%;
      top:0;
      width:2px;
      height:100%;
      transform:translateX(-50%);
      background:repeating-linear-gradient(180deg,rgba(255,245,190,.9) 0 5px,rgba(232,170,56,.6) 5px 9px);
      border-radius:999px;
      animation:hourglassSandFlow .34s linear infinite;
    }

    @keyframes hourglassSandShimmer {
      50% { filter:brightness(1.16); }
    }
    @keyframes hourglassSandFlow {
      to { background-position:0 9px; }
    }

    .hourglass-wizard {
      position:absolute;
      z-index:2;
      left:7%;
      bottom:3%;
      width:250px;
      height:430px;
      pointer-events:none;
      opacity:.78;
      filter:drop-shadow(0 16px 24px rgba(0,0,0,.48));
    }

    .hourglass-wizard .wiz-cloak {
      position:absolute;
      left:52px;
      bottom:0;
      width:150px;
      height:270px;
      border-radius:70% 55% 14px 14px / 30% 30% 8px 8px;
      background:linear-gradient(90deg,#09080f 0%,#171122 45%,#07070c 100%);
      clip-path:polygon(50% 0,78% 11%,100% 100%,0 100%,20% 12%);
      box-shadow:inset 28px 0 35px rgba(0,0,0,.6),inset -20px 0 28px rgba(75,37,96,.14);
    }

    .hourglass-wizard .wiz-head {
      position:absolute;
      z-index:3;
      left:82px;
      top:74px;
      width:92px;
      height:112px;
      border-radius:48% 48% 44% 44%;
      background:radial-gradient(circle at 47% 35%,#9d7d6c 0 12%,#654d46 47%,#2d2527 100%);
      box-shadow:inset -16px -14px 22px rgba(0,0,0,.45);
    }

    .hourglass-wizard .wiz-hat {
      position:absolute;
      z-index:4;
      left:48px;
      top:8px;
      width:150px;
      height:105px;
    }
    .hourglass-wizard .wiz-hat::before {
      content:'';
      position:absolute;
      left:42px;
      top:0;
      width:75px;
      height:92px;
      background:linear-gradient(145deg,#171020,#08070c 72%);
      clip-path:polygon(50% 0,100% 100%,0 100%);
      transform:rotate(-8deg);
    }
    .hourglass-wizard .wiz-hat::after {
      content:'';
      position:absolute;
      left:0;
      bottom:0;
      width:150px;
      height:28px;
      border-radius:50%;
      background:#0b0810;
      box-shadow:0 8px 10px rgba(0,0,0,.35);
    }

    .hourglass-wizard .wiz-eye {
      position:absolute;
      z-index:5;
      top:118px;
      width:15px;
      height:10px;
      border-radius:50%;
      background:#d7ff62;
      box-shadow:0 0 7px #cfff4b,0 0 16px rgba(201,255,72,.75);
      animation:wizardEyeFlicker 2.8s ease-in-out infinite alternate;
    }
    .hourglass-wizard .wiz-eye.left { left:102px; transform:rotate(8deg); }
    .hourglass-wizard .wiz-eye.right { left:139px; transform:rotate(-8deg); }

    .hourglass-wizard .wiz-brow {
      position:absolute;
      z-index:6;
      top:108px;
      width:32px;
      height:5px;
      border-radius:999px;
      background:#1d1719;
    }
    .hourglass-wizard .wiz-brow.left { left:93px; transform:rotate(18deg); }
    .hourglass-wizard .wiz-brow.right { left:132px; transform:rotate(-18deg); }

    .hourglass-wizard .wiz-grin {
      position:absolute;
      z-index:5;
      left:110px;
      top:151px;
      width:40px;
      height:19px;
      border-bottom:5px solid #d7c5a7;
      border-radius:0 0 50% 50%;
      transform:rotate(4deg);
      filter:brightness(.7);
    }

    .hourglass-wizard .wiz-beard {
      position:absolute;
      z-index:4;
      left:90px;
      top:161px;
      width:82px;
      height:112px;
      background:linear-gradient(90deg,#332f37,#716776 45%,#2d2930);
      clip-path:polygon(0 0,100% 0,74% 100%,49% 78%,28% 100%);
      opacity:.72;
    }

    .hourglass-wizard .wiz-hand {
      position:absolute;
      z-index:4;
      right:6px;
      top:228px;
      width:46px;
      height:24px;
      border-radius:60% 40% 50% 50%;
      background:#5d4740;
      transform:rotate(-24deg);
      box-shadow:-26px 18px 0 -7px #17111e;
    }

    .hourglass-wizard .wiz-aura {
      position:absolute;
      z-index:1;
      left:70px;
      top:86px;
      width:125px;
      height:145px;
      border-radius:50%;
      background:radial-gradient(circle,rgba(166,79,205,.16),transparent 68%);
      animation:wizardAura 4.2s ease-in-out infinite alternate;
    }

    @keyframes wizardEyeFlicker {
      0%,88% { opacity:.82; transform:scale(1); }
      92% { opacity:.25; transform:scaleY(.35); }
      100% { opacity:1; }
    }
    @keyframes wizardAura {
      to { transform:scale(1.08); opacity:.55; }
    }

    @media (max-width:760px) {
      .hourglass-wizard {
        left:-34px;
        bottom:-12px;
        transform:scale(.72);
        transform-origin:left bottom;
        opacity:.62;
      }
    }
  `;
  document.head.appendChild(style);

  function upgradeHourglass() {
    const scene = sceneLayer.querySelector('.hourglass-scene');
    if (!scene || scene.dataset.wizardUpgrade === 'true') return;
    scene.dataset.wizardUpgrade = 'true';
    scene.classList.add('hourglass-upgraded');

    const wizard = document.createElement('div');
    wizard.className = 'hourglass-wizard';
    wizard.setAttribute('aria-hidden','true');
    wizard.innerHTML = `
      <div class="wiz-aura"></div>
      <div class="wiz-cloak"></div>
      <div class="wiz-head"></div>
      <div class="wiz-hat"></div>
      <div class="wiz-brow left"></div>
      <div class="wiz-brow right"></div>
      <div class="wiz-eye left"></div>
      <div class="wiz-eye right"></div>
      <div class="wiz-grin"></div>
      <div class="wiz-beard"></div>
      <div class="wiz-hand"></div>
    `;
    scene.insertBefore(wizard, scene.firstChild);
  }

  const observer = new MutationObserver(upgradeHourglass);
  observer.observe(sceneLayer, { childList:true, subtree:true });
  upgradeHourglass();
})();
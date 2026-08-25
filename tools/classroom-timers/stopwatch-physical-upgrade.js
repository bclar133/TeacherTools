(() => {
  'use strict';

  if (window.__stopwatchPhysicalUpgradeV2) return;
  window.__stopwatchPhysicalUpgradeV2 = true;

  const style = document.createElement('style');
  style.id = 'stopwatchPhysicalUpgradeStyleV2';
  style.textContent = `
    /* Keep the legacy hand node only so the older stopwatch code can still reference it safely. */
    .stopwatch-finger{display:none!important}

    .stopwatch-body{overflow:visible!important}

    .stopwatch-crown{
      left:50%!important;
      top:-33px!important;
      width:88px!important;
      height:46px!important;
      transform:translateX(-50%) translateY(0)!important;
      transform-origin:50% 100%!important;
      border-radius:11px 11px 5px 5px!important;
      background:repeating-linear-gradient(90deg,#697279 0 6px,#bac3c8 6px 11px)!important;
      box-shadow:inset 0 2px 0 rgba(255,255,255,.3),0 6px 8px rgba(0,0,0,.25)!important;
      transition:transform .11s ease,box-shadow .11s ease!important;
    }
    .stopwatch-crown::after{
      content:"";
      position:absolute;
      left:50%;
      bottom:-20px;
      width:48px;
      height:22px;
      transform:translateX(-50%);
      border-radius:3px 3px 8px 8px;
      background:linear-gradient(90deg,#69737b,#c0c9ce 50%,#707a82);
      box-shadow:inset 0 -2px 3px rgba(0,0,0,.16);
    }

    /* Side pushers sit close to the case. Their stems overlap the case edge so there is no visible gap. */
    .stopwatch-side{
      top:24px!important;
      width:64px!important;
      height:30px!important;
      border-radius:9px!important;
      background:linear-gradient(180deg,#e0e5e8 0%,#aeb8be 48%,#727d84 100%)!important;
      box-shadow:inset 0 2px 0 rgba(255,255,255,.36),0 5px 7px rgba(0,0,0,.22)!important;
      transition:transform .11s ease,box-shadow .11s ease!important;
    }
    .stopwatch-side.side-left{
      left:18px!important;
      transform:rotate(-34deg) translateY(0)!important;
      transform-origin:100% 50%!important;
    }
    .stopwatch-side.side-right{
      right:18px!important;
      transform:rotate(34deg) translateY(0)!important;
      transform-origin:0 50%!important;
    }
    .stopwatch-side::after{
      content:"";
      position:absolute;
      top:8px;
      width:40px;
      height:14px;
      border-radius:5px;
      background:linear-gradient(180deg,#cbd3d7 0%,#9da8ae 48%,#778188 100%);
      box-shadow:inset 0 1px 0 rgba(255,255,255,.28);
    }
    .stopwatch-side.side-left::after{right:-34px}
    .stopwatch-side.side-right::after{left:-34px}

    .stopwatch-crown.sw-pressed{
      transform:translateX(-50%) translateY(8px)!important;
      box-shadow:inset 0 2px 4px rgba(0,0,0,.18),0 1px 3px rgba(0,0,0,.2)!important;
    }
    .stopwatch-side.side-left.sw-pressed{
      transform:rotate(-34deg) translateY(8px)!important;
      box-shadow:inset 0 2px 4px rgba(0,0,0,.16),0 1px 3px rgba(0,0,0,.18)!important;
    }
    .stopwatch-side.side-right.sw-pressed{
      transform:rotate(34deg) translateY(8px)!important;
      box-shadow:inset 0 2px 4px rgba(0,0,0,.16),0 1px 3px rgba(0,0,0,.18)!important;
    }

    @media(max-width:760px){
      .stopwatch-finger{display:none!important}
    }
  `;
  document.head.appendChild(style);

  const press = selector => {
    const pusher = document.querySelector(selector);
    if (!pusher) return;
    pusher.classList.remove('sw-pressed');
    void pusher.offsetWidth;
    pusher.classList.add('sw-pressed');
    clearTimeout(pusher.__swPressTimer);
    pusher.__swPressTimer = setTimeout(() => pusher.classList.remove('sw-pressed'), 140);
  };

  document.getElementById('stopwatchStartBtn')?.addEventListener('click', () => press('.stopwatch-crown'), {capture:true});
  document.getElementById('stopwatchResetBtn')?.addEventListener('click', () => press('.stopwatch-side.side-left'), {capture:true});
  document.getElementById('lapBtn')?.addEventListener('click', () => press('.stopwatch-side.side-right'), {capture:true});

  document.addEventListener('keydown', event => {
    const workspace = document.getElementById('stopwatchWorkspace');
    if (!workspace?.classList.contains('active')) return;
    const tag = document.activeElement?.tagName;
    if (['INPUT','TEXTAREA','SELECT'].includes(tag)) return;
    if (event.code === 'Space') press('.stopwatch-crown');
    else if (event.key.toLowerCase() === 'r') press('.stopwatch-side.side-left');
  }, {capture:true});
})();

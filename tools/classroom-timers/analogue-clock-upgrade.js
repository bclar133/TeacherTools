(() => {
  'use strict';

  if (window.__clockDisplayUpgradeV3) return;
  window.__clockDisplayUpgradeV3 = true;

  const stage = document.getElementById('clockStage');
  const digital = document.getElementById('digitalClock');
  const analogue = document.getElementById('analogueClock');
  const flip = document.getElementById('flipClock');
  const scenic = document.getElementById('scenicClock');
  const srcHour = document.getElementById('flipHour');
  const srcMinute = document.getElementById('flipMinute');
  const srcSecond = document.getElementById('flipSecond');
  if (!stage || !digital || !analogue || !flip || !scenic || !srcHour || !srcMinute || !srcSecond) return;

  const style = document.createElement('style');
  style.id = 'clockDisplayUpgradeStyleV3';
  style.textContent = `
    #clockStage .clock-view[hidden]{display:none!important}
    #clockStage .clock-view.clock-upgrade-visible{display:grid!important}

    /* Proper analogue clock */
    #analogueClock.clock-upgrade-visible{place-items:center!important;width:100%;height:100%}
    #analogueClock .clock-face{
      position:relative;width:min(72vw,520px)!important;aspect-ratio:1!important;border:22px solid #e3edf2!important;
      border-radius:50%!important;background:radial-gradient(circle at 50% 50%,#fff 0 58%,#f3f5f5 76%,#dce3e6 100%)!important;
      box-shadow:0 22px 50px rgba(0,0,0,.35),inset 0 0 22px rgba(0,0,0,.14),inset 0 0 0 3px #9aa8b1!important;color:#21313d
    }
    #analogueClock .clock-tick{position:absolute;left:50%;top:50%;width:2px;height:9px;margin-left:-1px;margin-top:-4px;border-radius:2px;background:#495761;transform-origin:1px 4px;opacity:.68;z-index:2;pointer-events:none}
    #analogueClock .clock-tick.major{width:4px;height:18px;margin-left:-2px;margin-top:-9px;background:#22323e;opacity:1}
    #analogueClock .clock-number{position:absolute!important;left:50%!important;top:50%!important;font-family:var(--display)!important;font-size:2.1rem!important;line-height:1!important;font-weight:800!important;color:#25343f!important;transform:translate(-50%,-50%)!important;z-index:4}
    #analogueClock .clock-hand{position:absolute!important;left:50%!important;bottom:50%!important;transform-origin:50% 100%!important;border-radius:999px 999px 5px 5px!important;z-index:6!important;box-shadow:0 2px 3px rgba(0,0,0,.18)}
    #analogueClock .clock-hand.hour{width:12px!important;height:27%!important;background:#26333c!important}
    #analogueClock .clock-hand.minute{width:8px!important;height:38%!important;background:#3b4d5a!important}
    #analogueClock .clock-hand.second{width:3px!important;height:42%!important;background:#e4574c!important;box-shadow:none!important}
    #analogueClock .clock-hand.second::after{content:"";position:absolute;left:50%;bottom:-17%;width:3px;height:20%;transform:translateX(-50%);background:#e4574c;border-radius:3px}
    #analogueClock .clock-pin{position:absolute!important;z-index:8!important;left:50%!important;top:50%!important;width:22px!important;height:22px!important;transform:translate(-50%,-50%)!important;border-radius:50%!important;background:#e4574c!important;box-shadow:0 2px 4px rgba(0,0,0,.25),inset 0 2px 2px rgba(255,255,255,.25)!important}

    /* Hide the legacy flip nodes; app-core still writes time into them for our observer. */
    #flipClock > #flipHour,
    #flipClock > #flipMinute,
    #flipClock > #flipSecond,
    #flipClock > span{display:none!important}

    /* Dedicated split-flap renderer. Always one horizontal row. */
    #flipClock.clock-upgrade-visible{
      display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;
      width:100%!important;height:100%!important;padding:32px 22px!important;box-sizing:border-box!important;overflow:hidden!important
    }
    .split-flap-row{
      display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;
      flex-wrap:nowrap!important;gap:clamp(7px,1.4vw,20px)!important;width:100%!important;max-width:1040px!important
    }
    .split-flap-sep{
      flex:0 0 auto;color:#f7f7f4;font-family:var(--display)!important;font-size:clamp(3.2rem,6.2vw,6.4rem)!important;
      font-weight:800;line-height:1;transform:translateY(-.06em);text-shadow:0 4px 12px rgba(0,0,0,.24)
    }
    .split-flap-card{
      --card-w:clamp(105px,18vw,205px);--card-h:clamp(140px,23vw,255px);
      position:relative;flex:0 1 var(--card-w);width:var(--card-w);height:var(--card-h);min-width:0;
      perspective:1100px;border-radius:18px;box-shadow:0 20px 38px rgba(0,0,0,.3),0 0 0 1px rgba(255,255,255,.08);background:#142b3e
    }
    .split-flap-half{
      position:absolute;left:0;width:100%;height:50%;overflow:hidden;background:#29445a;color:#f8f8f4;
      font-family:var(--display)!important;font-weight:800;letter-spacing:-.045em;text-shadow:0 4px 0 rgba(0,0,0,.15);
      backface-visibility:hidden;-webkit-backface-visibility:hidden
    }
    .split-flap-half.top{top:0;border-radius:18px 18px 0 0;background:linear-gradient(180deg,#304e66,#263f54);border-bottom:1px solid rgba(0,0,0,.58)}
    .split-flap-half.bottom{bottom:0;border-radius:0 0 18px 18px;background:linear-gradient(180deg,#1d374c,#152b3e);border-top:1px solid rgba(255,255,255,.05)}
    .split-flap-number{
      position:absolute;left:0;width:100%;height:200%;display:flex;align-items:center;justify-content:center;
      font-size:clamp(4.4rem,10vw,8.8rem)!important;line-height:1
    }
    .split-flap-half.top .split-flap-number{top:0}
    .split-flap-half.bottom .split-flap-number{top:-100%}
    .split-flap-static{z-index:1}
    .split-flap-static.top{z-index:2}
    .split-flap-fold{z-index:5;pointer-events:none}
    .split-flap-fold.top{transform-origin:50% 100%;transform:rotateX(0deg)}
    .split-flap-fold.bottom{transform-origin:50% 0%;transform:rotateX(90deg);z-index:4}
    .split-flap-hinge{position:absolute;left:0;right:0;top:50%;height:2px;transform:translateY(-1px);background:#091723;z-index:8;box-shadow:0 -1px 0 rgba(255,255,255,.07),0 1px 0 rgba(0,0,0,.38);pointer-events:none}
    .split-flap-hinge::before,.split-flap-hinge::after{content:"";position:absolute;top:50%;width:8px;height:8px;margin-top:-4px;border-radius:50%;background:#0a1925;box-shadow:inset 0 1px 1px rgba(255,255,255,.08)}
    .split-flap-hinge::before{left:9px}.split-flap-hinge::after{right:9px}

    .split-flap-card.flipping .split-flap-fold.top{animation:splitTop .28s cubic-bezier(.55,.04,.9,.45) forwards}
    .split-flap-card.flipping .split-flap-fold.bottom{animation:splitBottom .28s cubic-bezier(.12,.55,.25,1) .28s forwards}
    @keyframes splitTop{from{transform:rotateX(0deg);filter:brightness(1)}to{transform:rotateX(-90deg);filter:brightness(.58)}}
    @keyframes splitBottom{from{transform:rotateX(90deg);filter:brightness(.6)}to{transform:rotateX(0deg);filter:brightness(1)}}

    html[data-theme="dark"] #clockStage{background:linear-gradient(145deg,#101c27,#071019)!important}
    html[data-theme="dark"] #analogueClock .clock-face{border-color:#788792!important;background:radial-gradient(circle,#27333d 0 62%,#1d2730 78%,#121a21 100%)!important;color:#eef5f8!important;box-shadow:0 22px 50px rgba(0,0,0,.55),inset 0 0 24px rgba(0,0,0,.42),inset 0 0 0 3px #485761!important}
    html[data-theme="dark"] #analogueClock .clock-number{color:#eef5f8!important}
    html[data-theme="dark"] #analogueClock .clock-tick{background:#b9c7d0!important}
    html[data-theme="dark"] #analogueClock .clock-hand.hour,
    html[data-theme="dark"] #analogueClock .clock-hand.minute{background:#f0f5f7!important}

    @media(max-width:760px){
      #flipClock.clock-upgrade-visible{padding:18px 8px!important}
      .split-flap-row{gap:5px!important}
      .split-flap-card{--card-w:clamp(72px,24vw,112px);--card-h:clamp(98px,30vw,145px);border-radius:12px}
      .split-flap-half.top{border-radius:12px 12px 0 0}.split-flap-half.bottom{border-radius:0 0 12px 12px}
      .split-flap-number{font-size:clamp(3rem,14vw,5.1rem)!important}
      .split-flap-sep{font-size:clamp(2.1rem,7vw,3.2rem)!important}
      #analogueClock .clock-face{width:min(84vw,430px)!important;border-width:16px!important}
    }
  `;
  document.head.appendChild(style);

  /* Build full analogue face. */
  const face = analogue.querySelector('.clock-face');
  if (face && !face.dataset.fullAnalogueFace) {
    face.dataset.fullAnalogueFace = 'true';
    face.querySelectorAll('.clock-number').forEach(el => el.remove());
    const tickLayer = document.createDocumentFragment();
    for (let i = 0; i < 60; i++) {
      const tick = document.createElement('i');
      tick.className = `clock-tick${i % 5 === 0 ? ' major' : ''}`;
      tick.style.transform = `rotate(${i * 6}deg) translateY(-226px)`;
      tickLayer.appendChild(tick);
    }
    face.prepend(tickLayer);
    for (let n = 1; n <= 12; n++) {
      const number = document.createElement('div');
      number.className = 'clock-number';
      number.textContent = String(n);
      const angle = n * Math.PI / 6;
      const radius = 39;
      number.style.left = `${50 + Math.sin(angle) * radius}%`;
      number.style.top = `${50 - Math.cos(angle) * radius}%`;
      face.appendChild(number);
    }
  }

  /* Build a real split-flap renderer, independent of the legacy flip layout. */
  const oldRow = flip.querySelector('.split-flap-row');
  if (oldRow) oldRow.remove();
  const row = document.createElement('div');
  row.className = 'split-flap-row';
  row.innerHTML = `
    <div class="split-flap-card" data-flap="hour"></div>
    <div class="split-flap-sep">:</div>
    <div class="split-flap-card" data-flap="minute"></div>
    <div class="split-flap-sep">:</div>
    <div class="split-flap-card" data-flap="second"></div>`;
  flip.appendChild(row);

  function buildCard(root, value) {
    root.dataset.value = value;
    root.innerHTML = `
      <div class="split-flap-half split-flap-static top"><div class="split-flap-number">${value}</div></div>
      <div class="split-flap-half split-flap-static bottom"><div class="split-flap-number">${value}</div></div>
      <div class="split-flap-half split-flap-fold top"><div class="split-flap-number">${value}</div></div>
      <div class="split-flap-half split-flap-fold bottom"><div class="split-flap-number">${value}</div></div>
      <div class="split-flap-hinge"></div>`;
    return {
      root,
      staticTop: root.querySelector('.split-flap-static.top .split-flap-number'),
      staticBottom: root.querySelector('.split-flap-static.bottom .split-flap-number'),
      foldTop: root.querySelector('.split-flap-fold.top .split-flap-number'),
      foldBottom: root.querySelector('.split-flap-fold.bottom .split-flap-number')
    };
  }

  const cards = {
    hour: buildCard(row.querySelector('[data-flap="hour"]'), srcHour.textContent.trim() || '00'),
    minute: buildCard(row.querySelector('[data-flap="minute"]'), srcMinute.textContent.trim() || '00'),
    second: buildCard(row.querySelector('[data-flap="second"]'), srcSecond.textContent.trim() || '00')
  };

  function flipTo(card, nextValue) {
    const current = card.root.dataset.value || '';
    if (nextValue === current || card.root.classList.contains('flipping')) return;

    /* New top is waiting underneath. Current bottom remains until second half of flip. */
    card.staticTop.textContent = nextValue;
    card.staticBottom.textContent = current;
    card.foldTop.textContent = current;
    card.foldBottom.textContent = nextValue;

    card.root.classList.remove('flipping');
    void card.root.offsetWidth;
    card.root.classList.add('flipping');

    clearTimeout(card.root.__finishFlip);
    card.root.__finishFlip = setTimeout(() => {
      card.staticTop.textContent = nextValue;
      card.staticBottom.textContent = nextValue;
      card.foldTop.textContent = nextValue;
      card.foldBottom.textContent = nextValue;
      card.root.dataset.value = nextValue;
      card.root.classList.remove('flipping');
    }, 590);
  }

  function syncFlip() {
    flipTo(cards.hour, srcHour.textContent.trim() || '00');
    flipTo(cards.minute, srcMinute.textContent.trim() || '00');
    flipTo(cards.second, srcSecond.textContent.trim() || '00');
  }

  const observer = new MutationObserver(syncFlip);
  [srcHour, srcMinute, srcSecond].forEach(source => observer.observe(source, {childList:true,subtree:true,characterData:true}));

  const views = {digital, analogue, flip, scenic};
  function show(styleName) {
    const name = Object.prototype.hasOwnProperty.call(views, styleName) ? styleName : 'digital';
    Object.entries(views).forEach(([key, view]) => {
      const active = key === name;
      view.hidden = !active;
      view.classList.toggle('clock-upgrade-visible', active);
      view.style.display = active ? (key === 'flip' ? 'flex' : 'grid') : 'none';
    });
    document.querySelectorAll('[data-clock-style]').forEach(button => button.classList.toggle('active', button.dataset.clockStyle === name));
    try { localStorage.setItem('ttTimers.clockStyle', JSON.stringify(name)); } catch {}
    if (name === 'flip') syncFlip();
  }

  document.querySelectorAll('[data-clock-style]').forEach(button => {
    button.addEventListener('click', () => requestAnimationFrame(() => show(button.dataset.clockStyle)));
  });

  let stored = 'digital';
  try { stored = JSON.parse(localStorage.getItem('ttTimers.clockStyle') || '"digital"'); } catch {}
  requestAnimationFrame(() => show(stored));
})();

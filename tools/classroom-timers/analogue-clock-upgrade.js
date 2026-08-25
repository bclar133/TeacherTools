(() => {
  'use strict';

  if (window.__clockDisplayUpgradeV2) return;
  window.__clockDisplayUpgradeV2 = true;

  const stage = document.getElementById('clockStage');
  const digital = document.getElementById('digitalClock');
  const analogue = document.getElementById('analogueClock');
  const flip = document.getElementById('flipClock');
  const scenic = document.getElementById('scenicClock');
  if (!stage || !digital || !analogue || !flip || !scenic) return;

  const style = document.createElement('style');
  style.id = 'clockDisplayUpgradeStyleV2';
  style.textContent = `
    #clockStage .clock-view[hidden]{display:none!important}
    #clockStage .clock-view.clock-upgrade-visible{display:grid!important}

    /* Proper analogue clock */
    #analogueClock.clock-upgrade-visible{
      place-items:center!important;
      width:100%;
      height:100%;
    }
    #analogueClock .clock-face{
      position:relative;
      width:min(72vw,520px)!important;
      aspect-ratio:1!important;
      border:22px solid #e3edf2!important;
      border-radius:50%!important;
      background:radial-gradient(circle at 50% 50%,#fff 0 58%,#f3f5f5 76%,#dce3e6 100%)!important;
      box-shadow:0 22px 50px rgba(0,0,0,.35),inset 0 0 22px rgba(0,0,0,.14),inset 0 0 0 3px #9aa8b1!important;
      color:#21313d;
    }
    #analogueClock .clock-tick{
      position:absolute;left:50%;top:50%;width:2px;height:9px;margin-left:-1px;margin-top:-4px;
      border-radius:2px;background:#495761;transform-origin:1px 4px;opacity:.68;z-index:2;pointer-events:none
    }
    #analogueClock .clock-tick.major{width:4px;height:18px;margin-left:-2px;margin-top:-9px;background:#22323e;opacity:1}
    #analogueClock .clock-number{
      position:absolute!important;left:50%!important;top:50%!important;font-family:var(--display)!important;
      font-size:2.1rem!important;line-height:1!important;font-weight:800!important;color:#25343f!important;
      transform:translate(-50%,-50%)!important;z-index:4
    }
    #analogueClock .clock-hand{
      position:absolute!important;left:50%!important;bottom:50%!important;transform-origin:50% 100%!important;
      border-radius:999px 999px 5px 5px!important;z-index:6!important;box-shadow:0 2px 3px rgba(0,0,0,.18)
    }
    #analogueClock .clock-hand.hour{width:12px!important;height:27%!important;background:#26333c!important}
    #analogueClock .clock-hand.minute{width:8px!important;height:38%!important;background:#3b4d5a!important}
    #analogueClock .clock-hand.second{width:3px!important;height:42%!important;background:#e4574c!important;box-shadow:none!important}
    #analogueClock .clock-hand.second::after{
      content:"";position:absolute;left:50%;bottom:-17%;width:3px;height:20%;transform:translateX(-50%);
      background:#e4574c;border-radius:3px
    }
    #analogueClock .clock-pin{
      position:absolute!important;z-index:8!important;left:50%!important;top:50%!important;width:22px!important;height:22px!important;
      transform:translate(-50%,-50%)!important;border-radius:50%!important;background:#e4574c!important;
      box-shadow:0 2px 4px rgba(0,0,0,.25),inset 0 2px 2px rgba(255,255,255,.25)!important
    }

    /* Split-flap clock: HH : MM : SS in one horizontal row. */
    #flipClock.clock-upgrade-visible{
      display:flex!important;
      flex-direction:row!important;
      align-items:center!important;
      justify-content:center!important;
      gap:clamp(12px,2vw,26px)!important;
      width:100%!important;
      height:100%!important;
      padding:40px!important;
      box-sizing:border-box!important;
    }
    #flipClock .flip-unit{
      position:relative!important;
      display:grid!important;
      place-items:center!important;
      flex:0 0 auto!important;
      width:clamp(112px,15vw,178px)!important;
      height:clamp(145px,19vw,210px)!important;
      min-width:0!important;
      border:1px solid rgba(255,255,255,.12)!important;
      border-radius:18px!important;
      overflow:hidden!important;
      background:linear-gradient(180deg,#2c4357 0 49.6%,#172c3e 50.4% 100%)!important;
      color:#fff!important;
      font-family:var(--display)!important;
      font-size:clamp(4.5rem,10vw,8rem)!important;
      font-weight:700!important;
      line-height:1!important;
      letter-spacing:-.04em!important;
      text-shadow:0 3px 0 rgba(0,0,0,.18)!important;
      box-shadow:0 18px 34px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.08)!important;
      transform-origin:50% 50%!important;
      perspective:800px!important;
      backface-visibility:hidden!important;
    }
    #flipClock .flip-unit::before{
      content:"";position:absolute;left:0;right:0;top:50%;height:2px;transform:translateY(-1px);
      background:rgba(0,0,0,.48);box-shadow:0 1px 0 rgba(255,255,255,.07);z-index:3;pointer-events:none
    }
    #flipClock .flip-unit::after{
      content:"";position:absolute;left:8px;right:8px;top:50%;height:8px;transform:translateY(-4px);
      background:radial-gradient(circle at left center,#0b1721 0 3px,transparent 4px),radial-gradient(circle at right center,#0b1721 0 3px,transparent 4px);
      opacity:.85;z-index:4;pointer-events:none
    }
    #flipClock > span{
      display:block!important;
      flex:0 0 auto!important;
      width:auto!important;
      color:#eef5f8!important;
      font-family:var(--display)!important;
      font-size:clamp(3.2rem,6vw,5.5rem)!important;
      line-height:1!important;
      font-weight:700!important;
      transform:translateY(-4px)!important;
    }
    #flipClock .flip-unit.flip-changing{animation:clockFlipTick .34s cubic-bezier(.2,.7,.25,1)}
    @keyframes clockFlipTick{
      0%{transform:perspective(800px) rotateX(0deg) scaleY(1)}
      42%{transform:perspective(800px) rotateX(-13deg) scaleY(.97);filter:brightness(.86)}
      100%{transform:perspective(800px) rotateX(0deg) scaleY(1);filter:brightness(1)}
    }

    html[data-theme="dark"] #clockStage{background:linear-gradient(145deg,#101c27,#071019)!important}
    html[data-theme="dark"] #analogueClock .clock-face{
      border-color:#788792!important;background:radial-gradient(circle,#27333d 0 62%,#1d2730 78%,#121a21 100%)!important;
      color:#eef5f8!important;box-shadow:0 22px 50px rgba(0,0,0,.55),inset 0 0 24px rgba(0,0,0,.42),inset 0 0 0 3px #485761!important
    }
    html[data-theme="dark"] #analogueClock .clock-number{color:#eef5f8!important}
    html[data-theme="dark"] #analogueClock .clock-tick{background:#b9c7d0!important}
    html[data-theme="dark"] #analogueClock .clock-hand.hour,
    html[data-theme="dark"] #analogueClock .clock-hand.minute{background:#f0f5f7!important}

    @media(max-width:760px){
      #flipClock.clock-upgrade-visible{gap:8px!important;padding:18px 10px!important}
      #flipClock .flip-unit{width:clamp(82px,25vw,118px)!important;height:clamp(108px,31vw,145px)!important;font-size:clamp(3.2rem,15vw,5rem)!important}
      #flipClock > span{font-size:2.8rem!important}
      #analogueClock .clock-face{width:min(84vw,430px)!important;border-width:16px!important}
    }
  `;
  document.head.appendChild(style);

  const face = analogue.querySelector('.clock-face');
  if (face && !face.dataset.fullAnalogueFace) {
    face.dataset.fullAnalogueFace = 'true';
    face.querySelectorAll('.clock-number').forEach(el => el.remove());

    const tickLayer = document.createDocumentFragment();
    for (let i = 0; i < 60; i++) {
      const tick = document.createElement('i');
      tick.className = `clock-tick${i % 5 === 0 ? ' major' : ''}`;
      const angle = i * 6;
      tick.style.transform = `rotate(${angle}deg) translateY(-226px)`;
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

  const views = {digital, analogue, flip, scenic};

  function show(styleName) {
    const name = Object.prototype.hasOwnProperty.call(views, styleName) ? styleName : 'digital';
    Object.entries(views).forEach(([key, view]) => {
      const active = key === name;
      view.hidden = !active;
      view.classList.toggle('clock-upgrade-visible', active);
      if (!active) view.style.display = 'none';
      else view.style.display = key === 'flip' ? 'flex' : 'grid';
    });
    document.querySelectorAll('[data-clock-style]').forEach(button => {
      button.classList.toggle('active', button.dataset.clockStyle === name);
    });
    try { localStorage.setItem('ttTimers.clockStyle', JSON.stringify(name)); } catch {}
  }

  document.querySelectorAll('[data-clock-style]').forEach(button => {
    button.addEventListener('click', () => requestAnimationFrame(() => show(button.dataset.clockStyle)));
  });

  ['flipHour','flipMinute','flipSecond'].forEach(id => {
    const unit = document.getElementById(id);
    if (!unit) return;
    let lastValue = unit.textContent;
    const observer = new MutationObserver(() => {
      const next = unit.textContent;
      if (next === lastValue) return;
      lastValue = next;
      unit.classList.remove('flip-changing');
      void unit.offsetWidth;
      unit.classList.add('flip-changing');
      clearTimeout(unit.__flipTimer);
      unit.__flipTimer = setTimeout(() => unit.classList.remove('flip-changing'), 360);
    });
    observer.observe(unit, {childList:true,subtree:true,characterData:true});
  });

  let stored = 'digital';
  try { stored = JSON.parse(localStorage.getItem('ttTimers.clockStyle') || '"digital"'); } catch {}
  requestAnimationFrame(() => show(stored));
})();

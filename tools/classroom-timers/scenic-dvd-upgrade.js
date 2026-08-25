(() => {
  'use strict';

  if (window.__scenicDvdUpgradeV1) return;
  window.__scenicDvdUpgradeV1 = true;

  const scenic = document.getElementById('scenicClock');
  if (!scenic) return;

  const scenicButton = document.querySelector('[data-clock-style="scenic"]');
  if (scenicButton) scenicButton.textContent = 'DVD Bounce';

  const style = document.createElement('style');
  style.id = 'scenicDvdUpgradeStyleV1';
  style.textContent = `
    #scenicClock.dvd-scene{
      position:relative!important;
      width:100%!important;
      height:100%!important;
      min-height:500px!important;
      overflow:hidden!important;
      isolation:isolate;
      background:#f4c7d9!important;
      transition:background-color 14s linear!important;
    }
    #scenicClock.dvd-scene.clock-upgrade-visible{
      display:block!important;
    }
    #scenicClock.dvd-scene > .scenic-orb,
    #scenicClock.dvd-scene > .scenic-horizon,
    #scenicClock.dvd-scene > #scenicTime,
    #scenicClock.dvd-scene > #scenicLabel{
      display:none!important;
    }
    .dvd-time-logo{
      position:absolute;
      left:0;
      top:0;
      display:flex;
      align-items:center;
      justify-content:center;
      min-width:clamp(250px,32vw,430px);
      height:clamp(105px,14vw,178px);
      padding:0 clamp(20px,3vw,40px);
      box-sizing:border-box;
      border-radius:clamp(18px,2vw,30px);
      background:rgba(255,255,255,.46);
      border:2px solid rgba(255,255,255,.72);
      box-shadow:0 14px 34px rgba(43,57,72,.18),inset 0 1px 0 rgba(255,255,255,.75);
      color:#17384d;
      font-family:var(--display, 'Fredoka', sans-serif);
      font-size:clamp(3.2rem,8vw,7.4rem);
      font-weight:800;
      line-height:1;
      letter-spacing:.015em;
      white-space:nowrap;
      user-select:none;
      pointer-events:none;
      will-change:transform;
      z-index:3;
      backdrop-filter:blur(5px);
      -webkit-backdrop-filter:blur(5px);
    }
    .dvd-time-logo.corner-perfect{
      animation:dvdCornerPerfect .72s cubic-bezier(.2,.8,.2,1);
    }
    @keyframes dvdCornerPerfect{
      0%{filter:brightness(1);box-shadow:0 14px 34px rgba(43,57,72,.18),inset 0 1px 0 rgba(255,255,255,.75)}
      28%{filter:brightness(1.22);box-shadow:0 0 0 8px rgba(255,255,255,.38),0 18px 42px rgba(43,57,72,.24)}
      100%{filter:brightness(1);box-shadow:0 14px 34px rgba(43,57,72,.18),inset 0 1px 0 rgba(255,255,255,.75)}
    }
    .dvd-corner-note{
      position:absolute;
      left:50%;
      bottom:20px;
      transform:translateX(-50%);
      padding:7px 12px;
      border-radius:999px;
      background:rgba(255,255,255,.34);
      color:rgba(23,56,77,.72);
      font-family:var(--body, 'Nunito', sans-serif);
      font-size:.78rem;
      font-weight:800;
      letter-spacing:.03em;
      opacity:.58;
      pointer-events:none;
      z-index:2;
    }
    html[data-theme="dark"] #scenicClock.dvd-scene{
      filter:saturate(.78) brightness(.78);
    }
    html[data-theme="dark"] .dvd-time-logo{
      background:rgba(15,30,43,.48);
      border-color:rgba(255,255,255,.28);
      color:#f7fbfd;
      box-shadow:0 16px 38px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.16);
    }
    html[data-theme="dark"] .dvd-corner-note{color:rgba(255,255,255,.72);background:rgba(15,30,43,.32)}
    @media(max-width:760px){
      #scenicClock.dvd-scene{min-height:390px!important}
      .dvd-time-logo{min-width:clamp(205px,56vw,300px);height:clamp(88px,25vw,125px);font-size:clamp(2.5rem,13vw,4.7rem)}
      .dvd-corner-note{bottom:12px;font-size:.7rem}
    }
    @media(prefers-reduced-motion:reduce){
      #scenicClock.dvd-scene{transition:none!important}
      .dvd-time-logo{will-change:auto}
    }
  `;
  document.head.appendChild(style);

  scenic.classList.add('dvd-scene');

  scenic.querySelector('.dvd-time-logo')?.remove();
  scenic.querySelector('.dvd-corner-note')?.remove();

  const logo = document.createElement('div');
  logo.className = 'dvd-time-logo';
  logo.textContent = '--:--:--';
  scenic.appendChild(logo);

  const note = document.createElement('div');
  note.className = 'dvd-corner-note';
  note.textContent = 'WAIT FOR THE CORNER…';
  scenic.appendChild(note);

  const state = {
    x: 48,
    y: 48,
    vx: 152,
    vy: 112,
    lastNow: 0,
    raf: 0,
    active: false,
    nextCornerAt: 0,
    chaseStartAt: 0,
    targetCorner: 0,
    cornerHoldUntil: 0,
    lastSecond: -1,
    colorTimer: 0
  };

  const pad = n => String(n).padStart(2, '0');
  const randomPastel = () => {
    const hue = Math.floor(Math.random() * 360);
    const sat = 58 + Math.floor(Math.random() * 20);
    const light = 80 + Math.floor(Math.random() * 9);
    return `hsl(${hue} ${sat}% ${light}%)`;
  };

  function updateTime() {
    const now = new Date();
    const sec = now.getSeconds();
    if (sec === state.lastSecond) return;
    state.lastSecond = sec;
    const hour = now.getHours() % 12 || 12;
    logo.textContent = `${pad(hour)}:${pad(now.getMinutes())}:${pad(sec)}`;
  }

  function choosePastel() {
    scenic.style.backgroundColor = randomPastel();
  }

  function scheduleCorner(now) {
    const delay = (360 + Math.random() * 120) * 1000; // 6–8 minutes
    state.nextCornerAt = now + delay;
    state.chaseStartAt = state.nextCornerAt - 7000;
    state.targetCorner = Math.floor(Math.random() * 4);
  }

  function bounds() {
    const width = scenic.clientWidth;
    const height = scenic.clientHeight;
    const logoWidth = logo.offsetWidth;
    const logoHeight = logo.offsetHeight;
    return {
      maxX: Math.max(0, width - logoWidth),
      maxY: Math.max(0, height - logoHeight)
    };
  }

  function cornerPosition(corner, b) {
    return {
      x: corner === 1 || corner === 3 ? b.maxX : 0,
      y: corner >= 2 ? b.maxY : 0
    };
  }

  function leaveCorner(corner) {
    const sx = corner === 1 || corner === 3 ? -1 : 1;
    const sy = corner >= 2 ? -1 : 1;
    state.vx = sx * (145 + Math.random() * 28);
    state.vy = sy * (102 + Math.random() * 26);
  }

  function hitPerfectCorner(now, b) {
    const target = cornerPosition(state.targetCorner, b);
    state.x = target.x;
    state.y = target.y;
    state.cornerHoldUntil = now + 260;
    leaveCorner(state.targetCorner);
    logo.classList.remove('corner-perfect');
    void logo.offsetWidth;
    logo.classList.add('corner-perfect');
    setTimeout(() => logo.classList.remove('corner-perfect'), 760);
    choosePastel();
    scheduleCorner(now);
  }

  function isVisible() {
    return !scenic.hidden && (scenic.classList.contains('clock-upgrade-visible') || getComputedStyle(scenic).display !== 'none');
  }

  function render(now) {
    state.raf = requestAnimationFrame(render);
    if (!state.active || !isVisible()) {
      state.lastNow = now;
      return;
    }

    updateTime();
    const b = bounds();
    state.x = Math.min(state.x, b.maxX);
    state.y = Math.min(state.y, b.maxY);

    if (!state.lastNow) state.lastNow = now;
    const dt = Math.min(.035, Math.max(0, (now - state.lastNow) / 1000));
    state.lastNow = now;

    if (now < state.cornerHoldUntil) {
      logo.style.transform = `translate3d(${state.x}px,${state.y}px,0)`;
      return;
    }

    if (!state.nextCornerAt) scheduleCorner(now);

    if (now >= state.nextCornerAt) {
      hitPerfectCorner(now, b);
    } else if (now >= state.chaseStartAt) {
      // For the final few seconds, use a straight diagonal intercept so the time lands exactly on the chosen corner.
      const target = cornerPosition(state.targetCorner, b);
      const remaining = Math.max(.018, (state.nextCornerAt - now) / 1000);
      state.vx = (target.x - state.x) / remaining;
      state.vy = (target.y - state.y) / remaining;
      state.x += state.vx * dt;
      state.y += state.vy * dt;
    } else {
      state.x += state.vx * dt;
      state.y += state.vy * dt;

      if (state.x <= 0) {
        state.x = 0;
        state.vx = Math.abs(state.vx);
      } else if (state.x >= b.maxX) {
        state.x = b.maxX;
        state.vx = -Math.abs(state.vx);
      }

      if (state.y <= 0) {
        state.y = 0;
        state.vy = Math.abs(state.vy);
      } else if (state.y >= b.maxY) {
        state.y = b.maxY;
        state.vy = -Math.abs(state.vy);
      }
    }

    logo.style.transform = `translate3d(${state.x}px,${state.y}px,0)`;
  }

  function start() {
    if (state.active) return;
    state.active = true;
    state.lastNow = performance.now();
    updateTime();
    choosePastel();
    if (!state.nextCornerAt) scheduleCorner(state.lastNow);
    if (!state.colorTimer) state.colorTimer = window.setInterval(choosePastel, 16000);
    if (!state.raf) state.raf = requestAnimationFrame(render);
  }

  function stop() {
    state.active = false;
    state.lastNow = performance.now();
  }

  const visibilityObserver = new MutationObserver(() => {
    if (isVisible()) start();
    else stop();
  });
  visibilityObserver.observe(scenic, {attributes:true, attributeFilter:['class','hidden','style']});

  scenicButton?.addEventListener('click', () => requestAnimationFrame(start));
  window.addEventListener('resize', () => {
    const b = bounds();
    state.x = Math.min(Math.max(0, state.x), b.maxX);
    state.y = Math.min(Math.max(0, state.y), b.maxY);
  });

  choosePastel();
  updateTime();
  if (isVisible()) start();
})();

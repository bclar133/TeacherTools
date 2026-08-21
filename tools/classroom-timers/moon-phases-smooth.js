(() => {
  'use strict';

  if (document.getElementById('moonPhasesSmoothStyleV1')) return;

  const sceneLayer = document.getElementById('sceneLayer');
  const stageStatus = document.getElementById('stageStatus');
  const display = document.getElementById('countdownDisplay');
  const minutesInput = document.getElementById('countdownMinutes');
  const secondsInput = document.getElementById('countdownSeconds');
  if (!sceneLayer || !display) return;

  const style = document.createElement('style');
  style.id = 'moonPhasesSmoothStyleV1';
  style.textContent = `
    .xt-moon .xt-moon-orbit,
    .xt-moon .xt-moon-glyph,
    .xt-moon .xt-moon-label {
      display:none !important;
    }

    .xt-moon.moon-smooth-upgraded {
      background:
        radial-gradient(circle at 73% 43%, rgba(67,91,143,.30), transparent 27%),
        radial-gradient(circle at 46% 18%, #1d3158 0, #101c35 43%, #070d1d 78%, #040813 100%) !important;
    }

    .smooth-moon-stars {
      position:absolute;
      inset:0;
      pointer-events:none;
      z-index:1;
    }

    .smooth-moon-star {
      position:absolute;
      width:var(--star-size);
      height:var(--star-size);
      border-radius:50%;
      background:rgba(244,248,255,.96);
      opacity:var(--star-opacity);
      box-shadow:0 0 5px rgba(205,224,255,.65);
    }

    .smooth-moon-wrap {
      position:absolute;
      right:8%;
      top:48%;
      width:min(48vw,430px);
      aspect-ratio:1;
      transform:translateY(-50%);
      z-index:4;
      filter:drop-shadow(0 0 var(--moon-glow,18px) rgba(211,226,255,.52));
    }

    .smooth-moon-svg {
      display:block;
      width:100%;
      height:100%;
      overflow:visible;
    }

    .smooth-moon-phase-label {
      position:absolute;
      left:50%;
      top:calc(100% + 14px);
      transform:translateX(-50%);
      min-width:260px;
      text-align:center;
      color:#f3f6ff;
      font-family:var(--display);
      font-size:clamp(1.25rem,2.8vw,2rem);
      letter-spacing:.035em;
      text-shadow:0 3px 12px rgba(0,0,0,.55);
      white-space:nowrap;
    }

    .smooth-moon-phase-dots {
      display:flex;
      justify-content:center;
      gap:7px;
      margin-top:9px;
    }

    .smooth-moon-phase-dots i {
      width:6px;
      height:6px;
      border-radius:50%;
      background:rgba(220,230,249,.28);
      box-shadow:none;
    }

    .smooth-moon-phase-dots i.active {
      background:#f3f6ff;
      box-shadow:0 0 7px rgba(236,242,255,.65);
    }

    @media(max-width:760px){
      .smooth-moon-wrap {
        right:2%;
        top:53%;
        width:min(54vw,330px);
      }
      .smooth-moon-phase-label {
        min-width:190px;
        font-size:clamp(1rem,4.2vw,1.45rem);
      }
    }
  `;
  document.head.appendChild(style);

  const PHASES = [
    {name:'Waxing Crescent', light:.12, side:'right'},
    {name:'First Quarter', light:.50, side:'right'},
    {name:'Waxing Gibbous', light:.78, side:'right'},
    {name:'Full Moon', light:1.00, side:'right'},
    {name:'Waning Gibbous', light:.78, side:'left'},
    {name:'Third Quarter', light:.50, side:'left'},
    {name:'Waning Crescent', light:.12, side:'left'},
    {name:'New Moon', light:.015, side:'left'}
  ];

  const clamp = (v,min,max) => Math.max(min,Math.min(max,v));
  const lerp = (a,b,t) => a + (b-a)*t;
  const smooth = t => t*t*(3-2*t);

  let displayedRemaining = null;
  let displayChangedAt = performance.now();
  let lastStatus = '';
  let lastScene = null;
  let raf = 0;

  function parseRemaining(){
    const parts = display.textContent.trim().split(':').map(Number);
    if(parts.some(v => !Number.isFinite(v))) return null;
    if(parts.length === 2) return parts[0]*60 + parts[1];
    if(parts.length === 3) return parts[0]*3600 + parts[1]*60 + parts[2];
    return null;
  }

  function totalSeconds(){
    return Math.max(1,(Number(minutesInput?.value)||0)*60 + (Number(secondsInput?.value)||0));
  }

  function progressNow(now){
    const current = parseRemaining();
    if(current === null) return 0;
    const status = stageStatus?.textContent.trim() || '';
    const running = status === 'Running';
    if(displayedRemaining === null || current !== displayedRemaining || status !== lastStatus){
      displayedRemaining = current;
      displayChangedAt = now;
      lastStatus = status;
    }
    let estimated = current;
    if(running && current > 0) estimated = Math.max(0,current - (now-displayChangedAt)/1000);
    return clamp(1-estimated/totalSeconds(),0,1);
  }

  function seededStars(){
    let seed = 18473;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    return Array.from({length:104},() => {
      const x = (1 + rand()*98).toFixed(2);
      const y = (2 + rand()*94).toFixed(2);
      const size = (0.9 + rand()*2.3).toFixed(1);
      const opacity = (0.28 + rand()*.70).toFixed(2);
      return `<i class="smooth-moon-star" style="left:${x}%;top:${y}%;--star-size:${size}px;--star-opacity:${opacity}"></i>`;
    }).join('');
  }

  function moonMarkup(){
    const dots = PHASES.map((_,i)=>`<i data-phase-dot="${i}"></i>`).join('');
    return `
      <div class="smooth-moon-stars">${seededStars()}</div>
      <div class="smooth-moon-wrap">
        <svg class="smooth-moon-svg" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
          <defs>
            <clipPath id="smoothMoonDiskClip">
              <circle cx="200" cy="200" r="154"></circle>
            </clipPath>
            <clipPath id="smoothMoonLightClip">
              <rect class="smooth-moon-light-rect" x="200" y="46" width="0" height="308"></rect>
            </clipPath>
            <radialGradient id="smoothMoonDarkGradient" cx="34%" cy="28%" r="78%">
              <stop offset="0" stop-color="#243551"></stop>
              <stop offset=".68" stop-color="#14233a"></stop>
              <stop offset="1" stop-color="#0a1427"></stop>
            </radialGradient>
            <radialGradient id="smoothMoonLitGradient" cx="38%" cy="30%" r="78%">
              <stop offset="0" stop-color="#fafafa"></stop>
              <stop offset=".55" stop-color="#d9d9d6"></stop>
              <stop offset="1" stop-color="#aaaeb0"></stop>
            </radialGradient>
          </defs>

          <g clip-path="url(#smoothMoonDiskClip)">
            <circle cx="200" cy="200" r="154" fill="url(#smoothMoonDarkGradient)"></circle>

            <g opacity=".34">
              <circle cx="132" cy="155" r="40" fill="#071122"></circle>
              <circle cx="245" cy="125" r="26" fill="#30415c"></circle>
              <circle cx="226" cy="246" r="31" fill="#0a1528"></circle>
              <circle cx="300" cy="277" r="38" fill="#34425a"></circle>
              <circle cx="108" cy="292" r="34" fill="#050b18"></circle>
              <circle cx="184" cy="92" r="18" fill="#34445e"></circle>
            </g>

            <g clip-path="url(#smoothMoonLightClip)">
              <circle cx="200" cy="200" r="154" fill="url(#smoothMoonLitGradient)"></circle>
              <g opacity=".28">
                <circle cx="132" cy="155" r="40" fill="#85888b"></circle>
                <circle cx="245" cy="125" r="26" fill="#f2f1e9"></circle>
                <circle cx="226" cy="246" r="31" fill="#96999b"></circle>
                <circle cx="300" cy="277" r="38" fill="#c2b790"></circle>
                <circle cx="108" cy="292" r="34" fill="#777b80"></circle>
                <circle cx="184" cy="92" r="18" fill="#efeee8"></circle>
              </g>
              <g fill="none" stroke="rgba(255,255,255,.22)" stroke-width="2">
                <circle cx="132" cy="155" r="40"></circle>
                <circle cx="245" cy="125" r="26"></circle>
                <circle cx="226" cy="246" r="31"></circle>
                <circle cx="300" cy="277" r="38"></circle>
              </g>
            </g>
          </g>
        </svg>
        <div class="smooth-moon-phase-label">
          <span class="smooth-moon-phase-name">Waxing Crescent</span>
          <span class="smooth-moon-phase-dots">${dots}</span>
        </div>
      </div>
    `;
  }

  function upgrade(scene){
    if(!scene || scene.dataset.smoothMoon === '1') return;
    scene.innerHTML = moonMarkup();
    scene.dataset.smoothMoon = '1';
    scene.classList.add('moon-smooth-upgraded');
  }

  function render(scene,p){
    const phasePos = clamp(p,0,1) * (PHASES.length-1);
    const fromIndex = Math.floor(phasePos);
    const toIndex = Math.min(PHASES.length-1,fromIndex+1);
    const local = smooth(phasePos-fromIndex);
    const from = PHASES[fromIndex];
    const to = PHASES[toIndex];
    const light = lerp(from.light,to.light,local);

    // At full moon the illumination is 100%, so swapping from right-anchored
    // waxing to left-anchored waning is invisible and keeps the motion continuous.
    const side = phasePos <= 3 ? 'right' : 'left';
    const diameter = 308;
    const width = clamp(diameter*light,0,diameter);
    const x = side === 'right' ? 354-width : 46;

    const rect = scene.querySelector('.smooth-moon-light-rect');
    if(rect){
      rect.setAttribute('x',x.toFixed(2));
      rect.setAttribute('width',width.toFixed(2));
    }

    const nearest = Math.min(PHASES.length-1,Math.round(phasePos));
    const label = scene.querySelector('.smooth-moon-phase-name');
    if(label) label.textContent = PHASES[nearest].name;
    scene.querySelectorAll('[data-phase-dot]').forEach((dot,i)=>dot.classList.toggle('active',i===nearest));

    const wrap = scene.querySelector('.smooth-moon-wrap');
    if(wrap) wrap.style.setProperty('--moon-glow',`${10 + light*28}px`);
  }

  function loop(now){
    const scene = sceneLayer.querySelector('.xt-moon[data-xt-theme="moon"]');
    if(scene !== lastScene){
      lastScene = scene || null;
      displayedRemaining = null;
    }

    if(scene){
      upgrade(scene);
      render(scene,progressNow(now));
    }

    raf = requestAnimationFrame(loop);
  }

  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(loop);
})();

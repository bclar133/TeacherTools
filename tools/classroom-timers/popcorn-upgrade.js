(() => {
  'use strict';

  if (document.getElementById('popcornCinemaUpgradeStyle')) return;

  const sceneLayer = document.getElementById('sceneLayer');
  const stage = document.getElementById('countdownStage');
  const stageStatus = document.getElementById('stageStatus');
  const muteBtn = document.getElementById('muteBtn');
  if (!sceneLayer || !stage) return;

  const style = document.createElement('style');
  style.id = 'popcornCinemaUpgradeStyle';
  style.textContent = `
    .popcorn-scene{position:absolute;inset:0;overflow:hidden;background:linear-gradient(180deg,#2d1722 0 58%,#171016 58% 100%)!important}
    .popcorn-cinema{position:absolute;inset:0;z-index:0;pointer-events:none;background:radial-gradient(circle at 50% 20%,rgba(255,221,145,.16),transparent 30%),linear-gradient(180deg,rgba(13,9,13,.12),rgba(13,9,13,.48))}
    .cinema-screen{position:absolute;left:17%;right:17%;top:8%;height:41%;border:10px solid #4b343b;border-radius:7px;background:linear-gradient(135deg,#dfd6c6,#aaa4a0);box-shadow:0 12px 32px rgba(0,0,0,.35),inset 0 0 45px rgba(0,0,0,.18);opacity:.42}
    .cinema-curtain{position:absolute;top:0;bottom:0;width:11%;background:repeating-linear-gradient(90deg,#591425 0 17px,#7a1c31 17px 34px,#49101f 34px 51px);box-shadow:inset -10px 0 18px rgba(0,0,0,.3)}
    .cinema-curtain.left{left:0}.cinema-curtain.right{right:0;transform:scaleX(-1)}
    .cinema-seats{position:absolute;left:7%;right:7%;bottom:-2%;height:22%;opacity:.8;background:radial-gradient(circle at 4% 28%,#8e263b 0 24px,transparent 25px),radial-gradient(circle at 14% 28%,#8e263b 0 24px,transparent 25px),radial-gradient(circle at 24% 28%,#8e263b 0 24px,transparent 25px),radial-gradient(circle at 34% 28%,#8e263b 0 24px,transparent 25px),radial-gradient(circle at 44% 28%,#8e263b 0 24px,transparent 25px),radial-gradient(circle at 54% 28%,#8e263b 0 24px,transparent 25px),radial-gradient(circle at 64% 28%,#8e263b 0 24px,transparent 25px),radial-gradient(circle at 74% 28%,#8e263b 0 24px,transparent 25px),radial-gradient(circle at 84% 28%,#8e263b 0 24px,transparent 25px),radial-gradient(circle at 94% 28%,#8e263b 0 24px,transparent 25px),linear-gradient(180deg,transparent 0 42%,#561220 42% 100%)}

    .popcorn-machine{position:absolute;left:20%;bottom:7%;width:45%;height:76%;z-index:3;filter:drop-shadow(0 18px 26px rgba(0,0,0,.38))}
    .popcorn-marquee{position:absolute;left:7%;right:7%;top:0;height:15%;display:grid;place-items:center;border-radius:18px 18px 9px 9px;background:linear-gradient(#ef4e46,#b91f2c 58%,#7c101b);border:4px solid #8e1620;box-shadow:inset 0 3px 6px rgba(255,255,255,.22)}
    .popcorn-marquee span{padding:8px 20px;border:5px solid #f4cf65;border-radius:999px;background:#fff1bf;color:#a4131d;font-family:var(--heading);font-size:clamp(1.3rem,2.7vw,2.25rem);letter-spacing:.11em;text-shadow:0 1px #fff;box-shadow:0 0 12px rgba(255,218,105,.65),inset 0 0 0 2px rgba(255,255,255,.55)}
    .popcorn-frame{position:absolute;left:12%;right:12%;top:12%;bottom:0;border-radius:13px 13px 19px 19px;background:linear-gradient(180deg,#d53a39 0 9%,#53151d 9% 13%,#c72c35 13% 18%,#3b2025 18% 86%,#ad1d28 86% 100%);box-shadow:inset 0 0 0 4px rgba(107,11,24,.34)}
    .popcorn-glass{position:absolute;left:7%;right:7%;top:18%;bottom:14%;overflow:hidden;border:4px solid rgba(229,242,252,.58);border-radius:9px 9px 13px 13px;background:linear-gradient(90deg,rgba(255,255,255,.22) 0 6%,rgba(255,255,255,.05) 7% 20%,rgba(255,255,255,.01) 22% 78%,rgba(255,255,255,.18) 80% 86%,rgba(255,255,255,.05) 87%),linear-gradient(180deg,rgba(226,241,250,.13),rgba(205,224,235,.05));box-shadow:inset 0 0 0 1px rgba(255,255,255,.18)}
    .popcorn-kettle{position:absolute;left:50%;top:7%;width:38%;height:15%;transform:translateX(-50%);z-index:2;border-radius:5px 5px 22px 22px;background:linear-gradient(#777b82,#282b31);box-shadow:0 5px 7px rgba(0,0,0,.28),inset 0 3px 5px rgba(255,255,255,.16)}
    .popcorn-kettle:before,.popcorn-kettle:after{content:'';position:absolute;top:10%;width:7px;height:62%;background:#727981}.popcorn-kettle:before{left:-18px}.popcorn-kettle:after{right:-18px}
    .raw-kernel-bed{position:absolute;left:5%;right:5%;bottom:2%;height:17%;z-index:1;border-radius:15px 15px 7px 7px;background:linear-gradient(180deg,rgba(217,166,50,.22),rgba(170,118,26,.28));overflow:hidden}
    .raw-kernel{position:absolute;width:13px;height:9px;border-radius:60% 40% 55% 45%;background:linear-gradient(#f1cd58,#c99225);box-shadow:inset -2px -2px 0 rgba(133,89,15,.35);transition:opacity .15s linear}

    .popcorn-scene .popcorn-fill{position:absolute!important;left:5%!important;right:5%!important;top:18%!important;bottom:9%!important;width:auto!important;height:auto!important;transform:none!important;overflow:visible!important;z-index:3!important}
    .popcorn-scene .kernel{position:absolute!important;width:42px!important;height:37px!important;border-radius:55% 45% 52% 48%!important;background:radial-gradient(circle at 30% 28%,#fffef7 0 17%,#fff3c9 18% 53%,#ead18f 54% 76%,#d9bb74 77%)!important;box-shadow:inset -4px -4px 0 rgba(211,187,119,.48),0 3px 6px rgba(0,0,0,.18)!important;opacity:1!important;transform-origin:center!important;will-change:transform,translate}
    .popcorn-scene .kernel:before,.popcorn-scene .kernel:after{content:'';position:absolute;border-radius:50%;background:radial-gradient(circle,#fffefa 0 39%,#f5e8bc 40% 100%)}
    .popcorn-scene .kernel:before{width:18px;height:17px;left:-3px;top:5px;transform:rotate(-25deg)}
    .popcorn-scene .kernel:after{width:17px;height:15px;right:-2px;top:4px;transform:rotate(24deg)}
    .popcorn-scene .kernel.just-popped{animation:cinemaPop .42s cubic-bezier(.2,.75,.35,1)}
    @keyframes cinemaPop{0%{translate:0 0}45%{translate:0 -27px}72%{translate:0 -8px}100%{translate:0 0}}

    .machine-lower{position:absolute;left:0;right:0;bottom:0;height:14%;background:linear-gradient(#d63d3b,#8c1420);box-shadow:inset 0 5px 8px rgba(255,255,255,.13)}
    .machine-lower:before,.machine-lower:after{content:'';position:absolute;bottom:-12px;width:25px;height:25px;border-radius:50%;background:radial-gradient(circle,#6e7680 0 31%,#252a30 33% 100%)}
    .machine-lower:before{left:16%}.machine-lower:after{right:16%}

    #countdownStage.theme-popcorn .time-display-wrap{position:absolute!important;right:4%!important;left:auto!important;top:50%!important;bottom:auto!important;transform:translateY(-50%)!important;width:min(29%,300px)!important;z-index:10!important;justify-items:end!important;text-align:right!important}
    #countdownStage.theme-popcorn #countdownDisplay,#countdownStage.theme-popcorn #countdownMessage{text-align:right!important}

    @media(max-width:820px){.popcorn-machine{left:12%;width:60%;height:70%;bottom:6%}.popcorn-marquee span{font-size:clamp(1rem,4vw,1.6rem)}#countdownStage.theme-popcorn .time-display-wrap{right:3%!important;top:14%!important;transform:none!important;width:min(43%,210px)!important}.cinema-curtain{width:8%}}
  `;
  document.head.appendChild(style);

  let audioCtx = null;
  let currentScene = null;
  let lastPoppedCount = 0;
  let firstSample = true;

  function isMuted() {
    try {
      const v = localStorage.getItem('ttTimers.muted');
      if (v !== null) return JSON.parse(v) === true;
    } catch {}
    return muteBtn?.getAttribute('aria-pressed') === 'true';
  }

  function ensureAudio() {
    if (audioCtx) return audioCtx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
    return audioCtx;
  }

  function popSound(delay = 0) {
    if (isMuted()) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(820 + Math.random() * 170, t);
    osc.frequency.exponentialRampToValueAtTime(300 + Math.random() * 90, t + .075);
    gain.gain.setValueAtTime(.0001, t);
    gain.gain.exponentialRampToValueAtTime(.025, t + .008);
    gain.gain.exponentialRampToValueAtTime(.0001, t + .1);
    filter.type = 'lowpass';
    filter.frequency.value = 1700;
    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + .11);
  }

  function buildMachine(scene) {
    if (!scene || scene.dataset.cinemaPopcorn === '1') return;
    scene.dataset.cinemaPopcorn = '1';
    scene.innerHTML = `
      <div class="popcorn-cinema">
        <div class="cinema-screen"></div>
        <div class="cinema-curtain left"></div><div class="cinema-curtain right"></div>
        <div class="cinema-seats"></div>
      </div>
      <div class="popcorn-machine">
        <div class="popcorn-marquee"><span>POPCORN</span></div>
        <div class="popcorn-frame">
          <div class="popcorn-glass">
            <div class="popcorn-kettle"></div>
            <div class="raw-kernel-bed"></div>
            <div class="popcorn-fill"></div>
          </div>
          <div class="machine-lower"></div>
        </div>
      </div>`;

    const bed = scene.querySelector('.raw-kernel-bed');
    for (let i = 0; i < 54; i++) {
      const raw = document.createElement('i');
      raw.className = 'raw-kernel';
      raw.style.left = `${2 + Math.random() * 94}%`;
      raw.style.bottom = `${2 + Math.random() * 72}%`;
      raw.style.rotate = `${-40 + Math.random() * 80}deg`;
      raw.dataset.index = String(i);
      bed.appendChild(raw);
    }

    const fill = scene.querySelector('.popcorn-fill');
    const cols = 6;
    for (let i = 0; i < 44; i++) {
      const k = document.createElement('i');
      k.className = 'kernel';
      const col = i % cols;
      const row = Math.floor(i / cols);
      const left = 3 + col * 18.5 + (row % 2 ? 3 : 0) + (Math.random() * 4 - 2);
      const bottom = 2 + row * 11 + (Math.random() * 2.5);
      const rot = -34 + Math.random() * 68;
      k.style.left = `${Math.min(94, left)}%`;
      k.style.bottom = `${bottom}%`;
      k.style.transform = `rotate(${rot.toFixed(1)}deg) scale(0)`;
      fill.appendChild(k);
    }

    currentScene = scene;
    lastPoppedCount = 0;
    firstSample = true;
  }

  function scaleOf(kernel) {
    const match = kernel.style.transform.match(/scale\(([^)]+)\)/);
    return match ? Number(match[1]) || 0 : 0;
  }

  function samplePopcorn(scene) {
    const kernels = [...scene.querySelectorAll('.kernel')];
    if (!kernels.length) return;
    const popped = kernels.filter(k => scaleOf(k) >= .985);
    const poppedCount = popped.length;

    kernels.forEach(k => {
      const done = scaleOf(k) >= .985;
      k.classList.toggle('popped', done);
    });

    const raw = [...scene.querySelectorAll('.raw-kernel')];
    const rawVisible = Math.max(0, Math.round(raw.length * (1 - poppedCount / kernels.length)));
    raw.forEach((k, i) => { k.style.opacity = i < rawVisible ? '1' : '0'; });

    if (firstSample) {
      lastPoppedCount = poppedCount;
      firstSample = false;
      return;
    }

    if (poppedCount > lastPoppedCount) {
      const newly = popped.slice(lastPoppedCount, poppedCount);
      newly.forEach((k, i) => {
        k.classList.remove('just-popped');
        void k.offsetWidth;
        k.classList.add('just-popped');
        k.addEventListener('animationend', () => k.classList.remove('just-popped'), { once: true });
        if (stageStatus?.textContent.trim() === 'Running' && i < 3) popSound(i * .045);
      });
    }

    lastPoppedCount = poppedCount;
  }

  function loop() {
    const scene = sceneLayer.querySelector('.popcorn-scene');
    if (scene) {
      if (scene !== currentScene || scene.dataset.cinemaPopcorn !== '1') buildMachine(scene);
      samplePopcorn(scene);
    } else {
      currentScene = null;
      firstSample = true;
      lastPoppedCount = 0;
    }
    requestAnimationFrame(loop);
  }

  const sceneObserver = new MutationObserver(() => {
    const scene = sceneLayer.querySelector('.popcorn-scene');
    if (scene && scene.dataset.cinemaPopcorn !== '1') buildMachine(scene);
  });
  sceneObserver.observe(sceneLayer, { childList: true, subtree: true });

  document.addEventListener('pointerdown', () => {
    const ctx = ensureAudio();
    if (ctx?.state === 'suspended') ctx.resume().catch(() => {});
  }, { capture: true, passive: true });

  const initial = sceneLayer.querySelector('.popcorn-scene');
  if (initial) buildMachine(initial);
  requestAnimationFrame(loop);
})();

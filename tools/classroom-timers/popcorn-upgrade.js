(() => {
  'use strict';

  if (document.getElementById('popcornCinemaUpgradeStyleV2')) return;

  const sceneLayer = document.getElementById('sceneLayer');
  const stage = document.getElementById('countdownStage');
  const stageStatus = document.getElementById('stageStatus');
  const muteBtn = document.getElementById('muteBtn');
  const presentationMuteBtn = document.getElementById('presentationMuteBtn');
  if (!sceneLayer || !stage) return;

  const style = document.createElement('style');
  style.id = 'popcornCinemaUpgradeStyleV2';
  style.textContent = `
    .popcorn-scene{
      position:absolute;inset:0;overflow:hidden;
      background:radial-gradient(circle at 50% 18%,rgba(255,220,145,.14),transparent 30%),linear-gradient(180deg,#2d1722 0 58%,#171016 58% 100%)!important
    }
    .popcorn-cinema{position:absolute;inset:0;z-index:0;pointer-events:none;background:radial-gradient(circle at 50% 20%,rgba(255,221,145,.14),transparent 30%),linear-gradient(180deg,rgba(13,9,13,.12),rgba(13,9,13,.48))}
    .cinema-screen{position:absolute;left:17%;right:17%;top:8%;height:41%;border:10px solid #4b343b;border-radius:7px;background:linear-gradient(135deg,#dfd6c6,#aaa4a0);box-shadow:0 12px 32px rgba(0,0,0,.35),inset 0 0 45px rgba(0,0,0,.18);opacity:.42}
    .cinema-curtain{position:absolute;top:0;bottom:0;width:11%;background:repeating-linear-gradient(90deg,#591425 0 17px,#7a1c31 17px 34px,#49101f 34px 51px);box-shadow:inset -10px 0 18px rgba(0,0,0,.3)}
    .cinema-curtain.left{left:0}.cinema-curtain.right{right:0;transform:scaleX(-1)}
    .cinema-seats{position:absolute;left:7%;right:7%;bottom:-2%;height:22%;opacity:.8;background:radial-gradient(circle at 4% 28%,#8e263b 0 24px,transparent 25px),radial-gradient(circle at 14% 28%,#8e263b 0 24px,transparent 25px),radial-gradient(circle at 24% 28%,#8e263b 0 24px,transparent 25px),radial-gradient(circle at 34% 28%,#8e263b 0 24px,transparent 25px),radial-gradient(circle at 44% 28%,#8e263b 0 24px,transparent 25px),radial-gradient(circle at 54% 28%,#8e263b 0 24px,transparent 25px),radial-gradient(circle at 64% 28%,#8e263b 0 24px,transparent 25px),radial-gradient(circle at 74% 28%,#8e263b 0 24px,transparent 25px),radial-gradient(circle at 84% 28%,#8e263b 0 24px,transparent 25px),radial-gradient(circle at 94% 28%,#8e263b 0 24px,transparent 25px),linear-gradient(180deg,transparent 0 42%,#561220 42% 100%)}

    .popcorn-machine{position:absolute;left:14%;bottom:7%;width:46%;height:76%;z-index:3;filter:drop-shadow(0 18px 26px rgba(0,0,0,.38))}
    .popcorn-marquee{position:absolute;left:7%;right:7%;top:0;height:15%;display:flex;align-items:center;justify-content:center;border-radius:18px 18px 9px 9px;background:linear-gradient(#ef4e46,#b91f2c 58%,#7c101b);border:4px solid #8e1620;box-shadow:inset 0 3px 6px rgba(255,255,255,.22);box-sizing:border-box}
    .popcorn-marquee span{height:62%;min-height:46px;display:flex;align-items:center;justify-content:center;box-sizing:border-box;padding:.13em 22px 0;border:5px solid #f4cf65;border-radius:999px;background:#fff1bf;color:#a4131d;font-family:var(--heading);font-size:clamp(1.25rem,2.5vw,2.15rem);line-height:1;letter-spacing:.11em;text-transform:uppercase;text-shadow:0 1px #fff;box-shadow:0 0 12px rgba(255,218,105,.65),inset 0 0 0 2px rgba(255,255,255,.55)}
    .popcorn-frame{position:absolute;left:12%;right:12%;top:12%;bottom:0;border-radius:13px 13px 19px 19px;background:linear-gradient(180deg,#d53a39 0 9%,#53151d 9% 13%,#c72c35 13% 18%,#3b2025 18% 86%,#ad1d28 86% 100%);box-shadow:inset 0 0 0 4px rgba(107,11,24,.34)}
    .popcorn-glass{position:absolute;left:7%;right:7%;top:18%;bottom:14%;overflow:hidden;border:4px solid rgba(229,242,252,.58);border-radius:9px 9px 13px 13px;background:linear-gradient(90deg,rgba(255,255,255,.22) 0 6%,rgba(255,255,255,.05) 7% 20%,rgba(255,255,255,.01) 22% 78%,rgba(255,255,255,.18) 80% 86%,rgba(255,255,255,.05) 87%),linear-gradient(180deg,rgba(226,241,250,.13),rgba(205,224,235,.05));box-shadow:inset 0 0 0 1px rgba(255,255,255,.18)}
    .popcorn-kettle{position:absolute;left:50%;top:7%;width:38%;height:15%;transform:translateX(-50%);z-index:2;border-radius:5px 5px 22px 22px;background:linear-gradient(#777b82,#282b31);box-shadow:0 5px 7px rgba(0,0,0,.28),inset 0 3px 5px rgba(255,255,255,.16)}
    .popcorn-kettle:before,.popcorn-kettle:after{content:'';position:absolute;top:10%;width:7px;height:62%;background:#727981}.popcorn-kettle:before{left:-18px}.popcorn-kettle:after{right:-18px}
    .raw-kernel-bed{position:absolute;left:5%;right:5%;bottom:2%;height:17%;z-index:1;border-radius:15px 15px 7px 7px;background:linear-gradient(180deg,rgba(217,166,50,.22),rgba(170,118,26,.28));overflow:hidden}
    .raw-kernel{position:absolute;width:13px;height:9px;border-radius:60% 40% 55% 45%;background:linear-gradient(#f1cd58,#c99225);box-shadow:inset -2px -2px 0 rgba(133,89,15,.35);transition:opacity .15s linear}

    .popcorn-scene .popcorn-fill{position:absolute!important;left:5%!important;right:5%!important;top:18%!important;bottom:9%!important;width:auto!important;height:auto!important;transform:none!important;overflow:visible!important;z-index:3!important}
    .popcorn-scene .kernel{position:absolute!important;width:calc(40px * var(--piece-size,1))!important;height:calc(35px * var(--piece-size,1))!important;border-radius:55% 45% 52% 48%!important;background:radial-gradient(circle at 30% 28%,var(--p1,#fffef7) 0 17%,var(--p2,#fff3c9) 18% 53%,var(--p3,#ead18f) 54% 76%,var(--p4,#d9bb74) 77%)!important;box-shadow:inset calc(-4px * var(--piece-size,1)) calc(-4px * var(--piece-size,1)) 0 rgba(211,187,119,.43),0 3px 6px rgba(0,0,0,var(--shadow-alpha,.16))!important;opacity:var(--piece-opacity,1)!important;transform-origin:center!important;will-change:transform,translate;z-index:var(--piece-z,10)}
    .popcorn-scene .kernel:before,.popcorn-scene .kernel:after{content:'';position:absolute;border-radius:50%;background:radial-gradient(circle,var(--p1,#fffefa) 0 39%,var(--p2,#f5e8bc) 40% 100%)}
    .popcorn-scene .kernel:before{width:calc(18px * var(--piece-size,1));height:calc(17px * var(--piece-size,1));left:calc(-3px * var(--piece-size,1));top:calc(5px * var(--piece-size,1));transform:rotate(-25deg)}
    .popcorn-scene .kernel:after{width:calc(17px * var(--piece-size,1));height:calc(15px * var(--piece-size,1));right:calc(-2px * var(--piece-size,1));top:calc(4px * var(--piece-size,1));transform:rotate(24deg)}
    .popcorn-scene .kernel.just-popped{animation:cinemaPop .42s cubic-bezier(.2,.75,.35,1)}
    @keyframes cinemaPop{0%{translate:0 0}45%{translate:0 -27px}72%{translate:0 -8px}100%{translate:0 0}}

    .machine-lower{position:absolute;left:0;right:0;bottom:0;height:14%;background:linear-gradient(#d63d3b,#8c1420);box-shadow:inset 0 5px 8px rgba(255,255,255,.13)}
    .machine-lower:before,.machine-lower:after{content:'';position:absolute;bottom:-12px;width:25px;height:25px;border-radius:50%;background:radial-gradient(circle,#6e7680 0 31%,#252a30 33% 100%)}
    .machine-lower:before{left:16%}.machine-lower:after{right:16%}

    #countdownStage.theme-popcorn .time-display-wrap{position:absolute!important;right:2.5%!important;left:auto!important;top:50%!important;bottom:auto!important;transform:translateY(-50%)!important;width:min(31%,285px)!important;max-width:285px!important;z-index:10!important;justify-items:center!important;align-items:center!important;text-align:center!important;gap:.36rem!important}
    #countdownStage.theme-popcorn #countdownDisplay{box-sizing:border-box!important;width:100%!important;max-width:100%!important;font-size:clamp(3.05rem,4.3vw,4.65rem)!important;line-height:.96!important;letter-spacing:-.045em!important;padding:10px 12px 12px!important;text-align:center!important;white-space:nowrap!important}
    #countdownStage.theme-popcorn #countdownMessage{box-sizing:border-box!important;max-width:100%!important;font-size:clamp(.86rem,1vw,.98rem)!important;padding:6px 11px!important;text-align:center!important;white-space:normal!important}

    @media(max-width:900px){.popcorn-machine{left:10%;width:52%;height:72%;bottom:6%}#countdownStage.theme-popcorn .time-display-wrap{right:2.5%!important;width:min(32%,235px)!important}#countdownStage.theme-popcorn #countdownDisplay{font-size:clamp(2.7rem,5vw,3.9rem)!important}.cinema-curtain{width:8%}}
    @media(max-width:680px){.popcorn-machine{left:7%;width:58%;height:68%;bottom:5%}.popcorn-marquee span{font-size:clamp(.92rem,3.7vw,1.45rem);min-height:38px;padding-top:.16em}#countdownStage.theme-popcorn .time-display-wrap{right:2%!important;top:13%!important;transform:none!important;width:min(35%,180px)!important}#countdownStage.theme-popcorn #countdownDisplay{font-size:clamp(2rem,5.9vw,2.8rem)!important;padding:7px 9px 8px!important}.popcorn-scene .kernel{width:calc(31px * var(--piece-size,1))!important;height:calc(27px * var(--piece-size,1))!important}}
  `;
  document.head.appendChild(style);

  let audioCtx = null;
  let currentScene = null;
  let lastPoppedCount = 0;
  let firstSample = true;
  let raf = 0;

  function isMuted() {
    try {
      const value = localStorage.getItem('ttTimers.muted');
      if (value !== null) return JSON.parse(value) === true;
    } catch {}
    return muteBtn?.getAttribute('aria-pressed') === 'true' || presentationMuteBtn?.getAttribute('aria-pressed') === 'true';
  }

  function ensureAudio() {
    if (audioCtx) return audioCtx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
    return audioCtx;
  }

  function unlockAudio() {
    const ctx = ensureAudio();
    if (ctx?.state === 'suspended') ctx.resume().catch(() => {});
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
    osc.frequency.setValueAtTime(790 + Math.random() * 190, t);
    osc.frequency.exponentialRampToValueAtTime(280 + Math.random() * 90, t + .075);
    gain.gain.setValueAtTime(.0001, t);
    gain.gain.exponentialRampToValueAtTime(.026, t + .008);
    gain.gain.exponentialRampToValueAtTime(.0001, t + .1);
    filter.type = 'lowpass';
    filter.frequency.value = 1700;
    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + .11);
  }

  function makeShade(depth, tone) {
    const l1 = Math.round(99 - depth * 4 - tone * 1.5);
    const l2 = Math.round(92 - depth * 6 - tone * 2.2);
    const l3 = Math.round(78 - depth * 9 - tone * 2.4);
    const l4 = Math.round(67 - depth * 10 - tone * 2.5);
    return [
      `hsl(50 95% ${l1}%)`,
      `hsl(46 89% ${l2}%)`,
      `hsl(43 59% ${l3}%)`,
      `hsl(41 47% ${l4}%)`
    ];
  }

  function buildMachine(scene) {
    if (!scene || scene.dataset.cinemaPopcornV2 === '1') return;
    scene.dataset.cinemaPopcornV2 = '1';
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

    const rawBed = scene.querySelector('.raw-kernel-bed');
    for (let i = 0; i < 72; i++) {
      const raw = document.createElement('i');
      raw.className = 'raw-kernel';
      const scale = .78 + Math.random() * .4;
      raw.style.left = `${1 + Math.random() * 96}%`;
      raw.style.bottom = `${1 + Math.random() * 73}%`;
      raw.style.transform = `rotate(${-42 + Math.random() * 84}deg) scale(${scale.toFixed(2)})`;
      raw.style.opacity = String(.76 + Math.random() * .24);
      rawBed.appendChild(raw);
    }

    const pieces = Array.from({ length: 58 }, (_, i) => {
      const depth = Math.random();
      const tone = Math.random();
      const bottomBase = 2 + (i / 57) * 65;
      return {
        left: 2 + Math.random() * 91,
        bottom: Math.max(1, bottomBase + (Math.random() * 9 - 4.5)),
        rotate: -31 + Math.random() * 62,
        size: .91 + Math.random() * .19 - depth * .035,
        depth,
        tone
      };
    }).sort((a, b) => a.bottom - b.bottom);

    const fill = scene.querySelector('.popcorn-fill');
    pieces.forEach((piece, i) => {
      const kernel = document.createElement('i');
      kernel.className = 'kernel';
      const shades = makeShade(piece.depth, piece.tone);
      const z = Math.round(220 - piece.bottom * 2 + (1 - piece.depth) * 16 + Math.random() * 6);
      kernel.style.left = `${piece.left.toFixed(2)}%`;
      kernel.style.bottom = `${piece.bottom.toFixed(2)}%`;
      kernel.style.transform = `rotate(${piece.rotate.toFixed(1)}deg) scale(0)`;
      kernel.style.setProperty('--piece-size', piece.size.toFixed(3));
      kernel.style.setProperty('--piece-z', String(z));
      kernel.style.setProperty('--piece-opacity', (.91 + (1 - piece.depth) * .09).toFixed(3));
      kernel.style.setProperty('--shadow-alpha', (.10 + (1 - piece.depth) * .11).toFixed(3));
      kernel.style.setProperty('--p1', shades[0]);
      kernel.style.setProperty('--p2', shades[1]);
      kernel.style.setProperty('--p3', shades[2]);
      kernel.style.setProperty('--p4', shades[3]);
      fill.appendChild(kernel);
    });

    currentScene = scene;
    lastPoppedCount = 0;
    firstSample = true;
  }

  function scaleOf(kernel) {
    const match = kernel.style.transform.match(/scale\(([^)]+)\)/);
    return match ? Number(match[1]) || 0 : 0;
  }

  function samplePopcorn(scene) {
    const kernels = [...scene.querySelectorAll('.popcorn-fill .kernel')];
    if (!kernels.length) return;
    const popped = kernels.filter(kernel => scaleOf(kernel) >= .985);
    const poppedCount = popped.length;

    const raw = [...scene.querySelectorAll('.raw-kernel')];
    const rawVisible = Math.max(0, Math.round(raw.length * (1 - poppedCount / kernels.length)));
    raw.forEach((kernel, i) => {
      kernel.style.opacity = i < rawVisible ? kernel.dataset.baseOpacity || kernel.style.opacity || '1' : '0';
    });

    if (firstSample) {
      lastPoppedCount = poppedCount;
      firstSample = false;
      return;
    }

    if (poppedCount > lastPoppedCount) {
      const newlyPopped = popped.slice(lastPoppedCount, poppedCount);
      newlyPopped.forEach((kernel, i) => {
        kernel.classList.remove('just-popped');
        void kernel.offsetWidth;
        kernel.classList.add('just-popped');
        kernel.addEventListener('animationend', () => kernel.classList.remove('just-popped'), { once: true });
        if (stageStatus?.textContent.trim() === 'Running' && i < 3) popSound(i * .04);
      });
    }
    lastPoppedCount = poppedCount;
  }

  function loop() {
    const scene = sceneLayer.querySelector('.popcorn-scene');
    if (scene) {
      if (scene !== currentScene || scene.dataset.cinemaPopcornV2 !== '1') buildMachine(scene);
      samplePopcorn(scene);
    } else {
      currentScene = null;
      lastPoppedCount = 0;
      firstSample = true;
    }
    raf = requestAnimationFrame(loop);
  }

  document.addEventListener('pointerdown', unlockAudio, { capture:true, passive:true });
  document.addEventListener('keydown', unlockAudio, { capture:true });

  cancelAnimationFrame(raf);
  loop();
})();
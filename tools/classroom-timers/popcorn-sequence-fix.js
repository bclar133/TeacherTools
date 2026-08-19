(() => {
  'use strict';

  if (document.getElementById('popcornSequenceFixStyleV3')) return;

  const sceneLayer = document.getElementById('sceneLayer');
  const stageStatus = document.getElementById('stageStatus');
  const display = document.getElementById('countdownDisplay');
  const minutesInput = document.getElementById('countdownMinutes');
  const secondsInput = document.getElementById('countdownSeconds');
  const muteBtn = document.getElementById('muteBtn');
  const presentationMuteBtn = document.getElementById('presentationMuteBtn');
  if (!sceneLayer || !display) return;

  const style = document.createElement('style');
  style.id = 'popcornSequenceFixStyleV3';
  style.textContent = `
    .sequenced-popcorn-piece{position:absolute;width:calc(40px * var(--piece-size,1) * var(--piece-x,1));height:calc(35px * var(--piece-size,1) * var(--piece-y,1));border-radius:var(--piece-radius,55% 45% 52% 48%);background:radial-gradient(circle at var(--highlight-x,30%) var(--highlight-y,28%),var(--p1,#fffef7) 0 17%,var(--p2,#fff3c9) 18% 53%,var(--p3,#ead18f) 54% 76%,var(--p4,#d9bb74) 77%);box-shadow:inset calc(-4px * var(--piece-size,1)) calc(-4px * var(--piece-size,1)) 0 rgba(211,187,119,.42),0 calc(2px + var(--depth,0) * 2px) calc(4px + var(--depth,0) * 4px) rgba(0,0,0,var(--shadow-alpha,.16));opacity:var(--piece-opacity,1);filter:brightness(var(--piece-brightness,1)) saturate(var(--piece-saturation,1));transform-origin:center;will-change:transform,translate,scale,rotate;z-index:var(--piece-z,10)}
    .sequenced-popcorn-piece:before,.sequenced-popcorn-piece:after{content:'';position:absolute;border-radius:50%;background:radial-gradient(circle,var(--p1,#fffefa) 0 39%,var(--p2,#f5e8bc) 40% 100%)}
    .sequenced-popcorn-piece:before{width:var(--l1w,46%);height:var(--l1h,45%);left:var(--l1x,-7%);top:var(--l1y,15%);transform:rotate(var(--l1r,-25deg))}
    .sequenced-popcorn-piece:after{width:var(--l2w,43%);height:var(--l2h,41%);right:var(--l2x,-5%);top:var(--l2y,12%);transform:rotate(var(--l2r,24deg))}
    .sequenced-popcorn-piece.shape-b{border-radius:45% 55% 41% 59% / 58% 43% 57% 42%}
    .sequenced-popcorn-piece.shape-c{border-radius:58% 42% 61% 39% / 43% 59% 41% 57%}
    .sequenced-popcorn-piece.shape-d{border-radius:42% 58% 54% 46% / 61% 39% 55% 45%}
    .sequenced-popcorn-piece.just-popped{animation:sequencedCinemaPop .72s cubic-bezier(.16,.78,.28,1);z-index:80!important}
    @keyframes sequencedCinemaPop{
      0%{translate:var(--launch-x,0px) var(--launch-y,36px);scale:.28 .42;rotate:0deg}
      16%{translate:var(--lift-x,0px) var(--lift-y,12px);scale:1.18 .82;rotate:var(--pop-spin,0deg)}
      48%{translate:var(--apex-x,0px) var(--apex-y,-78px);scale:.92 1.11;rotate:var(--pop-spin,0deg)}
      72%{translate:0 2px;scale:1.18 .78;rotate:0deg}
      84%{translate:0 -10px;scale:.95 1.08;rotate:0deg}
      93%{translate:0 1px;scale:1.05 .94;rotate:0deg}
      100%{translate:0 0;scale:1;rotate:0deg}
    }
    @media(max-width:680px){.sequenced-popcorn-piece{width:calc(31px * var(--piece-size,1) * var(--piece-x,1));height:calc(27px * var(--piece-size,1) * var(--piece-y,1))}}
  `;
  document.head.appendChild(style);

  let audioCtx = null;
  let trackedScene = null;
  let pieces = [];
  let raw = [];
  let poppedCount = 0;
  let displayedRemaining = null;
  let displayChangedAt = performance.now();
  let lastStatus = '';
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

  function popSound(index) {
    if (isMuted()) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = index % 3 === 0 ? 'triangle' : (index % 3 === 1 ? 'sine' : 'square');
    osc.frequency.setValueAtTime(720 + Math.random() * 310, t);
    osc.frequency.exponentialRampToValueAtTime(245 + Math.random() * 120, t + .07 + Math.random() * .025);
    gain.gain.setValueAtTime(.0001, t);
    gain.gain.exponentialRampToValueAtTime(.022 + Math.random() * .009, t + .006);
    gain.gain.exponentialRampToValueAtTime(.0001, t + .09 + Math.random() * .025);
    filter.type = 'lowpass';
    filter.frequency.value = 1450 + Math.random() * 500;
    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + .13);
  }

  function parseRemainingSeconds() {
    const parts = display.textContent.trim().split(':').map(Number);
    if (parts.some(n => !Number.isFinite(n))) return null;
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return null;
  }

  function totalSeconds() {
    return Math.max(1, (Number(minutesInput?.value) || 0) * 60 + (Number(secondsInput?.value) || 0));
  }

  function continuousProgress(now, running) {
    const current = parseRemainingSeconds();
    if (current === null) return 0;

    if (displayedRemaining === null || current !== displayedRemaining) {
      displayedRemaining = current;
      displayChangedAt = now;
    }

    let estimatedRemaining = current;
    if (running && current > 0) {
      estimatedRemaining = Math.max(0, current - (now - displayChangedAt) / 1000);
    }

    return Math.max(0, Math.min(1, 1 - estimatedRemaining / totalSeconds()));
  }

  function setPieceVisible(piece, visible) {
    const rotation = piece.dataset.rotation || '0';
    piece.style.transform = `rotate(${rotation}deg) scale(${visible ? 1 : 0})`;
  }

  function rebuildRawKernels(scene, count) {
    const bed = scene.querySelector('.raw-kernel-bed');
    if (!bed) return [];
    bed.innerHTML = '';

    const kernels = [];
    for (let i = 0; i < count; i++) {
      const kernel = document.createElement('i');
      kernel.className = 'raw-kernel';
      const scale = .74 + Math.random() * .43;
      kernel.style.left = `${1 + Math.random() * 96}%`;
      kernel.style.bottom = `${2 + Math.random() * 73}%`;
      kernel.style.transform = `rotate(${-45 + Math.random() * 90}deg) scale(${scale.toFixed(2)})`;
      kernel.dataset.baseOpacity = String(.74 + Math.random() * .26);
      kernel.style.opacity = kernel.dataset.baseOpacity;
      bed.appendChild(kernel);
      kernels.push(kernel);
    }
    return kernels;
  }

  function updateRawKernels() {
    raw.forEach((kernel, i) => {
      kernel.style.opacity = i < poppedCount ? '0' : (kernel.dataset.baseOpacity || '1');
    });
    if (poppedCount >= pieces.length) raw.forEach(kernel => { kernel.style.opacity = '0'; });
  }

  function hijackScene(scene, now) {
    if (!scene) return false;
    const original = [...scene.querySelectorAll('.cinema-popcorn-piece')];
    if (!original.length) return false;

    original.forEach(piece => {
      piece.classList.remove('cinema-popcorn-piece');
      piece.classList.add('sequenced-popcorn-piece');
    });

    trackedScene = scene;
    pieces = [...scene.querySelectorAll('.sequenced-popcorn-piece')];
    raw = rebuildRawKernels(scene, pieces.length);

    const status = stageStatus?.textContent.trim() || '';
    displayedRemaining = parseRemainingSeconds();
    displayChangedAt = now;
    const progress = continuousProgress(now, status === 'Running');
    poppedCount = Math.min(pieces.length, Math.floor(progress * pieces.length));

    pieces.forEach((piece, i) => setPieceVisible(piece, i < poppedCount));
    updateRawKernels();
    lastStatus = status;
    return true;
  }

  function popOne() {
    if (poppedCount >= pieces.length) return;
    const index = poppedCount;
    const piece = pieces[index];
    const kernel = raw[index];
    poppedCount += 1;

    setPieceVisible(piece, true);

    const pieceRect = piece.getBoundingClientRect();
    const kernelRect = kernel?.getBoundingClientRect();
    let launchX = 0;
    let launchY = 36;

    if (kernelRect && pieceRect.width && pieceRect.height) {
      launchX = (kernelRect.left + kernelRect.width / 2) - (pieceRect.left + pieceRect.width / 2);
      launchY = (kernelRect.top + kernelRect.height / 2) - (pieceRect.top + pieceRect.height / 2);
    }

    const direction = Math.random() < .5 ? -1 : 1;
    const liftX = launchX * .72 + direction * (4 + Math.random() * 10);
    const liftY = launchY * .62 - (12 + Math.random() * 8);
    const apexX = launchX * .34 + direction * (10 + Math.random() * 20);
    const apexY = Math.min(-58, launchY * .18 - (76 + Math.random() * 30));
    const spin = direction * (10 + Math.random() * 24);

    piece.style.setProperty('--launch-x', `${launchX.toFixed(1)}px`);
    piece.style.setProperty('--launch-y', `${launchY.toFixed(1)}px`);
    piece.style.setProperty('--lift-x', `${liftX.toFixed(1)}px`);
    piece.style.setProperty('--lift-y', `${liftY.toFixed(1)}px`);
    piece.style.setProperty('--apex-x', `${apexX.toFixed(1)}px`);
    piece.style.setProperty('--apex-y', `${apexY.toFixed(1)}px`);
    piece.style.setProperty('--pop-spin', `${spin.toFixed(1)}deg`);

    piece.classList.remove('just-popped');
    void piece.offsetWidth;
    piece.classList.add('just-popped');
    piece.addEventListener('animationend', () => piece.classList.remove('just-popped'), { once: true });

    popSound(index);
    updateRawKernels();
  }

  function loop(now) {
    const scene = sceneLayer.querySelector('.popcorn-scene');

    if (!scene) {
      trackedScene = null;
      pieces = [];
      raw = [];
      poppedCount = 0;
      displayedRemaining = null;
      lastStatus = '';
      raf = requestAnimationFrame(loop);
      return;
    }

    if (scene !== trackedScene || !scene.querySelector('.sequenced-popcorn-piece')) {
      if (!hijackScene(scene, now)) {
        raf = requestAnimationFrame(loop);
        return;
      }
    }

    const status = stageStatus?.textContent.trim() || '';
    const running = status === 'Running';

    if (status !== lastStatus) {
      lastStatus = status;
      displayedRemaining = parseRemainingSeconds();
      displayChangedAt = now;
    }

    const progress = continuousProgress(now, running);

    const desiredCount = progress >= 1
      ? pieces.length
      : Math.min(pieces.length, Math.floor(progress * pieces.length + .5));

    if (running && poppedCount < desiredCount) {
      popOne();
    }

    const remaining = parseRemainingSeconds();
    if (remaining === 0) {
      raw.forEach(kernel => { kernel.style.opacity = '0'; });
      if (poppedCount < pieces.length) popOne();
    }

    raf = requestAnimationFrame(loop);
  }

  document.addEventListener('pointerdown', unlockAudio, { capture:true, passive:true });
  document.addEventListener('keydown', unlockAudio, { capture:true });

  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(loop);
})();
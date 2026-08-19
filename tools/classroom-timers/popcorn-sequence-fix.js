(() => {
  'use strict';

  if (document.getElementById('popcornSequenceFixStyle')) return;

  const sceneLayer = document.getElementById('sceneLayer');
  const stageStatus = document.getElementById('stageStatus');
  const display = document.getElementById('countdownDisplay');
  const minutesInput = document.getElementById('countdownMinutes');
  const secondsInput = document.getElementById('countdownSeconds');
  const muteBtn = document.getElementById('muteBtn');
  const presentationMuteBtn = document.getElementById('presentationMuteBtn');
  if (!sceneLayer || !display) return;

  const style = document.createElement('style');
  style.id = 'popcornSequenceFixStyle';
  style.textContent = `
    .sequenced-popcorn-piece{position:absolute;width:calc(40px * var(--piece-size,1) * var(--piece-x,1));height:calc(35px * var(--piece-size,1) * var(--piece-y,1));border-radius:var(--piece-radius,55% 45% 52% 48%);background:radial-gradient(circle at var(--highlight-x,30%) var(--highlight-y,28%),var(--p1,#fffef7) 0 17%,var(--p2,#fff3c9) 18% 53%,var(--p3,#ead18f) 54% 76%,var(--p4,#d9bb74) 77%);box-shadow:inset calc(-4px * var(--piece-size,1)) calc(-4px * var(--piece-size,1)) 0 rgba(211,187,119,.42),0 calc(2px + var(--depth,0) * 2px) calc(4px + var(--depth,0) * 4px) rgba(0,0,0,var(--shadow-alpha,.16));opacity:var(--piece-opacity,1);filter:brightness(var(--piece-brightness,1)) saturate(var(--piece-saturation,1));transform-origin:center;will-change:transform,translate;z-index:var(--piece-z,10)}
    .sequenced-popcorn-piece:before,.sequenced-popcorn-piece:after{content:'';position:absolute;border-radius:50%;background:radial-gradient(circle,var(--p1,#fffefa) 0 39%,var(--p2,#f5e8bc) 40% 100%)}
    .sequenced-popcorn-piece:before{width:var(--l1w,46%);height:var(--l1h,45%);left:var(--l1x,-7%);top:var(--l1y,15%);transform:rotate(var(--l1r,-25deg))}
    .sequenced-popcorn-piece:after{width:var(--l2w,43%);height:var(--l2h,41%);right:var(--l2x,-5%);top:var(--l2y,12%);transform:rotate(var(--l2r,24deg))}
    .sequenced-popcorn-piece.shape-b{border-radius:45% 55% 41% 59% / 58% 43% 57% 42%}
    .sequenced-popcorn-piece.shape-c{border-radius:58% 42% 61% 39% / 43% 59% 41% 57%}
    .sequenced-popcorn-piece.shape-d{border-radius:42% 58% 54% 46% / 61% 39% 55% 45%}
    .sequenced-popcorn-piece.just-popped{animation:sequencedCinemaPop .42s cubic-bezier(.2,.75,.35,1)}
    @keyframes sequencedCinemaPop{0%{translate:0 0}42%{translate:var(--pop-x,0px) var(--pop-y,-28px)}68%{translate:calc(var(--pop-x,0px) * .35) -8px}100%{translate:0 0}}
    @media(max-width:680px){.sequenced-popcorn-piece{width:calc(31px * var(--piece-size,1) * var(--piece-x,1));height:calc(27px * var(--piece-size,1) * var(--piece-y,1))}}
  `;
  document.head.appendChild(style);

  let audioCtx = null;
  let trackedScene = null;
  let pieces = [];
  let poppedCount = 0;
  let nextPopAt = null;
  let lastStatus = '';
  let displayedRemaining = null;
  let displayChangedAt = performance.now();
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

  function rawKernels(scene = trackedScene) {
    return scene ? [...scene.querySelectorAll('.raw-kernel')] : [];
  }

  function updateRawKernels() {
    const raw = rawKernels();
    if (!raw.length || !pieces.length) return;
    const visibleCount = poppedCount >= pieces.length ? 0 : Math.max(0, Math.ceil(raw.length * (1 - poppedCount / pieces.length)));
    raw.forEach((kernel, i) => {
      kernel.style.opacity = i < visibleCount ? (kernel.dataset.baseOpacity || '1') : '0';
    });
  }

  function setPieceVisible(piece, visible) {
    const rotation = piece.dataset.rotation || '0';
    piece.style.transform = `rotate(${rotation}deg) scale(${visible ? 1 : 0})`;
  }

  function initialProgress() {
    const remaining = parseRemainingSeconds();
    if (remaining === null) return 0;
    return Math.max(0, Math.min(1, 1 - remaining / totalSeconds()));
  }

  function hijackScene(scene) {
    if (!scene) return false;
    const original = [...scene.querySelectorAll('.cinema-popcorn-piece')];
    if (!original.length) return false;

    original.forEach(piece => {
      piece.classList.remove('cinema-popcorn-piece');
      piece.classList.add('sequenced-popcorn-piece');
    });

    trackedScene = scene;
    pieces = [...scene.querySelectorAll('.sequenced-popcorn-piece')];
    poppedCount = Math.min(pieces.length, Math.floor(initialProgress() * pieces.length));
    pieces.forEach((piece, i) => setPieceVisible(piece, i < poppedCount));
    updateRawKernels();
    nextPopAt = null;
    displayedRemaining = parseRemainingSeconds();
    displayChangedAt = performance.now();
    lastStatus = stageStatus?.textContent.trim() || '';
    return true;
  }

  function remainingEstimate(now, running) {
    const current = parseRemainingSeconds();
    if (current === null) return 0;
    if (displayedRemaining === null || current !== displayedRemaining) {
      displayedRemaining = current;
      displayChangedAt = now;
    }
    if (!running) return current;
    return Math.max(0, current - (now - displayChangedAt) / 1000);
  }

  function intervalToNextPop(now) {
    const remainingPieces = Math.max(1, pieces.length - poppedCount);
    const estimate = remainingEstimate(now, true);
    return Math.max(35, (estimate * 1000 / remainingPieces) * .997);
  }

  function popOne() {
    if (poppedCount >= pieces.length) return;
    const index = poppedCount;
    const piece = pieces[index];
    poppedCount += 1;
    setPieceVisible(piece, true);
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
      poppedCount = 0;
      nextPopAt = null;
      lastStatus = '';
      raf = requestAnimationFrame(loop);
      return;
    }

    if (scene !== trackedScene || !scene.querySelector('.sequenced-popcorn-piece')) {
      if (!hijackScene(scene)) {
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
      nextPopAt = running && poppedCount < pieces.length ? now + intervalToNextPop(now) : null;
    }

    remainingEstimate(now, running);

    if (running && poppedCount < pieces.length) {
      if (nextPopAt === null) nextPopAt = now + intervalToNextPop(now);
      if (now >= nextPopAt) {
        popOne();
        nextPopAt = poppedCount < pieces.length ? now + intervalToNextPop(now) : null;
      }
    } else if (!running) {
      nextPopAt = null;
    }

    const remaining = parseRemainingSeconds();
    if (remaining === 0 && poppedCount >= pieces.length) {
      rawKernels().forEach(kernel => { kernel.style.opacity = '0'; });
    }

    raf = requestAnimationFrame(loop);
  }

  document.addEventListener('pointerdown', unlockAudio, { capture:true, passive:true });
  document.addEventListener('keydown', unlockAudio, { capture:true });

  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(loop);
})();
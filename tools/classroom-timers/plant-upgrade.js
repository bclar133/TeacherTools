(() => {
  'use strict';

  if (document.getElementById('plantUpgradeStyleV3')) return;

  const sceneLayer = document.getElementById('sceneLayer');
  const stage = document.getElementById('countdownStage');
  const stageStatus = document.getElementById('stageStatus');
  const muteBtn = document.getElementById('muteBtn');
  const presentationMuteBtn = document.getElementById('presentationMuteBtn');
  if (!sceneLayer || !stage) return;

  const style = document.createElement('style');
  style.id = 'plantUpgradeStyleV3';
  style.textContent = `
    .plant-scene{--plant-x:39%;overflow:hidden}
    #countdownStage.theme-plant .time-display-wrap{position:absolute!important;left:auto!important;right:4%!important;top:50%!important;bottom:auto!important;transform:translateY(-50%)!important;width:min(38%,390px)!important;justify-items:center!important;text-align:center!important;z-index:12!important}
    #countdownStage.theme-plant #countdownDisplay,#countdownStage.theme-plant .time-display{font-size:clamp(4.4rem,6.8vw,6.5rem)!important;padding:8px 20px 10px!important;line-height:.98!important;text-align:center!important}
    #countdownStage.theme-plant #countdownMessage,#countdownStage.theme-plant .timer-message{font-size:clamp(.95rem,1.15vw,1.08rem)!important;padding:6px 14px!important;text-align:center!important}

    .plant-scene .plant-pot,.plant-scene .plant-stem{left:var(--plant-x)!important}
    .plant-scene .leaf{width:88px!important;height:44px!important;background:linear-gradient(135deg,#52c36b,#2f934d)!important;filter:drop-shadow(0 4px 4px rgba(37,93,54,.16));opacity:1}
    .plant-scene .leaf.l1,.plant-scene .leaf.l3{left:calc(var(--plant-x) - 88px)!important;border-radius:100% 0 100% 0!important;transform-origin:right center!important}
    .plant-scene .leaf.l1{bottom:38%!important;transform:rotate(-14deg) scale(var(--leafScale,0))!important}
    .plant-scene .leaf.l3{bottom:57%!important;transform:rotate(-9deg) scale(var(--leafScale,0))!important}
    .plant-scene .leaf.l2,.plant-scene .leaf.l4{left:var(--plant-x)!important;border-radius:0 100% 0 100%!important;transform-origin:left center!important}
    .plant-scene .leaf.l2{bottom:47%!important;transform:rotate(14deg) scale(var(--leafScale,0))!important}
    .plant-scene .leaf.l4{bottom:65%!important;transform:rotate(9deg) scale(var(--leafScale,0))!important}

    .plant-scene .flower{width:204px!important;height:204px!important;transform:translate(-50%,-50%) scale(var(--flowerScale,0))!important;transform-origin:center!important;top:auto;bottom:auto!important;z-index:5!important;pointer-events:none}
    .plant-scene .flower .petal{left:69px!important;top:6px!important;width:64px!important;height:96px!important;border-radius:60% 60% 45% 45%!important;transform-origin:32px 95px!important}
    .plant-scene .flower .petal:nth-child(2){transform:rotate(72deg)!important}.plant-scene .flower .petal:nth-child(3){transform:rotate(144deg)!important}.plant-scene .flower .petal:nth-child(4){transform:rotate(216deg)!important}.plant-scene .flower .petal:nth-child(5){transform:rotate(288deg)!important}
    .plant-scene .flower-core{left:67px!important;top:67px!important;width:70px!important;height:70px!important;box-shadow:0 3px 9px rgba(156,111,24,.22)!important}

    .plant-extras{position:absolute;inset:0;z-index:2;pointer-events:none}
    .plant-bee{position:absolute;width:40px;height:28px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.18))}
    .plant-bee .body{position:absolute;left:9px;top:9px;width:23px;height:14px;border-radius:14px;background:repeating-linear-gradient(90deg,#ffd84e 0 6px,#272323 6px 10px)}
    .plant-bee .head{position:absolute;left:3px;top:10px;width:11px;height:11px;border-radius:50%;background:#292322}.plant-bee .head:after{content:'';position:absolute;left:2px;top:3px;width:2px;height:2px;border-radius:50%;background:white}
    .plant-bee .wing{position:absolute;top:1px;width:14px;height:12px;border-radius:50%;background:rgba(255,255,255,.82);animation:plantBeeWing .11s linear infinite alternate}.plant-bee .wing.w1{left:11px;transform-origin:right bottom}.plant-bee .wing.w2{left:20px;transform-origin:left bottom}
    .plant-bee.b1{left:15%;top:18%;animation:plantBeeFly1 7.5s ease-in-out infinite}.plant-bee.b2{left:24%;top:30%;animation:plantBeeFly2 8.8s ease-in-out infinite}
    @keyframes plantBeeWing{from{rotate:-18deg}to{rotate:18deg}}
    @keyframes plantBeeFly1{0%,100%{transform:translate(0,0) rotate(5deg)}25%{transform:translate(55px,-16px) rotate(-3deg)}50%{transform:translate(92px,13px) rotate(7deg)}75%{transform:translate(38px,29px) rotate(-4deg)}}
    @keyframes plantBeeFly2{0%,100%{transform:translate(0,0) scale(.9)}25%{transform:translate(42px,18px) scale(.94)}50%{transform:translate(78px,-18px) scale(.88)}75%{transform:translate(21px,-26px) scale(.92)}}

    .plant-ant{position:absolute;bottom:12.5%;width:26px;height:12px;animation:plantAntWalk 12s linear infinite;opacity:.9}.plant-ant:before,.plant-ant:after,.plant-ant span{content:'';position:absolute;top:2px;width:7px;height:7px;border-radius:50%;background:#2a211c}.plant-ant:before{left:0}.plant-ant span{left:8px}.plant-ant:after{left:16px}.plant-ant i{position:absolute;left:4px;top:8px;width:18px;height:5px;border-top:1.5px solid #2a211c;border-bottom:1.5px solid #2a211c;transform:skewX(-20deg)}
    .plant-ant.a1{left:10%;animation-duration:11s}.plant-ant.a2{left:29%;bottom:10.5%;animation-duration:14s;animation-delay:-4s}.plant-ant.a3{left:56%;bottom:13.5%;animation-duration:13s;animation-delay:-7s}
    @keyframes plantAntWalk{0%{translate:0 0}50%{translate:60px 0}100%{translate:0 0}}

    .plant-snail{position:absolute;left:67%;bottom:9.5%;width:76px;height:43px;animation:plantSnailCreep 18s linear infinite alternate;filter:drop-shadow(0 2px 3px rgba(0,0,0,.15))}
    .plant-snail .shell{position:absolute;left:0;top:6px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 35%,#e0b174 0 18%,#b8774d 19% 38%,#865238 39% 56%,#c78b56 57% 72%,#75452e 73%)}
    .plant-snail .body{position:absolute;left:23px;top:20px;width:47px;height:15px;border-radius:12px;background:#8f9364}.plant-snail .head{position:absolute;right:1px;top:14px;width:18px;height:15px;border-radius:50%;background:#8f9364}
    .plant-snail .eye{position:absolute;top:3px;width:2px;height:10px;background:#6d704f}.plant-snail .eye.e1{right:9px;rotate:-12deg}.plant-snail .eye.e2{right:4px;rotate:12deg}.plant-snail .eye:after{content:'';position:absolute;left:-1px;top:-2px;width:4px;height:4px;border-radius:50%;background:#29231f}
    @keyframes plantSnailCreep{from{translate:-22px 0}to{translate:34px 0}}

    @media(max-width:760px){.plant-scene{--plant-x:37%}#countdownStage.theme-plant .time-display-wrap{right:3%!important;top:16%!important;transform:none!important;width:min(48%,210px)!important}#countdownStage.theme-plant #countdownDisplay,#countdownStage.theme-plant .time-display{font-size:clamp(2.4rem,7vw,3.2rem)!important}.plant-scene .flower{width:154px!important;height:154px!important}.plant-scene .flower .petal{left:52px!important;width:48px!important;height:74px!important;transform-origin:24px 73px!important}.plant-scene .flower-core{left:52px!important;top:52px!important;width:52px!important;height:52px!important}.plant-bee{scale:.84}.plant-snail{left:61%}}
  `;
  document.head.appendChild(style);

  let stemObserver = null;
  let observedStem = null;
  let alignQueued = false;

  function alignFlower(scene) {
    alignQueued = false;
    const stem = scene?.querySelector('.plant-stem');
    const flower = scene?.querySelector('.flower');
    if (!stem || !flower) return;
    const sr = scene.getBoundingClientRect();
    const tr = stem.getBoundingClientRect();
    const x = tr.left - sr.left + tr.width / 2;
    const y = tr.top - sr.top;
    const left = `${x.toFixed(1)}px`;
    const top = `${y.toFixed(1)}px`;
    if (flower.style.left !== left) flower.style.left = left;
    if (flower.style.top !== top) flower.style.top = top;
  }

  function queueAlign(scene) {
    if (alignQueued) return;
    alignQueued = true;
    requestAnimationFrame(() => alignFlower(scene));
  }

  function attachStemObserver(scene) {
    const stem = scene?.querySelector('.plant-stem');
    if (!stem || stem === observedStem) return;
    stemObserver?.disconnect();
    observedStem = stem;
    stemObserver = new MutationObserver(() => queueAlign(scene));
    stemObserver.observe(stem, { attributes:true, attributeFilter:['style'] });
    queueAlign(scene);
  }

  function addExtras(scene) {
    if (!scene || scene.querySelector('.plant-extras')) return;
    const extras = document.createElement('div');
    extras.className = 'plant-extras';
    extras.innerHTML = `
      <div class="plant-bee b1"><i class="wing w1"></i><i class="wing w2"></i><i class="head"></i><i class="body"></i></div>
      <div class="plant-bee b2"><i class="wing w1"></i><i class="wing w2"></i><i class="head"></i><i class="body"></i></div>
      <div class="plant-ant a1"><span></span><i></i></div><div class="plant-ant a2"><span></span><i></i></div><div class="plant-ant a3"><span></span><i></i></div>
      <div class="plant-snail"><i class="shell"></i><i class="body"></i><i class="head"></i><i class="eye e1"></i><i class="eye e2"></i></div>`;
    scene.appendChild(extras);
  }

  function syncScene() {
    const scene = sceneLayer.querySelector('.plant-scene');
    if (!scene) return;
    addExtras(scene);
    attachStemObserver(scene);
    queueAlign(scene);
  }

  const sceneObserver = new MutationObserver(syncScene);
  sceneObserver.observe(sceneLayer, { childList:true, subtree:true });
  window.addEventListener('resize', syncScene);

  let audioCtx = null;
  let buzzOut = null;
  function isMuted() {
    try { const v = localStorage.getItem('ttTimers.muted'); if (v !== null) return JSON.parse(v) === true; } catch {}
    return muteBtn?.getAttribute('aria-pressed') === 'true';
  }
  function ensureBuzz() {
    if (audioCtx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audioCtx = new AC();
    const a = audioCtx.createOscillator();
    const b = audioCtx.createOscillator();
    const g1 = audioCtx.createGain();
    const g2 = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();
    buzzOut = audioCtx.createGain();
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    a.type='sawtooth'; a.frequency.value=175; g1.gain.value=.012;
    b.type='triangle'; b.frequency.value=238; g2.gain.value=.008;
    filter.type='bandpass'; filter.frequency.value=520; filter.Q.value=1.1;
    lfo.type='sine'; lfo.frequency.value=.7; lfoGain.gain.value=18;
    buzzOut.gain.value=0;
    lfo.connect(lfoGain).connect(a.frequency);
    a.connect(g1).connect(filter); b.connect(g2).connect(filter); filter.connect(buzzOut).connect(audioCtx.destination);
    a.start(); b.start(); lfo.start();
  }
  function updateBuzz() {
    if (!audioCtx || !buzzOut) return;
    const running = stageStatus?.textContent.trim() === 'Running';
    const active = stage.classList.contains('theme-plant') && running && !isMuted();
    if (audioCtx.state === 'suspended' && active) audioCtx.resume().catch(()=>{});
    const now = audioCtx.currentTime;
    buzzOut.gain.cancelScheduledValues(now);
    buzzOut.gain.setTargetAtTime(active ? .75 : 0, now, active ? .15 : .06);
  }
  function unlock() { ensureBuzz(); updateBuzz(); }
  document.addEventListener('pointerdown', unlock, {capture:true,passive:true});
  document.addEventListener('keydown', unlock, {capture:true});
  muteBtn?.addEventListener('click', () => setTimeout(updateBuzz,0));
  presentationMuteBtn?.addEventListener('click', () => setTimeout(updateBuzz,0));
  new MutationObserver(updateBuzz).observe(stage, {attributes:true, attributeFilter:['class']});
  if (stageStatus) new MutationObserver(updateBuzz).observe(stageStatus, {childList:true, characterData:true, subtree:true});
  window.addEventListener('storage', e => { if(e.key==='ttTimers.muted') updateBuzz(); });

  syncScene();
})();

(() => {
  'use strict';

  if (document.getElementById('coasterUpgradeStyleV3')) return;

  const sceneLayer = document.getElementById('sceneLayer');
  const stage = document.getElementById('countdownStage');
  const stageStatus = document.getElementById('stageStatus');
  const display = document.getElementById('countdownDisplay');
  const minutesInput = document.getElementById('countdownMinutes');
  const secondsInput = document.getElementById('countdownSeconds');
  if (!sceneLayer || !stage || !display) return;

  const style = document.createElement('style');
  style.id = 'coasterUpgradeStyleV3';
  style.textContent = `
    .coaster-scene.coaster-upgraded{
      position:absolute;inset:0;overflow:hidden;
      background:linear-gradient(#73c5ea 0 73.5%,#65ad54 73.5% 100%)!important;
    }
    .coaster-scene.coaster-upgraded:after{
      content:'';position:absolute;left:-4%;right:-4%;bottom:-7%;height:22%;z-index:0;
      border-radius:50% 50% 0 0;background:#4f9444;opacity:.55;pointer-events:none;
    }
    .coaster-upgrade-track,.coaster-hitch-layer{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
    .coaster-upgrade-track{z-index:2}.coaster-hitch-layer{z-index:5;overflow:visible}
    .coaster-rail-shadow{fill:none;stroke:rgba(38,30,24,.24);stroke-width:22;stroke-linecap:round;stroke-linejoin:round}
    .coaster-rail{fill:none;stroke:#594936;stroke-width:15;stroke-linecap:round;stroke-linejoin:round}
    .coaster-sleepers{fill:none;stroke:#e0bd79;stroke-width:4;stroke-dasharray:5 12;stroke-linecap:butt}
    .coaster-hitch{stroke:#282b31;stroke-width:6;stroke-linecap:round;filter:drop-shadow(0 2px 1px rgba(0,0,0,.25))}

    .coaster-car-upgraded{
      position:absolute;z-index:7;width:58px;height:32px;transform-origin:50% 50%;
      filter:drop-shadow(0 5px 4px rgba(0,0,0,.24));pointer-events:none;
    }
    .coaster-car-upgraded .car-shell{
      position:absolute;left:2px;right:2px;top:3px;height:23px;border-radius:8px 12px 9px 9px;
      background:linear-gradient(180deg,#ff6658 0 52%,#e6423b 53% 100%);
      border:2px solid rgba(133,34,31,.55);box-shadow:inset 0 3px 0 rgba(255,255,255,.18);
    }
    .coaster-car-upgraded .car-shell:before{
      content:'';position:absolute;left:9px;right:9px;top:-6px;height:10px;border-radius:6px 6px 2px 2px;
      background:#c82f31;border:2px solid rgba(111,26,29,.5);
    }
    .coaster-car-upgraded .seat{position:absolute;top:4px;width:10px;height:14px;border-radius:7px 7px 4px 4px;background:#242a31}
    .coaster-car-upgraded .seat.s1{left:13px}.coaster-car-upgraded .seat.s2{left:33px}
    .coaster-car-upgraded .wheel{position:absolute;bottom:-2px;width:12px;height:12px;border-radius:50%;background:radial-gradient(circle,#8f9ba6 0 29%,#22272d 31% 100%);border:1px solid #12161a}
    .coaster-car-upgraded .wheel.w1{left:9px}.coaster-car-upgraded .wheel.w2{right:9px}
    .coaster-car-upgraded.rear .car-shell{background:linear-gradient(180deg,#ff7868 0 52%,#e94a42 53% 100%)}

    #countdownStage.theme-coaster .time-display-wrap{
      position:absolute!important;left:3.5%!important;right:auto!important;top:4%!important;bottom:auto!important;
      transform:none!important;width:min(30%,310px)!important;z-index:20!important;justify-items:start!important;text-align:left!important;
    }
    #countdownStage.theme-coaster #countdownDisplay,#countdownStage.theme-coaster .time-display{
      width:auto!important;max-width:100%!important;font-size:clamp(3rem,5vw,5.2rem)!important;line-height:.98!important;
      padding:7px 16px 9px!important;text-align:left!important;white-space:nowrap!important;
    }
    #countdownStage.theme-coaster #countdownMessage,#countdownStage.theme-coaster .timer-message{
      margin-top:6px!important;padding:5px 10px!important;font-size:clamp(.78rem,.95vw,.94rem)!important;text-align:left!important;
    }
    @media(max-width:760px){
      .coaster-car-upgraded{width:48px;height:28px}.coaster-car-upgraded .car-shell{height:20px}.coaster-car-upgraded .seat{height:12px;width:9px}.coaster-car-upgraded .wheel{width:10px;height:10px}
      #countdownStage.theme-coaster .time-display-wrap{left:3%!important;top:3%!important;width:min(44%,220px)!important}
      #countdownStage.theme-coaster #countdownDisplay,#countdownStage.theme-coaster .time-display{font-size:clamp(2.2rem,7vw,3.3rem)!important;padding:6px 11px 7px!important}
    }
  `;
  document.head.appendChild(style);

  // Smoother layout with a larger central loop and a clearly separated entry and exit.
  const TRACK_D = 'M 35 505 C 90 505 125 460 175 450 C 235 438 250 300 305 285 C 360 270 390 448 455 442 C 472 440 488 428 500 410 C 455 374 446 302 460 245 C 478 174 526 145 585 150 C 654 155 707 213 708 285 C 710 352 683 403 635 425 C 671 422 700 397 721 361 C 748 316 772 270 814 266 C 873 260 889 428 936 425 C 965 423 982 390 995 380';

  let trackedScene = null;
  let path = null;
  let frontCar = null;
  let rearCar = null;
  let hitch = null;
  let displayedRemaining = null;
  let displayChangedAt = performance.now();
  let lastStatus = '';
  let raf = 0;

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
    let estimated = current;
    if (running && current > 0) estimated = Math.max(0, current - (now - displayChangedAt) / 1000);
    return Math.max(0, Math.min(1, 1 - estimated / totalSeconds()));
  }

  function carMarkup(extraClass) {
    return `<div class="coaster-car-upgraded ${extraClass}"><div class="car-shell"><i class="seat s1"></i><i class="seat s2"></i></div><i class="wheel w1"></i><i class="wheel w2"></i></div>`;
  }

  function upgradeScene(scene, now) {
    if (!scene || scene.classList.contains('coaster-upgraded')) return;
    scene.classList.add('coaster-upgraded');
    scene.innerHTML = `
      <svg class="coaster-upgrade-track" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
        <path class="coaster-rail-shadow" d="${TRACK_D}"/>
        <path class="coaster-rail" d="${TRACK_D}"/>
        <path class="coaster-sleepers" d="${TRACK_D}"/>
      </svg>
      <svg class="coaster-hitch-layer" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true"><line class="coaster-hitch" x1="0" y1="0" x2="0" y2="0"/></svg>
      ${carMarkup('rear')}${carMarkup('front')}`;

    const svg = scene.querySelector('.coaster-upgrade-track');
    path = svg?.querySelector('.coaster-rail');
    const cars = [...scene.querySelectorAll('.coaster-car-upgraded')];
    rearCar = cars.find(c => c.classList.contains('rear')) || null;
    frontCar = cars.find(c => c.classList.contains('front')) || null;
    hitch = scene.querySelector('.coaster-hitch');
    trackedScene = scene;
    displayedRemaining = parseRemainingSeconds();
    displayChangedAt = now;
    lastStatus = stageStatus?.textContent.trim() || '';
  }

  function placeCar(car, distance, length) {
    if (!car || !path) return null;
    const scene = trackedScene;
    const rect = scene.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;

    const d = Math.max(0, Math.min(length, distance));
    const p = path.getPointAtLength(d);
    const p2 = path.getPointAtLength(Math.min(length, d + 4));
    const p0 = path.getPointAtLength(Math.max(0, d - 4));

    const sx = rect.width / 1000;
    const sy = rect.height / 600;
    const dx = (p2.x - p0.x) * sx;
    const dy = (p2.y - p0.y) * sy;
    const mag = Math.hypot(dx, dy) || 1;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    const nx = dy / mag;
    const ny = -dx / mag;
    const lift = rect.width < 700 ? 12 : 15;
    const cxPx = p.x * sx + nx * lift;
    const cyPx = p.y * sy + ny * lift;
    const cx = cxPx / sx;
    const cy = cyPx / sy;

    car.style.left = `${(cx / 10).toFixed(3)}%`;
    car.style.top = `${(cy / 6).toFixed(3)}%`;
    car.style.transform = `translate(-50%,-50%) rotate(${angle.toFixed(2)}deg)`;
    return { x:cx, y:cy, angle };
  }

  function renderTrain(progress) {
    if (!path || !frontCar || !rearCar || !hitch) return;
    const length = path.getTotalLength();
    if (!length) return;

    const spacing = 66;
    const frontDistance = spacing + progress * Math.max(0, length - spacing);
    const rearDistance = Math.max(0, frontDistance - spacing);
    const front = placeCar(frontCar, frontDistance, length);
    const rear = placeCar(rearCar, rearDistance, length);
    if (!front || !rear) return;

    hitch.setAttribute('x1', rear.x.toFixed(2));
    hitch.setAttribute('y1', rear.y.toFixed(2));
    hitch.setAttribute('x2', front.x.toFixed(2));
    hitch.setAttribute('y2', front.y.toFixed(2));
  }

  function loop(now) {
    const scene = sceneLayer.querySelector('.coaster-scene');
    if (!scene) {
      trackedScene = null; path = frontCar = rearCar = hitch = null;
      displayedRemaining = null; lastStatus = '';
      raf = requestAnimationFrame(loop);
      return;
    }

    if (scene !== trackedScene || !scene.classList.contains('coaster-upgraded')) upgradeScene(scene, now);
    if (!path) {
      raf = requestAnimationFrame(loop);
      return;
    }

    const status = stageStatus?.textContent.trim() || '';
    const running = status === 'Running';
    if (status !== lastStatus) {
      lastStatus = status;
      displayedRemaining = parseRemainingSeconds();
      displayChangedAt = now;
    }

    const progress = continuousProgress(now, running);
    renderTrain(progress);
    raf = requestAnimationFrame(loop);
  }

  const sceneObserver = new MutationObserver(() => {
    const scene = sceneLayer.querySelector('.coaster-scene');
    if (scene && !scene.classList.contains('coaster-upgraded')) upgradeScene(scene, performance.now());
  });
  sceneObserver.observe(sceneLayer, { childList:true, subtree:true });
  window.addEventListener('resize', () => renderTrain(continuousProgress(performance.now(), stageStatus?.textContent.trim() === 'Running')));

  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(loop);
})();

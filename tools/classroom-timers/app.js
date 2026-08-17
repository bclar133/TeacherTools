(() => {
  'use strict';

  const style = document.createElement('style');
  style.id = 'classroomTimersPresentationAndRacerV2';
  style.textContent = `
    .presentation-toolbar[hidden] { display: none !important; }
    body.presentation-mode .presentation-toolbar:not([hidden]) { display: flex; }

    .race-scene {
      background:
        radial-gradient(circle at 13% 23%, rgba(33,105,45,.22) 0 20px, transparent 21px),
        radial-gradient(circle at 80% 72%, rgba(29,96,40,.20) 0 24px, transparent 25px),
        linear-gradient(#84ca70, #70b95f);
    }
    .race-cloud { display: none !important; }
    .race-road svg { overflow: visible; shape-rendering: geometricPrecision; }
    .race-road .race-shoulder {
      fill: none;
      stroke: #d8c69a;
      stroke-width: 142;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .race-road .race-edge {
      fill: none;
      stroke: #f5f6ef;
      stroke-width: 130;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .race-road .race-path {
      fill: none;
      stroke: #3d4145 !important;
      stroke-width: 118 !important;
      stroke-linecap: round !important;
      stroke-linejoin: round !important;
    }
    .race-road .race-centre {
      fill: none;
      stroke: #f6dd7b !important;
      stroke-width: 5 !important;
      stroke-dasharray: 24 22 !important;
      stroke-linecap: round;
      opacity: .92;
    }
    .race-car {
      width: 76px !important;
      height: 40px !important;
      transform: translate(-50%, -50%) !important;
      transform-origin: 50% 50%;
      filter: drop-shadow(0 7px 6px rgba(0,0,0,.34));
    }
    .race-car .car-body {
      inset: 2px 1px !important;
      border-radius: 15px 23px 23px 15px !important;
      background: linear-gradient(180deg, #ff6a5f 0%, #e53032 50%, #b91924 100%) !important;
      box-shadow: inset 0 0 0 2px rgba(88,0,8,.25), inset 0 7px 8px rgba(255,255,255,.2);
    }
    .race-car .car-body::before {
      content: "";
      position: absolute;
      right: 4px;
      top: 7px;
      width: 5px;
      height: 8px;
      border-radius: 3px;
      background: #fff4b6;
      box-shadow: 0 18px 0 #fff4b6;
    }
    .race-car .car-body::after {
      content: "";
      position: absolute;
      left: 4px;
      top: 8px;
      width: 5px;
      height: 7px;
      border-radius: 2px;
      background: #8f1018;
      box-shadow: 0 17px 0 #8f1018;
    }
    .race-car .car-cabin {
      left: 27px !important;
      top: 6px !important;
      width: 30px !important;
      height: 28px !important;
      border: 0 !important;
      border-radius: 8px 12px 12px 8px !important;
      background: linear-gradient(90deg, #183848 0 45%, #5aa8c2 48% 72%, #183848 75%) !important;
      clip-path: polygon(13% 0, 82% 0, 100% 24%, 100% 76%, 82% 100%, 13% 100%, 0 73%, 0 27%);
      box-shadow: inset 0 0 0 2px rgba(255,255,255,.16);
    }
    .race-car .car-wheel {
      width: 10px !important;
      height: 5px !important;
      border: 0 !important;
      border-radius: 2px !important;
      background: #17191b !important;
      bottom: auto !important;
    }
    .race-car .car-wheel.w1 { left: 18px !important; top: -2px !important; box-shadow: 0 39px 0 #17191b; }
    .race-car .car-wheel.w2 { right: 16px !important; top: -2px !important; box-shadow: 0 39px 0 #17191b; }
    .finish-flag {
      width: 18px !important;
      height: 112px !important;
      background: conic-gradient(#fff 25%, #111 0 50%, #fff 0 75%, #111 0) 0 0 / 18px 18px !important;
      transform: translate(-50%, -50%) !important;
      border: 2px solid rgba(255,255,255,.7);
      box-shadow: 0 4px 10px rgba(0,0,0,.28);
    }
    .finish-flag::before { display: none !important; }
  `;
  document.head.appendChild(style);

  const sceneLayer = document.getElementById('sceneLayer');
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  function buildSmoothRoadPath() {
    const count = 8;
    const startX = 90;
    const endX = 910;
    const mid = 300 + (Math.random() * 70 - 35);
    const amp1 = 75 + Math.random() * 45;
    const amp2 = 18 + Math.random() * 25;
    const phase1 = Math.random() * Math.PI * 2;
    const phase2 = Math.random() * Math.PI * 2;
    const cycles = 1.15 + Math.random() * .45;
    const points = [];

    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const x = startX + (endX - startX) * t;
      let y = mid
        + Math.sin(phase1 + t * Math.PI * cycles) * amp1
        + Math.sin(phase2 + t * Math.PI * cycles * 1.85) * amp2;
      y = clamp(y, 125, 475);
      points.push({ x, y });
    }

    points[1].y = points[0].y + (points[2].y - points[0].y) * .35;
    points[count - 2].y = points[count - 1].y + (points[count - 3].y - points[count - 1].y) * .35;

    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    const tension = .72;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];
      const cp1x = p1.x + (p2.x - p0.x) * tension / 6;
      const cp1y = p1.y + (p2.y - p0.y) * tension / 6;
      const cp2x = p2.x - (p3.x - p1.x) * tension / 6;
      const cp2y = p2.y - (p3.y - p1.y) * tension / 6;
      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  }

  function orientAt(path, distance, element, offset = 0) {
    if (!path || !element || !sceneLayer) return;
    const len = path.getTotalLength();
    const d1 = clamp(distance, 0, len);
    const d2 = clamp(distance + 12, 0, len);
    const p1 = path.getPointAtLength(d1);
    const p2 = path.getPointAtLength(d2 === d1 ? Math.max(0, d1 - 12) : d2);
    const rect = sceneLayer.getBoundingClientRect();
    const dx = (p2.x - p1.x) * (rect.width / 1000);
    const dy = (p2.y - p1.y) * (rect.height / 600);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    element.style.rotate = `${angle + offset}deg`;
  }

  function upgradeRoad() {
    if (!sceneLayer) return;
    const svg = sceneLayer.querySelector('.race-road svg');
    const roadPath = svg?.querySelector('.race-path');
    if (!svg || !roadPath || svg.dataset.racerV2 === 'true') return;

    svg.dataset.racerV2 = 'true';
    const d = buildSmoothRoadPath();
    roadPath.setAttribute('d', d);

    const oldCentre = [...svg.querySelectorAll('path')].find(p => p !== roadPath);
    if (oldCentre) {
      oldCentre.setAttribute('d', d);
      oldCentre.classList.add('race-centre');
    }

    const shoulder = roadPath.cloneNode(false);
    shoulder.removeAttribute('class');
    shoulder.setAttribute('class', 'race-shoulder');
    shoulder.setAttribute('d', d);
    const edge = roadPath.cloneNode(false);
    edge.removeAttribute('class');
    edge.setAttribute('class', 'race-edge');
    edge.setAttribute('d', d);
    svg.insertBefore(shoulder, roadPath);
    svg.insertBefore(edge, roadPath);

    requestAnimationFrame(() => {
      const len = roadPath.getTotalLength();
      const start = roadPath.getPointAtLength(0);
      const finishPoint = roadPath.getPointAtLength(len);
      const car = sceneLayer.querySelector('.race-car');
      const finish = sceneLayer.querySelector('.finish-flag');

      if (car) {
        car.style.left = `${start.x / 10}%`;
        car.style.top = `${start.y / 6}%`;
        orientAt(roadPath, 0, car, 0);
      }
      if (finish) {
        finish.style.left = `${finishPoint.x / 10}%`;
        finish.style.top = `${finishPoint.y / 6}%`;
        orientAt(roadPath, Math.max(0, len - 12), finish, 90);
      }
    });
  }

  if (sceneLayer) {
    new MutationObserver(upgradeRoad).observe(sceneLayer, { childList: true, subtree: true });
    upgradeRoad();
  }

  const current = document.currentScript;
  const core = document.createElement('script');
  core.src = new URL('app-core.js', current.src).href;
  core.async = false;
  document.body.appendChild(core);
})();

(() => {
  'use strict';

  if (document.getElementById('coasterFairgroundStyleV1')) return;

  const sceneLayer = document.getElementById('sceneLayer');
  if (!sceneLayer) return;

  const style = document.createElement('style');
  style.id = 'coasterFairgroundStyleV1';
  style.textContent = `
    .coaster-fairground{
      position:absolute;inset:0;z-index:1;overflow:hidden;pointer-events:none;
    }
    .coaster-fairground:before{
      content:'';position:absolute;left:-3%;right:-3%;bottom:13%;height:6%;
      background:linear-gradient(180deg,rgba(76,135,65,.15),rgba(54,116,48,.38));
      border-radius:50% 50% 0 0;
    }

    .coaster-circus-tent{
      position:absolute;left:6.5%;bottom:13%;width:168px;height:126px;
      opacity:.9;filter:drop-shadow(0 5px 4px rgba(0,0,0,.16));
    }
    .coaster-circus-tent .tent-base{
      position:absolute;left:12px;right:12px;bottom:0;height:62px;
      background:repeating-linear-gradient(90deg,#fff1d7 0 18px,#d63d44 18px 36px);
      clip-path:polygon(5% 100%,14% 0,86% 0,95% 100%);
      border-radius:0 0 8px 8px;
    }
    .coaster-circus-tent .tent-roof{
      position:absolute;left:4px;right:4px;bottom:54px;height:58px;
      background:repeating-linear-gradient(90deg,#ffe7a8 0 18px,#cc3040 18px 36px);
      clip-path:polygon(50% 0,100% 100%,0 100%);
    }
    .coaster-circus-tent .tent-door{
      position:absolute;left:50%;bottom:0;width:38px;height:42px;transform:translateX(-50%);
      background:#47202b;border-radius:50% 50% 0 0;
    }
    .coaster-circus-tent .tent-pole{
      position:absolute;left:50%;bottom:106px;width:4px;height:23px;transform:translateX(-50%);background:#6e4e2a;
    }
    .coaster-circus-tent .tent-flag{
      position:absolute;left:50%;bottom:119px;width:27px;height:14px;transform:translateX(2px);
      background:#ffd24f;clip-path:polygon(0 0,100% 50%,0 100%);
    }

    .coaster-ferris{
      position:absolute;right:7%;bottom:14%;width:152px;height:152px;opacity:.7;
      filter:drop-shadow(0 4px 4px rgba(0,0,0,.13));
    }
    .coaster-ferris .wheel{
      position:absolute;inset:0;border:7px solid rgba(111,75,45,.84);border-radius:50%;box-sizing:border-box;
      animation:coasterFerrisSpin 24s linear infinite;
    }
    .coaster-ferris .wheel:before,.coaster-ferris .wheel:after{
      content:'';position:absolute;left:50%;top:50%;background:rgba(111,75,45,.64);transform:translate(-50%,-50%);
    }
    .coaster-ferris .wheel:before{width:5px;height:100%}.coaster-ferris .wheel:after{width:100%;height:5px}
    .coaster-ferris .diag{position:absolute;left:50%;top:50%;width:5px;height:100%;background:rgba(111,75,45,.54);transform-origin:center center}
    .coaster-ferris .diag.d1{transform:translate(-50%,-50%) rotate(45deg)}
    .coaster-ferris .diag.d2{transform:translate(-50%,-50%) rotate(-45deg)}
    .coaster-ferris .hub{position:absolute;left:50%;top:50%;width:18px;height:18px;border-radius:50%;transform:translate(-50%,-50%);background:#87603b;z-index:2}
    .coaster-ferris .stand{position:absolute;left:50%;bottom:-18px;width:82px;height:82px;transform:translateX(-50%)}
    .coaster-ferris .stand:before,.coaster-ferris .stand:after{content:'';position:absolute;bottom:0;width:7px;height:88px;background:#775233;transform-origin:bottom center}
    .coaster-ferris .stand:before{left:18px;transform:rotate(21deg)}
    .coaster-ferris .stand:after{right:18px;transform:rotate(-21deg)}
    @keyframes coasterFerrisSpin{to{transform:rotate(360deg)}}

    .coaster-carousel{
      position:absolute;right:27%;bottom:13%;width:102px;height:90px;opacity:.72;
      filter:drop-shadow(0 4px 4px rgba(0,0,0,.13));
    }
    .coaster-carousel .roof{
      position:absolute;left:3px;right:3px;top:0;height:35px;
      background:repeating-linear-gradient(90deg,#ffd45b 0 15px,#e95e48 15px 30px);
      clip-path:polygon(50% 0,100% 100%,0 100%);
    }
    .coaster-carousel .topbar{position:absolute;left:15px;right:15px;top:31px;height:7px;background:#8e5f3c;border-radius:6px}
    .coaster-carousel .pole{position:absolute;left:50%;top:31px;bottom:13px;width:4px;transform:translateX(-50%);background:#7b5636}
    .coaster-carousel .horse{position:absolute;bottom:18px;font-size:22px;animation:coasterHorseBob 1.6s ease-in-out infinite alternate}
    .coaster-carousel .horse.h1{left:15px}.coaster-carousel .horse.h2{right:14px;animation-delay:-.8s}
    .coaster-carousel .deck{position:absolute;left:5px;right:5px;bottom:0;height:14px;border-radius:12px;background:#b37846}
    @keyframes coasterHorseBob{from{transform:translateY(2px)}to{transform:translateY(-8px)}}

    .coaster-swing-ride{
      position:absolute;left:27%;bottom:14%;width:90px;height:110px;opacity:.62;
    }
    .coaster-swing-ride .mast{position:absolute;left:50%;bottom:0;width:6px;height:78px;transform:translateX(-50%);background:#73513b}
    .coaster-swing-ride .canopy{position:absolute;left:14px;right:14px;top:14px;height:29px;border-radius:50% 50% 30% 30%;background:repeating-linear-gradient(90deg,#ef6e55 0 11px,#ffd359 11px 22px)}
    .coaster-swing-ride .chain{position:absolute;top:39px;width:2px;height:42px;background:#60483b;transform-origin:top center;animation:coasterSwing 2.2s ease-in-out infinite alternate}
    .coaster-swing-ride .chain:after{content:'';position:absolute;left:-7px;bottom:-6px;width:16px;height:9px;border-radius:3px;background:#3e78a7}
    .coaster-swing-ride .chain.c1{left:24px}.coaster-swing-ride .chain.c2{right:24px;animation-delay:-1.1s}
    @keyframes coasterSwing{from{transform:rotate(-13deg)}to{transform:rotate(13deg)}}

    .coaster-fireworks{position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden}
    .coaster-firework{position:absolute;width:8px;height:8px;transform:translate(-50%,-50%);opacity:1}
    .coaster-firework .core{position:absolute;left:50%;top:50%;width:12px;height:12px;border-radius:50%;transform:translate(-50%,-50%);background:var(--fw-core,#fff4a8);box-shadow:0 0 18px 8px var(--fw-glow,rgba(255,215,90,.7));animation:coasterFireCore 1.45s ease-out forwards}
    .coaster-firework .spark{position:absolute;left:50%;top:50%;width:5px;height:48px;border-radius:999px;background:linear-gradient(180deg,var(--fw-a,#fff),var(--fw-b,#ffbf3e),transparent);transform-origin:50% 0;animation:coasterSparkBurst 1.45s cubic-bezier(.12,.7,.24,1) forwards}
    @keyframes coasterFireCore{0%{opacity:0;transform:translate(-50%,-50%) scale(.2)}10%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}100%{opacity:0;transform:translate(-50%,-50%) scale(.2)}}
    @keyframes coasterSparkBurst{
      0%{opacity:0;transform:translate(-50%,-50%) rotate(var(--deg)) scaleY(.2)}
      12%{opacity:1}
      70%{opacity:.95;transform:translate(-50%,-50%) rotate(var(--deg)) translateY(-62px) scaleY(1)}
      100%{opacity:0;transform:translate(-50%,-50%) rotate(var(--deg)) translateY(-82px) scaleY(.65)}
    }

    @media(max-width:760px){
      .coaster-circus-tent{left:4%;bottom:13%;width:122px;height:94px}
      .coaster-circus-tent .tent-base{height:47px}.coaster-circus-tent .tent-roof{bottom:40px;height:44px}.coaster-circus-tent .tent-pole{bottom:78px}.coaster-circus-tent .tent-flag{bottom:91px}
      .coaster-ferris{right:4%;bottom:14%;width:112px;height:112px}
      .coaster-carousel{right:24%;bottom:13%;width:76px;height:70px}.coaster-carousel .horse{font-size:17px}
      .coaster-swing-ride{left:28%;bottom:14%;transform:scale(.78);transform-origin:bottom left}
    }
  `;
  document.head.appendChild(style);

  let currentScene = null;
  let fireworksLayer = null;
  let nextBurstAt = performance.now() + 2600;
  let raf = 0;

  function fairgroundMarkup() {
    return `
      <div class="coaster-fairground" aria-hidden="true">
        <div class="coaster-circus-tent">
          <div class="tent-base"></div><div class="tent-roof"></div><div class="tent-door"></div><div class="tent-pole"></div><div class="tent-flag"></div>
        </div>
        <div class="coaster-swing-ride"><div class="mast"></div><div class="canopy"></div><i class="chain c1"></i><i class="chain c2"></i></div>
        <div class="coaster-carousel"><div class="roof"></div><div class="topbar"></div><div class="pole"></div><span class="horse h1">🎠</span><span class="horse h2">🎠</span><div class="deck"></div></div>
        <div class="coaster-ferris"><div class="wheel"></div><div class="diag d1"></div><div class="diag d2"></div><div class="hub"></div><div class="stand"></div></div>
        <div class="coaster-fireworks"></div>
      </div>`;
  }

  function attachFairground(scene) {
    if (!scene || scene.querySelector('.coaster-fairground')) return;
    scene.insertAdjacentHTML('afterbegin', fairgroundMarkup());
    currentScene = scene;
    fireworksLayer = scene.querySelector('.coaster-fireworks');
    nextBurstAt = performance.now() + 2400 + Math.random() * 2600;
  }

  function spawnFirework(now, left, top, scale = 1) {
    if (!fireworksLayer?.isConnected) return;

    const palettes = [
      ['#fff3a0','#ffbf3d','rgba(255,187,49,.62)'],
      ['#ffd4ec','#ff5b9a','rgba(255,82,151,.58)'],
      ['#d6f7ff','#55c9ff','rgba(77,194,255,.58)'],
      ['#eadcff','#9b6dff','rgba(145,99,255,.58)'],
      ['#e0ffd9','#72d96a','rgba(101,213,95,.56)']
    ];
    const [a,b,glow] = palettes[Math.floor(Math.random() * palettes.length)];
    const firework = document.createElement('div');
    firework.className = 'coaster-firework';
    firework.style.left = `${left}%`;
    firework.style.top = `${top}%`;
    firework.style.setProperty('--fw-core', a);
    firework.style.setProperty('--fw-glow', glow);
    firework.style.transform = `translate(-50%,-50%) scale(${scale.toFixed(2)})`;

    const count = 18;
    let sparks = '<i class="core"></i>';
    for (let i = 0; i < count; i++) {
      const deg = (360 / count) * i + Math.random() * 4 - 2;
      sparks += `<i class="spark" style="--deg:${deg.toFixed(1)}deg;--fw-a:${a};--fw-b:${b};animation-delay:${(Math.random() * .06).toFixed(2)}s"></i>`;
    }
    firework.innerHTML = sparks;
    fireworksLayer.appendChild(firework);
    setTimeout(() => firework.remove(), 1700);
  }

  function spawnBurst(now) {
    if (!fireworksLayer?.isConnected) return;
    const firstLeft = 34 + Math.random() * 48;
    const firstTop = 13 + Math.random() * 24;
    spawnFirework(now, firstLeft, firstTop, 1.05 + Math.random() * .3);

    if (Math.random() < .58) {
      setTimeout(() => {
        if (!fireworksLayer?.isConnected) return;
        const secondLeft = Math.max(20, Math.min(86, firstLeft + (Math.random() < .5 ? -1 : 1) * (12 + Math.random() * 18)));
        const secondTop = 12 + Math.random() * 26;
        spawnFirework(performance.now(), secondLeft, secondTop, .92 + Math.random() * .24);
      }, 260 + Math.random() * 420);
    }

    nextBurstAt = now + 5200 + Math.random() * 5200;
  }

  function loop(now) {
    const scene = sceneLayer.querySelector('.coaster-scene');
    if (!scene) {
      currentScene = null;
      fireworksLayer = null;
      raf = requestAnimationFrame(loop);
      return;
    }

    if (scene !== currentScene || !scene.querySelector('.coaster-fairground')) attachFairground(scene);
    if (fireworksLayer && now >= nextBurstAt) spawnBurst(now);

    raf = requestAnimationFrame(loop);
  }

  const observer = new MutationObserver(() => {
    const scene = sceneLayer.querySelector('.coaster-scene');
    if (scene) attachFairground(scene);
  });
  observer.observe(sceneLayer, { childList:true, subtree:true });

  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(loop);
})();

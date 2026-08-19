(() => {
  'use strict';

  if (document.getElementById('coasterFairgroundStyleV3')) return;

  const sceneLayer = document.getElementById('sceneLayer');
  if (!sceneLayer) return;

  const style = document.createElement('style');
  style.id = 'coasterFairgroundStyleV3';
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
      position:absolute;left:7.2%;bottom:25.5%;width:168px;height:126px;
      transform:scale(.58);transform-origin:left bottom;
      opacity:.46;filter:brightness(.72) saturate(.62) contrast(.94) drop-shadow(0 2px 2px rgba(0,0,0,.10));
    }
    .coaster-circus-tent .tent-base{
      position:absolute;left:12px;right:12px;bottom:0;height:62px;
      background:repeating-linear-gradient(90deg,#ded2bd 0 18px,#9f5555 18px 36px);
      clip-path:polygon(5% 100%,14% 0,86% 0,95% 100%);
      border-radius:0 0 8px 8px;
    }
    .coaster-circus-tent .tent-roof{
      position:absolute;left:4px;right:4px;bottom:54px;height:58px;
      background:repeating-linear-gradient(90deg,#d8c59a 0 18px,#934b52 18px 36px);
      clip-path:polygon(50% 0,100% 100%,0 100%);
    }
    .coaster-circus-tent .tent-door{
      position:absolute;left:50%;bottom:0;width:38px;height:42px;transform:translateX(-50%);
      background:#49383a;border-radius:50% 50% 0 0;
    }
    .coaster-circus-tent .tent-pole{
      position:absolute;left:50%;bottom:106px;width:4px;height:23px;transform:translateX(-50%);background:#665740;
    }
    .coaster-circus-tent .tent-flag{
      position:absolute;left:50%;bottom:119px;width:27px;height:14px;transform:translateX(2px);
      background:#aa9c62;clip-path:polygon(0 0,100% 50%,0 100%);
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

    .coaster-birds{position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden}
    .coaster-bird{
      position:absolute;left:-8%;width:26px;height:14px;opacity:.52;
      animation:coasterBirdCross var(--bird-duration,18s) linear infinite;
      animation-delay:var(--bird-delay,0s);
      transform:scale(var(--bird-scale,1));
    }
    .coaster-bird:before,.coaster-bird:after{
      content:'';position:absolute;top:6px;width:14px;height:7px;
      border-top:2px solid rgba(55,67,79,.88);border-radius:50%;
    }
    .coaster-bird:before{left:0;transform-origin:right center;animation:coasterWingLeft .72s ease-in-out infinite alternate}
    .coaster-bird:after{right:0;transform-origin:left center;animation:coasterWingRight .72s ease-in-out infinite alternate}
    .coaster-bird.b1{top:15%;--bird-duration:19s;--bird-delay:-4s;--bird-scale:.82}
    .coaster-bird.b2{top:22%;--bird-duration:23s;--bird-delay:-14s;--bird-scale:.65}
    .coaster-bird.b3{top:10%;--bird-duration:27s;--bird-delay:-9s;--bird-scale:.55}
    .coaster-bird.b4{top:28%;--bird-duration:21s;--bird-delay:-17s;--bird-scale:.72}
    .coaster-bird.b5{top:18%;--bird-duration:25s;--bird-delay:-21s;--bird-scale:.48}
    @keyframes coasterBirdCross{
      0%{left:-8%;transform:translateY(0) scale(var(--bird-scale,1));opacity:0}
      6%{opacity:.52}
      48%{transform:translateY(-9px) scale(var(--bird-scale,1))}
      94%{opacity:.52}
      100%{left:108%;transform:translateY(3px) scale(var(--bird-scale,1));opacity:0}
    }
    @keyframes coasterWingLeft{from{transform:rotate(-12deg)}to{transform:rotate(-34deg)}}
    @keyframes coasterWingRight{from{transform:rotate(12deg)}to{transform:rotate(34deg)}}

    .coaster-fireworks{position:absolute;inset:0;z-index:4;pointer-events:none;overflow:hidden}
    .coaster-firework{position:absolute;width:8px;height:8px;transform:translate(-50%,-50%);opacity:1}
    .coaster-firework .core{
      position:absolute;left:50%;top:50%;width:13px;height:13px;border-radius:50%;transform:translate(-50%,-50%);
      background:var(--fw-core,#fff4a8);box-shadow:0 0 20px 9px var(--fw-glow,rgba(255,215,90,.7));
      animation:coasterFireCore 2.8s ease-out forwards;
    }
    .coaster-firework .spark{
      position:absolute;left:50%;top:50%;width:5px;height:56px;border-radius:999px;
      background:linear-gradient(180deg,var(--fw-a,#fff),var(--fw-b,#ffbf3e),transparent);
      transform-origin:50% 0;animation:coasterSparkBurst 2.8s cubic-bezier(.12,.7,.24,1) forwards;
    }
    @keyframes coasterFireCore{
      0%{opacity:0;transform:translate(-50%,-50%) scale(.2)}
      8%{opacity:1;transform:translate(-50%,-50%) scale(1.15)}
      68%{opacity:1;transform:translate(-50%,-50%) scale(.95)}
      84%{opacity:.72;transform:translate(-50%,-50%) scale(.7)}
      100%{opacity:0;transform:translate(-50%,-50%) scale(.25)}
    }
    @keyframes coasterSparkBurst{
      0%{opacity:0;transform:translate(-50%,-50%) rotate(var(--deg)) scaleY(.2)}
      8%{opacity:1}
      62%{opacity:1;transform:translate(-50%,-50%) rotate(var(--deg)) translateY(-70px) scaleY(1)}
      84%{opacity:.68;transform:translate(-50%,-50%) rotate(var(--deg)) translateY(-88px) scaleY(.9)}
      100%{opacity:0;transform:translate(-50%,-50%) rotate(var(--deg)) translateY(-102px) scaleY(.62)}
    }

    @media(max-width:760px){
      .coaster-circus-tent{left:4%;bottom:24.5%;width:122px;height:94px;transform:scale(.64);transform-origin:left bottom}
      .coaster-circus-tent .tent-base{height:47px}.coaster-circus-tent .tent-roof{bottom:40px;height:44px}.coaster-circus-tent .tent-pole{bottom:78px}.coaster-circus-tent .tent-flag{bottom:91px}
      .coaster-ferris{right:4%;bottom:14%;width:112px;height:112px}
      .coaster-carousel{right:24%;bottom:13%;width:76px;height:70px}.coaster-carousel .horse{font-size:17px}
      .coaster-swing-ride{left:28%;bottom:14%;transform:scale(.78);transform-origin:bottom left}
      .coaster-bird{width:22px;height:12px;opacity:.48}
      .coaster-bird:before,.coaster-bird:after{width:12px;height:6px}
    }
  `;
  document.head.appendChild(style);

  let currentScene = null;
  let fireworksLayer = null;
  let nextBurstAt = performance.now() + 2200;
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
        <div class="coaster-birds">
          <i class="coaster-bird b1"></i><i class="coaster-bird b2"></i><i class="coaster-bird b3"></i><i class="coaster-bird b4"></i><i class="coaster-bird b5"></i>
        </div>
        <div class="coaster-fireworks"></div>
      </div>`;
  }

  function attachFairground(scene) {
    if (!scene || scene.querySelector('.coaster-fairground')) return;
    scene.insertAdjacentHTML('afterbegin', fairgroundMarkup());
    currentScene = scene;
    fireworksLayer = scene.querySelector('.coaster-fireworks');
    nextBurstAt = performance.now() + 2000 + Math.random() * 2200;
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

    const count = 20;
    let sparks = '<i class="core"></i>';
    for (let i = 0; i < count; i++) {
      const deg = (360 / count) * i + Math.random() * 5 - 2.5;
      sparks += `<i class="spark" style="--deg:${deg.toFixed(1)}deg;--fw-a:${a};--fw-b:${b};animation-delay:${(Math.random() * .10).toFixed(2)}s"></i>`;
    }
    firework.innerHTML = sparks;
    fireworksLayer.appendChild(firework);
    setTimeout(() => firework.remove(), 3400);
  }

  function spawnBurst(now) {
    if (!fireworksLayer?.isConnected) return;
    const firstLeft = 34 + Math.random() * 48;
    const firstTop = 12 + Math.random() * 24;
    spawnFirework(now, firstLeft, firstTop, 1.05 + Math.random() * .3);

    if (Math.random() < .68) {
      setTimeout(() => {
        if (!fireworksLayer?.isConnected) return;
        const secondLeft = Math.max(20, Math.min(86, firstLeft + (Math.random() < .5 ? -1 : 1) * (12 + Math.random() * 18)));
        const secondTop = 11 + Math.random() * 25;
        spawnFirework(performance.now(), secondLeft, secondTop, .92 + Math.random() * .24);
      }, 520 + Math.random() * 480);
    }

    nextBurstAt = now + 6000 + Math.random() * 4500;
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
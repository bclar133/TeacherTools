(() => {
  'use strict';

  const rocketTheme = document.querySelector('.theme-rocket');
  const track = rocketTheme?.querySelector('.rocket-track');
  const moon = rocketTheme?.querySelector('.moon');
  const rocket = document.getElementById('rocketVisual');
  const levelNumber = document.getElementById('levelNumber');
  const loudThreshold = document.getElementById('loudThreshold');

  if (!rocketTheme || !track || !moon || !rocket || !levelNumber || !loudThreshold) return;

  const clamp01 = (value) => Math.max(0, Math.min(1, value));

  function installRocketSky() {
    const starsHost = rocketTheme.querySelector('.space-stars');
    if (!starsHost || starsHost.dataset.randomised === 'true') return;
    starsHost.dataset.randomised = 'true';

    const style = document.createElement('style');
    style.id = 'rocketRandomSkyStyles';
    style.textContent = `
      .theme-rocket{position:relative;overflow:hidden;isolation:isolate}
      .theme-rocket .space-stars{position:absolute;inset:0;z-index:0!important;background:none!important;background-image:none!important;opacity:1!important;pointer-events:none}
      .rocket-random-star{position:absolute;border-radius:50%;background:#fff;opacity:var(--star-opacity,.7);box-shadow:0 0 var(--star-glow,5px) rgba(218,231,255,.88);animation:rocketRandomTwinkle var(--star-duration,4s) ease-in-out infinite;animation-delay:var(--star-delay,0s);will-change:transform,opacity}
      @keyframes rocketRandomTwinkle{0%,100%{transform:scale(.72);opacity:var(--star-dim,.35)}50%{transform:scale(1.28);opacity:var(--star-bright,.96)}}
      .rocket-planet{position:absolute;z-index:0;border-radius:50%;opacity:1;pointer-events:none;box-shadow:inset -13px -17px 19px rgba(0,0,0,.22),0 12px 28px rgba(0,0,0,.22)}
      .rocket-planet-one{width:76px;height:76px;left:8%;top:23%;background:radial-gradient(circle at 31% 29%,rgba(255,255,255,.24) 0 9%,transparent 10%),radial-gradient(circle at 66% 60%,rgba(35,43,84,.34) 0 8%,transparent 9%),linear-gradient(135deg,#748bd0,#455b9b 72%)}
      .rocket-planet-two{width:54px;height:54px;right:16%;bottom:16%;background:radial-gradient(circle at 62% 31%,rgba(255,255,255,.2) 0 9%,transparent 10%),linear-gradient(135deg,#c58b55,#81513b 72%)}
      .rocket-planet-two::after{content:"";position:absolute;left:-12px;right:-12px;top:20px;height:13px;border:3px solid #d7c29d;border-radius:50%;transform:rotate(-17deg);box-shadow:0 1px 0 rgba(0,0,0,.15)}
      .theme-rocket .rocket-track{z-index:20!important;pointer-events:none}
      .theme-rocket .rocket-track .moon{z-index:22!important}
      .theme-rocket .rocket-track .rocket{z-index:23!important}
      .theme-rocket .rocket-track .launch-pad{z-index:21!important}
      .theme-rocket .challenge-label{position:absolute;z-index:24!important}
    `;
    document.head.appendChild(style);

    starsHost.textContent = '';
    const starCount = 155;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < starCount; i += 1) {
      const star = document.createElement('span');
      star.className = 'rocket-random-star';

      const size = 0.8 + Math.random() * 2.8;
      const baseOpacity = 0.28 + Math.random() * 0.67;
      const dimOpacity = Math.max(0.12, baseOpacity * (0.42 + Math.random() * 0.22));
      const brightOpacity = Math.min(1, baseOpacity + 0.18 + Math.random() * 0.22);
      const glow = 1.5 + size * (1.2 + Math.random() * 1.7);
      const duration = 2.2 + Math.random() * 5.8;
      const delay = -Math.random() * duration;

      star.style.left = `${(1 + Math.random() * 98).toFixed(2)}%`;
      star.style.top = `${(1 + Math.random() * 98).toFixed(2)}%`;
      star.style.width = `${size.toFixed(2)}px`;
      star.style.height = `${size.toFixed(2)}px`;
      star.style.setProperty('--star-opacity', baseOpacity.toFixed(2));
      star.style.setProperty('--star-dim', dimOpacity.toFixed(2));
      star.style.setProperty('--star-bright', brightOpacity.toFixed(2));
      star.style.setProperty('--star-glow', `${glow.toFixed(2)}px`);
      star.style.setProperty('--star-duration', `${duration.toFixed(2)}s`);
      star.style.setProperty('--star-delay', `${delay.toFixed(2)}s`);
      fragment.appendChild(star);
    }

    starsHost.appendChild(fragment);

    const planetOne = document.createElement('div');
    planetOne.className = 'rocket-planet rocket-planet-one';
    planetOne.setAttribute('aria-hidden', 'true');

    const planetTwo = document.createElement('div');
    planetTwo.className = 'rocket-planet rocket-planet-two';
    planetTwo.setAttribute('aria-hidden', 'true');

    /* Keep every decorative sky element inside the dedicated background layer. */
    starsHost.append(planetOne, planetTwo);
  }

  function positionRocket() {
    if (rocketTheme.hidden || track.clientWidth <= 0 || track.clientHeight <= 0) {
      requestAnimationFrame(positionRocket);
      return;
    }

    const level = Math.max(0, Math.min(100, Number(levelNumber.textContent) || 0));
    const loud = Math.max(1, Number(loudThreshold.value) || 68);

    // Reaching the Too Loud threshold means the rocket has reached the moon.
    const progress = clamp01(level / loud);
    const angle = 46 * progress;
    const angleRad = angle * Math.PI / 180;

    const startCenterX = rocket.offsetLeft + rocket.offsetWidth / 2;
    const startCenterY = rocket.offsetTop + rocket.offsetHeight / 2;

    // Aim the rocket nose at the moon's lower-left edge, where the approach looks natural.
    const moonHitX = moon.offsetLeft + moon.offsetWidth * 0.34;
    const moonHitY = moon.offsetTop + moon.offsetHeight * 0.72;

    // The nose extends above the rocket body; account for rotation so the tip, not the body, meets the moon.
    const noseLength = rocket.offsetHeight / 2 + 42;
    const noseVectorX = Math.sin(angleRad) * noseLength;
    const noseVectorY = -Math.cos(angleRad) * noseLength;
    const endCenterX = moonHitX - noseVectorX;
    const endCenterY = moonHitY - noseVectorY;

    const endX = endCenterX - startCenterX;
    const endY = endCenterY - startCenterY;
    const arcHeight = Math.min(70, track.clientHeight * 0.11);

    const x = endX * progress;
    const y = endY * progress - Math.sin(Math.PI * progress) * arcHeight;

    rocket.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${angle.toFixed(2)}deg)`;
    rocket.style.setProperty('--flame-scale', (0.35 + progress * 1.2).toFixed(2));

    requestAnimationFrame(positionRocket);
  }

  installRocketSky();
  requestAnimationFrame(positionRocket);
})();

/* Load later visual enhancement modules after the core/manual renderers are running. */
(() => {
  function loadStyle(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function loadScript(src) {
    if (document.querySelector(`script[src="${src}"]`)) return;
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    document.body.appendChild(script);
  }

  loadStyle('pressure-upgrade.css');
  loadScript('pressure-upgrade.js');
  loadScript('equaliser-upgrade.js');
})();

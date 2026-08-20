(() => {
  'use strict';

  if (document.getElementById('snowmanDropPhysicsStyleV1')) return;

  const sceneLayer = document.getElementById('sceneLayer');
  const stageStatus = document.getElementById('stageStatus');
  const display = document.getElementById('countdownDisplay');
  const minutesInput = document.getElementById('countdownMinutes');
  const secondsInput = document.getElementById('countdownSeconds');
  if (!sceneLayer || !display) return;

  const style = document.createElement('style');
  style.id = 'snowmanDropPhysicsStyleV1';
  style.textContent = `
    .xt-snowman .snow2-eye,
    .xt-snowman .snow2-nose,
    .xt-snowman .snow2-hat {
      will-change:left,top,transform;
    }
  `;
  document.head.appendChild(style);

  const clamp = (v,min,max) => Math.max(min,Math.min(max,v));
  const lerp = (a,b,t) => a + (b-a)*t;
  const smooth = t => t*t*(3-2*t);

  let displayedRemaining = null;
  let displayChangedAt = performance.now();
  let lastStatus = '';
  let lastScene = null;
  let dropState = null;
  let raf = 0;

  function parseRemaining(){
    const parts = display.textContent.trim().split(':').map(Number);
    if (parts.some(v => !Number.isFinite(v))) return null;
    if (parts.length === 2) return parts[0]*60 + parts[1];
    if (parts.length === 3) return parts[0]*3600 + parts[1]*60 + parts[2];
    return null;
  }

  function totalSeconds(){
    return Math.max(1,(Number(minutesInput?.value)||0)*60 + (Number(secondsInput?.value)||0));
  }

  function progressNow(now){
    const current = parseRemaining();
    if (current === null) return 0;
    const status = stageStatus?.textContent.trim() || '';
    const running = status === 'Running';
    if (displayedRemaining === null || current !== displayedRemaining || status !== lastStatus){
      displayedRemaining = current;
      displayChangedAt = now;
      lastStatus = status;
    }
    let estimated = current;
    if (running && current > 0) estimated = Math.max(0,current - (now-displayChangedAt)/1000);
    return clamp(1 - estimated/totalSeconds(),0,1);
  }

  function position(el,x,y,angle=0,scale=1){
    if(!el) return;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.transform = `translate(-50%,-50%) rotate(${angle}deg) scale(${scale})`;
  }

  function positionNose(el,x,y,angle=-8){
    if(!el) return;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.transform = `translate(0,-50%) rotate(${angle}deg)`;
  }

  function makeState(){
    return {
      eye1Origin:null,
      eye2Origin:null,
      noseOrigin:null,
      hatOrigin:null
    };
  }

  function render(scene,p){
    const figure = scene.querySelector('.snow2-figure');
    if(!figure) return;

    const head = figure.querySelector('.snow2-head');
    const eye1 = figure.querySelector('.snow2-eye-left');
    const eye2 = figure.querySelector('.snow2-eye-right');
    const nose = figure.querySelector('.snow2-nose');
    const hat = figure.querySelector('.snow2-hat');
    if(!head || !eye1 || !eye2 || !nose || !hat) return;

    const hx = Number.parseFloat(head.style.left) || 220;
    const hy = Number.parseFloat(head.style.top) || 100;

    const eye1Attached = {x:hx-19,y:hy-4};
    const eye2Attached = {x:hx+19,y:hy-4};
    const noseAttached = {x:hx+3,y:hy+8};
    const hatAttached = {x:hx,y:hy-76};

    // Cancel the older separate translate/rotate overrides and own the hat's full motion here.
    hat.style.setProperty('translate','0 0','important');
    hat.style.setProperty('rotate','0deg','important');

    if (p < .82) {
      dropState.eye1Origin = eye1Attached;
      dropState.eye2Origin = eye2Attached;
      dropState.noseOrigin = noseAttached;
      position(eye1,eye1Attached.x,eye1Attached.y,0);
      position(eye2,eye2Attached.x,eye2Attached.y,0);
      // Keep the carrot's base anchored to the face, as in the original snowman,
      // with a slight downward tilt rather than centring the whole carrot on the anchor.
      positionNose(nose,noseAttached.x,noseAttached.y,-8);
    }

    if (p < .88) {
      dropState.hatOrigin = hatAttached;
      position(hat,hatAttached.x,hatAttached.y,-5);
    }

    // Eyes: natural gravity fall, tiny bounce, then roll away along the snow.
    if (p >= .82) {
      const leftOrigin = dropState.eye1Origin || eye1Attached;
      const rightOrigin = dropState.eye2Origin || eye2Attached;
      const fall = clamp((p-.82)/.09,0,1);
      const g = fall*fall;

      const leftFallX = lerp(leftOrigin.x,leftOrigin.x-13,smooth(fall));
      const rightFallX = lerp(rightOrigin.x,rightOrigin.x+13,smooth(fall));
      const leftFallY = lerp(leftOrigin.y,430,g);
      const rightFallY = lerp(rightOrigin.y,430,g);

      if (p < .91) {
        position(eye1,leftFallX,leftFallY,-390*fall);
        position(eye2,rightFallX,rightFallY,390*fall);
      } else {
        const roll = clamp((p-.91)/.09,0,1);
        const r = smooth(roll);
        const bounce = Math.abs(Math.sin(roll*Math.PI*3))*7*(1-roll);
        position(eye1,leftFallX-64*r,430-bounce,-390-760*r);
        position(eye2,rightFallX+58*r,430-bounce,390+720*r);
      }
    }

    // Carrot: starts in the original face position with a slight downward angle,
    // then drops a fraction later, tips nose-first and settles on the ground.
    if (p >= .84) {
      const origin = dropState.noseOrigin || noseAttached;
      const fall = clamp((p-.84)/.11,0,1);
      const g = fall*fall;
      const x = lerp(origin.x,origin.x+48,smooth(fall));
      const y = lerp(origin.y,423,g);
      const angle = lerp(-8,112,smooth(fall));
      positionNose(nose,x,y,angle);
    }

    // Hat: remains visually attached until its own drop starts, then falls continuously
    // to a position where the rotated brim actually touches the ground.
    if (p >= .88) {
      const origin = dropState.hatOrigin || hatAttached;
      const fall = clamp((p-.88)/.12,0,1);
      const g = fall*fall;
      const drift = smooth(fall);
      const x = lerp(origin.x,origin.x+92,drift);
      const y = lerp(origin.y,357,g);
      const angle = lerp(-5,78,drift);
      position(hat,x,y,angle);
    }
  }

  function loop(now){
    const scene = sceneLayer.querySelector('.xt-snowman.snowman-upgraded');
    if(scene !== lastScene){
      lastScene = scene || null;
      dropState = makeState();
      displayedRemaining = null;
    }

    if(scene){
      const p = progressNow(now);
      if(p < .01 && lastStatus !== 'Running') dropState = makeState();
      render(scene,p);
    }

    raf = requestAnimationFrame(loop);
  }

  dropState = makeState();
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(loop);
})();
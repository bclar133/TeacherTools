(() => {
  'use strict';

  const sceneLayer = document.getElementById('sceneLayer');
  const stageStatus = document.getElementById('stageStatus');
  const display = document.getElementById('countdownDisplay');
  const minutesInput = document.getElementById('countdownMinutes');
  const secondsInput = document.getElementById('countdownSeconds');
  if (!sceneLayer || !display) return;

  const clamp = (v,min,max) => Math.max(min,Math.min(max,v));
  const lerp = (a,b,t) => a + (b-a)*t;
  const ease = t => t*t*(3-2*t);

  let displayedRemaining = null;
  let displayChangedAt = performance.now();
  let lastStatus = '';
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

  function setBall(el,x,y,sx,sy){
    if(!el) return;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.transform = `translate(-50%,-50%) scale(${sx},${sy})`;
  }

  function setAccessory(el,x,y,rotation,scale=1){
    if(!el) return;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.transform = `translate(-50%,-50%) rotate(${rotation}deg) scale(${scale})`;
  }

  function render(scene,p){
    const figure = scene.querySelector('.snow2-figure');
    if(!figure) return;

    const bottom = figure.querySelector('.snow2-bottom');
    const middle = figure.querySelector('.snow2-middle');
    const head = figure.querySelector('.snow2-head');
    const leftArm = figure.querySelector('.snow2-arm-left');
    const rightArm = figure.querySelector('.snow2-arm-right');
    const leftEye = figure.querySelector('.snow2-eye-left');
    const rightEye = figure.querySelector('.snow2-eye-right');
    const nose = figure.querySelector('.snow2-nose');
    const hat = figure.querySelector('.snow2-hat');

    // Ready state: all three snowballs are centred and tangent.
    const bottomStart = {x:220,y:364};
    const middleStart = {x:220,y:201.5};
    const headStart = {x:220,y:73};

    // Separation starts only once countdown progress begins, then develops slowly.
    const separate = ease(clamp(p/.85,0,1));

    const bSX = lerp(1,.86,p), bSY = lerp(1,.34,p);
    const mSX = lerp(1,.68,p), mSY = lerp(1,.25,p);
    const hSX = lerp(1,.58,p), hSY = lerp(1,.22,p);

    const bottomTarget = {x:225,y:437-90*bSY};
    const middleTarget = {x:145,y:437-72.5*mSY};
    const headTarget = {x:292,y:437-56*hSY};

    const bx = lerp(bottomStart.x,bottomTarget.x,separate);
    const by = lerp(bottomStart.y,bottomTarget.y,separate);
    const mx = lerp(middleStart.x,middleTarget.x,separate);
    const my = lerp(middleStart.y,middleTarget.y,separate);
    const hx = lerp(headStart.x,headTarget.x,separate);
    const hy = lerp(headStart.y,headTarget.y,separate);

    setBall(bottom,bx,by,bSX,bSY);
    setBall(middle,mx,my,mSX,mSY);
    setBall(head,hx,hy,hSX,hSY);

    const midDX = mx-middleStart.x, midDY = my-middleStart.y;
    const headDX = hx-headStart.x, headDY = hy-headStart.y;

    const armDrop = ease(clamp((p-.75)/.10,0,1));
    const leftArmFollow = {x:150+midDX,y:197.5+midDY};
    const rightArmFollow = {x:277+midDX,y:197.5+midDY};
    if(leftArm){
      leftArm.style.left=`${lerp(leftArmFollow.x,72,armDrop)}px`;
      leftArm.style.top=`${lerp(leftArmFollow.y,424,armDrop)}px`;
      leftArm.style.transform=`rotate(${lerp(202,338,armDrop)}deg)`;
    }
    if(rightArm){
      rightArm.style.left=`${lerp(rightArmFollow.x,310,armDrop)}px`;
      rightArm.style.top=`${lerp(rightArmFollow.y,425,armDrop)}px`;
      rightArm.style.transform=`rotate(${lerp(-22,26,armDrop)}deg)`;
    }

    const faceDrop = ease(clamp((p-.82)/.10,0,1));
    const e1Follow = {x:201+headDX,y:69+headDY};
    const e2Follow = {x:239+headDX,y:69+headDY};
    const noseFollow = {x:224+headDX,y:81+headDY};
    setAccessory(leftEye,lerp(e1Follow.x,205,faceDrop),lerp(e1Follow.y,430,faceDrop),lerp(0,-125,faceDrop),1);
    setAccessory(rightEye,lerp(e2Follow.x,255,faceDrop),lerp(e2Follow.y,431,faceDrop),lerp(0,118,faceDrop),1);
    if(nose){
      nose.style.left=`${lerp(noseFollow.x,286,faceDrop)}px`;
      nose.style.top=`${lerp(noseFollow.y,423,faceDrop)}px`;
      nose.style.transform=`translate(0,-50%) rotate(${lerp(0,103,faceDrop)}deg)`;
    }

    const hatDrop = ease(clamp((p-.88)/.12,0,1));
    const hatFollow = {x:220+headDX,y:15+headDY};
    if(hat){
      hat.style.left=`${lerp(hatFollow.x,325,hatDrop)}px`;
      hat.style.top=`${lerp(hatFollow.y,375,hatDrop)}px`;
      hat.style.transform=`translate(-50%,-50%) rotate(${lerp(0,78,hatDrop)}deg)`;
    }
  }

  function loop(now){
    const scene = sceneLayer.querySelector('.xt-snowman.snowman-upgraded');
    if(scene) render(scene,progressNow(now));
    else displayedRemaining = null;
    raf = requestAnimationFrame(loop);
  }

  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(loop);
})();

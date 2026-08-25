(() => {
  'use strict';

  if (window.__pacmanUpgradeV12) return;
  window.__pacmanUpgradeV12 = true;

  const sceneLayer = document.getElementById('sceneLayer');
  const stageStatus = document.getElementById('stageStatus');
  const display = document.getElementById('countdownDisplay');
  const minutesInput = document.getElementById('countdownMinutes');
  const secondsInput = document.getElementById('countdownSeconds');
  if (!sceneLayer || !display) return;

  ['pacmanUpgradeStyleV4','pacmanUpgradeStyleV5','pacmanUpgradeStyleV6','pacmanUpgradeStyleV7','pacmanUpgradeStyleV8','pacmanUpgradeStyleV9','pacmanUpgradeStyleV10','pacmanUpgradeStyleV11','pacmanUpgradeStyleV12']
    .forEach(id => document.getElementById(id)?.remove());

  const style = document.createElement('style');
  style.id = 'pacmanUpgradeStyleV12';
  style.textContent = `
    #countdownStage.theme-pacman .time-display-wrap{
      position:absolute!important;left:2.2%!important;right:auto!important;top:1.8%!important;bottom:auto!important;
      transform:none!important;width:auto!important;max-width:32%!important;z-index:40!important;justify-items:start!important;text-align:left!important
    }
    #countdownStage.theme-pacman #countdownDisplay,#countdownStage.theme-pacman .time-display{
      font-family:"Courier New",Courier,monospace!important;font-size:clamp(2.15rem,4.9vw,4.1rem)!important;
      line-height:.92!important;font-weight:700!important;font-variant-numeric:tabular-nums!important;letter-spacing:.01em!important;
      padding:.15em .24em!important;width:auto!important;min-width:0!important;white-space:nowrap!important
    }
    #countdownStage.theme-pacman .timer-message{font-family:"Courier New",Courier,monospace!important}

    .xt-pacman.pac10-upgraded{background:#000!important;overflow:hidden!important}
    .pac10-score{
      position:absolute;right:5%;top:3%;color:#fff;z-index:3;opacity:.9;
      font:700 clamp(.62rem,1.2vw,.96rem)/1.05 "Courier New",Courier,monospace;letter-spacing:.08em;text-align:center;pointer-events:none
    }
    .pac10-score strong{display:block;margin-top:.25rem;font-size:1.15em}

    .pac10-board{
      position:absolute;left:6%;right:4%;top:17%;bottom:4.5%;background:#000;border:5px solid #214dff;border-radius:16px;
      box-shadow:0 0 13px rgba(49,82,255,.48),inset 0 0 0 2px #0b173b;overflow:hidden;z-index:2
    }
    .pac10-maze,.pac10-pellets,.pac10-actors{position:absolute;inset:0;width:100%;height:100%}
    .pac10-pellets,.pac10-actors{pointer-events:none}

    .pac10-maze-fill{
      fill:#2352ff;
      filter:drop-shadow(0 0 5px rgba(45,82,255,.5));
    }
    .pac10-corridor{
      fill:none;stroke:#000;stroke-width:52;stroke-linecap:round;stroke-linejoin:round;
    }

    .pac10-pellet{
      position:absolute;width:6px;height:6px;border-radius:50%;transform:translate(-50%,-50%);background:#ffe2a7;
      box-shadow:0 0 5px rgba(255,226,167,.5);transition:opacity .08s linear
    }
    .pac10-pellet.power{width:14px;height:14px;background:#fff1cf;box-shadow:0 0 9px rgba(255,241,207,.82);animation:pac10Power .7s steps(2,end) infinite}
    .pac10-pellet.eaten{opacity:0}
    @keyframes pac10Power{50%{opacity:.3}}

    .pac10-player{
      position:absolute;width:30px;height:30px;border-radius:50%;transform:translate(-50%,-50%);
      transform-origin:50% 50%;background:#ffda18;z-index:9;filter:drop-shadow(0 0 6px rgba(255,218,24,.35));
      clip-path:polygon(100% 0,100% var(--mouth-top,33%),56% 50%,100% var(--mouth-bottom,67%),100% 100%,0 100%,0 0);
      will-change:left,top,transform
    }
    .pac10-player::after{content:'';position:absolute;width:3px;height:3px;border-radius:50%;background:#151515;right:7px;top:6px}

    .pac10-ghost{
      position:absolute;width:26px;height:26px;transform:translate(-50%,-50%);z-index:8;opacity:0;
      filter:drop-shadow(0 2px 2px rgba(0,0,0,.45));transition:opacity .25s ease;will-change:left,top
    }
    .pac10-ghost.show{opacity:1}
    .pac10-ghost-body{
      position:absolute;inset:0;border-radius:50% 50% 12% 12% / 54% 54% 18% 18%;background:#ff5b57;
      clip-path:polygon(0 0,100% 0,100% 86%,86% 100%,70% 86%,54% 100%,38% 86%,22% 100%,8% 86%,0 92%)
    }
    .pac10-eye{position:absolute;top:8px;width:6px;height:8px;border-radius:50%;background:#fff;z-index:2}
    .pac10-eye.e1{left:5px}.pac10-eye.e2{right:5px}
    .pac10-eye::after{content:'';position:absolute;width:3px;height:3px;border-radius:50%;background:#1739a8;left:2px;top:3px}

    .pac10-ready,.pac10-clear{
      position:absolute;left:50%;transform:translate(-50%,-50%);font-family:"Courier New",Courier,monospace;font-weight:900;
      letter-spacing:.09em;pointer-events:none;z-index:12;text-align:center
    }
    .pac10-ready{top:50%;color:#ffe12c;font-size:clamp(.9rem,1.8vw,1.4rem)}
    .pac10-clear{
      top:50%;color:#ffe12c;font-size:clamp(1.9rem,4.7vw,3.8rem);opacity:0;
      text-shadow:0 0 12px rgba(255,225,44,.55);transition:opacity .22s ease,transform .22s ease
    }
    .pac10-finished .pac10-clear{opacity:.98;transform:translate(-50%,-50%) scale(1)}

    @media(max-width:760px){
      #countdownStage.theme-pacman .time-display-wrap{left:2%!important;top:1.4%!important;max-width:40%!important}
      #countdownStage.theme-pacman #countdownDisplay,#countdownStage.theme-pacman .time-display{font-size:clamp(1.8rem,8vw,3rem)!important}
      .pac10-board{left:3%;right:2%;top:20%;bottom:3%}
      .pac10-player{width:27px;height:27px}.pac10-ghost{width:23px;height:23px}
      .pac10-pellet{width:5px;height:5px}.pac10-pellet.power{width:11px;height:11px}
      .pac10-corridor{stroke-width:46}
    }
  `;
  document.head.appendChild(style);

  const POINTS=[
    {x:90,y:70},{x:910,y:70},{x:910,y:530},{x:90,y:530},
    {x:90,y:170},{x:810,y:170},{x:810,y:430},{x:190,y:430},
    {x:190,y:270},{x:710,y:270},{x:710,y:330},{x:290,y:330},
    {x:500,y:330}
  ];
  const PATH_D=POINTS.map((p,i)=>`${i?'L':'M'} ${p.x} ${p.y}`).join(' ');
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const lerp=(a,b,t)=>a+(b-a)*t;

  function routeData(points){
    const segments=[];let total=0;
    for(let i=0;i<points.length-1;i++){
      const a=points[i],b=points[i+1],len=Math.hypot(b.x-a.x,b.y-a.y);
      segments.push({a,b,len,angle:Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI});total+=len;
    }
    return{points,segments,total};
  }
  const ROUTE=routeData(POINTS);

  function pointAtDistance(dist){
    dist=clamp(dist,0,ROUTE.total);let acc=0;
    for(const seg of ROUTE.segments){
      if(dist<=acc+seg.len||seg===ROUTE.segments[ROUTE.segments.length-1]){
        const u=seg.len?clamp((dist-acc)/seg.len,0,1):0;
        return{x:lerp(seg.a.x,seg.b.x,u),y:lerp(seg.a.y,seg.b.y,u),angle:seg.angle};
      }
      acc+=seg.len;
    }
    const last=ROUTE.segments[ROUTE.segments.length-1];
    return{x:last.b.x,y:last.b.y,angle:last.angle};
  }
  function pointAlong(t){return pointAtDistance(clamp(t,0,1)*ROUTE.total)}
  const pct=p=>({x:p.x/10,y:p.y/6});

  function pacmanTransformForAngle(angle){
    const a=((angle%360)+360)%360;
    if(a<45||a>=315)return 'translate(-50%,-50%)';
    if(a<135)return 'translate(-50%,-50%) rotate(90deg)';
    if(a<225)return 'translate(-50%,-50%) scaleX(-1)';
    return 'translate(-50%,-50%) rotate(-90deg)';
  }

  const PELLET_COUNT=92;
  const PELLETS=Array.from({length:PELLET_COUNT},(_,i)=>{
    const t=i/(PELLET_COUNT-1),p=pointAlong(t);
    return{t,x:p.x/10,y:p.y/6,power:i===0||i===30||i===61||i===PELLET_COUNT-1};
  });

  let displayedRemaining=null,displayChangedAt=performance.now(),lastStatus='',state=null,raf=0;

  function parseRemaining(){
    const parts=display.textContent.trim().split(':').map(Number);
    if(parts.some(v=>!Number.isFinite(v)))return null;
    if(parts.length===2)return parts[0]*60+parts[1];
    if(parts.length===3)return parts[0]*3600+parts[1]*60+parts[2];
    return null;
  }
  function totalSeconds(){return Math.max(1,(Number(minutesInput?.value)||0)*60+(Number(secondsInput?.value)||0))}
  function progressNow(now){
    const current=parseRemaining();
    if(current===null)return state?.lastProgress??0;
    const total=totalSeconds(),status=(stageStatus?.textContent.trim()||'').toLowerCase();
    const paused=status.includes('pause');
    const running=!paused&&current>0&&(status.includes('running')||current<total);
    if(displayedRemaining===null||current!==displayedRemaining||status!==lastStatus){
      displayedRemaining=current;displayChangedAt=now;lastStatus=status;
    }
    let estimated=current;
    if(running)estimated=Math.max(0,current-(now-displayChangedAt)/1000);
    return clamp(1-estimated/total,0,1);
  }

  function ghostMarkup(){return `<div class="pac10-ghost"><div class="pac10-ghost-body"></div><i class="pac10-eye e1"></i><i class="pac10-eye e2"></i></div>`}

  function buildScene(){
    const pellets=PELLETS.map((p,i)=>`<i class="pac10-pellet${p.power?' power':''}" data-pellet="${i}" style="left:${p.x}%;top:${p.y}%"></i>`).join('');
    sceneLayer.innerHTML=`<div class="xt-scene xt-pacman pac10-upgraded" data-xt-theme="pacman">
      <div class="pac10-score">PELLETS<strong class="pac10-count">${PELLET_COUNT}</strong></div>
      <div class="pac10-board">
        <svg class="pac10-maze" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
          <rect class="pac10-maze-fill" x="40" y="40" width="880" height="520" rx="36" ry="36"></rect>
          <path class="pac10-corridor" d="${PATH_D}"></path>
        </svg>
        <div class="pac10-pellets">${pellets}</div>
        <div class="pac10-actors"><div class="pac10-player"></div>${ghostMarkup()}<div class="pac10-ready">READY!</div><div class="pac10-clear">LEVEL CLEAR!</div></div>
      </div>
    </div>`;
    const scene=sceneLayer.querySelector('.pac10-upgraded');
    state={scene,player:scene.querySelector('.pac10-player'),ghost:scene.querySelector('.pac10-ghost'),pellets:[...scene.querySelectorAll('.pac10-pellet')],count:scene.querySelector('.pac10-count'),ready:scene.querySelector('.pac10-ready'),lastProgress:0,finishedLatched:false};
  }

  function ensureScene(){
    const pacScene=sceneLayer.querySelector('.xt-pacman[data-xt-theme="pacman"]');
    if(!pacScene){state=null;return false}
    if(!pacScene.classList.contains('pac10-upgraded')){buildScene();return true}
    if(!state||state.scene!==pacScene)buildScene();
    return true;
  }

  function animate(now){
    if(!ensureScene()||!state)return;
    let p=progressNow(now);const current=parseRemaining(),total=totalSeconds();
    if(state.finishedLatched&&current!==null&&current>=total-.1){state.finishedLatched=false;state.lastProgress=0}
    state.lastProgress=Math.max(state.lastProgress,p);p=state.lastProgress;
    if(current===0||p>=.999)state.finishedLatched=true;
    const finished=state.finishedLatched;

    const pacDist=clamp(p,0,1)*ROUTE.total,pacRaw=pointAtDistance(pacDist),pac=pct(pacRaw);
    if(state.player){
      state.player.style.left=`${pac.x}%`;
      state.player.style.top=`${pac.y}%`;
      state.player.style.transform=pacmanTransformForAngle(pacRaw.angle);
      const moving=p>0&&!finished;const bite=moving?(Math.sin(now/88)*.5+.5):.2;
      state.player.style.setProperty('--mouth-top',`${30+bite*12}%`);state.player.style.setProperty('--mouth-bottom',`${70-bite*12}%`);
    }

    const gap=112+10*Math.sin(p*Math.PI*8);
    const ghostVisible=pacDist>145&&!finished;
    const ghostRaw=pointAtDistance(Math.max(0,pacDist-gap)),ghost=pct(ghostRaw);
    if(state.ghost){
      state.ghost.classList.toggle('show',ghostVisible);
      state.ghost.style.left=`${ghost.x}%`;state.ghost.style.top=`${ghost.y}%`;
    }

    let remaining=0;
    state.pellets.forEach((pellet,i)=>{
      const eaten=p>=PELLETS[i].t-.002;
      pellet.classList.toggle('eaten',eaten);if(!eaten)remaining++;
    });
    if(state.count)state.count.textContent=String(remaining).padStart(2,'0');
    if(state.ready)state.ready.style.opacity=p>0||finished?'0':'1';
    state.scene.classList.toggle('pac10-finished',finished);
  }

  const observer=new MutationObserver(()=>{state=null});observer.observe(sceneLayer,{childList:true,subtree:true});
  function tick(now){animate(now);raf=requestAnimationFrame(tick)}
  cancelAnimationFrame(raf);raf=requestAnimationFrame(tick);
})();

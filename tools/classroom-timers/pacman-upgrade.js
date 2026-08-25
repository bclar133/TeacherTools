(() => {
  'use strict';

  if (window.__pacmanUpgradeV14) return;
  window.__pacmanUpgradeV14 = true;

  const sceneLayer = document.getElementById('sceneLayer');
  const stageStatus = document.getElementById('stageStatus');
  const display = document.getElementById('countdownDisplay');
  const minutesInput = document.getElementById('countdownMinutes');
  const secondsInput = document.getElementById('countdownSeconds');
  if (!sceneLayer || !display) return;

  [
    'pacmanUpgradeStyleV4','pacmanUpgradeStyleV5','pacmanUpgradeStyleV6','pacmanUpgradeStyleV7',
    'pacmanUpgradeStyleV8','pacmanUpgradeStyleV9','pacmanUpgradeStyleV10','pacmanUpgradeStyleV11',
    'pacmanUpgradeStyleV12','pacmanUpgradeStyleV13','pacmanUpgradeStyleV14'
  ].forEach(id => document.getElementById(id)?.remove());

  const style = document.createElement('style');
  style.id = 'pacmanUpgradeStyleV14';
  style.textContent = `
    #countdownStage.theme-pacman .time-display-wrap{
      position:absolute!important;left:2.2%!important;right:auto!important;top:1.8%!important;bottom:auto!important;
      transform:none!important;width:auto!important;max-width:32%!important;z-index:40!important;
      justify-items:start!important;text-align:left!important
    }
    #countdownStage.theme-pacman #countdownDisplay,
    #countdownStage.theme-pacman .time-display{
      font-family:"Courier New",Courier,monospace!important;font-size:clamp(2.15rem,4.9vw,4.1rem)!important;
      line-height:.92!important;font-weight:700!important;font-variant-numeric:tabular-nums!important;
      letter-spacing:.01em!important;padding:.15em .24em!important;width:auto!important;min-width:0!important;white-space:nowrap!important
    }
    #countdownStage.theme-pacman .timer-message{font-family:"Courier New",Courier,monospace!important}

    .xt-pacman.pac13-upgraded{background:#000!important;overflow:hidden!important}
    .pac13-score{
      position:absolute;right:5%;top:3%;color:#fff;z-index:3;opacity:.9;
      font:700 clamp(.62rem,1.2vw,.96rem)/1.05 "Courier New",Courier,monospace;
      letter-spacing:.08em;text-align:center;pointer-events:none
    }
    .pac13-score strong{display:block;margin-top:.25rem;font-size:1.15em}

    .pac13-board{
      position:absolute;left:6%;right:4%;top:17%;bottom:4.5%;background:#000;
      border:3px solid #2352ff;border-radius:14px;
      box-shadow:0 0 10px rgba(49,82,255,.38);overflow:hidden;z-index:2
    }
    .pac13-maze,.pac13-pellets,.pac13-actors{position:absolute;inset:0;width:100%;height:100%}
    .pac13-pellets,.pac13-actors{pointer-events:none}

    .pac13-wall{
      fill:none;stroke:#2352ff;stroke-width:58;stroke-linecap:round;stroke-linejoin:round;
      filter:drop-shadow(0 0 3px rgba(45,82,255,.34))
    }
    .pac13-floor{
      fill:none;stroke:#000;stroke-width:52;stroke-linecap:round;stroke-linejoin:round
    }

    .pac13-pellet{
      position:absolute;width:6px;height:6px;border-radius:50%;transform:translate(-50%,-50%);
      background:#ffe2a7;box-shadow:0 0 5px rgba(255,226,167,.5);transition:opacity .08s linear
    }
    .pac13-pellet.power{
      width:14px;height:14px;background:#fff1cf;box-shadow:0 0 9px rgba(255,241,207,.82);
      animation:pac13Power .7s steps(2,end) infinite
    }
    .pac13-pellet.eaten{opacity:0}
    .pac13-pellet.power.eaten{animation:none!important;opacity:0!important}
    @keyframes pac13Power{50%{opacity:.3}}

    .pac13-player{
      position:absolute;width:30px;height:30px;border-radius:50%;transform:translate(-50%,-50%);
      transform-origin:50% 50%;background:#ffda18;z-index:9;
      filter:drop-shadow(0 0 6px rgba(255,218,24,.35));
      clip-path:polygon(100% 0,100% var(--mouth-top,33%),56% 50%,100% var(--mouth-bottom,67%),100% 100%,0 100%,0 0);
      will-change:left,top,transform
    }
    .pac13-player::after{
      content:'';position:absolute;width:3px;height:3px;border-radius:50%;background:#151515;right:7px;top:6px
    }

    .pac13-ghost{
      position:absolute;width:26px;height:26px;transform:translate(-50%,-50%);z-index:8;opacity:0;
      filter:drop-shadow(0 2px 2px rgba(0,0,0,.45));transition:opacity .25s ease;will-change:left,top
    }
    .pac13-ghost.show{opacity:1}
    .pac13-ghost-body{
      position:absolute;inset:0;border-radius:50% 50% 12% 12% / 54% 54% 18% 18%;background:#ff5b57;
      clip-path:polygon(0 0,100% 0,100% 86%,86% 100%,70% 86%,54% 100%,38% 86%,22% 100%,8% 86%,0 92%)
    }
    .pac13-eye{position:absolute;top:8px;width:6px;height:8px;border-radius:50%;background:#fff;z-index:2}
    .pac13-eye.e1{left:5px}.pac13-eye.e2{right:5px}
    .pac13-eye::after{content:'';position:absolute;width:3px;height:3px;border-radius:50%;background:#1739a8;left:2px;top:3px}

    .pac13-ready,.pac13-clear{
      position:absolute;left:50%;transform:translate(-50%,-50%);font-family:"Courier New",Courier,monospace;
      font-weight:900;letter-spacing:.09em;pointer-events:none;z-index:12;text-align:center
    }
    .pac13-ready{top:50%;color:#ffe12c;font-size:clamp(.9rem,1.8vw,1.4rem)}
    .pac13-clear{
      top:50%;color:#ffe12c;font-size:clamp(1.9rem,4.7vw,3.8rem);opacity:0;
      text-shadow:0 0 12px rgba(255,225,44,.55);transition:opacity .22s ease,transform .22s ease
    }
    .pac13-finished .pac13-clear{opacity:.98;transform:translate(-50%,-50%) scale(1)}

    @media(max-width:760px){
      #countdownStage.theme-pacman .time-display-wrap{left:2%!important;top:1.4%!important;max-width:40%!important}
      #countdownStage.theme-pacman #countdownDisplay,
      #countdownStage.theme-pacman .time-display{font-size:clamp(1.8rem,8vw,3rem)!important}
      .pac13-board{left:3%;right:2%;top:20%;bottom:3%}
      .pac13-player{width:27px;height:27px}.pac13-ghost{width:23px;height:23px}
      .pac13-pellet{width:5px;height:5px}.pac13-pellet.power{width:11px;height:11px}
    }
  `;
  document.head.appendChild(style);

  const POINTS=[
    {x:70,y:60},{x:930,y:60},{x:930,y:540},{x:70,y:540},
    {x:70,y:118},{x:872,y:118},{x:872,y:482},{x:128,y:482},
    {x:128,y:176},{x:814,y:176},{x:814,y:424},{x:186,y:424},
    {x:186,y:234},{x:756,y:234},{x:756,y:366},{x:244,y:366},
    {x:500,y:366}
  ];
  const PATH_D=POINTS.map((p,i)=>`${i?'L':'M'} ${p.x} ${p.y}`).join(' ');
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const lerp=(a,b,t)=>a+(b-a)*t;

  function routeData(points){
    const segments=[];let total=0;
    for(let i=0;i<points.length-1;i++){
      const a=points[i],b=points[i+1],len=Math.hypot(b.x-a.x,b.y-a.y);
      segments.push({a,b,len,angle:Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI});
      total+=len;
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

  const PELLET_COUNT=104;
  const PELLETS=Array.from({length:PELLET_COUNT},(_,i)=>{
    const t=i/(PELLET_COUNT-1),p=pointAlong(t);
    return{t,x:p.x/10,y:p.y/6,power:i===0||i===34||i===69||i===PELLET_COUNT-1};
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

  function ghostMarkup(){
    return `<div class="pac13-ghost"><div class="pac13-ghost-body"></div><i class="pac13-eye e1"></i><i class="pac13-eye e2"></i></div>`;
  }

  function buildScene(){
    const pellets=PELLETS.map((p,i)=>`<i class="pac13-pellet${p.power?' power':''}" data-pellet="${i}" style="left:${p.x}%;top:${p.y}%"></i>`).join('');
    sceneLayer.innerHTML=`<div class="xt-scene xt-pacman pac13-upgraded" data-xt-theme="pacman">
      <div class="pac13-score">PELLETS<strong class="pac13-count">${PELLET_COUNT}</strong></div>
      <div class="pac13-board">
        <svg class="pac13-maze" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
          <path class="pac13-wall" d="${PATH_D}"/>
          <path class="pac13-floor" d="${PATH_D}"/>
        </svg>
        <div class="pac13-pellets">${pellets}</div>
        <div class="pac13-actors">
          <div class="pac13-player"></div>${ghostMarkup()}
          <div class="pac13-ready">READY!</div><div class="pac13-clear">LEVEL CLEAR!</div>
        </div>
      </div>
    </div>`;
    const scene=sceneLayer.querySelector('.pac13-upgraded');
    state={
      scene,player:scene.querySelector('.pac13-player'),ghost:scene.querySelector('.pac13-ghost'),
      pellets:[...scene.querySelectorAll('.pac13-pellet')],count:scene.querySelector('.pac13-count'),
      ready:scene.querySelector('.pac13-ready'),lastProgress:0,finishedLatched:false
    };
  }

  function ensureScene(){
    const pacScene=sceneLayer.querySelector('.xt-pacman[data-xt-theme="pacman"]');
    if(!pacScene){state=null;return false}
    if(!pacScene.classList.contains('pac13-upgraded')){buildScene();return true}
    if(!state||state.scene!==pacScene)buildScene();
    return true;
  }

  function animate(now){
    if(!ensureScene()||!state)return;
    let p=progressNow(now);const current=parseRemaining(),total=totalSeconds();

    const resetToStart=current!==null&&current>=total-.1&&p<=.001&&(state.lastProgress>.001||state.finishedLatched);
    if(resetToStart){
      state.finishedLatched=false;
      state.lastProgress=0;
      displayedRemaining=current;
      displayChangedAt=now;
      p=0;
    }

    state.lastProgress=Math.max(state.lastProgress,p);p=state.lastProgress;
    if(current===0||p>=.999)state.finishedLatched=true;
    const finished=state.finishedLatched;

    const pacDist=clamp(p,0,1)*ROUTE.total,pacRaw=pointAtDistance(pacDist),pac=pct(pacRaw);
    if(state.player){
      state.player.style.left=`${pac.x}%`;
      state.player.style.top=`${pac.y}%`;
      state.player.style.transform=pacmanTransformForAngle(pacRaw.angle);
      const moving=p>0&&!finished,bite=moving?(Math.sin(now/88)*.5+.5):.2;
      state.player.style.setProperty('--mouth-top',`${30+bite*12}%`);
      state.player.style.setProperty('--mouth-bottom',`${70-bite*12}%`);
    }

    const gap=118+8*Math.sin(p*Math.PI*8);
    const ghostVisible=pacDist>150&&!finished;
    const ghostRaw=pointAtDistance(Math.max(0,pacDist-gap)),ghost=pct(ghostRaw);
    if(state.ghost){
      state.ghost.classList.toggle('show',ghostVisible);
      state.ghost.style.left=`${ghost.x}%`;
      state.ghost.style.top=`${ghost.y}%`;
    }

    let remaining=0;
    state.pellets.forEach((pellet,i)=>{
      const eaten=p>0&&p>=PELLETS[i].t-.002;
      pellet.classList.toggle('eaten',eaten);
      if(!eaten)remaining++;
    });
    if(state.count)state.count.textContent=String(remaining).padStart(2,'0');
    if(state.ready)state.ready.style.opacity=p>0||finished?'0':'1';
    state.scene.classList.toggle('pac13-finished',finished);
  }

  const observer=new MutationObserver(()=>{state=null});
  observer.observe(sceneLayer,{childList:true,subtree:true});
  function tick(now){animate(now);raf=requestAnimationFrame(tick)}
  cancelAnimationFrame(raf);raf=requestAnimationFrame(tick);
})();
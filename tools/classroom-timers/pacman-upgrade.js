(() => {
  'use strict';

  if (window.__pacmanUpgradeV7) return;
  window.__pacmanUpgradeV7 = true;

  const sceneLayer = document.getElementById('sceneLayer');
  const stageStatus = document.getElementById('stageStatus');
  const display = document.getElementById('countdownDisplay');
  const minutesInput = document.getElementById('countdownMinutes');
  const secondsInput = document.getElementById('countdownSeconds');
  if (!sceneLayer || !display) return;

  ['pacmanUpgradeStyleV4','pacmanUpgradeStyleV5','pacmanUpgradeStyleV6','pacmanUpgradeStyleV7']
    .forEach(id => document.getElementById(id)?.remove());

  const style = document.createElement('style');
  style.id = 'pacmanUpgradeStyleV7';
  style.textContent = `
    #countdownStage.theme-pacman .time-display-wrap{
      position:absolute!important;left:2.2%!important;right:auto!important;top:1.8%!important;
      bottom:auto!important;transform:none!important;width:auto!important;max-width:32%!important;
      z-index:40!important;justify-items:start!important;text-align:left!important
    }
    #countdownStage.theme-pacman #countdownDisplay,
    #countdownStage.theme-pacman .time-display{
      font-family:"Courier New",Courier,monospace!important;
      font-size:clamp(2.15rem,4.9vw,4.1rem)!important;line-height:.92!important;font-weight:700!important;
      font-variant-numeric:tabular-nums!important;letter-spacing:.01em!important;padding:.15em .24em!important;
      width:auto!important;min-width:0!important;white-space:nowrap!important
    }
    #countdownStage.theme-pacman .timer-message{font-family:"Courier New",Courier,monospace!important}

    .xt-pacman.pac7-upgraded{background:#000!important;overflow:hidden!important}
    .pac7-score{
      position:absolute;left:40%;right:4%;top:2.7%;display:flex;justify-content:center;gap:4.5rem;
      color:#fff;z-index:3;opacity:.88;font:700 clamp(.62rem,1.2vw,.96rem)/1.05 "Courier New",Courier,monospace;
      letter-spacing:.08em;text-align:center;pointer-events:none
    }
    .pac7-score strong{display:block;margin-top:.25rem;font-size:1.1em}

    .pac7-board{
      position:absolute;left:7%;right:5%;top:18%;bottom:5%;background:#000;border:5px solid #214dff;
      border-radius:16px;box-shadow:0 0 13px rgba(49,82,255,.48),inset 0 0 0 2px #0b173b;overflow:hidden;z-index:2
    }
    .pac7-grid{
      position:absolute;inset:2.5%;display:grid;grid-template-columns:repeat(15,1fr);
      grid-template-rows:repeat(11,1fr);gap:0
    }
    .pac7-wall{
      position:relative;background:#071444;
      box-shadow:inset 0 0 0 3px #2452ff,inset 0 0 0 6px #0a1d72
    }
    .pac7-floor,.pac7-actors{position:absolute;inset:2.5%;pointer-events:none}

    .pac7-pellet{
      position:absolute;width:6px;height:6px;border-radius:50%;transform:translate(-50%,-50%);
      background:#ffe1a5;box-shadow:0 0 5px rgba(255,225,165,.48);transition:opacity .1s linear
    }
    .pac7-pellet.power{
      width:13px;height:13px;background:#fff1cf;box-shadow:0 0 9px rgba(255,241,207,.82);
      animation:pac7Power .7s steps(2,end) infinite
    }
    .pac7-pellet.eaten{opacity:0}
    @keyframes pac7Power{50%{opacity:.28}}

    .pac7-player{
      position:absolute;width:30px;height:30px;border-radius:50%;
      transform:translate(-50%,-50%) rotate(var(--dir,0deg));transform-origin:50% 50%;
      background:#ffda18;z-index:10;filter:drop-shadow(0 0 5px rgba(255,218,24,.35));
      clip-path:polygon(100% 0,100% var(--mouth-top,33%),56% 50%,100% var(--mouth-bottom,67%),100% 100%,0 100%,0 0);
      will-change:left,top,transform
    }
    .pac7-player::after{
      content:'';position:absolute;width:3px;height:3px;border-radius:50%;background:#141414;right:7px;top:6px
    }

    .pac7-pen{
      position:absolute;left:50%;top:53%;width:20%;height:18%;transform:translate(-50%,-50%);
      border:4px solid #2452ff;border-radius:8px;background:#000;box-shadow:0 0 7px rgba(36,82,255,.4);z-index:5
    }
    .pac7-pen::before{
      content:'';position:absolute;left:50%;top:-7px;width:58px;height:12px;transform:translateX(-50%);background:#000
    }
    .pac7-gate{
      position:absolute;left:50%;top:-4px;width:54px;height:4px;transform:translateX(-50%);
      background:#ff8dcc;box-shadow:0 0 4px #ff8dcc;transition:opacity .3s ease
    }
    .pac7-gate.open{opacity:.08}

    .pac7-ghost{
      position:absolute;width:26px;height:26px;transform:translate(-50%,-50%);z-index:8;
      filter:drop-shadow(0 2px 2px rgba(0,0,0,.45));will-change:left,top
    }
    .pac7-ghost-body{
      position:absolute;inset:0;border-radius:50% 50% 12% 12% / 54% 54% 18% 18%;
      background:var(--ghost);clip-path:polygon(0 0,100% 0,100% 86%,86% 100%,70% 86%,54% 100%,38% 86%,22% 100%,8% 86%,0 92%)
    }
    .pac7-eye{position:absolute;top:8px;width:6px;height:8px;border-radius:50%;background:#fff;z-index:2}
    .pac7-eye.e1{left:5px}.pac7-eye.e2{right:5px}
    .pac7-eye::after{
      content:'';position:absolute;width:3px;height:3px;border-radius:50%;background:#1739a8;left:2px;top:3px
    }

    .pac7-cupcake{
      position:absolute;left:50%;top:53%;width:29px;height:29px;transform:translate(-50%,-50%) scale(.5);
      opacity:0;z-index:7;transition:opacity .28s ease,transform .28s ease;
      filter:drop-shadow(0 0 6px rgba(255,111,188,.35))
    }
    .pac7-cupcake.show{opacity:1;transform:translate(-50%,-50%) scale(1);animation:pac7CupcakeBob 1.1s ease-in-out infinite alternate}
    .pac7-cupcake.eaten{opacity:0!important;transform:translate(-50%,-50%) scale(.28) rotate(18deg)!important}
    .pac7-cupcake svg{width:100%;height:100%;display:block}
    @keyframes pac7CupcakeBob{to{transform:translate(-50%,-54%) scale(1.04)}}

    .pac7-ready,.pac7-clear{
      position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
      font-family:"Courier New",Courier,monospace;font-weight:900;letter-spacing:.09em;pointer-events:none;z-index:12;text-align:center
    }
    .pac7-ready{color:#ffe12c;font-size:clamp(1rem,2vw,1.6rem)}
    .pac7-clear{color:#ffe12c;font-size:clamp(1.8rem,4.5vw,3.5rem);opacity:0;text-shadow:0 0 12px rgba(255,225,44,.55)}
    .pac7-finished .pac7-clear{animation:pac7Clear .8s ease-out forwards}
    @keyframes pac7Clear{
      0%{opacity:0;transform:translate(-50%,-50%) scale(.55)}
      55%{opacity:1;transform:translate(-50%,-50%) scale(1.08)}
      100%{opacity:.96;transform:translate(-50%,-50%) scale(1)}
    }

    @media(max-width:760px){
      #countdownStage.theme-pacman .time-display-wrap{left:2%!important;top:1.4%!important;max-width:40%!important}
      #countdownStage.theme-pacman #countdownDisplay,#countdownStage.theme-pacman .time-display{
        font-size:clamp(1.8rem,8vw,3rem)!important
      }
      .pac7-score{left:43%;right:2%;gap:1.4rem;font-size:.54rem}
      .pac7-board{left:3.5%;right:3%;top:21%;bottom:4%}
      .pac7-wall{box-shadow:inset 0 0 0 2px #2452ff,inset 0 0 0 4px #0a1d72}
      .pac7-player{width:25px;height:25px}.pac7-player::after{width:2.5px;height:2.5px;right:6px;top:5px}
      .pac7-ghost{width:22px;height:22px}
      .pac7-eye{top:7px;width:5px;height:7px}.pac7-eye.e1{left:4px}.pac7-eye.e2{right:4px}
      .pac7-pen{width:22%;height:18%}
      .pac7-cupcake{width:24px;height:24px}
      .pac7-pellet{width:5px;height:5px}.pac7-pellet.power{width:11px;height:11px}
    }
  `;
  document.head.appendChild(style);

  const GRID=[
    '###############',
    '#.....#.#.....#',
    '#.###.#.#.###.#',
    '#.#...........#',
    '#.#.###.###.#.#',
    '#...#.....#...#',
    '###.#.....#.###',
    '#...#.###.#...#',
    '#.###.#.#.###.#',
    '#.............#',
    '###############'
  ];
  const ROWS=GRID.length,COLS=GRID[0].length;

  const MAIN_CELLS=[
    [1,1],[2,1],[3,1],[4,1],[5,1],[5,2],[5,3],[6,3],[7,3],[8,3],[9,3],[10,3],[11,3],[12,3],[13,3],
    [13,4],[13,5],[12,5],[11,5],[11,6],[11,7],[12,7],[13,7],[13,8],[13,9],[12,9],[11,9],[10,9],[9,9],
    [9,8],[9,7],[9,6],[9,5],[8,5],[7,5],[7,4]
  ];

  const GHOST_CELL_ROUTES=[
    [[7,4],[7,3],[6,3],[5,3],[5,2],[5,1],[4,1],[3,1],[2,1],[1,1],[1,2],[1,3],[1,4],[1,5],[2,5],[3,5],[3,4],[3,3],[4,3],[5,3],[6,3],[7,3],[7,4]],
    [[7,4],[7,3],[8,3],[9,3],[10,3],[11,3],[12,3],[13,3],[13,4],[13,5],[12,5],[11,5],[11,6],[11,7],[12,7],[13,7],[13,8],[13,9],[12,9],[11,9],[10,9],[9,9],[9,8],[9,7],[9,6],[9,5],[8,5],[7,5],[7,4]],
    [[7,4],[7,3],[6,3],[5,3],[5,2],[5,1],[4,1],[3,1],[2,1],[1,1],[1,2],[1,3],[1,4],[1,5],[2,5],[3,5],[3,4],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[10,3],[11,3],[12,3],[13,3],[13,4],[13,5],[12,5],[11,5],[11,6],[11,7],[12,7],[13,7],[13,8],[13,9],[12,9],[11,9],[10,9],[9,9],[9,8],[9,7],[9,6],[9,5],[8,5],[7,5],[7,4]]
  ];

  const GHOSTS=[
    {color:'#ff5b57',exitAt:700,speed:.000042,phase:.08},
    {color:'#59d9ff',exitAt:2100,speed:.000037,phase:.41},
    {color:'#ff8ed3',exitAt:3500,speed:.000034,phase:.69}
  ];

  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const smooth=t=>t*t*(3-2*t);

  let displayedRemaining=null;
  let displayChangedAt=performance.now();
  let lastStatus='';
  let sceneState=null;
  let raf=0;

  function cellPoint(c,r){return{x:(c+.5)/COLS*100,y:(r+.5)/ROWS*100}}

  const MAIN_ROUTE=[
    ...MAIN_CELLS.map(([c,r])=>cellPoint(c,r)),
    {x:50,y:53}
  ];
  const GHOST_ROUTES=GHOST_CELL_ROUTES.map(route=>route.map(([c,r])=>cellPoint(c,r)));

  function routeData(points){
    const segments=[];let total=0;
    for(let i=0;i<points.length-1;i++){
      const a=points[i],b=points[i+1],len=Math.hypot(b.x-a.x,b.y-a.y);
      segments.push({a,b,len,angle:Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI});total+=len;
    }
    return{points,segments,total};
  }

  function pointAlong(route,t){
    const dist=clamp(t,0,1)*route.total;let acc=0;
    for(const seg of route.segments){
      if(dist<=acc+seg.len||seg===route.segments[route.segments.length-1]){
        const u=seg.len?clamp((dist-acc)/seg.len,0,1):0;
        return{x:lerp(seg.a.x,seg.b.x,u),y:lerp(seg.a.y,seg.b.y,u),angle:seg.angle};
      }
      acc+=seg.len;
    }
    const last=route.segments[route.segments.length-1];
    return{x:last.b.x,y:last.b.y,angle:last.angle};
  }

  function parseRemaining(){
    const parts=display.textContent.trim().split(':').map(Number);
    if(parts.some(v=>!Number.isFinite(v)))return null;
    if(parts.length===2)return parts[0]*60+parts[1];
    if(parts.length===3)return parts[0]*3600+parts[1]*60+parts[2];
    return null;
  }
  function totalSeconds(){return Math.max(1,(Number(minutesInput?.value)||0)*60+(Number(secondsInput?.value)||0))}
  function progressNow(now){
    const current=parseRemaining();if(current===null)return 0;
    const status=stageStatus?.textContent.trim()||'',running=status==='Running';
    if(displayedRemaining===null||current!==displayedRemaining||status!==lastStatus){
      displayedRemaining=current;displayChangedAt=now;lastStatus=status;
    }
    let estimated=current;
    if(running&&current>0)estimated=Math.max(0,current-(now-displayChangedAt)/1000);
    return clamp(1-estimated/totalSeconds(),0,1);
  }

  function ghostMarkup(i,color){
    return `<div class="pac7-ghost g${i}" style="--ghost:${color}">
      <div class="pac7-ghost-body"></div><i class="pac7-eye e1"></i><i class="pac7-eye e2"></i>
    </div>`;
  }

  function cupcakeMarkup(){
    return `<div class="pac7-cupcake" aria-hidden="true">
      <svg viewBox="0 0 40 40">
        <path d="M11 20 H29 L26 36 H14 Z" fill="#8a583e"/>
        <path d="M9 20 Q10 12 16 13 Q18 7 23 11 Q29 9 31 16 Q34 18 30 22 H10 Q7 21 9 20 Z" fill="#f7a4cf"/>
        <circle cx="17" cy="14" r="2" fill="#ffdf59"/><circle cx="25" cy="13" r="2" fill="#65c6ff"/>
        <circle cx="22" cy="18" r="2" fill="#9ce46b"/>
      </svg>
    </div>`;
  }

  function buildScene(){
    const route=routeData(MAIN_ROUTE);
    const ghostRoutes=GHOST_ROUTES.map(routeData);
    const walls=GRID.flatMap((row,r)=>[...row].map((ch,c)=>
      ch==='#'?`<i class="pac7-wall" style="grid-column:${c+1};grid-row:${r+1}"></i>`:''
    )).join('');

    const pelletCount=38;
    const pellets=Array.from({length:pelletCount},(_,i)=>{
      const p=pointAlong(route,i/(pelletCount-1));
      const power=i===0||i===12||i===25;
      return `<i class="pac7-pellet${power?' power':''}" data-pellet="${i}" style="left:${p.x}%;top:${p.y}%"></i>`;
    }).join('');

    sceneLayer.innerHTML=`<div class="xt-scene xt-pacman pac7-upgraded" data-xt-theme="pacman">
      <div class="pac7-score"><div>1UP<strong>00</strong></div><div>HIGH SCORE<strong>00</strong></div></div>
      <div class="pac7-board">
        <div class="pac7-grid">${walls}</div>
        <div class="pac7-floor">${pellets}</div>
        <div class="pac7-actors">
          <div class="pac7-pen"><div class="pac7-gate"></div></div>
          ${cupcakeMarkup()}
          <div class="pac7-player"></div>
          ${ghostMarkup(1,GHOSTS[0].color)}${ghostMarkup(2,GHOSTS[1].color)}${ghostMarkup(3,GHOSTS[2].color)}
          <div class="pac7-ready">READY!</div><div class="pac7-clear">LEVEL CLEAR!</div>
        </div>
      </div>
    </div>`;

    const scene=sceneLayer.querySelector('.pac7-upgraded');
    sceneState={
      scene,route,ghostRoutes,
      player:scene.querySelector('.pac7-player'),
      ghosts:[...scene.querySelectorAll('.pac7-ghost')],
      pellets:[...scene.querySelectorAll('.pac7-pellet')],
      ready:scene.querySelector('.pac7-ready'),
      gate:scene.querySelector('.pac7-gate'),
      cupcake:scene.querySelector('.pac7-cupcake'),
      activeMs:0,lastNow:performance.now(),lastProgress:0
    };
  }

  function ensureScene(){
    const pacScene=sceneLayer.querySelector('.xt-pacman[data-xt-theme="pacman"]');
    if(!pacScene){sceneState=null;return false}
    if(!pacScene.classList.contains('pac7-upgraded')){buildScene();return true}
    if(!sceneState||sceneState.scene!==pacScene){
      const route=routeData(MAIN_ROUTE);
      sceneState={
        scene:pacScene,route,ghostRoutes:GHOST_ROUTES.map(routeData),
        player:pacScene.querySelector('.pac7-player'),
        ghosts:[...pacScene.querySelectorAll('.pac7-ghost')],
        pellets:[...pacScene.querySelectorAll('.pac7-pellet')],
        ready:pacScene.querySelector('.pac7-ready'),
        gate:pacScene.querySelector('.pac7-gate'),
        cupcake:pacScene.querySelector('.pac7-cupcake'),
        activeMs:0,lastNow:performance.now(),lastProgress:0
      };
    }
    return true;
  }

  function distance(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}

  function ghostPosition(index,now,pac){
    const def=GHOSTS[index],route=sceneState.ghostRoutes[index];
    const slot=[{x:45,y:53},{x:50,y:53},{x:55,y:53}][index];
    const gate={x:50,y:44};
    const exit={x:50,y:cellPoint(7,4).y};
    const elapsed=sceneState.activeMs;

    if(elapsed<def.exitAt)return slot;
    const exitT=(elapsed-def.exitAt)/900;
    if(exitT<1){
      if(exitT<.6){
        const t=smooth(exitT/.6);
        return{x:lerp(slot.x,gate.x,t),y:lerp(slot.y,gate.y,t)};
      }
      const t=smooth((exitT-.6)/.4);
      return{x:lerp(gate.x,exit.x,t),y:lerp(gate.y,exit.y,t)};
    }

    let t=((elapsed-def.exitAt-900)*def.speed+def.phase)%1;
    let pos=pointAlong(route,t);
    for(let tries=0;tries<4&&distance(pos,pac)<5.3;tries++){
      t=(t+.11)%1;pos=pointAlong(route,t);
    }
    return pos;
  }

  function animate(now){
    if(!ensureScene()||!sceneState)return;

    const p=progressNow(now),running=(stageStatus?.textContent.trim()||'')==='Running',finished=p>=.999;
    const dt=Math.min(100,Math.max(0,now-sceneState.lastNow));
    sceneState.lastNow=now;
    if(p+0.02<sceneState.lastProgress)sceneState.activeMs=0;
    if(running&&!finished)sceneState.activeMs+=dt;
    sceneState.lastProgress=p;

    const pac=pointAlong(sceneState.route,p);
    if(sceneState.player){
      sceneState.player.style.left=`${pac.x}%`;sceneState.player.style.top=`${pac.y}%`;
      sceneState.player.style.setProperty('--dir',`${pac.angle}deg`);
      const bite=running&&!finished?(Math.sin(now/90)*.5+.5):.2;
      sceneState.player.style.setProperty('--mouth-top',`${30+bite*12}%`);
      sceneState.player.style.setProperty('--mouth-bottom',`${70-bite*12}%`);
    }

    sceneState.ghosts.forEach((ghost,i)=>{
      const pos=ghostPosition(i,now,pac);
      ghost.style.left=`${pos.x}%`;ghost.style.top=`${pos.y}%`;
    });

    const allExited=sceneState.activeMs>=GHOSTS[2].exitAt+900;
    sceneState.gate?.classList.toggle('open',allExited);
    if(sceneState.cupcake){
      sceneState.cupcake.classList.toggle('show',allExited&&p<.985);
      sceneState.cupcake.classList.toggle('eaten',p>=.985);
    }

    const n=sceneState.pellets.length;
    sceneState.pellets.forEach((pellet,i)=>pellet.classList.toggle('eaten',p>=i/Math.max(1,n-1)));

    if(sceneState.ready)sceneState.ready.style.opacity=running||finished?'0':'1';
    sceneState.scene.classList.toggle('pac7-finished',finished);
  }

  const observer=new MutationObserver(()=>{sceneState=null});
  observer.observe(sceneLayer,{childList:true,subtree:true});

  function tick(now){animate(now);raf=requestAnimationFrame(tick)}
  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(tick);
})();

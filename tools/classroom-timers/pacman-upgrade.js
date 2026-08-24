(() => {
  'use strict';

  if (window.__pacmanUpgradeV8) return;
  window.__pacmanUpgradeV8 = true;

  const sceneLayer = document.getElementById('sceneLayer');
  const stageStatus = document.getElementById('stageStatus');
  const display = document.getElementById('countdownDisplay');
  const minutesInput = document.getElementById('countdownMinutes');
  const secondsInput = document.getElementById('countdownSeconds');
  if (!sceneLayer || !display) return;

  ['pacmanUpgradeStyleV4','pacmanUpgradeStyleV5','pacmanUpgradeStyleV6','pacmanUpgradeStyleV7','pacmanUpgradeStyleV8']
    .forEach(id => document.getElementById(id)?.remove());

  const style = document.createElement('style');
  style.id = 'pacmanUpgradeStyleV8';
  style.textContent = `
    #countdownStage.theme-pacman .time-display-wrap{
      position:absolute!important;left:2.2%!important;right:auto!important;top:1.8%!important;
      bottom:auto!important;transform:none!important;width:auto!important;max-width:32%!important;
      z-index:40!important;justify-items:start!important;text-align:left!important
    }
    #countdownStage.theme-pacman #countdownDisplay,
    #countdownStage.theme-pacman .time-display{
      font-family:"Courier New",Courier,monospace!important;font-size:clamp(2.15rem,4.9vw,4.1rem)!important;
      line-height:.92!important;font-weight:700!important;font-variant-numeric:tabular-nums!important;
      letter-spacing:.01em!important;padding:.15em .24em!important;width:auto!important;min-width:0!important;white-space:nowrap!important
    }
    #countdownStage.theme-pacman .timer-message{font-family:"Courier New",Courier,monospace!important}

    .xt-pacman.pac8-upgraded{background:#000!important;overflow:hidden!important}
    .pac8-score{
      position:absolute;left:40%;right:4%;top:2.7%;display:flex;justify-content:center;gap:4.5rem;
      color:#fff;z-index:3;opacity:.88;font:700 clamp(.62rem,1.2vw,.96rem)/1.05 "Courier New",Courier,monospace;
      letter-spacing:.08em;text-align:center;pointer-events:none
    }
    .pac8-score strong{display:block;margin-top:.25rem;font-size:1.1em}

    .pac8-board{
      position:absolute;left:6%;right:4%;top:17%;bottom:4.5%;background:#000;border:5px solid #214dff;
      border-radius:16px;box-shadow:0 0 13px rgba(49,82,255,.48),inset 0 0 0 2px #0b173b;overflow:hidden;z-index:2
    }
    .pac8-grid{position:absolute;inset:2.4%;display:grid;grid-template-columns:repeat(17,1fr);grid-template-rows:repeat(11,1fr)}
    .pac8-wall{position:relative;background:#071444;box-shadow:inset 0 0 0 3px #2452ff,inset 0 0 0 6px #0a1d72}
    .pac8-floor,.pac8-actors{position:absolute;inset:2.4%;pointer-events:none}

    .pac8-pellet{position:absolute;width:7px;height:7px;border-radius:50%;transform:translate(-50%,-50%);background:#ffe1a5;box-shadow:0 0 5px rgba(255,225,165,.48);transition:opacity .09s linear}
    .pac8-pellet.power{width:15px;height:15px;background:#fff1cf;box-shadow:0 0 9px rgba(255,241,207,.82);animation:pac8Power .7s steps(2,end) infinite}
    .pac8-pellet.eaten{opacity:0}
    @keyframes pac8Power{50%{opacity:.28}}

    .pac8-player{
      position:absolute;width:34px;height:34px;border-radius:50%;transform:translate(-50%,-50%) rotate(var(--dir,0deg));
      transform-origin:50% 50%;background:#ffda18;z-index:9;filter:drop-shadow(0 0 6px rgba(255,218,24,.35));
      clip-path:polygon(100% 0,100% var(--mouth-top,33%),56% 50%,100% var(--mouth-bottom,67%),100% 100%,0 100%,0 0);
      will-change:left,top,transform
    }
    .pac8-player::after{content:'';position:absolute;width:4px;height:4px;border-radius:50%;background:#141414;right:8px;top:6px}

    .pac8-pen{
      position:absolute;left:50%;top:50%;width:15.6%;height:12.5%;transform:translate(-50%,-50%);
      border:4px solid #2452ff;border-radius:8px;background:#000;box-shadow:0 0 7px rgba(36,82,255,.4);z-index:5
    }
    .pac8-gate{position:absolute;left:50%;top:-4px;width:37%;height:4px;transform:translateX(-50%);background:#ff8dcc;box-shadow:0 0 4px #ff8dcc;transition:opacity .35s,transform .35s}
    .pac8-gate.open{opacity:.15;transform:translateX(-50%) scaleX(.08)}

    .pac8-ghost{position:absolute;width:28px;height:28px;transform:translate(-50%,-50%);z-index:8;filter:drop-shadow(0 2px 2px rgba(0,0,0,.45));will-change:left,top}
    .pac8-ghost-body{position:absolute;inset:0;border-radius:50% 50% 12% 12% / 54% 54% 18% 18%;background:var(--ghost);clip-path:polygon(0 0,100% 0,100% 86%,86% 100%,70% 86%,54% 100%,38% 86%,22% 100%,8% 86%,0 92%)}
    .pac8-eye{position:absolute;top:8px;width:7px;height:9px;border-radius:50%;background:#fff;z-index:2}
    .pac8-eye.e1{left:5px}.pac8-eye.e2{right:5px}
    .pac8-eye::after{content:'';position:absolute;width:3px;height:4px;border-radius:50%;background:#1739a8;left:2px;top:3px}

    .pac8-cupcake{position:absolute;left:50%;top:50%;width:32px;height:32px;transform:translate(-50%,-50%) scale(.7);z-index:6;opacity:0;filter:drop-shadow(0 0 6px rgba(255,144,205,.5));transition:opacity .32s,transform .32s}
    .pac8-cupcake.show{opacity:1;transform:translate(-50%,-50%) scale(1)}
    .pac8-cupcake.eaten{opacity:0;transform:translate(-50%,-50%) scale(.4) rotate(15deg)}
    .pac8-cupcake svg{width:100%;height:100%;display:block}

    .pac8-ready,.pac8-clear{position:absolute;left:50%;transform:translate(-50%,-50%);font-family:"Courier New",Courier,monospace;font-weight:900;letter-spacing:.09em;pointer-events:none;z-index:12;text-align:center}
    .pac8-ready{top:64%;color:#ffe12c;font-size:clamp(.9rem,1.8vw,1.4rem)}
    .pac8-clear{top:50%;color:#ffe12c;font-size:clamp(1.9rem,4.7vw,3.8rem);opacity:0;text-shadow:0 0 12px rgba(255,225,44,.55)}
    .pac8-finished .pac8-clear{animation:pac8Clear .8s ease-out forwards}
    @keyframes pac8Clear{0%{opacity:0;transform:translate(-50%,-50%) scale(.55)}55%{opacity:1;transform:translate(-50%,-50%) scale(1.08)}100%{opacity:.96;transform:translate(-50%,-50%) scale(1)}}

    @media(max-width:760px){
      #countdownStage.theme-pacman .time-display-wrap{left:2%!important;top:1.4%!important;max-width:40%!important}
      #countdownStage.theme-pacman #countdownDisplay,#countdownStage.theme-pacman .time-display{font-size:clamp(1.8rem,8vw,3rem)!important}
      .pac8-score{left:43%;right:2%;gap:1.4rem;font-size:.54rem}
      .pac8-board{left:3%;right:2%;top:20%;bottom:3%}
      .pac8-wall{box-shadow:inset 0 0 0 2px #2452ff,inset 0 0 0 4px #0a1d72}
      .pac8-player{width:29px;height:29px}.pac8-player::after{width:3px;height:3px;right:7px;top:5px}
      .pac8-ghost{width:24px;height:24px}
      .pac8-pellet{width:6px;height:6px}.pac8-pellet.power{width:12px;height:12px}
      .pac8-cupcake{width:26px;height:26px}
    }
  `;
  document.head.appendChild(style);

  const GRID=[
    '#################',
    '#.....#.........#',
    '#.###.#.#####.#.#',
    '#.#...#.....#.#.#',
    '#.#.###..##.#.#.#',
    '#...#.......#...#',
    '###.#.#####.#.###',
    '#...#.......#...#',
    '#.###.#.###.###.#',
    '#.....#.........#',
    '#################'
  ];
  const ROWS=GRID.length,COLS=GRID[0].length;
  const PEN_CELLS=new Set(['7,5','8,5','9,5']);
  const START={c:1,r:1};
  const GATE={c:8,r:4};
  const PEN_CENTER={x:50,y:50};

  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const smooth=t=>t*t*(3-2*t);
  const key=(c,r)=>`${c},${r}`;
  const cellPoint=(c,r)=>({x:(c+.5)/COLS*100,y:(r+.5)/ROWS*100});

  function walkable(c,r){
    return r>=0&&r<ROWS&&c>=0&&c<COLS&&GRID[r][c]==='.'&&!PEN_CELLS.has(key(c,r));
  }
  function neighbours(c,r){
    return [[1,0],[0,1],[-1,0],[0,-1]]
      .map(([dc,dr])=>({c:c+dc,r:r+dr}))
      .filter(n=>walkable(n.c,n.r));
  }

  function makeCoverRoute(){
    const visited=new Set();
    const route=[];
    function dfs(c,r){
      visited.add(key(c,r));
      route.push({c,r});
      const ns=neighbours(c,r);
      for(const n of ns){
        if(!visited.has(key(n.c,n.r))){
          dfs(n.c,n.r);
          route.push({c,r});
        }
      }
    }
    dfs(START.c,START.r);
    const toGate=bfsPath({c:START.c,r:START.r},GATE);
    toGate.slice(1).forEach(p=>route.push(p));
    return route;
  }

  function bfsPath(start,target){
    const q=[start];
    const prev=new Map([[key(start.c,start.r),null]]);
    for(let i=0;i<q.length;i++){
      const cur=q[i];
      if(cur.c===target.c&&cur.r===target.r)break;
      for(const n of neighbours(cur.c,cur.r)){
        const k=key(n.c,n.r);
        if(!prev.has(k)){prev.set(k,cur);q.push(n)}
      }
    }
    const endKey=key(target.c,target.r);
    if(!prev.has(endKey))return[start];
    const out=[];let cur=target;
    while(cur){out.push(cur);cur=prev.get(key(cur.c,cur.r))||null}
    return out.reverse();
  }

  function joinPaths(targets){
    const out=[GATE];
    let current=GATE;
    for(const target of targets){
      const segment=bfsPath(current,target);
      segment.slice(1).forEach(p=>out.push(p));
      current=target;
    }
    const back=bfsPath(current,GATE);
    back.slice(1).forEach(p=>out.push(p));
    return out;
  }

  const COVER_CELLS=makeCoverRoute();
  const COVER_POINTS=[...COVER_CELLS.map(p=>cellPoint(p.c,p.r)),PEN_CENTER];
  const GHOST_CELL_ROUTES=[
    joinPaths([{c:1,r:1},{c:1,r:9},{c:5,r:9}]),
    joinPaths([{c:15,r:1},{c:15,r:9},{c:11,r:9}]),
    joinPaths([{c:3,r:5},{c:13,r:5},{c:7,r:9}])
  ];

  function routeData(points){
    const segments=[];let total=0;
    for(let i=0;i<points.length-1;i++){
      const a=points[i],b=points[i+1],len=Math.hypot(b.x-a.x,b.y-a.y);
      segments.push({a,b,len,angle:Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI});total+=len;
    }
    return{points,segments,total};
  }
  function pointAlongDistance(route,dist){
    if(!route.total)return route.points[0];
    dist=((dist%route.total)+route.total)%route.total;
    let acc=0;
    for(const seg of route.segments){
      if(dist<=acc+seg.len||seg===route.segments[route.segments.length-1]){
        const u=seg.len?clamp((dist-acc)/seg.len,0,1):0;
        return{x:lerp(seg.a.x,seg.b.x,u),y:lerp(seg.a.y,seg.b.y,u),angle:seg.angle};
      }
      acc+=seg.len;
    }
    return route.points[0];
  }
  function pointAlong(route,t){return pointAlongDistance(route,clamp(t,0,1)*route.total)}

  const COVER_ROUTE=routeData(COVER_POINTS);
  const GHOST_ROUTES=GHOST_CELL_ROUTES.map(cells=>routeData(cells.map(p=>cellPoint(p.c,p.r))));

  const firstVisit=new Map();
  COVER_CELLS.forEach((p,i)=>{const k=key(p.c,p.r);if(!firstVisit.has(k))firstVisit.set(k,i/Math.max(1,COVER_CELLS.length-1))});

  const PELLETS=[];
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
    if(!walkable(c,r))continue;
    const p=cellPoint(c,r);
    PELLETS.push({c,r,x:p.x,y:p.y,threshold:firstVisit.get(key(c,r))??1});
  }
  const powerKeys=new Set(['1,1','15,1','1,9','15,9']);

  const GHOST_DEFS=[
    {color:'#ff5b57',exitAt:550,speed:.0165},
    {color:'#59d9ff',exitAt:1650,speed:.0148},
    {color:'#ff8ed3',exitAt:2750,speed:.0156}
  ];
  const EXIT_DURATION=850;

  let displayedRemaining=null;
  let displayChangedAt=performance.now();
  let lastStatus='';
  let state=null;
  let raf=0;

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
    if(displayedRemaining===null||current!==displayedRemaining||status!==lastStatus){displayedRemaining=current;displayChangedAt=now;lastStatus=status}
    let estimated=current;
    if(running&&current>0)estimated=Math.max(0,current-(now-displayChangedAt)/1000);
    return clamp(1-estimated/totalSeconds(),0,1);
  }

  function ghostMarkup(i,color){return `<div class="pac8-ghost g${i}" style="--ghost:${color}"><div class="pac8-ghost-body"></div><i class="pac8-eye e1"></i><i class="pac8-eye e2"></i></div>`}
  function cupcakeMarkup(){return `<div class="pac8-cupcake" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M11 20 H29 L26 36 H14 Z" fill="#8a583e"/><path d="M9 20 Q10 12 16 13 Q18 7 23 11 Q29 9 31 16 Q34 18 30 22 H10 Q7 21 9 20 Z" fill="#f7a4cf"/><circle cx="17" cy="14" r="2" fill="#ffdf59"/><circle cx="25" cy="13" r="2" fill="#65c6ff"/><circle cx="22" cy="18" r="2" fill="#9ce46b"/></svg></div>`}

  function buildScene(){
    const walls=GRID.flatMap((row,r)=>[...row].map((ch,c)=>ch==='#'?`<i class="pac8-wall" style="grid-column:${c+1};grid-row:${r+1}"></i>`:'')).join('');
    const pellets=PELLETS.map((p,i)=>`<i class="pac8-pellet${powerKeys.has(key(p.c,p.r))?' power':''}" data-pellet="${i}" style="left:${p.x}%;top:${p.y}%"></i>`).join('');

    sceneLayer.innerHTML=`<div class="xt-scene xt-pacman pac8-upgraded" data-xt-theme="pacman">
      <div class="pac8-score"><div>1UP<strong>00</strong></div><div>HIGH SCORE<strong>00</strong></div></div>
      <div class="pac8-board">
        <div class="pac8-grid">${walls}</div>
        <div class="pac8-floor">${pellets}</div>
        <div class="pac8-actors">
          <div class="pac8-pen"><div class="pac8-gate"></div></div>
          ${cupcakeMarkup()}
          <div class="pac8-player"></div>
          ${ghostMarkup(1,GHOST_DEFS[0].color)}${ghostMarkup(2,GHOST_DEFS[1].color)}${ghostMarkup(3,GHOST_DEFS[2].color)}
          <div class="pac8-ready">READY!</div><div class="pac8-clear">LEVEL CLEAR!</div>
        </div>
      </div>
    </div>`;

    const scene=sceneLayer.querySelector('.pac8-upgraded');
    state={
      scene,player:scene.querySelector('.pac8-player'),ghosts:[...scene.querySelectorAll('.pac8-ghost')],
      pellets:[...scene.querySelectorAll('.pac8-pellet')],ready:scene.querySelector('.pac8-ready'),gate:scene.querySelector('.pac8-gate'),
      cupcake:scene.querySelector('.pac8-cupcake'),activeMs:0,lastNow:performance.now(),
      ghostState:GHOST_DEFS.map((d,i)=>({travel:GHOST_ROUTES[i].total*d.exitAt*.000001,direction:1,blocked:0,pos:null}))
    };
  }

  function ensureScene(){
    const pacScene=sceneLayer.querySelector('.xt-pacman[data-xt-theme="pacman"]');
    if(!pacScene){state=null;return false}
    if(!pacScene.classList.contains('pac8-upgraded')){buildScene();return true}
    if(!state||state.scene!==pacScene)buildScene();
    return true;
  }

  function scaledDistance(a,b){return Math.hypot((a.x-b.x)*1.55,a.y-b.y)}

  function exitPosition(index,elapsed){
    const slot=[{x:45,y:51.5},{x:50,y:51.5},{x:55,y:51.5}][index];
    const gate={x:50,y:44.5};
    const exit=cellPoint(GATE.c,GATE.r);
    const def=GHOST_DEFS[index];
    if(elapsed<def.exitAt)return{x:slot.x,y:slot.y+Math.sin(elapsed/230+index)*.6};
    const t=clamp((elapsed-def.exitAt)/EXIT_DURATION,0,1);
    if(t<.58){const u=smooth(t/.58);return{x:lerp(slot.x,gate.x,u),y:lerp(slot.y,gate.y,u)}}
    const u=smooth((t-.58)/.42);return{x:lerp(gate.x,exit.x,u),y:lerp(gate.y,exit.y,u)};
  }

  function updateGhost(index,dt,pac,running){
    const def=GHOST_DEFS[index],gs=state.ghostState[index],elapsed=state.activeMs;
    if(elapsed<def.exitAt+EXIT_DURATION){
      const p=exitPosition(index,elapsed);gs.pos=p;return p;
    }

    const route=GHOST_ROUTES[index];
    if(running){
      let nextTravel=gs.travel+def.speed*dt*gs.direction;
      let candidate=pointAlongDistance(route,nextTravel);
      const safe=7.6;
      if(scaledDistance(candidate,pac)<safe){
        gs.blocked+=dt;
        if(gs.blocked>420){gs.direction*=-1;gs.blocked=0}
        nextTravel=gs.travel+def.speed*dt*gs.direction;
        candidate=pointAlongDistance(route,nextTravel);
        if(scaledDistance(candidate,pac)>=safe){gs.travel=nextTravel}
      }else{
        gs.blocked=0;gs.travel=nextTravel;
      }
    }

    const target=pointAlongDistance(route,gs.travel);
    if(!gs.pos)gs.pos={x:target.x,y:target.y};
    const alpha=1-Math.exp(-dt/85);
    let next={x:lerp(gs.pos.x,target.x,alpha),y:lerp(gs.pos.y,target.y,alpha)};
    if(scaledDistance(next,pac)<6.8){
      const altA=pointAlongDistance(route,gs.travel+10);
      const altB=pointAlongDistance(route,gs.travel-10);
      const better=scaledDistance(altA,pac)>scaledDistance(altB,pac)?altA:altB;
      next={x:lerp(gs.pos.x,better.x,Math.min(1,alpha*1.9)),y:lerp(gs.pos.y,better.y,Math.min(1,alpha*1.9))};
    }
    gs.pos=next;return next;
  }

  function animate(now){
    if(!ensureScene()||!state)return;
    const dt=Math.min(50,Math.max(0,now-state.lastNow));state.lastNow=now;
    const running=(stageStatus?.textContent.trim()||'')==='Running';
    if(running)state.activeMs+=dt;

    const p=progressNow(now),finished=p>=.999,pac=pointAlong(COVER_ROUTE,p);
    if(state.player){
      state.player.style.left=`${pac.x}%`;state.player.style.top=`${pac.y}%`;state.player.style.setProperty('--dir',`${pac.angle}deg`);
      const bite=running&&!finished?(Math.sin(now/88)*.5+.5):.2;
      state.player.style.setProperty('--mouth-top',`${30+bite*12}%`);state.player.style.setProperty('--mouth-bottom',`${70-bite*12}%`);
    }

    state.ghosts.forEach((ghost,i)=>{
      const gp=updateGhost(i,dt,pac,running);
      ghost.style.left=`${gp.x}%`;ghost.style.top=`${gp.y}%`;
    });

    state.pellets.forEach((pellet,i)=>pellet.classList.toggle('eaten',p>=PELLETS[i].threshold));

    const ghostsClear=state.activeMs>=GHOST_DEFS[GHOST_DEFS.length-1].exitAt+EXIT_DURATION;
    state.gate?.classList.toggle('open',ghostsClear);
    state.cupcake?.classList.toggle('show',ghostsClear&&!finished);
    state.cupcake?.classList.toggle('eaten',finished);
    if(state.ready)state.ready.style.opacity=running||finished?'0':'1';
    state.scene.classList.toggle('pac8-finished',finished);
  }

  const observer=new MutationObserver(()=>{state=null});observer.observe(sceneLayer,{childList:true,subtree:true});
  function tick(now){animate(now);raf=requestAnimationFrame(tick)}
  cancelAnimationFrame(raf);raf=requestAnimationFrame(tick);
})();

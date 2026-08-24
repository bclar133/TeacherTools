(() => {
  'use strict';

  if (window.__pacmanUpgradeV9) return;
  window.__pacmanUpgradeV9 = true;

  const sceneLayer = document.getElementById('sceneLayer');
  const stageStatus = document.getElementById('stageStatus');
  const display = document.getElementById('countdownDisplay');
  const minutesInput = document.getElementById('countdownMinutes');
  const secondsInput = document.getElementById('countdownSeconds');
  if (!sceneLayer || !display) return;

  ['pacmanUpgradeStyleV4','pacmanUpgradeStyleV5','pacmanUpgradeStyleV6','pacmanUpgradeStyleV7','pacmanUpgradeStyleV8','pacmanUpgradeStyleV9']
    .forEach(id => document.getElementById(id)?.remove());

  const style = document.createElement('style');
  style.id = 'pacmanUpgradeStyleV9';
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

    .xt-pacman.pac9-upgraded{background:#000!important;overflow:hidden!important}
    .pac9-score{
      position:absolute;left:40%;right:4%;top:2.7%;display:flex;justify-content:center;gap:4.5rem;
      color:#fff;z-index:3;opacity:.88;font:700 clamp(.62rem,1.2vw,.96rem)/1.05 "Courier New",Courier,monospace;
      letter-spacing:.08em;text-align:center;pointer-events:none
    }
    .pac9-score strong{display:block;margin-top:.25rem;font-size:1.1em}

    .pac9-board{
      position:absolute;left:6%;right:4%;top:17%;bottom:4.5%;background:#000;border:5px solid #214dff;
      border-radius:16px;box-shadow:0 0 13px rgba(49,82,255,.48),inset 0 0 0 2px #0b173b;overflow:hidden;z-index:2
    }
    .pac9-grid{position:absolute;inset:2.4%;display:grid;grid-template-columns:repeat(17,1fr);grid-template-rows:repeat(11,1fr)}
    .pac9-wall{position:relative;background:#071444;box-shadow:inset 0 0 0 3px #2452ff,inset 0 0 0 6px #0a1d72}
    .pac9-floor,.pac9-actors{position:absolute;inset:2.4%;pointer-events:none}

    .pac9-pellet{position:absolute;width:7px;height:7px;border-radius:50%;transform:translate(-50%,-50%);background:#ffe1a5;box-shadow:0 0 5px rgba(255,225,165,.48);transition:opacity .09s linear}
    .pac9-pellet.power{width:15px;height:15px;background:#fff1cf;box-shadow:0 0 9px rgba(255,241,207,.82);animation:pac9Power .7s steps(2,end) infinite}
    .pac9-pellet.eaten{opacity:0}
    @keyframes pac9Power{50%{opacity:.28}}

    .pac9-player{
      position:absolute;width:34px;height:34px;border-radius:50%;transform:translate(-50%,-50%) rotate(var(--dir,0deg));
      transform-origin:50% 50%;background:#ffda18;z-index:9;filter:drop-shadow(0 0 6px rgba(255,218,24,.35));
      clip-path:polygon(100% 0,100% var(--mouth-top,33%),56% 50%,100% var(--mouth-bottom,67%),100% 100%,0 100%,0 0);
      will-change:left,top,transform
    }
    .pac9-player::after{content:'';position:absolute;width:4px;height:4px;border-radius:50%;background:#141414;right:8px;top:6px}

    /* The pen sits over the central WALL BLOCK, not over a playable corridor. */
    .pac9-pen{
      position:absolute;left:50%;top:61%;width:14%;height:9.5%;transform:translate(-50%,-50%);
      border:4px solid #2452ff;border-radius:7px;background:#000;box-shadow:0 0 7px rgba(36,82,255,.4);z-index:5
    }
    .pac9-pen::before{
      content:'';position:absolute;left:50%;top:-8px;width:42%;height:10px;transform:translateX(-50%);background:#000
    }
    .pac9-gate{position:absolute;left:50%;top:-4px;width:36%;height:4px;transform:translateX(-50%);background:#ff8dcc;box-shadow:0 0 4px #ff8dcc;transition:opacity .35s,transform .35s}
    .pac9-gate.open{opacity:.12;transform:translateX(-50%) scaleX(.08)}

    .pac9-ghost{position:absolute;width:28px;height:28px;transform:translate(-50%,-50%);z-index:8;filter:drop-shadow(0 2px 2px rgba(0,0,0,.45));will-change:left,top}
    .pac9-ghost-body{position:absolute;inset:0;border-radius:50% 50% 12% 12% / 54% 54% 18% 18%;background:var(--ghost);clip-path:polygon(0 0,100% 0,100% 86%,86% 100%,70% 86%,54% 100%,38% 86%,22% 100%,8% 86%,0 92%)}
    .pac9-eye{position:absolute;top:8px;width:7px;height:9px;border-radius:50%;background:#fff;z-index:2}
    .pac9-eye.e1{left:5px}.pac9-eye.e2{right:5px}
    .pac9-eye::after{content:'';position:absolute;width:3px;height:4px;border-radius:50%;background:#1739a8;left:2px;top:3px}

    .pac9-cupcake{position:absolute;left:50%;top:61%;width:32px;height:32px;transform:translate(-50%,-50%) scale(.7);z-index:6;opacity:0;filter:drop-shadow(0 0 6px rgba(255,144,205,.5));transition:opacity .32s,transform .32s}
    .pac9-cupcake.show{opacity:1;transform:translate(-50%,-50%) scale(1);animation:pac9CupcakeBob 1s ease-in-out infinite alternate}
    .pac9-cupcake svg{width:100%;height:100%;display:block}
    @keyframes pac9CupcakeBob{to{transform:translate(-50%,-55%) scale(1.04)}}

    .pac9-ready,.pac9-clear{position:absolute;left:50%;transform:translate(-50%,-50%);font-family:"Courier New",Courier,monospace;font-weight:900;letter-spacing:.09em;pointer-events:none;z-index:12;text-align:center}
    .pac9-ready{top:46%;color:#ffe12c;font-size:clamp(.9rem,1.8vw,1.4rem)}
    .pac9-clear{top:50%;color:#ffe12c;font-size:clamp(1.9rem,4.7vw,3.8rem);opacity:0;text-shadow:0 0 12px rgba(255,225,44,.55);transition:opacity .22s ease,transform .22s ease}
    .pac9-finished .pac9-clear{opacity:.98;transform:translate(-50%,-50%) scale(1)}

    @media(max-width:760px){
      #countdownStage.theme-pacman .time-display-wrap{left:2%!important;top:1.4%!important;max-width:40%!important}
      #countdownStage.theme-pacman #countdownDisplay,#countdownStage.theme-pacman .time-display{font-size:clamp(1.8rem,8vw,3rem)!important}
      .pac9-score{left:43%;right:2%;gap:1.4rem;font-size:.54rem}
      .pac9-board{left:3%;right:2%;top:20%;bottom:3%}
      .pac9-wall{box-shadow:inset 0 0 0 2px #2452ff,inset 0 0 0 4px #0a1d72}
      .pac9-player{width:29px;height:29px}.pac9-player::after{width:3px;height:3px;right:7px;top:5px}
      .pac9-ghost{width:24px;height:24px}
      .pac9-pellet{width:6px;height:6px}.pac9-pellet.power{width:12px;height:12px}
      .pac9-cupcake{width:26px;height:26px}
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
  const START={c:1,r:1};
  const GATE={c:8,r:5};
  const PEN_CENTER={x:50,y:61};

  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const smooth=t=>t*t*(3-2*t);
  const key=(c,r)=>`${c},${r}`;
  const cellPoint=(c,r)=>({x:(c+.5)/COLS*100,y:(r+.5)/ROWS*100});

  function walkable(c,r){
    return r>=0&&r<ROWS&&c>=0&&c<COLS&&GRID[r][c]==='.';
  }
  function neighbours(c,r){
    return [[1,0],[0,1],[-1,0],[0,-1]]
      .map(([dc,dr])=>({c:c+dc,r:r+dr}))
      .filter(n=>walkable(n.c,n.r));
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

  function makeCoverRoute(){
    const visited=new Set();
    const route=[];
    function dfs(c,r){
      visited.add(key(c,r));
      route.push({c,r});
      for(const n of neighbours(c,r)){
        if(!visited.has(key(n.c,n.r))){dfs(n.c,n.r);route.push({c,r})}
      }
    }
    dfs(START.c,START.r);
    return route;
  }

  function joinPaths(targets){
    const out=[GATE];let current=GATE;
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
  const COVER_POINTS=COVER_CELLS.map(p=>cellPoint(p.c,p.r));
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
    {color:'#ff5b57',exitAt:350,speed:.0138},
    {color:'#59d9ff',exitAt:1200,speed:.0128},
    {color:'#ff8ed3',exitAt:2050,speed:.0132}
  ];
  const EXIT_DURATION=700;

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
    const current=parseRemaining();
    if(current===null)return state?.lastProgress??0;
    const status=(stageStatus?.textContent.trim()||'').toLowerCase();
    const total=totalSeconds();
    const paused=status.includes('pause');
    const running=!paused&&current>0&&current<total;
    if(displayedRemaining===null||current!==displayedRemaining||status!==lastStatus){
      displayedRemaining=current;displayChangedAt=now;lastStatus=status;
    }
    let estimated=current;
    if(running&&current>0)estimated=Math.max(0,current-(now-displayChangedAt)/1000);
    return clamp(1-estimated/total,0,1);
  }

  function ghostMarkup(i,color){return `<div class="pac9-ghost g${i}" style="--ghost:${color}"><div class="pac9-ghost-body"></div><i class="pac9-eye e1"></i><i class="pac9-eye e2"></i></div>`}
  function cupcakeMarkup(){return `<div class="pac9-cupcake" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M11 20 H29 L26 36 H14 Z" fill="#8a583e"/><path d="M9 20 Q10 12 16 13 Q18 7 23 11 Q29 9 31 16 Q34 18 30 22 H10 Q7 21 9 20 Z" fill="#f7a4cf"/><circle cx="17" cy="14" r="2" fill="#ffdf59"/><circle cx="25" cy="13" r="2" fill="#65c6ff"/><circle cx="22" cy="18" r="2" fill="#9ce46b"/></svg></div>`}

  function buildScene(){
    const walls=GRID.flatMap((row,r)=>[...row].map((ch,c)=>ch==='#'?`<i class="pac9-wall" style="grid-column:${c+1};grid-row:${r+1}"></i>`:'')).join('');
    const pellets=PELLETS.map((p,i)=>`<i class="pac9-pellet${powerKeys.has(key(p.c,p.r))?' power':''}" data-pellet="${i}" style="left:${p.x}%;top:${p.y}%"></i>`).join('');

    sceneLayer.innerHTML=`<div class="xt-scene xt-pacman pac9-upgraded" data-xt-theme="pacman">
      <div class="pac9-score"><div>1UP<strong>00</strong></div><div>HIGH SCORE<strong>00</strong></div></div>
      <div class="pac9-board">
        <div class="pac9-grid">${walls}</div>
        <div class="pac9-floor">${pellets}</div>
        <div class="pac9-actors">
          <div class="pac9-pen"><div class="pac9-gate"></div></div>
          ${cupcakeMarkup()}
          <div class="pac9-player"></div>
          ${ghostMarkup(1,GHOST_DEFS[0].color)}${ghostMarkup(2,GHOST_DEFS[1].color)}${ghostMarkup(3,GHOST_DEFS[2].color)}
          <div class="pac9-ready">READY!</div><div class="pac9-clear">LEVEL CLEAR!</div>
        </div>
      </div>
    </div>`;

    const scene=sceneLayer.querySelector('.pac9-upgraded');
    state={
      scene,player:scene.querySelector('.pac9-player'),ghosts:[...scene.querySelectorAll('.pac9-ghost')],
      pellets:[...scene.querySelectorAll('.pac9-pellet')],ready:scene.querySelector('.pac9-ready'),gate:scene.querySelector('.pac9-gate'),
      cupcake:scene.querySelector('.pac9-cupcake'),lastNow:performance.now(),lastProgress:0,finishedLatched:false,
      ghostState:GHOST_DEFS.map((d,i)=>({travel:GHOST_ROUTES[i].total*(.11+i*.23),direction:i===1?-1:1,velocity:0,pos:null,avoidUntil:0}))
    };
  }

  function ensureScene(){
    const pacScene=sceneLayer.querySelector('.xt-pacman[data-xt-theme="pacman"]');
    if(!pacScene){state=null;return false}
    if(!pacScene.classList.contains('pac9-upgraded')){buildScene();return true}
    if(!state||state.scene!==pacScene)buildScene();
    return true;
  }

  function scaledDistance(a,b){return Math.hypot((a.x-b.x)*1.45,a.y-b.y)}

  function exitPosition(index,elapsed){
    const slot=[{x:46,y:61},{x:50,y:61},{x:54,y:61}][index];
    const gate={x:50,y:55.2};
    const exit=cellPoint(GATE.c,GATE.r);
    const def=GHOST_DEFS[index];
    if(elapsed<def.exitAt)return{x:slot.x,y:slot.y+Math.sin(elapsed/210+index)*.45};
    const t=clamp((elapsed-def.exitAt)/EXIT_DURATION,0,1);
    if(t<.55){const u=smooth(t/.55);return{x:lerp(slot.x,gate.x,u),y:lerp(slot.y,gate.y,u)}}
    const u=smooth((t-.55)/.45);return{x:lerp(gate.x,exit.x,u),y:lerp(gate.y,exit.y,u)};
  }

  function updateGhost(index,dt,pac,elapsed,running){
    const def=GHOST_DEFS[index],gs=state.ghostState[index];
    if(elapsed<def.exitAt+EXIT_DURATION){
      const p=exitPosition(index,elapsed);gs.pos=p;return p;
    }

    const route=GHOST_ROUTES[index];
    const current=pointAlongDistance(route,gs.travel);
    const lookAhead=pointAlongDistance(route,gs.travel+gs.direction*8);
    const danger=scaledDistance(current,pac)<7.5||scaledDistance(lookAhead,pac)<7.5;

    if(danger&&elapsed>gs.avoidUntil){
      gs.direction*=-1;
      gs.avoidUntil=elapsed+1200;
    }

    const targetVelocity=(running?def.speed:0)*gs.direction;
    const accel=1-Math.exp(-dt/230);
    gs.velocity=lerp(gs.velocity,targetVelocity,accel);
    gs.travel+=gs.velocity*dt;

    const target=pointAlongDistance(route,gs.travel);
    if(!gs.pos)gs.pos={x:target.x,y:target.y};
    const alpha=1-Math.exp(-dt/75);
    gs.pos={x:lerp(gs.pos.x,target.x,alpha),y:lerp(gs.pos.y,target.y,alpha)};

    if(scaledDistance(gs.pos,pac)<5.8){
      gs.direction*=-1;
      gs.velocity*=-.35;
      gs.avoidUntil=elapsed+1400;
    }
    return gs.pos;
  }

  function animate(now){
    if(!ensureScene()||!state)return;
    const dt=Math.min(50,Math.max(0,now-state.lastNow));state.lastNow=now;
    let p=progressNow(now);
    const current=parseRemaining();

    if(state.finishedLatched&&current!==null&&current>=totalSeconds()-.25){
      state.finishedLatched=false;state.lastProgress=0;
    }
    state.lastProgress=Math.max(state.lastProgress,p);
    p=state.lastProgress;
    if(p>=.995||current===0)state.finishedLatched=true;
    const finished=state.finishedLatched;

    const status=(stageStatus?.textContent.trim()||'').toLowerCase();
    const paused=status.includes('pause');
    const running=!paused&&!finished&&p>0;
    const elapsed=p*totalSeconds()*1000;

    const pac=pointAlong(COVER_ROUTE,Math.min(p,.995));
    if(state.player){
      state.player.style.left=`${pac.x}%`;state.player.style.top=`${pac.y}%`;state.player.style.setProperty('--dir',`${pac.angle}deg`);
      const bite=running?(Math.sin(now/88)*.5+.5):.2;
      state.player.style.setProperty('--mouth-top',`${30+bite*12}%`);state.player.style.setProperty('--mouth-bottom',`${70-bite*12}%`);
    }

    state.ghosts.forEach((ghost,i)=>{
      const gp=updateGhost(i,dt,pac,elapsed,running);
      ghost.style.left=`${gp.x}%`;ghost.style.top=`${gp.y}%`;
    });

    state.pellets.forEach((pellet,i)=>pellet.classList.toggle('eaten',p>=PELLETS[i].threshold));

    const ghostsClear=elapsed>=GHOST_DEFS[GHOST_DEFS.length-1].exitAt+EXIT_DURATION;
    state.gate?.classList.toggle('open',ghostsClear);
    state.cupcake?.classList.toggle('show',ghostsClear);
    if(state.ready)state.ready.style.opacity=p>0||finished?'0':'1';
    state.scene.classList.toggle('pac9-finished',finished);
  }

  const observer=new MutationObserver(()=>{state=null});
  observer.observe(sceneLayer,{childList:true,subtree:true});
  function tick(now){animate(now);raf=requestAnimationFrame(tick)}
  cancelAnimationFrame(raf);raf=requestAnimationFrame(tick);
})();

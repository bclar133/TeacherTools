(() => {
  'use strict';

  if (window.__pacmanUpgradeV6) return;
  window.__pacmanUpgradeV6 = true;

  const sceneLayer = document.getElementById('sceneLayer');
  const stageStatus = document.getElementById('stageStatus');
  const display = document.getElementById('countdownDisplay');
  const minutesInput = document.getElementById('countdownMinutes');
  const secondsInput = document.getElementById('countdownSeconds');
  if (!sceneLayer || !display) return;

  document.getElementById('pacmanUpgradeStyleV4')?.remove();
  document.getElementById('pacmanUpgradeStyleV5')?.remove();

  const style = document.createElement('style');
  style.id = 'pacmanUpgradeStyleV6';
  style.textContent = `
    #countdownStage.theme-pacman .time-display-wrap{position:absolute!important;left:2.2%!important;right:auto!important;top:1.8%!important;bottom:auto!important;transform:none!important;width:auto!important;max-width:32%!important;z-index:40!important;justify-items:start!important;text-align:left!important}
    #countdownStage.theme-pacman #countdownDisplay,#countdownStage.theme-pacman .time-display{font-family:"Courier New",Courier,monospace!important;font-size:clamp(2.2rem,5vw,4.2rem)!important;line-height:.92!important;font-weight:700!important;font-variant-numeric:tabular-nums!important;letter-spacing:.01em!important;padding:.15em .24em!important;width:auto!important;min-width:0!important;white-space:nowrap!important}
    #countdownStage.theme-pacman .timer-message{font-family:"Courier New",Courier,monospace!important}

    .xt-pacman.pac6-upgraded{background:#000!important;overflow:hidden!important}
    .pac6-score{position:absolute;left:40%;right:4%;top:2.7%;display:flex;justify-content:center;gap:4.5rem;color:#fff;z-index:3;opacity:.88;font:700 clamp(.62rem,1.2vw,.96rem)/1.05 "Courier New",Courier,monospace;letter-spacing:.08em;text-align:center;pointer-events:none}
    .pac6-score strong{display:block;margin-top:.25rem;font-size:1.1em}

    .pac6-board{position:absolute;left:8%;right:5%;top:18%;bottom:5%;background:#000;border:5px solid #214dff;border-radius:16px;box-shadow:0 0 13px rgba(49,82,255,.48),inset 0 0 0 2px #0b173b;overflow:hidden;z-index:2}
    .pac6-grid{position:absolute;inset:2.5%;display:grid;grid-template-columns:repeat(13,1fr);grid-template-rows:repeat(9,1fr);gap:0}
    .pac6-wall{position:relative;background:#071444;box-shadow:inset 0 0 0 4px #2452ff,inset 0 0 0 7px #0a1d72}
    .pac6-floor,.pac6-actors{position:absolute;inset:2.5%;pointer-events:none}

    .pac6-pellet{position:absolute;width:7px;height:7px;border-radius:50%;transform:translate(-50%,-50%);background:#ffe1a5;box-shadow:0 0 5px rgba(255,225,165,.48);transition:opacity .1s linear}
    .pac6-pellet.power{width:15px;height:15px;background:#fff1cf;box-shadow:0 0 9px rgba(255,241,207,.82);animation:pac6Power .7s steps(2,end) infinite}
    .pac6-pellet.eaten{opacity:0}
    @keyframes pac6Power{50%{opacity:.28}}

    .pac6-player{position:absolute;width:36px;height:36px;border-radius:50%;transform:translate(-50%,-50%) rotate(var(--dir,0deg));transform-origin:50% 50%;background:#ffda18;z-index:9;filter:drop-shadow(0 0 6px rgba(255,218,24,.35));clip-path:polygon(100% 0,100% var(--mouth-top,33%),56% 50%,100% var(--mouth-bottom,67%),100% 100%,0 100%,0 0);will-change:left,top,transform}
    .pac6-player::after{content:'';position:absolute;width:4px;height:4px;border-radius:50%;background:#141414;right:9px;top:7px}

    .pac6-pen{position:absolute;left:50%;top:50%;width:168px;height:72px;transform:translate(-50%,-50%);border:4px solid #2452ff;border-radius:8px;background:#000;box-shadow:0 0 7px rgba(36,82,255,.4);z-index:5}
    .pac6-pen::before{content:'';position:absolute;left:50%;top:-4px;width:48px;height:4px;transform:translateX(-50%);background:#ff8dcc;box-shadow:0 0 4px #ff8dcc}
    .pac6-ghost{position:absolute;width:30px;height:30px;transform:translate(-50%,-50%);z-index:7;filter:drop-shadow(0 2px 2px rgba(0,0,0,.45))}
    .pac6-ghost-body{position:absolute;inset:0;border-radius:50% 50% 12% 12% / 54% 54% 18% 18%;background:var(--ghost);clip-path:polygon(0 0,100% 0,100% 86%,86% 100%,70% 86%,54% 100%,38% 86%,22% 100%,8% 86%,0 92%)}
    .pac6-eye{position:absolute;top:9px;width:7px;height:9px;border-radius:50%;background:#fff;z-index:2}
    .pac6-eye.e1{left:6px}.pac6-eye.e2{right:6px}
    .pac6-eye::after{content:'';position:absolute;width:3px;height:4px;border-radius:50%;background:#1739a8;left:2px;top:3px}

    .pac6-ready,.pac6-clear{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-family:"Courier New",Courier,monospace;font-weight:900;letter-spacing:.09em;pointer-events:none;z-index:12;text-align:center}
    .pac6-ready{color:#ffe12c;font-size:clamp(1rem,2vw,1.6rem)}
    .pac6-clear{color:#ffe12c;font-size:clamp(1.9rem,4.7vw,3.8rem);opacity:0;text-shadow:0 0 12px rgba(255,225,44,.55)}
    .pac6-finished .pac6-clear{animation:pac6Clear .8s ease-out forwards}
    @keyframes pac6Clear{0%{opacity:0;transform:translate(-50%,-50%) scale(.55)}55%{opacity:1;transform:translate(-50%,-50%) scale(1.08)}100%{opacity:.96;transform:translate(-50%,-50%) scale(1)}}

    @media(max-width:760px){
      #countdownStage.theme-pacman .time-display-wrap{left:2%!important;top:1.4%!important;max-width:40%!important}
      #countdownStage.theme-pacman #countdownDisplay,#countdownStage.theme-pacman .time-display{font-size:clamp(1.8rem,8vw,3rem)!important}
      .pac6-score{left:43%;right:2%;gap:1.4rem;font-size:.54rem}
      .pac6-board{left:4%;right:3%;top:21%;bottom:4%}
      .pac6-wall{box-shadow:inset 0 0 0 3px #2452ff,inset 0 0 0 5px #0a1d72}
      .pac6-player{width:31px;height:31px}.pac6-player::after{width:3px;height:3px;right:8px;top:6px}
      .pac6-ghost{width:26px;height:26px}
      .pac6-pen{width:132px;height:58px}
      .pac6-pellet{width:6px;height:6px}.pac6-pellet.power{width:12px;height:12px}
    }
  `;
  document.head.appendChild(style);

  const GRID=[
    '#############',
    '#.....#.....#',
    '#.###.#.###.#',
    '#.#.......#.#',
    '#.#.#####.#.#',
    '#...#...#...#',
    '#.###.#.###.#',
    '#.....#.....#',
    '#############'
  ];
  const ROWS=GRID.length,COLS=GRID[0].length;

  const routeCells=[
    [1,1],[2,1],[3,1],[4,1],[5,1],[5,2],[5,3],[4,3],[3,3],[3,4],[3,5],[2,5],[1,5],[1,6],[1,7],[2,7],[3,7],[4,7],[5,7],[5,6],[5,5],[6,5],[7,5],[7,6],[7,7],[8,7],[9,7],[10,7],[11,7],[11,6],[11,5],[10,5],[9,5],[9,4],[9,3],[8,3],[7,3],[7,2],[7,1],[8,1],[9,1],[10,1],[11,1],[11,2],[11,3]
  ];

  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const lerp=(a,b,t)=>a+(b-a)*t;
  let displayedRemaining=null,displayChangedAt=performance.now(),lastStatus='',sceneState=null,raf=0;

  function cellPoint(c,r){return{x:(c+.5)/COLS*100,y:(r+.5)/ROWS*100}}
  const ROUTE=routeCells.map(([c,r])=>cellPoint(c,r));

  function pointAlong(points,t){
    t=clamp(t,0,1);const segs=[];let total=0;
    for(let i=0;i<points.length-1;i++){const a=points[i],b=points[i+1],len=Math.hypot(b.x-a.x,b.y-a.y);segs.push({a,b,len});total+=len}
    let target=t*total;
    for(const seg of segs){if(target<=seg.len){const u=seg.len?target/seg.len:0;return{x:lerp(seg.a.x,seg.b.x,u),y:lerp(seg.a.y,seg.b.y,u),angle:Math.atan2(seg.b.y-seg.a.y,seg.b.x-seg.a.x)*180/Math.PI}}target-=seg.len}
    const a=points[points.length-2],b=points[points.length-1];return{x:b.x,y:b.y,angle:Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI}
  }

  function parseRemaining(){const parts=display.textContent.trim().split(':').map(Number);if(parts.some(v=>!Number.isFinite(v)))return null;if(parts.length===2)return parts[0]*60+parts[1];if(parts.length===3)return parts[0]*3600+parts[1]*60+parts[2];return null}
  function totalSeconds(){return Math.max(1,(Number(minutesInput?.value)||0)*60+(Number(secondsInput?.value)||0))}
  function progressNow(now){const current=parseRemaining();if(current===null)return 0;const status=stageStatus?.textContent.trim()||'',running=status==='Running';if(displayedRemaining===null||current!==displayedRemaining||status!==lastStatus){displayedRemaining=current;displayChangedAt=now;lastStatus=status}let estimated=current;if(running&&current>0)estimated=Math.max(0,current-(now-displayChangedAt)/1000);return clamp(1-estimated/totalSeconds(),0,1)}

  function ghostMarkup(i,color){return `<div class="pac6-ghost g${i}" style="--ghost:${color}"><div class="pac6-ghost-body"></div><i class="pac6-eye e1"></i><i class="pac6-eye e2"></i></div>`}

  function buildScene(){
    const walls=GRID.flatMap((row,r)=>[...row].map((ch,c)=>ch==='#'?`<i class="pac6-wall" style="grid-column:${c+1};grid-row:${r+1}"></i>`:'')).join('');
    const pelletCount=40;
    const pellets=Array.from({length:pelletCount},(_,i)=>{const p=pointAlong(ROUTE,i/(pelletCount-1));const power=i===0||i===13||i===26||i===39;return `<i class="pac6-pellet${power?' power':''}" data-pellet="${i}" style="left:${p.x}%;top:${p.y}%"></i>`}).join('');

    sceneLayer.innerHTML=`<div class="xt-scene xt-pacman pac6-upgraded" data-xt-theme="pacman">
      <div class="pac6-score"><div>1UP<strong>00</strong></div><div>HIGH SCORE<strong>00</strong></div></div>
      <div class="pac6-board">
        <div class="pac6-grid">${walls}</div>
        <div class="pac6-floor">${pellets}</div>
        <div class="pac6-actors">
          <div class="pac6-player"></div>
          <div class="pac6-pen">${ghostMarkup(1,'#ff5b57')}${ghostMarkup(2,'#59d9ff')}${ghostMarkup(3,'#ff8ed3')}</div>
          <div class="pac6-ready">READY!</div><div class="pac6-clear">LEVEL CLEAR!</div>
        </div>
      </div></div>`;

    const scene=sceneLayer.querySelector('.pac6-upgraded');
    sceneState={scene,player:scene.querySelector('.pac6-player'),ghosts:[...scene.querySelectorAll('.pac6-ghost')],pellets:[...scene.querySelectorAll('.pac6-pellet')],ready:scene.querySelector('.pac6-ready')};
  }

  function ensureScene(){const pacScene=sceneLayer.querySelector('.xt-pacman[data-xt-theme="pacman"]');if(!pacScene){sceneState=null;return false}if(!pacScene.classList.contains('pac6-upgraded')){buildScene();return true}if(!sceneState||sceneState.scene!==pacScene){sceneState={scene:pacScene,player:pacScene.querySelector('.pac6-player'),ghosts:[...pacScene.querySelectorAll('.pac6-ghost')],pellets:[...pacScene.querySelectorAll('.pac6-pellet')],ready:pacScene.querySelector('.pac6-ready')}}return true}

  function animate(now){
    if(!ensureScene()||!sceneState)return;
    const p=progressNow(now),running=(stageStatus?.textContent.trim()||'')==='Running',finished=p>=.999,pos=pointAlong(ROUTE,p);
    if(sceneState.player){sceneState.player.style.left=`${pos.x}%`;sceneState.player.style.top=`${pos.y}%`;sceneState.player.style.setProperty('--dir',`${pos.angle}deg`);const bite=running&&!finished?(Math.sin(now/90)*.5+.5):.2;sceneState.player.style.setProperty('--mouth-top',`${30+bite*12}%`);sceneState.player.style.setProperty('--mouth-bottom',`${70-bite*12}%`)}
    const ghostSlots=[{x:24,y:55},{x:50,y:45},{x:76,y:55}];
    sceneState.ghosts.forEach((g,i)=>{const s=ghostSlots[i],bob=Math.sin(now/(450+i*90)+i)*7,wobble=Math.sin(now/(950+i*120)+i)*5;g.style.left=`${s.x+wobble}%`;g.style.top=`${s.y+bob}%`});
    const n=sceneState.pellets.length;sceneState.pellets.forEach((pellet,i)=>pellet.classList.toggle('eaten',p>=i/Math.max(1,n-1)));
    if(sceneState.ready)sceneState.ready.style.opacity=running||finished?'0':'1';sceneState.scene.classList.toggle('pac6-finished',finished);
  }

  const observer=new MutationObserver(()=>{sceneState=null});observer.observe(sceneLayer,{childList:true,subtree:true});
  function tick(now){animate(now);raf=requestAnimationFrame(tick)}
  cancelAnimationFrame(raf);raf=requestAnimationFrame(tick);
})();
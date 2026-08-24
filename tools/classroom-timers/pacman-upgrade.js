(() => {
  'use strict';

  if (window.__pacmanUpgradeV3) return;
  window.__pacmanUpgradeV3 = true;

  const sceneLayer = document.getElementById('sceneLayer');
  const stageStatus = document.getElementById('stageStatus');
  const display = document.getElementById('countdownDisplay');
  const minutesInput = document.getElementById('countdownMinutes');
  const secondsInput = document.getElementById('countdownSeconds');
  const startBtn = document.getElementById('countdownStartBtn');
  const muteBtn = document.getElementById('muteBtn');
  const presentationMuteBtn = document.getElementById('presentationMuteBtn');
  if (!sceneLayer || !display) return;

  const style = document.createElement('style');
  style.id = 'pacmanUpgradeStyleV3';
  style.textContent = `
    #countdownStage.theme-pacman #countdownDisplay,
    #countdownStage.theme-pacman .time-display {
      font-family:"Courier New",Courier,monospace!important;
      font-weight:700!important;
      letter-spacing:.025em!important;
      font-variant-numeric:tabular-nums!important;
    }
    #countdownStage.theme-pacman .timer-message,
    #countdownStage.theme-pacman .stage-kicker {
      font-family:"Courier New",Courier,monospace!important;
    }
    .xt-pacman.pac3-upgraded{background:#000!important;overflow:hidden!important}
    .pac3-scoreboard{
      position:absolute;left:34%;right:5%;top:2.2%;height:8%;display:flex;justify-content:center;gap:14%;
      color:#fff;font:700 clamp(.58rem,1.15vw,.92rem)/1 "Courier New",Courier,monospace;text-align:center;
      letter-spacing:.06em;opacity:.82;pointer-events:none;z-index:2
    }
    .pac3-board{position:absolute;left:3.5%;right:3.5%;top:15.5%;bottom:3.5%;background:#000;overflow:hidden;border-radius:9px}
    .pac3-maze,.pac3-pellets,.pac3-actors{position:absolute;inset:0;width:100%;height:100%}
    .pac3-pellets,.pac3-actors{pointer-events:none}
    .pac3-pellet{
      position:absolute;width:5px;height:5px;border-radius:50%;transform:translate(-50%,-50%);
      background:#ffd7a0;box-shadow:0 0 4px rgba(255,215,160,.5);opacity:1
    }
    .pac3-pellet.power{width:11px;height:11px;background:#fff0ca;box-shadow:0 0 8px rgba(255,240,202,.82);animation:pac3Blink .62s steps(2,end) infinite}
    .pac3-pellet.eaten{opacity:0}
    @keyframes pac3Blink{50%{opacity:.25}}
    .pac3-player{
      position:absolute;width:24px;height:24px;border-radius:50%;transform:translate(-50%,-50%) rotate(var(--dir,0deg));
      transform-origin:50% 50%;background:#ffdb1f;z-index:8;filter:drop-shadow(0 0 4px rgba(255,219,31,.25));
      clip-path:polygon(100% 0,100% var(--mouth-top,35%),58% 50%,100% var(--mouth-bottom,65%),100% 100%,0 100%,0 0)
    }
    .pac3-player::after{content:'';position:absolute;width:3px;height:3px;border-radius:50%;background:#111;right:6px;top:5px}
    .pac3-ghost{position:absolute;width:25px;height:25px;transform:translate(-50%,-50%);z-index:7;filter:drop-shadow(0 0 4px rgba(255,255,255,.08))}
    .pac3-ghost svg{display:block;width:100%;height:100%}
    .pac3-cupcake{position:absolute;width:29px;height:29px;transform:translate(-50%,-50%);z-index:6;filter:drop-shadow(0 0 7px rgba(255,119,186,.55));transition:opacity .18s,transform .18s}
    .pac3-cupcake svg{width:100%;height:100%;display:block}
    .pac3-cupcake.eaten{opacity:0;transform:translate(-50%,-50%) scale(.45) rotate(18deg)}
    .pac3-ready{
      position:absolute;left:50%;top:52.5%;transform:translate(-50%,-50%);color:#ffdf32;
      font:900 clamp(.9rem,2.1vw,1.6rem)/1 "Courier New",Courier,monospace;letter-spacing:.08em;z-index:6
    }
    .pac3-running .pac3-ready,.pac3-finished .pac3-ready{opacity:0}
    @media(max-width:760px){
      .pac3-board{left:2%;right:2%;top:19%;bottom:2.5%}
      .pac3-scoreboard{left:38%;top:3%;font-size:.55rem}
      .pac3-player{width:19px;height:19px}.pac3-ghost{width:20px;height:20px}.pac3-cupcake{width:24px;height:24px}
      .pac3-pellet{width:4px;height:4px}.pac3-pellet.power{width:9px;height:9px}
    }
  `;
  document.head.appendChild(style);

  const MAZE = [
    "############################",
    "#............##............#",
    "#.####.#####.##.#####.####.#",
    "#o####.#####.##.#####.####o#",
    "#.####.#####.##.#####.####.#",
    "#..........................#",
    "#.####.##.########.##.####.#",
    "#.####.##.########.##.####.#",
    "#......##....##....##......#",
    "######.#####.##.#####.######",
    "######.#####.##.#####.######",
    "######.##..........##.######",
    "######.##.###gg###.##.######",
    "######.##.#gggggg#.##.######",
    "..........#gggggg#..........",
    "######.##.#gggggg#.##.######",
    "######.##.########.##.######",
    "######.##..........##.######",
    "######.##.########.##.######",
    "######.##.########.##.######",
    "#............##............#",
    "#.####.#####.##.#####.####.#",
    "#.####.#####.##.#####.####.#",
    "#o..##.......P........##..o#",
    "###.##.##.########.##.##.###",
    "###.##.##.########.##.##.###",
    "#......##....##....##......#",
    "#.##########.##.##########.#",
    "#.##########.##.##########.#",
    "#.........................C#",
    "############################"
  ];
  const ROWS=MAZE.length,COLS=MAZE[0].length;
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const cellKey=(x,y)=>`${x},${y}`;
  const cellToPct=(x,y)=>({x:(x+.5)/COLS*100,y:(y+.5)/ROWS*100});

  let displayedRemaining=null, displayChangedAt=performance.now(), lastStatus='', lastScene=null, state=null, raf=0;
  let audioCtx=null, masterGain=null, lastPelletSound=-1, finishPlayed=false, nextSirenAt=0, sirenPhase=0;

  function muted(){
    try{const stored=localStorage.getItem('ttTimers.muted');if(stored!==null)return JSON.parse(stored)===true;}catch{}
    return muteBtn?.getAttribute('aria-pressed')==='true'||presentationMuteBtn?.getAttribute('aria-pressed')==='true';
  }
  function ensureAudio(){
    if(audioCtx)return audioCtx;
    const Ctor=window.AudioContext||window.webkitAudioContext;if(!Ctor)return null;
    audioCtx=new Ctor();masterGain=audioCtx.createGain();masterGain.gain.value=.72;
    const comp=audioCtx.createDynamicsCompressor();comp.threshold.value=-19;comp.knee.value=10;comp.ratio.value=4;comp.attack.value=.004;comp.release.value=.12;
    masterGain.connect(comp).connect(audioCtx.destination);return audioCtx;
  }
  function unlockAudio(){if(muted())return;const ctx=ensureAudio();if(ctx?.state==='suspended')ctx.resume().catch(()=>{});}
  document.addEventListener('pointerdown',unlockAudio,{capture:true,passive:true});
  document.addEventListener('keydown',unlockAudio,{capture:true});
  startBtn?.addEventListener('pointerdown',unlockAudio,{capture:true,passive:true});
  startBtn?.addEventListener('click',unlockAudio,{capture:true});

  function tone(freq,duration,gain=.03,type='square',delay=0,endFreq=null){
    if(muted())return;const ctx=ensureAudio();if(!ctx||!masterGain)return;
    const fire=()=>{if(ctx.state!=='running'||muted())return;const at=ctx.currentTime+delay,osc=ctx.createOscillator(),g=ctx.createGain();
      osc.type=type;osc.frequency.setValueAtTime(freq,at);if(endFreq)osc.frequency.exponentialRampToValueAtTime(endFreq,at+duration*.9);
      g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(gain,at+.004);g.gain.exponentialRampToValueAtTime(.0001,at+duration);
      osc.connect(g).connect(masterGain);osc.start(at);osc.stop(at+duration+.01);};
    if(ctx.state==='running')fire();else ctx.resume().then(fire).catch(()=>{});
  }
  function waka(i){const high=i%2===0;tone(high?520:410,.052,.032,'square',0,high?350:300);}
  function chasePulse(){const f=sirenPhase++%2===0?165:225;tone(f,.14,.012,'sawtooth',0,f*1.22);}
  function cupcakeSound(){if(finishPlayed)return;finishPlayed=true;tone(523,.09,.045,'triangle',0,660);tone(659,.09,.045,'triangle',.09,784);tone(784,.15,.05,'triangle',.18,1046);}

  function parseRemaining(){
    const parts=display.textContent.trim().split(':').map(Number);if(parts.some(v=>!Number.isFinite(v)))return null;
    if(parts.length===2)return parts[0]*60+parts[1];if(parts.length===3)return parts[0]*3600+parts[1]*60+parts[2];return null;
  }
  function totalSeconds(){return Math.max(1,(Number(minutesInput?.value)||0)*60+(Number(secondsInput?.value)||0));}
  function progressNow(now){
    const current=parseRemaining();if(current===null)return 0;const status=stageStatus?.textContent.trim()||'',running=status==='Running';
    if(displayedRemaining===null||current!==displayedRemaining||status!==lastStatus){displayedRemaining=current;displayChangedAt=now;lastStatus=status;}
    let estimated=current;if(running&&current>0)estimated=Math.max(0,current-(now-displayChangedAt)/1000);
    return clamp(1-estimated/totalSeconds(),0,1);
  }

  function findChar(ch){for(let y=0;y<ROWS;y++){const x=MAZE[y].indexOf(ch);if(x>=0)return{x,y};}return null;}
  const START=findChar('P'),CUPCAKE=findChar('C');

  function pacPassable(x,y,allowCupcake=false){
    if(x<0||x>=COLS||y<0||y>=ROWS)return false;
    const ch=MAZE[y][x];if(ch==='#'||ch==='g')return false;if(ch==='C'&&!allowCupcake)return false;return true;
  }
  function neighbours(x,y,allowCupcake=false){
    return [{x:x+1,y},{x,y:y-1},{x:x-1,y},{x,y:y+1}].filter(n=>pacPassable(n.x,n.y,allowCupcake));
  }
  function shortestPath(start,end){
    const q=[start],prev=new Map(),seen=new Set([cellKey(start.x,start.y)]);
    while(q.length){const cur=q.shift();if(cur.x===end.x&&cur.y===end.y)break;
      for(const n of neighbours(cur.x,cur.y,true)){const k=cellKey(n.x,n.y);if(seen.has(k))continue;seen.add(k);prev.set(k,cur);q.push(n);}}
    const out=[];let cur=end;while(cur){out.push(cur);if(cur.x===start.x&&cur.y===start.y)break;cur=prev.get(cellKey(cur.x,cur.y));}
    return out.reverse();
  }
  function buildWalk(){
    const seen=new Set(),walk=[];
    function dfs(x,y){const k=cellKey(x,y);seen.add(k);walk.push({x,y});
      for(const n of neighbours(x,y,false)){const nk=cellKey(n.x,n.y);if(!seen.has(nk)){dfs(n.x,n.y);walk.push({x,y});}}}
    dfs(START.x,START.y);
    const tail=shortestPath(walk[walk.length-1],CUPCAKE);for(let i=1;i<tail.length;i++)walk.push(tail[i]);
    return walk;
  }

  function boundarySvg(){
    const cw=100/COLS,ch=100/ROWS;let fillRects='',d='';
    const isWall=(x,y)=>x<0||x>=COLS||y<0||y>=ROWS||MAZE[y][x]==='#';
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(MAZE[y][x]==='#'){
      const x0=x*cw,y0=y*ch,x1=(x+1)*cw,y1=(y+1)*ch;
      fillRects+=`<rect x="${x0}" y="${y0}" width="${cw+.03}" height="${ch+.03}" fill="#030726"/>`;
      if(!isWall(x,y-1))d+=`M${x0},${y0}L${x1},${y0}`;
      if(!isWall(x+1,y))d+=`M${x1},${y0}L${x1},${y1}`;
      if(!isWall(x,y+1))d+=`M${x1},${y1}L${x0},${y1}`;
      if(!isWall(x-1,y))d+=`M${x0},${y1}L${x0},${y0}`;
    }
    const gx=11*cw,gy=13*ch,gw=6*cw,gh=3*ch;
    return `<svg class="pac3-maze" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <rect width="100" height="100" fill="#000"/>${fillRects}
      <path d="${d}" fill="none" stroke="#0a1a94" stroke-width=".9" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${d}" fill="none" stroke="#2c55ff" stroke-width=".34" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" rx=".8" fill="#000" stroke="#2c55ff" stroke-width=".34"/>
      <line x1="${13*cw}" x2="${15*cw}" y1="${13*ch}" y2="${13*ch}" stroke="#ff9ed9" stroke-width=".5" stroke-linecap="round"/>
    </svg>`;
  }

  function ghostSvg(color){return `<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M4 24V12c0-5.5 4.5-10 10-10s10 4.5 10 10v12l-3-2.2-3 2.2-4-2.2-4 2.2-3-2.2z" fill="${color}"/><circle cx="10.3" cy="12" r="3.1" fill="#fff"/><circle cx="17.7" cy="12" r="3.1" fill="#fff"/><circle cx="11.1" cy="13" r="1.5" fill="#234bff"/><circle cx="18.4" cy="13" r="1.5" fill="#234bff"/></svg>`;}
  function cupcakeSvg(){return `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M10 22H30L27 34H13Z" fill="#7a4b2c"/><path d="M9 22c1-7 5-10 9-8 1-4 6-5 9-1 3-1 6 2 4 9Z" fill="#ff9ec9"/><path d="M14 18c2-1 4 0 4 2-1 1-3 1-4 0Z" fill="#fff2aa"/><circle cx="23" cy="12" r="2.3" fill="#ff4d4d"/></svg>`;}

  function buildScene(scene){
    scene.innerHTML=`<div class="pac3-scoreboard"><div>1UP<br>00</div><div>HIGH SCORE<br>00</div></div><div class="pac3-board">${boundarySvg()}<div class="pac3-pellets"></div><div class="pac3-actors"><div class="pac3-cupcake">${cupcakeSvg()}</div><div class="pac3-player"></div><div class="pac3-ghost g1">${ghostSvg('#ff4040')}</div><div class="pac3-ghost g2">${ghostSvg('#ff9fd9')}</div><div class="pac3-ghost g3">${ghostSvg('#5de3ff')}</div><div class="pac3-ghost g4">${ghostSvg('#ffb84d')}</div></div><div class="pac3-ready">READY!</div></div>`;
    scene.classList.add('pac3-upgraded');

    const pelletLayer=scene.querySelector('.pac3-pellets'),pellets=[];
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const ch=MAZE[y][x];if(ch==='.'||ch==='o'){
      const el=document.createElement('i');el.className='pac3-pellet'+(ch==='o'?' power':'');const p=cellToPct(x,y);el.style.left=`${p.x}%`;el.style.top=`${p.y}%`;pelletLayer.appendChild(el);pellets.push({key:cellKey(x,y),el});
    }}
    const walk=buildWalk(),points=walk.map(c=>({...cellToPct(c.x,c.y),cx:c.x,cy:c.y})),firstVisit=new Map();
    walk.forEach((c,i)=>{const k=cellKey(c.x,c.y);if(!firstVisit.has(k))firstVisit.set(k,i);});
    const cake=scene.querySelector('.pac3-cupcake'),cp=cellToPct(CUPCAKE.x,CUPCAKE.y);cake.style.left=`${cp.x}%`;cake.style.top=`${cp.y}%`;
    state={scene,walk,points,firstVisit,pellets,player:scene.querySelector('.pac3-player'),ghosts:[scene.querySelector('.g1'),scene.querySelector('.g2'),scene.querySelector('.g3'),scene.querySelector('.g4')],cake};
    lastPelletSound=-1;finishPlayed=false;nextSirenAt=0;
  }

  function pointAt(indexFloat){
    const max=state.points.length-1,f=clamp(indexFloat,0,max),i=Math.floor(f),u=f-i,a=state.points[i],b=state.points[Math.min(i+1,max)];
    return{x:lerp(a.x,b.x,u),y:lerp(a.y,b.y,u),angle:Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI,index:i};
  }

  function ensureScene(){
    const scene=sceneLayer.querySelector('.xt-pacman[data-xt-theme="pacman"]');if(!scene)return null;
    if(!scene.classList.contains('pac3-upgraded')||!scene.querySelector('.pac3-board'))buildScene(scene);return scene;
  }

  function render(progress,now){
    if(!state)return;display.classList.add('pacman-score-font');
    const running=(stageStatus?.textContent.trim()||'')==='Running';state.scene.classList.toggle('pac3-running',running);state.scene.classList.toggle('pac3-finished',progress>=1);
    const pathPos=progress*(state.points.length-1),pac=pointAt(pathPos),mouth=running?Math.abs(Math.sin(now/82)):0;
    state.player.style.left=`${pac.x}%`;state.player.style.top=`${pac.y}%`;state.player.style.setProperty('--dir',`${pac.angle}deg`);
    state.player.style.setProperty('--mouth-top',`${49-mouth*23}%`);state.player.style.setProperty('--mouth-bottom',`${51+mouth*23}%`);

    let eaten=0;for(const pellet of state.pellets){const idx=state.firstVisit.get(pellet.key),gone=idx!==undefined&&idx<=pac.index;pellet.el.classList.toggle('eaten',gone);if(gone)eaten++;}
    if(running&&eaten>lastPelletSound){for(let i=Math.max(0,lastPelletSound+1);i<eaten;i++)setTimeout(()=>waka(i),(i-Math.max(0,lastPelletSound+1))*12);lastPelletSound=eaten-1;}
    else if(eaten-1<lastPelletSound)lastPelletSound=eaten-1;

    const releases=[.015,.035,.055,.075],gaps=[22,36,50,64],house=[{x:48,y:46},{x:50,y:46},{x:52,y:46},{x:50,y:49}];
    state.ghosts.forEach((ghost,i)=>{
      let gp;if(progress<releases[i])gp=house[i];else{let pos=Math.max(0,pathPos-gaps[i]),tries=0;gp=pointAt(pos);while(Math.hypot(gp.x-pac.x,gp.y-pac.y)<4.5&&tries<4){pos=Math.max(0,pos-12);gp=pointAt(pos);tries++;}}
      ghost.style.left=`${gp.x}%`;ghost.style.top=`${gp.y+Math.sin(now/170+i*1.3)*.35}%`;
    });

    if(progress>=.995){state.cake.classList.add('eaten');if(running||progress>=1)cupcakeSound();}else state.cake.classList.remove('eaten');
    if(running&&progress<1&&now>=nextSirenAt){chasePulse();nextSirenAt=now+420;}
  }

  function loop(now){
    const scene=ensureScene();if(scene!==lastScene){if(!scene)display.classList.remove('pacman-score-font');lastScene=scene||null;displayedRemaining=null;state=null;if(scene)buildScene(scene);}
    if(scene&&state)render(progressNow(now),now);raf=requestAnimationFrame(loop);
  }
  raf=requestAnimationFrame(loop);
})();
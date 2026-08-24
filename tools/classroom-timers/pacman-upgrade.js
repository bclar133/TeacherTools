(() => {
  'use strict';

  if (window.__pacmanUpgradeV4) return;
  window.__pacmanUpgradeV4 = true;

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
  style.id = 'pacmanUpgradeStyleV4';
  style.textContent = `
    #countdownStage.theme-pacman .time-display-wrap {
      position:absolute!important;
      left:2.1%!important;
      right:auto!important;
      top:1.8%!important;
      bottom:auto!important;
      transform:none!important;
      width:auto!important;
      max-width:31%!important;
      z-index:40!important;
      justify-items:start!important;
      text-align:left!important;
    }
    #countdownStage.theme-pacman #countdownDisplay,
    #countdownStage.theme-pacman .time-display {
      font-family:"Courier New",Courier,monospace!important;
      font-size:clamp(2.25rem,5.2vw,4.35rem)!important;
      line-height:.92!important;
      font-weight:700!important;
      letter-spacing:.01em!important;
      font-variant-numeric:tabular-nums!important;
      width:auto!important;
      min-width:0!important;
      padding:.16em .24em!important;
      white-space:nowrap!important;
    }
    #countdownStage.theme-pacman .timer-message,
    #countdownStage.theme-pacman .stage-kicker,
    #countdownStage.theme-pacman .progress-pill {
      font-family:"Courier New",Courier,monospace!important;
    }
    #countdownStage.theme-pacman .progress-pill {
      font-size:clamp(.58rem,1.15vw,.82rem)!important;
    }

    .xt-pacman.pac4-upgraded {
      background:#000!important;
      overflow:hidden!important;
    }
    .pac4-scoreboard {
      position:absolute;
      left:34%;
      right:4%;
      top:2.4%;
      height:8%;
      display:flex;
      justify-content:center;
      gap:14%;
      color:#fff;
      font:700 clamp(.58rem,1.18vw,.94rem)/1 "Courier New",Courier,monospace;
      text-align:center;
      letter-spacing:.06em;
      opacity:.84;
      pointer-events:none;
      z-index:2;
    }
    .pac4-board {
      position:absolute;
      left:3.5%;
      right:3.5%;
      top:16.5%;
      bottom:3.3%;
      background:#000;
      overflow:hidden;
      border-radius:9px;
    }
    .pac4-maze,.pac4-pellets,.pac4-actors {
      position:absolute;
      inset:0;
      width:100%;
      height:100%;
    }
    .pac4-pellets,.pac4-actors { pointer-events:none; }

    .pac4-pellet {
      position:absolute;
      width:5px;
      height:5px;
      border-radius:50%;
      transform:translate(-50%,-50%);
      background:#ffd7a0;
      box-shadow:0 0 4px rgba(255,215,160,.5);
      opacity:1;
    }
    .pac4-pellet.power {
      width:11px;
      height:11px;
      background:#fff0ca;
      box-shadow:0 0 8px rgba(255,240,202,.82);
      animation:pac4Blink .62s steps(2,end) infinite;
    }
    .pac4-pellet.eaten { opacity:0; }
    @keyframes pac4Blink { 50% { opacity:.24; } }

    .pac4-player {
      position:absolute;
      width:18px;
      height:18px;
      border-radius:50%;
      transform:translate(-50%,-50%) rotate(var(--dir,0deg));
      transform-origin:50% 50%;
      background:#ffdb1f;
      z-index:8;
      filter:drop-shadow(0 0 3px rgba(255,219,31,.22));
      clip-path:polygon(100% 0,100% var(--mouth-top,35%),58% 50%,100% var(--mouth-bottom,65%),100% 100%,0 100%,0 0);
      will-change:left,top,transform,clip-path;
    }
    .pac4-player::after {
      content:'';
      position:absolute;
      width:2.4px;
      height:2.4px;
      border-radius:50%;
      background:#111;
      right:4.5px;
      top:3.8px;
    }
    .pac4-ghost {
      position:absolute;
      width:18px;
      height:18px;
      transform:translate(-50%,-50%);
      z-index:7;
      filter:drop-shadow(0 0 3px rgba(255,255,255,.08));
      will-change:left,top;
    }
    .pac4-ghost svg { display:block;width:100%;height:100%; }

    .pac4-gate {
      stroke:#ff8fd3;
      stroke-width:.23;
      stroke-linecap:round;
      transform-box:fill-box;
      transform-origin:center;
      transition:transform .35s ease,opacity .35s ease;
      filter:drop-shadow(0 0 .18px #ffb9e5);
    }
    .pac4-gate.open {
      transform:scaleX(.04);
      opacity:.18;
    }

    .pac4-cupcake {
      position:absolute;
      width:25px;
      height:25px;
      transform:translate(-50%,-50%);
      z-index:6;
      opacity:.4;
      filter:grayscale(.45) drop-shadow(0 0 5px rgba(255,119,186,.35));
      transition:opacity .25s,filter .25s,transform .18s;
    }
    .pac4-cupcake.ready {
      opacity:1;
      filter:drop-shadow(0 0 8px rgba(255,119,186,.65));
    }
    .pac4-cupcake.eaten {
      opacity:0;
      transform:translate(-50%,-50%) scale(.42) rotate(18deg);
    }
    .pac4-cupcake svg { width:100%;height:100%;display:block; }

    .pac4-ready {
      position:absolute;
      left:50%;
      top:55%;
      transform:translate(-50%,-50%);
      color:#ffdf32;
      font:900 clamp(.9rem,2vw,1.5rem)/1 "Courier New",Courier,monospace;
      letter-spacing:.08em;
      z-index:6;
    }
    .pac4-running .pac4-ready,.pac4-finished .pac4-ready { opacity:0; }

    @media(max-width:760px) {
      #countdownStage.theme-pacman .time-display-wrap {
        left:2%!important;top:1.5%!important;max-width:38%!important;
      }
      #countdownStage.theme-pacman #countdownDisplay,
      #countdownStage.theme-pacman .time-display {
        font-size:clamp(1.75rem,8vw,3rem)!important;
      }
      .pac4-board { left:2%;right:2%;top:19%;bottom:2.5%; }
      .pac4-scoreboard { left:40%;top:2.4%;font-size:.54rem;gap:9%; }
      .pac4-pellet { width:4px;height:4px; }
      .pac4-pellet.power { width:8px;height:8px; }
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
    "     #.#####.##.#####.#     ",
    "     #.##..........##.#     ",
    "     #.##.###gg###.##.#     ",
    "######.##.#cccccc#.##.######",
    "..........#cccccc#..........",
    "######.##.#cccccc#.##.######",
    "     #.##.########.##.#     ",
    "     #.##..........##.#     ",
    "     #.##.########.##.#     ",
    "######.##.########.##.######",
    "#............##............#",
    "#.####.#####.##.#####.####.#",
    "#.####.#####.##.#####.####.#",
    "#o..##................##..o#",
    "###.##.##.########.##.##.###",
    "###.##.##.########.##.##.###",
    "#......##....##....##......#",
    "#.##########.##.##########.#",
    "#.##########.##.##########.#",
    "#..........................#",
    "############################"
  ];

  const ROWS=MAZE.length;
  const COLS=MAZE[0].length;
  const TUNNEL_Y=14;
  const START={x:13,y:29};
  const CUPCAKE={x:13,y:14};
  const PELLET_END=.91;

  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const cellKey=(x,y)=>`${x},${y}`;

  let displayedRemaining=null;
  let displayChangedAt=performance.now();
  let lastStatus='';
  let lastScene=null;
  let state=null;
  let raf=0;

  let audioCtx=null;
  let masterGain=null;
  let lastPelletSound=-1;
  let finishPlayed=false;
  let sirenPhase=0;
  let nextSirenAt=0;

  function muted(){
    try{
      const stored=localStorage.getItem('ttTimers.muted');
      if(stored!==null) return JSON.parse(stored)===true;
    }catch{}
    return muteBtn?.getAttribute('aria-pressed')==='true' || presentationMuteBtn?.getAttribute('aria-pressed')==='true';
  }

  function ensureAudio(){
    if(audioCtx) return audioCtx;
    const Ctor=window.AudioContext||window.webkitAudioContext;
    if(!Ctor) return null;
    audioCtx=new Ctor();
    masterGain=audioCtx.createGain();
    masterGain.gain.value=.7;
    const comp=audioCtx.createDynamicsCompressor();
    comp.threshold.value=-19;comp.knee.value=10;comp.ratio.value=4;comp.attack.value=.004;comp.release.value=.12;
    masterGain.connect(comp).connect(audioCtx.destination);
    return audioCtx;
  }

  function unlockAudio(){
    if(muted()) return;
    const ctx=ensureAudio();
    if(ctx?.state==='suspended') ctx.resume().catch(()=>{});
  }
  document.addEventListener('pointerdown',unlockAudio,{capture:true,passive:true});
  document.addEventListener('keydown',unlockAudio,{capture:true});
  startBtn?.addEventListener('pointerdown',unlockAudio,{capture:true,passive:true});
  startBtn?.addEventListener('click',unlockAudio,{capture:true});

  function tone(freq,duration,gain=.03,type='square',delay=0,endFreq=null){
    if(muted()) return;
    const ctx=ensureAudio();
    if(!ctx||!masterGain) return;
    const fire=()=>{
      if(ctx.state!=='running'||muted()) return;
      const at=ctx.currentTime+delay;
      const osc=ctx.createOscillator();
      const g=ctx.createGain();
      osc.type=type;
      osc.frequency.setValueAtTime(freq,at);
      if(endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq,at+duration*.9);
      g.gain.setValueAtTime(.0001,at);
      g.gain.exponentialRampToValueAtTime(gain,at+.004);
      g.gain.exponentialRampToValueAtTime(.0001,at+duration);
      osc.connect(g).connect(masterGain);
      osc.start(at);osc.stop(at+duration+.01);
    };
    if(ctx.state==='running') fire(); else ctx.resume().then(fire).catch(()=>{});
  }

  function waka(index){
    const high=index%2===0;
    tone(high?520:410,.052,.03,'square',0,high?350:300);
  }
  function chasePulse(){
    const f=sirenPhase%2===0?165:225;
    sirenPhase++;
    tone(f,.14,.011,'sawtooth',0,f*1.22);
  }
  function cupcakeSound(){
    if(finishPlayed) return;
    finishPlayed=true;
    tone(523,.09,.044,'triangle',0,660);
    tone(659,.09,.044,'triangle',.09,784);
    tone(784,.15,.05,'triangle',.18,1046);
  }

  function parseRemaining(){
    const parts=display.textContent.trim().split(':').map(Number);
    if(parts.some(v=>!Number.isFinite(v))) return null;
    if(parts.length===2) return parts[0]*60+parts[1];
    if(parts.length===3) return parts[0]*3600+parts[1]*60+parts[2];
    return null;
  }

  function totalSeconds(){
    return Math.max(1,(Number(minutesInput?.value)||0)*60+(Number(secondsInput?.value)||0));
  }

  function progressNow(now){
    const current=parseRemaining();
    if(current===null) return 0;
    const status=stageStatus?.textContent.trim()||'';
    const running=status==='Running';
    if(displayedRemaining===null||current!==displayedRemaining||status!==lastStatus){
      displayedRemaining=current;displayChangedAt=now;lastStatus=status;
    }
    let estimated=current;
    if(running&&current>0) estimated=Math.max(0,current-(now-displayChangedAt)/1000);
    return clamp(1-estimated/totalSeconds(),0,1);
  }

  function mainPassable(x,y){
    if(x<0||x>=COLS||y<0||y>=ROWS) return false;
    const ch=MAZE[y][x];
    return ch==='.'||ch==='o';
  }

  function finalPassable(x,y){
    if(x<0||x>=COLS||y<0||y>=ROWS) return false;
    const ch=MAZE[y][x];
    return ch==='.'||ch==='o'||ch==='g'||ch==='c';
  }

  function neighbours(cell,allowRoom=false){
    const pass=allowRoom?finalPassable:mainPassable;
    const out=[];
    const dirs=[[1,0],[0,-1],[-1,0],[0,1]];
    for(const [dx,dy] of dirs){
      const nx=cell.x+dx,ny=cell.y+dy;
      if(pass(nx,ny)) out.push({x:nx,y:ny});
    }
    if(cell.y===TUNNEL_Y){
      if(cell.x===0&&pass(COLS-1,TUNNEL_Y)) out.unshift({x:COLS-1,y:TUNNEL_Y,portal:true});
      if(cell.x===COLS-1&&pass(0,TUNNEL_Y)) out.unshift({x:0,y:TUNNEL_Y,portal:true});
    }
    return out;
  }

  function buildClearWalk(){
    const seen=new Set();
    const walk=[];
    function dfs(cell){
      const k=cellKey(cell.x,cell.y);
      seen.add(k);
      walk.push({x:cell.x,y:cell.y});
      const ns=neighbours(cell,false);
      for(const n of ns){
        const nk=cellKey(n.x,n.y);
        if(!seen.has(nk)){
          dfs(n);
          walk.push({x:cell.x,y:cell.y});
        }
      }
    }
    dfs(START);
    return walk;
  }

  function shortestPath(start,end,allowRoom=false){
    const queue=[start];
    const prev=new Map([[cellKey(start.x,start.y),null]]);
    let qi=0;
    while(qi<queue.length){
      const cur=queue[qi++];
      if(cur.x===end.x&&cur.y===end.y) break;
      for(const n of neighbours(cur,allowRoom)){
        const nk=cellKey(n.x,n.y);
        if(!prev.has(nk)){
          prev.set(nk,cur);
          queue.push({x:n.x,y:n.y});
        }
      }
    }
    const endKey=cellKey(end.x,end.y);
    if(!prev.has(endKey)) return [start];
    const path=[];
    let cur=end;
    while(cur){
      path.push(cur);
      cur=prev.get(cellKey(cur.x,cur.y));
    }
    return path.reverse();
  }

  function centerPct(cell){
    return {x:(cell.x+.5)/COLS*100,y:(cell.y+.5)/ROWS*100};
  }

  function interpolateCells(a,b,f){
    const pa=centerPct(a),pb=centerPct(b);
    const portal=a.y===TUNNEL_Y&&b.y===TUNNEL_Y&&Math.abs(a.x-b.x)>1;
    if(!portal){
      return {
        x:lerp(pa.x,pb.x,f),
        y:lerp(pa.y,pb.y,f),
        angle:Math.atan2(pb.y-pa.y,pb.x-pa.x)*180/Math.PI
      };
    }

    const movingRight=a.x===COLS-1&&b.x===0;
    if(movingRight){
      if(f<.5){
        const u=f*2;
        return {x:lerp(pa.x,102,u),y:pa.y,angle:0};
      }
      const u=(f-.5)*2;
      return {x:lerp(-2,pb.x,u),y:pb.y,angle:0};
    }

    if(f<.5){
      const u=f*2;
      return {x:lerp(pa.x,-2,u),y:pa.y,angle:180};
    }
    const u=(f-.5)*2;
    return {x:lerp(102,pb.x,u),y:pb.y,angle:180};
  }

  function positionOnPath(path,floatIndex){
    const max=path.length-1;
    const f=clamp(floatIndex,0,max);
    const i=Math.floor(f);
    const frac=f-i;
    const a=path[i];
    const b=path[Math.min(i+1,max)];
    return {...interpolateCells(a,b,frac),index:i};
  }

  function wallSegments(){
    const segs=[];
    const isWall=(x,y)=>x<0||x>=COLS||y<0||y>=ROWS||MAZE[y][x]==='#';
    for(let y=0;y<ROWS;y++){
      for(let x=0;x<COLS;x++){
        if(MAZE[y][x]!=='#') continue;
        if(!isWall(x,y-1)) segs.push(`M ${x} ${y} H ${x+1}`);
        if(!isWall(x+1,y)) segs.push(`M ${x+1} ${y} V ${y+1}`);
        if(!isWall(x,y+1)) segs.push(`M ${x} ${y+1} H ${x+1}`);
        if(!isWall(x-1,y)) segs.push(`M ${x} ${y} V ${y+1}`);
      }
    }
    return segs.join(' ');
  }

  function mazeSvg(){
    const d=wallSegments();
    const gateX1=13,gateX2=15,gateY=12;
    return `<svg class="pac4-maze" viewBox="0 0 ${COLS} ${ROWS}" preserveAspectRatio="none" aria-hidden="true">
      <rect x="0" y="0" width="${COLS}" height="${ROWS}" fill="#000"/>
      <path d="${d}" fill="none" stroke="#07134d" stroke-width=".42" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${d}" fill="none" stroke="#2451ff" stroke-width=".19" stroke-linecap="round" stroke-linejoin="round"/>
      <line class="pac4-gate" x1="${gateX1+.08}" y1="${gateY+.08}" x2="${gateX2-.08}" y2="${gateY+.08}"/>
    </svg>`;
  }

  function ghostSvg(color){
    return `<svg viewBox="0 0 28 28" aria-hidden="true">
      <path d="M4 24V12c0-5.5 4.5-10 10-10s10 4.5 10 10v12l-3-2.2-3 2.2-4-2.2-4 2.2-3-2.2z" fill="${color}"/>
      <circle cx="10.3" cy="12" r="3.1" fill="#fff"/><circle cx="17.7" cy="12" r="3.1" fill="#fff"/>
      <circle cx="11.2" cy="13" r="1.5" fill="#234bff"/><circle cx="18.6" cy="13" r="1.5" fill="#234bff"/>
    </svg>`;
  }

  function cupcakeSvg(){
    return `<svg viewBox="0 0 40 40" aria-hidden="true">
      <path d="M10 22 H30 L27 34 H13 Z" fill="#7a4b2c"/>
      <path d="M9 22 C10 15 14 12 18 14 C19 10 24 9 27 13 C30 12 33 15 31 22 Z" fill="#ff9ec9"/>
      <path d="M14 18 C16 17 18 18 18 20 C17 21 15 21 14 20 Z" fill="#fff2aa"/>
      <circle cx="23" cy="12" r="2.3" fill="#ff4d4d"/>
    </svg>`;
  }

  function buildScene(scene){
    scene.classList.add('pac4-upgraded');
    scene.classList.remove('pac3-upgraded','pac2-upgraded');
    scene.innerHTML=`
      <div class="pac4-scoreboard"><span>1UP<br>00</span><span>HIGH SCORE<br>00</span></div>
      <div class="pac4-board">
        ${mazeSvg()}
        <div class="pac4-pellets"></div>
        <div class="pac4-actors">
          <div class="pac4-cupcake">${cupcakeSvg()}</div>
          <div class="pac4-player"></div>
          <div class="pac4-ghost g1">${ghostSvg('#ff4040')}</div>
          <div class="pac4-ghost g2">${ghostSvg('#ff9fd9')}</div>
          <div class="pac4-ghost g3">${ghostSvg('#5de3ff')}</div>
          <div class="pac4-ghost g4">${ghostSvg('#ffb84d')}</div>
        </div>
        <div class="pac4-ready">READY!</div>
      </div>`;

    const pelletsWrap=scene.querySelector('.pac4-pellets');
    const pellets=[];
    for(let y=0;y<ROWS;y++){
      for(let x=0;x<COLS;x++){
        const ch=MAZE[y][x];
        if(ch!=='.'&&ch!=='o') continue;
        const p=centerPct({x,y});
        const el=document.createElement('i');
        el.className='pac4-pellet'+(ch==='o'?' power':'');
        el.style.left=`${p.x}%`;
        el.style.top=`${p.y}%`;
        pelletsWrap.appendChild(el);
        pellets.push({x,y,key:cellKey(x,y),el});
      }
    }

    const clearWalk=buildClearWalk();
    const firstVisit=new Map();
    clearWalk.forEach((c,i)=>{
      const k=cellKey(c.x,c.y);
      if(!firstVisit.has(k)) firstVisit.set(k,i);
    });

    const finalRoute=shortestPath(clearWalk[clearWalk.length-1],CUPCAKE,true);
    const cupcake=scene.querySelector('.pac4-cupcake');
    const cp=centerPct(CUPCAKE);
    cupcake.style.left=`${cp.x}%`;
    cupcake.style.top=`${cp.y}%`;

    state={
      scene,
      board:scene.querySelector('.pac4-board'),
      player:scene.querySelector('.pac4-player'),
      ghosts:[scene.querySelector('.g1'),scene.querySelector('.g2'),scene.querySelector('.g3'),scene.querySelector('.g4')],
      gate:scene.querySelector('.pac4-gate'),
      cupcake,
      pellets,
      clearWalk,
      firstVisit,
      finalRoute,
      lastEaten:0,
      boardW:0,
      boardH:0
    };
    lastPelletSound=-1;
    finishPlayed=false;
  }

  function resizeActors(){
    if(!state?.board) return;
    const rect=state.board.getBoundingClientRect();
    if(!rect.width||!rect.height) return;
    if(Math.abs(rect.width-state.boardW)<1&&Math.abs(rect.height-state.boardH)<1) return;
    state.boardW=rect.width;state.boardH=rect.height;
    const cellW=rect.width/COLS,cellH=rect.height/ROWS;
    const size=Math.max(10,Math.min(22,Math.min(cellW,cellH)*.58));
    state.player.style.width=state.player.style.height=`${size}px`;
    state.ghosts.forEach(g=>g.style.width=g.style.height=`${size*.94}px`);
    state.cupcake.style.width=state.cupcake.style.height=`${Math.max(18,size*1.34)}px`;
  }

  function safeGhostPosition(pacPos,baseFloat,ghostIndex){
    const path=state.clearWalk;
    const minCellDistance=2.55+ghostIndex*.12;
    let candidate=Math.max(0,baseFloat);
    for(let tries=0;tries<90;tries++){
      const g=positionOnPath(path,candidate);
      const dx=(g.x-pacPos.x)/(100/COLS);
      const dy=(g.y-pacPos.y)/(100/ROWS);
      if(Math.hypot(dx,dy)>=minCellDistance) return g;
      candidate=Math.max(0,candidate-2.4);
      if(candidate===0) break;
    }
    const fallbackIndex=Math.max(0,Math.floor(baseFloat)-18-ghostIndex*11);
    return positionOnPath(path,fallbackIndex);
  }

  function render(progress,now){
    if(!state) return;
    resizeActors();

    const running=(stageStatus?.textContent.trim()||'')==='Running';
    state.scene.classList.toggle('pac4-running',running);
    state.scene.classList.toggle('pac4-finished',progress>=1);

    const pelletProgress=clamp(progress/PELLET_END,0,1);
    const clearFloat=pelletProgress*(state.clearWalk.length-1);
    const inCupcakePhase=progress>=PELLET_END;

    let pac;
    if(!inCupcakePhase){
      pac=positionOnPath(state.clearWalk,clearFloat);
    }else{
      const t=clamp((progress-PELLET_END)/(1-PELLET_END),0,1);
      pac=positionOnPath(state.finalRoute,t*(state.finalRoute.length-1));
    }

    state.player.style.left=`${pac.x}%`;
    state.player.style.top=`${pac.y}%`;
    state.player.style.setProperty('--dir',`${pac.angle}deg`);
    const bite=running?(35-Math.abs(Math.sin(now/78))*23):35;
    state.player.style.setProperty('--mouth-top',`${bite}%`);
    state.player.style.setProperty('--mouth-bottom',`${100-bite}%`);

    let eatenCount=0;
    if(!inCupcakePhase){
      state.pellets.forEach(pellet=>{
        const visit=state.firstVisit.get(pellet.key);
        const eaten=visit!==undefined&&visit<=pac.index;
        pellet.el.classList.toggle('eaten',eaten);
        if(eaten) eatenCount++;
      });
    }else{
      state.pellets.forEach(pellet=>pellet.el.classList.add('eaten'));
      eatenCount=state.pellets.length;
    }

    if(running&&eatenCount>lastPelletSound){
      const diff=Math.min(7,eatenCount-Math.max(0,lastPelletSound));
      for(let i=0;i<diff;i++) setTimeout(()=>waka(eatenCount+i),i*18);
      lastPelletSound=eatenCount;
    }else if(eatenCount<lastPelletSound){
      lastPelletSound=eatenCount;
    }

    state.gate?.classList.toggle('open',inCupcakePhase);
    state.cupcake?.classList.toggle('ready',inCupcakePhase);
    if(progress>=.995){
      state.cupcake?.classList.add('eaten');
      cupcakeSound();
    }else{
      state.cupcake?.classList.remove('eaten');
    }

    const ghostLags=[20,38,58,79];
    const ghostBaseFloat=Math.min(clearFloat,state.clearWalk.length-1);
    state.ghosts.forEach((ghost,i)=>{
      const g=safeGhostPosition(pac,ghostBaseFloat-ghostLags[i],i);
      ghost.style.left=`${g.x}%`;
      ghost.style.top=`${g.y}%`;
    });

    if(running&&progress<PELLET_END&&now>=nextSirenAt){
      nextSirenAt=now+390;
      chasePulse();
    }
  }

  function ensureScene(){
    const scene=sceneLayer.querySelector('.xt-pacman[data-xt-theme="pacman"]');
    if(!scene) return null;
    if(!scene.querySelector('.pac4-board')) buildScene(scene);
    return scene;
  }

  function loop(now){
    const scene=ensureScene();
    if(scene!==lastScene){
      lastScene=scene||null;
      displayedRemaining=null;
      state=null;
      if(scene) buildScene(scene);
    }
    if(scene&&!state) buildScene(scene);
    if(scene&&state) render(progressNow(now),now);
    raf=requestAnimationFrame(loop);
  }

  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(loop);
})();
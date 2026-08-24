(() => {
  'use strict';

  if (window.__pacmanUpgradeV5) return;
  window.__pacmanUpgradeV5 = true;

  const sceneLayer = document.getElementById('sceneLayer');
  const stageStatus = document.getElementById('stageStatus');
  const display = document.getElementById('countdownDisplay');
  const minutesInput = document.getElementById('countdownMinutes');
  const secondsInput = document.getElementById('countdownSeconds');
  const muteBtn = document.getElementById('muteBtn');
  const presentationMuteBtn = document.getElementById('presentationMuteBtn');
  if (!sceneLayer || !display) return;

  document.getElementById('pacmanUpgradeStyleV4')?.remove();

  const style = document.createElement('style');
  style.id = 'pacmanUpgradeStyleV5';
  style.textContent = `
    #countdownStage.theme-pacman .time-display-wrap {
      position:absolute!important;
      left:2.2%!important;
      right:auto!important;
      top:2%!important;
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
      font-size:clamp(2.35rem,5.2vw,4.45rem)!important;
      line-height:.92!important;
      font-weight:700!important;
      letter-spacing:.015em!important;
      font-variant-numeric:tabular-nums!important;
      width:auto!important;
      min-width:0!important;
      padding:.16em .24em!important;
      white-space:nowrap!important;
    }
    #countdownStage.theme-pacman .timer-message {
      font-family:"Courier New",Courier,monospace!important;
    }

    .xt-pacman.pac5-upgraded {
      background:#000!important;
      overflow:hidden!important;
    }

    .pac5-score {
      position:absolute;
      right:6%;
      top:4%;
      display:flex;
      gap:3.2rem;
      color:#fff;
      z-index:3;
      opacity:.86;
      font:700 clamp(.62rem,1.25vw,.98rem)/1.05 "Courier New",Courier,monospace;
      letter-spacing:.08em;
      text-align:center;
      pointer-events:none;
    }
    .pac5-score strong { display:block;margin-top:.28rem;font-size:1.15em; }

    .pac5-board {
      position:absolute;
      left:12%;
      right:6%;
      top:23%;
      bottom:6%;
      border-radius:15px;
      background:#000;
      border:5px solid #214cff;
      box-shadow:0 0 11px rgba(52,83,255,.44), inset 0 0 0 3px #071846;
      overflow:hidden;
      z-index:2;
    }
    .pac5-maze,
    .pac5-pellets,
    .pac5-actors {
      position:absolute;
      inset:0;
      width:100%;
      height:100%;
    }
    .pac5-maze { overflow:visible; }
    .pac5-pellets,.pac5-actors { pointer-events:none; }

    .pac5-route-wall,
    .pac5-branch-wall {
      fill:none;
      stroke:#2352ff;
      stroke-width:86;
      stroke-linecap:round;
      stroke-linejoin:round;
      filter:drop-shadow(0 0 4px rgba(45,82,255,.52));
    }
    .pac5-route-floor,
    .pac5-branch-floor {
      fill:none;
      stroke:#000;
      stroke-width:68;
      stroke-linecap:round;
      stroke-linejoin:round;
    }
    .pac5-route-edge,
    .pac5-branch-edge {
      fill:none;
      stroke:#6c89ff;
      stroke-width:2.2;
      stroke-linecap:round;
      stroke-linejoin:round;
      opacity:.88;
    }

    .pac5-pellet {
      position:absolute;
      width:8px;
      height:8px;
      border-radius:50%;
      transform:translate(-50%,-50%);
      background:#ffe3a6;
      box-shadow:0 0 5px rgba(255,226,161,.48);
      transition:opacity .1s linear;
    }
    .pac5-pellet.power {
      width:17px;
      height:17px;
      background:#fff2d0;
      box-shadow:0 0 9px rgba(255,242,208,.82);
      animation:pac5PowerBlink .65s steps(2,end) infinite;
    }
    @keyframes pac5PowerBlink { 50% { opacity:.28; } }

    .pac5-player {
      position:absolute;
      width:58px;
      height:58px;
      border-radius:50%;
      transform:translate(-50%,-50%) rotate(var(--pac-dir,0deg));
      transform-origin:50% 50%;
      background:#ffdb18;
      z-index:9;
      filter:drop-shadow(0 0 7px rgba(255,219,24,.35));
      clip-path:polygon(100% 0,100% var(--mouth-top,33%),56% 50%,100% var(--mouth-bottom,67%),100% 100%,0 100%,0 0);
      will-change:left,top,transform,clip-path;
    }
    .pac5-player::after {
      content:'';
      position:absolute;
      width:5px;
      height:5px;
      border-radius:50%;
      background:#171717;
      right:14px;
      top:10px;
    }

    .pac5-ghost {
      position:absolute;
      width:50px;
      height:50px;
      transform:translate(-50%,-50%);
      z-index:8;
      filter:drop-shadow(0 3px 3px rgba(0,0,0,.42));
      will-change:left,top;
    }
    .pac5-ghost-body {
      position:absolute;
      inset:0;
      border-radius:50% 50% 12% 12% / 52% 52% 18% 18%;
      background:var(--ghost-color);
      clip-path:polygon(0 0,100% 0,100% 88%,87% 100%,74% 88%,61% 100%,48% 88%,35% 100%,22% 88%,10% 100%,0 88%);
    }
    .pac5-eye {
      position:absolute;
      top:15px;
      width:12px;
      height:15px;
      border-radius:50%;
      background:#fff;
      z-index:2;
    }
    .pac5-eye.e1 { left:10px; }
    .pac5-eye.e2 { right:10px; }
    .pac5-eye::after {
      content:'';
      position:absolute;
      width:6px;
      height:7px;
      border-radius:50%;
      background:#1736a6;
      left:4px;
      top:5px;
    }

    .pac5-ready,
    .pac5-clear {
      position:absolute;
      left:50%;
      top:50%;
      transform:translate(-50%,-50%);
      font-family:"Courier New",Courier,monospace;
      font-weight:900;
      letter-spacing:.09em;
      z-index:12;
      pointer-events:none;
      text-align:center;
    }
    .pac5-ready { color:#ffdf28;font-size:clamp(1rem,2.2vw,1.7rem); }
    .pac5-clear {
      color:#ffdf28;
      font-size:clamp(2rem,5vw,4.1rem);
      opacity:0;
      text-shadow:0 0 12px rgba(255,223,40,.55);
    }
    .pac5-finished .pac5-clear { animation:pac5Clear .8s ease-out forwards; }
    @keyframes pac5Clear {
      0% { opacity:0;transform:translate(-50%,-50%) scale(.55); }
      55% { opacity:1;transform:translate(-50%,-50%) scale(1.08); }
      100% { opacity:.96;transform:translate(-50%,-50%) scale(1); }
    }

    @media(max-width:760px){
      #countdownStage.theme-pacman .time-display-wrap { left:2%!important;top:1.4%!important;max-width:40%!important; }
      #countdownStage.theme-pacman #countdownDisplay,
      #countdownStage.theme-pacman .time-display { font-size:clamp(1.8rem,8vw,3rem)!important; }
      .pac5-score { right:3%;top:3.1%;gap:1.4rem;font-size:.55rem; }
      .pac5-board { left:5%;right:4%;top:22%;bottom:5%; }
      .pac5-route-wall,.pac5-branch-wall { stroke-width:76; }
      .pac5-route-floor,.pac5-branch-floor { stroke-width:60; }
      .pac5-player { width:48px;height:48px; }
      .pac5-player::after { right:11px;top:8px;width:4px;height:4px; }
      .pac5-ghost { width:43px;height:43px; }
      .pac5-eye { top:13px;width:10px;height:13px; }
      .pac5-eye.e1 { left:8px; }.pac5-eye.e2 { right:8px; }
      .pac5-pellet { width:6px;height:6px; }
      .pac5-pellet.power { width:13px;height:13px; }
    }
  `;
  document.head.appendChild(style);

  const ROUTE = [
    {x:80,y:92},
    {x:920,y:92},
    {x:920,y:218},
    {x:228,y:218},
    {x:228,y:340},
    {x:828,y:340},
    {x:828,y:458},
    {x:382,y:458},
    {x:382,y:532},
    {x:918,y:532}
  ];

  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const lerp=(a,b,t)=>a+(b-a)*t;

  let displayedRemaining=null;
  let displayChangedAt=performance.now();
  let lastStatus='';
  let lastScene=null;
  let ghostClock=0;
  let lastFrame=performance.now();
  let lastPellet=-1;
  let finishSoundPlayed=false;
  let audioCtx=null;
  let raf=0;

  function muted(){
    try{
      const stored=localStorage.getItem('ttTimers.muted');
      if(stored!==null) return JSON.parse(stored)===true;
    }catch{}
    return muteBtn?.getAttribute('aria-pressed')==='true' || presentationMuteBtn?.getAttribute('aria-pressed')==='true';
  }

  function tone(freq,duration=.055,gain=.025,type='square',delay=0){
    if(muted()) return;
    const Ctor=window.AudioContext||window.webkitAudioContext;
    if(!Ctor) return;
    audioCtx ||= new Ctor();
    const play=()=>{
      if(audioCtx.state!=='running'||muted()) return;
      const at=audioCtx.currentTime+delay;
      const osc=audioCtx.createOscillator();
      const g=audioCtx.createGain();
      osc.type=type;osc.frequency.value=freq;
      g.gain.setValueAtTime(.0001,at);
      g.gain.exponentialRampToValueAtTime(gain,at+.005);
      g.gain.exponentialRampToValueAtTime(.0001,at+duration);
      osc.connect(g).connect(audioCtx.destination);
      osc.start(at);osc.stop(at+duration+.01);
    };
    if(audioCtx.state==='suspended') audioCtx.resume().then(play).catch(()=>{}); else play();
  }

  function parseRemaining(){
    const parts=display.textContent.trim().split(':').map(Number);
    if(parts.some(v=>!Number.isFinite(v))) return null;
    if(parts.length===2) return parts[0]*60+parts[1];
    if(parts.length===3) return parts[0]*3600+parts[1]*60+parts[2];
    return null;
  }
  function totalSeconds(){ return Math.max(1,(Number(minutesInput?.value)||0)*60+(Number(secondsInput?.value)||0)); }

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

  function pointAlong(points,t){
    t=clamp(t,0,1);
    const segs=[];let total=0;
    for(let i=0;i<points.length-1;i++){
      const a=points[i],b=points[i+1];
      const len=Math.hypot(b.x-a.x,b.y-a.y);
      segs.push({a,b,len});total+=len;
    }
    let target=t*total;
    for(const seg of segs){
      if(target<=seg.len){
        const u=seg.len?target/seg.len:0;
        return {x:lerp(seg.a.x,seg.b.x,u),y:lerp(seg.a.y,seg.b.y,u),angle:Math.atan2(seg.b.y-seg.a.y,seg.b.x-seg.a.x)*180/Math.PI};
      }
      target-=seg.len;
    }
    const a=points[points.length-2],b=points[points.length-1];
    return {x:b.x,y:b.y,angle:Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI};
  }

  function pct(point){ return {x:point.x/10,y:point.y/6}; }

  function ghostMarkup(cls,color){
    return `<div class="pac5-ghost ${cls}" style="--ghost-color:${color}"><div class="pac5-ghost-body"></div><i class="pac5-eye e1"></i><i class="pac5-eye e2"></i></div>`;
  }

  function build(scene){
    const pellets=Array.from({length:42},(_,i)=>{
      const p=pct(pointAlong(ROUTE,i/41));
      const power=i===0||i===13||i===27||i===41;
      return `<i class="pac5-pellet${power?' power':''}" data-pac5-pellet="${i}" style="left:${p.x}%;top:${p.y}%"></i>`;
    }).join('');

    scene.innerHTML=`
      <div class="pac5-score"><div>1UP<strong>00</strong></div><div>PELLETS<strong class="pac5-score-count">42</strong></div></div>
      <div class="pac5-board">
        <svg class="pac5-maze" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
          <path class="pac5-route-wall" d="M80 92 H920 V218 H228 V340 H828 V458 H382 V532 H918"/>
          <path class="pac5-route-floor" d="M80 92 H920 V218 H228 V340 H828 V458 H382 V532 H918"/>
          <path class="pac5-route-edge" d="M80 92 H920 V218 H228 V340 H828 V458 H382 V532 H918"/>

          <path class="pac5-branch-wall" d="M520 218 V138 H716 M606 340 V278 H756 M558 458 V398 H320"/>
          <path class="pac5-branch-floor" d="M520 218 V138 H716 M606 340 V278 H756 M558 458 V398 H320"/>
          <path class="pac5-branch-edge" d="M520 218 V138 H716 M606 340 V278 H756 M558 458 V398 H320"/>
        </svg>
        <div class="pac5-pellets">${pellets}</div>
        <div class="pac5-actors">
          <div class="pac5-player"></div>
          ${ghostMarkup('g1','#f04444')}
          ${ghostMarkup('g2','#ff8fd5')}
          ${ghostMarkup('g3','#45d7ee')}
        </div>
        <div class="pac5-ready">READY!</div>
        <div class="pac5-clear">LEVEL CLEAR!</div>
      </div>`;
    scene.classList.add('pac5-upgraded');
    scene.dataset.pac5='1';
    lastPellet=-1;finishSoundPlayed=false;ghostClock=0;
  }

  function render(scene,p,now,dt){
    if(scene.dataset.pac5!=='1') build(scene);
    const running=(stageStatus?.textContent.trim()||'')==='Running';
    const finished=p>=.9995;
    scene.classList.toggle('pac5-finished',finished);
    scene.classList.toggle('pac5-running',running);
    const ready=scene.querySelector('.pac5-ready');
    if(ready) ready.style.opacity=running||p>0?'0':'1';

    const pac=scene.querySelector('.pac5-player');
    if(pac){
      const pos=pct(pointAlong(ROUTE,p));
      const raw=pointAlong(ROUTE,p);
      pac.style.left=`${pos.x}%`;pac.style.top=`${pos.y}%`;pac.style.setProperty('--pac-dir',`${raw.angle}deg`);
      const mouth=(Math.sin(now/85)+1)/2;
      pac.style.setProperty('--mouth-top',`${31+mouth*12}%`);
      pac.style.setProperty('--mouth-bottom',`${69-mouth*12}%`);
    }

    const pellets=[...scene.querySelectorAll('[data-pac5-pellet]')];
    const eaten=Math.min(pellets.length,Math.floor(p*pellets.length+0.0001));
    pellets.forEach((pellet,i)=>pellet.style.opacity=i<eaten?'0':'1');
    const count=scene.querySelector('.pac5-score-count');if(count) count.textContent=String(Math.max(0,pellets.length-eaten)).padStart(2,'0');
    if(running&&eaten>lastPellet&&eaten>0){ tone(eaten%2?440:525,.052,.021,'square'); }
    lastPellet=eaten;

    if(running) ghostClock+=dt;
    const ghosts=[...scene.querySelectorAll('.pac5-ghost')];
    const offsets=[.18,.47,.72];
    const dirs=[1,-1,1];
    ghosts.forEach((ghost,i)=>{
      let t=((ghostClock/15000)*dirs[i]+offsets[i])%1;if(t<0)t+=1;
      const gp=pct(pointAlong(ROUTE,t));
      ghost.style.left=`${gp.x}%`;ghost.style.top=`${gp.y}%`;
      ghost.style.transform=`translate(-50%,-50%) translateY(${Math.sin(now/180+i)*1.8}px)`;
    });

    if(finished&&!finishSoundPlayed){
      finishSoundPlayed=true;tone(523,.12,.032,'triangle');tone(659,.12,.032,'triangle',.13);tone(784,.18,.038,'triangle',.26);
    }
  }

  function tick(now){
    const dt=Math.min(50,Math.max(0,now-lastFrame));lastFrame=now;
    const scene=sceneLayer.querySelector('.xt-pacman[data-xt-theme="pacman"]');
    if(scene!==lastScene){ lastScene=scene||null;displayedRemaining=null;lastPellet=-1;finishSoundPlayed=false;ghostClock=0; }
    if(scene){ render(scene,progressNow(now),now,dt); }
    raf=requestAnimationFrame(tick);
  }

  const observer=new MutationObserver(()=>{
    const scene=sceneLayer.querySelector('.xt-pacman[data-xt-theme="pacman"]');
    if(scene&&scene.dataset.pac5!=='1') build(scene);
  });
  observer.observe(sceneLayer,{childList:true,subtree:true});

  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(tick);
})();
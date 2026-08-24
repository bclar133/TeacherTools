(() => {
  'use strict';

  if (window.__pacmanUpgradeV2) return;
  window.__pacmanUpgradeV2 = true;

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
  style.id = 'pacmanUpgradeStyleV2';
  style.textContent = `
    .xt-pacman.pac2-upgraded {
      background:#000 !important;
      overflow:hidden !important;
    }

    .pac2-board {
      position:absolute;
      left:4%;
      right:4%;
      top:14%;
      bottom:3.5%;
      background:#000;
      overflow:hidden;
      border-radius:8px;
    }

    .pac2-maze {
      position:absolute;
      inset:0;
      width:100%;
      height:100%;
      display:block;
      overflow:visible;
    }

    .pac2-pellet-layer,
    .pac2-actor-layer {
      position:absolute;
      inset:0;
      pointer-events:none;
    }

    .pac2-pellet {
      position:absolute;
      width:5px;
      height:5px;
      border-radius:50%;
      transform:translate(-50%,-50%);
      background:#ffd7a2;
      box-shadow:0 0 3px rgba(255,215,162,.48);
      opacity:1;
    }

    .pac2-pellet.power {
      width:11px;
      height:11px;
      background:#fff0c9;
      box-shadow:0 0 7px rgba(255,240,201,.8);
      animation:pac2PowerBlink .62s steps(2,end) infinite;
    }

    @keyframes pac2PowerBlink { 50% { opacity:.28; } }

    .pac2-pellet.eaten { opacity:0; }

    .pac2-player {
      position:absolute;
      width:25px;
      height:25px;
      border-radius:50%;
      background:#ffdb1f;
      transform:translate(-50%,-50%) rotate(var(--dir,0deg));
      transform-origin:50% 50%;
      clip-path:polygon(100% 0,100% var(--mouth-top,34%),58% 50%,100% var(--mouth-bottom,66%),100% 100%,0 100%,0 0);
      z-index:8;
      filter:drop-shadow(0 0 4px rgba(255,219,31,.25));
      will-change:left,top,transform,clip-path;
    }

    .pac2-player::after {
      content:'';
      position:absolute;
      width:3px;
      height:3px;
      border-radius:50%;
      background:#111;
      right:6px;
      top:5px;
    }

    .pac2-ghost {
      position:absolute;
      width:26px;
      height:26px;
      transform:translate(-50%,-50%);
      z-index:7;
      filter:drop-shadow(0 0 4px rgba(255,255,255,.08));
      will-change:left,top;
    }

    .pac2-ghost svg { display:block;width:100%;height:100%;overflow:visible; }

    .pac2-cupcake {
      position:absolute;
      width:30px;
      height:30px;
      transform:translate(-50%,-50%);
      z-index:6;
      filter:drop-shadow(0 0 7px rgba(255,119,186,.55));
      transition:opacity .18s ease,transform .18s ease;
    }

    .pac2-cupcake svg { width:100%;height:100%;display:block; }
    .pac2-cupcake.eaten { opacity:0;transform:translate(-50%,-50%) scale(.45) rotate(18deg); }

    .pac2-ready {
      position:absolute;
      left:50%;
      top:57%;
      transform:translate(-50%,-50%);
      color:#ffdd33;
      font-family:monospace;
      font-size:clamp(1rem,2.4vw,1.8rem);
      font-weight:900;
      letter-spacing:.08em;
      z-index:5;
      text-shadow:0 0 8px rgba(255,221,51,.3);
    }

    .pac2-running .pac2-ready,
    .pac2-finished .pac2-ready { opacity:0; }

    .pac2-scoreboard {
      position:absolute;
      left:4%;
      right:4%;
      top:2.5%;
      height:9%;
      display:flex;
      justify-content:center;
      gap:15%;
      color:#fff;
      font:700 clamp(.62rem,1.2vw,.9rem)/1 monospace;
      text-align:center;
      letter-spacing:.05em;
      opacity:.78;
      pointer-events:none;
    }

    @media(max-width:760px){
      .pac2-board{left:2%;right:2%;top:18%;bottom:2.5%}
      .pac2-player{width:20px;height:20px}
      .pac2-ghost{width:21px;height:21px}
      .pac2-cupcake{width:25px;height:25px}
      .pac2-pellet{width:4px;height:4px}
      .pac2-pellet.power{width:9px;height:9px}
      .pac2-scoreboard{top:3%;font-size:.58rem}
    }
  `;
  document.head.appendChild(style);

  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const distance=(a,b)=>Math.hypot(b.x-a.x,b.y-a.y);

  let displayedRemaining=null;
  let displayChangedAt=performance.now();
  let lastStatus='';
  let lastScene=null;
  let state=null;
  let raf=0;

  let audioCtx=null;
  let masterGain=null;
  let lastPelletIndex=-1;
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
    masterGain.gain.value=.72;
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
    tone(high?520:410,.052,.032,'square',0,high?350:300);
  }

  function chasePulse(){
    const f=sirenPhase%2===0?165:225;
    sirenPhase++;
    tone(f,.14,.012,'sawtooth',0,f*1.22);
  }

  function cupcakeSound(){
    if(finishPlayed) return;
    finishPlayed=true;
    tone(523,.09,.045,'triangle',0,660);
    tone(659,.09,.045,'triangle',.09,784);
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

  /* A deliberately long, corridor-following route. Several sections are retraced,
     so Pac-Man doubles back after clearing branches instead of following one loop. */
  function routePoints(){
    return [
      {x:7,y:91},{x:25,y:91},{x:25,y:80},{x:8,y:80},{x:8,y:69},{x:27,y:69},
      {x:27,y:57},{x:8,y:57},{x:8,y:44},{x:20,y:44},{x:20,y:32},{x:8,y:32},
      {x:8,y:18},{x:28,y:18},{x:28,y:8},{x:48,y:8},{x:48,y:18},{x:39,y:18},
      {x:39,y:32},{x:48,y:32},{x:48,y:45},{x:35,y:45},{x:35,y:57},{x:48,y:57},
      {x:48,y:69},{x:37,y:69},{x:37,y:80},{x:48,y:80},{x:48,y:91},{x:25,y:91},
      {x:25,y:80},{x:37,y:80},{x:37,y:69},{x:50,y:69},{x:50,y:57},{x:61,y:57},
      {x:61,y:45},{x:50,y:45},{x:50,y:32},{x:61,y:32},{x:61,y:18},{x:52,y:18},
      {x:52,y:8},{x:72,y:8},{x:72,y:18},{x:92,y:18},{x:92,y:32},{x:80,y:32},
      {x:80,y:44},{x:92,y:44},{x:92,y:57},{x:73,y:57},{x:73,y:69},{x:92,y:69},
      {x:92,y:80},{x:75,y:80},{x:75,y:91},{x:52,y:91},{x:52,y:80},{x:63,y:80},
      {x:63,y:69},{x:50,y:69},{x:50,y:57},{x:63,y:57},{x:63,y:45},{x:76,y:45},
      {x:76,y:57},{x:63,y:57},{x:63,y:69},{x:75,y:69},{x:75,y:80},{x:92,y:80},
      {x:92,y:91},{x:75,y:91}
    ];
  }

  function makeSegments(route){
    const segs=[];let total=0;
    for(let i=1;i<route.length;i++){
      const len=distance(route[i-1],route[i]);
      segs.push({a:route[i-1],b:route[i],len,start:total});
      total+=len;
    }
    return {segs,total};
  }

  function pointAlong(route,segs,total,t){
    const target=clamp(t,0,1)*total;
    let seg=segs[segs.length-1];
    for(const s of segs){if(target<=s.start+s.len){seg=s;break;}}
    const u=seg.len?clamp((target-seg.start)/seg.len,0,1):0;
    return {
      x:lerp(seg.a.x,seg.b.x,u),
      y:lerp(seg.a.y,seg.b.y,u),
      angle:Math.atan2(seg.b.y-seg.a.y,seg.b.x-seg.a.x)*180/Math.PI
    };
  }

  function mazeSvg(){
    return `<svg class="pac2-maze" viewBox="0 0 1000 760" preserveAspectRatio="none" aria-hidden="true">
      <g fill="none" stroke="#09156d" stroke-width="25" stroke-linejoin="round" stroke-linecap="round">
        <rect x="15" y="15" width="970" height="730" rx="26"/>
        <rect x="75" y="70" width="190" height="82" rx="12"/><rect x="365" y="70" width="270" height="82" rx="12"/><rect x="735" y="70" width="190" height="82" rx="12"/>
        <rect x="75" y="205" width="120" height="72" rx="10"/><rect x="270" y="205" width="180" height="72" rx="10"/><rect x="550" y="205" width="180" height="72" rx="10"/><rect x="805" y="205" width="120" height="72" rx="10"/>
        <path d="M15 332 H195 V425 H15"/><path d="M985 332 H805 V425 H985"/>
        <path d="M275 325 V455"/><path d="M725 325 V455"/>
        <path d="M375 325 H625"/><path d="M445 275 V365"/><path d="M555 275 V365"/>
        <rect x="385" y="370" width="230" height="105" rx="12"/>
        <rect x="75" y="505" width="190" height="78" rx="10"/><rect x="365" y="505" width="270" height="78" rx="10"/><rect x="735" y="505" width="190" height="78" rx="10"/>
        <rect x="75" y="635" width="375" height="62" rx="10"/><rect x="550" y="635" width="375" height="62" rx="10"/>
        <path d="M500 475 V635"/>
      </g>
      <g fill="none" stroke="#264eff" stroke-width="13" stroke-linejoin="round" stroke-linecap="round">
        <rect x="15" y="15" width="970" height="730" rx="26"/>
        <rect x="75" y="70" width="190" height="82" rx="12"/><rect x="365" y="70" width="270" height="82" rx="12"/><rect x="735" y="70" width="190" height="82" rx="12"/>
        <rect x="75" y="205" width="120" height="72" rx="10"/><rect x="270" y="205" width="180" height="72" rx="10"/><rect x="550" y="205" width="180" height="72" rx="10"/><rect x="805" y="205" width="120" height="72" rx="10"/>
        <path d="M15 332 H195 V425 H15"/><path d="M985 332 H805 V425 H985"/>
        <path d="M275 325 V455"/><path d="M725 325 V455"/>
        <path d="M375 325 H625"/><path d="M445 275 V365"/><path d="M555 275 V365"/>
        <rect x="385" y="370" width="230" height="105" rx="12"/>
        <rect x="75" y="505" width="190" height="78" rx="10"/><rect x="365" y="505" width="270" height="78" rx="10"/><rect x="735" y="505" width="190" height="78" rx="10"/>
        <rect x="75" y="635" width="375" height="62" rx="10"/><rect x="550" y="635" width="375" height="62" rx="10"/>
        <path d="M500 475 V635"/>
      </g>
      <rect x="440" y="392" width="120" height="54" rx="6" fill="#000" stroke="#264eff" stroke-width="8"/>
      <path d="M468 392 H532" stroke="#ffb7d5" stroke-width="7"/>
    </svg>`;
  }

  function ghostSvg(color){
    return `<svg viewBox="0 0 30 30" aria-hidden="true">
      <path d="M4 27V13C4 6.9 8.9 2 15 2s11 4.9 11 11v14l-3.5-2.8-3.7 2.8-3.8-2.8-3.8 2.8-3.7-2.8z" fill="${color}"/>
      <ellipse cx="11" cy="12.5" rx="3.5" ry="4.2" fill="#fff"/><ellipse cx="19" cy="12.5" rx="3.5" ry="4.2" fill="#fff"/>
      <circle cx="12" cy="13.2" r="1.7" fill="#1747d1"/><circle cx="20" cy="13.2" r="1.7" fill="#1747d1"/>
    </svg>`;
  }

  function cupcakeSvg(){
    return `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M10 22h20l-3 14H13z" fill="#8a5633"/><path d="M8 22c1-7 5-10 10-8 2-6 9-6 11 0 5-1 8 3 4 8z" fill="#ff91c5"/><path d="M14 20c3-4 7-2 7 1-3 2-5 2-7-1z" fill="#fff0a5"/><circle cx="24" cy="9" r="3" fill="#ed3d52"/></svg>`;
  }

  function build(scene){
    const route=routePoints();
    const {segs,total}=makeSegments(route);
    scene.innerHTML=`<div class="pac2-scoreboard"><span>1UP<br>00</span><span>HIGH SCORE<br>00</span></div><div class="pac2-board">${mazeSvg()}<div class="pac2-pellet-layer"></div><div class="pac2-actor-layer"><div class="pac2-cupcake">${cupcakeSvg()}</div><div class="pac2-player"></div><div class="pac2-ghost g1">${ghostSvg('#ff4040')}</div><div class="pac2-ghost g2">${ghostSvg('#ff9fdf')}</div><div class="pac2-ghost g3">${ghostSvg('#53e7ff')}</div><div class="pac2-ghost g4">${ghostSvg('#ffb44f')}</div><div class="pac2-ready">READY!</div></div></div>`;
    scene.classList.add('pac2-upgraded');
    scene.dataset.pac2='1';

    const layer=scene.querySelector('.pac2-pellet-layer');
    const pellets=[];
    const seen=new Set();
    const spacing=2.25;
    for(let d=0;d<total-1;d+=spacing){
      const t=d/total;
      const p=pointAlong(route,segs,total,t);
      const key=`${Math.round(p.x*2)}:${Math.round(p.y*2)}`;
      if(seen.has(key)) continue;
      seen.add(key);
      const dot=document.createElement('i');
      dot.className='pac2-pellet';
      if(pellets.length%33===0) dot.classList.add('power');
      dot.style.left=`${p.x}%`;dot.style.top=`${p.y}%`;
      layer.appendChild(dot);
      pellets.push({el:dot,t});
    }
    pellets.sort((a,b)=>a.t-b.t);

    const last=route[route.length-1];
    const cupcake=scene.querySelector('.pac2-cupcake');
    cupcake.style.left=`${last.x}%`;cupcake.style.top=`${last.y}%`;

    state={scene,route,segs,total,pellets,player:scene.querySelector('.pac2-player'),cupcake,ghosts:[scene.querySelector('.g1'),scene.querySelector('.g2'),scene.querySelector('.g3'),scene.querySelector('.g4')]};
    lastPelletIndex=-1;finishPlayed=false;sirenPhase=0;nextSirenAt=0;
  }

  function render(progress,now){
    if(!state) return;
    const running=(stageStatus?.textContent.trim()||'')==='Running';
    state.scene.classList.toggle('pac2-running',running);
    state.scene.classList.toggle('pac2-finished',progress>=.9999);

    const p=pointAlong(state.route,state.segs,state.total,progress);
    state.player.style.left=`${p.x}%`;state.player.style.top=`${p.y}%`;state.player.style.setProperty('--dir',`${p.angle}deg`);
    const mouth=running?9+Math.abs(Math.sin(now/72))*26:12;
    state.player.style.setProperty('--mouth-top',`${50-mouth*.5}%`);
    state.player.style.setProperty('--mouth-bottom',`${50+mouth*.5}%`);

    let latest=-1;
    state.pellets.forEach((pellet,i)=>{
      const eaten=pellet.t<=progress+.002;
      pellet.el.classList.toggle('eaten',eaten);
      if(eaten) latest=i;
    });
    if(running&&latest>lastPelletIndex){
      const count=Math.min(4,latest-lastPelletIndex);
      for(let j=0;j<count;j++) setTimeout(()=>waka(latest-j),j*34);
      lastPelletIndex=latest;
    }else if(latest<lastPelletIndex){lastPelletIndex=latest;}

    const delays=[.045,.082,.125,.17];
    state.ghosts.forEach((ghost,i)=>{
      const gp=clamp(progress-delays[i],0,1);
      const g=pointAlong(state.route,state.segs,state.total,gp);
      ghost.style.left=`${g.x}%`;ghost.style.top=`${g.y+Math.sin(now/180+i)*.45}%`;
    });

    if(running&&progress<.995&&now>=nextSirenAt){chasePulse();nextSirenAt=now+470;}

    if(progress>=.994){state.cupcake.classList.add('eaten');cupcakeSound();}
    else state.cupcake.classList.remove('eaten');
  }

  function loop(now){
    const scene=sceneLayer.querySelector('.xt-pacman[data-xt-theme="pacman"]');
    if(scene!==lastScene){lastScene=scene||null;displayedRemaining=null;state=null;}
    if(scene){
      if(scene.dataset.pac2!=='1') build(scene);
      if(!state) build(scene);
      render(progressNow(now),now);
    }
    raf=requestAnimationFrame(loop);
  }

  raf=requestAnimationFrame(loop);
})();
(() => {
  'use strict';

  if (document.getElementById('dominoesUpgradeStyleV1')) return;

  const sceneLayer = document.getElementById('sceneLayer');
  const stageStatus = document.getElementById('stageStatus');
  const display = document.getElementById('countdownDisplay');
  const minutesInput = document.getElementById('countdownMinutes');
  const secondsInput = document.getElementById('countdownSeconds');
  if (!sceneLayer || !display) return;

  const style = document.createElement('style');
  style.id = 'dominoesUpgradeStyleV1';
  style.textContent = `
    .xt-dominoes.domino2-upgraded {
      background:
        radial-gradient(ellipse at 50% 8%, rgba(255,255,255,.78), transparent 38%),
        linear-gradient(180deg,#eee8df 0%,#e4dbcf 100%) !important;
      overflow:hidden;
    }

    .xt-dominoes.domino2-upgraded::before {
      content:'';
      position:absolute;
      inset:0;
      background:linear-gradient(110deg,rgba(255,255,255,.18),transparent 35%,rgba(113,91,70,.05));
      pointer-events:none;
    }

    .domino2-table {
      position:absolute;
      left:3.5%;
      right:3.5%;
      top:22%;
      bottom:4%;
      border-radius:22px;
      background:
        linear-gradient(180deg,rgba(255,255,255,.32),rgba(255,255,255,.04)),
        #e7dfd4;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.7),
        inset 0 -1px 0 rgba(86,64,45,.08),
        0 18px 34px rgba(73,53,38,.10);
      overflow:hidden;
      perspective:850px;
    }

    .domino2-field {
      position:absolute;
      inset:0;
      overflow:visible;
    }

    .domino2-piece {
      position:absolute;
      left:var(--x);
      top:var(--y);
      width:12px;
      height:50px;
      border-radius:2.5px;
      transform-origin:50% 100%;
      transform:translate(-50%,-100%) rotate(0deg);
      background:
        linear-gradient(90deg,rgba(255,255,255,.28),transparent 26%,rgba(65,50,40,.08) 100%),
        var(--c);
      border:1px solid rgba(74,58,45,.10);
      box-shadow:
        inset 1px 0 0 rgba(255,255,255,.35),
        inset -2px -2px 3px rgba(73,54,42,.08),
        3px 6px 7px rgba(74,54,39,.18);
      z-index:var(--z,3);
      will-change:transform,filter,box-shadow;
      backface-visibility:hidden;
    }

    .domino2-piece::before {
      content:'';
      position:absolute;
      left:1px;
      right:2px;
      top:1px;
      height:3px;
      border-radius:2px;
      background:rgba(255,255,255,.24);
      pointer-events:none;
    }

    .domino2-piece::after {
      content:'';
      position:absolute;
      top:2px;
      right:-2px;
      width:2px;
      bottom:1px;
      border-radius:0 2px 2px 0;
      background:rgba(72,53,40,.12);
      pointer-events:none;
    }

    @media(max-width:760px){
      .domino2-table{left:2%;right:2%;top:25%;bottom:3%;border-radius:15px}
      .domino2-piece{width:9px;height:39px;border-radius:2px}
    }
  `;
  document.head.appendChild(style);

  const palette = [
    '#efb4b7','#f2c2aa','#f4d58a','#dce5a5','#bcd9a8','#a9d7c6',
    '#a9d3df','#adc8e5','#b8bee1','#cdb8df','#dfb8d4','#ecc1cf',
    '#d9d4bd','#c5d7bf','#b9d8d4','#c4cce7','#ded1e8','#f0cdb9'
  ];

  const clamp = (v,min,max) => Math.max(min,Math.min(max,v));
  const smooth = t => t*t*(3-2*t);
  const lerp = (a,b,t) => a+(b-a)*t;

  let displayedRemaining = null;
  let displayChangedAt = performance.now();
  let lastStatus = '';
  let lastScene = null;
  let raf = 0;
  let state = null;

  function parseRemaining(){
    const parts = display.textContent.trim().split(':').map(Number);
    if(parts.some(v=>!Number.isFinite(v))) return null;
    if(parts.length===2) return parts[0]*60+parts[1];
    if(parts.length===3) return parts[0]*3600+parts[1]*60+parts[2];
    return null;
  }

  function totalSeconds(){
    return Math.max(1,(Number(minutesInput?.value)||0)*60+(Number(secondsInput?.value)||0));
  }

  function progressNow(now){
    const current = parseRemaining();
    if(current===null) return 0;
    const status = stageStatus?.textContent.trim() || '';
    const running = status === 'Running';
    if(displayedRemaining===null || current!==displayedRemaining || status!==lastStatus){
      displayedRemaining=current;
      displayChangedAt=now;
      lastStatus=status;
    }
    let estimated=current;
    if(running && current>0) estimated=Math.max(0,current-(now-displayChangedAt)/1000);
    return clamp(1-estimated/totalSeconds(),0,1);
  }

  function makePoint(x,y,dir){
    return {x,y,dir};
  }

  function buildPieces(scene){
    const field = scene.querySelector('.domino2-field');
    if(!field) return;

    const rect = field.getBoundingClientRect();
    if(rect.width < 120 || rect.height < 120) return;

    field.innerHTML='';

    const mobile = rect.width < 620;
    const pieceH = mobile ? 39 : 50;
    const sidePad = mobile ? 22 : 34;
    const topPad = mobile ? 46 : 58;
    const bottomPad = mobile ? 30 : 38;
    const rows = 5;
    const rowGap = (rect.height-topPad-bottomPad)/(rows-1);
    const leftX = sidePad + (mobile?5:6);
    const rightX = rect.width-sidePad-(mobile?5:6);
    const targetStep = mobile ? 24 : 34;
    const cols = Math.max(14,Math.floor((rightX-leftX)/targetStep)+1);
    const step = (rightX-leftX)/(cols-1);
    const turnRadius = mobile ? 15 : 23;
    const turnSteps = 4;

    const points=[];

    for(let row=0;row<rows;row++){
      const y=topPad+row*rowGap;
      const dir=row%2===0?1:-1;
      for(let i=0;i<cols;i++){
        const logical=dir===1?i:(cols-1-i);
        points.push(makePoint(leftX+logical*step,y,dir));
      }

      if(row<rows-1){
        const edgeX=dir===1?rightX:leftX;
        const nextY=topPad+(row+1)*rowGap;
        for(let j=1;j<=turnSteps;j++){
          const t=j/(turnSteps+1);
          points.push(makePoint(
            edgeX + dir*Math.sin(Math.PI*t)*turnRadius,
            lerp(y,nextY,t),
            dir
          ));
        }
      }
    }

    const frag=document.createDocumentFragment();
    const pieces=[];

    points.forEach((p,i)=>{
      const next=points[Math.min(points.length-1,i+1)];
      const prev=points[Math.max(0,i-1)];
      const dx=i<points.length-1?next.x-p.x:p.x-prev.x;
      const dy=i<points.length-1?next.y-p.y:p.y-prev.y;
      let fallDir=p.dir;
      if(Math.abs(dx)>2) fallDir=dx>=0?1:-1;
      else if(i>0) fallDir=pieces[i-1]?.fallDir || p.dir;

      const piece=document.createElement('i');
      piece.className='domino2-piece';
      piece.style.setProperty('--x',`${p.x.toFixed(2)}px`);
      piece.style.setProperty('--y',`${p.y.toFixed(2)}px`);
      piece.style.setProperty('--c',palette[Math.floor(Math.random()*palette.length)]);
      piece.style.setProperty('--z',String(20+Math.round(p.y)));
      piece.dataset.domino2=String(i);
      frag.appendChild(piece);
      pieces.push({el:piece,fallDir,dx,dy});
    });

    field.appendChild(frag);
    state={scene,field,pieces,width:rect.width,height:rect.height,pieceH};
  }

  function upgrade(scene){
    if(!scene) return;
    if(scene.dataset.domino2Upgraded!=='1'){
      scene.innerHTML='<div class="domino2-table"><div class="domino2-field"></div></div>';
      scene.dataset.domino2Upgraded='1';
      scene.classList.add('domino2-upgraded');
      state=null;
      requestAnimationFrame(()=>buildPieces(scene));
    }
  }

  function render(progress){
    if(!state?.pieces?.length) return;
    const n=state.pieces.length;
    const wave=progress*n;

    state.pieces.forEach((piece,i)=>{
      const local=smooth(clamp((wave-i)/.82,0,1));
      const angle=piece.fallDir*86*local;
      const slide=piece.fallDir*3.5*local;
      piece.el.style.transform=`translate(-50%,-100%) rotate(${angle.toFixed(2)}deg) translateX(${slide.toFixed(2)}px)`;
      piece.el.style.filter=`brightness(${(1-local*.035).toFixed(3)})`;
      piece.el.style.boxShadow=`${(3+piece.fallDir*local*4).toFixed(1)}px ${(6+local*5).toFixed(1)}px ${(7+local*3).toFixed(1)}px rgba(74,54,39,${(0.18-local*.05).toFixed(3)})`;
    });
  }

  function maybeRebuild(scene){
    const field=scene?.querySelector('.domino2-field');
    if(!field) return;
    const rect=field.getBoundingClientRect();
    if(!state || Math.abs(rect.width-state.width)>18 || Math.abs(rect.height-state.height)>18){
      buildPieces(scene);
    }
  }

  function loop(now){
    const scene=sceneLayer.querySelector('.xt-dominoes[data-xt-theme="dominoes"]');

    if(scene!==lastScene){
      lastScene=scene||null;
      displayedRemaining=null;
      state=null;
    }

    if(scene){
      upgrade(scene);
      maybeRebuild(scene);
      render(progressNow(now));
    }

    raf=requestAnimationFrame(loop);
  }

  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(loop);
})();

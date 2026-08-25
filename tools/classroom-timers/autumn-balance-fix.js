(() => {
  'use strict';

  if (window.__autumnBalanceFixV1) return;
  window.__autumnBalanceFixV1 = true;

  const sceneLayer = document.getElementById('sceneLayer');
  const display = document.getElementById('countdownDisplay');
  const stageStatus = document.getElementById('stageStatus');
  const minutesInput = document.getElementById('countdownMinutes');
  const secondsInput = document.getElementById('countdownSeconds');
  if (!sceneLayer || !display) return;

  const style = document.createElement('style');
  style.id = 'autumnBalanceFixStyleV1';
  style.textContent = `
    .autumn-balance-leaf{
      position:absolute;z-index:8;width:var(--leaf-size);height:calc(var(--leaf-size) * .74);
      border-radius:80% 20% 75% 25%;transform:translate(-50%,-50%) rotate(var(--leaf-rot));
      transform-origin:50% 50%;box-shadow:0 2px 2px rgba(58,43,24,.13);
      pointer-events:none;will-change:left,top,transform,background
    }
    .xt-autumn .autumn-v2-bird{z-index:24!important}
    .xt-autumn .autumn-v2-vulture{z-index:26!important}
  `;
  document.head.appendChild(style);

  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const easeOut=t=>1-Math.pow(1-clamp(t,0,1),3);
  const mix=(a,b,t)=>a.map((v,i)=>Math.round(lerp(v,b[i],t)));
  const rgb=c=>`rgb(${c[0]},${c[1]},${c[2]})`;
  const quad=(a,b,c,t)=>{const mt=1-t;return mt*mt*a+2*mt*t*b+t*t*c;};

  let active=null;
  let displayedRemaining=null;
  let displayChangedAt=performance.now();
  let lastStatus='';

  function hash01(n){
    const x=Math.sin((n+1)*12.9898+78.233)*43758.5453;
    return x-Math.floor(x);
  }

  function parseRemaining(){
    const parts=(display.textContent||'').trim().split(':').map(Number);
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
    const status=(stageStatus?.textContent||'').trim();
    if(displayedRemaining===null||displayedRemaining!==current||status!==lastStatus){
      displayedRemaining=current;
      displayChangedAt=now;
      lastStatus=status;
    }
    let estimated=current;
    if(status==='Running'&&current>0) estimated=Math.max(0,current-(now-displayChangedAt)/1000);
    return clamp(1-estimated/totalSeconds(),0,1);
  }

  function finalColour(index){
    const h=hash01(index+930);
    if(h<.28) return mix([88,52,29],[126,62,34],h/.28);
    if(h<.58) return mix([126,62,34],[171,82,39],(h-.28)/.30);
    if(h<.82) return mix([171,82,39],[174,58,39],(h-.58)/.24);
    return mix([174,58,39],[142,42,39],(h-.82)/.18);
  }

  function leafColour(progress,index){
    const t=clamp(progress/.55,0,1);
    const target=finalColour(index);
    let c;
    if(t<.40) c=mix([48,137,58],[77,153,60],t/.40);
    else if(t<.70) c=mix([77,153,60],[184,139,43],(t-.40)/.30);
    else c=mix([184,139,43],target,(t-.70)/.30);
    const shade=(hash01(index+401)-.5)*12;
    return rgb(c.map(v=>clamp(Math.round(v+shade),0,255)));
  }

  function addBand(metas,x1,y1,x2,y2,count,width,seed){
    const dx=x2-x1,dy=y2-y1;
    const mag=Math.hypot(dx,dy)||1;
    const nx=-dy/mag,ny=dx/mag;
    for(let i=0;i<count;i++){
      const u=(i+.35+hash01(seed+i)*.3)/count;
      const across=(hash01(seed+i+100)-.5)*2*width;
      const along=(hash01(seed+i+200)-.5)*1.25;
      const left=x1+dx*u+nx*across+(dx/mag)*along;
      const top=y1+dy*u+ny*across+(dy/mag)*along;
      metas.push({
        left,top,
        size:15+hash01(seed+i+300)*10,
        rot:-75+hash01(seed+i+400)*150,
        spin:(hash01(seed+i+500)>.5?1:-1)*(180+hash01(seed+i+600)*210),
        finalX:clamp(left-6+hash01(seed+i+700)*12,22,97),
        finalY:86+hash01(seed+i+800)*7,
        sway:(hash01(seed+i+900)-.5)*6,
        phase:hash01(seed+i+1000)*Math.PI*2,
        order:0
      });
    }
  }

  function build(scene){
    scene.querySelectorAll('.autumn-balance-leaf').forEach(el=>el.remove());
    const metas=[];

    // These paths deliberately sit on top of the actual exposed right-side branches.
    addBand(metas,63.2,50.5,77.8,27.5,56,3.4,10);   // upper-right branch
    addBand(metas,64.0,70.8,95.0,46.0,82,3.8,300);  // long lower-right branch
    addBand(metas,72.0,36.0,88.5,31.0,34,3.0,700);  // right-hand outer/tip fill
    addBand(metas,61.5,48.0,70.0,33.5,30,2.8,1000); // inner fork fill

    // Deterministic fall order keeps the starting canopy balanced on every refresh.
    const ranked=metas.map((_,i)=>({i,key:hash01(i+1500)})).sort((a,b)=>a.key-b.key);
    ranked.forEach((item,rank)=>metas[item.i].order=rank);

    const fragment=document.createDocumentFragment();
    const leaves=[];
    metas.forEach((meta,i)=>{
      const leaf=document.createElement('i');
      leaf.className='autumn-balance-leaf';
      leaf.style.left=`${meta.left}%`;
      leaf.style.top=`${meta.top}%`;
      leaf.style.setProperty('--leaf-size',`${meta.size.toFixed(1)}px`);
      leaf.style.setProperty('--leaf-rot',`${meta.rot.toFixed(1)}deg`);
      fragment.appendChild(leaf);
      leaves.push(leaf);
    });
    scene.appendChild(fragment);
    return {scene,leaves,metas};
  }

  function ensureScene(){
    const scene=sceneLayer.querySelector('.xt-autumn[data-xt-theme="autumn"]');
    if(!scene){active=null;return null;}
    if(!active||active.scene!==scene||!scene.querySelector('.autumn-balance-leaf')) active=build(scene);
    return active;
  }

  function renderLeaves(instance,progress){
    const count=instance.leaves.length;
    instance.leaves.forEach((leaf,i)=>{
      const meta=instance.metas[i];
      leaf.style.background=leafColour(progress,i+2200);
      const fallStart=.585+(meta.order/Math.max(1,count-1))*.295;
      const local=clamp((progress-fallStart)/.095,0,1);
      const e=easeOut(local);
      const sway=Math.sin(meta.phase+local*Math.PI*2)*meta.sway*local;
      const left=lerp(meta.left,meta.finalX,e)+sway;
      const top=lerp(meta.top,meta.finalY,e);
      leaf.style.left=`${left.toFixed(2)}%`;
      leaf.style.top=`${top.toFixed(2)}%`;
      leaf.style.transform=`translate(-50%,-50%) rotate(${(meta.rot+meta.spin*e).toFixed(1)}deg)`;
      leaf.style.zIndex=local>=1?'3':'8';
    });
  }

  function renderVulture(scene,progress,now){
    const vulture=scene.querySelector('.autumn-v2-vulture');
    if(!vulture) return;
    const t=clamp((progress-.91)/.085,0,1);
    if(t<=0) return;

    const perchX=76.5;
    const perchY=43.3;
    const x=quad(108,93,perchX,t);
    const y=quad(18,28,perchY,t);
    const flying=t<.90;
    const wing=flying ? -18+Math.sin(now/58)*28 : -7;
    const scale=lerp(.82,1,t);
    // The branch rises to the right, so the perched bird tilts with it. This puts both feet on the wood.
    const rotation=flying ? lerp(8,-15,t) : -15;

    vulture.style.opacity='1';
    vulture.style.left=`${x}%`;
    vulture.style.top=`${y}%`;
    vulture.style.setProperty('--v-wing-angle',`${wing.toFixed(1)}deg`);
    vulture.style.transform=`translate(-50%,-50%) rotate(${rotation.toFixed(1)}deg) scaleX(-1) scale(${scale.toFixed(3)})`;
  }

  function tick(now){
    const instance=ensureScene();
    if(instance){
      const progress=progressNow(now);
      renderLeaves(instance,progress);
      renderVulture(instance.scene,progress,now);
    }
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();

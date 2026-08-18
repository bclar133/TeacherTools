(() => {
  'use strict';

  const sceneLayer = document.getElementById('sceneLayer');
  const stage = document.getElementById('countdownStage');
  if (!sceneLayer || !stage) return;

  const style = document.createElement('style');
  style.id = 'rocketMoonFlightV1';
  style.textContent = `
    .rocket-scene.rocket-flight-active {
      background:
        radial-gradient(circle at 18% 78%, rgba(42,87,132,.28) 0 10%, transparent 30%),
        radial-gradient(circle at 75% 18%, rgba(45,67,116,.23), transparent 28%),
        linear-gradient(#030714,#0b1730 65%,#132747) !important;
    }

    .rocket-scene.rocket-flight-active .rocket-pad,
    .rocket-scene.rocket-flight-active .launch-count {
      display:none !important;
    }

    .rocket-scene.rocket-flight-active .rocket-stars {
      opacity:.88;
      background-image:
        radial-gradient(circle,#fff 0 1px,transparent 1.4px),
        radial-gradient(circle,#a9d7ff 0 1px,transparent 1.5px);
      background-size:54px 54px,83px 83px;
      background-position:0 0,27px 19px;
    }

    .rocket-scene.rocket-flight-active .rocket {
      z-index:7;
      left:var(--rocket-x,12%) !important;
      top:var(--rocket-y,82%) !important;
      bottom:auto !important;
      transform:translate(-50%,-50%) rotate(var(--rocket-angle,-55deg)) scale(.68) !important;
      transform-origin:50% 50% !important;
      will-change:left,top,transform;
      filter:drop-shadow(0 0 12px rgba(255,126,48,.42)) drop-shadow(0 8px 8px rgba(0,0,0,.28)) !important;
    }

    .rocket-scene.rocket-flight-active .rocket-flame {
      min-height:22px !important;
      filter:drop-shadow(0 0 12px #ff883a);
    }

    .rocket-moon {
      position:absolute;
      z-index:4;
      left:86%;
      top:18%;
      width:116px;
      height:116px;
      transform:translate(-50%,-50%);
      border-radius:50%;
      background:
        radial-gradient(circle at 31% 28%,rgba(255,255,255,.92) 0 7%,transparent 8%),
        radial-gradient(circle at 66% 31%,rgba(125,139,157,.34) 0 10%,transparent 11%),
        radial-gradient(circle at 38% 67%,rgba(119,133,151,.3) 0 8%,transparent 9%),
        radial-gradient(circle at 72% 72%,rgba(135,149,166,.26) 0 5%,transparent 6%),
        radial-gradient(circle at 38% 31%,#fff 0%,#e8eef4 44%,#c6d0db 78%,#aebbc8 100%);
      box-shadow:
        inset -15px -12px 20px rgba(75,90,108,.18),
        0 0 35px rgba(226,239,255,.48),
        0 0 75px rgba(190,218,255,.18);
    }

    .rocket-moon::before,
    .rocket-moon::after {
      content:'';
      position:absolute;
      border-radius:50%;
      border:2px solid rgba(115,131,149,.18);
      background:rgba(122,137,154,.13);
    }
    .rocket-moon::before { width:24px;height:15px;left:20px;top:57px;transform:rotate(-17deg); }
    .rocket-moon::after { width:17px;height:12px;right:21px;top:49px;transform:rotate(12deg); }

    .rocket-flight-active.rocket-arrived .rocket-moon {
      animation:moonImpactPulse .45s ease-out 1;
    }
    @keyframes moonImpactPulse {
      0% { box-shadow:inset -15px -12px 20px rgba(75,90,108,.18),0 0 35px rgba(226,239,255,.48),0 0 75px rgba(190,218,255,.18); }
      45% { box-shadow:inset -15px -12px 20px rgba(75,90,108,.18),0 0 46px rgba(255,246,183,.85),0 0 92px rgba(255,205,95,.34); }
      100% { box-shadow:inset -15px -12px 20px rgba(75,90,108,.18),0 0 35px rgba(226,239,255,.48),0 0 75px rgba(190,218,255,.18); }
    }

    @media (max-width:760px) {
      .rocket-moon { width:92px;height:92px; }
      .rocket-scene.rocket-flight-active .rocket {
        transform:translate(-50%,-50%) rotate(var(--rocket-angle,-55deg)) scale(.55) !important;
      }
    }
  `;
  document.head.appendChild(style);

  let active = null;

  function clamp(n,min,max){ return Math.max(min,Math.min(max,n)); }

  function progressFromFlame(flame) {
    if (!flame) return 0;
    const px = parseFloat(flame.style.getPropertyValue('--flame'));
    return Number.isFinite(px) ? clamp((px - 16) / 45, 0, 1) : 0;
  }

  function quadratic(a,b,c,t) {
    const mt=1-t;
    return mt*mt*a + 2*mt*t*b + t*t*c;
  }

  function flightGeometry(scene) {
    const rect=scene.getBoundingClientRect();
    const moon=scene.querySelector('.rocket-moon');
    const moonRect=moon?.getBoundingClientRect();
    const moonRadius=(moonRect?.width || 116)/2;
    const start={x:rect.width*.12,y:rect.height*.82};
    const control={x:rect.width*.39,y:rect.height*.22};
    const moonCenter={x:rect.width*.86,y:rect.height*.18};

    // The visible rocket is the original 185px-tall rocket scaled to 68%.
    // Its nose sits about 75px in front of its centre. Find the end point
    // iteratively so the nose, not the centre, is what first touches the moon.
    const noseOffset=rect.width<=760 ? 61 : 75;
    let end={...moonCenter};
    for(let i=0;i<4;i++){
      const dx=end.x-control.x,dy=end.y-control.y;
      const mag=Math.hypot(dx,dy)||1;
      const ux=dx/mag,uy=dy/mag;
      end={
        x:moonCenter.x-ux*(moonRadius+noseOffset),
        y:moonCenter.y-uy*(moonRadius+noseOffset)
      };
    }
    return {rect,start,control,end};
  }

  function render(instance,progress) {
    if(!instance?.scene?.isConnected) return;
    progress=clamp(progress,0,1);
    instance.progress=progress;

    const {rect,start,control,end}=flightGeometry(instance.scene);
    if(!rect.width||!rect.height) return;

    const t=progress;
    const x=quadratic(start.x,control.x,end.x,t);
    const y=quadratic(start.y,control.y,end.y,t);

    // Quadratic Bezier tangent derivative.
    const dx=2*(1-t)*(control.x-start.x)+2*t*(end.x-control.x);
    const dy=2*(1-t)*(control.y-start.y)+2*t*(end.y-control.y);
    const tangentAngle=Math.atan2(dy,dx)*180/Math.PI;

    // The rocket artwork points straight up by default, hence +90deg.
    instance.rocket.style.setProperty('--rocket-x',`${x/rect.width*100}%`);
    instance.rocket.style.setProperty('--rocket-y',`${y/rect.height*100}%`);
    instance.rocket.style.setProperty('--rocket-angle',`${tangentAngle+90}deg`);

    // app-core's old end-of-timer launch animation is no longer wanted.
    instance.rocket.getAnimations().forEach(animation=>animation.cancel());

    const arrived=progress>=.9999;
    instance.scene.classList.toggle('rocket-arrived',arrived);
  }

  function install(scene) {
    if(!scene || scene.dataset.moonFlight==='true') return;
    const rocket=scene.querySelector('.rocket');
    const flame=scene.querySelector('.rocket-flame');
    if(!rocket||!flame) return;

    scene.dataset.moonFlight='true';
    scene.classList.add('rocket-flight-active');

    const moon=document.createElement('div');
    moon.className='rocket-moon';
    moon.setAttribute('aria-hidden','true');
    scene.appendChild(moon);

    const instance={scene,rocket,flame,progress:progressFromFlame(flame),observer:null};
    let queued=false;
    instance.observer=new MutationObserver(()=>{
      if(queued) return;
      queued=true;
      requestAnimationFrame(()=>{
        queued=false;
        render(instance,progressFromFlame(flame));
      });
    });
    instance.observer.observe(flame,{attributes:true,attributeFilter:['style']});
    active=instance;
    requestAnimationFrame(()=>render(instance,instance.progress));
  }

  function scan() {
    const scene=sceneLayer.querySelector('.rocket-scene');
    if(scene) install(scene);
    else if(active&&!active.scene.isConnected){
      active.observer?.disconnect();
      active=null;
    }
  }

  const observer=new MutationObserver(scan);
  observer.observe(sceneLayer,{childList:true,subtree:true});
  window.addEventListener('resize',()=>{ if(active) requestAnimationFrame(()=>render(active,active.progress)); });
  scan();
})();

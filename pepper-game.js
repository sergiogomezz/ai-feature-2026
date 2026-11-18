import * as THREE from 'three';
import { getPlaybackRate } from './playback.js';
import { createFlyingPepper } from './flying-pepper.js';

// A short, forgiving flight. Missed hoops come back; collected ones stay collected.
export function createPepperGame({renderer, container, reduced, onComplete, onScore}) {
  const overlay = document.createElement('section');
  overlay.className = 'pepper-game'; overlay.hidden = true;
  overlay.setAttribute('aria-label', 'El pimiento volador');
  overlay.innerHTML = `<div class="pepper-heading"><h2>Pimiento volador</h2><p>Pasa por 6 aros. Toca o pulsa espacio para subir.</p></div>
    <button class="pepper-flight" aria-label="Aletear. También puedes usar espacio o flecha arriba."></button>
    <div class="pepper-fallback" aria-hidden="true"><span class="pepper-vegetable"><svg viewBox="0 0 120 140"><g fill="#fff1cd" stroke="#d1bb90" stroke-width="2"><path d="M42 56Q-8 18 5 66Q15 82 40 77Z"/><path d="M78 56Q128 18 115 66Q105 82 80 77Z"/></g><path d="M49 31Q43 4 64 8" fill="none" stroke="#3d683a" stroke-width="8" stroke-linecap="round"/><path d="M39 31Q17 39 29 95Q42 128 61 117Q83 130 95 87Q103 35 78 31Q62 24 57 35Z" fill="#d43d27" stroke="#a5291e" stroke-width="3"/><path d="M45 40Q35 62 46 92" fill="none" stroke="#ff8a5c" stroke-width="5" stroke-linecap="round"/><g fill="#fff9dc" stroke="#775637" stroke-width="5"><ellipse cx="48" cy="61" rx="12" ry="15"/><ellipse cx="76" cy="61" rx="12" ry="15"/></g><g fill="#283337"><ellipse cx="52" cy="62" rx="5" ry="8"/><ellipse cx="80" cy="62" rx="5" ry="8"/></g><path d="M54 87Q65 96 76 85" fill="none" stroke="#502b25" stroke-width="3" stroke-linecap="round"/></svg></span><span class="pepper-hoop"></span></div>
    <div class="pepper-ready"><button class="primary pepper-start">Empezar</button></div>
    <div class="pepper-footer"><p class="pepper-score" role="status" aria-live="polite">0 / 6 aros</p><button class="quiet pepper-help" aria-pressed="false">Ayuda</button></div>
    <div class="pepper-finished" hidden><span>✦</span><h2>6 / 6</h2><button class="primary pepper-return">Volver al árbol ↗</button></div>`;
  container.append(overlay);
  const $ = selector => overlay.querySelector(selector);
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#b8dce1');
  scene.fog = new THREE.Fog('#b8dce1', 20, 65);
  const camera = new THREE.OrthographicCamera(-8,8,5,-5,.1,100);camera.position.set(0,0,16);
  scene.add(new THREE.HemisphereLight('#fff9df','#718888',3));
  const sun = new THREE.DirectionalLight('#ffe9b6',3);sun.position.set(-4,8,12);scene.add(sun);
  const material = (color, roughness=.4) => new THREE.MeshStandardMaterial({color,roughness});
  function mesh(geometry,mat,parent,x=0,y=0,z=0){const item=new THREE.Mesh(geometry,mat);item.position.set(x,y,z);parent.add(item);return item;}
  const cream=material('#fff8e0');
  const {pepper,animate:animatePepper}=createFlyingPepper();scene.add(pepper);
  const ring = new THREE.Group();scene.add(ring);
  const hoop=mesh(new THREE.TorusGeometry(1.75,.075,12,64),new THREE.MeshStandardMaterial({color:'#e5ae43',metalness:.7,roughness:.25,emissive:'#a46015',emissiveIntensity:.12}),ring);
  hoop.rotation.y=1.15;
  const ringGlow=mesh(new THREE.TorusGeometry(1.75,.14,8,48),new THREE.MeshBasicMaterial({color:'#fff0b8',transparent:true,opacity:.15}),ring);ringGlow.rotation.y=1.15;
  const clouds=[];
  for(let i=0;i<14;i++){
    const cloud=new THREE.Group();scene.add(cloud);cloud.position.set((i%5-2)*5,Math.sin(i*5)*5,-5-i%3*3);
    for(let j=0;j<3;j++){const puff=mesh(new THREE.SphereGeometry(1,12,10),cream,cloud,(j-1)*.9,Math.sin(j)*.2,0);puff.scale.set(1.3,.48,.55);}clouds.push(cloud);
  }
  let active=false, paused=false, running=false, finished=false, assisted=false;
  let score=0,y=0,velocity=0,ringX=0,ringY=0,width=16,clock=0,previous=null,frame;
  let collisionTimer=0,collisions=0,pendingPass=false;
  const heights=[0,.8,-.6,.6,-.8,.2];
  function resize(){
    const rect=container.getBoundingClientRect();width=10*rect.width/rect.height;
    camera.left=-width/2;camera.right=width/2;camera.updateProjectionMatrix();
    if(renderer)renderer.setSize(rect.width,rect.height);
  }
  const observer=new ResizeObserver(resize);observer.observe(container);
  function nextRing(){ringX=width/2+1.5;ringY=heights[score%heights.length];pendingPass=false;}
  function flap(){if(!active||paused||document.hidden||finished)return;if(!running)return;velocity=3.5;}
  $('.pepper-flight').addEventListener('pointerdown',flap);
  // Keyboard clicks (Enter) have no pointerdown.
  $('.pepper-flight').addEventListener('click',event=>{if(event.detail===0)flap();});
  document.addEventListener('keydown',event=>{
    if(!active||!running||finished||event.repeat||!['Space','ArrowUp'].includes(event.code)||event.target.closest('button:not(.pepper-flight)'))return;
    event.preventDefault();flap();
  });
  $('.pepper-start').addEventListener('click',()=>{
    if(paused)return;running=true;$('.pepper-ready').hidden=true;$('.pepper-flight').focus({preventScroll:true});
  });
  $('.pepper-help').addEventListener('click',()=>{
    if(paused||finished)return;assisted=!assisted;
    $('.pepper-help').setAttribute('aria-pressed',String(assisted));
    $('.pepper-help').textContent=assisted?'Ayuda activada ✓':'Ayuda';
  });
  $('.pepper-return').addEventListener('click',()=>{if(!paused&&finished)onComplete();});
  function finishRing(){
    score++;$('.pepper-score').textContent=`${score} / 6 aros`;onScore?.(score);
    if(score===6){finished=true;ring.visible=false;$('.pepper-finished').hidden=false;$('.pepper-flight').hidden=true;$('.pepper-footer').hidden=true;$('.pepper-heading').hidden=true;$('.pepper-return').focus({preventScroll:true});}
    else nextRing();
  }
  function step(dt){
    if(collisionTimer>0){
      collisionTimer=Math.max(0,collisionTimer-dt);velocity*=Math.exp(-dt*5);y+=velocity*dt;
      if(collisionTimer===0){nextRing();$('.pepper-score').textContent=`${score} / 6 aros`;}
      return;
    }
    if(assisted){y+=(ringY-y)*Math.min(1,dt*5);velocity=0;}
    else {velocity-=5*dt;y+=velocity*dt;if(y < -3.3){y=-3.3;velocity=0;}if(y>2.7){y=2.7;velocity=Math.min(velocity,0);}}
    const playerX=-width*.24,before=ringX;
    ringX-=Math.max(2,width*.17)*(reduced.matches?.7:1)*dt;
    const size=Math.min(1,width/5.2),halfWidth=.45*size+.075;
    const distance=Math.abs(y-ringY),halfHeight=.62*size,innerRadius=1.75-.075;
    // A swept slab around the hoop plane catches the pepper's body at the rim.
    const overlaps=ringX-playerX<halfWidth&&before-playerX>-halfWidth;
    if(overlaps&&distance+halfHeight>=innerRadius&&distance-halfHeight<=1.75+.075){
      collisionTimer=.8;collisions++;pendingPass=false;
      velocity=y>=ringY?1.8:-1.8;ringX+=.26;
      $('.pepper-score').textContent=`¡Choque! ${score} / 6`;
      overlay.dataset.collisions=String(collisions);return;
    }
    if(before>playerX&&ringX<=playerX)pendingPass=distance+halfHeight<innerRadius;
    if(pendingPass&&ringX<playerX-halfWidth){finishRing();return;}
    if(ringX < -width/2-2)nextRing();
  }
  function draw(now){
    if(!active)return;
    // ×1 is the former ×2, including gravity and flap response. Small steps avoid tunnelling.
    const dt=previous===null?0:Math.min((now-previous)/1000,.04)*getPlaybackRate()*2;previous=now;
    if(!paused&&!document.hidden){
      clock+=dt;
      if(running&&!finished){let remaining=dt;while(remaining>0&&!finished){const slice=Math.min(.016,remaining);step(slice);remaining-=slice;}}
      const bump=collisionTimer/.8;
      pepper.position.set(finished?0:-width*.24-(reduced.matches?0:Math.sin(bump*Math.PI)*.28),y,0);
      pepper.rotation.z=reduced.matches?0:Math.max(-.3,Math.min(.3,velocity*.07))+Math.sin(bump*Math.PI*4)*.15;
      animatePepper(clock,reduced.matches,bump);
      pepper.scale.multiplyScalar(Math.min(1,width/5.2));
      ring.position.set(ringX,ringY,0);
      hoop.material.color.set(bump?'#e37545':'#e5ae43');ringGlow.material.opacity=bump?.45:.15;
      if(!reduced.matches)clouds.forEach((cloud,i)=>{cloud.position.x-=dt*(.12+i%3*.06);if(cloud.position.x < -width/2-5)cloud.position.x=width/2+5;});
      if(renderer)renderer.render(scene,camera);
      else {
        $('.pepper-vegetable').style.cssText=`left:${(pepper.position.x/width+.5)*100}%;top:${(.5-y/10)*100}%`;
        $('.pepper-hoop').style.cssText=`left:${(ringX/width+.5)*100}%;top:${(.5-ringY/10)*100}%;height:35%;aspect-ratio:.42`;
      }
      overlay.dataset.score=String(score);overlay.dataset.impact=String(collisionTimer>0);
      overlay.dataset.ringX=String(ringX);overlay.dataset.playerY=String(y);
    }
    frame=requestAnimationFrame(draw);
  }
  function stop(){active=false;cancelAnimationFrame(frame);overlay.hidden=true;}
  return {
    start(){
      resize();active=true;paused=false;running=false;finished=false;assisted=reduced.matches;score=0;y=0;velocity=0;clock=0;previous=null;collisionTimer=0;collisions=0;pendingPass=false;overlay.dataset.collisions='0';ring.visible=true;
      overlay.hidden=false;overlay.classList.toggle('pepper-no-webgl',!renderer);overlay.dataset.score='0';
      for(const selector of ['.pepper-flight','.pepper-footer','.pepper-heading','.pepper-ready'])$(selector).hidden=false;
      $('.pepper-finished').hidden=true;$('.pepper-score').textContent='0 / 6 aros';
      $('.pepper-help').setAttribute('aria-pressed',String(assisted));$('.pepper-help').textContent=assisted?'Ayuda activada ✓':'Ayuda';
      nextRing();$('.pepper-start').focus({preventScroll:true});frame=requestAnimationFrame(draw);
    },
    stop,setPaused(value){paused=value;previous=null;},get active(){return active;}
  };
}

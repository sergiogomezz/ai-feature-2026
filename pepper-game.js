import * as THREE from 'three';
import { getPlaybackRate } from './playback.js';

// A short, forgiving flight. Missed hoops come back; collected ones stay collected.
export function createPepperGame({renderer, container, reduced, onComplete, onScore}) {
  const overlay = document.createElement('section');
  overlay.className = 'pepper-game'; overlay.hidden = true;
  overlay.setAttribute('aria-label', 'El pimiento volador');
  overlay.innerHTML = `<div class="pepper-heading"><h2>Pimiento volador</h2><p>Pasa por 6 aros. Toca o pulsa espacio para subir.</p></div>
    <button class="pepper-flight" aria-label="Aletear. También puedes usar espacio o flecha arriba."></button>
    <div class="pepper-fallback" aria-hidden="true"><span class="pepper-vegetable">🌶️</span><span class="pepper-hoop"></span></div>
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
  const red = new THREE.MeshPhysicalMaterial({color:'#c93422',roughness:.28,clearcoat:.9});
  const green = material('#486b36'); const cream = material('#fff8e0');
  function mesh(geometry, mat, parent, x=0,y=0,z=0) {const item=new THREE.Mesh(geometry,mat);item.position.set(x,y,z);parent.add(item);return item;}
  const pepper = new THREE.Group();scene.add(pepper);
  // A tapered, lobed bell pepper with a curved stem and two little wings.
  for(let i=0;i<3;i++){
    const angle=i*Math.PI*2/3;
    const lobe=mesh(new THREE.SphereGeometry(1,24,20),red,pepper,Math.cos(angle)*.21,0,Math.sin(angle)*.17);
    lobe.scale.set(.36,.62,.34);lobe.rotation.z=Math.cos(angle)*.12;
  }
  const tip=mesh(new THREE.SphereGeometry(.28,20,16),red,pepper,0,-.38,0);tip.scale.set(1,.8,1);
  mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0,.48,0),new THREE.Vector3(.04,.8,0),new THREE.Vector3(.27,.9,0)]),12,.075,8,false),green,pepper);
  const wings=[];
  for(const side of [-1,1]){
    const wing=new THREE.Group();pepper.add(wing);wing.position.set(side*.25,.12,-.12);wings.push(wing);
    for(let i=0;i<3;i++){const feather=mesh(new THREE.SphereGeometry(1,16,12),cream,wing,side*(.28+i*.12),.18-i*.13,0);feather.scale.set(.42,.12,.065);feather.rotation.z=side*(.4+i*.2);}
  }
  for(const x of [-.14,.14]){
    mesh(new THREE.SphereGeometry(.1,16,12),cream,pepper,x,.16,.38);
    mesh(new THREE.SphereGeometry(.046,12,10),material('#292d2c'),pepper,x+.025,.16,.465);
  }
  const mouth=mesh(new THREE.TorusGeometry(.09,.018,8,20,Math.PI),material('#56251e'),pepper,0,-.09,.4);mouth.rotation.z=Math.PI;
  const ring = new THREE.Group();scene.add(ring);
  const hoop=mesh(new THREE.TorusGeometry(1.12,.075,12,64),new THREE.MeshStandardMaterial({color:'#e5ae43',metalness:.7,roughness:.25,emissive:'#a46015',emissiveIntensity:.12}),ring);
  hoop.rotation.y=.5;
  const ringGlow=mesh(new THREE.TorusGeometry(1.12,.14,8,48),new THREE.MeshBasicMaterial({color:'#fff0b8',transparent:true,opacity:.15}),ring);ringGlow.rotation.y=.5;
  const clouds=[];
  for(let i=0;i<14;i++){
    const cloud=new THREE.Group();scene.add(cloud);cloud.position.set((i%5-2)*5,Math.sin(i*5)*5,-5-i%3*3);
    for(let j=0;j<3;j++){const puff=mesh(new THREE.SphereGeometry(1,12,10),cream,cloud,(j-1)*.9,Math.sin(j)*.2,0);puff.scale.set(1.3,.48,.55);}clouds.push(cloud);
  }
  let active=false, paused=false, running=false, finished=false, assisted=false;
  let score=0,y=0,velocity=0,ringX=0,ringY=0,width=16,clock=0,previous=null,frame;
  const heights=[0,1.2,-.9,.8,-1.2,.2];
  function resize(){
    const rect=container.getBoundingClientRect();width=10*rect.width/rect.height;
    camera.left=-width/2;camera.right=width/2;camera.updateProjectionMatrix();
    if(renderer)renderer.setSize(rect.width,rect.height);
  }
  const observer=new ResizeObserver(resize);observer.observe(container);
  function nextRing(){ringX=width/2+1.5;ringY=heights[score%heights.length];}
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
  function draw(now){
    if(!active)return;
    const dt=previous===null?0:Math.min((now-previous)/1000,.04)*getPlaybackRate();previous=now;
    if(!paused&&!document.hidden){
      clock+=dt;
      if(running&&!finished){
        if(assisted){y+=(ringY-y)*Math.min(1,dt*5);velocity=0;}
        else {velocity-=5*dt;y+=velocity*dt;if(y < -3.3){y=-3.3;velocity=0;}if(y>2.7){y=2.7;velocity=Math.min(velocity,0);}}
        const playerX=-width*.24;
        const before=ringX;ringX-=Math.max(2,width*.17)*(reduced.matches?.7:1)*dt;
        if(before>playerX&&ringX<=playerX){
          if(Math.abs(y-ringY)<.94){
            score++;$('.pepper-score').textContent=`${score} / 6 aros`;onScore?.(score);
            if(score===6){finished=true;ring.visible=false;$('.pepper-finished').hidden=false;$('.pepper-flight').hidden=true;$('.pepper-footer').hidden=true;$('.pepper-heading').hidden=true;$('.pepper-return').focus({preventScroll:true});}
            else nextRing();
          } else {$('.pepper-score').textContent=`${score} / 6`;}
        }
        if(ringX < -width/2-2)nextRing();
      }
      pepper.position.set(finished?0:-width*.24,y,0);
      pepper.rotation.z=reduced.matches?0:Math.max(-.3,Math.min(.3,velocity*.07));
      wings.forEach((wing,i)=>wing.rotation.z=reduced.matches?0:Math.sin(clock*13)*(i?-.3:.3));
      ring.position.set(ringX,ringY,0);
      if(!reduced.matches)clouds.forEach((cloud,i)=>{cloud.position.x-=dt*(.12+i%3*.06);if(cloud.position.x < -width/2-5)cloud.position.x=width/2+5;});
      if(renderer)renderer.render(scene,camera);
      else {
        $('.pepper-vegetable').style.cssText=`left:${(pepper.position.x/width+.5)*100}%;top:${( .5-y/10)*100}%`;
        $('.pepper-hoop').style.cssText=`left:${(ringX/width+.5)*100}%;top:${(.5-ringY/10)*100}%;height:22.4%;aspect-ratio:.8`;
      }
      overlay.dataset.score=String(score);
    }
    frame=requestAnimationFrame(draw);
  }
  function stop(){active=false;cancelAnimationFrame(frame);overlay.hidden=true;}
  return {
    start(){
      resize();active=true;paused=false;running=false;finished=false;assisted=reduced.matches;score=0;y=0;velocity=0;clock=0;previous=null;ring.visible=true;
      overlay.hidden=false;overlay.classList.toggle('pepper-no-webgl',!renderer);overlay.dataset.score='0';
      for(const selector of ['.pepper-flight','.pepper-footer','.pepper-heading','.pepper-ready'])$(selector).hidden=false;
      $('.pepper-finished').hidden=true;$('.pepper-score').textContent='0 / 6 aros';
      $('.pepper-help').setAttribute('aria-pressed',String(assisted));$('.pepper-help').textContent=assisted?'Ayuda activada ✓':'Ayuda';
      nextRing();$('.pepper-start').focus({preventScroll:true});frame=requestAnimationFrame(draw);
    },
    stop,setPaused(value){paused=value;previous=null;},get active(){return active;}
  };
}

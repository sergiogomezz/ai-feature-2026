import * as THREE from 'three';
import { getPlaybackRate, onPlaybackRateChange } from './playback.js';
import { createJourneyMap } from './journey-map.js';
import { createPalauArrival } from './palau-arrival.js';

const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => {const t=clamp(value);return t*t*(3-2*t);};

export function createFinale({renderer, container, reduced, onReveal, onSpeaking, soundEnabled}) {
  const overlay=document.getElementById('finale');
  const phaseLabel=document.getElementById('journey-label');
  const map=createJourneyMap(overlay);
  const aerialDuration=32000,journeyEnd=22500+aerialDuration;
  const filmSpeed=1,stageIntro=2500,deliveryHold=3500;
  const aerial=document.getElementById('journey-aerial');
  const stage=document.getElementById('ending-stage');
  const film=document.getElementById('ending-film');
  onPlaybackRateChange(rate=>{film.playbackRate=rate*filmSpeed;});
  const arrival=createPalauArrival();
  const arrivalCanvas=document.createElement('canvas');arrivalCanvas.className='journey-aerial';arrivalCanvas.hidden=true;arrivalCanvas.setAttribute('aria-hidden','true');overlay.append(arrivalCanvas);
  const play=document.getElementById('ending-play');
  const tickets=document.getElementById('ending-tickets');
  const scene=new THREE.Scene();scene.background=new THREE.Color('#01040b');
  const camera=new THREE.PerspectiveCamera(42,1,.015,1600);
  scene.add(new THREE.AmbientLight('#d2e5ff',.4));
  const sun=new THREE.DirectionalLight('#fff4d3',2.6);sun.position.set(-8,5,9);scene.add(sun);
  const earthRoot=new THREE.Group();scene.add(earthRoot);
  const texture=new THREE.TextureLoader().load('/ending/earth-hd.jpg');texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=renderer?Math.min(8,renderer.capabilities.getMaxAnisotropy()):1;
  const earth=new THREE.Mesh(new THREE.SphereGeometry(3,160,96),new THREE.MeshStandardMaterial({map:texture,roughness:.93}));earthRoot.add(earth);
  const lat=THREE.MathUtils.degToRad(41.3634),lon=THREE.MathUtils.degToRad(2.1526);
  const destination=new THREE.Vector3(Math.cos(lat)*Math.cos(lon),Math.sin(lat),-Math.cos(lat)*Math.sin(lon));
  const north=new THREE.Vector3(0,1,0).addScaledVector(destination,-destination.y).normalize();
  const east=new THREE.Vector3().crossVectors(north,destination).normalize();
  const earthOrientation=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(east,north,destination).invert());earth.quaternion.copy(earthOrientation);
  const spin=new THREE.Quaternion(),spinAxis=new THREE.Vector3(0,1,0);
  const originalPixelRatio=renderer?.getPixelRatio();
  const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(3.07,64,48),new THREE.ShaderMaterial({transparent:true,side:THREE.BackSide,depthWrite:false,blending:THREE.AdditiveBlending,vertexShader:'varying vec3 n;varying vec3 v;void main(){vec4 p=modelViewMatrix*vec4(position,1.0);n=normalize(normalMatrix*normal);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',fragmentShader:'varying vec3 n;varying vec3 v;void main(){float f=pow(1.0-abs(dot(n,v)),3.0);gl_FragColor=vec4(0.15,0.48,1.0,f*0.8);}'}));earthRoot.add(atmosphere);
  const starVertices=[];let seed=9271;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<1400;i++){const a=random()*Math.PI*2,b=Math.acos(random()*2-1),r=90+random()*100;starVertices.push(Math.sin(b)*Math.cos(a)*r,Math.cos(b)*r,Math.sin(b)*Math.sin(a)*r);}
  const starGeometry=new THREE.BufferGeometry();starGeometry.setAttribute('position',new THREE.Float32BufferAttribute(starVertices,3));
  const stars=new THREE.Points(starGeometry,new THREE.PointsMaterial({size:.16,color:'#d9e9ff',sizeAttenuation:true}));scene.add(stars);


  let active=false,paused=false,elapsed=0,last=null,raf=0,mode='earth',delivered=false,spoken=false;
  let stageAt=0,filmStarted=false,filmEndedAt=null;
  const smallScene=!renderer;
  function resize(){const r=container.getBoundingClientRect();camera.aspect=r.width/r.height;camera.updateProjectionMatrix();if(active)update();}
  function setMode(next){if(mode===next)return;mode=next;overlay.dataset.phase=next;container.dataset.travel=`finale-${next}`;}
  function speaking(value){if(spoken===value)return;spoken=value;onSpeaking(value);}
  function reveal(){
    if(!active||delivered)return;
    delivered=true;play.hidden=true;setMode('tickets');tickets.hidden=false;tickets.classList.add('arriving');film.classList.add('delivered');
    speaking(false);document.getElementById('replay-message').focus({preventScroll:true});onReveal();
  }
  async function beginFilm(){
    if(!active||mode!=='stage'||paused||document.hidden)return;
    filmStarted=true;filmEndedAt=null;
    try{await film.play();if(paused||!active||mode!=='stage')film.pause();else speaking(!film.muted);}
    catch{if(active){play.hidden=false;speaking(false);}}
  }
  function showStage(){
    if(!active||mode==='stage'||mode==='tickets')return;
    setMode('stage');aerial.hidden=true;arrivalCanvas.hidden=true;stage.hidden=false;stage.style.opacity='1';phaseLabel.textContent='';map.hide();
    stageAt=elapsed;filmStarted=false;filmEndedAt=null;film.pause();
    film.muted=!soundEnabled();film.currentTime=0;film.playbackRate=getPlaybackRate()*filmSpeed;film.preservesPitch=true;
    play.textContent=film.error?'Continuar con el regalo':'Escuchar el mensaje ▶';play.hidden=!film.muted&&!film.error;speaking(false);
  }
  film.addEventListener('ended',()=>{if(active&&mode==='stage'){filmEndedAt=elapsed;speaking(false);}});
  film.addEventListener('error',()=>{if(active&&mode==='stage'){play.hidden=false;play.textContent='Continuar con el regalo';}});
  film.addEventListener('volumechange',()=>{if(active&&mode==='stage')speaking(!film.muted&&!film.paused);});
  play.addEventListener('click',async()=>{
    if(paused)return;
    if(film.error){reveal();return;}
    if(!soundEnabled())document.getElementById('sound').click();
    film.muted=false;film.currentTime=0;play.hidden=true;
    await beginFilm();
  });
  document.getElementById('replay-message').addEventListener('click',async()=>{
    if(!active||paused)return;
    delivered=false;tickets.hidden=true;film.classList.remove('delivered');setMode('stage');film.currentTime=0;if(!soundEnabled())document.getElementById('sound').click();film.muted=false;play.hidden=true;
    await beginFilm();
  });
  document.getElementById('show-tickets').addEventListener('click',()=>{if(!paused){film.pause();reveal();}});
  function update(){
    if(mode==='tickets')return;
    if(mode==='stage'){
      if(!filmStarted&&elapsed-stageAt>=stageIntro)beginFilm();
      if(filmEndedAt!==null&&elapsed-filmEndedAt>=deliveryHold)reveal();
      return;
    }
    const t=reduced.matches?(elapsed<1000?0:elapsed<2200?22501:elapsed<6500?30000:journeyEnd+1):elapsed;
    if(t<22500){
      const d=Math.max(12,3.7/(Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.aspect));
      const rotation=smooth(t/6500),approach=smooth((t-6500)/16000);
      const metresPerAltitude=2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*6371000/3/Math.cos(lat)*Math.max(1,camera.aspect);
      const finalAltitude=850/metresPerAltitude;
      const altitude=(d-3)*Math.exp(Math.log(finalAltitude/(d-3))*approach);
      const viewSpan=altitude*metresPerAltitude;
      const mapOpacity=smooth(Math.log2(8000000/viewSpan)/.55);
      const mapReady=map.update(viewSpan,mapOpacity);
      setMode(mapOpacity>0?'city':'earth');
      earthRoot.visible=!(mapReady&&mapOpacity===1);stars.visible=earthRoot.visible;scene.background.set('#01040b');
      earth.quaternion.copy(earthOrientation).multiply(spin.setFromAxisAngle(spinAxis,Math.PI*4*(1-rotation)));
      camera.position.set(0,0,mapReady?3+Math.max(.03,altitude):Math.max(4.5,3+altitude));camera.lookAt(0,0,0);
      overlay.style.setProperty('--arrival-flash','0');
      phaseLabel.textContent='';
      overlay.dataset.turns=String(rotation*2);
      overlay.dataset.zoom=String(approach);
    }else if(t<journeyEnd){
      setMode('palau');phaseLabel.textContent='';aerial.hidden=true;
      const seconds=(t-22500)/1000;
      const blend=reduced.matches?1:smooth(seconds/3);
      map.update(850,1-blend);
      map.element.style.transform=reduced.matches?'':`perspective(1200px) rotateX(${blend*28}deg) scale(${1+blend*.18})`;
      if(blend===1)map.hide();
      const entering=arrival.update(reduced.matches?32:seconds,camera.aspect,reduced.matches);
      overlay.dataset.arrival=String(seconds);
      stage.hidden=entering===0;stage.style.opacity=String(entering);
    }else{showStage();}
    overlay.style.setProperty('--travel-progress',String(clamp(t/journeyEnd)));
    if(smallScene){overlay.classList.add('ending-fallback');overlay.style.setProperty('--earth-scale',String(1+smooth(t/6500)*3));if(mode==='palau'){arrivalCanvas.hidden=false;arrivalCanvas.width=container.clientWidth;arrivalCanvas.height=container.clientHeight;arrival.drawFallback(arrivalCanvas);}}
    else if(mode==='palau')renderer.render(arrival.scene,arrival.camera);
    else renderer.render(scene,camera);
  }
  function tick(now){
    if(!active)return;
    // Static poster/end frames can be throttled by the browser; holds use real time.
    const raw=last===null?0:Math.max(0,now-last);
    const delta=mode==='stage'||mode==='tickets'?raw:Math.min(raw,100);last=now;
    if(!paused&&!document.hidden){elapsed+=delta*getPlaybackRate();update();}
    raf=requestAnimationFrame(tick);
  }
  function start(){
    stop();active=true;elapsed=0;last=null;mode='';delivered=false;map.reset(reduced.matches);aerial.hidden=true;aerial.style.opacity='0';aerial.style.transform='scale(1)';map.element.style.transform='';stage.style.opacity='1';overlay.hidden=false;stage.hidden=true;tickets.hidden=true;film.classList.remove('delivered');tickets.classList.remove('arriving');
    if(renderer)renderer.setPixelRatio(Math.min(devicePixelRatio,2.25));
    resize();setMode('earth');overlay.style.setProperty('--arrival-flash','0');
    // Prime media during the user's click; the actual performance begins after arrival.
    if(film.error)film.load();
    film.muted=true;film.play().then(()=>{if(mode!=='stage'||!filmStarted||paused||!active)film.pause();}).catch(()=>{});
    raf=requestAnimationFrame(tick);
  }
  function stop(){if(renderer)renderer.setPixelRatio(originalPixelRatio);active=false;cancelAnimationFrame(raf);last=null;film.pause();film.currentTime=0;overlay.hidden=true;aerial.hidden=true;arrivalCanvas.hidden=true;stage.hidden=true;tickets.hidden=true;map.hide();speaking(false);}
  document.addEventListener('visibilitychange',()=>{
    last=null;
    if(!active||mode!=='stage')return;
    if(document.hidden){film.pause();speaking(false);}
    else if(!paused&&!delivered&&filmStarted&&filmEndedAt===null)film.play().then(()=>{if(active&&mode==='stage')speaking(!film.muted);}).catch(()=>{if(active)play.hidden=false;});
  });
  const observer=new ResizeObserver(resize);observer.observe(container);resize();
  return {start,stop,resize,setPaused(value){paused=value;last=null;if(!active)return;if(value){film.pause();speaking(false);}else if(mode==='stage'&&!delivered&&filmStarted&&filmEndedAt===null){film.play().then(()=>{if(active&&mode==='stage')speaking(!film.muted);else film.pause();}).catch(()=>{if(active)play.hidden=false;});}},setSound(value){film.muted=!value;if(active&&mode==='stage'){speaking(value&&!film.paused);if(!film.error)play.hidden=value&&!film.paused;}},get active(){return active;},get mode(){return mode;}};
}

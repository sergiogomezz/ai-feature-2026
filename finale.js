import * as THREE from 'three';

const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => {const t=clamp(value);return t*t*(3-2*t);};

export function createFinale({renderer, container, reduced, onReveal, onSpeaking, soundEnabled}) {
  const overlay=document.getElementById('finale');
  const caption=document.getElementById('journey-caption');
  const phaseLabel=document.getElementById('journey-label');
  const stage=document.getElementById('ending-stage');
  const aerial=document.getElementById('journey-aerial');
  const film=document.getElementById('ending-film');
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


  // A geographic-inspired Barcelona diorama: no map service, tokens or paid tiles.
  const city=new THREE.Group();scene.add(city);city.visible=false;
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(180,180),new THREE.MeshStandardMaterial({color:'#8b9c79',roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.03;city.add(ground);
  const sea=new THREE.Mesh(new THREE.PlaneGeometry(180,90),new THREE.MeshStandardMaterial({color:'#357d9a',roughness:.32,metalness:.3}));sea.rotation.x=-Math.PI/2;sea.rotation.z=-.32;sea.position.set(35,-.01,67);city.add(sea);
  const cityBlocks=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:'#d4c5ad',roughness:.9}),640);
  const dummy=new THREE.Object3D();let block=0;
  for(let x=-14;x<26;x++)for(let z=-15;z<1;z++){
    const h=.2+random()*.7;dummy.position.set(x*1.9+20,h/2,z*1.9-8);dummy.scale.set(1.25,h,1.25);dummy.rotation.y=.18;dummy.updateMatrix();cityBlocks.setMatrixAt(block++,dummy.matrix);
  }city.add(cityBlocks);
  const roadMaterial=new THREE.MeshStandardMaterial({color:'#c9c2af',roughness:1});
  for(let i=-2;i<7;i++){const road=new THREE.Mesh(new THREE.PlaneGeometry(1.1,100),roadMaterial);road.rotation.set(-Math.PI/2,0,-.2+i*.035);road.position.set(i*6,.005,-22);city.add(road);}
  const park=new THREE.Mesh(new THREE.CircleGeometry(6.8,64),new THREE.MeshStandardMaterial({color:'#637f50',roughness:1}));park.rotation.x=-Math.PI/2;park.position.y=.012;city.add(park);
  const trees=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.15,1),new THREE.MeshStandardMaterial({color:'#385c3c',roughness:1}),160);
  for(let i=0;i<160;i++){const a=random()*Math.PI*2,r=2+random()*4.5;dummy.position.set(Math.cos(a)*r,.18,Math.sin(a)*r);dummy.scale.set(1,1.5,1);dummy.rotation.set(0,0,0);dummy.updateMatrix();trees.setMatrixAt(i,dummy.matrix);}city.add(trees);
  const plaza=new THREE.Mesh(new THREE.BoxGeometry(3.7,.04,3.2),new THREE.MeshStandardMaterial({color:'#cfbf9d',roughness:.8}));plaza.position.set(0,.035,.25);city.add(plaza);
  const arena=new THREE.Group();arena.name='palau-sant-jordi';city.add(arena);
  const walls=new THREE.Mesh(new THREE.BoxGeometry(2.8,.48,2.4),new THREE.MeshStandardMaterial({color:'#b9ad94',roughness:.6,metalness:.2}));walls.position.y=.3;arena.add(walls);
  const glass=new THREE.Mesh(new THREE.BoxGeometry(2.82,.19,2.42),new THREE.MeshStandardMaterial({color:'#263b43',metalness:.45,roughness:.2}));glass.position.y=.43;arena.add(glass);
  const roofPoints=[],indices=[],N=40;
  const roofHeight=(x,z)=>.57+.62*Math.max(0,1-(x/1.43)**2)*Math.max(0,1-(z/1.23)**2);
  for(let row=0;row<=N;row++)for(let col=0;col<=N;col++){const x=(col/N-.5)*2.86,z=(row/N-.5)*2.46;roofPoints.push(x,roofHeight(x,z),z);if(row<N&&col<N){const a=row*(N+1)+col,b=a+N+1;indices.push(a,b,a+1,b,b+1,a+1);}}
  const roofGeometry=new THREE.BufferGeometry();roofGeometry.setAttribute('position',new THREE.Float32BufferAttribute(roofPoints,3));roofGeometry.setIndex(indices);roofGeometry.computeVertexNormals();
  const roof=new THREE.Mesh(roofGeometry,new THREE.MeshStandardMaterial({color:'#819897',metalness:.65,roughness:.29,side:THREE.DoubleSide,transparent:true}));arena.add(roof);
  const ribs=new THREE.Group();arena.add(ribs);
  for(let i=-5;i<=5;i++){
    const z=i*.215,points=[];for(let j=0;j<=30;j++){const x=(j/30-.5)*2.82;points.push(new THREE.Vector3(x,roofHeight(x,z)+.013,z));}
    ribs.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:'#c1d1ca',transparent:true,opacity:.55})));
  }
  const stadium=new THREE.Mesh(new THREE.TorusGeometry(1.5,.22,8,64),new THREE.MeshStandardMaterial({color:'#c6b59d',roughness:.8}));stadium.rotation.x=-Math.PI/2;stadium.scale.y=.62;stadium.position.set(3.6,.25,-1.1);city.add(stadium);
  const needle=new THREE.Group();needle.position.set(-2.8,0,1.9);city.add(needle);
  const mast=new THREE.Mesh(new THREE.CylinderGeometry(.025,.055,1.5,8),new THREE.MeshStandardMaterial({color:'#dcdcd1',metalness:.5,roughness:.3}));mast.position.y=.76;mast.rotation.z=-.25;needle.add(mast);
  const arch=new THREE.Mesh(new THREE.TorusGeometry(.3,.025,6,32,Math.PI*1.3),mast.material);arch.position.set(.18,1.3,0);needle.add(arch);
  const beacon=new THREE.PointLight('#ffcb67',9,10,2);beacon.position.set(0,2,0);city.add(beacon);
  const destinationRing=new THREE.Mesh(new THREE.RingGeometry(1.8,1.83,96),new THREE.MeshBasicMaterial({color:'#ffe1a1',transparent:true,opacity:.7,side:THREE.DoubleSide}));destinationRing.rotation.x=-Math.PI/2;destinationRing.position.y=.08;city.add(destinationRing);
  scene.add(new THREE.HemisphereLight('#d5eafa','#8b795b',1.3));
  let active=false,paused=false,elapsed=0,last=null,raf=0,mode='earth',delivered=false,spoken=false;
  const smallScene=!renderer;
  function resize(){const r=container.getBoundingClientRect();camera.aspect=r.width/r.height;camera.updateProjectionMatrix();}
  function setMode(next){if(mode===next)return;mode=next;overlay.dataset.phase=next;container.dataset.travel=`finale-${next}`;}
  function speaking(value){if(spoken===value)return;spoken=value;onSpeaking(value);}
  function reveal(){
    if(!active||delivered)return;
    delivered=true;play.hidden=true;setMode('tickets');tickets.hidden=false;tickets.classList.add('arriving');film.classList.add('delivered');
    speaking(false);document.getElementById('replay-message').focus({preventScroll:true});onReveal();
  }
  async function showStage(){
    if(!active||mode==='stage'||mode==='tickets')return;
    setMode('stage');aerial.hidden=true;stage.hidden=false;phaseLabel.textContent='PALAU SANT JORDI';caption.textContent='María… tengo una cosina para ti.';
    film.muted=!soundEnabled();film.currentTime=0;film.playbackRate=1;play.textContent=film.error?'Continuar con el regalo':'Escuchar el mensaje ▶';play.hidden=!film.muted&&!film.error;speaking(!film.muted);
    try{await film.play();if(paused||!active)film.pause();}catch{if(active){play.hidden=false;speaking(false);}}
  }
  film.addEventListener('ended',reveal);
  film.addEventListener('error',()=>{if(active&&mode==='stage'){play.hidden=false;play.textContent='Continuar con el regalo';}});
  film.addEventListener('volumechange',()=>{if(active&&mode==='stage')speaking(!film.muted&&!film.paused);});
  play.addEventListener('click',async()=>{
    if(paused)return;
    if(film.error){reveal();return;}
    if(!soundEnabled())document.getElementById('sound').click();
    film.muted=false;film.currentTime=0;play.hidden=true;speaking(true);
    try{await film.play();}catch{play.hidden=false;speaking(false);}
  });
  document.getElementById('replay-message').addEventListener('click',async()=>{
    if(!active||paused)return;
    delivered=false;tickets.hidden=true;film.classList.remove('delivered');setMode('stage');film.currentTime=0;if(!soundEnabled())document.getElementById('sound').click();film.muted=false;speaking(true);
    try{await film.play();}catch{play.hidden=false;speaking(false);}
  });
  document.getElementById('show-tickets').addEventListener('click',()=>{if(!paused){film.pause();reveal();}});
  function update(){
    if(mode==='stage'||mode==='tickets')return;
    const t=reduced.matches?(elapsed<1000?0:elapsed<2200?12000:19001):elapsed;
    if(t<9500){
      setMode('earth');earthRoot.visible=true;city.visible=false;stars.visible=true;scene.background.set('#01040b');
      const d=Math.max(12,3.7/(Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.aspect));
      const rotation=smooth(t/6500),approach=smooth((t-6500)/3000);
      earth.quaternion.copy(earthOrientation).multiply(spin.setFromAxisAngle(spinAxis,Math.PI*4*(1-rotation)));
      camera.position.set(0,0,THREE.MathUtils.lerp(d,Math.max(6.2,d*.55),approach));camera.lookAt(0,0,0);
      overlay.style.setProperty('--arrival-flash',String(smooth((t-8750)/750)));
      phaseLabel.textContent=t<6500?'UN PAR DE VUELTAS…':'BARCELONA';caption.textContent=t<6500?'El mundo guarda una sorpresa.':'Ahora sí. Vamos para allí.';
      overlay.dataset.turns=String(rotation*2);
    }else if(t<17500){
      overlay.style.setProperty('--arrival-flash',String(1-smooth((t-9500)/750)));
      setMode('city');earthRoot.visible=false;city.visible=true;stars.visible=false;scene.background.set('#a0bec5');
      const p=smooth((t-9500)/8000);
      const fit=Math.max(container.clientWidth/aerial.naturalWidth,container.clientHeight/aerial.naturalHeight);
      const budget=Math.max(1,Math.min(1.28,1/fit));
      aerial.hidden=!(aerial.complete&&aerial.naturalWidth);aerial.style.transform=`scale(${1+p*(budget-1)})`;
      camera.position.lerpVectors(new THREE.Vector3(33,44,53),new THREE.Vector3(2.8,3.3,4.7),p);camera.lookAt(0,.25,0);
      destinationRing.visible=false;
      phaseLabel.textContent=t<13000?'BARCELONA · MONTJUÏC':'PALAU SANT JORDI';caption.textContent=t<13000?'Ya casi estamos.':'Aquí te espera algo.';
    }else if(t<19000){
      setMode('palau');const p=smooth((t-17500)/1500);
      roof.material.opacity=1-p;ribs.visible=p<.35;overlay.style.setProperty('--arrival-flash',String(Math.sin(p*Math.PI)*.7));
      phaseLabel.textContent='PALAU SANT JORDI';caption.textContent='';
    }else{overlay.style.setProperty('--arrival-flash','0');showStage();}
    overlay.style.setProperty('--travel-progress',String(clamp(t/19000)));
    if(smallScene){overlay.classList.add('ending-fallback');overlay.style.setProperty('--earth-scale',String(1+smooth(t/6500)*3));}
    else renderer.render(scene,camera);
  }
  function tick(now){
    if(!active)return;
    const delta=last===null?0:Math.min(now-last,100);last=now;
    if(!paused&&!document.hidden){elapsed+=delta;update();}
    raf=requestAnimationFrame(tick);
  }
  function start(){
    stop();active=true;elapsed=0;last=null;mode='';delivered=false;overlay.hidden=false;stage.hidden=true;aerial.hidden=true;tickets.hidden=true;film.classList.remove('delivered');tickets.classList.remove('arriving');
    if(renderer)renderer.setPixelRatio(Math.min(devicePixelRatio,2.25));
    roof.material.opacity=1;ribs.visible=true;resize();setMode('earth');overlay.style.setProperty('--arrival-flash','0');
    // Prime media during the user's click; the actual performance begins after arrival.
    if(film.error)film.load();
    film.muted=true;film.play().then(()=>{if(mode!=='stage')film.pause();}).catch(()=>{});
    raf=requestAnimationFrame(tick);
  }
  function stop(){if(renderer)renderer.setPixelRatio(originalPixelRatio);active=false;cancelAnimationFrame(raf);last=null;film.pause();film.currentTime=0;overlay.hidden=true;stage.hidden=true;aerial.hidden=true;tickets.hidden=true;speaking(false);}
  document.addEventListener('visibilitychange',()=>{
    last=null;
    if(!active||mode!=='stage')return;
    if(document.hidden){film.pause();speaking(false);}
    else if(!paused&&!delivered)film.play().then(()=>{if(active&&mode==='stage')speaking(!film.muted);}).catch(()=>{if(active)play.hidden=false;});
  });
  const observer=new ResizeObserver(resize);observer.observe(container);resize();
  return {start,stop,resize,setPaused(value){paused=value;last=null;if(!active)return;if(value){film.pause();speaking(false);}else if(mode==='stage'&&!delivered){film.play().then(()=>{if(active&&mode==='stage')speaking(!film.muted);else film.pause();}).catch(()=>{if(active)play.hidden=false;});}},setSound(value){film.muted=!value;if(active&&mode==='stage'){speaking(value&&!film.paused);if(!film.error)play.hidden=value&&!film.paused;}},get active(){return active;},get mode(){return mode;}};
}

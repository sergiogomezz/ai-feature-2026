import * as THREE from 'three';
import { animate } from 'animejs';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createFinale } from './finale.js';
import { createEggGame } from './egg-game.js';
import { createRoyalArrival } from './royal-arrival.js';
import { surfaceTexture, addFir } from './materials.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createWorld(container, {onGift, onGlobe, isWrapped, canOpenGift, reduced}) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#282d2b');
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 80);
  const renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
  const pmrem=new THREE.PMREMGenerator(renderer);const environment=new RoomEnvironment();
  scene.environment=pmrem.fromScene(environment,.05).texture;scene.environmentIntensity=.25;environment.dispose();pmrem.dispose();
  renderer.domElement.setAttribute('aria-label','Habitación navideña en 3D. Arrastra para mirar alrededor.');
  container.prepend(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan=false; controls.enableZoom=false; controls.enableDamping=true;
  controls.minAzimuthAngle=-.4; controls.maxAzimuthAngle=.7;
  controls.minPolarAngle=1.05; controls.maxPolarAngle=1.38;
  controls.target.set(0,2.1,0);
  const woodTexture=surfaceTexture('wood'),fabricTexture=surfaceTexture('fabric'),paperTexture=surfaceTexture('paper');
  const palette={'#68c9b3':'#63736a','#4fb4ab':'#526359','#ffe3ad':'#e6dccc','#c98760':'#917758','#a88bde':'#c8baa3','#dec7f5':'#e2d7c2','#dd719d':'#64796c','#d66397':'#607465','#f38aab':'#7a8b79','#c8588a':'#586e60','#b57071':'#6f4e38','#f6be85':'#aa8460','#97d8ea':'#b8c3b3','#ffb16e':'#c6a782','#ffeb9e':'#f4deba','#ffe0a2':'#e6d9c2','#ffedc7':'#e8ddc9','#4967ab':'#142c49','#a4d9e5':'#66879d'};
  const mat = color => new THREE.MeshStandardMaterial({color:palette[color]||color,roughness:.72});
  const mint=mat('#68c9b3'),gold=new THREE.MeshStandardMaterial({color:'#bd9652',roughness:.28,metalness:.75}),pink=new THREE.MeshStandardMaterial({color:'#773c36',map:paperTexture,roughness:.57,bumpMap:paperTexture,bumpScale:.012}),wood=new THREE.MeshStandardMaterial({color:'#b59978',map:woodTexture,roughness:.57,bumpMap:woodTexture,bumpScale:.025});
  function mesh(geo, material, x=0,y=0,z=0,parent=scene, outline=true) {
    const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);

    return m;
  }
  const box=(w,h,d,m,x,y,z,p=scene,out=true)=>mesh(new RoundedBoxGeometry(w,h,d,2,Math.min(.045,w*.14,h*.14,d*.14)),m,x,y,z,p,out);
  const sphere=(r,m,x,y,z,p=scene,out=true)=>mesh(new THREE.SphereGeometry(r,24,18),m,x,y,z,p,out);
  // Complete room, with real floor, walls and depth behind the tree.
  box(25,.18,24,wood,0,-.14,1,scene,false);
  box(25,12,.18,mint,0,5.8,-3.4,scene,false);
  box(.18,12,22,mat('#4fb4ab'),-7,5.8,7.5,scene,false);
  box(25,.2,.14,mat('#ffe3ad'),0,.12,-3.25);
  for(let i=-12;i<13;i++)box(.018,.005,22,mat('#c98760'),i*.8,-.043,1,scene,false);
  for(let i=-6;i<7;i++)box(24,.005,.018,mat('#c98760'),0,-.041,i*1.6,scene,false);
  // Painted wall panels and layered cornice.
  for(let x=-6;x<9;x+=1.4){box(.035,1.65,.04,mat('#8c9787'),x,.95,-3.27);box(1.25,.035,.04,mat('#8c9787'),x+.65,1.76,-3.27);}
  box(25,.07,.1,mat('#a6ad9c'),0,1.9,-3.23);
  box(25,.14,.18,mat('#e6dccc'),0,6.1,-3.2);

  const rug=mesh(new THREE.CylinderGeometry(2.5,2.5,.035,48),mat('#a88bde'),0,0,.55);rug.scale.z=.72;rug.material.map=fabricTexture;rug.material.bumpMap=fabricTexture;rug.material.bumpScale=.035;
  const rim=mesh(new THREE.TorusGeometry(2.3,.035,6,64),mat('#dec7f5'),0,.035,.55,scene,false);rim.rotation.x=Math.PI/2;rim.scale.y=.72;
  // Window and snowy mountains.
  const win=new THREE.Group();scene.add(win);win.position.set(3,3.5,-3.12);win.rotation.z=0;
  box(2.3,2.8,.14,mat('#ffe0a2'),0,0,0,win);box(2.02,2.52,.04,mat('#4967ab'),0,0,.09,win);
  const moon=sphere(.26,new THREE.MeshBasicMaterial({color:'#ffedaa'}),.55,.68,.13,win,false);moon.scale.z=.1;
  for(let i=0;i<15;i++)sphere(.018,new THREE.MeshBasicMaterial({color:'#f9ffff'}),Math.sin(i*4)*.85,Math.cos(i*2.3)*1.1,.13,win,false);
  for(let i=0;i<3;i++){const mountain=mesh(new THREE.ConeGeometry(.5,.9,3),mat('#a4d9e5'),-.7+i*.7,-.85,.15,win,false);mountain.scale.z=.1;}
  box(.08,2.6,.08,mat('#ffe0a2'),0,0,.2,win);box(2.1,.08,.08,mat('#ffe0a2'),0,0,.2,win);box(2.5,.13,.4,mat('#ffedc7'),0,-1.45,.1,win);
  // A skewed picture, lamp and side table.
  const picture=box(1.05,1.3,.09,gold,-3,3.7,-3.2);picture.rotation.z=.02;
  box(.85,1.1,.05,mat('#fff2d8'),0,0,.07,picture);
  const art=document.createElement('canvas');art.width=384;art.height=480;const paint=art.getContext('2d');
  const skyPaint=paint.createLinearGradient(0,0,0,480);skyPaint.addColorStop(0,'#9eada9');skyPaint.addColorStop(1,'#e6d2ad');paint.fillStyle=skyPaint;paint.fillRect(0,0,384,480);
  paint.fillStyle='#f5e5bf';paint.beginPath();paint.arc(270,112,40,0,Math.PI*2);paint.fill();
  for(let layer=0;layer<4;layer++){paint.fillStyle=['#9ba9a1','#7e9288','#526f63','#334f46'][layer];paint.beginPath();paint.moveTo(0,480);for(let x=0;x<=384;x+=6)paint.lineTo(x,240+layer*46+Math.sin(x*.012+layer*2)*35+Math.sin(x*.035)*8);paint.lineTo(384,480);paint.fill();}
  const artTexture=new THREE.CanvasTexture(art);artTexture.colorSpace=THREE.SRGBColorSpace;
  mesh(new THREE.PlaneGeometry(.83,1.07),new THREE.MeshStandardMaterial({map:artTexture,roughness:1}),0,0,.105,picture,false);
  box(1.35,.18,.8,mat('#f6be85'),-3,1,-1.6);box(1.1,.7,.65,mat('#b57071'),-3,.6,-1.6);
  for(const x of [-3.45,-2.55])box(.1,.3,.1,mat('#593d48'),x,.15,-1.6);
  mesh(new THREE.CylinderGeometry(.065,.1,.75,10),gold,-3,1.45,-1.6);
  const shade=mesh(new THREE.CylinderGeometry(.28,.44,.65,40),mat('#ffeb9e'),-3,2,-1.6);shade.rotation.z=0;
  // Pink sofa with chunky arms and a tilted cushion.
  const sofa=new THREE.Group();scene.add(sofa);sofa.position.set(3.25,0,-.9);sofa.rotation.y=-.2;
  box(2.1,.5,.95,mat('#dd719d'),0,.55,0,sofa);box(2.1,1.15,.28,mat('#d66397'),0,1,-.45,sofa);
  box(1.8,.18,.85,mat('#f38aab'),0,.85,.05,sofa);
  for(const x of [-1.05,1.05]){box(.26,.8,1.1,mat('#c8588a'),x,.8,0,sofa);box(.1,.3,.1,mat('#533b45'),x,.15,0,sofa);}
  const cushion=box(.6,.6,.18,gold,.2,1.23,-.15,sofa);cushion.rotation.z=.2;cushion.rotation.x=-.2;
  // Upholstered cushions have real thickness and softer edge radii.
  for(const x of [-.45,.45]){
    const seat=mesh(new RoundedBoxGeometry(.86,.23,.8,4,.095),mat('#f38aab'),x,.91,.09,sofa);seat.rotation.x=-.025;
    const back=mesh(new RoundedBoxGeometry(.87,.68,.25,4,.1),mat('#dd719d'),x,1.29,-.29,sofa);back.rotation.x=-.12;
  }
  const pillow=mesh(new RoundedBoxGeometry(.48,.46,.19,5,.09),mat('#c6a782'),-.6,1.18,.02,sofa);pillow.rotation.set(-.2,.1,-.25);
  sofa.traverse(object=>{if(object.isMesh){object.material.map=fabricTexture;object.material.bumpMap=fabricTexture;object.material.bumpScale=.025;object.material.roughness=.94;}});
  // Individual evergreen branches and needles, batched into two draw calls.
  const tree=new THREE.Group();scene.add(tree);tree.position.x=-.45;
  mesh(new THREE.CylinderGeometry(.17,.22,.75,7),mat('#af7448'),0,.36,0,tree);
  addFir(THREE,tree);
  const wire=[];const lights=[];const colors=['#ffe3a1','#ffdc91','#fff0c7'];
  for(let i=0;i<105;i++){const t=i/104, a=t*Math.PI*9, r=1.39*(1-t)+.055;const p=new THREE.Vector3(Math.cos(a)*r,.65+t*3.68,Math.sin(a)*r);wire.push(p);if(i%3===0){const bulb=sphere(.024,new THREE.MeshBasicMaterial({color:colors[(i/3)%colors.length]}),p.x,p.y,p.z,tree,false);lights.push(bulb);}}
  mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(wire),120,.018,5,false),mat('#24574c'),0,0,0,tree,false);
  for(let i=0;i<24;i++){const t=(i+.5)/25,r=1.34*(1-t)+.13,a=i*2.4;const ball=sphere(.1,new THREE.MeshStandardMaterial({color:['#9a3934','#cead68','#c4b9a3'][i%3],metalness:.72,roughness:.18}),Math.cos(a)*r,.7+t*3.55,Math.sin(a)*r,tree);sphere(.025,new THREE.MeshBasicMaterial({color:'#fff9e7'}),-.035,.04,.08,ball,false);}
  const starShape=new THREE.Shape();for(let i=0;i<10;i++){const a=Math.PI/2+i*Math.PI/5,r=i%2?.17:.36;const x=Math.cos(a)*r,y=Math.sin(a)*r;i?starShape.lineTo(x,y):starShape.moveTo(x,y);}starShape.closePath();
  const topStar=mesh(new THREE.ExtrudeGeometry(starShape,{depth:.12,bevelEnabled:true,bevelThickness:.035,bevelSize:.025,bevelSegments:3}),gold,0,4.6,0,tree);topStar.rotation.y=.3;
  function smallGift(x,z,c,w,h){const g=new THREE.Group();scene.add(g);g.position.set(x,0,z);g.rotation.y=x*.2;const m=mat(c);box(w,h,w,m,0,h/2,0,g);box(w+.06,.12,w+.06,m,0,h,0,g);box(.1,h+.13,w+.08,gold,0,h/2+.03,0,g);return g;}
  smallGift(-1.65,1,'#97d8ea',.65,.65);smallGift(-.6,1.65,'#ffb16e',.5,.4);
  const gift=new THREE.Group();scene.add(gift);gift.visible=false;gift.position.set(1.05,0,1.3);gift.rotation.y=-.3;
  // Five faces: the package is hollow, including its ribbons.
  box(1.12,.08,.92,pink,0,.065,0,gift);
  for(const z of [-.42,.42]){box(1.12,.83,.08,pink,0,.44,z,gift);box(.18,.84,.085,gold,0,.44,z,gift);}
  for(const x of [-.52,.52]){box(.08,.83,.84,pink,x,.44,0,gift);box(.085,.84,.16,gold,x,.44,0,gift);}
  box(.94,.025,.72,mat('#6b3769'),0,.12,0,gift,false);
  const lid=new THREE.Group();gift.add(lid);lid.position.y=.91;
  box(1.2,.18,1,pink,0,0,0,lid);box(.19,.2,1.02,gold,0,0,0,lid);box(1.22,.2,.17,gold,0,0,0,lid);
  for(const side of [-1,1]){const bow=mesh(new THREE.TorusGeometry(.21,.045,8,24),gold,side*.18,.23,0,lid);bow.scale.y=.65;bow.rotation.set(.1,side*.3,side*.55);}
  // Draw only the name onto a small tag texture, everything else is geometry.
  const tagCanvas=document.createElement('canvas');tagCanvas.width=256;tagCanvas.height=128;
  const ctx=tagCanvas.getContext('2d');ctx.fillStyle='#fff6d5';ctx.fillRect(0,0,256,128);ctx.strokeStyle='#263d48';ctx.lineWidth=9;ctx.strokeRect(4,4,248,120);ctx.fillStyle='#263d48';ctx.font='bold 48px Trebuchet MS, sans-serif';ctx.textAlign='center';ctx.fillText('María',135,83);ctx.beginPath();ctx.arc(24,63,6,0,Math.PI*2);ctx.fill();
  const texture=new THREE.CanvasTexture(tagCanvas);texture.colorSpace=THREE.SRGBColorSpace;
  const tag=mesh(new THREE.PlaneGeometry(.55,.275),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}),.29,.57,.49,gift,false);tag.rotation.z=-.13;
  // Warm practical lights against cool winter fill.
  scene.add(new THREE.HemisphereLight('#d8e5f1','#5e4938',.8));
  const sun=new THREE.DirectionalLight('#ffe1b2',2.5);sun.position.set(-3,7,4);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-7;sun.shadow.camera.right=7;sun.shadow.camera.top=7;sun.shadow.camera.bottom=-6;sun.shadow.normalBias=.025;sun.shadow.bias=-.0002;sun.shadow.radius=3;scene.add(sun);
  const fill=new THREE.DirectionalLight('#8dbaf2',.75);fill.position.set(4,4,-2);scene.add(fill);
  const lampLight=new THREE.PointLight('#ffc879',15,7,2);lampLight.position.set(-3,1.85,-1.6);scene.add(lampLight);
  shade.material.emissive.set('#f3b762');shade.material.emissiveIntensity=.16;
  const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=64;const glowContext=glowCanvas.getContext('2d');const halo=glowContext.createRadialGradient(32,32,0,32,32,32);halo.addColorStop(0,'rgba(255,237,178,1)');halo.addColorStop(.12,'rgba(255,204,117,.55)');halo.addColorStop(1,'rgba(255,174,66,0)');glowContext.fillStyle=halo;glowContext.fillRect(0,0,64,64);
  const glowMap=new THREE.CanvasTexture(glowCanvas);const glowMaterial=new THREE.SpriteMaterial({map:glowMap,color:'#ffcf86',transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
  lights.forEach(bulb=>{const glow=new THREE.Sprite(glowMaterial);glow.scale.set(.2,.2,.2);bulb.add(glow);});
  for(const y of [1.2,2.6,3.8]){const light=new THREE.PointLight('#ffc776',2.1,3,2);light.position.set(-.45,y,.6);scene.add(light);}
  // Curtain folds add silhouette and soft fabric around the window.
  const curtainMat=new THREE.MeshStandardMaterial({color:'#c6bda7',map:fabricTexture,roughness:1,side:THREE.DoubleSide});
  for(const side of [-1,1]){const geo=new THREE.PlaneGeometry(.7,3.3,24,12);const positions=geo.attributes.position;for(let i=0;i<positions.count;i++)positions.setZ(i,Math.sin(positions.getX(i)*44)*.07);geo.computeVertexNormals();mesh(geo,curtainMat,3+side*1.48,3.52,-2.94);}
  const rail=mesh(new THREE.CylinderGeometry(.025,.025,3.9,12),gold,3,5.22,-2.9);rail.rotation.z=Math.PI/2;
  const royal=createRoyalArrival(scene);
  let arrivalActive=false;
  const treeGlobe=new THREE.Group();treeGlobe.name='tree-world-ornament';tree.add(treeGlobe);treeGlobe.position.set(.88,2.65,1.02);treeGlobe.visible=false;
  const globeMap=new THREE.TextureLoader().load('/ending/earth.jpg');globeMap.colorSpace=THREE.SRGBColorSpace;
  const globeBall=new THREE.Mesh(new THREE.SphereGeometry(.3,40,28),new THREE.MeshPhysicalMaterial({map:globeMap,roughness:.32,metalness:.05,clearcoat:.65,emissive:'#254d75',emissiveIntensity:.12}));treeGlobe.add(globeBall);
  const globeCap=new THREE.Mesh(new THREE.CylinderGeometry(.065,.075,.07,16),gold);globeCap.position.y=.32;treeGlobe.add(globeCap);
  const globeHook=new THREE.Mesh(new THREE.TorusGeometry(.048,.009,6,20),gold);globeHook.position.y=.39;treeGlobe.add(globeHook);
  const globeGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowMap,color:'#86cbff',transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.7}));globeGlow.scale.set(1.45,1.45,1);globeGlow.position.z=-.2;treeGlobe.add(globeGlow);
  const globeLight=new THREE.PointLight('#9cdbff',1.8,2.5,2);treeGlobe.add(globeLight);
  const globeButton=document.getElementById('tree-globe');let globeUnlocked=false,globeBorn=0;
  function revealGlobe(){globeUnlocked=true;globeBorn=animationTime;treeGlobe.visible=true;treeGlobe.scale.setScalar(reduced.matches?1:.01);globeButton.hidden=false;}
  function hideGlobe(){globeUnlocked=false;treeGlobe.visible=false;globeButton.hidden=true;}
  function updateGlobe(){
    if(!globeUnlocked||!treeGlobe.visible)return;
    const appear=reduced.matches?1:THREE.MathUtils.smoothstep(animationTime-globeBorn,0,1200);treeGlobe.scale.setScalar(Math.max(.01,appear));
    globeBall.rotation.y=-Math.PI/2+(reduced.matches?0:Math.sin(animationTime*.0005)*.2);globeGlow.material.opacity=reduced.matches?.75:.62+Math.sin(animationTime*.002)*.17;
    scene.updateMatrixWorld();camera.updateMatrixWorld();
    const point=treeGlobe.getWorldPosition(new THREE.Vector3());const center=point.clone().project(camera);const edge=point.clone().add(new THREE.Vector3(.34,0,0)).project(camera);
    const size=Math.max(48,Math.abs(edge.x-center.x)*container.clientWidth);
    Object.assign(globeButton.style,{left:`${(center.x+1)*container.clientWidth/2}px`,top:`${(1-center.y)*container.clientHeight/2}px`,width:`${size}px`,height:`${size}px`});
    globeButton.disabled=paused||busy;
  }
  let eggGame, finale;
  let animations=[], cancelWait=[], sequence=0, busy=false, inside=false;
  let paused=false, lastFrame=null, animationTime=0;
  let renderScene=scene;
  const veil=document.createElement('div');veil.className='travel-veil';veil.setAttribute('aria-hidden','true');container.append(veil);
  const look=new THREE.Vector3();
  const savedPosition=new THREE.Vector3(), savedTarget=new THREE.Vector3();
  function tween(target, values, duration, ease='inOutCubic'){
    return new Promise(resolve=>{cancelWait.push(()=>resolve(false));animations.push(animate(target,{...values,autoplay:!paused,duration:reduced.matches?0:duration,ease,onComplete:()=>resolve(true)}));});
  }
  function begin(kind){
    busy=true;controls.enabled=false;container.dataset.travel=kind;
    renderer.domElement.dataset.clickable='false';document.documentElement.classList.remove('cucumber-hover');
    savedPosition.copy(camera.position);savedTarget.copy(controls.target);look.copy(controls.target);
    container.classList.add('travelling');
    return ++sequence;
  }
  function restore(){
    renderScene=scene;camera.position.copy(savedPosition);camera.up.set(0,1,0);camera.fov=36;camera.updateProjectionMatrix();
    controls.target.copy(savedTarget);camera.lookAt(controls.target);controls.minAzimuthAngle=-.4;controls.maxAzimuthAngle=.7;controls.enabled=!paused;controls.update();
    veil.style.opacity='0';busy=false;inside=false;delete container.dataset.travel;container.classList.remove('travelling');
  }
  function cancel(){sequence++;animations.forEach(a=>a.pause());animations=[];cancelWait.forEach(resolve=>resolve());cancelWait=[];}
  async function open(instant=false){
    if(instant){lid.position.set(-1.1,1.15,-.6);lid.rotation.set(0,0,-1.7);return true;}
    if(busy)return false;
    const id=begin('gift');gift.rotation.z=0;gift.scale.setScalar(1);gift.position.y=0;
    const center=gift.localToWorld(new THREE.Vector3(0,.3,0));
    const above=gift.localToWorld(new THREE.Vector3(0,2.5,.85));
    if(!await Promise.all([tween(lid.position,{x:-1.1,y:1.6,z:-.6},650,'outBack'),tween(lid.rotation,{z:-1.7,x:.3},650,'outBack'),tween(camera.position,{x:above.x,y:above.y,z:above.z},1150),tween(look,{x:center.x,y:center.y,z:center.z},1000)]).then(r=>r.every(Boolean))||id!==sequence)return false;
    const inner=gift.localToWorld(new THREE.Vector3(0,.48,.08));
    veil.style.background='#fff5d4';
    if(!await Promise.all([tween(camera.position,{x:inner.x,y:inner.y,z:inner.z},850,'inCubic'),tween(veil,{opacity:1},850,'inCubic')]).then(r=>r.every(Boolean))||id!==sequence)return false;
    inside=true;container.dataset.travel='inside-gift';return true;
  }
  function returnToRoom(){if(inside){cancel();restore();}}
  // A separate sky, so the fall never clips through the room floor or wall.
  const sky=new THREE.Scene();sky.background=new THREE.Color('#8ddff2');
  const cloudMat=new THREE.MeshBasicMaterial({color:'#fff9e9'});
  for(let i=0;i<34;i++){
    const cloud=new THREE.Group();sky.add(cloud);cloud.position.set(Math.sin(i*2.4)*5,18-i*2.5,-9-Math.cos(i*1.6)*5);
    for(let j=0;j<3;j++){const puff=new THREE.Mesh(new THREE.SphereGeometry(.7+j*.12,10,8),cloudMat);puff.position.x=(j-1)*.8;puff.scale.set(1.3,.55,.65);cloud.add(puff);}
  }
  const streaks=[];
  for(let i=0;i<26;i++){const line=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,1.5,4),new THREE.MeshBasicMaterial({color:'#e8ffff'}));line.position.set(Math.sin(i*3)*6,20-i*3,-7-Math.cos(i)*3);sky.add(line);streaks.push(line);}
  async function fall(){
    if(paused||busy||document.querySelector('dialog[open]'))return;
    const id=begin('window');veil.style.background='#8ddff2';
    if(!await Promise.all([tween(camera.position,{x:3,y:3.5,z:-1.8},900),tween(look,{x:3,y:3.5,z:-8},900),tween(veil,{opacity:1},950,'inCubic')]).then(r=>r.every(Boolean))||id!==sequence)return;
    renderScene=sky;container.dataset.travel='falling';camera.position.set(0,19,2);look.set(0,15,-12);camera.fov=58;camera.updateProjectionMatrix();
    await tween(veil,{opacity:0},250);
    if(id!==sequence)return;
    if(!await Promise.all([tween(camera.position,{y:-43},2100,'inQuad'),tween(look,{y:-50},2100,'inQuad')]).then(r=>r.every(Boolean))||id!==sequence)return;
    if(!await tween(veil,{opacity:1},300)||id!==sequence)return;
    restore();
  }
  document.getElementById('window-entry').addEventListener('click',fall);
  function finishArrival(){
    cancel();royal.group.visible=false;scene.attach(gift);gift.position.set(1.05,0,1.3);gift.rotation.set(0,-.3,0);gift.scale.setScalar(1);gift.visible=true;arrivalActive=false;
    if(busy)restore();
  }
  async function playArrival(){
    if(busy)return;
    const id=begin('arrival');
    camera.position.set(3.2,6.7,camera.aspect<.75?22:13.8);look.set(.3,1.15,1.7);camera.lookAt(look);
    arrivalActive=true;royal.group.scale.setScalar(camera.aspect<.75?.85:1);royal.group.visible=true;royal.motion.progress=0;royal.motion.exit=0;royal.motion.stumble=0;
    royal.carrier.add(gift);gift.position.set(-.35,1.07,-.1);gift.rotation.set(0,-.3,0);gift.scale.setScalar(.45);gift.visible=true;
    royal.update(0,reduced.matches);
    if(!await tween(royal.motion,{progress:1},7000,'inOutSine')||id!==sequence)return;
    container.dataset.travel='royal-tumble';
    if(!await tween(royal.motion,{stumble:1},7200,'linear')||id!==sequence)return;
    container.dataset.travel='royal-delivery';
    scene.attach(gift);
    if(!await Promise.all([tween(gift.position,{x:1.05,y:0,z:1.3},1700,'outBounce'),tween(gift.scale,{x:1,y:1,z:1},1700),tween(gift.rotation,{x:0,y:-.3,z:0},1700)]).then(r=>r.every(Boolean))||id!==sequence)return;
    container.dataset.travel='royal-departure';
    if(!await tween(royal.motion,{exit:1},5200,'inOutSine')||id!==sequence)return;
    finishArrival();
  }
  function stopEggGame(){if(eggGame?.active){eggGame.stop();restore();}}
  function startEggGame(callbacks){
    returnToRoom();
    begin('egg-game');
    if(!eggGame)eggGame=createEggGame({canvas:renderer.domElement,container,reduced,scene,camera,focusTarget(position){
      camera.position.set(position.x*.65,position.y+1.2,position.z+9);controls.target.copy(position);controls.update();
    }});
    camera.fov=camera.aspect<.8?48:40;camera.updateProjectionMatrix();
    camera.position.set(2.7,5.8,camera.aspect<.8?15:12.8);controls.target.set(0,2.6,-1);
    controls.minAzimuthAngle=-1.2;controls.maxAzimuthAngle=1.2;controls.enabled=!paused;controls.update();
    eggGame.setPaused(paused);eggGame.start(callbacks);
    container.classList.remove('travelling');
  }
  function stopFinale(){if(finale?.active){finale.stop();restore();}}
  function startFinale(callbacks){
    stopEggGame();returnToRoom();begin('finale');
    container.classList.remove('travelling');
    if(!finale)finale=createFinale({renderer,container,reduced,...callbacks});
    finale.setPaused(paused);finale.start();
  }
  function reset(){hideGlobe();stopFinale();stopEggGame();if(arrivalActive)finishArrival();cancel();if(busy||inside)restore();lid.position.set(0,.91,0);lid.rotation.set(0,0,0);controls.reset();}
  let pointerStart;
  const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();
  renderer.domElement.addEventListener('pointermove',event=>{
    const r=renderer.domElement.getBoundingClientRect();
    pointer.set((event.clientX-r.left)/r.width*2-1,-(event.clientY-r.top)/r.height*2+1);
    ray.setFromCamera(pointer,camera);
    const clickable=!paused && !busy && ((globeUnlocked&&ray.intersectObject(treeGlobe,true).length>0) || (canOpenGift() && ray.intersectObject(gift,true).length>0) || ray.intersectObject(win,true).length>0);
    renderer.domElement.dataset.clickable=String(clickable);
  });
  renderer.domElement.addEventListener('pointerleave',()=>{delete renderer.domElement.dataset.clickable;});
  renderer.domElement.addEventListener('pointerdown',e=>pointerStart={x:e.clientX,y:e.clientY});
  renderer.domElement.addEventListener('click',e=>{if(paused||busy||!pointerStart||Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y)>8)return;const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);if(globeUnlocked&&ray.intersectObject(treeGlobe,true).length)onGlobe();else if(ray.intersectObject(gift,true).length)onGift();else if(ray.intersectObject(win,true).length)fall();});
  function resize(){const {width,height}=container.getBoundingClientRect();camera.aspect=width/height;const distance=camera.aspect<.7?14.2:camera.aspect<1?12.2:10.5;if(busy){camera.updateProjectionMatrix();renderer.setSize(width,height);eggGame?.resize();return;}camera.position.set(distance*.27,5.6,distance);controls.target.set(0,2.15,.15);camera.lookAt(controls.target);camera.updateProjectionMatrix();renderer.setSize(width,height);controls.update();controls.saveState();}
  const observer=new ResizeObserver(resize);observer.observe(container);resize();
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();reset();renderer.setAnimationLoop(null);renderer.domElement.hidden=true;document.getElementById('fallback').hidden=false;});
  const giftButton=document.getElementById('parcel');
  const giftBounds=new THREE.Box3(); const projected=new THREE.Vector3();
  function positionGiftFocus(){
    if(document.activeElement!==giftButton)return;
    giftBounds.setFromObject(gift);
    let left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;
    for(const x of [giftBounds.min.x,giftBounds.max.x])for(const y of [giftBounds.min.y,giftBounds.max.y])for(const z of [giftBounds.min.z,giftBounds.max.z]){
      projected.set(x,y,z).project(camera);
      const px=(projected.x+1)*container.clientWidth/2,py=(1-projected.y)*container.clientHeight/2;
      left=Math.min(left,px);right=Math.max(right,px);top=Math.min(top,py);bottom=Math.max(bottom,py);
    }
    giftButton.style.setProperty('--gift-left',`${left}px`);giftButton.style.setProperty('--gift-top',`${top}px`);
    giftButton.style.setProperty('--gift-width',`${right-left}px`);giftButton.style.setProperty('--gift-height',`${bottom-top}px`);
  }
  function setPaused(value){
    paused=value;lastFrame=null;eggGame?.setPaused(value);finale?.setPaused(value);
    animations.forEach(animation=>{if(!animation.completed) {if(paused)animation.pause();else animation.resume();}});
    controls.enabled=!paused&&(!busy||Boolean(eggGame?.active));
  }
  renderer.setAnimationLoop(time=>{const delta=lastFrame===null?0:time-lastFrame;lastFrame=time;if(document.hidden||paused||finale?.active)return;if(eggGame?.active){controls.update();eggGame.update(delta);if(eggGame.active)renderer.render(scene,camera);return;}animationTime+=delta;const t=animationTime/1000;royal.update(t,reduced.matches);if(!reduced.matches){const beat=Math.max(0,Math.sin(t*2.3));if(isWrapped()&&!busy){gift.rotation.z=Math.sin(t*9)*beat**8*.07;gift.position.y=beat**16*.12;gift.scale.set(1+beat**16*.04,1-beat**16*.035,1);}topStar.rotation.y=.3+Math.sin(t)*.18;lights.forEach((l,i)=>l.scale.setScalar(.88+Math.sin(t*2+i)*.15));}else if(isWrapped()&&!busy){gift.position.y=0;gift.rotation.z=0;gift.scale.setScalar(1);}if(busy){camera.lookAt(look);}else controls.update();updateGlobe();positionGiftFocus();renderer.render(renderScene,camera);});
  return {open,reset,revealGlobe,returnToRoom,playArrival,finishArrival,setPaused,startEggGame,stopEggGame,helpEggGame(){eggGame?.help();},startFinale,stopFinale,setFinaleSound(value){finale?.setSound(value);},get busy(){return busy;}};
}

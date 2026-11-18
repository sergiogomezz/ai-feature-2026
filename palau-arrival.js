import * as THREE from 'three';

const clamp=t=>Math.max(0,Math.min(1,t));
const smooth=t=>{t=clamp(t);return t*t*(3-2*t);};

// A single perspective camera travels through the photograph's central doorway.
// The facade has an actual opening: the dark entrance leads into a lit 3D aisle.
export function createPalauArrival(){
  const scene=new THREE.Scene();scene.background=new THREE.Color('#080e1d');
  const camera=new THREE.PerspectiveCamera(40,1,.005,150);
  const loader=new THREE.TextureLoader();
  const photo=loader.load('/ending/palau-aerial.jpg');photo.colorSpace=THREE.SRGBColorSpace;
  const facade=new THREE.Mesh(new THREE.PlaneGeometry(18,10.13),new THREE.ShaderMaterial({
    uniforms:{picture:{value:photo}},
    vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:`uniform sampler2D picture;varying vec2 vUv;
      void main(){if(abs(vUv.x-.5)<.0117&&vUv.y>.370&&vUv.y<.418)discard;
      gl_FragColor=texture2D(picture,vUv);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`
  }));scene.add(facade);
  scene.add(new THREE.HemisphereLight('#adc8ff','#28202a',2.4));
  const light=new THREE.DirectionalLight('#ffcf95',2.3);light.position.set(-3,5,8);scene.add(light);
  const material=color=>new THREE.MeshStandardMaterial({color,roughness:.85});
  function box(w,h,d,mat,x,y,z){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);scene.add(m);return m;}
  const floorY=-1.317,eyeY=-1.075;
  const stone=material('#1d2530'),wall=material('#101827');
  box(.42,.02,9,stone,0,floorY,-4.5);
  box(.03,.52,9,wall,-.225,floorY+.26,-4.5);box(.03,.52,9,wall,.225,floorY+.26,-4.5);
  box(.48,.02,9,wall,0,floorY+.52,-4.5);
  const strip=new THREE.MeshBasicMaterial({color:'#efc176'});
  for(let i=0;i<18;i++){
    for(const side of [-1,1])box(.008,.008,.23,strip,side*.207,floorY+.018,-i*.5);
    box(.30,.004,.015,strip,0,floorY+.507,-i*.5);
  }
  const blue=new THREE.PointLight('#748cff',.5,6,1);blue.position.set(0,eyeY,-6);scene.add(blue);
  const poster=loader.load('/ending/stage-poster.jpg');poster.colorSpace=THREE.SRGBColorSpace;
  const screenMat=new THREE.MeshBasicMaterial({map:poster});
  const screen=new THREE.Mesh(new THREE.PlaneGeometry(1.5,.875),screenMat);screen.position.set(0,eyeY,-8.6);scene.add(screen);
  // Shared geometry keeps the procession cheap even on mobile.
  const count=320,dummy=new THREE.Object3D();let seed=34;
  const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
  const bodies=new THREE.InstancedMesh(new THREE.CapsuleGeometry(.026,.055,3,6),material('#b8c9da'),count);
  const heads=new THREE.InstancedMesh(new THREE.SphereGeometry(.025,8,6),material('#e4b79a'),count);
  const legs=new THREE.InstancedMesh(new THREE.CapsuleGeometry(.009,.062,2,5),material('#263044'),count*2);
  const arms=new THREE.InstancedMesh(new THREE.CapsuleGeometry(.008,.055,2,5),material('#b8c9da'),count*2);
  for(const mesh of [bodies,heads,legs,arms]){mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.frustumCulled=false;scene.add(mesh);}
  const people=Array.from({length:count},(_,i)=>({offset:random(),lane:(i%2?1:-1)*(.075+random()*.065),spread:(random()-.5)*4.8,speed:.045+random()*.018,phase:random()*6.28}));
  const colors=['#d3ae83','#426e8f','#9c6064','#e5d9c1','#313342','#9b906d','#65877b'];
  people.forEach((p,i)=>{const color=new THREE.Color(colors[i%colors.length]);bodies.setColorAt(i,color);arms.setColorAt(i*2,color);arms.setColorAt(i*2+1,color);heads.setColorAt(i,new THREE.Color(['#d5a17e','#b97b57','#efc7a7','#80503c'][i%4]));});
  function place(mesh,index,x,y,z,rx=0){dummy.position.set(x,y,z);dummy.rotation.set(rx,0,0);dummy.scale.setScalar(1);dummy.updateMatrix();mesh.setMatrixAt(index,dummy.matrix);}
  // Several staggered bursts, with ascent, expanding sparks, gravity and fading tails.
  const sparks=7*100,positions=new Float32Array(sparks*3),sparkColors=new Float32Array(sparks*3);
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.BufferAttribute(sparkColors,3));
  const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=32;
  const glowContext=glowCanvas.getContext('2d'),glow=glowContext.createRadialGradient(16,16,0,16,16,16);
  glow.addColorStop(0,'#fff');glow.addColorStop(.22,'#fffd');glow.addColorStop(1,'#fff0');glowContext.fillStyle=glow;glowContext.fillRect(0,0,32,32);
  const fireworks=new THREE.Points(geometry,new THREE.PointsMaterial({size:.17,map:new THREE.CanvasTexture(glowCanvas),vertexColors:true,transparent:true,opacity:1,blending:THREE.AdditiveBlending,depthWrite:false,depthTest:false}));fireworks.frustumCulled=false;scene.add(fireworks);
  const directions=Array.from({length:sparks},()=>{const a=random()*Math.PI*2,z=random()*2-1,r=Math.sqrt(1-z*z);return [Math.cos(a)*r,Math.sin(a)*r,z];});
  const burstColors=['#ffd38b','#97d9ff','#fda0c2','#e7c4ff','#9cf0ce','#ffd38b','#a4cfff'].map(c=>new THREE.Color(c));
  function update(seconds,aspect,reduced=false){
    camera.aspect=aspect;camera.updateProjectionMatrix();
    const distance=.88*Math.min(18/aspect,10.13)/(2*Math.tan(Math.PI/9));
    const descend=smooth((seconds-8)/11),walk=smooth((seconds-21)/8);
    camera.position.set(0,THREE.MathUtils.lerp(0,eyeY,descend),THREE.MathUtils.lerp(distance,.7,descend)+walk*(-8.6+Math.max(1.5/aspect,.875)/(2*Math.tan(Math.PI/9))-.7));
    if(!reduced&&seconds>21&&seconds<29){camera.position.y+=Math.sin(seconds*7)*.006*Math.sin(walk*Math.PI);camera.position.x=Math.sin(seconds*3.5)*.005*Math.sin(walk*Math.PI);}
    // Looking down into the plaza, then raising our eyes as we join the queue.
    camera.lookAt(0,THREE.MathUtils.lerp(-.2,eyeY,smooth(seconds/15)),-8.6);
    const crowdTime=reduced?4:Math.max(0,seconds-3);
    for(let i=0;i<count;i++){
      const p=people[i],progress=(p.offset+crowdTime*p.speed)%1;
      const z=3.6*(1-progress)-.22,x=THREE.MathUtils.lerp(p.spread,p.lane,smooth(progress));
      const ground=floorY-Math.max(0,z)*.35;
      const gait=reduced?0:Math.sin(crowdTime*7+p.phase)*.5;
      place(bodies,i,x,ground+.137,z);place(heads,i,x,ground+.213,z);
      for(let side=0;side<2;side++){const sign=side?1:-1;place(legs,i*2+side,x+sign*.015,ground+.054,z,sign*gait);place(arms,i*2+side,x+sign*.034,ground+.137,z,-sign*gait);}
    }
    for(const mesh of [bodies,heads,legs,arms])mesh.instanceMatrix.needsUpdate=true;
    bodies.visible=heads.visible=legs.visible=arms.visible=seconds>=3;
    for(const mesh of [bodies,heads,legs,arms]){mesh.material.transparent=true;mesh.material.opacity=smooth((seconds-3)/2);}
    fireworks.visible=!reduced&&seconds>=5&&seconds<17;
    if(fireworks.visible){for(let i=0;i<sparks;i++){
      const burst=Math.floor(i/100),age=seconds-5-burst*1.55,c=burstColors[burst],d=directions[i];
      const alive=age>=0&&age<2.8,r=Math.max(0,age-.45)*.85;
      positions[i*3]=(burst%2?1:-1)*(1.7+burst*.12)+(age<.45?0:d[0]*r);
      positions[i*3+1]=age<.45?1.2+age*2.5:2.325+d[1]*r-.3*(age-.45)**2;
      positions[i*3+2]=.2+d[2]*r*.15;
      const fade=alive?1-smooth((age-1.4)/1.4):0;
      sparkColors[i*3]=c.r*fade;sparkColors[i*3+1]=c.g*fade;sparkColors[i*3+2]=c.b*fade;
    }geometry.attributes.position.needsUpdate=true;geometry.attributes.color.needsUpdate=true;}
    return smooth((seconds-29)/3);
  }
  function drawFallback(canvas){
    const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
    ctx.fillStyle='#080e1d';ctx.fillRect(0,0,w,h);
    camera.updateMatrixWorld();
    const project=(x,y,z)=>{const p=new THREE.Vector3(x,y,z).project(camera);return [(p.x+1)*w/2,(1-p.y)*h/2];};
    if(camera.position.z>.1&&photo.image){
      const a=project(-9,5.065,0),b=project(9,-5.065,0);
      ctx.drawImage(photo.image,a[0],a[1],b[0]-a[0],b[1]-a[1]);
      if(bodies.visible)for(let i=0;i<count;i++){
        bodies.getMatrixAt(i,dummy.matrix);dummy.position.setFromMatrixPosition(dummy.matrix);
        const p=dummy.position;if(p.z>=camera.position.z-.1)continue;
        const a=project(p.x,p.y+.08,p.z),b=project(p.x,p.y-.13,p.z),height=b[1]-a[1];
        ctx.globalAlpha=bodies.material.opacity;ctx.fillStyle=colors[i%colors.length];ctx.fillRect(a[0]-height*.12,a[1]+height*.23,height*.24,height*.55);
        ctx.fillStyle='#d5a17e';ctx.beginPath();ctx.arc(a[0],a[1]+height*.1,Math.max(.5,height*.1),0,Math.PI*2);ctx.fill();
      }
      ctx.globalAlpha=1;
      if(fireworks.visible)for(let i=0;i<sparks;i++){const p=project(positions[i*3],positions[i*3+1],positions[i*3+2]);ctx.fillStyle=`rgb(${sparkColors[i*3]*255} ${sparkColors[i*3+1]*255} ${sparkColors[i*3+2]*255})`;ctx.fillRect(p[0],p[1],2,2);}
    }else{
      ctx.strokeStyle='#e2bd7a';ctx.lineWidth=2;
      for(const x of [0,w]){ctx.beginPath();ctx.moveTo(x,h);ctx.lineTo(w/2,h/2);ctx.stroke();}
      if(poster.image){const distance=-camera.position.z-(-8.6),height=.875/distance/(2*Math.tan(Math.PI/9))*h,width=height*1.5/.875;ctx.drawImage(poster.image,(w-width)/2,(h-height)/2,width,height);}
    }
  }
  return {scene,camera,update,drawFallback};
}

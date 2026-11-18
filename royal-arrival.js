import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { createRoyalCharacters } from './royal-characters.js';
import { createRoyalDog } from './royal-dogs.js';

// Original articulated figurines. Only the riders wobble drunkenly; dogs trot normally.
export function createRoyalArrival(scene) {
  const parade=new THREE.Group();scene.add(parade);parade.visible=false;
  const riders=[];
  const createKing=createRoyalCharacters();
  const material=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.65,...extra});
  function part(parent,geometry,mat,x,y,z){const m=new THREE.Mesh(geometry,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  const coats=['#773b42','#304f77','#67517f'];
  for(let i=0;i<3;i++) {
    const mount=new THREE.Group();parade.add(mount);
    const robe=material(coats[i]);
    const {dog,head,ears,legs,tail}=createRoyalDog(i);mount.add(dog);
    part(dog,new RoundedBoxGeometry(.46,.1,.55,3,.04),robe,-.08,.71,0);
    const {king,cape,beard,crown,eyes,arm,freeArm}=createKing(i);
    mount.add(king);king.position.set(-.08,.68,0);
    riders.push({mount,king,dog,head,ears,legs,tail,arm,freeArm,beard,crown,cape,eyes,index:i});
  }
  const motion={progress:0,exit:0,stumble:0};
  // Anticipation → loss of balance → landing → pause → stand → climb → settle.
  const poses=[
    [0,.68,0,0,0], [.12,.7,.08,-.2,-.3], [.27,.29,.95,1.48,.1],
    [.42,.28,.95,1.48,.1], [.58,.23,1.04,.25,0], [.72,.28,.87,-.25,0],
    [.88,1.04,.35,-.15,-.13], [1,.68,0,0,0]
  ];
  function stumblePose(t){
    let n=1;while(n<poses.length-1&&t>poses[n][0])n++;
    const a=poses[n-1],b=poses[n];let f=(t-a[0])/(b[0]-a[0]);f=f*f*(3-2*f);
    return a.slice(1).map((v,i)=>THREE.MathUtils.lerp(v,b[i+1],f));
  }
  function update(time,reduced){
    if(!parade.visible)return;
    const gag=motion.stumble>0&&motion.stumble<1;
    riders.forEach(({mount,king,dog,head,ears,legs,tail,arm,freeArm,crown,cape,eyes,index:i})=>{
      const moving=motion.progress<1||motion.exit>0;
      const leaving=THREE.MathUtils.clamp((motion.exit-.14)/.86,0,1);
      const x=[-1.85,0,1.85][i]-11*(1-motion.progress)-leaving*11;
      const spread=THREE.MathUtils.smoothstep(motion.progress,.55,1)*(1-THREE.MathUtils.smoothstep(leaving,0,.6));
      mount.position.set(x,0,2.6+(i===1?.45*spread:0)+(!reduced&&!gag?Math.sin(time*1.3+i)*.04:0));
      mount.rotation.y=Math.PI*THREE.MathUtils.smoothstep(motion.exit,0,.18)+(!reduced&&!gag?Math.sin(time*.9+i)*.07:0);
      king.position.set(-.08,.68,0);king.rotation.set(0,0,0);dog.position.y=0;
      if(!reduced){
        const trot=time*6+i;
        king.rotation.z=Math.sin(time*1.8+i*2)*.2;king.rotation.x=Math.cos(time*1.3+i)*.12;
        king.position.y=.68+(moving?Math.abs(Math.sin(trot))*.035:0);
        arm.rotation.z=-.7+Math.sin(time*1.5+i)*.24;freeArm.rotation.z=.25+Math.sin(time*1.5+i)*.2;
        tail.rotation.x=Math.sin(time*5)*.4;dog.position.y=moving?Math.abs(Math.sin(trot))*.018:0;
        legs.forEach((leg,j)=>leg.rotation.z=moving?Math.sin(trot+j*Math.PI)*.35:0);
        ears.forEach((ear,j)=>ear.rotation.x=moving?Math.sin(trot+j)*.17:0);
        crown.rotation.z=(i===1?-.28:.15)+Math.sin(time*1.8+i)*.08;
        cape.rotation.x=moving?Math.sin(trot-.4)*.06:0;
        head.rotation.y=gag?(i===1?-.5:i===0?-.3:.3):Math.sin(time*.8+i)*.06;
        eyes.forEach(eye=>eye.scale.y=Math.sin(time*.6+i)>.995?.12:(gag?1.12:.9));
        if(gag&&i===1){
          const [y,z,rx,rz]=stumblePose(motion.stumble);
          king.position.set(-.08,y,z);king.rotation.set(rx,0,rz);
          if(motion.stumble<.28){freeArm.rotation.z=1.2+Math.sin(time*14)*.45;arm.rotation.z=-1.3+Math.sin(time*12)*.35;}
          else if(motion.stumble>.55){freeArm.rotation.z=-.75;arm.rotation.z=-.8;}
          crown.position.y=crown.userData.restY+Math.sin(motion.stumble*Math.PI)*.06;
        } else crown.position.y=crown.userData.restY;
      }
    });
  }
  return {group:parade,motion,carrier:riders[2].mount,update};
}

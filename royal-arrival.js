import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// Original articulated figurines. Only the riders wobble drunkenly; dogs trot normally.
export function createRoyalArrival(scene) {
  const parade=new THREE.Group();scene.add(parade);parade.visible=false;
  const riders=[];
  const material=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.65,...extra});
  const gold=material('#d8b460',{metalness:.7,roughness:.27});
  function part(parent,geometry,mat,x,y,z){const m=new THREE.Mesh(geometry,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  function oval(parent,mat,x,y,z,sx,sy,sz){const m=part(parent,new THREE.SphereGeometry(1,20,14),mat,x,y,z);m.scale.set(sx,sy,sz);return m;}
  const skins=['#ecc4a0','#c48b61','#704630'];const coats=['#773b42','#304f77','#67517f'];const furs=['#8d4928','#482b22','#ba783d'];
  for(let i=0;i<3;i++) {
    const mount=new THREE.Group();parade.add(mount);
    const fur=material(furs[i]), dark=material('#2c201d'),skin=material(skins[i]),robe=material(coats[i]),white=material('#e2d8c9');
    const dog=new THREE.Group();mount.add(dog);
    oval(dog,fur,0,.47,0,.76,.23,.25);
    const head=new THREE.Group();head.position.set(.6,.6,0);dog.add(head);
    const headParts=[];
    headParts.push(oval(dog,fur,.68,.66,0,.27,.27,.24));
    headParts.push(oval(dog,fur,.94,.57,0,.28,.12,.15));
    headParts.push(oval(dog,dark,1.15,.59,0,.075,.07,.095));
    const ears=[];
    for(const z of [-.21,.21]){
      const ear=oval(dog,dark,.59,.48,z,.13,.29,.07);ear.rotation.z=-.25;ears.push(ear);headParts.push(ear);
      headParts.push(oval(dog,white,.79,.73,z,.045,.052,.025));
      headParts.push(oval(dog,dark,.805,.735,z*1.08,.025,.03,.018));
      headParts.push(oval(dog,white,.81,.75,z*1.1,.009,.009,.01));
    }
    scene.updateMatrixWorld(true);headParts.forEach(p=>head.attach(p));
    const collar=part(dog,new THREE.TorusGeometry(.23,.035,8,24),material('#9c343b'),.5,.52,0);collar.rotation.y=Math.PI/2;
    part(dog,new THREE.SphereGeometry(.06,12,8),gold,.51,.3,.17);
    const legs=[];
    for(const x of [-.48,.48])for(const z of [-.17,.17]){
      const pivot=new THREE.Group();pivot.position.set(x,.37,z);dog.add(pivot);
      oval(pivot,fur,0,-.13,0,.075,.17,.075);oval(pivot,dark,.04,-.28,0,.11,.055,.085);legs.push(pivot);
    }
    const tail=part(dog,new THREE.CylinderGeometry(.018,.045,.45,10),fur,-.82,.65,0);tail.rotation.z=-.8;
    // A velvet saddle, boots straddling the dog, cape and robed torso.
    part(dog,new RoundedBoxGeometry(.46,.1,.55,3,.04),robe,-.08,.71,0);
    const king=new THREE.Group();mount.add(king);king.position.set(-.08,.68,0);
    for(const z of [-.28,.28]){const leg=part(king,new THREE.CylinderGeometry(.09,.085,.38,12),robe,0,.04,z);leg.rotation.x=z>0?-.18:.18;oval(king,dark,.09,-.14,z,.16,.08,.1);}
    const cape=part(king,new THREE.ConeGeometry(.36,.87,20,1,true),robe,-.12,.49,-.06);cape.rotation.z=.12;
    part(king,new THREE.CylinderGeometry(.22,.32,.65,20),robe,0,.42,0);
    part(king,new THREE.TorusGeometry(.23,.025,8,32),gold,0,.47,0).rotation.x=Math.PI/2;
    oval(king,skin,0,.99,0,.22,.27,.2);
    const hair=material(i===0?'#e6e1d6':i===1?'#7c4227':'#292323');
    oval(king,hair,-.11,1,0,.16,.26,.19);
    const beard=oval(king,hair,.13,.83,.055,.16,.25,.15);beard.rotation.z=-.2;
    oval(king,skin,.21,.98,.025,.09,.075,.065);
    // Expressive eyes, rosy cheeks and a moustache.
    const eyes=[];
    for(const z of [-.11,.14]){
      const eye=oval(king,white,.19,1.07,z,.024,.041,.05);eyes.push(eye);
      oval(king,dark,.212,1.065,z+.005,.014,.024,.025);
      const brow=oval(king,hair,.20,1.125,z,.022,.014,.058);brow.rotation.x=z>0?.15:-.15;
      oval(king,material(i===2?'#a45b4b':'#da8e82'),.205,.98,z,.015,.045,.05);
      const moustache=oval(king,hair,.22,.92,z*.45,.03,.025,.08);moustache.rotation.x=z>0?-.25:.25;
    }
    oval(king,dark,.225,.9,.04,.025,.05,.04);
    const crown=new THREE.Group();king.add(crown);crown.position.y=1.2;crown.rotation.z=i===1?-.28:.15;
    part(crown,new THREE.CylinderGeometry(.23,.23,.12,24,1,true),gold,0,0,0);
    for(let j=0;j<6;j++){const a=j*Math.PI/3;part(crown,new THREE.ConeGeometry(.065,.19,4),gold,Math.cos(a)*.21,.13,Math.sin(a)*.21);oval(crown,material(['#a02b39','#315b99','#408c76'][i],{metalness:.3,roughness:.15}),Math.cos(a)*.231,.015,Math.sin(a)*.231,.028,.035,.028);}
    const arm=new THREE.Group();arm.position.set(0,.65,.28);king.add(arm);arm.rotation.x=-.35;arm.rotation.z=-.7;
    part(arm,new THREE.CylinderGeometry(.085,.07,.35,12),robe,0,-.15,0);oval(arm,skin,0,-.34,0,.08,.09,.08);
    const bottle=new THREE.Group();arm.add(bottle);bottle.position.set(0,-.36,.06);bottle.rotation.z=.3;
    const glass=material('#355b34',{metalness:.15,roughness:.2});part(bottle,new THREE.CylinderGeometry(.065,.07,.23,12),glass,0,.06,0);part(bottle,new THREE.CylinderGeometry(.025,.03,.13,10),glass,0,.24,0);part(bottle,new THREE.CylinderGeometry(.071,.071,.09,12),material('#ece1b9'),0,.06,0);
    const freeArm=new THREE.Group();freeArm.position.set(0,.67,-.28);king.add(freeArm);freeArm.rotation.z=.25;
    part(freeArm,new THREE.CylinderGeometry(.075,.065,.34,12),robe,0,-.14,0);oval(freeArm,skin,0,-.34,0,.065,.09,.08);
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
      const x=[-1.85,0,1.85][i]-9*(1-motion.progress)+motion.exit*11;
      mount.position.set(x,0,2.6+(i===1?.45:0)+(!reduced&&!gag?Math.sin(time*1.3+i)*.08:0));
      mount.rotation.y=!reduced&&!gag?Math.sin(time*.9+i)*.1:0;
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
        eyes.forEach(eye=>eye.scale.y=(gag?.055:.033)*(Math.sin(time*.6+i)> .995?.15:1));
        if(gag&&i===1){
          const [y,z,rx,rz]=stumblePose(motion.stumble);
          king.position.set(-.08,y,z);king.rotation.set(rx,0,rz);
          if(motion.stumble<.28){freeArm.rotation.z=1.2+Math.sin(time*14)*.45;arm.rotation.z=-1.3+Math.sin(time*12)*.35;}
          else if(motion.stumble>.55){freeArm.rotation.z=-.75;arm.rotation.z=-.8;}
          crown.position.y=1.2+Math.sin(motion.stumble*Math.PI)*.06;
        } else crown.position.y=1.2;
      }
    });
  }
  return {group:parade,motion,carrier:riders[2].mount,update};
}

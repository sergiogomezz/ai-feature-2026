import * as THREE from 'three';

// Deterministic textures generated locally; no remote asset requests.
export function surfaceTexture(kind) {
  const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
  const c=canvas.getContext('2d');
  let seed=91;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  c.fillStyle=kind==='wood'?'#bda17e':kind==='paper'?'#ddd1b8':'#b4b0a6';c.fillRect(0,0,512,512);
  if(kind==='wood'){
    for(let i=0;i<1500;i++){
      const y=random()*512;c.strokeStyle=`rgba(${random()>.5?'65,39,21':'245,222,185'},${.04+random()*.15})`;c.lineWidth=.3+random()*1.2;
      c.beginPath();c.moveTo(0,y);for(let x=0;x<=512;x+=16)c.lineTo(x,y+Math.sin(x*.018+y)*2+Math.sin(x*.05+y)*.6);c.stroke();
    }
  } else {
    for(let i=0;i<35000;i++){const v=Math.floor(60+random()*170);c.fillStyle=`rgba(${v},${v},${v},.13)`;c.fillRect(random()*512,random()*512,1,kind==='fabric'?3:1);}
    if(kind==='fabric')for(let i=0;i<512;i+=3){c.fillStyle=i%2?'#ffffff18':'#00000012';c.fillRect(i,0,1,512);c.fillRect(0,i,512,1);}
    if(kind==='paper'){c.strokeStyle='#eee1ba';c.lineWidth=1;for(let y=20;y<512;y+=64)for(let x=20;x<512;x+=64){c.beginPath();c.moveTo(x-5,y);c.lineTo(x+5,y);c.moveTo(x,y-5);c.lineTo(x,y+5);c.stroke();}}
  }
  const map=new THREE.CanvasTexture(canvas);map.wrapS=map.wrapT=THREE.RepeatWrapping;map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=8;map.repeat.set(kind==='wood'?4:2,kind==='wood'?12:2);return map;
}

export function addFir(THREE,tree) {
  let seed=42;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const branches=252, perBranch=80;
  const needles=new THREE.InstancedMesh(new THREE.ConeGeometry(.018,.18,3),new THREE.MeshStandardMaterial({color:'#28543c',roughness:.88}),branches*perBranch);
  const twigs=new THREE.InstancedMesh(new THREE.CylinderGeometry(.008,.018,1,5),new THREE.MeshStandardMaterial({color:'#5c4934',roughness:1}),branches);
  const dummy=new THREE.Object3D(), axis=new THREE.Vector3(0,1,0),dir=new THREE.Vector3(),color=new THREE.Color();
  let n=0;
  for(let b=0;b<branches;b++){
    const level=Math.floor(b/18), h=.55+level*.27,angle=b*2.399+rand()*.4;
    const radius=(1.42*(1-(h-.55)/4.05))*(.85+rand()*.24);
    const start=new THREE.Vector3(Math.sin(level)*.035,h,0), end=new THREE.Vector3(Math.cos(angle)*radius,h+.11+radius*.06,Math.sin(angle)*radius);
    dir.subVectors(end,start);dummy.position.copy(start).lerp(end,.5);dummy.quaternion.setFromUnitVectors(axis,dir.clone().normalize());dummy.scale.set(1,dir.length(),1);dummy.updateMatrix();twigs.setMatrixAt(b,dummy.matrix);
    for(let j=0;j<perBranch;j++){
      const t=rand(), spread=(.035+.17*Math.sin(t*Math.PI));
      dummy.position.copy(start).lerp(end,t);dummy.position.x+=(rand()-.5)*spread*2;dummy.position.z+=(rand()-.5)*spread*2;dummy.position.y+=(rand()-.3)*spread;
      dir.set(Math.cos(angle)+(rand()-.5)*3,.6+rand(),Math.sin(angle)+(rand()-.5)*3).normalize();dummy.quaternion.setFromUnitVectors(axis,dir);dummy.scale.setScalar(.65+rand()*.65);dummy.updateMatrix();needles.setMatrixAt(n,dummy.matrix);
      color.setHSL(.36+rand()*.045,.25+rand()*.25,.12+rand()*.15);needles.setColorAt(n++,color);
    }
  }
  needles.castShadow=true;needles.receiveShadow=true;twigs.castShadow=true;tree.add(needles,twigs);
}

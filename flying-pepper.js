import * as THREE from 'three';

export function createFlyingPepper(){
  const pepper=new THREE.Group(),wings=[];
  const red=new THREE.MeshPhysicalMaterial({color:'#ed3825',roughness:.28,clearcoat:.85,clearcoatRoughness:.22});
  const green=new THREE.MeshStandardMaterial({color:'#438b43',roughness:.5});
  const white=new THREE.MeshStandardMaterial({color:'#fffaf0',roughness:.45});
  const ink=new THREE.MeshStandardMaterial({color:'#20212a',roughness:.3});
  const sphere=new THREE.SphereGeometry(1,32,24);
  function oval(parent,mat,x,y,z,sx,sy,sz){const m=new THREE.Mesh(sphere,mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;}
  function tube(points,radius,mat,parent=pepper){const m=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),32,radius,12,false),mat);parent.add(m);return m;}
  // Rounded bell-pepper shoulders and three soft lobes, closed at both ends.
  const shape=new THREE.CatmullRomCurve3([
    new THREE.Vector3(0,-.63,0),new THREE.Vector3(.32,-.58,0),new THREE.Vector3(.43,-.35,0),
    new THREE.Vector3(.51,.12,0),new THREE.Vector3(.48,.43,0),new THREE.Vector3(.3,.56,0),new THREE.Vector3(0,.49,0)
  ]);
  const vertices=[],indices=[],rows=64,cols=80;
  for(let j=0;j<=rows;j++){
    const p=shape.getPoint(j/rows);
    for(let k=0;k<=cols;k++){
      const a=k/cols*Math.PI*2,r=p.x*(1+.085*Math.cos(a*3));
      vertices.push(Math.cos(a)*r,p.y+.025*Math.cos(a*3)*Math.sin(j/rows*Math.PI),Math.sin(a)*r*.78);
      if(j<rows&&k<cols){const q=j*(cols+1)+k;indices.push(q,q+cols+1,q+1,q+1,q+cols+1,q+cols+2);}
    }
  }
  const body=new THREE.BufferGeometry();body.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));body.setIndex(indices);body.computeVertexNormals();pepper.add(new THREE.Mesh(body,red));
  for(let i=0;i<5;i++){const a=i*Math.PI*2/5;const leaf=oval(pepper,green,Math.cos(a)*.14,.51,Math.sin(a)*.12,.15,.035,.075);leaf.rotation.y=-a;}
  tube([[0,.5,0],[.03,.68,0],[.15,.8,0],[.22,.76,0]],.065,green);
  for(const x of [-.19,.19]){
    oval(pepper,white,x,.15,.355,.135,.16,.065);
    oval(pepper,ink,x+.025,.145,.412,.062,.087,.026);
    oval(pepper,white,x+.045,.18,.435,.023,.03,.009);
    tube([[x-.08,.365,.32],[x,.39,.345],[x+.07,.365,.32]],.015,green);
  }
  tube([[-.1,-.13,.385],[0,-.19,.405],[.1,-.13,.385]],.022,ink);
  const blush=new THREE.MeshStandardMaterial({color:'#ff9980',roughness:.7});
  for(const x of [-.32,.32])oval(pepper,blush,x,-.035,.31,.075,.04,.018);
  // Layered, tapered feather silhouettes instead of the old bulbous wings.
  for(const side of [-1,1]){
    const wing=new THREE.Group();wing.position.set(side*.38,.04,-.08);pepper.add(wing);wings.push(wing);
    oval(wing,white,side*.18,.08,0,.28,.13,.07);
    for(let i=0;i<5;i++){
      const feather=oval(wing,white,side*(.29+i*.085),.13-i*.045,-i*.007,.29-i*.023,.058,.038);
      feather.rotation.z=side*(.62-i*.18);
    }
  }
  return {pepper,animate(time,reduced,collision=0){
    wings.forEach((wing,i)=>{wing.rotation.z=reduced?0:Math.sin(time*10)*(i?-.28:.28);wing.rotation.y=(i?1:-1)*.12;});
    pepper.rotation.y=reduced?0:.12+Math.sin(time*1.4)*.07;
    pepper.rotation.x=reduced?0:Math.sin(time*1.8)*.035;
    pepper.scale.setScalar(1+collision*.04);
  }};
}

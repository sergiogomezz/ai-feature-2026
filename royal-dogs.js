import * as THREE from 'three';

// Clean, graphic dachshunds: long backs, tapered muzzles and very short legs.
export function createRoyalDog(index) {
  const dog=new THREE.Group();
  const colors=[['#a75d32','#713e28','#ce9560'],['#694332','#382c27','#b28357'],['#c48b45','#82552d','#edbd7b']][index];
  const material=color=>new THREE.MeshStandardMaterial({color,roughness:.88});
  const coat=material(colors[0]),earMat=material(colors[1]),tan=material(colors[2]);
  const black=material('#252325'),white=material('#fff6df');
  function part(parent,geometry,mat,x,y,z){const m=new THREE.Mesh(geometry,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  function oval(parent,mat,x,y,z,sx,sy,sz){const m=part(parent,new THREE.SphereGeometry(1,18,12),mat,x,y,z);m.scale.set(sx,sy,sz);return m;}
  function stroke(parent,points,radius,mat){return part(parent,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),16,radius,6,false),mat,0,0,0);}
  const body=part(dog,new THREE.CapsuleGeometry(.22,1.02,6,20),coat,-.08,.47,0);body.rotation.z=Math.PI/2;
  oval(dog,coat,.43,.49,0,.25,.28,.215);
  oval(dog,tan,.51,.43,0,.105,.18,.17);
  const head=new THREE.Group();head.position.set(.63,.73,0);dog.add(head);
  const profile=new THREE.Shape();
  profile.moveTo(-.2,-.16);profile.lineTo(.46,-.155);profile.quadraticCurveTo(.54,-.14,.51,-.045);
  profile.lineTo(.08,.19);profile.quadraticCurveTo(-.16,.25,-.2,.06);profile.closePath();
  part(head,new THREE.ExtrudeGeometry(profile,{depth:.27,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:3,steps:1}),coat,0,0,-.135);
  oval(head,black,.505,-.077,0,.065,.052,.098);
  for(const sign of [-1,1]) {
    const eye=oval(head,white,.055,.095,sign*.16,.062,.085,.018);eye.rotation.z=-.12;
    oval(head,black,.082,.096,sign*.178,.025,.046,.009);
    oval(head,white,.089,.118,sign*.185,.008,.011,.005);
    stroke(head,[[.008,.18,sign*.17],[.057,.195,sign*.174],[.099,.181,sign*.167]],.009,earMat);
    stroke(head,[[.12,-.1,sign*.155],[.3,-.121,sign*.155],[.43,-.116,sign*.126]],.006,earMat);
  }
  const ears=[];
  for(const sign of [-1,1]) {
    const pivot=new THREE.Group();pivot.position.set(-.105,.1,sign*.16);head.add(pivot);
    const outline=new THREE.Shape();outline.moveTo(-.055,.02);outline.quadraticCurveTo(-.16,-.12,-.13,-.36);
    outline.quadraticCurveTo(-.06,-.48,.04,-.37);outline.quadraticCurveTo(.11,-.17,.075,-.03);outline.closePath();
    part(pivot,new THREE.ExtrudeGeometry(outline,{depth:.026,bevelEnabled:true,bevelThickness:.018,bevelSize:.015,bevelSegments:2}),earMat,0,0,sign<0?-.026:0);
    pivot.rotation.z=-.14;ears.push(pivot);
  }
  const collar=part(dog,new THREE.TorusGeometry(.2,.027,6,28),material(['#7f3039','#325765','#72603e'][index]),.48,.56,0);collar.rotation.y=Math.PI/2;
  oval(dog,material('#d5ac56'),.5,.35,.16,.032,.045,.012);
  const legs=[];
  for(const x of [-.53,.45])for(const sign of [-1,1]) {
    const leg=new THREE.Group();leg.position.set(x,.37,sign*.15);dog.add(leg);
    const upper=oval(leg,coat,-.015,-.085,0,.075,.14,.073);upper.rotation.z=x<0?-.2:.1;
    oval(leg,tan,.012,-.205,0,.057,.095,.06);
    oval(leg,coat,.055,-.285,0,.105,.05,.074);
    for(const z of [-.025,.025])stroke(leg,[[.135,-.284,z],[.137,-.297,z]],.003,earMat);
    legs.push(leg);
  }
  const tail=new THREE.Group();tail.position.set(-.8,.5,0);dog.add(tail);
  stroke(tail,[[0,0,0],[-.2,.12,0],[-.36,.32,0],[-.42,.37,0]],.028,coat);
  return {dog,head,ears,legs,tail};
}

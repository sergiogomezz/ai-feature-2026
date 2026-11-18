import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export function createArrivalDoor(scene,{wall,trim,wood,floor}) {
  function box(w,h,d,material,x,y,z,parent=scene) {
    const m=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,2,Math.min(.03,w*.12,h*.12,d*.12)),material);
    m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
  }
  const low=1.2,high=4,top=3.15;
  // A genuine opening in the left wall, not a door placed over solid geometry.
  box(.18,12,low+3.5,wall,-7,5.8,(low-3.5)/2);
  box(.18,12,18.5-high,wall,-7,5.8,(18.5+high)/2);
  box(.18,11.8-top,high-low,wall,-7,(11.8+top)/2,(low+high)/2);
  // Full-depth jambs, rebates and layered architraves surround both leaves.
  for(const z of [low-.065,high+.065]) {
    box(.3,top+.1,.13,trim,-7,top/2,z);
    box(.07,top+.22,.2,trim,-6.8,top/2,z);
    box(.035,top+.25,.24,trim,-6.755,top/2,z);
  }
  box(.3,.13,high-low+.26,trim,-7,top+.025,(low+high)/2);
  box(.1,.21,high-low+.48,trim,-6.79,top+.065,(low+high)/2);
  box(.035,.055,high-low+.56,trim,-6.72,top+.18,(low+high)/2);
  box(.4,.035,high-low,wood,-7,-.02,(low+high)/2);
  // A dim corridor gives the doorway depth and conceals the queue outside.
  const corridor=new THREE.MeshStandardMaterial({color:'#4d514b',roughness:1});
  const dark=new THREE.MeshStandardMaterial({color:'#252c29',roughness:1});
  box(7,.16,3,floor,-10.5,-.14,2.6);
  for(const z of [low-.2,high+.2])box(7,3.4,.15,corridor,-10.5,1.6,z);
  box(7,.15,3.3,corridor,-10.5,3.4,2.6);
  box(.15,3.3,3,dark,-14,1.5,2.6);
  const warm=new THREE.PointLight('#ffcd8b',9,6,2);warm.position.set(-8.2,2.4,2.6);scene.add(warm);
  const paint=new THREE.MeshStandardMaterial({color:'#795c3e',roughness:.53});
  const inset=new THREE.MeshStandardMaterial({color:'#684c34',roughness:.65});
  const molding=new THREE.MeshStandardMaterial({color:'#99764e',roughness:.55});
  const brass=new THREE.MeshStandardMaterial({color:'#bda064',metalness:.75,roughness:.28});
  const hinges=[];
  const width=(high-low)/2-.025,height=top-.08;
  for(const direction of [1,-1]) {
    const leaf=new THREE.Group();leaf.position.set(-7.055,0,direction===1?low+.02:high-.02);scene.add(leaf);hinges.push(leaf);
    const center=direction*width/2;
    box(.13,height,width,paint,0,height/2+.045,center,leaf);
    // Recessed panels with four joined moldings, all inside the leaf silhouette.
    for(const face of [-1,1])for(const [y,h] of [[.76,1.04],[2.2,1.16]]) {
      const panelWidth=width-.3;
      box(.014,h,panelWidth,inset,face*.071,y,center,leaf);
      for(const z of [center-panelWidth/2,center+panelWidth/2])box(.035,h+.075,.038,molding,face*.083,y,z,leaf);
      for(const edge of [y-h/2,y+h/2])box(.035,.038,panelWidth+.075,molding,face*.083,edge,center,leaf);
    }
    const handleZ=direction*(width-.16);
    for(const face of [-1,1]) {
      box(.026,.23,.075,brass,face*.085,1.32,handleZ,leaf);
      box(.12,.035,.18,brass,face*.14,1.36,handleZ-direction*.045,leaf);
    }
    for(const y of [.35,1.55,2.77]) {
      const pin=new THREE.Mesh(new THREE.CylinderGeometry(.026,.026,.16,12),brass);
      pin.position.set(.015,y,0);leaf.add(pin);
    }
  }
  const [hinge,opposite]=hinges;
  function update() { opposite.rotation.y=-hinge.rotation.y; }
  return {hinge,update};
}

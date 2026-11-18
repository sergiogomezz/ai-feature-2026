import * as THREE from 'three';
import { surfaceTexture } from './materials.js';

// Sculpted, articulated cartoon characters; faces look along the dogs' +X axis.
export function createRoyalCharacters() {
  const sphere = new THREE.SphereGeometry(1, 24, 18);
  const weave = surfaceTexture('fabric');
  const mat = (color, options = {}) => new THREE.MeshPhysicalMaterial({color, roughness: .65, ...options});
  const gold = mat('#dfb65a', {metalness: .78, roughness: .24});
  const ivory = mat('#fff0d5');
  const leather = mat('#382c29', {roughness: .42});
  const white = mat('#fff9e9', {roughness: .22});
  const pupil = mat('#151719', {roughness: .12, clearcoat: 1});
  const profiles = [
    {skin:'#edc3a3', blush:'#df9a88', hair:'#e1ddd4', shadow:'#afa99e', robe:'#783c46', cape:'#a04f56', jewel:'#b83945', iris:'#719797'},
    {skin:'#d8a177', blush:'#be795f', hair:'#9a5835', shadow:'#633d2d', robe:'#285e68', cape:'#327f84', jewel:'#438f7c', iris:'#6f843f'},
    {skin:'#794d37', blush:'#8d5343', hair:'#292728', shadow:'#171b20', robe:'#4c3c79', cape:'#7560a4', jewel:'#7a5ab1', iris:'#704d2d'}
  ];
  function mesh(parent, geometry, material, x=0,y=0,z=0) {
    const m = new THREE.Mesh(geometry, material); m.position.set(x,y,z);
    m.castShadow=true; m.receiveShadow=true; parent.add(m); return m;
  }
  function oval(parent,material,x,y,z,sx,sy,sz) {
    const m=mesh(parent,sphere,material,x,y,z);m.scale.set(sx,sy,sz);return m;
  }
  function line(parent, points, radius, material) {
    const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
    return mesh(parent,new THREE.TubeGeometry(curve,20,radius,7,false),material);
  }
  function ring(parent,radius,tube,material,y) {
    const m=mesh(parent,new THREE.TorusGeometry(radius,tube,8,40),material,0,y,0);
    m.rotation.x=Math.PI/2;return m;
  }
  function cloth(parent, material, cape=false) {
    const cols=48,rows=16,vertices=[],uv=[],indices=[];
    for(let j=0;j<=rows;j++)for(let k=0;k<=cols;k++) {
      const v=j/rows, a=cape?Math.PI*.4+k/cols*Math.PI*1.2:k/cols*Math.PI*2;
      const radius=(cape ? .24 + .18*v : .21 + .1*v + .025*Math.sin(v*Math.PI*2)) *
        (1 + (.025 + .065*v)*Math.cos(a*(cape?10:12)));
      vertices.push(Math.cos(a)*radius-(cape?.045:0), .75-v*(cape?.81:.64),Math.sin(a)*radius);
      uv.push(k/cols,v);
      if(j<rows&&k<cols){const n=j*(cols+1)+k;indices.push(n,n+cols+1,n+1,n+1,n+cols+1,n+cols+2);}
    }
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
    geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();
    return mesh(parent,geo,material);
  }
  return function createKing(index) {
    const p=profiles[index];
    const king=new THREE.Group();
    const skin=mat(p.skin,{roughness:.57});
    const blush=mat(p.blush,{roughness:.7});
    const hair=mat(p.hair,{roughness:.86});
    const hairShadow=mat(p.shadow,{roughness:.9});
    const velvet=mat(p.robe,{bumpMap:weave,bumpScale:.012,sheen:.65,sheenColor:new THREE.Color(p.cape),side:THREE.DoubleSide});
    const lining=mat(p.cape,{bumpMap:weave,bumpScale:.008,sheen:.8,side:THREE.DoubleSide});
    const jewel=mat(p.jewel,{metalness:.2,roughness:.12,clearcoat:1});

    // Seated hips, thighs and calves give the robes a human silhouette.
    for(const sign of [-1,1]) {
      const thigh=oval(king,velvet,.035,.17,sign*.22,.145,.18,.17);thigh.rotation.x=sign*.38;
      oval(king,velvet,.065,-.015,sign*.31,.095,.19,.1);
      oval(king,leather,.115,-.17,sign*.32,.19,.085,.105);
      oval(king,leather,.035,-.075,sign*.32,.105,.13,.095);
      const sole=oval(king,hairShadow,.12,-.227,sign*.32,.19,.024,.108);
      line(king,[[.04,-.1,sign*.405],[.1,-.08,sign*.416],[.16,-.11,sign*.41]],.009,gold);
      sole.castShadow=false;
    }
    const cape=cloth(king,lining,true);
    cloth(king,velvet);
    // Heavy embroidered hem and a narrow front opening, rather than a solid cone.
    for(const sign of [-1,1]) {
      line(king,[[.205,.71,sign*.05],[.25,.44,sign*.047],[.31,.12,sign*.055]],.016,gold);
      for(let j=0;j<5;j++)oval(king,gold,.24+j*.014,.64-j*.105,sign*.065,.012,.018,.011);
    }
    ring(king,.265,.022,gold,.34);
    oval(king,jewel,.278,.34,0,.027,.05,.052);
    oval(king,skin,0,.8,0,.105,.13,.105);
    // Fur collar, clasps, chain and brocade edging.
    for(let j=0;j<18;j++) {
      const a=j/18*Math.PI*2;
      oval(king,ivory,Math.cos(a)*.23,.735+Math.cos(a)*.015,Math.sin(a)*.24,.055,.06,.055);
    }
    for(const sign of [-1,1])oval(king,gold,.22,.7,sign*.16,.022,.036,.035);
    line(king,[[.235,.7,-.16],[.27,.61,0],[.235,.7,.16]],.009,gold);
    oval(king,jewel,.277,.6,0,.02,.042,.035);
    for(let j=0;j<18;j++) {
      const a=Math.PI*.4+j/17*Math.PI*1.2;
      oval(cape,gold,Math.cos(a)*.42-.045,-.045,Math.sin(a)*.42,.016,.023,.016);
    }

    // Cheekbones, jaw, ears and a nose built in separate sculpted volumes.
    oval(king,skin,-.012,1.025,0,.205,.267,.192);
    oval(king,skin,.09,.935,0,.142,.14,.157);
    for(const sign of [-1,1]) {
      oval(king,skin,-.018,1.01,sign*.193,.061,.091,.04);
      oval(king,blush,-.005,1.013,sign*.222,.027,.052,.013);
      oval(king,skin,.153,.995,sign*.116,.063,.075,.07);
      oval(king,blush,.203,.996,sign*.12,.014,.03,.035);
    }
    oval(king,skin,.207,1.064,0,.056,.091,.048);
    oval(king,skin,.26,1.014,0,.072,.055,.063);
    for(const sign of [-1,1])oval(king,blush,.255,.989,sign*.043,.025,.015,.019);
    const mouth=oval(king,mat('#633a35'),.211,.927,0,.028,.037,.068);
    oval(king,white,.233,.943,0,.008,.012,.045);
    oval(king,blush,.229,.913,0,.012,.01,.038);
    mouth.rotation.z=-.1;
    const eyes=[];
    for(const sign of [-1,1]) {
      const eye=new THREE.Group();eye.position.set(.18,1.091,sign*.104);king.add(eye);eyes.push(eye);
      oval(eye,skin,0,0,0,.039,.052,.06);
      oval(eye,white,.023,0,0,.025,.034,.046);
      oval(eye,mat(p.iris,{roughness:.25}),.044,-.003,sign*.004,.01,.027,.024);
      oval(eye,pupil,.053,-.003,sign*.004,.005,.021,.014);
      oval(eye,white,.058,.007,sign*.004-.009,.003,.007,.006);
      line(eye,[[.027,.013,-.038],[.041,.033,0],[.025,.015,.039]],.009,skin);
      const brow=oval(king,hair,.201,1.154,sign*.112,.026,.024,.064);
      brow.rotation.x=sign*(index===1?.26:-.18);
      // Fine laughter lines remain visible around the big cartoon eyes.
      line(king,[[.17,1.075,sign*.154],[.184,1.056,sign*.16],[.174,1.044,sign*.161]],.004,blush);
    }

    // Hair and beards are locks with shaded roots, rather than one large oval.
    oval(king,hairShadow,-.105,1.07,0,.15,.22,.195);
    for(let j=0;j<16;j++) {
      const a=j/16*Math.PI*2;
      oval(king,hair,Math.cos(a)*.155-.045,1.16+Math.sin(j*2)*.012,Math.sin(a)*.175,.063,.085,.06);
    }
    const beard=new THREE.Group();king.add(beard);
    const beardLength=index===0?.3:index===1?.22:.105;
    oval(beard,hairShadow,.125,.892,0,.135,beardLength*.8,.155);
    for(let j=0;j<13;j++) {
      const z=(j/12-.5)*.27, taper=1-Math.abs(z)/.19;
      const lock=oval(beard,hair,.173+Math.cos(j*.9)*.012,.9-beardLength*.38,z,.058,beardLength*(.45+taper*.28),.043);
      lock.rotation.x=z*1.8;lock.rotation.z=-.17;
      line(beard,[[.217,.94,z],[.227,.86-beardLength*.2,z*.9],[.205,.88-beardLength*.85,z*.68]],.004,hairShadow);
    }
    for(const sign of [-1,1]) {
      const moustache=oval(king,hair,.245,.959,sign*.052,.037,.029,.067);
      moustache.rotation.x=sign*-.38;
      if(index===0)for(let j=0;j<2;j++)line(king,[[.176,1.205+j*.018,-.075],[.19,1.213+j*.018,0],[.174,1.205+j*.018,.075]],.003,blush);
    }

    const crown=new THREE.Group();king.add(crown);crown.position.y=1.265;
    crown.rotation.z=index===1?-.18:.1;
    if(index===2) {
      const silk=mat('#ece0bd',{sheen:.7,sheenColor:new THREE.Color('#fff2d0')});
      oval(crown,silk,-.025,.018,0,.236,.13,.224);
      for(let j=0;j<5;j++) {
        const fold=ring(crown,.22-j*.012,.026,silk,-.04+j*.032);fold.rotation.z=(j-2)*.06;
      }
      oval(crown,gold,.223,.018,0,.025,.077,.065);
      oval(crown,jewel,.248,.02,0,.012,.05,.039);
      line(crown,[[0,.1,0],[-.055,.24,0],[-.11,.34,.01]],.014,gold);
      const feather=oval(crown,ivory,-.08,.235,0,.045,.155,.018);feather.rotation.z=-.35;
    } else {
      mesh(crown,new THREE.CylinderGeometry(.22,.216,.1,40,1,true),gold,0,.015,0);
      ring(crown,.219,.013,gold,-.035);ring(crown,.223,.013,gold,.063);
      for(let j=0;j<8;j++) {
        const a=j/8*Math.PI*2,x=Math.cos(a),z=Math.sin(a);
        const tip=mesh(crown,new THREE.ConeGeometry(.052,.135,4),gold,x*.205,.125,z*.205);
        tip.rotation.y=-a;oval(crown,gold,x*.205,.19,z*.205,.022,.022,.022);
        oval(crown,jewel,x*.225,.015,z*.225,.028,.035,.028);
      }
    }

    function armAt(sign, bottle=false) {
      const arm=new THREE.Group();arm.position.set(0,.67,sign*.26);king.add(arm);
      oval(arm,velvet,0,-.07,0,.12,.15,.12);
      oval(arm,velvet,.012,-.2,0,.087,.16,.085);
      const cuff=ring(arm,.083,.021,gold,-.31);cuff.scale.set(1,1,.95);
      oval(arm,skin,.015,-.357,0,.067,.079,.066);
      for(let j=0;j<4;j++)oval(arm,skin,.065,-.35-j*.023,-.033+j*.021,.021,.028,.02);
      oval(arm,skin,-.026,-.353,.055,.025,.043,.026);
      if(bottle) {
        const b=new THREE.Group();arm.add(b);b.position.set(.03,-.39,.05);b.rotation.z=.3;
        const glass=mat('#335537',{roughness:.18,metalness:.12,clearcoat:.8});
        mesh(b,new THREE.CylinderGeometry(.055,.06,.2,20),glass,0,.065,0);
        oval(b,glass,0,.17,0,.055,.04,.055);
        mesh(b,new THREE.CylinderGeometry(.022,.027,.12,16),glass,0,.23,0);
        mesh(b,new THREE.CylinderGeometry(.025,.025,.025,16),gold,0,.294,0);
        mesh(b,new THREE.CylinderGeometry(.061,.061,.075,20),ivory,0,.06,0);
      }
      return arm;
    }
    const arm=armAt(1,true);arm.rotation.x=-.35;arm.rotation.z=-.7;
    const freeArm=armAt(-1);freeArm.rotation.z=.25;
    crown.userData.restY=crown.position.y;
    return {king,cape,beard,crown,eyes,arm,freeArm};
  };
}

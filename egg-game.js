import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// Cutouts and splashes live in the existing room, under its lights and camera.
export function createEggGame({canvas, container, reduced, scene, camera, focusTarget}) {
  const overlay = document.getElementById('egg-game');
  const targetsUI = overlay.querySelector('.egg-targets');
  const surfaces = [];
  scene.traverse(object => { if (object.isMesh) surfaces.push(object); });
  const root = new THREE.Group(); root.name = 'egg-room-targets'; root.visible = false; scene.add(root);
  const effects = new THREE.Group(); effects.name = 'egg-room-splashes'; scene.add(effects);
  let seed = 731;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const cream = new THREE.MeshStandardMaterial({color: '#f2e3bb', roughness: .8, side: THREE.DoubleSide});
  const eggMat = new THREE.MeshPhysicalMaterial({color: '#fff0d2', roughness: .34, clearcoat: .4});
  const whiteMat = new THREE.MeshPhysicalMaterial({color: '#fff7ce', transparent: true, opacity: .77, roughness: .12, clearcoat: 1, depthWrite: false});
  const yolkMat = new THREE.MeshPhysicalMaterial({color: '#ffbd0e', roughness: .12, clearcoat: 1, metalness: .03});
  const eggGeometry = new THREE.SphereGeometry(.15, 20, 16);
  const dropGeometry = new THREE.SphereGeometry(1, 16, 12);
  let facePixels;
  const portrait = new THREE.TextureLoader().load('/maria-head-cutout.png', texture => {
    const c = document.createElement('canvas'); c.width = texture.image.width; c.height = texture.image.height;
    const ctx = c.getContext('2d'); ctx.drawImage(texture.image, 0, 0);
    facePixels = {data: ctx.getImageData(0, 0, c.width, c.height).data, width: c.width, height: c.height};
  });
  portrait.colorSpace = THREE.SRGBColorSpace;
  const faceMaterial = new THREE.MeshBasicMaterial({map: portrait, transparent: true, alphaTest: .25, side: THREE.DoubleSide, toneMapped: false});
  const positions = [[-3, 3.75, -2.96], [3, 3.65, -2.77], [.5, 5.3, -3.12], [-5, 2.65, -3.22], [5.7, 2.7, -3.12]];
  const targets = positions.map((position, i) => {
    const group = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 1.38), faceMaterial);
    group.position.set(...position); group.name = `maria-face-${i + 1}`; root.add(group);
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'egg-target';
    button.setAttribute('aria-label', `Lanzar a la cara ${i + 1} de María`);
    button.addEventListener('focus', () => {
      if (active && button.classList.contains('egg-target-away')) { focusTarget(group.position); resize(); }
    });
    button.addEventListener('click', event => {
      event.stopPropagation();
      launch({point: group.position.clone().add(new THREE.Vector3(0, 0, .02)), normal: new THREE.Vector3(0, 0, 1), target: targets[i]});
    });
    targetsUI.append(button);
    return {group, button, hit: false};
  });
  // A small articulated first-person hand: wind-up, release, follow-through, reload.
  const hand = new THREE.Group(); hand.name = 'egg-throwing-hand'; camera.add(hand); scene.add(camera);
  const skin = new THREE.MeshStandardMaterial({color: '#dda982', roughness: .72, emissive: '#a96d46', emissiveIntensity: .12});
  const sleeve = new THREE.MeshStandardMaterial({color: '#637e70', roughness: .95});
  const palm = new THREE.Mesh(new RoundedBoxGeometry(.28, .31, .13, 4, .055), skin); hand.add(palm);
  const wrist = new THREE.Mesh(new THREE.CylinderGeometry(.105, .13, .38, 16), skin); wrist.position.y = -.29; hand.add(wrist);
  const cuff = new THREE.Mesh(new THREE.CylinderGeometry(.145, .17, .38, 16), sleeve); cuff.position.y = -.56; hand.add(cuff);
  const fingers = [];
  for (let i = 0; i < 4; i++) {
    const finger = new THREE.Mesh(new THREE.CapsuleGeometry(.035, .18 + Math.sin(i / 3 * Math.PI) * .06, 5, 12), skin);
    finger.position.set((i - 1.5) * .067, .23 + Math.sin(i / 3 * Math.PI) * .03, -.015); finger.rotation.x = .35; hand.add(finger); fingers.push(finger);
  }
  const thumb = new THREE.Mesh(new THREE.CapsuleGeometry(.046, .14, 5, 12), skin); thumb.position.set(-.17, .04, .075); thumb.rotation.z = -.8; hand.add(thumb);
  const heldEgg = new THREE.Mesh(eggGeometry, eggMat); heldEgg.position.set(0, .23, .1); heldEgg.scale.set(.85, 1.22, .85); hand.add(heldEgg);
  hand.scale.setScalar(.48); hand.visible = false;
  let active = false, paused = false, elapsed = 0, finishAt = null, onHit, onComplete;
  let shots = [], stains = [], serial = 0, lastWindup = -1000, pointerStart, projectionKey = '';
  const ray = new THREE.Raycaster(), pointer = new THREE.Vector2();
  function visible(object) { for(let p = object; p; p = p.parent)if(!p.visible)return false; return true; }
  function opaqueFace(hit) {
    if (!facePixels || !hit.uv) return true;
    const x = Math.max(0, Math.min(facePixels.width - 1, Math.floor(hit.uv.x * facePixels.width)));
    const y = Math.max(0, Math.min(facePixels.height - 1, Math.floor((1 - hit.uv.y) * facePixels.height)));
    return facePixels.data[(y * facePixels.width + x) * 4 + 3] > 64;
  }
  function aim(clientX, clientY) {
    if (!active || paused) return;
    const r = canvas.getBoundingClientRect();
    pointer.set((clientX - r.left) / r.width * 2 - 1, -(clientY - r.top) / r.height * 2 + 1);
    camera.updateMatrixWorld(); scene.updateMatrixWorld(); ray.setFromCamera(pointer, camera);
    const hit = ray.intersectObjects([...surfaces, ...targets.map(t => t.group)], false).find(hit => visible(hit.object) && (!targets.some(t => t.group === hit.object) || opaqueFace(hit)));
    if (!hit) return;
    const normal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
    if(normal.dot(ray.ray.direction) > 0)normal.negate();
    launch({point: hit.point, normal, target: targets.find(t => t.group === hit.object)});
  }
  canvas.addEventListener('pointerdown', event => { pointerStart = {x: event.clientX, y: event.clientY}; });
  canvas.addEventListener('click', event => {
    if(active && pointerStart && Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) < 8)aim(event.clientX, event.clientY);
  });
  function launch({point, normal, target}) {
    if (!active || paused || finishAt !== null || shots.length >= 4) return;
    const egg = new THREE.Mesh(eggGeometry, eggMat); egg.visible = false;
    egg.scale.set(.85, 1.22, .85); effects.add(egg);
    const windup = Math.max(elapsed, lastWindup + (reduced.matches ? 130 : 720)); lastWindup = windup;
    shots.push({egg, point, normal, target, windup, start: null, born: windup + (reduced.matches ? 0 : 280)});
    overlay.dataset.throw = 'windup';
  }
  function updateHand() {
    const shot = shots.find(shot => elapsed >= shot.windup && elapsed < shot.windup + 700);
    const t = shot ? (elapsed - shot.windup) / 700 : 1;
    const windup = !reduced.matches && shot && t < .4 ? Math.sin(t / .4 * Math.PI / 2) : 0;
    const follow = !reduced.matches && shot && t >= .4 ? Math.sin((t - .4) / .6 * Math.PI) : 0;
    const h = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 1.25;
    hand.position.set(h * camera.aspect * .68, -h * .82 - windup * .05 + follow * .1, -1.25 + windup * .12 - follow * .16);
    hand.rotation.set(reduced.matches ? 0 : windup * .65 - follow * 1.15, -.2, -.12 + windup * .15);
    fingers.forEach(f => { f.rotation.x = shot && t >= .4 ? -.22 : .35; });
    heldEgg.visible = !shot || elapsed < shot.born || t > .93;
    overlay.dataset.throw = shot ? (elapsed < shot.born ? 'windup' : 'release') : 'ready';
    hand.updateWorldMatrix(true, true);
  }
  function blob(radius, index) {
    const shape = new THREE.Shape();
    const n = 36;
    const points = Array.from({length: n}, (_, i) => {
      const a = i / n * Math.PI * 2;
      const r = radius * (1 + Math.sin(i * 2.3 + index) * .18 + Math.cos(i * .7) * .12);
      return new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r * .78);
    });
    shape.moveTo(points[0].x, points[0].y);
    shape.splineThru([...points.slice(1), points[0]]); shape.closePath();
    return new THREE.ShapeGeometry(shape, 24);
  }
  function disposeStain(stain) {
    effects.remove(stain.group);
    stain.geometries.forEach(geometry => geometry.dispose());
  }
  function impact({point, normal, target}) {
    if (target && !target.hit) {
      target.hit = true; target.button.dataset.hit = 'true';
      target.button.setAttribute('aria-label', `Cara ${targets.indexOf(target) + 1} acertada. Lanzar otro huevo`);
      target.button.setAttribute('aria-pressed', 'true');
      const count = targets.filter(t => t.hit).length;
      onHit(count);
      if (count === 5) finishAt = elapsed + (reduced.matches ? 500 : 2000);
    }
    const group = new THREE.Group(); group.position.copy(point).addScaledVector(normal, .025 + (serial++ % 40) * .001);
    let up = new THREE.Vector3(0, 1, 0).addScaledVector(normal, -normal.y);
    if(up.lengthSq() < .01)up.set(0, 0, 1);
    up.normalize();const right=new THREE.Vector3().crossVectors(up, normal).normalize();
    group.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(right,up,normal));
    effects.add(group);
    const geometry = blob(.49, serial), white = new THREE.Mesh(geometry, whiteMat);
    group.add(white);
    const yolk = new THREE.Mesh(dropGeometry, yolkMat); yolk.scale.set(.22, .19, .075); yolk.position.set(.025, -.025, .035); group.add(yolk);
    const drips = [];
    for (let i = 0; i < 6; i++) {
      const yellow = i === 2 || i === 3;
      const drip = new THREE.Mesh(new THREE.CapsuleGeometry(.018 + random() * .02, 1, 4, 8), yellow ? yolkMat : whiteMat);
      const x = (i - 2.5) * .12 + random() * .035;
      drip.position.set(x, -.1, yellow ? .035 : .012); group.add(drip);
      const bead = new THREE.Mesh(dropGeometry, yellow ? yolkMat : whiteMat);
      bead.scale.set(yellow ? .045 : .035, .065, .025); group.add(bead);
      drips.push({drip, bead, x, length: .45 + random() * 1.25});
    }
    const droplets = [];
    for (let i = 0; i < 14; i++) {
      const a = random() * Math.PI * 2, distance = .3 + random() * .4;
      const drop = new THREE.Mesh(dropGeometry, i % 4 ? whiteMat : yolkMat);
      drop.position.set(Math.cos(a) * distance, Math.sin(a) * distance * .8, .018);
      drop.scale.set(.025 + random() * .04, .04 + random() * .06, .015); group.add(drop);
      droplets.push(drop);
    }
    const shards = [];
    for (let i = 0; i < 5; i++) {
      const shellGeometry = new THREE.BufferGeometry();
      shellGeometry.setAttribute('position', new THREE.Float32BufferAttribute([-.08, -.04, 0, .08, -.03, 0, .03, .12, .025], 3));
      shellGeometry.computeVertexNormals();
      const shell = new THREE.Mesh(shellGeometry, cream); shell.position.z = .05; group.add(shell);
      shards.push({shell, geometry: shellGeometry, vx: (random() - .5) * 1.4, vy: .3 + random() * .8});
    }
    stains.push({group, white, yolk, drips, droplets, shards, born: elapsed, geometries: [geometry, ...drips.map(d => d.drip.geometry), ...shards.map(s => s.geometry)]});
    if (stains.length > 32) disposeStain(stains.shift());
    overlay.dataset.splats = String(stains.length);
  }
  function update(delta) {
    if (!active || paused) return;
    elapsed += delta;
    updateHand();
    shots = shots.filter(shot => {
      if(elapsed < shot.born)return true;
      if(!shot.start){shot.start=heldEgg.getWorldPosition(new THREE.Vector3());shot.egg.visible=true;}
      const t = Math.min(1, (elapsed - shot.born) / (reduced.matches ? 80 : 550));
      shot.egg.position.lerpVectors(shot.start, shot.point, t);
      if (!reduced.matches) { shot.egg.position.y += Math.sin(t * Math.PI) * .65; shot.egg.rotation.z = t * Math.PI * 3; }
      if (t < 1) return true;
      effects.remove(shot.egg); impact(shot); return false;
    });
    for (const stain of stains) {
      const age = (elapsed - stain.born) / 1000;
      const spread = reduced.matches ? 1 : Math.min(1, .15 + age * 6);
      stain.white.scale.setScalar(spread);
      stain.droplets.forEach(drop => { drop.visible = spread > .45; });
      stain.drips.forEach(({drip, bead, x, length}, i) => {
        const slide = reduced.matches ? .7 : Math.min(1, Math.max(0, (age - .12 - i * .06) / 3));
        const height = .015 + length * slide;
        drip.scale.set(1, height, .35); drip.position.y = -.1 - height / 2;
        bead.position.set(x, -.1 - height, .035);
      });
      stain.yolk.position.y = -.025 - (reduced.matches ? .1 : Math.min(.5, age * .045));
      stain.shards.forEach(({shell, vx, vy}, i) => {
        shell.visible = !reduced.matches && age < 1.1;
        if (shell.visible) { shell.position.set(vx * age, vy * age - 1.8 * age * age, .08 + Math.sin(age * 3) * .15); shell.rotation.set(age * 4, age * 3, age * (i + 2)); }
      });
    }
    if (finishAt !== null && elapsed >= finishAt) {
      finishAt = Infinity; onComplete();
    }
  }
  function resize() {
    if (!active) return;
    const {width, height} = container.getBoundingClientRect();
    const values=[camera.position.x,camera.position.y,camera.position.z,camera.quaternion.x,camera.quaternion.y,camera.quaternion.z,camera.quaternion.w,width,height];
    const key=values.map(value=>Math.round(value*1000)).join(',');
    if(key===projectionKey)return;
    projectionKey=key;
    scene.updateMatrixWorld();camera.updateMatrixWorld();
    const cameraPosition=camera.getWorldPosition(new THREE.Vector3());
    targets.forEach(target => {
      const center=target.group.position.clone().project(camera);
      const corners=[[-.575,-.69],[.575,.69]].map(([x,y])=>target.group.localToWorld(new THREE.Vector3(x,y,0)).project(camera));
      const sizeX=Math.abs(corners[1].x-corners[0].x)*width/2;
      const sizeY=Math.abs(corners[1].y-corners[0].y)*height/2;
      const direction=target.group.position.clone().sub(cameraPosition);
      ray.set(cameraPosition,direction.clone().normalize());
      const blocker=ray.intersectObjects(surfaces,false).find(hit=>visible(hit.object));
      const occluded=blocker && blocker.distance < direction.length()-.12;
      const away=center.z>1||center.z< -1||Math.abs(center.x)>1.08||Math.abs(center.y)>1.08||occluded;
      target.button.classList.toggle('egg-target-away',Boolean(away));
      Object.assign(target.button.style,{left:`${(center.x+1)*width/2}px`,top:`${(1-center.y)*height/2}px`,width:`${Math.max(44,sizeX)}px`,height:`${Math.max(44,sizeY)}px`});
    });
  }
  function stop() {
    active=false;root.visible=false;hand.visible=false;overlay.hidden=true;overlay.classList.remove('help');
    document.documentElement.classList.remove('egg-aim');
    shots.forEach(shot=>effects.remove(shot.egg));shots=[];
    stains.forEach(disposeStain);stains=[];finishAt=null;overlay.dataset.splats='0';delete overlay.dataset.throw;
  }
  function start(callbacks) {
    stop();projectionKey='';active=true;root.visible=true;hand.visible=true;elapsed=0;serial=0;lastWindup=-1000;
    onHit=callbacks.onHit;onComplete=callbacks.onComplete;
    targets.forEach((t,i)=>{t.hit=false;delete t.button.dataset.hit;t.button.setAttribute('aria-pressed','false');t.button.setAttribute('aria-label',`Lanzar a la cara ${i+1} de María`);});
    overlay.hidden=false;document.documentElement.classList.remove('cucumber-moving','cucumber-hover');document.documentElement.classList.add('egg-aim');
    resize();updateHand();
    const first=targets.find(t=>!t.button.classList.contains('egg-target-away'))||targets[0];first.button.focus({preventScroll:true});
  }
  return {start,stop,update(delta){update(delta);if(active)resize();},resize,setPaused(value){paused=value;},help(){
    const next=targets.find(t=>!t.hit);if(!next)return;
    focusTarget(next.group.position);resize();overlay.classList.add('help');next.button.focus({preventScroll:true});
  },get active(){return active;}};
}

// Keyboard/touch-accessible version when WebGL is unavailable.
export function createEggFallback({reduced, onHit, onComplete, wait, isPaused}) {
  const overlay = document.getElementById('egg-game');
  const targetsUI = overlay.querySelector('.egg-targets');
  let active = true, count = 0;
  const stains = [];
  overlay.hidden = false; overlay.classList.add('egg-fallback'); targetsUI.replaceChildren();
  document.documentElement.classList.remove('cucumber-moving', 'cucumber-hover');
  document.documentElement.classList.add('egg-aim');
  for (let i = 0; i < 5; i++) {
    const button = document.createElement('button'); button.className = 'egg-target'; button.style.backgroundImage = "url('/maria-head-cutout.png')"; button.setAttribute('aria-label', `Lanzar un huevo a la cara ${i + 1} de María`);
    button.addEventListener('click', async event => {
      if (!active || isPaused()) return;
      const stain = document.createElement('span'); stain.className = 'egg-fallback-splat'; stain.setAttribute('aria-hidden', 'true');
      const r = button.getBoundingClientRect(), box = overlay.getBoundingClientRect();
      Object.assign(stain.style, {left: `${r.left - box.left + r.width / 2}px`, top: `${r.top - box.top + r.height / 2}px`});
      overlay.append(stain); stains.push(stain);
      if (stains.length > 32) stains.shift().remove();
      if (button.dataset.hit) return;
      button.dataset.hit = 'true'; button.setAttribute('aria-pressed', 'true'); count++; onHit(count);
      if (count === 5) { await wait(reduced.matches ? 500 : 2000); if (active) onComplete(); }
    });
    targetsUI.append(button);
  }
  targetsUI.firstElementChild.focus({preventScroll: true});
  return {stop() {active = false; overlay.hidden = true; overlay.classList.remove('egg-fallback', 'help'); targetsUI.replaceChildren(); stains.forEach(s => s.remove()); document.documentElement.classList.remove('egg-aim');}, help() {overlay.classList.add('help'); targetsUI.querySelector(':not([data-hit])')?.focus();}};
}

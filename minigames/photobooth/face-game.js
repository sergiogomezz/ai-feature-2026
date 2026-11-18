import './face-game.css';
import {createHandDetector} from './hand-gesture.js';
import {createTongueDetector} from './tongue-detector.js';
import {rounds,measurements,gestureStrength} from './face-gestures.js';

export function createFaceGame({container=document.body,onComplete=()=>{},onClose=()=>{},soundEnabled=()=>true}={}){
  const root=document.createElement('section');root.className='face-game';root.hidden=true;root.setAttribute('aria-label','El fotomatón de María');
  root.innerHTML=`<header class="face-top"><span class="face-counter">1 / 5</span><button class="face-close" aria-label="Cerrar cámara">×</button></header>
  <div class="face-camera"><div class="face-view"><video autoplay muted playsinline></video><span class="face-flash"></span><div class="face-welcome"><button class="face-start">Encender cámara</button></div></div>
  <div class="face-prompt"><h2></h2><p class="face-hint" role="status" aria-live="polite"></p></div>
  <div class="face-meter" role="progressbar" aria-label="Mantén el gesto" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div></div>
  <div class="face-strip" aria-label="Fotos de esta partida"></div>
  <footer class="face-tools"><button class="face-easy" aria-pressed="false">Más fácil</button><button class="face-retry" hidden>Recalibrar</button><button class="face-skip">Continuar sin cámara</button></footer>
  <div class="face-done" hidden><button class="face-finish">Volver al árbol ↗</button><button class="face-again">Repetir</button></div>`;
  container.append(root);
  const $=s=>root.querySelector(s),video=$('video'),start=$('.face-start');
  let active=false,paused=false,stream=null,detector=null,modelPromise=null,generation=0,raf=0,last=0,videoTime=-1,round=0,hold=0,cooldown=0,calibration=[],baseline=null,easy=false,audioContext;
  const tongueDetector=createTongueDetector(),handDetector=createHandDetector();
  let processing=false,tongueArmed=false,negativeTime=0;
  const holdDuration=()=>easy?1.5:2.2;
  const say=text=>$('.face-hint').textContent=text;
  function loadModel(){
    if(!modelPromise)modelPromise=import('@mediapipe/tasks-vision').then(async({FaceLandmarker,FilesetResolver})=>{
      const files=await FilesetResolver.forVisionTasks('/vision/wasm');
      const options={baseOptions:{modelAssetPath:'/vision/face_landmarker.task',delegate:'GPU'},runningMode:'VIDEO',numFaces:2,outputFaceBlendshapes:true};
      try{return await FaceLandmarker.createFromOptions(files,options);}catch{return FaceLandmarker.createFromOptions(files,{...options,baseOptions:{...options.baseOptions,delegate:'CPU'}});}
    }).catch(e=>{modelPromise=null;throw e;});
    return modelPromise;
  }
  function release(){cancelAnimationFrame(raf);stream?.getTracks().forEach(t=>t.stop());stream=null;video.srcObject=null;}
  function progress(value){const n=Math.round(Math.max(0,Math.min(1,value))*100);$('.face-meter span').style.width=`${n}%`;$('.face-meter').setAttribute('aria-valuenow',n);}
  function prompt(){const r=rounds[round];$('.face-prompt h2').textContent=r.title;$('.face-counter').textContent=`${round+1} / 5`;say(r.hint);return r;}
  function shutter(){
    if(!soundEnabled())return;
    try{audioContext??=new AudioContext();const o=audioContext.createOscillator(),g=audioContext.createGain();o.type='triangle';o.frequency.setValueAtTime(1700,audioContext.currentTime);o.frequency.exponentialRampToValueAtTime(180,audioContext.currentTime+.1);g.gain.setValueAtTime(.08,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.12);o.connect(g).connect(audioContext.destination);o.start();o.stop(audioContext.currentTime+.13);}catch{}
  }
  function capture(){
    const photo=document.createElement('canvas');photo.width=240;photo.height=180;photo.setAttribute('aria-label',rounds[round].title);photo.setAttribute('role','img');const ctx=photo.getContext('2d');ctx.translate(240,0);ctx.scale(-1,1);const crop=Math.min(video.videoWidth/4,video.videoHeight/3);ctx.drawImage(video,(video.videoWidth-crop*4)/2,(video.videoHeight-crop*3)/2,crop*4,crop*3,0,0,240,180);$('.face-strip').append(photo);shutter();root.classList.remove('face-snap');void root.offsetWidth;root.classList.add('face-snap');round++;hold=0;cooldown=1;progress(0);
    if(round===rounds.length){release();$('.face-done').hidden=false;$('.face-tools').hidden=true;$('.face-prompt h2').textContent='';say('');$('.face-counter').textContent='5 / 5';$('.face-finish').focus();root.dataset.state='done';}else prompt();
  }
  async function frame(now){
    if(!active||!stream)return;
    raf=requestAnimationFrame(frame);
    if(paused||document.hidden){last=0;hold=0;progress(0);return;}
    if(processing||video.readyState<2||video.currentTime===videoTime||now-last<65)return;
    const dt=last?Math.min(.35,(now-last)/1000):0;last=now;videoTime=video.currentTime;
    const token=generation,currentRound=round;processing=true;
    try{
      const result=detector.detectForVideo(video,now),v=measurements(result);
      if(!v){hold=0;progress(0);if(!baseline)calibration=[];say(result.faceLandmarks?.length>1?'Solo una cara en el encuadre.':'Pon la cara dentro del visor.');return;}
      if(!baseline){
        calibration.push(v);say('Preparando…');progress(calibration.length/24);
        if(calibration.length>=24){baseline=Object.fromEntries(Object.keys(v).map(k=>[k,calibration.reduce((sum,x)=>sum+x[k],0)/calibration.length]));root.dataset.state='playing';hold=0;progress(0);prompt();}return;
      }
      if(cooldown>0){cooldown-=dt;return;}
      const r=rounds[round];
      if(r.key==='tongue'){
        v.tongue=await tongueDetector.score(video,result.faceLandmarks[0]);
        if(token!==generation||currentRound!==round||paused||document.hidden)return;
        if(!tongueArmed){
          negativeTime=v.tongue<.3?negativeTime+dt:0;
          if(negativeTime>=.4)tongueArmed=true;
          say('Primero guarda la lengua.');hold=0;progress(0);return;
        }
      }
      if(r.key==='forehead')v.forehead=handDetector.score(video,result.faceLandmarks[0],now);
      const strength=gestureStrength(v,baseline,r,easy);
      if(strength>=1){hold+=dt;say(`${Math.max(0,holdDuration()-hold).toFixed(1)} s`);}else{hold=0;say(rounds[round].hint);}
      progress(hold/holdDuration());if(hold>=holdDuration())capture();
    }catch(e){if(token!==generation)return;release();root.dataset.state='error';$('.face-welcome').hidden=false;start.disabled=false;start.textContent='Volver a intentar';say('La cámara se ha interrumpido. Vuelve a intentarlo.');console.error(e);}
    finally{processing=false;}
  }
  async function begin(){
    if(paused||!active)return;const token=++generation;release();baseline=null;calibration=[];hold=0;last=0;videoTime=-1;
    start.disabled=true;start.textContent='Preparando cámara…';root.dataset.state='loading';
    try{
      if(!navigator.mediaDevices?.getUserMedia)throw new Error('insecure');
      const media=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:640},height:{ideal:480}},audio:false});
      if(token!==generation||!active){media.getTracks().forEach(t=>t.stop());return;}stream=media;video.srcObject=media;await video.play();
      const models=await Promise.all([loadModel(),tongueDetector.load(),handDetector.load()]);detector=models[0];if(token!==generation||!active)return;
      $('.face-welcome').hidden=true;$('.face-retry').hidden=false;$('.face-prompt h2').textContent='';say('Preparando…');root.dataset.state='calibrating';raf=requestAnimationFrame(frame);
    }catch(e){if(token!==generation||!active)return;release();root.dataset.state='error';say(e.name==='NotAllowedError'?'Permite la cámara en el navegador y vuelve a intentarlo.':e.name==='NotFoundError'?'No encuentro una cámara conectada.':e.name==='NotReadableError'?'La cámara está ocupada. Cierra la otra aplicación.':e.message==='insecure'?'Abre esta página con HTTPS o desde localhost.':'No se pudo iniciar la cámara. Vuelve a intentarlo.');}
    finally{if(token===generation){start.disabled=false;start.textContent='Encender cámara';}}
  }
  function startGame(){generation++;release();active=true;paused=false;round=0;hold=0;cooldown=0;baseline=null;calibration=[];easy=false;tongueArmed=false;negativeTime=0;root.hidden=false;root.dataset.state='ready';root.classList.remove('face-snap');$('.face-strip').replaceChildren();$('.face-welcome').hidden=false;$('.face-done').hidden=true;$('.face-tools').hidden=false;$('.face-retry').hidden=true;$('.face-easy').setAttribute('aria-pressed','false');$('.face-prompt h2').textContent='';$('.face-counter').textContent='1 / 5';say('');start.disabled=false;start.textContent='Encender cámara';progress(0);start.focus();}
  function stop(){generation++;active=false;release();root.hidden=true;$('.face-strip').replaceChildren();}
  start.addEventListener('click',begin);
  $('.face-close').addEventListener('click',()=>{stop();onClose();});
  $('.face-easy').addEventListener('click',()=>{easy=!easy;$('.face-easy').setAttribute('aria-pressed',String(easy));});
  $('.face-retry').addEventListener('click',()=>{baseline=null;calibration=[];hold=0;tongueArmed=false;negativeTime=0;progress(0);});
  $('.face-skip').addEventListener('click',()=>{stop();onComplete();});
  $('.face-finish').addEventListener('click',()=>{stop();onComplete();});
  $('.face-again').addEventListener('click',startGame);
  window.addEventListener('pagehide',stop);
  document.addEventListener('visibilitychange',()=>{last=0;hold=0;if(!baseline)calibration=[];stream?.getVideoTracks().forEach(t=>t.enabled=!document.hidden&&!paused);});
  return {start:startGame,stop,setPaused(value){paused=value;last=0;hold=0;progress(0);stream?.getVideoTracks().forEach(t=>t.enabled=!value&&!document.hidden);},get active(){return active;}};
}

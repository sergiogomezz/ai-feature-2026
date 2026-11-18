import { createFaceGame } from './minigames/photobooth/face-game.js';
import { setCursorSoundGate, syncCursorSound, stopCursorSound } from './cursor.js';
import { animateLandingLetter } from './landing-motion.js';
import { getPlaybackRate, setPlaybackRate } from './playback.js';
const $ = (id) => document.getElementById(id);
let phase = 'envelope';
let found = 0;
let fallbackEggGame;
let fallbackFinale;
let fallbackPepperGame;
let faceGame;
let endingSpeaking=false;
let world;
let opening = 0;
let music;
let soundEnabled = true;
let paused = false;
const landingAudio = new Audio('/audio/tienes-un-mensajeee.mp3');
landingAudio.preload = 'auto';
animateLandingLetter(landingAudio, $('envelope'));
let landingAudioEnded = false;
const isLetterLanding = () => ['envelope','envelope-opening','card'].includes(phase) && !$('christmas-envelope').hidden;
function syncLandingAudio() {
  const allowed = () => soundEnabled && !paused && !document.hidden && isLetterLanding() && !landingAudioEnded;
  if (!allowed()) { landingAudio.pause(); return; }
  landingAudio.play().then(() => { if (!allowed()) landingAudio.pause(); }).catch(() => {});
}
landingAudio.addEventListener('ended', () => { landingAudioEnded = true; });
$('sound').setAttribute('aria-pressed', 'true');
$('sound').setAttribute('aria-label', 'Silenciar sonido');
$('sound').title = 'Silenciar sonido';
syncLandingAudio();
// Retry blocked autoplay directly in a user gesture, unless it is the mute button.
document.addEventListener('pointerdown', event => {
  if (!event.target.closest('#sound')) syncLandingAudio();
}, {capture: true});
document.addEventListener('keydown', event => {
  if (!event.target.closest('#sound') && ['Enter',' '].includes(event.key)) syncLandingAudio();
}, {capture: true});
document.addEventListener('visibilitychange', syncLandingAudio);
const clickSound = new Audio('/audio/dry-fart.mp3');
clickSound.preload = 'auto';
const impactSounds = Array.from({length:4}, () => {
  const audio=new Audio('/audio/cartoonsplash.mp3');audio.preload='auto';return audio;
});
function stopImpactSounds() { impactSounds.forEach(audio => { audio.pause(); audio.currentTime=0; }); }
function eggImpact() {
  if (!soundEnabled || paused || document.hidden || phase!=='searching') return;
  const audio=impactSounds.find(audio=>audio.paused)||impactSounds[0];
  audio.currentTime=0;audio.play().catch(()=>{});
}
function stopClickSound() {
  stopCursorSound();
  stopImpactSounds();
  clickSound.pause();
  clickSound.currentTime = 0;
}
const canPlayClickSound = () => soundEnabled && !document.hidden &&
  !['searching','window','window-ready','flying','camera-playing','travelling','reveal'].includes(phase);
setCursorSoundGate(() => canPlayClickSound() && !paused);
const audibleClicks = new WeakSet();
document.addEventListener('click', event => {
  if (canPlayClickSound()) audibleClicks.add(event);
}, {capture: true});
document.addEventListener('click', event => {
  // Check both sides of the action: starting a game/finale or resetting it stays silent.
  if (!audibleClicks.has(event) || !canPlayClickSound()) return;
  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});
});
document.addEventListener('visibilitychange', () => { if (document.hidden) stopClickSound(); });
const waits = new Set();
let pausedTransitions = [];
// Keep sequence waits on the same pause clock as the visible animation.
function wait(duration) {
  return new Promise(resolve => {
    const entry = {remaining: duration, start: 0, timer: null};
    entry.run = () => {
      entry.start = performance.now();
      entry.timer = setTimeout(() => { waits.delete(entry); resolve(); }, entry.remaining / getPlaybackRate());
    };
    waits.add(entry);
    if (!paused) entry.run();
  });
}
function setPaused(value) {
  if (paused === value) return;
  paused = value;
  $('window-jump').disabled=value;
  if (paused) stopImpactSounds();
  syncCursorSound();
  syncLandingAudio();
  if (paused) {
    for (const entry of waits) {
      clearTimeout(entry.timer);
      entry.remaining = Math.max(0, entry.remaining - (performance.now() - entry.start) * getPlaybackRate());
    }
    pausedTransitions = document.getAnimations().filter(animation => animation.playState === 'running');
    pausedTransitions.forEach(animation => animation.pause());
  } else {
    pausedTransitions.forEach(animation => { if (animation.playState === 'paused') animation.play(); });
    pausedTransitions = [];
    waits.forEach(entry => entry.run());
  }
  document.documentElement.classList.toggle('animations-paused', paused);
  faceGame?.setPaused(paused);world?.setPaused(paused);fallbackFinale?.setPaused(paused);fallbackPepperGame?.setPaused(paused);
  $('pause').setAttribute('aria-pressed', String(paused));
  $('pause').setAttribute('aria-label', paused ? 'Reanudar animaciones' : 'Pausar animaciones');
  $('pause').title = paused ? 'Reanudar animaciones' : 'Pausar animaciones';
}
$('pause').addEventListener('click', () => setPaused(!paused));
// Review speed is available in the local development toolbar.
if(import.meta.env.DEV){
  const speedButton=$('speed');speedButton.hidden=false;
  const syncAnimations=()=>document.getAnimations().forEach(animation=>{
    if(animation.playbackRate!==getPlaybackRate())animation.updatePlaybackRate(getPlaybackRate());
  });
  speedButton.addEventListener('click',()=>{
    if(!paused)for(const entry of waits){
      clearTimeout(entry.timer);
      entry.remaining=Math.max(0,entry.remaining-(performance.now()-entry.start)*getPlaybackRate());
    }
    setPlaybackRate(getPlaybackRate()===1?2:1);
    if(!paused)waits.forEach(entry=>entry.run());
    syncAnimations();
    speedButton.textContent=`×${getPlaybackRate()}`;
    speedButton.setAttribute('aria-pressed',String(getPlaybackRate()===2));
    const label=getPlaybackRate()===2?'Volver a velocidad normal':'Acelerar a velocidad doble';
    speedButton.setAttribute('aria-label',label);speedButton.title=label;
  });
  let syncFrame;
  // Catch CSS animations created later (envelope, clouds, tickets) without restarting them.
  new MutationObserver(()=>{
    cancelAnimationFrame(syncFrame);syncFrame=requestAnimationFrame(syncAnimations);
  }).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden']});
}
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
function chime(notes) { music?.chime(notes); }
async function openGift() {
  if(paused || world?.busy || ['envelope','envelope-opening','card','arrival','window','window-ready','flying','camera-playing','travelling','reveal'].includes(phase))return;
  if (phase === 'opening' || phase === 'searching') return;
  if (phase === 'complete') { $('tree-globe').focus({preventScroll:true}); return; }
  if (phase !== 'wrapped') { $('letter').showModal(); return; }
  phase = 'opening'; $('parcel').disabled = true;
  chime();
  const request = ++opening;
  const completed = world ? await world.open() : true;
  if(request !== opening)return;
  if(!completed){phase = 'wrapped'; $('parcel').disabled = false; return;}
  phase = 'opened'; $('letter').showModal();
  $('parcel').disabled = false;
}
$('parcel').addEventListener('click', openGift);
$('fallback-parcel').addEventListener('click', openGift);
$('letter').addEventListener('close', () => world?.returnToRoom());
$('close-letter').addEventListener('click', () => $('letter').close());
function stopEggGame() {
  stopImpactSounds();
  world?.stopEggGame(); fallbackEggGame?.stop(); fallbackEggGame = undefined;
}
function eggHit(count) {
  if (phase !== 'searching') return;
  found = count;
  $('progress').textContent = `🥚 ${found} / 5`;
}
async function eggComplete() {
  if (phase !== 'searching') return;
  stopImpactSounds();phase='window';$('hint').hidden=true;$('parcel').hidden=true;
  $('chapter').textContent='03 / POR LA VENTANA';
  $('instruction').textContent='Pulsa la ventana para saltar.';$('progress').textContent='';
  const request=++opening;
  fallbackEggGame?.settle();
  const opened=world ? await world.prepareWindow() : await wait(reduced.matches?0:1100).then(()=>true);
  if(request!==opening||phase!=='window'||!opened)return;
  phase='window-ready';$('window-jump').hidden=false;$('window-jump').disabled=paused;
  if(!world)$('window-jump').classList.add('window-fallback');
  $('window-jump').focus({preventScroll:true});
}
async function jumpThroughWindow(){
  if(paused||phase!=='window-ready')return;
  phase='window';$('window-jump').hidden=true;
  const request=++opening;
  if(!world)stopEggGame();
  const completed=world ? await world.fall() : await wait(reduced.matches?0:700).then(()=>true);
  if(request!==opening||phase!=='window'||!completed)return;
  phase='flying';$('instruction').textContent='Pasa por seis aros con el pimiento volador.';$('chapter').textContent='04 / UN PIMIENTO CON ALAS';
  const callbacks={onComplete:pepperComplete,onScore:count=>chime([520+count*70])};
  if(world)world.startPepperGame(callbacks);
  else {
    const {createPepperGame}=await import('./pepper-game.js');
    if(request!==opening||phase!=='flying')return;
    if(!fallbackPepperGame)fallbackPepperGame=createPepperGame({container:$('world'),reduced,...callbacks});
    fallbackPepperGame.start();fallbackPepperGame.setPaused(paused);
  }
}
$('window-jump').addEventListener('click',jumpThroughWindow);
function pepperComplete(){
  if(phase!=='flying')return;
  world?.stopPepperGame();fallbackPepperGame?.stop();showCameraPackage();
}
function cameraComplete(){
  phase='complete';world?.hideCameraPackage();$('camera-package').hidden=true;
  $('chapter').textContent='05 / UNA BOLA DIFERENTE';
  $('instruction').textContent='Una nueva bola brilla en el árbol.';
  $('progress').textContent='';revealTreeGlobe();$('tree-globe').focus({preventScroll:true});
}
const cameraButton=document.createElement('button');cameraButton.id='camera-package';cameraButton.className='face-package-button';cameraButton.hidden=true;cameraButton.textContent='↗';cameraButton.setAttribute('aria-label','Abrir el paquete de la cámara');$('world').append(cameraButton);
function showCameraPackage(){phase='camera-package';cameraButton.textContent='↗';$('instruction').textContent='Hay otro paquete junto al árbol.';$('progress').textContent='';cameraButton.hidden=false;cameraButton.setAttribute('aria-label','Abrir el paquete de la cámara');if(world)world.revealCameraPackage();else Object.assign(cameraButton.style,{left:'30%',top:'70%'});cameraButton.focus({preventScroll:true});}
function openCameraPackage(){
  if(paused)return;
  if(phase==='camera-package'){world?.openCameraPackage();phase='camera-ready';cameraButton.setAttribute('aria-label','Entrar en la cámara de fotos');cameraButton.textContent='◎';return;}
  if(phase!=='camera-ready')return;
  phase='camera-playing';cameraButton.hidden=true;
  faceGame??=createFaceGame({onComplete:cameraComplete,onClose:()=>{phase='camera-ready';cameraButton.hidden=false;cameraButton.focus();},soundEnabled:()=>soundEnabled});
  faceGame.start();
}
cameraButton.addEventListener('click',openCameraPackage);
$('search').addEventListener('click', async () => {
  stopClickSound();
  $('letter').close(); world?.returnToRoom();
  phase = 'searching'; $('parcel').hidden = true;
  $('hint').hidden = false; $('chapter').textContent = '02 / A HUEVAZO LIMPIO';
  $('instruction').textContent = 'Busca las cinco caras por la habitación. Arrastra para mirar y pulsa para lanzar.';
  $('progress').textContent = '🥚 0 / 5';
  if (world) world.startEggGame({onHit: eggHit, onImpact: eggImpact, onComplete: eggComplete});
  else {
    const {createEggFallback} = await import('./egg-game.js');
    if (phase !== 'searching') return;
    fallbackEggGame = createEggFallback({reduced, onHit: eggHit, onImpact: eggImpact, onComplete: eggComplete, wait, isPaused: () => paused});
  }
});
$('hint').addEventListener('click', () => { world?.helpEggGame(); fallbackEggGame?.help(); });
function onSpeaking(value){endingSpeaking=value;music?.setDucked(value);}
function onReveal(){if(phase==='travelling')phase='reveal';}
function revealTreeGlobe(){
  $('tree-globe').hidden=false;
  if(world)world.revealGlobe();
  else $('tree-globe').classList.add('globe-fallback');
}
async function startFinale(){
  if(paused||phase!=='complete')return;
  stopClickSound();
  $('tree-globe').hidden=true;phase='travelling';$('parcel').hidden=true;  $('progress').textContent='';
  const callbacks={onReveal,onSpeaking,soundEnabled:()=>soundEnabled};
  if(world)world.startFinale(callbacks);
  else{
    const {createFinale}=await import('./finale.js');
    if(phase!=='travelling')return;
    if(!fallbackFinale)fallbackFinale=createFinale({container:$('world'),reduced,...callbacks});
    fallbackFinale.setPaused(paused);fallbackFinale.start();
  }
}
$('tree-globe').addEventListener('click',startFinale);
$('reset').addEventListener('click', () => {
  setPaused(false);
  faceGame?.stop();cameraButton.hidden=true;
  opening++; phase = 'wrapped'; found = 0;
  $('window-jump').hidden=true;
  $('letter').close();$('tree-globe').hidden=true;$('tree-globe').classList.remove('globe-fallback'); fallbackFinale?.stop();fallbackPepperGame?.stop();world?.reset();
  stopEggGame();
  $('parcel').disabled = false; $('parcel').hidden = false;
  $('hint').hidden = true; $('instruction').textContent = 'Hay un regalo que no puede quedarse quieto.';
  $('progress').textContent = ''; $('chapter').textContent = '01 / UN REGALO DIFERENTE';
  $('parcel').focus({preventScroll:true});
});
$('sound').addEventListener('click', async () => {
  const button = $('sound');
  button.disabled = true;
  soundEnabled = !soundEnabled;
  syncCursorSound();
  syncLandingAudio();
  if (!soundEnabled) stopClickSound();
  try {
    if (!music) { const { createMusic } = await import('./music.js'); music = createMusic(); music.setDucked(endingSpeaking); }
    await music.setEnabled(soundEnabled);
    world?.setFinaleSound(soundEnabled);fallbackFinale?.setSound(soundEnabled);
    button.setAttribute('aria-pressed', String(soundEnabled));
    button.setAttribute('aria-label', soundEnabled ? 'Silenciar sonido' : 'Activar sonido');
    button.title = soundEnabled ? 'Silenciar sonido' : 'Activar sonido';
  } catch {
    soundEnabled = false;world?.setFinaleSound(false);fallbackFinale?.setSound(false);
    syncLandingAudio();stopClickSound();
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', 'No se pudo activar el sonido. Reintentar');
    button.title = 'No se pudo activar el sonido. Reintentar';
  } finally { button.disabled = false; }
});
// The 3D scene is optional; controls and gameplay stay in the DOM.
const worldReady = import('./world.js').then(({createWorld}) => {
  world = createWorld($('world'), {onGift: openGift, onGlobe:startFinale, onCamera:openCameraPackage, isWrapped: () => phase === 'wrapped', canOpenGift: () => ['wrapped','opened'].includes(phase), reduced});
  world.setPaused(paused);
  $('fallback').hidden = true;
  if (['opened','searching','complete'].includes(phase)) world.open(true);
}).catch(error => { console.warn('Escena no disponible; se usa la ilustración básica.', error); });

$('open-envelope').addEventListener('click', async () => {
  if(paused || phase!=='envelope')return;
  phase='envelope-opening';
  $('open-envelope').disabled=true;
  $('open-envelope').hidden=true;
  const envelope=$('envelope');
  envelope.classList.add('opening','flap-open');
  // Finish opening the flap before the card starts moving.
  await wait(reduced.matches?0:1600);
  envelope.classList.add('card-out');
  await wait(reduced.matches?0:1900);
  phase='card';
  envelope.classList.add('card-ready');
  $('envelope-card').disabled=false;
  $('envelope-card').focus({preventScroll:true});
});
$('envelope-card').addEventListener('click', async () => {
  if(paused || phase!=='card')return;
  phase='arrival';$('envelope-card').disabled=true;
  syncLandingAudio();
  await Promise.all([worldReady,wait(0)]);
  $('christmas-envelope').classList.add('leaving');
  await wait(reduced.matches?0:1200);
  $('christmas-envelope').hidden=true;
  document.querySelector('main').inert=false;
  $('sound').focus({preventScroll:true});
  try {await world?.playArrival();}
  finally {phase='wrapped';$('reset').disabled=false;$('parcel').focus({preventScroll:true});}
});

// Local review shortcut. Vite removes this branch from the production build.
if(import.meta.env.DEV && ['finale','eggs','pepper','camera'].includes(new URLSearchParams(location.search).get('preview'))) {
  worldReady.then(()=>{
    $('christmas-envelope').hidden=true;document.querySelector('main').inert=false;
    syncLandingAudio();
    world?.finishArrival();$('reset').disabled=false;$('parcel').hidden=true;
    const preview=new URLSearchParams(location.search).get('preview');
    if(preview==='camera'){showCameraPackage();}
    else if(preview==='finale'){phase='complete';revealTreeGlobe();}
    else if(preview==='eggs'){phase='opened';$('search').click();}
    else {phase='searching';eggComplete();}
  });
}

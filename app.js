import './cursor.js';
const $ = (id) => document.getElementById(id);
let phase = 'envelope';
let found = 0;
let fallbackEggGame;
let fallbackFinale;
let endingSpeaking=false;
let world;
let opening = 0;
let music;
let soundEnabled = false;
let paused = false;
const waits = new Set();
let pausedTransitions = [];
// Keep sequence waits on the same pause clock as the visible animation.
function wait(duration) {
  return new Promise(resolve => {
    const entry = {remaining: duration, start: 0, timer: null};
    entry.run = () => {
      entry.start = performance.now();
      entry.timer = setTimeout(() => { waits.delete(entry); resolve(); }, entry.remaining);
    };
    waits.add(entry);
    if (!paused) entry.run();
  });
}
function setPaused(value) {
  if (paused === value) return;
  paused = value;
  if (paused) {
    for (const entry of waits) {
      clearTimeout(entry.timer);
      entry.remaining = Math.max(0, entry.remaining - (performance.now() - entry.start));
    }
    pausedTransitions = document.getAnimations().filter(animation => animation.playState === 'running');
    pausedTransitions.forEach(animation => animation.pause());
  } else {
    pausedTransitions.forEach(animation => { if (animation.playState === 'paused') animation.play(); });
    pausedTransitions = [];
    waits.forEach(entry => entry.run());
  }
  document.documentElement.classList.toggle('animations-paused', paused);
  world?.setPaused(paused);fallbackFinale?.setPaused(paused);
  $('pause').setAttribute('aria-pressed', String(paused));
  $('pause').setAttribute('aria-label', paused ? 'Reanudar animaciones' : 'Pausar animaciones');
  $('pause').title = paused ? 'Reanudar animaciones' : 'Pausar animaciones';
}
$('pause').addEventListener('click', () => setPaused(!paused));
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
function chime(notes) { music?.chime(notes); }
async function openGift() {
  if(paused || world?.busy || ['envelope','envelope-opening','card','arrival','travelling','reveal'].includes(phase))return;
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
  $('window-entry').disabled = false;
  world?.stopEggGame(); fallbackEggGame?.stop(); fallbackEggGame = undefined;
}
function eggHit(count) {
  if (phase !== 'searching') return;
  found = count;
  chime([440 + count * 90]);
  $('progress').textContent = `🥚 ${found} / 5`;
}
function eggComplete() {
  if (phase !== 'searching') return;
  stopEggGame(); phase = 'complete'; $('hint').hidden = true;
  $('chapter').textContent = '03 / UNA BOLA DIFERENTE';
  $('instruction').textContent = 'Una nueva bola brilla en el árbol.';
  $('progress').textContent='';$('parcel').hidden=true;revealTreeGlobe();
}
$('search').addEventListener('click', async () => {
  $('letter').close(); world?.returnToRoom();
  phase = 'searching'; $('parcel').hidden = true; $('window-entry').disabled = true;
  $('hint').hidden = false; $('chapter').textContent = '02 / A HUEVAZO LIMPIO';
  $('instruction').textContent = 'Busca las cinco caras por la habitación. Arrastra para mirar y pulsa para lanzar.';
  $('progress').textContent = '🥚 0 / 5';
  if (world) world.startEggGame({onHit: eggHit, onComplete: eggComplete});
  else {
    const {createEggFallback} = await import('./egg-game.js');
    if (phase !== 'searching') return;
    fallbackEggGame = createEggFallback({reduced, onHit: eggHit, onComplete: eggComplete, wait, isPaused: () => paused});
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
  $('tree-globe').hidden=true;phase='travelling';$('parcel').hidden=true;$('window-entry').disabled=true;
  $('progress').textContent='';
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
  opening++; phase = 'wrapped'; found = 0;
  $('letter').close();$('tree-globe').hidden=true;$('tree-globe').classList.remove('globe-fallback'); fallbackFinale?.stop();world?.reset();
  stopEggGame();
  $('parcel').disabled = false; $('parcel').hidden = false;
  $('hint').hidden = true; $('instruction').textContent = 'Hay un regalo que no puede quedarse quieto.';
  $('progress').textContent = ''; $('chapter').textContent = '01 / UN REGALO DIFERENTE';
  $('parcel').focus({preventScroll:true});
});
$('sound').addEventListener('click', async () => {
  const button = $('sound');
  button.disabled = true;
  try {
    if (!music) { const { createMusic } = await import('./music.js'); music = createMusic(); music.setDucked(endingSpeaking); }
    soundEnabled = !soundEnabled;
    await music.setEnabled(soundEnabled);
    world?.setFinaleSound(soundEnabled);fallbackFinale?.setSound(soundEnabled);
    button.setAttribute('aria-pressed', String(soundEnabled));
    button.setAttribute('aria-label', soundEnabled ? 'Silenciar sonido' : 'Activar sonido');
    button.title = soundEnabled ? 'Silenciar sonido' : 'Activar sonido';
  } catch {
    soundEnabled = false;world?.setFinaleSound(false);fallbackFinale?.setSound(false);
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', 'No se pudo activar el sonido. Reintentar');
    button.title = 'No se pudo activar el sonido. Reintentar';
  } finally { button.disabled = false; }
});
// The 3D scene is optional; controls and gameplay stay in the DOM.
const worldReady = import('./world.js').then(({createWorld}) => {
  world = createWorld($('world'), {onGift: openGift, onGlobe:startFinale, isWrapped: () => phase === 'wrapped', canOpenGift: () => ['wrapped','opened'].includes(phase), reduced});
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
if(import.meta.env.DEV && new URLSearchParams(location.search).get('preview')==='finale') {
  worldReady.then(()=>{
    $('christmas-envelope').hidden=true;document.querySelector('main').inert=false;
    world?.finishArrival();phase='complete';$('reset').disabled=false;$('parcel').hidden=true;revealTreeGlobe();
  });
}

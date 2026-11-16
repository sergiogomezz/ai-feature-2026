import './cursor.js';
const $ = (id) => document.getElementById(id);
let phase = 'envelope';
let found = 0;
let world;
let opening = 0;
let music;
let soundEnabled = false;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
function chime(notes) { music?.chime(notes); }
async function openGift() {
  if(world?.busy || ['envelope','arrival'].includes(phase))return;
  if (phase === 'opening' || phase === 'searching') return;
  if (phase === 'complete') { $('discovery').showModal(); return; }
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
$('search').addEventListener('click', () => {
  $('letter').close();
  phase = 'searching'; $('stars').hidden = false; $('parcel').hidden = true;
  $('hint').hidden = false; $('chapter').textContent = '02 / SIGUE LA LUZ';
  $('instruction').textContent = 'Tres estrellas guardan el comienzo del viaje.';
  $('progress').textContent = `★ ${found} / 3`;
  document.querySelector('.hidden-star:not(.found)')?.focus({preventScroll:true});
});
document.querySelectorAll('.hidden-star').forEach((star) => star.addEventListener('click', () => {
  if (phase !== 'searching' || star.disabled) return;
  star.disabled = true; star.classList.add('found'); found++;
  chime([523.25 + found * 110]); $('progress').textContent = `★ ${found} / 3`;
  if (found === 3) {
    phase = 'complete'; $('hint').hidden = true; $('chapter').textContent = '03 / UNA CIUDAD NOS ESPERA';
    $('instruction').textContent = 'La primera pista ya es tuya.';
    $('discovery').showModal();
    $('parcel').hidden = false;
  } else document.querySelector('.hidden-star:not(.found)')?.focus({preventScroll:true});
}));
$('hint').addEventListener('click', () => { $('stars').classList.add('help'); $('progress').textContent = `★ ${found} / 3`; });
$('back').addEventListener('click', () => $('discovery').close());
$('reset').addEventListener('click', () => {
  opening++; phase = 'wrapped'; found = 0;
  $('letter').close(); $('discovery').close(); world?.reset();
  $('stars').hidden = true; $('stars').classList.remove('help');
  document.querySelectorAll('.hidden-star').forEach(star => { star.disabled = false; star.classList.remove('found'); });
  $('parcel').disabled = false; $('parcel').hidden = false;
  $('hint').hidden = true; $('instruction').textContent = 'Hay un regalo que no puede quedarse quieto.';
  $('progress').textContent = ''; $('chapter').textContent = '01 / UN REGALO DIFERENTE';
  $('parcel').focus({preventScroll:true});
});
$('sound').addEventListener('click', async () => {
  const button = $('sound');
  button.disabled = true;
  try {
    if (!music) { const { createMusic } = await import('./music.js'); music = createMusic(); }
    soundEnabled = !soundEnabled;
    await music.setEnabled(soundEnabled);
    button.setAttribute('aria-pressed', String(soundEnabled));
    button.setAttribute('aria-label', soundEnabled ? 'Silenciar música' : 'Activar música');
    button.title = soundEnabled ? 'Silenciar música' : 'Activar música';
  } catch {
    soundEnabled = false;
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', 'No se pudo activar la música. Reintentar');
    button.title = 'No se pudo activar la música. Reintentar';
  } finally { button.disabled = false; }
});
// The 3D scene is optional; controls and gameplay stay in the DOM.
const worldReady = import('./world.js').then(({createWorld}) => {
  world = createWorld($('world'), {onGift: openGift, isWrapped: () => phase === 'wrapped', canOpenGift: () => ['wrapped','opened','complete'].includes(phase), reduced});
  $('fallback').hidden = true;
  if (['opened','searching','complete'].includes(phase)) world.open(true);
}).catch(error => { console.warn('Escena no disponible; se usa la ilustración básica.', error); });

$('open-envelope').addEventListener('click', async () => {
  if(phase!=='envelope')return;
  phase='arrival';$('open-envelope').disabled=true;
  $('open-envelope').classList.add('opening');
  const timer=setTimeout(()=>{$('envelope-status').textContent='Preparando una llegada muy especial…';},1500);
  await Promise.all([worldReady,new Promise(resolve=>setTimeout(resolve,reduced.matches?0:1100))]);
  clearTimeout(timer);$('envelope-status').textContent='';
  document.querySelector('main').inert=false;$('reset').disabled=true;
  $('christmas-envelope').classList.add('leaving');
  await new Promise(resolve=>setTimeout(resolve,reduced.matches?0:650));
  $('christmas-envelope').hidden=true;
  $('sound').focus({preventScroll:true});
  try {await world?.playArrival();}
  finally {phase='wrapped';$('reset').disabled=false;$('parcel').focus({preventScroll:true});}
});

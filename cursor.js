// Native cursor variants also work above modal dialogs, without intercepting clicks.
const root = document.documentElement;
const fine = matchMedia('(pointer: fine)');
const scream = new Audio('/audio/screaming-goat.mp3');
scream.preload = 'auto';
scream.loop = true;
let soundAllowed = () => false;
let screaming = false;
export function stopCursorSound() {
  screaming = false;
  scream.pause();
  scream.currentTime = 0;
}
export function syncCursorSound() {
  if (!soundAllowed() || !fine.matches || document.hidden ||
      !root.classList.contains('cucumber-moving') || root.classList.contains('egg-aim')) {
    stopCursorSound();
    return;
  }
  if (screaming) return;
  screaming = true;
  scream.play().then(() => {
    if (!screaming || !soundAllowed()) stopCursorSound();
  }).catch(() => { screaming = false; });
}
export function setCursorSoundGate(gate) { soundAllowed = gate; syncCursorSound(); }
let restTimer;
let previous;
function clear() {
  stopCursorSound();
  clearTimeout(restTimer);
  root.classList.remove('cucumber-moving', 'cucumber-hover');
  previous = undefined;
}
function hover(target) {
  if(root.classList.contains('egg-aim')) { clear(); return; }
  const control = target instanceof Element && target.closest('button, a[href], [role="button"], [data-clickable="true"]');
  root.classList.toggle('cucumber-hover', Boolean(control && !control.matches(':disabled, [aria-disabled="true"]') && !control.closest('[inert]')));
}
document.addEventListener('pointermove', event => {
  if (root.classList.contains('egg-aim') || !fine.matches || event.pointerType === 'touch') { clear(); return; }
  hover(event.target);
  if (!previous || Math.hypot(event.clientX - previous.x, event.clientY - previous.y) > 0) {
    root.classList.add('cucumber-moving');
    syncCursorSound();
    clearTimeout(restTimer);
    restTimer = setTimeout(() => {
      root.classList.remove('cucumber-moving');
      stopCursorSound();
    }, 150);
  }
  previous = { x: event.clientX, y: event.clientY };
}, { passive: true });
document.addEventListener('pointerover', event => { if (fine.matches) hover(event.target); });
document.addEventListener('pointerout', event => { if (!event.relatedTarget) clear(); });
document.addEventListener('pointerup', event => { if (fine.matches) hover(event.target); });
window.addEventListener('blur', clear);
fine.addEventListener('change', clear);
document.addEventListener('visibilitychange', () => { if (document.hidden) clear(); });

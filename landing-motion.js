// The audio clock drives the flight, so pauses never separate the two.
export function animateLandingLetter(audio, envelope) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame;
  let bounds;
  const layout = () => {
    const width = envelope.offsetWidth;
    const height = envelope.offsetHeight;
    bounds = {width, height, cx: envelope.offsetLeft + width / 2, cy: envelope.offsetTop + height / 2};
  };
  function reset() {
    cancelAnimationFrame(frame);
    if (envelope.classList.contains('audio-flight')) envelope.classList.add('flight-landed');
    envelope.classList.remove('audio-flight');
    envelope.style.transform = '';
  }
  function draw() {
    if (reduced.matches || audio.ended || envelope.closest('[hidden]')) { reset(); return; }
    const time = audio.currentTime;
    const duration = Number.isFinite(audio.duration) ? audio.duration : 11.83;
    const progress = Math.min(1, time / duration);
    const ease = value => { const t = Math.max(0, Math.min(1, value)); return t * t * (3 - 2 * t); };
    const amount = ease(time / .7) * ease((duration - time) / .9);
    const scale = 1 - .2 * amount;
    // The rotating rectangle (and the raised card) stays inside the viewport.
    const radius = Math.hypot(bounds.width, bounds.height + 300) * scale / 2;
    const x = Math.max(0, Math.min(bounds.cx, innerWidth - bounds.cx) - radius - 18);
    const y = Math.max(0, Math.min(bounds.cy - 80, innerHeight - bounds.cy) - radius - 18);
    const angle = progress * Math.PI * 4;
    const drop = -(innerHeight + bounds.height) * (1 - ease(time / 3.2));
    const depth = -1000 * Math.sin(Math.PI * progress) ** 2 * (.35 + .65 * Math.sin(angle) ** 2);
    const tilt = Math.sin(angle * 1.5) * 65 * amount;
    envelope.classList.add('audio-flight');
    envelope.style.transform = `translate3d(${Math.sin(angle) * x * amount}px, ${drop - Math.sin(angle * 2) * y * amount}px, ${depth}px) rotateX(${tilt}deg) rotateY(${progress * 720}deg) rotateZ(${progress * 1080}deg) scale(${scale})`;
    if (!audio.paused) frame = requestAnimationFrame(draw);
  }
  audio.addEventListener('playing', () => { cancelAnimationFrame(frame); layout(); draw(); });
  audio.addEventListener('pause', () => { cancelAnimationFrame(frame); if (audio.ended) reset(); });
  audio.addEventListener('ended', reset);
  window.addEventListener('resize', () => { cancelAnimationFrame(frame); layout(); if (!audio.paused) draw(); });
  reduced.addEventListener('change', () => { if (reduced.matches) reset(); else if (!audio.paused) { layout(); draw(); } });
}

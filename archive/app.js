const scenes = ['intro', 'suspense', 'gift'];
function showScene(id) {
  for (const scene of scenes) document.getElementById(scene).hidden = scene !== id;
  document.getElementById('chapter').textContent = {intro: '01 — LA ILUSIÓN', suspense: '02 — LA PISTA', gift: '03 — NUESTRO PLAN'}[id];
  window.scrollTo({ top: 0, behavior: 'instant' });
  const heading = document.querySelector(`#${id} h1, #${id} h2`);
  heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: true });
}
document.getElementById('open').addEventListener('click', () => showScene('suspense'));
document.getElementById('reveal').addEventListener('click', () => showScene('gift'));
document.getElementById('restart').addEventListener('click', () => showScene('intro'));
document.getElementById('calendar').addEventListener('click', () => {
  // 20:30 in Barcelona (CEST) is 18:30 UTC. No end time: duration unconfirmed.
  const event = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Para Maria//Regalo de Reyes//ES', 'BEGIN:VEVENT', 'UID:quevedo-20270706-maria@regalo.local', 'DTSTAMP:20261115T000000Z', 'DTSTART:20270706T183000Z', 'SUMMARY:Quevedo - El Baifo Tour', 'LOCATION:Palau Sant Jordi\\, Passeig Olímpic 5\\, Barcelona', 'DESCRIPTION:Un concierto para vivirlo juntos. Llevar las entradas originales.', 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n');
  const url = URL.createObjectURL(new Blob([event], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url; link.download = 'nuestro-plan-quevedo.ics';
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
});

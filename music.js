// Original little music-box waltz, generated locally. No audio downloads.
export function createMusic() {
  const context=new (window.AudioContext||window.webkitAudioContext)();
  const master=context.createGain();master.gain.value=0;master.connect(context.destination);
  const active=new Set();
  let enabled=false, timer, step=0, next=0;
  const beat=.33;
  const melody=[76,79,83,81,79,76,74,76,79,78,74,71,72,76,79,83,81,79,78,74,71,74,76,79,81,84,83,79,76,74,72,76,79,78,74,71];
  const roots=[48,43,45,40,41,48,43,43,45,41,48,43];
  function tone(midi,start,length,volume,type='sine') {
    const osc=context.createOscillator(), gain=context.createGain();
    osc.type=type;osc.frequency.value=440*2**((midi-69)/12);
    gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(volume,start+.012);gain.gain.exponentialRampToValueAtTime(.0001,start+length);
    osc.connect(gain);gain.connect(master);active.add(osc);
    osc.onended=()=>{active.delete(osc);osc.disconnect();gain.disconnect();};
    osc.start(start);osc.stop(start+length+.02);
  }
  function schedule(){if(!enabled||document.hidden)return;while(next<context.currentTime+.15){const i=step%melody.length;tone(melody[i],next,.75,.095);tone(melody[i]+12,next,.25,.013);if(i%3===0)tone(roots[Math.floor(i/3)],next,.9,.09,'triangle');else tone(roots[Math.floor(i/3)]+(i%3===1?12:19),next,.5,.035,'triangle');step++;next+=beat;}}
  function silence(){clearInterval(timer);master.gain.cancelScheduledValues(context.currentTime);master.gain.setTargetAtTime(0,context.currentTime,.025);for(const osc of active){try{osc.stop(context.currentTime+.12);}catch{}}}
  async function setEnabled(value){enabled=value;if(!value){silence();return;}try{await context.resume();if(!enabled||document.hidden)return;master.gain.cancelScheduledValues(context.currentTime);master.gain.setTargetAtTime(.45,context.currentTime,.06);next=context.currentTime+.04;clearInterval(timer);schedule();timer=setInterval(schedule,80);}catch(error){enabled=false;silence();throw error;}}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)silence();else if(enabled)setEnabled(true).catch(()=>{});});
  function chime(notes=[523.25,659.25,783.99]){if(!enabled)return;notes.forEach((hz,i)=>tone(69+12*Math.log2(hz/440),context.currentTime+i*.1,.65,.13));}
  return {setEnabled,chime};
}

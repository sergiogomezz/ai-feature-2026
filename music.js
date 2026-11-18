// Interaction sounds only; background music is pending a new track.
export function createMusic() {
  const context=new (window.AudioContext||window.webkitAudioContext)();
  const master=context.createGain();master.gain.value=0;master.connect(context.destination);
  const active=new Set();
  let enabled=false, ducked=false;
  function tone(midi,start,length,volume,type='sine') {
    const osc=context.createOscillator(), gain=context.createGain();
    osc.type=type;osc.frequency.value=440*2**((midi-69)/12);
    gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(volume,start+.012);gain.gain.exponentialRampToValueAtTime(.0001,start+length);
    osc.connect(gain);gain.connect(master);active.add(osc);
    osc.onended=()=>{active.delete(osc);osc.disconnect();gain.disconnect();};
    osc.start(start);osc.stop(start+length+.02);
  }
  function silence(){master.gain.cancelScheduledValues(context.currentTime);master.gain.setTargetAtTime(0,context.currentTime,.025);for(const osc of active){try{osc.stop(context.currentTime+.12);}catch{}}}
  async function setEnabled(value){enabled=value;if(!value){silence();return;}try{await context.resume();if(!enabled||document.hidden)return;master.gain.cancelScheduledValues(context.currentTime);master.gain.setTargetAtTime(ducked?.06:.45,context.currentTime,.06);}catch(error){enabled=false;silence();throw error;}}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)silence();else if(enabled)setEnabled(true).catch(()=>{});});
  function chime(notes=[523.25,659.25,783.99]){if(!enabled)return;notes.forEach((hz,i)=>tone(69+12*Math.log2(hz/440),context.currentTime+i*.1,.65,.13));}
  function setDucked(value){ducked=value;master.gain.cancelScheduledValues(context.currentTime);master.gain.setTargetAtTime(enabled?(ducked?.06:.45):0,context.currentTime,.1);}
  return {setEnabled,chime,setDucked};
}

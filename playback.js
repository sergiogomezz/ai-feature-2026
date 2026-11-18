// One playback rate for review controls, animation clocks and media.
let rate=1;
const listeners=new Set();
export const getPlaybackRate=()=>rate;
export function onPlaybackRateChange(listener){listeners.add(listener);listener(rate);return ()=>listeners.delete(listener);}
export function setPlaybackRate(value){
  if(value!==1&&value!==2)return;
  rate=value;
  listeners.forEach(listener=>listener(rate));
}

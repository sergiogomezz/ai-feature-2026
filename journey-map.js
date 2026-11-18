// Fixed, north-up Mercator views share one centre and scale throughout the zoom.
const spans=Array.from({length:14},(_,index)=>8_000_000/2**index);
const clamp=value=>Math.max(0,Math.min(1,value));
const smooth=value=>{const t=clamp(value);return t*t*(3-2*t);};
export function createJourneyMap(overlay){
  const layer=document.createElement('div');layer.className='journey-map';layer.setAttribute('aria-hidden','true');
  overlay.prepend(layer);
  const images=new Map();
  function load(index){
    if(index>=spans.length||images.has(index))return;
    const image=new Image();image.decoding='async';image.alt='';image.hidden=true;
    image.onload=()=>image.decode().then(()=>{image.dataset.ready='true';}).catch(()=>{});
    image.src=`/ending/maps/barcelona-${String(index).padStart(2,'0')}.webp`;
    images.set(index,image);layer.append(image);
  }
  function reset(close=false){for(const image of images.values()){image.remove();image.src='';}images.clear();layer.style.opacity='0';load(0);load(1);if(close){load(12);load(13);}}
  function update(viewSpan,opacity){
    layer.dataset.span=String(Math.round(viewSpan));
    if(opacity===0){layer.style.opacity='0';return false;}
    const index=Math.max(0,Math.min(spans.length-1,Math.floor(Math.log2(spans[0]/(viewSpan*1.3)))));
    for(let i=index;i<=index+2;i++)load(i);
    // Keep one preceding resolution until the next one has finished decoding.
    let base=index;
    while(base>0&&!(images.get(base)?.dataset.ready==='true'))base--;
    for(const [i,image] of images){
      if(i<base-1||i>index+2){image.remove();image.src='';images.delete(i);continue;}
      const visible=(i===base||i===base+1)&&spans[i]/viewSpan<4;
      image.hidden=!visible||image.dataset.ready!=='true';
      if(!visible)continue;
      const size=spans[i]/viewSpan*Math.max(innerWidth,innerHeight);
      image.style.width=`${size}px`;image.style.height=`${size}px`;
      image.style.opacity=String(i===base?1:smooth((spans[i]/viewSpan-1.02)/.28));
      image.style.zIndex=String(i);
    }
    const ready=[...images.values()].some(image=>!image.hidden);
    layer.style.opacity=String(ready?opacity:0);
    layer.dataset.span=String(Math.round(viewSpan));layer.dataset.level=String(base);
    return ready;
  }
  reset();return {update,reset,element:layer,hide(){layer.style.opacity='0';}};
}

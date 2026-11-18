export const rounds=[
  {title:'Sonríe',hint:'Mantén la sonrisa.',icon:'☺',key:'smile',threshold:.48},
  {title:'Abre la boca',hint:'Abre la boca.',icon:'○',key:'jaw',threshold:.42},
  {title:'Levanta las cejas',hint:'Levanta las cejas.',icon:'⌃',key:'brow',threshold:.36},
  {title:'Saca la lengua',hint:'Saca bien la lengua y mantenla fuera.',icon:'😛',key:'tongue',threshold:.93},
  {title:'Mano en la frente',hint:'Pon los dedos sobre la frente, sin tapar los ojos.',key:'forehead',threshold:1}
];
export function measurements(result){
  if(result.faceLandmarks?.length!==1||!result.faceBlendshapes?.[0])return null;
  const b=Object.fromEntries(result.faceBlendshapes[0].categories.map(c=>[c.categoryName,c.score]));
  const l=result.faceLandmarks[0],left=l[234],right=l[454],nose=l[1];
  return {smile:((b.mouthSmileLeft||0)+(b.mouthSmileRight||0))/2,jaw:b.jawOpen||0,brow:Math.max(b.browInnerUp||0,((b.browOuterUpLeft||0)+(b.browOuterUpRight||0))/2),wink:Math.abs((b.eyeBlinkLeft||0)-(b.eyeBlinkRight||0)),turn:(nose.x-(left.x+right.x)/2)/Math.max(.01,Math.abs(right.x-left.x))};
}
export function gestureStrength(values,baseline,round,easy=false){
  const key=round.key,base=baseline[key]||0;
  if(key==='tongue')return (values.tongue||0)/round.threshold;
  if(key==='forehead')return values.forehead||0;
  const value=key==='turn'?Math.abs(values[key]-base):Math.max(0,values[key]-base);
  const threshold=key==='turn'?round.threshold:Math.min(round.threshold,Math.max(.13,(1-base)*.6));
  return value/(threshold*(easy?.72:1));
}

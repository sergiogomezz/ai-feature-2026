// Compare landmarks in face-local coordinates, so the test follows head tilt
// and scale. This detects overlap in the camera image, not physical contact.
export function foreheadScore(face,hands,aspect=1){
  if(!face?.[454]||!face[10]||!face[168])return 0;
  const left=face[234],right=face[454],top=face[10],brow=face[168];
  const dx=(right.x-left.x)*aspect,dy=right.y-left.y,w=Math.hypot(dx,dy);if(w<.04)return 0;
  const ux=dx/w,uy=dy/w,vx=-uy,vy=ux;
  const local=p=>{const x=(p.x-top.x)*aspect,y=p.y-top.y;return {x:(x*ux+y*uy)/w,y:(x*vx+y*vy)/w};};
  const lower=Math.max(.13,local(brow).y*.90);
  const inside=p=>p.x>-.42&&p.x<.42&&p.y>-.10&&p.y<lower;
  for(const hand of hands||[]){
    if(hand.length<21)continue;
    const palm=[0,5,9,13,17].map(i=>local(hand[i]));
    const center={x:palm.reduce((s,p)=>s+p.x,0)/5,y:palm.reduce((s,p)=>s+p.y,0)/5};
    const points=[5,6,8,9,10,12,13,14,16,17,18,20].map(i=>local(hand[i]));
    const hits=points.filter(inside).length;
    // Several fingers/knuckles must overlap the forehead; a hand beside the
    // face or down at the mouth cannot satisfy it.
    if(hits>=4&&Math.abs(center.x)<.65&&center.y>-.35&&center.y<lower+.25)return 1;
  }
  return 0;
}
export function createHandDetector(){
  let ready,model;
  return {load(){
    ready??=import('@mediapipe/tasks-vision').then(async({HandLandmarker,FilesetResolver})=>{
      const files=await FilesetResolver.forVisionTasks('/vision/wasm');
      const options={baseOptions:{modelAssetPath:'/vision/hand_landmarker.task',delegate:'GPU'},runningMode:'VIDEO',numHands:2,minHandDetectionConfidence:.65,minHandPresenceConfidence:.65,minTrackingConfidence:.65};
      try{model=await HandLandmarker.createFromOptions(files,options);}catch{model=await HandLandmarker.createFromOptions(files,{...options,baseOptions:{...options.baseOptions,delegate:'CPU'}});}
    }).catch(e=>{ready=null;throw e;});return ready;
  },score(video,face,time){return foreheadScore(face,model.detectForVideo(video,time).landmarks,video.videoWidth/video.videoHeight);}};
}

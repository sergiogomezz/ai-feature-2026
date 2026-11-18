import wasmUrl from 'onnxruntime-web/ort-wasm-simd-threaded.wasm?url';
import mjsUrl from 'onnxruntime-web/ort-wasm-simd-threaded.mjs?url';
// face-lens (snakajima), CC BY 4.0. Only the tongue classification head is
// present in the local ONNX graph. See public/vision/tongue-LICENSE.txt.
export function createTongueDetector(){
  let ready,ort,session;
  const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  async function load(){
    if(!ready)ready=(async()=>{
      ort=await import('onnxruntime-web/wasm');ort.env.wasm.wasmPaths={wasm:new URL(wasmUrl,location.href).href,mjs:new URL(mjsUrl,location.href).href};ort.env.wasm.numThreads=1;
      session=await ort.InferenceSession.create('/vision/tongue.onnx',{executionProviders:['wasm'],graphOptimizationLevel:'all'});
      if(session.outputNames.length!==1||session.outputNames[0]!=='tongue')throw new Error('Unexpected tongue model outputs');
    })().catch(e=>{ready=null;throw e;});
    return ready;
  }
  return {load,async score(source,landmarks){
    if(!landmarks)return 0;await load();
    const width=source.videoWidth||source.naturalWidth||source.width,height=source.videoHeight||source.naturalHeight||source.height;
    const xs=landmarks.map(p=>p.x),ys=landmarks.map(p=>p.y);
    const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
    const faceWidth=(maxX-minX)*width,faceHeight=(maxY-minY)*height,size=Math.max(faceWidth,faceHeight)*1.7;
    if(size<64)return 0;
    const x=(minX+maxX)/2*width-size/2,y=(minY+maxY)/2*height-faceHeight*.12-size/2,k=256/size;
    ctx.fillStyle='#000';ctx.fillRect(0,0,256,256);ctx.drawImage(source,-x*k,-y*k,width*k,height*k);
    const {data}=ctx.getImageData(0,0,256,256),n=256*256,input=new Float32Array(n*3),mean=[.485,.456,.406],std=[.229,.224,.225];
    for(let c=0;c<3;c++)for(let i=0;i<n;i++)input[c*n+i]=(data[i*4+c]/255-mean[c])/std[c];
    const tensor=new ort.Tensor('float32',input,[1,3,256,256]);
    const output=await session.run({input:tensor});const logits=output.tongue.data;
    const probability=1/(1+Math.exp(logits[0]-logits[1]));
    tensor.dispose();output.tongue.dispose();return probability;
  }};
}

import time,subprocess,os,argparse
from pathlib import Path
root=Path(__file__).resolve().parent.parent
base=root/'.local-video'
needed=[base/'models/ltx23-q4'/f for f in ['connector.safetensors','transformer-distilled-1.1.safetensors','vae_encoder.safetensors','vae_decoder.safetensors','audio_vae.safetensors','vocoder.safetensors','spatial_upscaler_x2_v1_1.safetensors']]
needed += [base/'models/gemma3-4bit'/f for f in ['model-00001-of-00002.safetensors','model-00002-of-00002.safetensors','config.json','tokenizer.json']]
parser=argparse.ArgumentParser(description='Render local del saludo con voz original, sin APIs de pago.')
parser.add_argument('--wait',action='store_true',help='Esperar mientras se descargan los modelos con el otro script.')
args=parser.parse_args()
if not args.wait and not all(p.exists() for p in needed):
 raise SystemExit('Faltan modelos. Ejecuta scripts/download-video-models.py con el Python local antes de renderizar.')
while not all(p.exists() for p in needed):time.sleep(5)
ff=base/'ltx-2-mlx/.venv/bin/ffmpeg'
source_image=base/'stage-input.png'
if not source_image.exists():source_image=root/'public/ending/stage-poster.jpg'
source_audio=base/'saludo-original.wav'
if not source_audio.exists():
 subprocess.run([str(ff),'-y','-i',str(root/'public/ending/saludo-original.m4a'),'-af','apad=pad_dur=0.5','-c:a','pcm_s16le',str(source_audio)],check=True)
print('Models ready. Starting local audio-conditioned video render.',flush=True)
env=os.environ.copy();env['PATH']=str(base/'ltx-2-mlx/.venv/bin')+os.pathsep+env.get('PATH','')
cmd=[str(base/'ltx-2-mlx/.venv/bin/ltx-2-mlx'),'a2v','--distilled','--model',str(base/'models/ltx23-q4'),'--gemma',str(base/'models/gemma3-4bit'),'--image',str(source_image),'--audio',str(source_audio),'--prompt','Photorealistic concert footage. The man in the reference image stands on an indoor arena stage, looks directly at the camera and speaks calmly in Spanish in sync with the provided original synthetic narration. After speaking he gently extends exactly two cream ticket cards toward the camera as a personal gift, with a warm small smile. Natural subtle head movement, blinking and breathing, realistic skin, stable face identity, steady camera, amber stage light and blue arena lighting. Hands stay anatomically correct and hold both paper cards. The background and seated audience remain stable.','--height','448','--width','768','--frames','97','--frame-rate','24','--low-ram','--seed','2027','--output',str(base/'stage-render.mp4')]
status=subprocess.run(cmd,cwd=root,env=env).returncode
if status:raise SystemExit(status)
ff=base/'ltx-2-mlx/.venv/bin/ffmpeg'
subprocess.run([str(ff),'-y','-i',str(base/'stage-render.mp4'),'-i',str(source_audio),'-map','0:v:0','-map','1:a:0','-c:v','libx264','-preset','medium','-crf','20','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-shortest','-movflags','+faststart',str(root/'public/ending/quevedo-stage.mp4')],check=True)
print('FINAL_VIDEO_READY',flush=True)

from huggingface_hub import snapshot_download
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
base=Path(__file__).resolve().parent.parent/'.local-video/models'
base.mkdir(exist_ok=True)
def video():
 return snapshot_download('dgrauet/ltx-2.3-mlx-q4',local_dir=base/'ltx23-q4',allow_patterns=['*.json','LICENSE','README.md','connector.safetensors','transformer-distilled-1.1.safetensors','vae_encoder.safetensors','vae_decoder.safetensors','audio_vae.safetensors','vocoder.safetensors','spatial_upscaler_x2_v1_1.safetensors','spatial_upscaler_x2_v1_1_config.json'],max_workers=4)
def text():
 return snapshot_download('mlx-community/gemma-3-12b-it-4bit',local_dir=base/'gemma3-4bit',allow_patterns=['*.json','*.jinja','*.model','*.safetensors','README.md'],max_workers=3)
with ThreadPoolExecutor(max_workers=2) as pool:
 for r in pool.map(lambda f:f(),[video,text]):print(r,flush=True)

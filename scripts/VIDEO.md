# Vídeo local del regalo

El MP4 de producción está en `public/ending/quevedo-stage.mp4`. Se genera a partir de una recreación fotográfica con ImageGen y una narración original de macOS, no con voz clonada. El texto es «María… tengo una cosina para ti». No usa entradas reales.

## Herramientas y aislamiento

- LTX-2.3, variante Q4, ejecutada por `dgrauet/ltx-2-mlx`, commit `747b30ef10e92a011e85b2aa0f6c4ee86ced5218`.
- Python 3.12 y MLX en `.local-video/ltx-2-mlx/.venv`.
- Gemma 3 12B 4-bit para codificar el prompt.
- FFmpeg a través del paquete `imageio-ffmpeg`, enlazado como `.venv/bin/ffmpeg`.
- Fuente de voz: `say -v 'Eddy (Español (España))'`, a 145 palabras/minuto, WAVE PCM16/24000 Hz. Pausa indicada en el texto tras María. Se añade medio segundo de silencio al WAV antes de A2V para cubrir los 97 fotogramas.
- Modelos, entorno y material de trabajo quedan en `.local-video/`, excluido de Git y del build. Aproximadamente 27 GB de modelos una vez descargados; los siguientes renders reutilizan esos archivos.

Las licencias del código y los modelos son distintas: código MLX MIT, pesos LTX-2 Community License y Gemma Terms. No se usa una API comercial ni se requiere una clave en este flujo local. No instalar todos los extras de entrenamiento.

## Preparación en otro Mac Apple Silicon

```sh
mkdir -p .local-video
git clone https://github.com/dgrauet/ltx-2-mlx.git .local-video/ltx-2-mlx
git -C .local-video/ltx-2-mlx checkout 747b30ef10e92a011e85b2aa0f6c4ee86ced5218
uv sync --directory .local-video/ltx-2-mlx --python 3.12
uv pip install --python .local-video/ltx-2-mlx/.venv/bin/python imageio-ffmpeg
.local-video/ltx-2-mlx/.venv/bin/python -c 'import imageio_ffmpeg,pathlib; pathlib.Path(".local-video/ltx-2-mlx/.venv/bin/ffmpeg").symlink_to(imageio_ffmpeg.get_ffmpeg_exe())'
.local-video/ltx-2-mlx/.venv/bin/python scripts/download-video-models.py
.local-video/ltx-2-mlx/.venv/bin/python scripts/render-ending.py
```

El script usa el PNG de trabajo de ImageGen si existe; si no, utiliza el póster JPEG versionado. Reutiliza el audio original versionado. Una descarga puede requerir reintentar si Hugging Face limita una petición: no hace falta contratar un plan. Si solo falla `tokenizer_config.json`, se puede descargar desde el repositorio oficial del modelo con `?download=true`; no cambiar pesos ni saltarse repositorios con acceso restringido.

## Salida

A2V distilled con imagen inicial y audio original, 768×448, 97 fotogramas a 24 fps, semilla 2027 y streaming `--low-ram`. Reempaquetado final H.264 / AAC, `yuv420p`, MP4 con faststart. La salida del modelo se conserva como `.local-video/stage-render.mp4`; la copia final de la web mantiene la narración original exacta y elimina el audio reconstruido por el modelo.

No afirmar que el movimiento del generador sea una grabación auténtica. La web muestra «Recreación con IA · Voz sintética original» durante el plano de Quevedo.

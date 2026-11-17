"""Genera narración con Edge TTS y aplica conversión de voz RVC.

Uso: uv run voice_generator.py "Hola, María" --rate=-18% --pitch=+0Hz --f0-up-key=-3
"""

from __future__ import annotations

import argparse
import asyncio
from pathlib import Path
import re
import subprocess
import sys
from tempfile import TemporaryDirectory

import edge_tts
import imageio_ffmpeg
import torch

_orig_torch_load = torch.load
torch.load = lambda *args, **kwargs: _orig_torch_load(
    *args, **{**kwargs, "weights_only": kwargs.get("weights_only", False)}
)

from rvc_python.infer import RVCInference

ROOT = Path(__file__).resolve().parent
MODELS_DIR = ROOT / "models/custom_voice"
DEFAULT_TEXT = (
    "Huevooo... feliz navidad. Como te tienes que quedar currando pila "
    "en Barselona durante todo julio... aquí te va una cosina que igual te gusta... "
    "¡Te vienes pa mi consierto!"
)


def prosody(pattern: str, example: str):
    def validate(value: str) -> str:
        if not re.fullmatch(pattern, value):
            raise argparse.ArgumentTypeError(f"Formato esperado: {example}")
        return value
    return validate


def find_rvc_files(models_dir: Path) -> tuple[Path, Path | None]:
    pth_files = sorted(models_dir.glob("*.pth"))
    if not pth_files:
        raise FileNotFoundError(
            f"No se encontró ningún archivo .pth en {models_dir}. "
            "Mete ahí tu archivo .pth y .index."
        )
    index_files = sorted(models_dir.glob("*.index"))
    return pth_files[0], (index_files[0] if index_files else None)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("text", nargs="?", default=DEFAULT_TEXT)
    parser.add_argument("--voice", default="es-ES-AlvaroNeural")
    parser.add_argument("--rate", default="-18%", type=prosody(r"[+-]\d+%", "-18%"))
    parser.add_argument("--pitch", default="+0Hz", type=prosody(r"[+-]\d+Hz", "+0Hz"))
    parser.add_argument("--f0-up-key", type=int, default=-3, help="Cambio de semitonos en RVC")
    parser.add_argument("--index-rate", type=float, default=0.80, help="Fuerza del timbre .index (0-1)")
    parser.add_argument("--output", type=Path, default=ROOT / "output/final_voice.wav")
    args = parser.parse_args()
    if not args.text.strip():
        parser.error("El texto no puede estar vacío.")
    if args.output.suffix.lower() != ".wav":
        parser.error("La salida debe tener extensión .wav.")
    return args


def get_device() -> str:
    return "cpu:0"


async def synthesize_base(text: str, base_wav: Path, *, voice: str, rate: str, pitch: str) -> None:
    mp3 = base_wav.with_suffix(".mp3")
    speaker = edge_tts.Communicate(text, voice=voice, rate=rate, pitch=pitch)
    await asyncio.wait_for(speaker.save(str(mp3)), timeout=90)
    result = subprocess.run(
        [
            imageio_ffmpeg.get_ffmpeg_exe(),
            "-nostdin", "-hide_banner", "-loglevel", "error",
            "-y", "-i", str(mp3), "-vn", "-ac", "1", "-ar", "40000",
            "-c:a", "pcm_s16le", str(base_wav),
        ],
        capture_output=True, text=True, timeout=60, check=False,
    )
    if result.returncode:
        raise RuntimeError(f"FFmpeg no pudo convertir el audio: {result.stderr.strip()}")


def convert_rvc(
    base_wav: Path,
    output_wav: Path,
    *,
    f0_up_key: int,
    index_rate: float,
) -> None:
    pth_path, index_path = find_rvc_files(MODELS_DIR)
    device = get_device()

    rvc = RVCInference(device=device)
    rvc.load_model(
        str(pth_path),
        version="v1",
        index_path=str(index_path) if index_path else "",
    )
    rvc.set_params(
        f0method="rmvpe",
        f0up_key=f0_up_key,
        index_rate=index_rate,
        filter_radius=3,
        resample_sr=0,
        rms_mix_rate=0.25,
        protect=0.33,
    )
    rvc.infer_file(str(base_wav), str(output_wav))


async def generate(args: argparse.Namespace) -> Path:
    output = args.output.expanduser().resolve()
    output.parent.mkdir(parents=True, exist_ok=True)

    with TemporaryDirectory(prefix=".tts-", dir=output.parent) as work:
        work_dir = Path(work)
        base_wav = work_dir / "base.wav"
        converted_wav = work_dir / "converted.wav"

        print("1/2 Generando voz base con Edge TTS...")
        await synthesize_base(
            args.text, base_wav, voice=args.voice, rate=args.rate, pitch=args.pitch
        )

        print("2/2 Aplicando modelo RVC (esto tarda unos segundos)...")
        await asyncio.to_thread(
            convert_rvc,
            base_wav,
            converted_wav,
            f0_up_key=args.f0_up_key,
            index_rate=args.index_rate,
        )
        converted_wav.replace(output)

    return output


def main() -> int:
    args = parse_args()
    try:
        output = asyncio.run(generate(args))
    except KeyboardInterrupt:
        print("Generación cancelada.", file=sys.stderr)
        return 130
    except Exception as error:
        print(f"Error ({type(error).__name__}): {error}", file=sys.stderr)
        return 1
    print(f"¡Listo! Audio generado en: {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

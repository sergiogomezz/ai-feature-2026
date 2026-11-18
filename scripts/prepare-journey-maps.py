"""Prepare the fixed Barcelona zoom, with aligned CC BY 4.0 imagery.
Run: uv run --no-project --with pillow python scripts/prepare-journey-maps.py
Only these small, centred GetMap exports are requested; no runtime map service.
"""
import io
import json
import math
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import urlopen
from PIL import Image

DESTINATION = (41.3634, 2.1526)
ROOT = Path(__file__).resolve().parents[1] / 'public' / 'ending' / 'maps'
ROOT.mkdir(parents=True, exist_ok=True)
lat, lon = DESTINATION
x = 6378137 * math.radians(lon)
y = 6378137 * math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))


def prepare(index):
    span = 8_000_000 / 2**index
    source = 'EOX' if index < 8 else 'IGN'
    endpoint = ('https://tiles.maps.eox.at/wms' if source == 'EOX'
                else 'https://www.ign.es/wms-inspire/pnoa-ma')
    params = dict(service='WMS', version='1.1.1', request='GetMap',
                  layers='s2cloudless_3857' if source == 'EOX' else 'OI.OrthoimageCoverage',
                  styles='', srs='EPSG:3857', bbox=','.join(str(v) for v in
                  (x-span/2, y-span/2, x+span/2, y+span/2)),
                  width=2048, height=2048, format='image/jpeg')
    url = endpoint + '?' + urlencode(params)
    target = ROOT / f'barcelona-{index:02}.webp'
    if not target.exists():
        for attempt in range(3):
            try:
                with urlopen(url, timeout=60) as response:
                    image = Image.open(io.BytesIO(response.read())).convert('RGB')
                image.save(target, 'WEBP', quality=86, method=6)
                break
            except Exception:
                if attempt == 2:
                    raise
                time.sleep(2)
    print(f'{index:02}: {span:.1f} m, {source}, {target.stat().st_size // 1024} KB', flush=True)
    return dict(file=target.name, span=span, source=source, url=url)


with ThreadPoolExecutor(max_workers=2) as pool:
    layers = list(pool.map(prepare, range(14)))
(ROOT / 'sources.json').write_text(json.dumps(dict(
    center=dict(lat=lat, lon=lon), crs='EPSG:3857', pixels=2048,
    attribution=dict(EOX='EOxCloudless by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016), CC BY 4.0',
                     IGN='PNOA · IGN y comunidades autónomas, CC BY 4.0 scne.es'),
    layers=layers), indent=2) + '\n')

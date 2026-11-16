# Recursos del viaje y del escenario

Actualizado: 2026-11-16. No se han usado entradas reales, códigos, QR, asientos ni archivos privados de compra.

## Archivos consumidos por la web

- [Vídeo final](../../../../public/ending/quevedo-stage.mp4): LTX-2.3 Q4, A2V distilled, 97 fotogramas, 24 fps, 768×448, 4,04 s. H.264/AAC y faststart. Voz sintética original de macOS, no clonada.
- [Fotograma de escenario](../../../../public/ending/stage-poster.jpg): imagen de partida creada con la herramienta integrada ImageGen. Se conserva el PNG original generado; el JPEG de la web se obtuvo por conversión de formato con FFmpeg.
- [Vista aérea](../../../../public/ending/palau-aerial.jpg): ImageGen, convertida a JPEG para la web. Es una recreación visual, no cartografía ni una fotografía real del recinto.
- [Tierra 8K](../../../../public/ending/earth-hd.jpg): 8192×4096, 4,4 MB, [Solar System Scope](https://www.solarsystemscope.com/textures/), CC BY 4.0. Descarga: https://www.solarsystemscope.com/textures/download/8k_earth_daymap.jpg. Atribución visible durante el viaje. Anisotropía hasta 8× y acercamiento acotado; no se estira una textura 2K hasta llegar a los píxeles.
- [Tierra del adorno](../../../../public/ending/earth.jpg): textura de los ejemplos de Three.js, descargada de https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg. No se usa un servicio de mapas ni se descargan teselas.
- [Audio original](../../../../public/ending/saludo-original.m4a): frase «María… tengo una cosina para ti». Creado localmente con `say`, voz Eddy en español de España. El vídeo incluye esa narración original; se descarta el audio reconstruido por LTX al empaquetar el MP4.

Materiales de trabajo y modelos en `.local-video/`, fuera del build y excluidos de Git. Procedimiento y scripts: [`scripts/VIDEO.md`](../../../../scripts/VIDEO.md). Generación MLX local, sin clave de API ni suscripción de vídeo.

## Referencia del artista

Retrato promocional usado únicamente como referencia visual para ImageGen: https://s1.ticketm.net/dam/a/176/35835f4d-9b7d-4ba9-bead-03ad858e2176_RETINA_PORTRAIT_3_2.jpg, enlazado desde la ficha del artista en Ticketmaster. La foto de referencia no se sirve en la web. El resultado está identificado como recreación con IA y no representa un saludo auténtico ni un aval del artista.

## Prompt de ImageGen: escenario

> Create a photorealistic cinematic first frame for a clearly labelled AI fictional gift video. Reference image: preserve the recognizable identity and facial features of Quevedo, the Spanish singer shown in the supplied promotional portrait. NOT illustration, NOT 3D/cartoon. A realistic medium waist-up shot of Quevedo on the stage of Palau Sant Jordi, Barcelona, facing the camera as if addressing one fan personally. He wears a simple black concert t-shirt and discreet silver chain. Camera is on stage facing him; behind him show the indoor arena's high domed metal lattice ceiling, curved tiered seating and a softly blurred audience with phone lights. Warm amber key light on his face, subtle deep blue concert lighting, natural skin texture. He looks directly into camera with a small warm smile, mouth naturally resting and eyes clear. Both hands visible at waist level holding exactly TWO plain cream paper ticket cards together, with no writing. Avoid giant jewelry, microphones in front of his mouth, logos, letters, watermark, fake QR codes, extra fingers, duplicate people, grotesque faces. Wide landscape 16:9 composition, subject centered with head and hands fully in frame and room around his elbows. This is an AI reconstruction, not a claim of an authentic event or endorsement.

## Prompt de ImageGen: llegada al Palau

> Photorealistic cinematic aerial establishing image for a clearly labelled AI gift-film transition. Barcelona, Montjuïc, the Palau Sant Jordi arena is EXACTLY centered in the image: distinctive low broad rounded rectangular metallic curved roof by Arata Isozaki, reflective silver-grey shell, Mediterranean stone forecourt. Include the oval Olympic Stadium farther behind and to the right, slender white Calatrava telecommunications tower to the left, extensive green wooded Montjuïc hills, Barcelona urban grid and the Mediterranean coast in the far background. View from a drone high above the south side looking north toward the city, with the Palau roof very clearly recognizable at center. Real aerial photography appearance, natural physical scale, warm blue-hour dusk, arena facade warm lights, realistic vegetation, no cartoon, no miniature tilt-shift, no illustration, no map labels, no text, no people close-up. Wide 16:9 landscape, generous space around the arena for a cinematic zoom inward, not a crop that cuts off its roof. This is an AI recreation, not actual cartographic imagery.

## Prompt de LTX: vídeo

> Photorealistic concert footage. The man in the reference image stands on an indoor arena stage, looks directly at the camera and speaks calmly in Spanish in sync with the provided original synthetic narration. After speaking he gently extends exactly two cream ticket cards toward the camera as a personal gift, with a warm small smile. Natural subtle head movement, blinking and breathing, realistic skin, stable face identity, steady camera, amber stage light and blue arena lighting. Hands stay anatomically correct and hold both paper cards. The background and seated audience remain stable.

Resultado revisado: conserva dos tarjetas, mueve cabeza y expresión, y acerca una tarjeta a cámara mientras sostiene la otra. No se afirma una entrega perfecta de ambas a la vez. La web completa la revelación con dos tarjetas HTML, cuyos textos no dependen de la generación de vídeo.

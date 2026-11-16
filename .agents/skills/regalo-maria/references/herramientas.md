# Herramientas candidatas

Investigación: 2026-11-15. Fuentes primarias consultadas. Three.js y Anime.js se usan en la versión 3D actual; versiones fijadas en package.json y package-lock.json. Tras una prueba SVG, el usuario confirmó que quiere 3D. Las demás herramientas siguen como candidatas sin probar. Revalidar documentación al incorporarlas.

## Selección para la web

| Herramienta | Licencia / naturaleza | Aplicación propuesta | Decisión provisional |
| --- | --- | --- | --- |
| [Three.js](https://github.com/mrdoob/three.js) | MIT; biblioteca 3D web | Árbol, caja con tapa, partículas, cámara y escenario | Primera opción para un diorama 3D; puede usarse sin React |
| [Anime.js](https://github.com/juliangarnier/anime) | MIT; motor de animación JS | Secuenciar apertura, luces, textos y movimientos | Primera opción cuando CSS deje de bastar |
| [Phaser](https://github.com/phaserjs/phaser) | MIT; motor de juegos 2D para navegador | Minijuegos con escenas, sprites y lógica más elaborada | Reservar para juegos que lo justifiquen; encontrar objetos o un puzle simple puede hacerse con DOM/SVG |
| [CesiumJS](https://github.com/CesiumGS/cesium) | Apache-2.0; globos y mapas 3D | Vuelo geográfico Tierra–Barcelona–Palau | Probar si se busca realismo geográfico; datos y servicios se evalúan por separado |
| [Blender](https://www.blender.org/) | GNU GPL; creación 3D | Modelar árbol, regalo y escenario o renderizar el viaje como vídeo | Herramienta de producción opcional, no dependencia del navegador |
| [Poly Haven](https://polyhaven.com/license) | Recursos bajo CC0 | Texturas, iluminación HDRI y modelos de apoyo | Biblioteca de recursos; elegir assets y optimizarlos, no descargar un catálogo completo |

**Elección vigente:** Three.js + Anime.js, materiales físicos, texturas procedurales y cámara orbital; personajes con actuación cartoon. HTML para controles y pruebas. Web Audio para música original sintetizada. La prueba SVG se descartó al aclarar el usuario que quiere 3D, no 2D. No hacen falta React, Phaser ni Cesium para esta primera escena.

**Viaje:** comparar un zoom estilizado en Three.js con una prueba de Cesium. Cesium separa el motor abierto de Cesium ion y de los proveedores de contenido; no asumir que incluye imágenes satelitales o un modelo detallado del Palau gratuito. Alternativa: secuencia prerenderizada de planos y fundidos para controlar carga y ritmo.

**Rive:** sus [runtimes oficiales son MIT](https://github.com/rive-app/help-center/blob/master/runtimes/overview.md). Eso no demuestra que toda la cadena de autoría sea open source; no presentarlo como solución íntegramente abierta sin verificar el editor y la exportación.

## Experimentos de vídeo y animación facial

### MuseTalk

[Repositorio oficial](https://github.com/TMElyralab/MuseTalk).

Sincroniza labios con audio. El código es MIT; su README permite uso comercial del modelo y separa las condiciones de modelos dependientes y datos de prueba. Su instalación recomendada usa Python y CUDA: no asumir que funciona directamente en este Mac.

Probar, si procede, un plano corto con material adecuado y audio ya disponible. No crea por sí solo el cuerpo, escenario ni la voz de Quevedo; puede requerir composición y otra herramienta de audio. No usar los vídeos de ejemplo como material de producción sin revisar sus condiciones.

### LivePortrait

[Repositorio oficial](https://github.com/KlingAIResearch/LivePortrait).

Anima retratos a partir de movimiento de referencia. Documenta ejecución del modo humano en Apple Silicon, con advertencia de menor velocidad que una RTX 4090. No equivale a un generador completo de cantante en escenario ni a síntesis de voz. Licencia del código, pesos y dependencias pendiente de revisión detallada antes de adoptarlo; mantenerlo como candidato de investigación.

### Criterio para el plano final

Separar cuatro trabajos: imagen/personaje, movimiento y labios, audio, composición del escenario. Una prueba de pocos segundos debe demostrar calidad antes de construir el final alrededor de una herramienta. Identificar el resultado como recreación con IA. El uso de software abierto no garantiza que todos los pesos, imágenes y voces tengan las mismas condiciones.

Hedra y HeyGen siguen como alternativas comerciales investigadas previamente, no como herramientas open source. HeyGen exige [consentimiento grabado del titular para el doble digital](https://help.heygen.com/en/articles/12092609-recording-your-consent-video); Hedra admite [imagen y audio para lip-sync](https://www.hedra.com/docs/pages/app/troubleshooting/faq), pero no se ha confirmado el uso solicitado con el artista.

## Revisión de vídeo realista y voz — 2026-11-16

Nueva petición: Quevedo con apariencia realista y su voz, frase «María… tengo una cosina para ti», y entrega de dos entradas para el Palau Sant Jordi. Investigación documental únicamente; sin generación, compra ni carga de referencias del artista en servicios externos.

### Conclusión provisional

No se ha verificado una herramienta que permita completar sin colaboración/autorización del artista tanto su doble como su voz exacta. No prometer esa combinación ni presentar una recreación como saludo auténtico. Para reproducir su voz se necesita autorización; una voz original no debe intentar suplantarlo. No usar herramientas locales como vía para eludir restricciones de voz de otras plataformas.

- **HeyGen:** la [tarifa actual](https://www.heygen.com/pricing) anuncia Avatar 6, plan gratuito de 3 vídeos mensuales con marca, Creator de 29 USD/mes y Pro de 49 USD/mes. Para [dobles digitales de vídeo](https://help.heygen.com/en/articles/12092609-recording-your-consent-video) requiere que el propio titular grabe el consentimiento. La [guía de gestos de Avatar IV/V](https://help.heygen.com/en/articles/12805098-fine-tune-avatar-gestures-and-movements-with-custom-motion-prompts-avatar-iv-v) permite manos/expresiones pero excluye acciones con objetos en ese control; no extrapolar ese límite a todos sus motores nuevos ni prometer una entrega exacta de entradas sin prueba.
- **Hedra Character 3:** [documentación de modelo](https://www.hedra.com/models/video/hedra/character-3) confirma imagen + audio, hasta 1080p. API publicada: 0,0625 USD/segundo en 1080p (unos 0,625 USD por 10 s, solo ese render; no incluye audio, imágenes ni reintentos). [Play Basic](https://www.hedra.com/play/pricing): 20 USD/mes, 2.000 créditos; API y Play se facturan por separado. Su [AUP actual](https://www.hedra.com/acceptable-use) restringe medios de otras personas y la atribución engañosa sin consentimiento o derecho; no se recomienda como vía confirmada para el artista. El enlace antiguo de especificaciones de la app devuelve 404: no reutilizar sus límites como datos vigentes.
- **ElevenLabs:** su [política de 9 de octubre de 2026](https://elevenlabs.io/use-policy) prohíbe clonar/sintetizar/suplantar voz de una persona viva sin consentimiento explícito e informado u otra autorización válida. No hay una voz autorizada de Quevedo verificada para este proyecto.
- **MuseTalk:** el [repositorio oficial](https://github.com/TMElyralab/MuseTalk) sigue siendo candidato abierto para sincronizar labios con audio disponible y autorizado. No genera la voz, la actuación corporal ni la entrega de entradas; reconoce límites en preservación de identidad y región facial de 256×256. No instalado ni probado aquí.

Propuesta de producción, aún abierta: dos planos, unos 8–12 s en total. Plano de saludo con audio autorizado u original; corte a dos entradas decorativas acercándose a cámara. Componer textos de entradas después para mantener concierto, recinto y fecha legibles y correctos; no generar QR, asientos ni accesos ficticios. Prueba de calidad antes de elegir o pagar un servicio. Etiqueta visible de recreación con IA para el vídeo sintético.

## Implementación local gratuita — 2026-11-16

Se adopta una primera prueba de vídeo con [dgrauet/ltx-2-mlx](https://github.com/dgrauet/ltx-2-mlx), commit `747b30ef10e92a011e85b2aa0f6c4ee86ced5218`. Entorno Python 3.12 aislado, MLX 0.32.2, LTX-2.3 Q4 y Gemma 3 12B 4-bit. Probado en este Mac M4 Pro de 24 GB con `--low-ram`. El código es MIT; los pesos tienen sus propias licencias LTX-2 Community y Gemma. No presentarlo como una cadena íntegramente MIT.

Descargados unos 27 GB de modelos en `.local-video/`, ignorado por Git; entorno y pesos se reutilizan. Las descargas públicas no requieren clave ni plan de pago. Se resolvió un timeout de `tokenizer_config.json` descargando ese archivo desde el mismo repositorio público, sin eludir accesos restringidos.

Vídeo A2V distilled condicionado por fotograma y audio originales: 768×448, 97 frames/24 fps, unos 4,04 s; dos pasadas, semilla 2027, render local de varios minutos tras la descarga inicial. Voz original de macOS Eddy (español de España), frase exacta, no clonación de Quevedo. El WAV se prolonga con 0,5 s de silencio para cubrir la duración exigida por el modelo. Imagen de escenario y aérea creadas con la herramienta integrada ImageGen; no se ha contratado HeyGen, Hedra ni otra suscripción. FFmpeg codifica H.264/AAC, faststart, y conserva la narración original en el MP4 final.

[Recursos, procedencia y prompts](final-assets.md). [Instrucciones reproducibles](../../../../scripts/VIDEO.md). MuseTalk/LivePortrait siguen sin instalarse ni usarse; la sincronización de esta prueba la genera LTX a partir del audio. La calidad visual y el gesto son una primera versión para revisar, no garantía de fidelidad perfecta al artista.

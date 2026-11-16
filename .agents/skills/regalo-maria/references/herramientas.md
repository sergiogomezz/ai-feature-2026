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

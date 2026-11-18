# Estado actual y continuación

Actualizado: 2026-11-18, cierre de sesión. Este resumen sustituye las notas cronológicas anteriores; contrastar siempre con el código.

## Retomar

- Proyecto: `/Users/sergiogomez/Repos/cosas-random/regalo-maria-2026`, rama `main`.
- Servidor Vite comprobado activo en **http://127.0.0.1:4174/** (HTTP 200). Arranque: `npm run dev`; compilación: `npm run build`.
- El usuario revisa en **su Chrome habitual**, en esa misma URL. Se configuró Sonido → Permitir para el sitio y se confirmó reproducción automática. No confundirlo con el navegador integrado de Orca ni abrir otro perfil de Chrome.
- Cierre del 18 de noviembre: el usuario pide commit y push de toda la iteración en `main`. Incluye recorrido, sonidos, final, entradas y fotomatón modular con sus modelos locales. Consultar `git log -1` y `git status` para el hash y estado real; no asumir cambios pendientes a partir de cierres anteriores.
- La skill personal `~/.codex/skills/regalo-maria` es un enlace a `.agents/skills/regalo-maria` de este repositorio. Es la fuente única; no crear otra copia.
- Atajos sólo de desarrollo: `?preview=eggs`, `?preview=pepper` (abre la ventana y espera clic), `?preview=finale` (desbloquea la bola; no salta automáticamente al vídeo).
- Para navegador integrado/capturas de revisión usar `orca-cli`; para la ventana de Chrome habitual, `orca-computer-use` si se necesita GUI. No conservar IDs de pestañas, procesos ni terminales entre sesiones.

## Recorrido vigente

Sobre «Feliz Navidad» cae girando en 3D mientras suena el mensaje → abrir solapa → papel «Para María» sale con una flecha → clic en papel/flecha → Reyes borrachos entran por una puerta montados en perros salchicha → uno cae y vuelve a subir → entregan regalo y salen por la misma puerta → cámara vuelve suavemente al encuadre de habitación → abrir regalo y nota → huevos a cinco caras de María → las caras quedan sucias, ventana abre y cortinas ondean → esperar clic en la propia ventana → acercamiento, cruce y caída → pimiento volador por seis aros → «Volver al árbol» → bola del mundo brillante → clic → dos vueltas, Barcelona/Palau, vista aérea larga → vídeo de escenario y entrega pausada → dos entradas personalizadas.

**Última iteración:** rediseño del pimiento, aros ampliados y cara de ventana trasladada; viaje sin rótulos y llegada al Palau con público, fuegos y entrada en primera persona. Audio de `output/final_voice.wav` incorporado al vídeo. Ver apartado de revisión al final: sustituye las duraciones y recursos del final descritos en el cierre anterior.

## Carta y audio

- `landing-motion.js`: el audio dirige el movimiento mediante `currentTime`. Caída de 3,2 s con giros desde el inicio, traslación en profundidad hasta −1000 px, perspectiva de 1000 px y giros X/Y/Z. Al terminar vuelve al centro sin repetir la caída. Pausa/silencio congelan el vuelo; movimiento reducido lo elimina.
- Solapa abre antes de salir el papel. Flecha SVG hacia la derecha, sin texto visible, ya dibujada durante la salida (sin aparición repentina). El botón `envelope-card` conserva nombre accesible y espera clic/Enter. No hay botones anidados.
- `public/audio/tienes-un-mensajeee.mp3`: una vez en sobre/apertura/papel; para al continuar a los Reyes. Sonido inicialmente activado e intento inmediato de autoplay, con reintento por gesto si el navegador bloquea. Respeta pausa/visibilidad.
- Música de fondo anterior retirada; se conserva el botón para una futura pista y el audio del final.
- `dry-fart.mp3`: cada clic permitido con sonido activado. Excluye huevos, ventana/espera/caída, vuelo y todo el final desde pulsar la bola. Comprueba fase antes y después del clic.
- `screaming-goat.mp3`: mientras el cursor pepino está gritando al moverse, con el mismo permiso/exclusiones del clic. Una instancia en bucle, corta tras 150 ms de reposo y al pausar/silenciar/ocultar. Sin sonido de cursor táctil.
- `cartoonsplash.mp3`: al romperse cada huevo (acierto, repetición o fallo), no al lanzarlo. `onImpact` independiente de `onHit`, pool de cuatro audios, silencio/pausa/salida lo detienen. Sustituye el tintineo de acierto.

## Habitación y Reyes

- Vite + Three.js + Anime.js; personajes 3D originales con materiales físicos, sin pretensión de fotorrealismo terminado.
- `royal-characters.js`: rostros con mandíbula/pómulos/orejas/nariz, ojos con iris/brillo/párpados, barbas por mechones, manos con dedos, terciopelo, capas con pliegues, cuello de armiño, bordados, joyas y botas. Melchor blanco, Gaspar pelirrojo, Baltasar con barba corta y turbante/pluma.
- `royal-dogs.js`: salchichas de cuerpo largo, hocico angular, orejas caídas y patas cortas articuladas. Estilo reconocible pero minimalista, con referencia Phineas y Ferb.
- `arrival-door.js`: abertura real en pared izquierda (x=−7, z=1,2–4, altura 3,15), pasillo iluminado y puerta doble con marco, molduras, paneles, manillas y bisagras. Dos hojas de apertura máxima 82,8°, sincronizadas con `update()`; sustituye la hoja que abría 99° y atravesaba el lateral.
- Entran en fila; giran 180° para salir por la misma puerta. La puerta abre antes del cruce y cierra después de la última cola. Duración de llegada: 27,3 s a ×1; sin botón de saltar, regalo bloqueado hasta terminar.
- Cámara acompaña entrada/salida y vuelve en 2,2 s hasta `savedPosition`/`savedTarget` antes de restaurar controles; sin corte de plano. Encuadre amplio en móvil durante cruces y suelo extendido para evitar bordes visibles.
- Regalo hueco de cinco caras; cámara entra antes de la nota. Cerrar nota restaura habitación.

## Huevos, ventana y vuelo

- Cinco recortes de `public/maria-head-cutout.png` sobre la misma habitación. Mano articulada con preparación/liberación, proyectiles, raycasting real, clara/yema/cáscaras y goteo. Cinco aciertos únicos; repetir/fallar mancha sin sumar. Arrastrar no dispara. Teclado y ayuda reencuadran pendientes.
- Al acabar, `eggGame.settle()` oculta mano/botones y mantiene caras/manchas/goteo. `prepareWindow()` abre hojas, aumenta viento y enmarca la ventana suavemente durante 1,6 s, también en móvil. Cortinas deformadas con anclaje superior y reloj pausable; sin ondulación continua con movimiento reducido.
- Fase `window-ready` espera indefinidamente. `window-jump` se proyecta sobre el cristal y admite clic/Enter. El clic inicia `fall()`, limpia huevos conservando continuidad de cámara, cruza y cae entre nubes. Reinicio cancela, cierra ventana y restaura cortinas.
- `flying-pepper.js`: superficie continua con cuatro lóbulos, tallo/cáliz, gafas de aviador, ojos, alas de plumas y bufanda animada. Escala adaptada para que quepan las alas en móvil; alternativa SVG propia sin WebGL.
- Velocidad **normal del pimiento = antiguo ×2**. Es un multiplicador local ×2; el control global de revisión sigue ×1/×2. Física en subpasos de máximo 16 ms.
- Colisión del cuerpo con la llanta: rebote, aro ámbar y aviso; repite ese aro sin perder progreso. Acierto sólo cuando el cuerpo completo cabe y termina de cruzar. Seis aros, sin vidas; ayuda opcional sigue su altura. Toque/espacio/flecha arriba/Enter para aletear.
- Tras seis aciertos, «Volver al árbol» revela adorno Tierra con casquillo, brillo y halo azul (`world.revealGlobe()`). Viaje sólo al pulsar bola; raycasting, botón proyectado y alternativa CSS.

## Final y entradas

- Tierra 8192×4096 (Solar System Scope, CC BY 4.0), dos vueltas exactas (4π, 6,5 s), 16 s de acercamiento continuo hasta Barcelona/Palau. Sin marcador amarillo ni destello blanco.
- `journey-map.js`: 14 exportaciones locales WebP EOX/IGN (unos 11 MB), EPSG:3857, centro 41.3634/2.1526, extensión de 8 000 000 m a 976,6 m y encuadre final 850 m. Atribución visible; sin mapas externos/claves en ejecución. Reproducción de exportaciones en `scripts/prepare-journey-maps.py`.
- Se conserva la vista aérea recreada `palau-aerial.jpg` con Barcelona de fondo después del tejado cartográfico: 14 s, mezcla inicial 1,3 s, acercamiento suave acotado a 1,28×. Viaje total 36,5 s. **No volver a eliminar esta vista** al pulir zoom.
- Escenario: introducción de 2,5 s, MP4 a `getPlaybackRate() * .65` con tono conservado, 3,5 s sobre fotograma final y tarjetas con animación de 2 s. Reloj de escenario usa delta real para que el navegador no alargue esperas al reducir frames en imágenes estáticas. Pausa, visibilidad, repetición y reinicio conectados.
- MP4 local LTX-2.3 Q4/MLX: 768×448, 97 frames/24 fps, 4,04 s, H.264/AAC, unos 450 KB. Frase «María… tengo una cosina para ti». Voz sintética original macOS Eddy, no clonada de Quevedo; etiqueta visible de IA. No regenerar ni contratar servicios si el pedido es sólo de interfaz.
- Entradas crema/azul/naranja, cartel completo, talón perforado y muescas, apiladas con ligera inclinación. Nombres: **Sergio Gómez Martín** y **María Porras Agenjo**. Cartel del usuario copiado sin alterar a `public/ending/quevedo-el-baifo-tour-2027.png` (222×222, 78 KB).
- Datos exactos: Quevedo · El Baifo Tour · martes 6 de julio de 2027, **20:30** · Palau Sant Jordi, Passeig Olímpic 5, 08038 Barcelona. Organiza LIVING LIVE, A.I.E., C/ Doctor Carulla, 40–42, 08017 Barcelona, España.
- Son tarjetas decorativas, no entradas válidas. No inventar QR, asientos, sectores ni códigos. Entradas auténticas privadas con el usuario; aclaración visible.

## Controles y límites

- Título del navegador exactamente `feature`. Sin persistencia del recorrido ni despliegue público.
- Pausa detiene CSS, esperas, personajes, huevos/goteo, viento, vuelo, viaje y vídeo. Reinicio cancela continuaciones y limpia; recargar repite sobre.
- ×1/×2 visible sólo en desarrollo, inicialmente ×1, conserva elección al reiniciar y vuelve a ×1 al recargar. `playback.js` coordina relojes, Anime.js, Web Animations y vídeo; cambiar durante pausa no reanuda nada.
- Movimiento reducido y variantes sin WebGL implementados; no bloquear el regalo por sonido o animación. No quitar ayuda/teclado ni añadir salto de Reyes.
- `.local-video/` ignorado y fuera de build: herramientas y unos 27 GB de modelos locales. No volver a descargar ni instalar si no hace falta. Recursos/prompts: [final-assets.md](final-assets.md) y `scripts/VIDEO.md`.

## TTS independiente

`pyproject.toml`, `uv.lock`, `.venv` ignorado y `voice_generator.py`: Python 3.10/3.11, Edge TTS online con Álvaro español (rate −18%, pitch −12Hz configurables), WAV PCM16 mono 24 kHz a `output/final_voice.wav`. Temporales/publicación atómica, FFmpeg vía imageio-ffmpeg. Verificados `uv sync` con 3.11 ARM64, CLI, rechazo de texto vacío y síntesis/decodificación real. No modifica el MP4 ni hace RVC/conversión de identidad vocal. No evaluado de oído ni en Python 3.10.

## Verificaciones y siguiente paso

- Último diseño: build y `git diff --check` correctos. Dos nombres exactos y cartel local decodificado. Capturas revisadas en 1280×800 y 390×844; a 320×568 no hay desbordamiento horizontal y se puede desplazar desde título a pie. Conservados IDs/eventos del final. No repetido el viaje completo tras este ajuste sólo visual.
- Recorrido verificado durante la sesión: entrada/salida de Reyes por puerta, caída/reincorporación, entrega y regalo desbloqueado; apertura/cierre de nota. Cinco impactos únicos → manchas conservadas → apertura/viento/espera → clic ventana → caída → vuelo, en escritorio/móvil emulado. Choque provocado: colisiones 1 y puntuación 0; seis aros con ayuda y retorno/bola. Velocidad normal móvil medida ≈4,09 m/s (antes 2 m/s).
- Final real a revisión ×2: Palau ≈7 s (14 lógicos), escenario empieza en fotograma 0 pausado, película ×1,3 (0,65×2), espera después de `ended` ≈1,87 s y dos tarjetas. Pausa/reanudación, silencio y reinicio durante transiciones comprobados. Reiniciar ventana pausada elimina manchas/botón sin juego tardío.
- Sonidos comprobados mediante reproducción/estado en navegador: clic/cursor con sus exclusiones, splash al impactar/repetir/fallar y silencio. Sin evaluación de oído. No atribuir a audición lo que sólo se comprobó por API.
- Sin prueba física de móvil, medición de rendimiento en gama baja ni nueva prueba dedicada de fallback/movimiento reducido tras las últimas iteraciones.
- Próximo paso: revisión del usuario de entradas y recorrido actual. Continuar su siguiente ajuste; no hay rediseño pendiente aceptado ni publicación solicitada. Mantener presupuesto cero y datos auténticos privados.

## Revisión posterior: pimiento, público y entrada al Palau

- `flying-pepper.js`: nueva silueta continua de pimiento morrón rojo, hombros redondeados, cáliz/tallo verde, ojos grandes, sonrisa, mejillas y alas de plumas. Retiradas gafas y bufanda.
- `pepper-game.js`: radio de aros 1,75 (antes 1,12), interior 1,675; conserva colisión real y seis aciertos. Variaciones de altura menores (±0,8). Aro DOM también ampliado. Velocidad local ×2 conservada.
- `egg-game.js`: segunda cara pasa de [3,3.65,-2.77] (ventana) a [-5.5,1.05,-3.12], pared izquierda baja. Ventana libre.
- Sin rótulos Barcelona/Palau ni línea de progreso durante el viaje; atribuciones cartográficas discretas conservadas.
- Nuevo `palau-arrival.js`: imagen aérea original en plano con puerta abierta mediante shader; cámara perspectiva independiente que desciende hasta la puerta, entra en un pasillo iluminado y se acerca al fotograma del escenario. 320 personas con cuerpos/cabezas/extremidades instanciadas, marcha lenta y entrada progresiva; siete fuegos con ascenso, expansión, gravedad y desaparición. Primera persona con balanceo leve. Es una composición 2,5D con personajes simples, no fotogrametría ni vídeo fotorrealista nuevo.
- Tras los 22,5 s de globo/mapa: 32 s de llegada. Mezcla cartográfica de 3 s con inclinación, espera inicial ante recinto, público desde segundo 3, fuegos desde 5, descenso desde 8, paseo desde 21 y mezcla al escenario entre 29–32. Reloj compartido con pausa/×2. Movimiento reducido sustituye el viaje por vistas estáticas sin fuegos ni marcha. Alternativa sin WebGL con canvas.
- `public/ending/quevedo-message.mp4`: nuevo empaquetado del vídeo existente con el único WAV de `output/`, `final_voice.wav` (7,512 s, mono PCM16 24 kHz). Vídeo ralentizado para durar la narración, audio AAC sin cambiar velocidad/tono. Reproducción ×1 normal y ×2 de revisión. Se conserva el MP4 anterior. No hay sincronización labial nueva; no afirmar que las palabras coincidan con los movimientos de boca anteriores. Etiqueta visible «Recreación con IA · Audio generado con IA» y retirada la frase/subtítulo anterior que no correspondía al nuevo audio.
- Comprobaciones durante implementación: build y diff-check correctos; final real llegó al escenario con MP4 de 7,512 s sin error de reproducción; minijuego con ayuda llegó a 6/6 y cero choques. Pimiento y entrada con público revisados visualmente en navegador integrado. El cierre anterior conserva pruebas históricas del resto del recorrido.
- Pendiente: revisión estética del usuario. No afirmar evaluación auditiva, prueba física móvil, fotorrealismo de la multitud ni sincronización labial del nuevo audio.

- Cierre de esta revisión: recorrido real Tierra → Palau → escenario → dos tarjetas completado con el nuevo MP4; repetición, pausa del vídeo y reinicio (overlay oculto y vídeo detenido) comprobados. Fuegos revisados por captura tras aumentar su brillo. La cara trasladada queda en el extremo inferior izquierdo para evitar árbol y lámpara. El ajuste de viewport del navegador integrado no cambió su tamaño real (865×848): no considerar hecha una nueva validación móvil completa. Alternativa canvas y movimiento reducido implementados sin nueva prueba dedicada.

- Último ajuste: retirados del pie de las entradas los tres párrafos de dirección, organizador y aclaración sobre las originales. Conservados tarjetas y botón de repetir.

- Última corrección del usuario: eliminar notas y aclaraciones visibles de toda la experiencia, no solo del pie de entradas. Retirados también el rótulo de IA del vídeo y los créditos superpuestos del viaje. Conservadas instrucciones de juego, controles, datos del concierto y descripciones accesibles. La procedencia/licencias de recursos siguen documentadas en la memoria y metadatos locales. No reintroducir notas visibles.

## Tercer minijuego: fotomatón (18 de noviembre)

- Implementado `face-game.js`/`face-game.css` con MediaPipe Tasks Vision 1.2.3, modelo local `public/vision/face_landmarker.task` y WASM de la misma versión. Carga diferida al pulsar Encender cámara. GPU con alternativa CPU. Vídeo frontal 640×480 ideal, sin micrófono, inferencia local limitada a unos 15 fps y a fotogramas nuevos.
- Cinco rondas: sonrisa, boca abierta, cejas arriba, guiño y giro a cualquier lado. Calibración de 24 muestras, umbral relativo al reposo, gesto sostenido 0,9 s (0,6 s con ayuda), descanso de 1 s entre rondas. Guiño sustituible por boca abierta. Ausencia o varias caras detienen avance.
- Fotos efímeras en canvas; se eliminan al cerrar/reiniciar. Tracks detenidos al terminar, cerrar, reiniciar o salir de página. Pausa/ocultación desactiva tracks y progreso. No se suben ni persisten fotos.
- Recorrido: pimiento → paquete pequeño izquierdo → cámara 3D → fotomatón → bola del mundo. Dos clics: abrir paquete y entrar en cámara. Botón proyectado accesible y raycasting. Alternativa Continuar sin cámara para permiso denegado/cámara ausente.
- Puerto de pruebas activo **4175**, directo **http://127.0.0.1:4175/camera.html**. `npm run dev:camera` abre ese laboratorio. Para revisar paquete: `http://127.0.0.1:4175/?preview=camera`. Web habitual sigue en 4174. `camera.html` es entrada de desarrollo; no se añade al build de producción.
- Verificación: build/diff-check; funciones de gestos con reposo/activación/giro/ausencia/múltiples caras; modelo real CPU sobre canvas vacío y GPU sobre recorte existente de María (1 cara, 52 coeficientes). Error de permiso simulado muestra reintento y salida. Apertura de paquete → fotomatón y salida sin cámara comprobadas en navegador integrado. Visor inicial revisado por captura. No se ha activado cámara física ni comprobado una sesión de cinco gestos con persona; pendiente prueba del usuario y ajuste de sensibilidad.

### Ajuste del fotomatón: lengua y duración

El usuario informa de que el guiño funciona mal y pide sacar la lengua obligatoriamente y aguantar más. Ronda 4 sustituida por lengua, retirado el botón Otro gesto. Tiempo normal 2,2 s, ayuda 1,5 s, con cuenta atrás durante el acierto. `tongue-detector.js` analiza localmente una región de boca normalizada por landmarks: componente rosada central con extensión vertical, rechazo de dientes y líneas horizontales de labios; exige apertura mínima. Es una heurística experimental de imagen, no un clasificador entrenado ni un coeficiente tongueOut de MediaPipe. Puede fallar por iluminación, labios/coloración o encuadre; pendiente prueba real del usuario y ajuste, no prometer fiabilidad total. Build y diff-check correctos, servidor 4175 responde HTTP 200. Pruebas sintéticas rechazan dientes/línea de labio/boca cerrada y admiten mancha central; no equivalen a validación de lengua humana.

## Corrección de falsos positivos y visor limpio

El usuario pasó la ronda sin sacar la lengua. Se retira completamente la heurística de color y componentes de `tongue-detector.js`. Ahora usa un clasificador ONNX de lengua fuera/dentro, derivado de face-lens (snakajima) student.onnx v1: https://huggingface.co/snakajima/face-lens/tree/v1 . El grafo local `public/vision/tongue.onnx` se extrajo con onnx.utils.extract_model(inputs=['input'], outputs=['tongue']); las otras cabezas fueron eliminadas del grafo y no se calculan. Créditos/licencia CC BY 4.0 y atribuciones en `public/vision/tongue-LICENSE.txt` y `tongue-ATTRIBUTION.csv`. Preprocesado 256×256, recorte 1,7 y shiftY −0,12, normalización ImageNet según metadatos originales. onnxruntime-web fijado 1.31.1; runtime WASM/MJS importados con ?url para que Vite los sirva/procese correctamente.

La lengua exige p>=0,93 sostenida, también con ayuda. Antes debe verse p<0,30 durante 0,4 s para armar la ronda: evita pasar cuando el modelo da un positivo constante desde el inicio. Se mantiene 2,2 s normal / 1,5 s ayuda; el contador se pone a cero al perder el gesto, no acumula intervalos separados. Inferencia asíncrona sin solapamiento, con guardas de generación/ronda/pausa/visibilidad para descartar resultados tardíos.

Ronda 5 sustituida por mano en la frente. `hand-gesture.js` carga MediaPipe Hand Landmarker local y compara dedos/nudillos con la región de frente en coordenadas relativas a la cara. Requiere varios puntos dentro y proximidad de palma. Detecta superposición 2D, no contacto físico. La instrucción pide no tapar los ojos para conservar detección facial. Eliminada pantalla/frase «Primero, al centro»; calibración inicial breve permanece automática.

Visor simplificado: contador único, cerrar, vídeo, gesto/progreso y controles. Retirados lemas, MARÍA 35mm, lente decorativa, emojis, doble contador, fotos inclinadas y frases de final.

Verificado: build y diff-check; carga real de modelos facial/manos/ONNX en navegador; fotos existentes sin lengua rechazadas (p≈0,0035 y 0,0066), tiempos ONNX ≈54–77 ms en este entorno. Pruebas de geometría sintética: sin mano/mano lateral/mano en boca rechazadas, mano en frente admitida. Captura del visor revisada. No se ha validado aún lengua fuera ni mano en frente con webcam humana; el modelo tiene evaluación publicada limitada y no garantiza exactitud total. Servidor 4175 responde 200. Próximo paso: prueba del usuario con su cámara.

## Integración modular confirmada

El usuario acepta el fotomatón y pide integrarlo conservando prueba independiente para futuros retoques. Los cinco archivos de lógica/estilo/detectores se agrupan ahora en `minigames/photobooth/`, con README de interfaz, pruebas y puntos de ajuste. `app.js` y `camera-lab.js` importan el mismo módulo; no hay copia duplicada. La clase del botón de paquete se mantiene en `style.css` de la aventura. Recorrido: pimiento → paquete → cámara → gestos → bola. Laboratorio conservado en 4175/camera.html (`npm run dev:camera`), acceso al paquete por ?preview=camera, web principal 4174 (servidor reiniciado durante esta revisión). Build correcto tras mover archivos.

- Cierre solicitado por el usuario: empaquetar toda la iteración en un commit y subir `main` a `origin`. Build y diff-check correctos. Se conservan ignorados node_modules, dist, entorno/modelos de vídeo locales y audios de trabajo de output; el MP4 servido ya contiene el audio elegido.

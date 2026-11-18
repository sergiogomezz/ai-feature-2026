# Arquitectura y animación

## Mapa del código

| Archivo | Responsabilidad |
| --- | --- |
| `index.html`, `style.css` | Sobre, interfaz mínima, diálogos, alternativa CSS y accesibilidad |
| `app.js` | Fases de la aventura, carga diferida del mundo, progreso de cinco caras y controles |
| `world.js` | Habitación Three.js, cámara, raycasting, apertura, caída y secuencia de llegada |
| `journey-map.js` | Zoom geográfico continuo con vistas locales alineadas y precarga de resoluciones vecinas |
| `palau-arrival.js` | Cámara perspectiva de entrada, fotografía con puerta abierta, público instanciado, fuegos y pasillo hasta escenario |
| `finale.js` | Viaje de Tierra al Palau, reproducción del MP4, voz original, pausa y tarjetas decorativas |
| `flying-pepper.js` | Pimiento 3D de superficie continua, gafas, alas con plumas y bufanda animada |
| `pepper-game.js` | Vuelo 3D corto, seis aros, física sencilla, ayuda, teclado/toque y variante DOM sin WebGL |
| `egg-game.js` | Caras en la habitación principal, mano articulada, proyectiles, impactos en superficies, goteo y botones proyectados |
| `royal-arrival.js` | Recorrido en fila por la puerta, giro y salida; poses de caída y movimientos secundarios |
| `royal-dogs.js` | Perros salchicha de silueta limpia: cuerpo alargado, hocico angular, orejas y patas articuladas |
| `arrival-door.js` | Hueco real en pared izquierda, puerta doble con bisagras, marco y pasillo iluminado |
| `royal-characters.js` | Modelado de los tres Reyes: rostros, pelo/barba por mechones, trajes con pliegues y bordados, manos y coronas/turbante |
| `materials.js` | Texturas procedurales y ramas/agujas instanciadas |
| `playback.js` | Velocidad global ×1/×2 para revisión en desarrollo; relojes, CSS, tweens y vídeo |
| `music.js` | Melodía y efectos Web Audio, silencio y visibilidad |
| `cursor.js`, `public/pepino*.svg` | Cuatro variantes del cursor de pepino; `public/egg-hand.svg` para la prueba |
| `archive/` | Primer prototipo, fuera del recorrido y build actuales |

Dependencias fijadas en `package.json` y lockfile. `npm ci`, `npm run dev` (127.0.0.1:4174), `npm run build`, `npm run preview`. No incorporar `node_modules/` ni `dist/` al repositorio.

## Invariantes al editar

- `app.js` coordina envelope → envelope-opening → card → arrival → wrapped → opening → opened → searching → window (abrir y enmarcar) → window-ready (esperar clic con manchas) → window (caída) → flying (pimiento) → complete (bola del árbol) → travelling → reveal. La fase `card` espera un clic o activación de teclado en `envelope-card`, sin avance automático. El contenedor `envelope` separa el botón inicial y la tarjeta (botones hermanos), y las clases `flap-open` y `card-out` se aplican en pasos consecutivos con esperas pausables. Durante llegada el regalo no acepta apertura y reinicio queda desactivado. `main` permanece inert hasta abrir el sobre.
- `app.js` mantiene esperas pausables del sobre y pausa sus animaciones CSS mediante Web Animations. Los controles están fuera de `main[inert]` para usarlos desde el sobre. `world.setPaused` pausa los tweens de Anime.js y el reloj de movimientos ambientales; las nuevas animaciones respetan la pausa. Reinicio reanuda antes de cancelar.
- El juego de huevos recibe la escena y cámara reales de `world.js`: no crea otro escenario. Captura superficies de la habitación antes de añadir caras, efectos y mano. `startEggGame` bloquea regalo/ventana pero mantiene OrbitControls para mirar; un arrastre de más de 8 px no lanza. `stopEggGame` limpia caras/manchas/mano y restaura la cámara y los límites de órbita.
- La mano se adjunta a la cámara. Cada lanzamiento tiene preparación, liberación a los 280 ms, vuelo de 550 ms y recarga; la cola separa gestos para que cada huevo salga de la mano. El reloj de pausa congela mano, proyectiles, goteo y fin de prueba. Movimiento reducido mantiene la mano quieta y elimina la parábola.
- Los impactos usan raycasting real contra caras y objetos visibles de la habitación. La transparencia del recorte se comprueba por alfa; las manchas se orientan por la normal de la superficie. Los botones invisibles se proyectan sobre cada cara y quedan recortados si están ocultos/fuera de vista. Foco de teclado y ayuda pueden reencuadrar una cara. La proyección y oclusión se recalculan al cambiar la cámara o el viewport, no si está quieta.
- El recurso `public/maria-head-cutout.png` se precarga y se comparte como textura entre las cinco caras. Procedencia y prompt: [recorte de María](recorte-maria.md).
- `world.revealGlobe()` muestra un adorno físico con textura de Tierra, casquillo, luz y halo azul. Se revela tras completar el vuelo y pulsar «Volver al árbol»; tiene raycasting y botón proyectado `tree-globe` para toque/teclado. `reset` lo vuelve a ocultar. La variante sin WebGL usa un botón con apariencia de bola sobre el árbol CSS.
- El final comparte renderer, pero tiene escena/cámara y reloj rAF propios. El bucle de la habitación deja de dibujar cuando está activo. Viaje de 36,5 s: Tierra 8K, dos vueltas (6,5 s), zoom exponencial continuo (16 s) y vista aérea recreada del Palau con Barcelona de fondo (14 s, con mezcla inicial de 1,3 s). Se mezcla a cartografía solo cuando el continente llena la pantalla; sin velo blanco. `journey-map.js` superpone exportaciones centradas en 41.3634, 2.1526, todas EPSG:3857, con extensión de 8 000 000 m a 976,6 m y encuadre final 850 m. Carga/decodifica resoluciones vecinas y libera las anteriores; sin mapas externos en ejecución. Con movimiento reducido se muestran dos vistas estáticas y se pasa al vídeo.
- `world.startFinale` guarda la habitación; `reset/stopFinale` detiene vídeo/rAF y restaura cámara. La pausa y ocultación de pestaña detienen la película y el reloj. El mensaje arranca respetando silencio; el botón de escuchar/repetir activa sonido por gesto del usuario. `music.setDucked` atenúa los efectos mientras habla el vídeo (la melodía de fondo está retirada). Un `ended` válido inicia la espera pausable de 3,5 s antes de revelar exactamente dos tarjetas HTML; las continuaciones de reproducción comprueban que siga activo para no reactivar audio tras reiniciar.
- `?preview=finale` es exclusivamente de desarrollo (`import.meta.env.DEV`): deja la bola del árbol desbloqueada para revisar el final. No se incluye en producción ni añade un botón de saltar la llegada.
- Las secuencias de cámara de `world.js` bloquean OrbitControls y usan `sequence` para invalidar continuaciones antiguas. Cancelar pausa tweens y resuelve esperas; conservar esa salida para evitar promesas colgadas o diálogos que se abran tras reiniciar.
- Respetar movimiento reducido en duración y movimiento continuo. No añadir un botón de saltar la llegada.
- El regalo se adjunta al portador durante la llegada; al entregarlo, `scene.attach` conserva su posición mundial antes de animarlo al árbol. Restaurar padre, escala y pose al terminar/cancelar. El balanceo habitual del regalo solo actúa cuando está envuelto y el mundo no está ocupado.
- La caja tiene cinco caras, abierta por arriba. No añadir geometría de techo o cintas atravesando el hueco por el que entra la cámara.
- Mantener cámara suficientemente abierta para ver al Rey tumbado en el suelo, también en móvil. La caída y vuelta a la montura se interpolan con `motion.stumble`; no confundirlas con el trote continuo.
- Mantener equivalentes de teclado del regalo y los minijuegos, foco visible y raycasting para el cursor ampliado. El cursor nativo no debe capturar eventos.
- El fallo de WebGL no debe dejar la aplicación bloqueada en el sobre o la llegada. El audio es opcional; la carta intenta autoplay y reintenta por gesto si el navegador lo bloquea.

## Comprobar según el cambio

Ejecutar build y revisar el recorrido afectado. Para secuencias: sobre → llegada completa → regalo, apertura/cierre de nota, ventana/retorno y reinicio durante transiciones cancelables. Para el final: viaje/pausa/reanudación, reproducción de vídeo, activación de sonido, dos tarjetas legibles y reinicio antes de llegar al escenario sin diálogo tardío. Para pistas: repetir una cara no suma, fallar mancha el objeto alcanzado sin sumar, cinco caras permanecen manchadas, abren la ventana y esperan clic antes de arrancar la caída y el vuelo, sin abrir un diálogo y reinicio limpia progreso/manchas/cursor incluso durante la espera de fin. Revisar escritorio y móvil si cambia el encuadre. La llegada dura unos 27,3 segundos más el sobre: esperar a su final real para comprobar desbloqueo.

En Orca, usar la skill `orca-cli` para navegador y capturas. No fijar IDs de pestaña o terminal en esta memoria: cambian por sesión. Registrar únicamente verificaciones realmente realizadas y sus limitaciones en `estado.md`.

## Ventana y pimiento (estado vigente, 18 de noviembre)

- Ventana con dos hojas y bisagras Three.js: apertura/enmarcado de 1,6 s y cortinas al viento → espera de clic con manchas → acercamiento de 1,1 s → cruce de 0,7 s → caída por cielo separado → juego. `world.fall()` devuelve éxito y usa la secuencia cancelable/pausable existente. La ventana ya no es un desvío clicable antes de acabar los huevos; reinicio cierra ambas hojas.
- `pepper-game.js` comparte renderer con la habitación, con escena y cámara ortográfica propias. Su rAF solo avanza visible y sin pausa; el bucle de habitación cede mientras está activo. `stopPepperGame` devuelve la cámara guardada.
- Un pimiento rojo modelado con lóbulos, tallo, ojos y alas, aros dorados y nubes. Seis aciertos; un fallo recicla el aro sin quitar progreso. Tocar, espacio, flecha arriba o Enter sobre «Aletear» impulsan hacia arriba. Ayuda opcional sigue la altura del aro. Movimiento reducido elimina aleteo/nubes/rotación, ralentiza aros y activa ayuda inicialmente. Sin WebGL, misma física e interfaz con representación DOM.
- `?preview=eggs` revisa huevos → ventana → vuelo; `?preview=pepper` abre/enmarca la ventana y espera clic; `?preview=finale` conserva el acceso a la bola. Los tres son solo de desarrollo y no se incluyen en producción.

## Control ×2 de desarrollo

Botón `speed` junto a pausa, visible únicamente con `import.meta.env.DEV`. `playback.js` publica velocidad y suscripciones; los relojes multiplican delta, Anime.js recibe `playbackRate` al crear y `.speed` al cambiar, y el vídeo usa `playbackRate`. Las esperas almacenan milisegundos lógicos y recalculan su temporizador al cambiar velocidad o pausar. Un MutationObserver actualiza la velocidad de animaciones CSS que nacen después. Mantener ×1 en producción y conservar independencia de pausa/velocidad.

La vista `journey-aerial` se conserva tras el zoom geográfico: escala acotada por resolución (máximo 1,28×), reloj compartido con pausa/×2, sin giro ni zoom en movimiento reducido. Ocultar/restaurar en inicio, reinicio y paso al escenario.

La puerta está en x=-7, abertura z=1,2–4 y altura 3,15. La pared se construye por segmentos; no tapar el hueco con otra pared. Desfile a escala 1 también en móvil, cruces en z=2,6; se abre antes de cruzar y cierra después de la última cola. Salen por la misma puerta tras girar 180°. `playArrival` interpola cámara y punto de mirada al encuadre de puerta y, al final, hasta `savedPosition`/`savedTarget` durante 2,2 s antes de `finishArrival`/`restore`. Mantener el encuadre amplio en móvil hasta terminar de entrar/salir y conservar pausa, ×2 y cancelación del sistema de tweens.

Impactos de huevos: `onImpact` es independiente de `onHit` y ocurre al romperse el huevo, incluso en superficies o caras ya acertadas. `app.js` controla el pool de `cartoonsplash.mp3` con sonido/pausa/fase. No conectar el sonido al clic de lanzamiento ni sólo al contador de aciertos. Puerta doble: `arrivalDoor.update()` sincroniza la segunda hoja con la bisagra principal; límite de apertura 0,46π para no atravesar el pasillo. `finishArrival` cierra y sincroniza ambas antes de restaurar.

## Ventana por clic, vuelo con colisión y final pausado (18 de noviembre)

`eggGame.settle()` conserva `root` y `effects`, oculta mano/botones y deja escurrir las manchas; `stop()` sólo limpia al saltar/reiniciar. `prepareWindow()` abre casements, aumenta `wind.strength` y enmarca suavemente la ventana usando cámara/target durante 1,6 s. `windowFraming` bloquea controles durante ese movimiento. Las cortinas deforman sus vértices con anclaje superior y reloj pausable, sin ondulación continua con movimiento reducido. `window-jump` se proyecta sobre el cristal y también admite teclado; fase `window-ready` espera indefinidamente. `fall()` limpia huevos conservando la pose de cámara actual antes de acercarse/cruzar; restaura la habitación original al acabar. Reinicio cancela tweens, oculta botón, cierra ventana y devuelve cortinas a reposo.

Pimiento: reloj local ×2 sobre `getPlaybackRate()` (normal actual = antiguo ×2); el control de revisión sigue siendo ×1/×2 global. Física con subpasos de máximo 16 ms. Cruce del plano del aro: cuerpo completo debe caber dentro de radio 1,045; tocar la llanta produce rebote/aviso y repone ese aro sin sumar ni perder progreso. Cuenta tras salir la cola del cuerpo, no al llegar su centro. Tamaño adaptado al móvil con colisión equivalente. Ayuda sigue altura y permite seis aciertos. La variante sin WebGL usa SVG propio y la misma física.

Final: Palau 14 s; vídeo `.playbackRate = getPlaybackRate() * .65`, `preservesPitch=true`; 2,5 s de presentación antes del vídeo y 3,5 s de pausa sobre su fotograma final antes de revelar tarjetas. Reloj de fase `stage` usa delta real (sin el límite de 100 ms de la Tierra) para evitar que la limitación de frames de un póster estático alargue las esperas artificialmente. Pausa, visibilidad, repetición y reinicio conservan las guardas de reproducción.

## Revisión posterior: entrada en primera persona (vigente)

Sustituye las duraciones anteriores del Palau. `finale.js` mantiene Tierra/mapa hasta 22,5 s y cede a `palau-arrival.js` durante 32 s. `journey-map.js` expone `element` para inclinar suavemente la cartografía mientras desaparece. La fotografía aérea se conserva como plano Three.js, con un hueco de puerta por shader y pasillo real detrás. Personas: 320 instancias por cabeza/cuerpo y 640 por cada par de extremidades; materiales compartidos. Siete explosiones de 100 partículas, sin destellos de pantalla. Todas las poses se derivan del reloj lógico de finale, respetando pausa/ocultación/velocidad. Aproximación de movimiento reducido estática; render canvas de respaldo sin WebGL. Llegada: 3 s de mezcla desde mapa; público desde 3 s, fuegos desde 5 s, descenso desde 8 s, paseo desde 21 s y mezcla al escenario 29–32 s. La escena teatral conserva espera inicial 2,5 s y posterior 3,5 s.

El MP4 servido es `quevedo-message.mp4`, empaquetado con `output/final_voice.wav` y el vídeo anterior ralentizado hasta 7,512 s. `filmSpeed=1`, audio a velocidad original, sin subtítulo de la frase antigua. Se conserva etiqueta de IA. No se ha generado nueva sincronización labial.

Pimiento: radio de aro 1,75/interior 1,675 y alturas ±0,8. Mantener coherencia de geometría, colisiones y fallback DOM. La cara antes situada sobre la ventana está en [-5.5,1.05,-3.12]. El diseño nuevo elimina gafas/bufanda.

## Fotomatón

`face-game.js` exporta createFaceGame(start/stop/setPaused); `face-gestures.js` contiene mediciones y umbrales; `face-game.css` el visor. `camera.html` + `camera-lab.js` son laboratorio directo de desarrollo en 4175. Recursos del modelo/WASM locales, paquete fijado 1.2.3. No cambiar de versión de paquete sin actualizar WASM. `app.js`: camera-package → camera-ready → camera-playing → complete. `world.js` tiene reveal/open/hideCameraPackage, modelo de cámara y botón proyectado. El cierre devuelve al paquete; completar o continuar sin cámara desbloquea la bola. Reset cierra captura y elimina fotos. Promesas de permisos/modelo protegidas por generación para que cerrar no reactive cámara tarde. El reloj de gestos usa tiempo real, independiente del ×2 global.

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

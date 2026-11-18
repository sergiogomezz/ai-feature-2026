# Arquitectura y animación

## Mapa del código

| Archivo | Responsabilidad |
| --- | --- |
| `index.html`, `style.css` | Sobre, interfaz mínima, diálogos, alternativa CSS y accesibilidad |
| `app.js` | Fases de la aventura, carga diferida del mundo, progreso de cinco caras y controles |
| `world.js` | Habitación Three.js, cámara, raycasting, apertura, caída y secuencia de llegada |
| `journey-map.js` | Zoom geográfico continuo con vistas locales alineadas y precarga de resoluciones vecinas |
| `finale.js` | Viaje de Tierra al Palau, reproducción del MP4, voz original, pausa y tarjetas decorativas |
| `pepper-game.js` | Vuelo 3D corto, seis aros, física sencilla, ayuda, teclado/toque y variante DOM sin WebGL |
| `egg-game.js` | Caras en la habitación principal, mano articulada, proyectiles, impactos en superficies, goteo y botones proyectados |
| `royal-arrival.js` | Reyes y perros articulados; poses de caída y movimientos secundarios |
| `materials.js` | Texturas procedurales y ramas/agujas instanciadas |
| `playback.js` | Velocidad global ×1/×2 para revisión en desarrollo; relojes, CSS, tweens y vídeo |
| `music.js` | Melodía y efectos Web Audio, silencio y visibilidad |
| `cursor.js`, `public/pepino*.svg` | Cuatro variantes del cursor de pepino; `public/egg-hand.svg` para la prueba |
| `archive/` | Primer prototipo, fuera del recorrido y build actuales |

Dependencias fijadas en `package.json` y lockfile. `npm ci`, `npm run dev` (127.0.0.1:4174), `npm run build`, `npm run preview`. No incorporar `node_modules/` ni `dist/` al repositorio.

## Invariantes al editar

- `app.js` coordina envelope → envelope-opening → card → arrival → wrapped → opening → opened → searching → window (apertura y caída) → flying (pimiento) → complete (bola del árbol) → travelling → reveal. La fase `card` espera un clic o activación de teclado en `envelope-card`, sin avance automático. El contenedor `envelope` separa el botón inicial y la tarjeta (botones hermanos), y las clases `flap-open` y `card-out` se aplican en pasos consecutivos con esperas pausables. Durante llegada el regalo no acepta apertura y reinicio queda desactivado. `main` permanece inert hasta abrir el sobre.
- `app.js` mantiene esperas pausables del sobre y pausa sus animaciones CSS mediante Web Animations. Los controles están fuera de `main[inert]` para usarlos desde el sobre. `world.setPaused` pausa los tweens de Anime.js y el reloj de movimientos ambientales; las nuevas animaciones respetan la pausa. Reinicio reanuda antes de cancelar.
- El juego de huevos recibe la escena y cámara reales de `world.js`: no crea otro escenario. Captura superficies de la habitación antes de añadir caras, efectos y mano. `startEggGame` bloquea regalo/ventana pero mantiene OrbitControls para mirar; un arrastre de más de 8 px no lanza. `stopEggGame` limpia caras/manchas/mano y restaura la cámara y los límites de órbita.
- La mano se adjunta a la cámara. Cada lanzamiento tiene preparación, liberación a los 280 ms, vuelo de 550 ms y recarga; la cola separa gestos para que cada huevo salga de la mano. El reloj de pausa congela mano, proyectiles, goteo y fin de prueba. Movimiento reducido mantiene la mano quieta y elimina la parábola.
- Los impactos usan raycasting real contra caras y objetos visibles de la habitación. La transparencia del recorte se comprueba por alfa; las manchas se orientan por la normal de la superficie. Los botones invisibles se proyectan sobre cada cara y quedan recortados si están ocultos/fuera de vista. Foco de teclado y ayuda pueden reencuadrar una cara. La proyección y oclusión se recalculan al cambiar la cámara o el viewport, no si está quieta.
- El recurso `public/maria-head-cutout.png` se precarga y se comparte como textura entre las cinco caras. Procedencia y prompt: [recorte de María](recorte-maria.md).
- `world.revealGlobe()` muestra un adorno físico con textura de Tierra, casquillo, luz y halo azul. Se revela tras completar el vuelo y pulsar «Volver al árbol»; tiene raycasting y botón proyectado `tree-globe` para toque/teclado. `reset` lo vuelve a ocultar. La variante sin WebGL usa un botón con apariencia de bola sobre el árbol CSS.
- El final comparte renderer, pero tiene escena/cámara y reloj rAF propios. El bucle de la habitación deja de dibujar cuando está activo. Viaje de 28,5 s: Tierra 8K, dos vueltas (6,5 s), zoom exponencial continuo (16 s) y vista aérea recreada del Palau con Barcelona de fondo (6 s, con mezcla inicial de 1,3 s). Se mezcla a cartografía solo cuando el continente llena la pantalla; sin velo blanco. `journey-map.js` superpone exportaciones centradas en 41.3634, 2.1526, todas EPSG:3857, con extensión de 8 000 000 m a 976,6 m y encuadre final 850 m. Carga/decodifica resoluciones vecinas y libera las anteriores; sin mapas externos en ejecución. Con movimiento reducido se muestran dos vistas estáticas y se pasa al vídeo.
- `world.startFinale` guarda la habitación; `reset/stopFinale` detiene vídeo/rAF y restaura cámara. La pausa y ocultación de pestaña detienen la película y el reloj. El mensaje arranca respetando silencio; el botón de escuchar/repetir activa sonido por gesto del usuario. `music.setDucked` baja la caja de música mientras habla el vídeo. Un `ended` válido revela exactamente dos tarjetas HTML; las continuaciones de reproducción comprueban que siga activo para no reactivar audio tras reiniciar.
- `?preview=finale` es exclusivamente de desarrollo (`import.meta.env.DEV`): deja la bola del árbol desbloqueada para revisar el final. No se incluye en producción ni añade un botón de saltar la llegada.
- Las secuencias de cámara de `world.js` bloquean OrbitControls y usan `sequence` para invalidar continuaciones antiguas. Cancelar pausa tweens y resuelve esperas; conservar esa salida para evitar promesas colgadas o diálogos que se abran tras reiniciar.
- Respetar movimiento reducido en duración y movimiento continuo. No añadir un botón de saltar la llegada.
- El regalo se adjunta al portador durante la llegada; al entregarlo, `scene.attach` conserva su posición mundial antes de animarlo al árbol. Restaurar padre, escala y pose al terminar/cancelar. El balanceo habitual del regalo solo actúa cuando está envuelto y el mundo no está ocupado.
- La caja tiene cinco caras, abierta por arriba. No añadir geometría de techo o cintas atravesando el hueco por el que entra la cámara.
- Mantener cámara suficientemente abierta para ver al Rey tumbado en el suelo, también en móvil. La caída y vuelta a la montura se interpolan con `motion.stumble`; no confundirlas con el trote continuo.
- Mantener equivalentes de teclado del regalo y los minijuegos, foco visible y raycasting para el cursor ampliado. El cursor nativo no debe capturar eventos.
- El fallo de WebGL no debe dejar la aplicación bloqueada en el sobre o la llegada. El audio es opcional y nace de interacción del usuario.

## Comprobar según el cambio

Ejecutar build y revisar el recorrido afectado. Para secuencias: sobre → llegada completa → regalo, apertura/cierre de nota, ventana/retorno y reinicio durante transiciones cancelables. Para el final: viaje/pausa/reanudación, reproducción de vídeo, activación de sonido, dos tarjetas legibles y reinicio antes de llegar al escenario sin diálogo tardío. Para pistas: repetir una cara no suma, fallar mancha el objeto alcanzado sin sumar, cinco caras abren la ventana y arrancan el vuelo tras el impacto final, sin abrir un diálogo y reinicio limpia progreso/manchas/cursor incluso durante la espera de fin. Revisar escritorio y móvil si cambia el encuadre. La llegada dura unos 21,1 segundos más el sobre: esperar a su final real para comprobar desbloqueo.

En Orca, usar la skill `orca-cli` para navegador y capturas. No fijar IDs de pestaña o terminal en esta memoria: cambian por sesión. Registrar únicamente verificaciones realmente realizadas y sus limitaciones en `estado.md`.

## Ventana y pimiento (17 de noviembre)

- Ventana con dos hojas de cristal y marcos sobre bisagras Three.js: acercamiento 1,1 s → apertura 1,05 s → cruce 0,7 s → caída por cielo separado → juego. `world.fall()` devuelve éxito y usa la secuencia cancelable/pausable existente. La ventana ya no es un desvío clicable antes de acabar los huevos; reinicio cierra ambas hojas.
- `pepper-game.js` comparte renderer con la habitación, con escena y cámara ortográfica propias. Su rAF solo avanza visible y sin pausa; el bucle de habitación cede mientras está activo. `stopPepperGame` devuelve la cámara guardada.
- Un pimiento rojo modelado con lóbulos, tallo, ojos y alas, aros dorados y nubes. Seis aciertos; un fallo recicla el aro sin quitar progreso. Tocar, espacio, flecha arriba o Enter sobre «Aletear» impulsan hacia arriba. Ayuda opcional sigue la altura del aro. Movimiento reducido elimina aleteo/nubes/rotación, ralentiza aros y activa ayuda inicialmente. Sin WebGL, misma física e interfaz con representación DOM.
- `?preview=eggs` revisa huevos → ventana → vuelo; `?preview=pepper` arranca la transición de ventana; `?preview=finale` conserva el acceso a la bola. Los tres son solo de desarrollo y no se incluyen en producción.

## Control ×2 de desarrollo

Botón `speed` junto a pausa, visible únicamente con `import.meta.env.DEV`. `playback.js` publica velocidad y suscripciones; los relojes multiplican delta, Anime.js recibe `playbackRate` al crear y `.speed` al cambiar, y el vídeo usa `playbackRate`. Las esperas almacenan milisegundos lógicos y recalculan su temporizador al cambiar velocidad o pausar. Un MutationObserver actualiza la velocidad de animaciones CSS que nacen después. Mantener ×1 en producción y conservar independencia de pausa/velocidad.

La vista `journey-aerial` se conserva tras el zoom geográfico: escala acotada por resolución (máximo 1,28×), reloj compartido con pausa/×2, sin giro ni zoom en movimiento reducido. Ocultar/restaurar en inicio, reinicio y paso al escenario.

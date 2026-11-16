# Arquitectura y animación

## Mapa del código

| Archivo | Responsabilidad |
| --- | --- |
| `index.html`, `style.css` | Sobre, interfaz mínima, diálogos, alternativa CSS y accesibilidad |
| `app.js` | Fases de la aventura, carga diferida del mundo, estrellas y controles |
| `world.js` | Habitación Three.js, cámara, raycasting, apertura, caída y secuencia de llegada |
| `royal-arrival.js` | Reyes y perros articulados; poses de caída y movimientos secundarios |
| `materials.js` | Texturas procedurales y ramas/agujas instanciadas |
| `music.js` | Melodía y efectos Web Audio, silencio y visibilidad |
| `cursor.js`, `public/pepino*.svg` | Cuatro variantes del cursor nativo |
| `archive/` | Primer prototipo, fuera del recorrido y build actuales |

Dependencias fijadas en `package.json` y lockfile. `npm ci`, `npm run dev` (127.0.0.1:4174), `npm run build`, `npm run preview`. No incorporar `node_modules/` ni `dist/` al repositorio.

## Invariantes al editar

- `app.js` coordina envelope → arrival → wrapped → opening → opened → searching → complete. Durante llegada el regalo no acepta apertura y reinicio queda desactivado. `main` permanece inert hasta abrir el sobre.
- Las secuencias de cámara de `world.js` bloquean OrbitControls y usan `sequence` para invalidar continuaciones antiguas. Cancelar pausa tweens y resuelve esperas; conservar esa salida para evitar promesas colgadas o diálogos que se abran tras reiniciar.
- Respetar movimiento reducido en duración y movimiento continuo. No añadir un botón de saltar la llegada.
- El regalo se adjunta al portador durante la llegada; al entregarlo, `scene.attach` conserva su posición mundial antes de animarlo al árbol. Restaurar padre, escala y pose al terminar/cancelar. El balanceo habitual del regalo solo actúa cuando está envuelto y el mundo no está ocupado.
- La caja tiene cinco caras, abierta por arriba. No añadir geometría de techo o cintas atravesando el hueco por el que entra la cámara.
- Mantener cámara suficientemente abierta para ver al Rey tumbado en el suelo, también en móvil. La caída y vuelta a la montura se interpolan con `motion.stumble`; no confundirlas con el trote continuo.
- Mantener equivalentes de teclado del regalo y ventana, foco visible y raycasting para el cursor ampliado. El cursor nativo no debe capturar eventos.
- El fallo de WebGL no debe dejar la aplicación bloqueada en el sobre o la llegada. El audio es opcional y nace de interacción del usuario.

## Comprobar según el cambio

Ejecutar build y revisar el recorrido afectado. Para secuencias: sobre → llegada completa → regalo, apertura/cierre de nota, ventana/retorno y reinicio durante transiciones cancelables. Para pistas: una estrella no cuenta dos veces, tres estrellas abren Barcelona y reinicio limpia progreso. Revisar escritorio y móvil si cambia el encuadre. La llegada dura unos 21,1 segundos más el sobre: esperar a su final real para comprobar desbloqueo.

En Orca, usar la skill `orca-cli` para navegador y capturas. No fijar IDs de pestaña o terminal en esta memoria: cambian por sesión. Registrar únicamente verificaciones realmente realizadas y sus limitaciones en `estado.md`.

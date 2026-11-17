# Estado actual y continuación

Actualizado: 2026-11-16. Memoria compactada tras la última petición del usuario; este archivo sustituye el historial cronológico de iteraciones.

## Recorrido vigente

Sobre «Feliz Navidad» que se agita → abrir solapa → tarjeta «Para María» sale y espera clic → Reyes borrachos en perros salchicha → regalo → nota → cinco caras de María a huevazos por la misma habitación → aparece una bola del mundo brillante en el árbol → clic en esa bola → dos vueltas al planeta, parada orientada a Barcelona y acercamiento → Palau → vídeo de escenario → dos tarjetas decorativas.

**Último cambio solicitado:** la bola debe ser un adorno nuevo del árbol, sin diálogo de Barcelona. El mundo gira dos vueltas antes de centrarse; no hay punto amarillo y el zoom no debe mostrar píxeles. No añadir nuevos minijuegos, regenerar vídeo ni cambiar el resto del recorrido para esta iteración.

## Implementación y límites

- Vite + Three.js + Anime.js. Sobre en DOM; habitación y personajes 3D con materiales físicos. No es fotorrealismo terminado.
- La solapa abre antes de salir la tarjeta. Dos botones hermanos, sin botones anidados. La tarjeta espera clic o Enter.
- Llegada de Reyes de unos 21,1 s, caída cómica visible, sin botón de saltar. Regalo bloqueado hasta terminar.
- Cámara entra en caja hueca antes de mostrar nota. Cerrar nota restaura cámara. Ventana conserva una caída provisional con retorno a la habitación.
- Cinco recortes de `public/maria-head-cutout.png` repartidos en paredes/cuadro/ventana. Mano articulada, preparación y liberación de huevo, vuelo, impactos por raycasting, clara/yema/cáscaras y goteo. Cinco aciertos únicos; los fallos manchan sin sumar. Ayuda y teclado reencuadran pendientes; arrastrar no dispara.
- Al acabar, `world.revealGlobe()` hace aparecer un adorno Tierra con casquillo, brillo y halo azul en el árbol. `tree-globe` es su botón proyectado; también hay raycasting y alternativa CSS. El viaje no empieza hasta pulsarlo.
- `finale.js`: dos vueltas exactas (4π, 6,5 s) y luego 3 s de acercamiento acotado. Textura Tierra 8192×4096 de Solar System Scope, CC BY 4.0, crédito visible. Se elimina marcador/punto/anillo amarillo del planeta. El aumento de la foto aérea se limita según sus píxeles disponibles; no se promete zoom cartográfico continuo. Viaje total 19 s.
- Final aéreo y escenario son recreaciones de ImageGen. El vídeo se generó localmente con LTX-2.3 Q4/MLX: 768×448, 97 frames/24 fps, 4,04 s, H.264/AAC, unos 450 KB. Sostiene dos tarjetas y acerca una a cámara; la web completa las dos tarjetas con texto legible.
- Frase: «María… tengo una cosina para ti». Voz **sintética original** de macOS Eddy en español, no clonada de Quevedo. Etiqueta visible de IA. No existe permiso para reproducir la voz exacta del artista.
- Dos tarjetas: «ENTRADA PARA QUEVEDO» y «Martes, 6 de julio de 2027». Palau Sant Jordi · Barcelona fuera de tarjetas. Sin QR, asientos, sector ni códigos. Las entradas reales permanecen privadas con el usuario.
- Pausa superior detiene CSS, esperas, gestos, vuelo/goteo, viaje y vídeo. Reinicio cancela y limpia; recargar repite sobre. Sonido opcional; música original Web Audio, volumen reducido durante saludo. Alternativa de movimiento reducido: vistas estáticas y paso al vídeo, sin giro ni zoom rápido.
- Título de navegador exactamente `feature`. Sin persistencia ni despliegue.

## Trabajo local y revisión

- Carpeta de trabajo: `/Users/sergiogomez/orca/workspaces/regalo-maria-2026/video`.
- Servidor usado: **http://127.0.0.1:4175/**. El 4174 corresponde a otra carpeta/servidor; no confundirlos.
- `?preview=finale` solo en desarrollo: deja la bola del árbol desbloqueada. Vite elimina el atajo del build de producción.
- Cierre solicitado por el usuario: commit, push e integración en `main`, borrar la rama `video` una vez integrada. Esta carpeta se conserva con los modelos y queda en HEAD separado al borrar su rama. Para seguir aquí mañana, crear una rama nueva desde `main` antes de hacer commits; el checkout principal de `main` está en `/Users/sergiogomez/Repos/cosas-random/regalo-maria-2026`.
- `npm run build`. Browser de Orca mediante skill `orca-cli`; no guardar IDs de pestaña/terminal.
- `.local-video/` está ignorado por Git y fuera del build: herramientas y unos 27 GB de modelos locales ya descargados. No volver a descargar ni instalar si no hace falta. No se ha contratado ningún servicio de vídeo de pago.
- Para vídeo: [recursos/prompts](final-assets.md) y `scripts/VIDEO.md`. Para otras ediciones: [arquitectura](arquitectura.md). Decisiones de usuario: [experiencia](experiencia.md).

## Verificación

Previo a esta iteración: recorrido completo hasta dos tarjetas en escritorio 1280×800 y móvil emulado 390×844; vídeo real decodificado y revisado en fotogramas; reproducción, activar sonido, pausa con `currentTime` congelado, fin/revelación y reinicio sin acciones tardías comprobados. Título `feature`. Build correcto.

Última iteración: build correcto; textura comprobada 8192×4096. Recorrido real hasta terminar cinco caras: aparece el adorno en el árbol, cero diálogos abiertos, viaje todavía oculto. Clic real en el adorno inicia el viaje; contador de giro llega exactamente a 2, se detiene con rótulo Barcelona, pausa congela el giro. Captura del planeta revisada sin marcador amarillo. Continúa hasta el MP4 sin error y las dos tarjetas. No se ha repetido prueba en teléfono físico, fallo WebGL forzado ni evaluación de oído.

## Próximo paso

Revisión del usuario de esta transición. Mantener presupuesto cero y entradas auténticas privadas. La voz exacta de Quevedo sigue sin hacerse; no sustituir la voz original por clonación sin autorización. No reabrir investigación de herramientas ni regenerar recursos si el siguiente pedido es solo de interfaz o animación.

## Generador TTS estándar (2026-11-17)

Petición vigente: preparar el entorno uv y TTS estándar. Añadidos `pyproject.toml`, `uv.lock`, `.venv` ignorado y `voice_generator.py`. Python 3.10/3.11; Edge TTS online con Álvaro español, rate -18%, pitch -12Hz configurables. Exporta WAV PCM16 mono 24 kHz a `output/final_voice.wav`, con temporales y publicación atómica. FFmpeg incluido vía imageio-ffmpeg; sin GPU ni modelos externos. Instrucciones en README. No modifica el MP4 del final. No hay inferencia RVC ni conversión de identidad vocal.

Verificado: uv sync con Python 3.11 ARM64, ayuda CLI, rechazo de texto vacío y síntesis online real de prueba. WAV decodificado y comprobado PCM16 mono/24 kHz, con duración positiva. Sin evaluación de oído ni ejecución en Python 3.10. No se repite build web porque no cambia el código del navegador.

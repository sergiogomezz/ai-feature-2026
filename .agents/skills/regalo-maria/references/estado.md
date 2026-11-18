# Estado actual y continuación

Actualizado: 2026-11-18. Memoria compactada tras la última petición del usuario; este archivo sustituye el historial cronológico de iteraciones.

## Recorrido vigente

Sobre «Feliz Navidad» que se agita → abrir solapa → tarjeta «Para María» sale y espera clic → Reyes borrachos en perros salchicha → regalo → nota → cinco caras de María a huevazos por la misma habitación → ventana con hojas que se abren → caída entre nubes → pimiento volador por seis aros → volver al árbol → aparece una bola del mundo brillante en el árbol → clic en esa bola → dos vueltas al planeta, parada orientada a Barcelona y acercamiento → Palau → vídeo de escenario → dos tarjetas decorativas.

**Último cambio solicitado:** tras los huevos, animar la apertura de la ventana y la caída a un minijuego sencillo de un pimiento volador que pasa por aros (17 de noviembre). Sustituye el paso directo de huevos a bola; el final se conserva después del vuelo.

## Implementación y límites

- Vite + Three.js + Anime.js. Sobre en DOM; habitación y personajes 3D con materiales físicos. No es fotorrealismo terminado.
- La solapa abre antes de salir la tarjeta. Dos botones hermanos, sin botones anidados. La tarjeta espera clic o Enter.
- Llegada de Reyes de unos 21,1 s, caída cómica visible, sin botón de saltar. Regalo bloqueado hasta terminar.
- Cámara entra en caja hueca antes de mostrar nota. Cerrar nota restaura cámara. Ventana con dos hojas reales sobre bisagras; al terminar los huevos abre y da paso al vuelo.
- Cinco recortes de `public/maria-head-cutout.png` repartidos en paredes/cuadro/ventana. Mano articulada, preparación y liberación de huevo, vuelo, impactos por raycasting, clara/yema/cáscaras y goteo. Cinco aciertos únicos; los fallos manchan sin sumar. Ayuda y teclado reencuadran pendientes; arrastrar no dispara.
- Tras seis aros y pulsar «Volver al árbol», `world.revealGlobe()` hace aparecer un adorno Tierra con casquillo, brillo y halo azul en el árbol. `tree-globe` es su botón proyectado; también hay raycasting y alternativa CSS. El viaje no empieza hasta pulsarlo.
- `finale.js`: dos vueltas exactas (4π, 6,5 s) y luego 16 s de acercamiento continuo hacia Barcelona y el Palau. Textura Tierra 8192×4096 de Solar System Scope, CC BY 4.0, crédito visible. Se elimina marcador/punto/anillo amarillo del planeta. Tras llenar la pantalla con el continente, enlaza con 14 vistas cartográficas locales alineadas en EPSG:3857 y centradas en el Palau. La escala baja exponencialmente hasta un encuadre de 850 m Mercator; viaje total 28,5 s. Sin destello blanco ni salto de globo entero a foto.
- El escenario es una recreación de ImageGen. El acercamiento usa imágenes reales EOX/IGN y después recupera la vista aérea recreada del Palau con Barcelona de fondo, antes del vídeo. El vídeo se generó localmente con LTX-2.3 Q4/MLX: 768×448, 97 frames/24 fps, 4,04 s, H.264/AAC, unos 450 KB. Sostiene dos tarjetas y acerca una a cámara; la web completa las dos tarjetas con texto legible.
- Frase: «María… tengo una cosina para ti». Voz **sintética original** de macOS Eddy en español, no clonada de Quevedo. Etiqueta visible de IA. No existe permiso para reproducir la voz exacta del artista.
- Dos tarjetas: «ENTRADA PARA QUEVEDO» y «Martes, 6 de julio de 2027». Palau Sant Jordi · Barcelona fuera de tarjetas. Sin QR, asientos, sector ni códigos. Las entradas reales permanecen privadas con el usuario.
- Pausa superior detiene CSS, esperas, gestos, vuelo/goteo, viaje y vídeo. Reinicio cancela y limpia; recargar repite sobre. Sonido opcional; música original Web Audio, volumen reducido durante saludo. Alternativa de movimiento reducido: vistas estáticas y paso al vídeo, sin giro ni zoom rápido.
- Título de navegador exactamente `feature`. Sin persistencia ni despliegue.

## Trabajo local y revisión

- Carpeta actual: `/Users/sergiogomez/Repos/cosas-random/regalo-maria-2026`, rama `main`. Cierre anterior guardado en `c0618a8`; las iteraciones de ventana, pimiento, zoom, ×2 y recuperación del Palau se guardan juntas en `main` en el cierre del 18 de noviembre.
- Servidor de esta iteración: **http://127.0.0.1:4175/** en esta carpeta.
- Atajos solo en desarrollo: `?preview=eggs`, `?preview=pepper` (incluye ventana y caída), `?preview=finale`. Vite elimina los accesos de producción.
- `npm run build`. Browser de Orca mediante skill `orca-cli`; no guardar IDs de pestaña/terminal.
- `.local-video/` está ignorado por Git y fuera del build: herramientas y unos 27 GB de modelos locales ya descargados. No volver a descargar ni instalar si no hace falta. No se ha contratado ningún servicio de vídeo de pago.
- Para vídeo: [recursos/prompts](final-assets.md) y `scripts/VIDEO.md`. Para otras ediciones: [arquitectura](arquitectura.md). Decisiones de usuario: [experiencia](experiencia.md).

## Verificación

Previo a esta iteración: recorrido completo hasta dos tarjetas en escritorio 1280×800 y móvil emulado 390×844; vídeo real decodificado y revisado en fotogramas; reproducción, activar sonido, pausa con `currentTime` congelado, fin/revelación y reinicio sin acciones tardías comprobados. Título `feature`. Build correcto.

Última iteración: build correcto; textura comprobada 8192×4096. Recorrido real hasta terminar cinco caras: aparece el adorno en el árbol, cero diálogos abiertos, viaje todavía oculto. Clic real en el adorno inicia el viaje; contador de giro llega exactamente a 2, se detiene con rótulo Barcelona, pausa congela el giro. Captura del planeta revisada sin marcador amarillo. Continúa hasta el MP4 sin error y las dos tarjetas. No se ha repetido prueba en teléfono físico, fallo WebGL forzado ni evaluación de oído.

## Próximo paso

Revisión del usuario de la ventana y la dificultad del pimiento. Mantener presupuesto cero y entradas auténticas privadas. La voz exacta de Quevedo sigue sin hacerse; no sustituir la voz original por clonación sin autorización. No reabrir investigación de herramientas ni regenerar recursos si el siguiente pedido es solo de interfaz o animación.

## Generador TTS estándar (2026-11-17)

Petición vigente: preparar el entorno uv y TTS estándar. Añadidos `pyproject.toml`, `uv.lock`, `.venv` ignorado y `voice_generator.py`. Python 3.10/3.11; Edge TTS online con Álvaro español, rate -18%, pitch -12Hz configurables. Exporta WAV PCM16 mono 24 kHz a `output/final_voice.wav`, con temporales y publicación atómica. FFmpeg incluido vía imageio-ffmpeg; sin GPU ni modelos externos. Instrucciones en README. No modifica el MP4 del final. No hay inferencia RVC ni conversión de identidad vocal.

Verificado: uv sync con Python 3.11 ARM64, ayuda CLI, rechazo de texto vacío y síntesis online real de prueba. WAV decodificado y comprobado PCM16 mono/24 kHz, con duración positiva. Sin evaluación de oído ni ejecución en Python 3.10. No se repite build web porque no cambia el código del navegador.

## Ventana y pimiento (17 de noviembre)

Implementado: apertura de dos hojas con cámara acercándose, cruce y caída; vuelo 3D de un pimiento rojo con alas por seis aros. Toque/espacio/flecha arriba, sin vidas ni pérdida de progreso por fallar; ayuda opcional sigue la altura. Botón final devuelve al árbol y revela la bola existente. Se conserva el viaje al concierto. Pausa, reinicio cancelable y movimiento reducido conectados. Sin dependencias nuevas ni cambios al vídeo o voz.

Verificado en esta iteración: build y diff sin errores; recorrido real de cinco impactos únicos → apertura/caída → vuelo. Capturas revisadas en escritorio y móvil emulado 390×844. Espacio y Enter, fallo sin restar, seis aciertos con ayuda y regreso que revela la bola. Pausa del vuelo comprobada con dos PNG idénticos separados unos 8 segundos; reinicio durante apertura pausada cancela la transición y restaura regalo, sin juego tardío. Consola sin errores durante estas comprobaciones. Sin prueba en teléfono físico; variante sin WebGL y preferencia de movimiento reducido implementadas, pendientes de verificación específica. No se ha vuelto a recorrer el MP4 completo en esta iteración.

## Zoom a Barcelona y limpieza de textos (17 de noviembre)

Decisión del usuario: que el acercamiento avance poco a poco hasta la zona del Palau sin desvanecer el globo entero; quitar textos de relleno en general.

Implementado: se conserva el giro doble y se amplía el zoom a 16 s. El continente ocupa la pantalla antes de enlazar con imágenes de mayor resolución; las 14 vistas mantienen centro y escala geográfica. Europa → Cataluña → Barcelona → Montjuïc → tejado del Palau. EOxCloudless 2016 (Copernicus) y ortofotos PNOA/IGN, CC BY 4.0, atribución visible. Exportaciones locales WebP en `public/ending/maps`, unos 11 MB; sin peticiones cartográficas en ejecución ni claves/servicios de pago. `journey-map.js` precarga vistas cercanas, funde niveles alineados y libera los anteriores. `scripts/prepare-journey-maps.py` registra fuentes y reproduce las exportaciones.

Quitadas frases genéricas del viaje, de la espera del pimiento y de la revelación. Quedan instrucciones breves, progreso, nombres de lugar, datos del concierto y aclaración de recreación/entradas decorativas. Final visual aún pendiente de revisión del usuario.

Verificación de este ajuste: build y diff correctos; 14 exportaciones comprobadas a 2048×2048 y con detalle de imagen. Revisado el zoom en escritorio 1280×800 y móvil emulado 390×844; Palau centrado y tejado reconocible. Muestreo real del recorrido móvil: dos vueltas exactas, extensión geográfica decreciente en todos los pasos, paso por los niveles 0–12 con la vista 13 mezclada al final, encuadre final 850 m y cero destellos blancos. Pausa/reanudación y continuación al MP4 y las dos tarjetas comprobadas; consola sin errores. No se repitió teléfono físico ni prueba específica sin WebGL/movimiento reducido en esta iteración.

## Velocidad de revisión (18 de noviembre)

Petición: añadir ×2 junto a pausa para revisar sin esperar las animaciones completas. Implementado botón ×1/×2 solo en desarrollo (`npm run dev`), inicialmente ×1. Cambia en marcha y conserva la velocidad al reiniciar el recorrido; recargar restaura ×1. En producción permanece oculto.

`playback.js` comparte velocidad entre esperas pausables, animaciones CSS (Web Animations), tweens Anime.js existentes/nuevos, relojes de habitación/huevos/pimiento/final y vídeo. Cambiar durante pausa no reanuda nada. La música mantiene su tempo.

Verificado: build y diff correctos; sobre a ×2 medido en 1,75 s, llegada a ×2 en unos 10,7 s. Cambio ×2→×1 durante pausa del planeta mantiene el giro congelado y reanuda después; velocidad del vídeo sincronizada a ×1. Consola sin errores. Sin prueba física de móvil para este control.

## Recuperar la vista del Palau (18 de noviembre)

Corrección del usuario: conservar la vista aérea anterior del Palau con Barcelona de fondo, después del zoom geográfico. Recorrido vigente: dos vueltas → zoom progresivo hasta el tejado real del Palau → mezcla de 1,3 s a la vista aérea recreada existente → acercamiento suave en esa vista (6 s incluyendo mezcla) → vídeo anterior → dos tarjetas. Viaje total 28,5 s, respeta pausa, ×2 y movimiento reducido. No se ha regenerado imagen/vídeo ni voz.

Se actualiza la memoria para no volver a interpretar la petición de zoom continuo como autorización para eliminar esta vista. Pendientes las revisiones de acabado que el usuario quiera hacer después; no hay despliegue público solicitado todavía.

Verificado en esta recuperación: build y diff correctos; recorrido real a ×2 desde la bola, zoom hasta 850 m, mezcla a `palau-aerial.jpg` con Barcelona visible, pausa durante la mezcla, reanudación hasta MP4 y dos tarjetas. Captura revisada y consola sin errores. Sin repetición de móvil físico en este ajuste.

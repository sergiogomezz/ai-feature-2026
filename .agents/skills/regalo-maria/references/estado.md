# Estado actual

Actualizado: 2026-11-16.

## Implementado

Primer tramo jugable con Vite, Three.js y Anime.js:

- Sobre «Feliz Navidad» en cada recarga. Al abrirlo aparece la habitación y los Reyes Magos entregan el regalo montados en perros salchicha. No hay botón para saltar.
- Llegada de unos 21,1 segundos: 7 de entrada, 7,2 de caída cómica del Rey central y vuelta a su montura, 1,7 de entrega y 5,2 de salida. Personajes articulados, balanceo de borrachera, botellas y reacciones de los perros.
- Habitación 3D con materiales físicos, reflejos locales, madera, papel y tejidos procedurales, abeto con 252 ramas y 20.160 agujas instanciadas, luces cálidas y ventana azul. Actuación de dibujos animados; no es fotorrealismo terminado.
- Regalo hueco: tapa que se aparta y cámara que entra dentro antes de mostrar la nota. Cerrar la nota devuelve la cámara. Ventana interactiva con caída entre nubes y retorno provisional a la habitación.
- Nota, búsqueda de tres estrellas, ayuda, pista Barcelona y reinicio. Sin cabecera, pie ni bocadillo «Ábreme». Se abre desde el regalo, también con teclado.
- Cursor de pepino con cara: sonrisa en reposo, grito al moverse, mayor tamaño en elementos clicables. Solo puntero fino; también funciona en diálogos, sin sonido propio.
- Música original con Web Audio, opcional, nota tachada al silenciar y pausa al ocultar la pestaña.
- Título de pestaña `feature`. Movimiento reducido, controles de teclado y alternativa CSS si falla WebGL. Reiniciar reinicia las pistas; recargar repite el sobre. Sin persistencia.

El prototipo anterior con revelación, mapa y calendario está en `archive/`, fuera del build. El recorrido actual termina en Barcelona. No hay vídeo final, viaje al Palau ni despliegue.

## Verificación realizada

Build correcto. Comprobados escritorio y móvil emulado 390×844 sin desbordamiento; apertura, nota, estrellas, descubrimiento, reinicio y control musical. Verificados cámara dentro del regalo, caída de ventana y retorno, cancelación por reinicio, cursor expresivo y título. Última revisión de la llegada: ausencia de botón para saltar, Rey caído visible en el suelo y continuidad hasta abrir el regalo.

Limitaciones: audio sin evaluación de oído, rendimiento sin medir en teléfono físico. Módulo 3D de unos 214 kB gzip; Vite advierte del tamaño descomprimido superior a 500 kB.

## Siguientes iteraciones propuestas

1. Afinar el ambiente y la actuación con feedback del usuario.
2. Definir las siguientes pistas/minijuegos y conectarlas sin revelar Quevedo antes de tiempo.
3. Probar el acercamiento Tierra–Barcelona–Palau; elegir 3D estilizado, geográfico o vídeo.
4. Ensayar una recreación identificada como IA para el final antes de integrar un MP4.
5. Revisar experiencia completa, móvil físico, audio y publicación.

Las herramientas investigadas siguen siendo candidatas salvo Three.js, Anime.js y Web Audio. Consultar arquitectura para modificar las secuencias sin romper bloqueo, cancelación o cámara.

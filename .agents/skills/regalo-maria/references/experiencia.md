# Dirección creativa

Actualizado: 2026-11-16.

## Decisiones del usuario

Regalo de Reyes para su novia María: una aventura web para descubrir unas entradas de Quevedo, construida paso a paso y con memoria actualizable.

- Sobre inicial que se agita mientras espera el clic y apertura más lenta. Primero se abre la solapa; después sale una tarjeta «Para María». Debe permanecer esperando un segundo clic en la propia tarjeta antes de pasar a los Reyes (peticiones del 16 de noviembre).
- Inicio con sobre «Feliz Navidad». Al abrirlo aparecen los Reyes Magos muy borrachos montados en perros salchicha, llevando un regalo hasta el árbol.
- Llegada lenta, siempre visible y sin botón de saltar. Uno cae del perro y vuelve a subirse.
- Escena 3D, más realista, con actuación expresiva de dibujos animados. Phineas y Ferb fue referencia inicial de energía; el posterior pedido de realismo reemplaza el acabado plano/toon, sin volver a 2D.
- Pantalla limpia, sin cabecera ni pie y con poco texto. Sin bocadillo «Ábreme»: acceso desde el propio regalo.
- Al abrirlo, la cámara entra dentro de la caja; al usar la ventana, sensación de caída.
- Cursor de pepino con cara que grita al moverse y crece sobre elementos clicables. Durante el minijuego se sustituye por una mano con un huevo.
- La prueba de estrellas se reemplaza por lanzar huevos a cinco recortes de la cara de María, a partir de la foto facilitada. Van repartidos por la habitación principal, incluyendo paredes, cuadro y ventana. No se cambia a otra escena de minijuego. La mano debe hacer un gesto visible de lanzar y soltar el huevo. Al impactar se rompe y deja clara/yema escurriendo por caras y objetos. Hay que acertar las cinco (peticiones del 16 de noviembre; sustituye las dianas circulares de la versión anterior).
- Música permitida, con un mismo icono tachado cuando está desactivada.
- Botón de pausa y reanudación de animaciones junto a la música, también durante la llegada de los Reyes (petición del 16 de noviembre).
- Título de navegador exactamente `feature`, para no delatar la sorpresa.
- Pistas y posibles minijuegos hasta un final con vista del mundo que se acerca al Palau Sant Jordi. Petición vigente para el vídeo: Quevedo fotorrealista, sin dibujos, con su voz, diciendo exactamente «María… tengo una cosina para ti» y entregando dos entradas para su concierto en el Palau Sant Jordi. Primera recreación generada el 16 de noviembre con voz sintética original: no se dispone de autorización para clonar la voz del artista. La petición inicial de voz exacta sigue sin realizarse.
- Investigar herramientas abiertas y locales; distinguir ideas de implementación comprobada.
- Al acabar los minijuegos aparece una nueva bola del mundo, más brillante que los demás adornos, colgada del árbol. El viaje solo empieza al pulsarla; no hay diálogo intermedio de Barcelona. El planeta da dos vueltas, se detiene orientado a Barcelona y se acerca sin pixelar. Sin punto amarillo (última decisión del 16 de noviembre).
- No contratar herramientas ni servicios de pago para el vídeo. Viaje Tierra → acercamiento al Palau → escenario. Dos tarjetas decorativas que pongan entrada para Quevedo y la fecha del martes confirmado; las entradas auténticas se quedan privadas con el usuario (petición del 16 de noviembre).

- Nueva decisión (17 de noviembre): al acabar los huevos, la ventana se abre y la cámara cae hacia otro minijuego sencillo de un pimiento volador pasando por aros. Implementación propuesta para esta revisión: seis aros amplios, tocar/espacio para subir, sin vidas ni pérdida de progreso, ayuda opcional y regreso al árbol al completarlo.

- Último ajuste (17 de noviembre): acercamiento gradual desde el planeta hasta el Palau, sin esfumar el globo entero, y quitar textos innecesarios/«AI slop» en todo el recorrido. Mantener solo instrucciones, datos concretos y textos personales útiles.

- Revisión local (18 de noviembre): opción ×2 junto a pausa para acelerar las animaciones mientras el usuario prueba la app. Control ×1/×2 implementado en desarrollo.

- Corrección del 18 de noviembre: conservar la animación/vista aérea del Palau con Barcelona de fondo. El zoom geográfico debe desembocar en ella y después enlazar con el vídeo ya hecho; no eliminarla al mejorar el acercamiento.

## Datos de compra confirmados

- Quevedo — El Baifo Tour.
- Martes, 6 de julio de 2027, 20:30, Europe/Madrid.
- Palau Sant Jordi, Passeig Olímpic 5, 08038 Barcelona.
- Organizador: LIVING LIVE, A.I.E., C/ Doctor Carulla, 40-42, 08017 Barcelona, España.
- Dos entradas, confirmado por el usuario el 16 de noviembre. Asientos, sector y duración no proporcionados.
- Reyes 2027 se deduce del contexto; el nombre del repositorio incluye 2026 y no modifica la fecha del concierto.

## Propuestas abiertas del asistente

- Tres pruebas breves, unos 3–5 minutos en total, con ayuda opcional. Postal en piezas, secuencia de luces o pista musical son posibles mecánicas para las siguientes pruebas; la primera ya son caras de María a huevazos por la habitación.
- Mantener el artista como sorpresa hasta el final. Navidad cálida → cielo → concierto.
- Viaje Tierra → Europa → Barcelona → Montjuïc → Palau, mediante 3D o planos prerenderizados; cartografía en directo opcional.
- Después del vídeo, fecha, recinto y dedicatoria, reutilizando mapa/calendario del prototipo.
- Posible siguiente iteración del vídeo: pulir fidelidad facial, voz original y gesto de entrega según revisión del usuario. La primera versión local ya existe; consultar estado y recursos del final.
- El minijuego del pimiento queda conectado al árbol al terminar; se puede revisar su dificultad y acabado.

## Pendiente de definir

Validación del primer vídeo, acabado definitivo, siguientes mecánicas, recuerdos personales, dispositivo principal, alojamiento y entrega del enlace. El vídeo existente es una recreación con IA y voz original sintética, no un saludo auténtico del artista.

Consultar [estado](estado.md) para lo implementado y comprobado; no interpretar las propuestas como decisiones aceptadas.

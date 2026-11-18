# Dirección creativa

Actualizado: 2026-11-18.

## Decisiones del usuario

Regalo de Reyes para su novia María: una aventura web para descubrir unas entradas de Quevedo, construida paso a paso y con memoria actualizable.

- Sobre inicial que se agita mientras espera el clic y apertura más lenta. Primero se abre la solapa; después sale una tarjeta «Para María». Debe permanecer esperando un segundo clic en la propia tarjeta antes de pasar a los Reyes (peticiones del 16 de noviembre).
- Inicio con sobre «Feliz Navidad». Al abrirlo aparecen los Reyes Magos muy borrachos montados en perros salchicha, llevando un regalo hasta el árbol.
- Llegada lenta, siempre visible y sin botón de saltar. Uno cae del perro y vuelve a subirse.
- Escena 3D, más realista, con actuación expresiva de dibujos animados. Phineas y Ferb fue referencia inicial de energía; el posterior pedido de realismo reemplaza el acabado plano/toon, sin volver a 2D.
- Pantalla limpia, sin cabecera ni pie y con poco texto. Sin bocadillo «Ábreme»: acceso desde el propio regalo.
- Al abrirlo, la cámara entra dentro de la caja; al usar la ventana, sensación de caída.
- Cursor de pepino con cara que grita al moverse y crece sobre elementos clicables. Durante el minijuego se sustituye por una mano con un huevo.
- La prueba de estrellas se reemplaza por lanzar huevos a cinco recortes de la cara de María, a partir de la foto facilitada. Van repartidos por la habitación principal, incluyendo paredes y cuadro (la ventana queda libre por corrección posterior). No se cambia a otra escena de minijuego. La mano debe hacer un gesto visible de lanzar y soltar el huevo. Al impactar se rompe y deja clara/yema escurriendo por caras y objetos. Hay que acertar las cinco (peticiones del 16 de noviembre; sustituye las dianas circulares de la versión anterior).
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

- Petición del 18 de noviembre: Reyes Magos mucho más realistas, manteniendo dibujos animados. Nueva iteración con rostros esculpidos, anatomía y ropa más detalladas; se mantiene llegada en perros salchicha, borrachera y caída.

- Ajustes del 18 de noviembre: Reyes entran por una puerta real; perros salchicha más reconocibles pero minimalistas, con lenguaje angular tipo Phineas y Ferb. La salida debe enlazar con el encuadre completo mediante movimiento continuo de cámara, sin cambiar de plano.

- Revisión posterior del 18 de noviembre: más tiempo en el Palau y en la entrega de Quevedo; pimiento más elaborado, velocidad normal equivalente al antiguo ×2 y rebote al tocar los bordes de los aros. Tras los cinco huevos, conservar las caras sucias, abrir ventana y mover cortinas por el viento; esperar clic en la ventana antes de caer. Sustituye la caída automática anterior.

## Datos de compra confirmados

- Quevedo — El Baifo Tour.
- Martes, 6 de julio de 2027, 20:30, Europe/Madrid.
- Palau Sant Jordi, Passeig Olímpic 5, 08038 Barcelona.
- Organizador: LIVING LIVE, A.I.E., C/ Doctor Carulla, 40-42, 08017 Barcelona, España.
- Dos entradas, confirmado por el usuario el 16 de noviembre. Asientos, sector y duración no proporcionados.
- Reyes 2027 se deduce del contexto; el nombre del repositorio incluye 2026 y no modifica la fecha del concierto.

- Nombres solicitados para las tarjetas decorativas: Sergio Gómez Martín y María Porras Agenjo (18 de noviembre). Usar el cartel de El Baifo Tour 2027 aportado por el usuario y los datos de su captura.

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

## Revisión del 18 de noviembre: vuelo y llegada al concierto

Decisiones del usuario: rediseñar el pimiento, agrandar aros, retirar la cara de la ventana y colocarla en otra zona, eliminar los rótulos Barcelona/Palau del acercamiento y dar continuidad al viaje con cambio de perspectiva. Tras unos segundos ante el Palau, mucha gente debe entrar tranquilamente, con fuegos artificiales; la cámara se convierte en una persona que entra a ver a Quevedo. Utilizar un audio existente de `output/`, a elección del asistente.

Iteración implementada: pimiento rojo redondeado con ojos grandes y alas de plumas, sin gafas ni bufanda; radio de aro 1,75 frente a 1,12. Cara de la ventana trasladada a la pared izquierda baja. Llegada en 2,5D sobre la imagen aérea existente: cámara perspectiva, personas 3D instanciadas y fuegos de partículas; puerta recortada por shader, pasillo 3D y enlace gradual al fotograma/vídeo. No equivale a una reconstrucción fotorrealista completa del recinto. Audio elegido: `output/final_voice.wav`, único archivo de audio presente, incorporado al vídeo servido con identificación de IA. No se ha generado ni convertido otra voz en esta iteración.

- Ajuste posterior del usuario: quitar la información al pie de la pantalla de entradas. Retirados dirección, organizador y nota sobre originales del pie; se conserva el botón de repetir el mensaje y los datos de las dos tarjetas.

- Última corrección del usuario: eliminar notas y aclaraciones visibles de toda la experiencia, no solo del pie de entradas. Retirados también el rótulo de IA del vídeo y los créditos superpuestos del viaje. Conservadas instrucciones de juego, controles, datos del concierto y descripciones accesibles. La procedencia/licencias de recursos siguen documentadas en la memoria y metadatos locales. No reintroducir notas visibles.

## Propuesta de tercer minijuego: cámara y muecas

El usuario quiere otro paquete del árbol que contenga una cámara de fotos; al activarla, acceder a un tercer minijuego con webcam y rondas de gestos faciales. Está consultando viabilidad/tecnología, no se ha implementado aún. Recomendación del asistente: MediaPipe Face Landmarker para web (@mediapipe/tasks-vision), inferencia local de landmarks/blendshapes; no identificación personal. Propuesta abierta: sonrisa, boca abierta, cejas, guiño y giro de cabeza, calibración breve y sostener gesto para completar ronda. Encaje propuesto: después del pimiento, paquete/cámara, y después desbloquear la bola. Aún sin confirmación de rondas ni orden exacto.

- El usuario acepta el fotomatón y pide puerto separado para probarlo directamente. Primera implementación en 4175/camera.html, con entrada desde paquete tras pimiento y bola al finalizar. Pendiente su prueba real de gestos.

### Ajuste del fotomatón: lengua y duración

El usuario informa de que el guiño funciona mal y pide sacar la lengua obligatoriamente y aguantar más. Ronda 4 sustituida por lengua, retirado el botón Otro gesto. Tiempo normal 2,2 s, ayuda 1,5 s, con cuenta atrás durante el acierto. `tongue-detector.js` analiza localmente una región de boca normalizada por landmarks: componente rosada central con extensión vertical, rechazo de dientes y líneas horizontales de labios; exige apertura mínima. Es una heurística experimental de imagen, no un clasificador entrenado ni un coeficiente tongueOut de MediaPipe. Puede fallar por iluminación, labios/coloración o encuadre; pendiente prueba real del usuario y ajuste, no prometer fiabilidad total. Build y diff-check correctos, servidor 4175 responde HTTP 200. Pruebas sintéticas rechazan dientes/línea de labio/boca cerrada y admiten mancha central; no equivalen a validación de lengua humana.

- Corrección aceptada del usuario: lengua no debe aprobar sin sacarla; sustituir mirar/girar cabeza por mano en frente y simplificar drásticamente el visor. Se cambia detección de lengua a modelo ONNX, mano con MediaPipe y UI sin lemas/decoración. Pendiente prueba real.

- Usuario acepta integrar el fotomatón manteniéndolo aparte para retocarlo. Módulo compartido en minigames/photobooth/ y laboratorio independiente conservado en puerto 4175.

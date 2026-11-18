# Fotomatón

Módulo compartido por la aventura (`app.js`) y la prueba aislada (`camera-lab.js`). No depende de la habitación, Three.js, ni de sus fases.

## Probar

`npm run dev:camera` → http://127.0.0.1:4175/camera.html

Paquete en la habitación: http://127.0.0.1:4175/?preview=camera

## Retocar

- `face-game.js`: visor, partida, calibración, captura y ciclo de cámara; duración en `holdDuration`.
- `face-game.css`: aspecto del visor; estilos limitados a sus clases.
- `face-gestures.js`: rondas y umbrales.
- `hand-gesture.js`: detección de mano sobre la frente con MediaPipe.
- `tongue-detector.js`: clasificador ONNX exclusivamente lengua dentro/fuera.
- `../../public/vision/`: modelos y atribuciones. WASM de MediaPipe debe coincidir con su versión npm; ONNX Runtime usa recursos importados del paquete.

## Interfaz

```js
import {createFaceGame} from './minigames/photobooth/face-game.js';
const game=createFaceGame({
  container: document.body,
  onComplete(){ /* continuar aventura */ },
  onClose(){ /* volver al paquete */ },
  soundEnabled:()=>true,
});
game.start();
game.setPaused(true);
game.stop();
```

`onComplete` se llama al pulsar Volver al árbol o Continuar sin cámara. `onClose` se llama al cerrar el visor. `stop()` cancela la partida sin invocar callbacks, detiene tracks y elimina las fotos de memoria. Mantener guardas de generación en operaciones asíncronas para que un permiso/inferencia tardío no reactive una partida cerrada.

No añadir textos de relleno ni notas al visor. No sustituir el detector de lengua por color de labios. Preservar pruebas de ausencia de gesto y descarte de resultados durante pausa/reinicio. La detección de frente comprueba superposición 2D, no contacto físico.

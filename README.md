# Para María · Reyes 2027

Primera entrega jugable: sobre «Feliz Navidad» → Reyes Magos tambaleantes montados en perros salchicha entregan el regalo → habitación navideña 3D con materiales físicos, texturas y abeto detallado → regalo animado → nota → búsqueda de tres estrellas → pista Barcelona. La aventura termina aquí por ahora; vuelo y vídeo quedan para próximas iteraciones.

## Desarrollo

```sh
npm ci
npm run dev
```

Abrir http://127.0.0.1:4174. `npm run build` genera `dist/`; `npm run preview` sirve el resultado. Requiere Node compatible con la versión de Vite fijada en `package.json`.

La escena Three.js y Anime.js se carga en un módulo separado; se puede arrastrar para girar la cámara. Sin cabecera ni pie, con texto mínimo y movimiento expresivo. La interfaz y el juego siguen disponibles con una ilustración CSS si falla la escena. Música original de caja de música y efectos sintetizados, activables con ♫, sin audio externo. Cursor de pepino para ratón. No hay persistencia del progreso entre recargas.

El prototipo anterior (revelación, mapa y calendario) se conserva en `archive/`, fuera del build actual. No hay entradas reales, códigos de acceso ni publicación. `noindex` no es control de acceso.

## Memoria actualizable

La [skill del proyecto](.agents/skills/regalo-maria/SKILL.md), también disponible como `$regalo-maria`, conserva:

- [Dirección creativa](.agents/skills/regalo-maria/references/experiencia.md).
- [Herramientas investigadas](.agents/skills/regalo-maria/references/herramientas.md).
- [Estado, verificación y siguientes pasos](.agents/skills/regalo-maria/references/estado.md).

- [Arquitectura y guía de animación](.agents/skills/regalo-maria/references/arquitectura.md).

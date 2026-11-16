# Para María · Reyes 2027

Primera entrega jugable: sobre «Feliz Navidad» → Reyes Magos tambaleantes montados en perros salchicha entregan el regalo → habitación navideña 3D con materiales físicos, texturas y abeto detallado → regalo animado → nota → cinco recortes de la cara de María por la habitación, a huevazos con mano animada, salpicaduras y goteo → nueva bola del mundo brillante en el árbol → dos vueltas a la Tierra y acercamiento al Palau → vídeo de escenario generado con IA y voz original → dos tarjetas decorativas del concierto.

## Desarrollo

```sh
npm ci
npm run dev
```

Abrir http://127.0.0.1:4174. `npm run build` genera `dist/`; `npm run preview` sirve el resultado. Requiere Node compatible con la versión de Vite fijada en `package.json`.

La escena Three.js y Anime.js se carga en un módulo separado; se puede arrastrar para girar la cámara. Sin cabecera ni pie, con texto mínimo y movimiento expresivo. La interfaz y el juego siguen disponibles con una ilustración CSS si falla la escena. Música original de caja de música y efectos sintetizados, activables con ♫, sin audio externo. Cursor de pepino para ratón, que cambia a una mano con huevo al jugar. Pausa/reanudación junto a la música, también para proyectiles y goteo. No hay persistencia del progreso entre recargas.

El prototipo anterior (revelación, mapa y calendario) se conserva en `archive/`, fuera del build actual. No hay entradas reales, códigos de acceso ni publicación. El MP4 y las imágenes del final se sirven localmente; no hay servicios de vídeo de pago. El proceso de generación está documentado en [scripts/VIDEO.md](scripts/VIDEO.md). `noindex` no es control de acceso.

## Memoria actualizable

La [skill del proyecto](.agents/skills/regalo-maria/SKILL.md), también disponible como `$regalo-maria`, conserva:

- [Dirección creativa](.agents/skills/regalo-maria/references/experiencia.md).
- [Herramientas investigadas](.agents/skills/regalo-maria/references/herramientas.md).
- [Estado, verificación y siguientes pasos](.agents/skills/regalo-maria/references/estado.md).

- [Arquitectura y guía de animación](.agents/skills/regalo-maria/references/arquitectura.md).

---
name: regalo-maria
description: Diseñar e iterar la web de Reyes para María de este proyecto, manteniendo su aventura de pistas, animaciones y revelación del concierto de Quevedo. Usar al trabajar en regalo-maria-2026 o cuando el usuario invoque esta experiencia; no aplicar a otras webs regalo.
---

# Regalo de Reyes para María

Esta skill conserva la dirección creativa y técnica de un proyecto en evolución. El usuario ha pedido mantener las ideas en skills actualizables y trabajar por iteraciones.

## Retomar con poco contexto

1. Leer primero [Estado actual](references/estado.md): resumen compacto, verificación y punto de continuación.
2. Para código, consultar [Arquitectura](references/arquitectura.md). Para decisiones de experiencia, [Dirección creativa](references/experiencia.md).
3. Consultar [Herramientas](references/herramientas.md), [recursos y prompts del final](references/final-assets.md) o `scripts/VIDEO.md` solo si se va a cambiar esa parte. No cargar el historial de investigación por defecto.
4. Contrastar siempre la memoria con el código real. Una propuesta o investigación no equivale a implementación.

## Cómo avanzar

Trabajar en una porción visible y jugable cada vez, manteniendo un recorrido que pueda revisarse. El primer tramo ya funciona: sobre → llegada de Reyes → regalo → cinco caras de María a huevazos por la habitación → ventana que se abre y caída → pimiento volador por seis aros → bola del mundo brillante en el árbol → Tierra/Palau → vídeo y dos tarjetas. Continuar desde el estado comprobado. No migrar todo el proyecto ni añadir varios motores solo porque estén en la lista de candidatos.

El regalo debe funcionar en móvil y escritorio. Evitar que una animación, el audio bloqueado por el navegador o una pista difícil impidan llegar al final: ofrecer ayuda, controles de audio y alternativa con movimiento reducido. La llegada de los Reyes no lleva botón de saltar, por petición explícita. Mantener el título del navegador exactamente `feature`. Son criterios de implementación propuestos, no decisiones estéticas del usuario.

Conservar los datos exactos de la compra. Los billetes decorativos no son entradas válidas: no inventar asientos, códigos QR ni datos de acceso. Existe una primera recreación de vídeo generada localmente con voz sintética original; consultar estado, herramientas y recursos del final. Identificarla como IA y no presentarla como saludo auténtico ni como voz clonada del artista. No contratar servicios de pago; las entradas reales permanecen privadas con el usuario.

## Mantener la memoria

Después de una iteración o una decisión del usuario, actualizar la referencia afectada y el estado. Registrar brevemente resultado comprobado, limitaciones y siguiente paso. Si el usuario cambia de idea, reemplazar la dirección vigente y conservar solo el contexto anterior que explique una decisión útil.

Guardar las ideas tentativas como propuestas. No convertir el silencio en aceptación ni las preferencias de este proyecto en reglas para otros proyectos. Añadir nuevas skills solo cuando aparezca un procedimiento reutilizable con alcance propio; mantener las ideas de esta experiencia en estas referencias.

Esta carpeta dentro del repositorio es la fuente única. La instalación personal puede apuntar aquí mediante un enlace simbólico; no mantener dos copias divergentes.

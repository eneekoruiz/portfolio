# Corrección de presentación y continuidad — 4 octubre 2026

## Petición preservada
Mantener la composición del portfolio y recuperar las interacciones descritas por el propietario, sin añadir secciones. Referencias: capturas de proyectos y estudio proporcionadas el 4 de octubre.

## Cambios
- Acceso a «Explorar proyecto» siempre visible, tecnologías y enlace GitHub fuera del desplegable. La ampliación conserva arquitectura, desarrollo y despliegue en un panel breve, con teclado y restauración al volver.
- Actividad GitHub: respuesta enriquecida, hasta tres lenguajes ordenados por volumen, descripción con hover/foco y enlaces nativos. Se conservan caché, presupuesto de petición y tres trabajadores con límite de ocho repositorios.
- Sobre mí: tarjetas más compactas, texto completo adaptable.
- Stack: giro automático bajo el control global; sin botones por tarjeta. Se conservan arrastre, rueda, flechas, pausa con foco y detención fuera de pantalla.
- DNA: mayor presencia y paleta compartida entre WebGL/SVG; una hebra toma el color del proyecto con hover/foco/selección. WebGL se pausa fuera del hero y muestra la proyección SVG sin bucle adicional.
- Estudio: el título se desvanece antes de revelar la pantalla; indicador de scroll compacto, pantalla bajo la navegación y sin doble traslación en la transformación 3D.

## Evidencia
- Build de producción, typecheck, lint, invariantes de movimiento y estructuras de 20 idiomas: pasan.
- Frontera de GitHub: 11 pruebas pasan; respuesta real local incluye varios lenguajes en Curriculum, helen y recordatorios.
- Pruebas iniciales de cambios: 36 pasan, seis casos no aplican al perfil; los tres fallos detectaron una traslación real y dos expectativas de hover en perfiles táctiles.
- Revisión posterior: 12 pruebas GitHub pasan. Los controles geométricos de todos los estados del estudio pasan en 375×667, 768×1024, 935×800 y 1440×700, incluyendo reversión; se ajustó la expectativa del fallback local, que abre el salón en otra pestaña porque localhost no está permitido por su política de iframe.
- La batería completa de Chromium está en ejecución. No se presenta como terminada hasta registrar su resultado.

## Preservación y límites
Origin/main a749411 es ancestro de esta rama tras fetch; no hay cambios nuevos de main por incorporar. Las modificaciones previas del propietario se conservan. El PDF y debug.log personales quedan fuera de los commits.
La validación local no sustituye una revisión estética del propietario ni verifica la política de iframe desde el dominio publicado.
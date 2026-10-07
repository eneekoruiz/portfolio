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
- Batería ampliada de Chromium: 192 casos, 149 pasan, 32 no aplican al perfil y 11 fallan. Diez fallos usaban la estructura anterior de los controles y uno dependía de la respuesta externa de GitHub para un repositorio ficticio. Se actualizaron los selectores y se aisló únicamente ese destino externo de prueba, manteniendo la comprobación de apertura de una pestaña nativa. La repetición focalizada da 13 pasan, dos no aplican y cero fallos; cubre los 11 casos fallidos.
- Último pulido de estudio y presentación: 31 pasan, dos no aplican y cero fallos. Incluye temas, etiquetas largas/RTL, tarjetas, paleta, navegación SPA, actividad GitHub, cinco rutas y geometría del estudio en cuatro tamaños.
- Corrección de la barra flotante: ocho pasan, uno no aplica y cero fallos; verifica pulsación directa sobre las pestañas y navegación a todas las secciones desde el menú sin recargar el documento.
- Etiquetas finales: nueve pasan, cero fallos; comprueba «Detalles» en español y «Details» al cambiar a inglés, además del acceso directo y el DNA en escritorio, tableta y móvil.
- Build, typecheck, lint e invariantes de movimiento pasan. Las estructuras de los 20 idiomas pasan; esta comprobación no certifica por sí sola la calidad lingüística.

## Preservación y límites
Origin/main a749411 es ancestro de esta rama tras fetch; no hay cambios nuevos de main por incorporar. Las modificaciones previas del propietario se conservan. El PDF y debug.log personales quedan fuera de los commits.
La validación local no sustituye una revisión estética del propietario ni verifica la política de iframe desde el dominio publicado.
## Revisión visual final — 5 octubre 2026
Se retira la etiqueta pulsante «UX_ENGINE» de la cabecera. En el origen local, el estudio muestra la captura real del salón junto al acceso externo, reutilizando el recurso existente. No se añade otro renderer ni una dependencia.

La barra flotante de capítulos cubría las pestañas en móvil, incluso con las tarjetas compactas. Se elimina esa barra redundante; el menú principal mantiene los accesos a todas las secciones. La navegación táctil equivalente y la ausencia de obstrucciones tienen regresión de Playwright.

El botón secundario se llama «Detalles», con etiquetas en los 20 idiomas, y queda separado semánticamente de «Explorar proyecto» y de la captura visible. Las capturas de escritorio y móvil se revisaron visualmente.

La verificación se hizo en la compilación de producción local de Chromium. Los resultados corresponden a una batería amplia más repeticiones focalizadas y comprobaciones del último pulido; no se afirma una segunda ejecución completa sin fallos ni una garantía de ausencia de cualquier defecto.
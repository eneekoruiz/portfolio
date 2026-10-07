# Corrección del control de animaciones y de la dirección visual

Esta revisión sustituye las decisiones visuales de la iteración anterior que el propietario rechazó. La referencia de código para retirar nuestros añadidos es `9e2e575`; no se ha confirmado que esa sea exactamente la versión estética que prefiere el propietario.

## Fallo reproducido

En el build anterior, al pulsar el control de animaciones con `lite=1` persistido o con movimiento reducido del sistema, se guardaba `portfolio-motion-enabled=true`, pero el control seguía mostrando «Activar animaciones». El DNA permanecía estático: su primera coordenada `x1` era `150` antes y después de esperar. La prueba anterior de preferencia guardada no ejercitaba ese clic real.

El modo ligero ahora determina el coste del renderizador y no bloquea una elección explícita de movimiento. Activar en modo ligero, ahorro de datos o memoria de 1 GB mueve el DNA SVG sin crear WebGL ni cargar el vídeo de portada. Una preferencia guardada sigue respetando movimiento reducido; un clic explícito puede activar movimiento ligero durante la visita actual. Al recargar o cambiar la preferencia del sistema se vuelve a respetar esa preferencia. Pausa y reanudación utilizan el mismo estado compartido; el botón refleja la elección del usuario, aunque un overlay suspenda temporalmente los efectos.

## Rectificación visual

- Se retiran la sección Expertise, el carrusel de tecnologías y las etiquetas flotantes que habíamos añadido. El contenido de proyectos y del stack permanece.
- Sobre mí recupera texto y tres tarjetas en una fila adaptable, retirando el panel dividido, la comilla gigante y las etiquetas `01 / ER`.
- Contacto recupera su composición anterior, retirando la flecha decorativa gigante y los estilos añadidos para esa composición.
- Se mantienen Memoji, letras interactivas, órbitas del stack, acordeones, las cinco fichas, código de proyectos y el estudio CSS 3D. Las curvas del DNA SVG pasan de segmentos rectos a curvas cúbicas sin aumentar las muestras.

La precarga por intención de abrir una ficha funciona también con movimiento desactivado. Las pruebas de navegación comprueban que abrir un proyecto y volver mantienen el mismo documento y restauran la ficha desplegada.

## Verificación

Las nuevas pruebas de Playwright comprueban coordenadas que cambian después del clic, coordenadas congeladas durante la pausa y movimiento al reanudar, en modo ligero, 1 GB, ahorro de datos y movimiento reducido. Se ejecutan en los perfiles de escritorio, tablet y móvil. También se conserva la comprobación de que una preferencia guardada no activa movimiento automáticamente frente al ajuste del sistema.

Los resultados finales y las comprobaciones de build, tipos, lint, invariantes de movimiento y estructura de los 20 idiomas se registran en la descripción de la PR. Las pruebas locales usan Chromium; no prueban la fluidez en un dispositivo físico ni certifican la preferencia estética del propietario.

Resultados de esta revisión: build de producción, tipos, lint, invariantes de movimiento y estructura de idiomas aprobados. La ejecución completa de 144 casos terminó con 119 aprobados, 23 exclusiones por perfil y dos fallos de supuestos en los tests: esperar un canvas que la adaptación ya había retirado y exigir un efecto de ratón en una tablet táctil. Se corrigieron ambos supuestos manteniendo las comprobaciones de pausa real y navegación. La repetición de esos tests en los tres perfiles terminó con cuatro aprobados y dos exclusiones; no se modificó la aplicación después de la ejecución completa. Resultado combinado: 121 casos aplicables verificados y 23 exclusiones por perfil. Los doce casos nuevos del botón pasaron en la ejecución completa.

La CI de Node 22 y el build de Vercel aprobaron el commit de aplicación `8b9ff53`. El último commit añade únicamente la corrección y el registro de los tests.

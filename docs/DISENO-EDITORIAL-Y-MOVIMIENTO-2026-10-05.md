# Diseño editorial y movimiento — 5 de octubre de 2026

La petición evolucionó de compactar las tarjetas a evitar su repetición. Esta pasada conserva los contenidos y las acciones, pero usa tipografía, separadores y previsualizaciones reales como estructura. No añade secciones, dependencias ni imágenes generadas.

## Cambios

- Sobre mí: tres métricas en una fila también a 375 px, sin cajas; etiquetas y valores envuelven, con separadores verticales.
- Tecnologías: grupos abiertos en una, dos o tres columnas según el espacio, órbitas de 100 px y cápsulas pequeñas. Se mantienen giro, arrastre, teclado y pausa fuera de pantalla.
- Contacto: composición abierta, accesos en una fila también en móvil y un saludo del icono de 600 ms al interactuar. Conserva copia del correo con confirmación, enlaces externos, currículum y efecto de giro.
- Proyectos: filas sin contenedor redondeado; el marco se reserva para la previsualización. La imagen permite navegar con clic o Enter usando la misma transición SPA y preserva Volver, scroll y detalles. Previsualización flotante reducida de 240 × 160 a 196 × 132 px, sin globo decorativo ni título superpuesto.
- DNA: mayor presencia, nodos con profundidad, giro, respuesta al desplazamiento/cursor y reflejo que recorre ambas hebras. Conserva la paleta del proyecto. El WebGL sigue limitado a 30 fps y duerme fuera de la portada; la proyección SVG de 36 pares sigue animada con un máximo de 20 actualizaciones por segundo. Pausa al ocultar el documento o desactivar el control global; no usa renders de React por fotograma.
- Espaciado: menor distancia entre cabecera y contenido, manteniendo lectura y tamaño de los controles.

## Evidencia y límites

Build de producción, TypeScript, ESLint, invariantes de movimiento y estructura de los 20 idiomas pasan. La comprobación de idiomas no certifica la calidad de cada traducción.

La primera prueba visual encontró una previsualización móvil de 546 px y un desbordamiento del marco. Se corrigieron sus dimensiones y su relación de aspecto; las pruebas existentes de tarjetas inferiores a 520 px y detalles inferiores a 360 px pasan en escritorio, tableta y móvil. Una expectativa nueva que asumía solo tres grupos de tecnologías se corrigió: hay cinco grupos, organizados en tres columnas y dos filas en escritorio.

La pasada ampliada de Playwright ejecutó 39 casos: 28 pasaron, ocho se omitieron por perfil y tres fallaron. Hubo una interrupción del entorno con `ERR_NETWORK_IO_SUSPENDED` y tiempos de espera. La repetición de composición de tableta pasó. También pasaron los dos casos restantes en su repetición: shaders y estudio. Quedan así verificados los 31 casos aplicables, mediante la pasada ampliada y sus repeticiones, sin afirmar una única ejecución de 39 casos sin fallos. El recorrido del estudio usa un plazo de cuatro minutos para sus cuatro viajes completos; conserva todos los puntos intermedios, reversión y comprobaciones de solapamiento. Su repetición terminó en 1,5 minutos.

El test de shaders ahora comprueba primero la compilación real y contempla los dos resultados válidos del presupuesto: canvas activo, o canvas retirado con fallback animado visible. En el entorno de software se observó `data-scene-degraded=true`, SVG animado y cero errores de navegador; la repetición del test pasó. No se elimina la protección de fluidez para satisfacer una expectativa de canvas permanente.

Las nuevas pruebas verifican métricas alineadas, composición sin cajas, acceso nativo desde la imagen, continuidad del documento al volver, copia al portapapeles, ausencia de desbordamiento y errores, movimiento del DNA fuera de la portada, máximo de actualizaciones y congelación al pausar. Se inspeccionaron capturas de ambas apariencias y de contacto/métricas en móvil.

El servidor local en el puerto 3102 sirve el build de producción. En ese origen, el salón mantiene captura real y enlace externo; esta pasada no certifica la integración del iframe en un dominio publicado. No se han inventado capturas de aplicaciones que no tienen material visual real disponible.

`origin/main` continúa en `a749411`; se conservan los cambios previos del usuario. Los archivos personales `Biblia_del_Estudiante_Universitario_SIGNATURE_V10.pdf` y `debug.log` no se incluyen en Git.

## Siguiente mejora propuesta

El salto visual más útil sería incorporar capturas reales del funcionamiento de Rides24 y de las otras aplicaciones, seleccionando una escena reconocible para cada proyecto. Ese material permitiría sustituir algunas vistas de código por interfaces reales sin fingir productos o resultados. No se añade vídeo de fondo ni otra animación continua para compensar la falta de material.

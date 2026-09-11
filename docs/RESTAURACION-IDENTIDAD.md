# Recuperación de la identidad visual — 10 de septiembre de 2026

Comparación con `5ede103`, sobre la base actual `f207971`. Se conservan las mejoras de navegación Umbral y el renderizado óptico. Se recuperan recursos que se habían sustituido por versiones demasiado planas.

## Recursos recuperados

- Tecnologías: tarjetas por categoría, píldoras en órbita 3D, arrastre con ratón y tacto; pausa sin reiniciar el ángulo y listado legible con movimiento reducido.
- Hero: despliegue tridimensional más marcado, letras con respuesta elástica, foco de luz, retrato animado de mayor tamaño y controles de proyectos/CV con lenguaje visual propio. Inclinación del dispositivo mediante activación explícita, sin actualizar React en cada evento del sensor.
- Hélice: WebGL también en modo ligero, silueta SVG con movimiento pausado/reducido o fallo de gráficos, mayor presencia en móvil y conexión con la inclinación.
- Sobre mí: telón de palabras, métricas con relieve y red de partículas.
- Filosofía: disposición asimétrica original, partículas, reflejos y relieve elástico. Reparado el destino `#values` del menú; se mantiene el alias `#philosophy`.
- Proyectos: paneles interiores, recorrido vertical de desarrollo, colores de tecnologías, acceso al código y tarjeta flotante. Los vídeos `/projects/*.webm` referenciados por la implementación antigua no existen en el repositorio; la vista flotante usa una composición gráfica que no genera peticiones rotas.
- Detalles: se conserva el zoom hacia «Entrar al Estudio», con inclinación 3D reversible y sin animar dimensiones ni filtros de desenfoque durante scroll. Recuperadas la malla ambiental y las formas flotantes.
- Contacto: tarjetas de Gmail, GitHub y LinkedIn con giro 3D mediante muelles, copia de correo con confirmación accesible y acceso directo al CV.
- Se elimina la limpieza global que borraba indiscriminadamente nodos cuyos identificadores contenían «overlay», «transition» o «curtain». Cada transición conserva la responsabilidad sobre sus propios elementos.

## Verificación completada

- Dependencias instaladas desde el lockfile con `npm ci`; compilación de producción y TypeScript correctos con Next.js 16.2.11.
- ESLint revisó la aplicación; se corrigió el único componente señalado, la vista flotante, trasladando sus muelles a referencias mutables. La comprobación del componente corregido pasó.
- Prueba analítica de muelles superada: inversión de objetivos conservando velocidad, consistencia entre frecuencias de refresco y recuperación tras fotogramas largos.
- Ronda completa Playwright: 26 aprobados, 2 omitidos por ser interacciones exclusivas de ratón y 2 fallos del selector de la prueba del estudio, que coincidía también con etiquetas ocultas. Se corrigió el selector para comprobar la etiqueta visible.
- Ronda final sobre la compilación definitiva: **6 de 6 aprobados**. Incluye hero, navegación al estudio y reversión del zoom, filosofía, partículas y tarjetas de contacto en escritorio y móvil. Se revisaron capturas y se ajustó el retrato y el contraste de los paneles.
- Cobertura acumulada: **28 casos distintos verificados y 2 omitidos en móvil**. La navegación conserva el documento y el canvas, Atrás recupera la tarjeta, ES/EN se actualizan juntos y las preferencias de movimiento mantienen el contenido accesible.
- La copia de correo se verifica con el portapapeles simulado en Playwright. Los gráficos se prueban con Chromium y renderizado de software; estas pruebas no constituyen una medición de FPS en teléfonos físicos.

Los informes locales completos están en `scratch/identity-full-report` y `playwright-report`; las capturas iniciales se conservan en `scratch/identity-full-captures` y las finales en `test-results`. Se excluyen del compilador las carpetas de pruebas y copias históricas para no compilar accidentalmente material de trabajo.

## Publicación

Rama de entrega: `codex/materia-viva`, sobre `f207971`. Esta recuperación conserva las actualizaciones de dependencias y el trabajo integrado previamente. Los ZIP de recuperación anteriores son copias históricas; la fuente de esta entrega es el commit de la rama, con todos los archivos nuevos registrados en Git.

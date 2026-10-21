# Continuidad y ajuste visual — 4 de octubre de 2026

Se conserva el lenguaje visual del portfolio: nombre grande y cinético, azul, Memoji, tecnologías, filas de proyectos, transición al detalle y estudio con profundidad. La revisión compara la referencia `5ede103`, la recuperación descrita en `AUDITORIA-CONTINUIDAD-VISUAL.md`, la versión anterior a `eb7bb97` y la limpieza local `8173933`. Se comprobó `origin/main` antes de editar; ya estaba incluido en esta rama.

## Cambios y motivos

- Se incorporan los cuatro hooks que ya estaban restaurados en los cambios locales. Dos siguen siendo dependencias activas de las filas de proyectos; eliminarlos rompe la compilación. Los archivos personales PDF y `debug.log` quedan fuera de la entrega.
- La hélice mantiene WebGL en el perfil compatible. En equipos modestos y tras la reducción adaptativa, una proyección SVG conserva su rotación sin asignar otro contexto WebGL. Su escritura se limita a 20 actualizaciones por segundo; se congela fuera del hero, en pestañas ocultas, al abrir diálogos o al pausar movimiento. Conserva la pose al reanudar.
- El SVG permanece visible durante el arranque del render 3D hasta el primer fotograma activo. La comprobación del presupuesto de fotogramas cuenta callbacks reales del render, no sólo invalidaciones solicitadas. Esto no mide la finalización de trabajo en la GPU.
- La geometría de escritorio pasa de 68 a 56 pares y de tubos con 168 × 8 segmentos a 144 × 7. La rotación y la emisión son más suaves; la composición óptica procesa hasta seis superficies. Estas reducciones de trabajo no equivalen a un porcentaje de mejora de FPS medido en hardware físico.
- El zoom reversible del estudio se conserva. Un equipo de escritorio con memoria o CPU modestos mantiene ese recorrido CSS 3D y usa SVG para el fondo. En táctil, las animaciones siguen siendo opcionales; movimiento reducido, ahorro de datos y modo ligero tienen prioridad.
- Se recuperan los fragmentos de código como vistas de Who Are Ya, Rides y SpotShare. La peluquería mantiene su captura real; PKE mantiene el aviso de previsualización no disponible. Cada detalle tiene acceso nativo a GitHub sin tener que entrar al estudio.
- El inicio y las capacidades vuelven a describir a un estudiante y desarrollador. Se reducen los motivos gráficos de marca, la saturación del contacto y la ornamentación de las métricas. El hero puede crecer en ventanas bajas y las métricas largas ajustan su tamaño.
- Las etiquetas de tecnologías mantienen el arrastre y su movimiento acotado dentro de una franja propia, sin atravesar el retrato. Capacidades usa un fondo opaco para separar la lectura de la hélice; el marquee enumera tecnologías reales en lugar de promesas de diseño premium.
- Las órbitas rechazan notificaciones de observadores retirados. Su regresión comprueba reglas de estilo vacías, transformación nula y opacidad completa tras pausar, y entrega deliberadamente notificaciones antiguas. Chromium puede conservar un atributo `style=""` vacío: su mera presencia no acredita una animación activa.
- El texto pequeño de la tercera métrica usa el color de tinta para mejorar su contraste sobre el azul tenue. La comprobación de las tres etiquetas calcula su contraste con el fondo compuesto en ambos temas; el mínimo para estos textos es 4,5:1.
- Se sustituyen cifras de facturación, carga y Lighthouse sin informes de respaldo por descripciones de los fragmentos de código disponibles. El estudio deja de mostrar telemetría, permisos y cifras de latencia ficticios.

## Límites de continuidad

Rides ya carecía de estudio incrustado en la referencia histórica. PKE mantiene la decisión previa de aparecer sin una vista del sitio publicado. La peluquería permite incrustación únicamente desde sus orígenes autorizados: localhost y las previews conservan el enlace externo real.

No se recuperan un preloader que retrase el contenido ni bucles ambientales de partículas. Las transiciones, la iluminación del nombre, el Memoji, las órbitas activables y el giro de los contactos siguen disponibles. Las diferencias históricas de tiempos, progreso ficticio de botones y telón descritas en la auditoría anterior no se presentan como equivalencia visual exacta.

## Verificación

Compilación de producción, TypeScript, ESLint, muelles, once pruebas de la frontera GitHub y estructura de los veinte idiomas: aprobados localmente. La revisión inicial de capturas no detectó errores de consola ni recursos visuales fallidos.

La batería completa de Playwright contra la compilación de `bba7de4` terminó con **94 aprobados, 14 omisiones previstas por el perfil de interacción y cero fallos**, sin reintentos. Incluye navegación SPA y Atrás, veinte idiomas, teclado y diálogos, cinco rutas de proyectos, estudios, preferencias de movimiento, interrupciones, visibilidad, errores de API y continuidad de la hélice al cambiar de tamaño. Las regresiones específicas de órbitas y los veinte idiomas también pasaron en 375, 768 y 1440 px.

El único cambio visual posterior a esa batería es el color de la etiqueta de la tercera métrica. Su compilación final es correcta y la comprobación final de diseño y contraste terminó con **6 de 6 aprobados**: 375, 768 y 1440 px, temas claro/oscuro, etiquetas largas y RTL. Las tres etiquetas de métricas cumplen el mínimo probado de 4,5:1 en ambos temas. La nueva consulta final de GitHub no encontró cambios pendientes de incorporar desde `origin/main`.

Comandos reproducibles: `npm run build`, `npm run lint`, `npm run test:motion`, `node --test tests/github-boundary.node.mjs`, `npm run check-i18n`, `npx playwright test --trace=off --workers=1` y `npx playwright test --config=playwright.performance.config.mjs tests/design.spec.mjs --trace=off --workers=1`.

Las capturas y los informes locales están en `scratch/continuity-20261004`; no son una medición en teléfonos físicos ni una certificación de todos los navegadores. La pasada final no identifica más correcciones demostradas pendientes en el alcance revisado; no equivale a garantizar ausencia absoluta de defectos.

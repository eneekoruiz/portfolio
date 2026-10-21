# Escenas de proyecto, GitHub y contacto

## Criterios

Conservar la composición editorial, el contenido y las rutas. Dar a cada proyecto una entrada 3D visible durante el recorrido, con su acción principal siempre disponible. Recuperar descripciones y varias tecnologías de GitHub con ratón, teclado y tacto. Mantener el control nativo del scroll, la navegación SPA y la preferencia global de movimiento.

## Cambios y hallazgos

- Cada proyecto dispone de una escena de altura de pantalla y una previsualización mayor. La perspectiva sigue el avance del scroll y se revierte al volver. CSS sticky mantiene el contenido visible durante un tramo breve; no se captura la rueda ni se fuerza el salto entre proyectos.
- El anclaje fallaba por `body { overflow-x: hidden }`, que generaba un contenedor de scroll intermedio. Se cambió a `clip` y se verificó que la posición del encabezado permanece estable al seguir desplazándose.
- En pantallas bajas o con contenido más alto que el espacio disponible se conserva una entrada breve sin anclaje. Pausa explícita y movimiento reducido recuperan la presentación compacta.
- La transición al estudio toma la geometría del encabezado visible, conservando el contexto y colores de la superficie. No incluye el tramo vacío reservado al recorrido. Volver restaura el mismo documento, scroll y estado cerrado o abierto del proyecto.
- El hover de repositorios dependía del ancho móvil y fallaba con ratón en ventanas estrechas. Ahora distingue el tipo de puntero; foco y tap siguen disponibles. Las primeras tres tecnologías y el contador de adicionales se conservan. La descripción gana tamaño y contraste; se eliminan promociones permanentes de capas de animación.
- La API local real devolvió 12 repositorios con descripción. No se inventaron textos ni se cambió la validación de datos para resolver el hover. El fixture de regresión incluye los campos reales `fork` y `all_languages` y activa la carga diferida acercándose a GitHub.
- Se eliminó la instrucción de arrastrar las tecnologías. Las órbitas y sus controles continúan funcionando.
- Gmail, GitHub y LinkedIn reciben marcas mayores, formas propias y un gesto finito de interacción. Se conservan enlaces, copia al portapapeles y feedback accesible.
- La hélice SVG gira aproximadamente dos veces más rápido con el mismo presupuesto de actualización. WebGL también aumenta su velocidad angular sin subir el límite de FPS, DPR o complejidad. Se mantienen pausa, visibilidad y degradación adaptativa.

## Verificación

Producción local en `http://localhost:3102`, Chromium a 375, 768 y 1440 px. Build, TypeScript, ESLint, invariantes de movimiento y estructuras de los 20 idiomas pasaron.

La ronda de interacción completó **32 pruebas y 4 exclusiones por perfil**, sin fallos:

```powershell
npx playwright test tests/project-stage.spec.mjs tests/motion-cleanup.spec.mjs tests/overlay-focus.spec.mjs tests/github-client.spec.mjs --config=playwright.performance.config.mjs --workers=2 --reporter=list
```

Cubre geometría estable de las cinco escenas, acción visible, reversibilidad, desbordamiento horizontal, pausa, hover a 700 px, tres tecnologías, tacto, foco, entradas malformadas, fallback de GitHub, liberación de captura, interrupción de animaciones y overlays. El recorrido SPA verifica identidad del documento, posición de scroll, escena cerrada, adaptación a 500 px de alto y movimiento reducido. Se revisaron capturas de las escenas en los tres tamaños y de los contactos en escritorio.

La ronda final de diseño y detalles pasó **9 pruebas**, incluyendo ambos temas, contraste, textos largos, RTL y abrir/cerrar detalles desde la escena:

```powershell
npx playwright test tests/design.spec.mjs tests/project-stage.spec.mjs --grep 'editorial composition|long labels|scroll studio navigation' --config=playwright.performance.config.mjs --workers=2 --reporter=list
```

No se añadieron dependencias, imágenes generadas ni secciones. Las comprobaciones de límites de actualización no equivalen a una medición nueva de LCP, INP o FPS en teléfonos físicos. La integración externa de la peluquería en el host publicado conserva la limitación documentada en las revisiones anteriores.

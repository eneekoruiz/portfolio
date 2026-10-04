# Auditoría de interacciones y datos — 4 de octubre de 2026

Se conserva la dirección visual del portfolio y se revisan sus estados interrumpidos, accesibilidad de los diálogos y acceso opcional a GitHub.

## Correcciones

- Menú y buscador comparten un bloqueo de scroll con propietarios independientes. El último cierre restaura las propiedades y prioridades CSS anteriores; no se reduce la altura del documento a `100vh`.
- Los diálogos cancelan el foco pendiente, excluyen controles ocultos o deshabilitados, contienen el foco incluso sin controles disponibles y devuelven el foco al disparador visible. Abrir el buscador cierra el menú; el contenedor del propio diálogo no se confunde con otro modal.
- El buscador respeta el modo de movimiento reducido, elimina sus animaciones al desmontarse y evita cierres duplicados. La navegación se realiza después del cierre, con foco en la sección de destino y desplazamiento adaptado a la preferencia de movimiento.
- Búsqueda sin resultados, instrucciones y recuento tienen traducciones para los 20 idiomas. Se corrigen el ancho del campo, márgenes de resultados y áreas de pulsación en móvil.
- Arrastre de tecnologías, relieve y atracción de botones liberan captura, transformaciones y suscripciones cuando se interrumpen. Los acordeones terminan en un estado estable al ocultarse y evitan animar redimensionados de contenido ya abierto.
- Abrir un diálogo pausa el movimiento decorativo del fondo, incluida la escena WebGL. Cerrar el último diálogo reanuda la política de movimiento del visitante sin recrear el canvas. La animación breve del propio buscador sigue respetando la preferencia de movimiento.
- La actividad de GitHub se solicita una sola vez cuando el lector visible se aproxima. Datos inválidos se descartan, repositorios e idiomas se deduplican y errores conservan los proyectos destacados y el contacto.
- La API valida parámetros numéricos completos, limita el enriquecimiento a ocho repositorios y tres peticiones simultáneas, y comparte un presupuesto total de siete segundos. Los enlaces de idiomas se construyen en el servidor; las credenciales no se envían a direcciones proporcionadas por una respuesta externa.
- Los errores de la API no se cachean ni exponen excepciones del proveedor. `Retry-After` comunica segundos de espera. Las cabeceras de seguridad ya definidas se conectan a la configuración de Next.js y se comprueban en respuestas reales.

## Verificación reproducible

```sh
npm ci
npm run typecheck
npm run build
npm run lint --if-present
npm run test:motion
npm run check-i18n
node --test tests/github-boundary.node.mjs
npx playwright test
npx playwright test --config playwright.performance.config.mjs
npm audit --omit=dev
```

Los navegadores usan una compilación de producción. La configuración responsive incluye Chromium a 1440, 768 y 375 píxeles. Las pruebas de gestos de ratón se omiten en perfiles táctiles; los estados sin movimiento se verifican por separado. Las capturas y trazas se guardan localmente en `test-results` y los informes en `scratch`.

## Dependencias y límites

La auditoría de dependencias de producción devuelve cero vulnerabilidades. La auditoría completa mantiene siete avisos altos en la cadena de herramientas de desarrollo relacionados con `braces`. El [aviso publicado](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) no ofrece una versión corregida y el registro npm devuelve `3.0.3` como última versión al comprobarlo. No se fuerza la migración mayor de Tailwind ni una degradación de ESLint/Next sugerida por la corrección automática.

La verificación en Chromium emulado no equivale a medir batería, memoria o FPS en un teléfono físico, ni certifica todos los navegadores y sensores. Se comprueban límites de trabajo, ausencia de peticiones innecesarias y recuperación de los estados cubiertos; no se atribuye un porcentaje de mejora sin una medición comparable.

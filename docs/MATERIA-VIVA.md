# Materia Viva — entrega para Antigravity

Repositorio: `https://github.com/eneekoruiz/portfolio.git`.
Base de esta intervención: `5ede10399865d1552d5f9e9fb1deac52ea5db823`.

## Qué cambia

- **Materia:** un canvas persistente en el layout comparte la hélice entre portada y detalle. En escritorio, `OpticalCompositor` captura la escena en un `WebGLRenderTarget` y refracta su textura en las coordenadas de las tarjetas reales. Incluye dispersión cromática, grano y reflejos de borde dirigidos por el cursor. En móvil y equipos modestos utiliza renderizado directo sin el segundo pase; el DPR se adapta y queda limitado.
- **Tensión:** el hero editorial y el título de proyectos usan una fuente variable local. Lenis alimenta deformaciones y muelles sin estado React por fotograma. Los botones y acordeones conservan velocidad y posición al cambiar de dirección. La fuente conserva su licencia OFL en `public/fonts`.
- **Umbral:** GSAP Flip expande la tarjeta mientras Next carga el detalle mediante navegación cliente. View Transitions realiza la entrega final entre títulos; hay una alternativa cuando la API no existe. La hélice acelera durante el recorrido. Escape, cambio de tamaño, navegación histórica y tiempo de espera liberan las animaciones y bloqueos. Móvil y movimiento reducido usan navegación directa.
- Se corrige la hidratación de la introducción: consultar el almacenamiento durante el primer render podía dejar `main` invisible en visitas repetidas.
- Se retira el desenfoque animado con scroll del hero de detalle. Los controles y resúmenes nuevos tienen versiones española e inglesa.
- Next.js se actualiza dentro de la versión 16 y se corrigen dependencias transitivas mediante la auditoría de npm.
- La hélice conserva las matrices de sus instancias al cambiar de tema. La vista de AG Beauty Salon usa un enlace externo en localhost y en previews no autorizadas por su política de inserción; conserva el iframe en los dominios publicados que lo permiten.

## Instalación y comprobación

Requiere Node.js 22 o superior. La entrega se comprueba con Node.js 24 en Windows.

```sh
npm ci
npx playwright install chromium
npm run typecheck
npm run lint
npm run test:motion
npm run build
npm run test:e2e
npm audit
```

Playwright inicia producción en `http://localhost:3100` si no hay un servidor. Si ya existe uno, comprobar que sirve esta compilación. Las pruebas cubren lectura y desbordamiento, acordeones reversibles, cambio de idioma, continuidad del documento y canvas, retorno histórico, reducción de movimiento, ausencia de View Transitions y cancelación con Escape. El informe HTML se genera en `playwright-report` y las capturas en `test-results`.

## Subida por Antigravity

La subida remota queda a cargo de Antigravity por petición del usuario. Esta entrega no requiere contraseñas ni tokens dentro del paquete.

1. Leer el manifiesto y los resultados de auditoría incluidos en el paquete. Verificar la rama y el estado del repositorio antes de modificarlo.
2. Si se usa este mismo checkout, los cambios ya están presentes: no volver a aplicar el parche.
3. Si se parte de otra copia, crear una rama `codex/materia-viva` desde la base indicada y aplicar el parche incluido con `git am`. La copia de código incluida permite revisar todos los archivos; no contiene dependencias instaladas ni archivos de entorno locales.
4. Ejecutar las comprobaciones anteriores. Revisar portada, proyectos y detalle en claro y oscuro, también con un dispositivo móvil real antes de afirmar un objetivo de FPS.
5. Verificar que `origin` apunta al repositorio indicado, consultar sus cambios recientes e integrar cualquier divergencia sin sobrescribir trabajo ajeno. Publicar la rama con `git push -u origin codex/materia-viva`. No utilizar force push.
6. Abrir una propuesta de integración describiendo Materia, Tensión, Umbral y los resultados de las pruebas. Una subida a GitHub no equivale por sí misma a un despliegue validado.

## Límites de la verificación

Chromium con SwiftShader permite detectar errores de JavaScript, shaders, navegación y disposición visual. La emulación móvil no certifica rendimiento en hardware real ni compatibilidad con Safari. Los efectos de las secciones no intervenidas y la transición de retorno existente conservan su arquitectura anterior. El resultado de cada comprobación se entrega por separado; este documento no constituye una afirmación de que todas hayan pasado.

# Continuidad visual y Materia Viva — 11 de septiembre de 2026

Referencia anterior a la refactorización: `5ede10399865d1552d5f9e9fb1deac52ea5db823`. Recuperación publicada: `99aa8ce`. Esta revisión compara código y recursos, añade interacciones sobre esa recuperación y comprueba el resultado en navegador. No certifica equivalencia visual del 100 % con todos los estados de la versión histórica.

## Comparación de recursos

| Recurso anterior | Estado de esta entrega |
| --- | --- |
| DNAHelix3D, hebras, nodos y enlaces | Conservados. Nuevo pulso GLSL compartido, respiración y respuesta elástica a la velocidad de scroll. El halo acompaña la paleta de la hélice. |
| Canvas durante cambios de pantalla | Persistente en la raíz; transición Umbral y aceleración warp conservadas. Render directo en móvil/ligero y silueta SVG con movimiento reducido. |
| Nombre con entrada por letras y luz al cursor | Despliegue 3D y onda elástica conservados. Recuperada iluminación dentro de los caracteres con reflejo localizado, además del foco ambiental. |
| Contacto magnético desde el entorno del hero | La versión recuperada sólo respondía dentro del botón. Se recupera la atracción de proximidad con muelles, desplazamiento acotado y liberación sobre otros enlaces. |
| Memoji animado y orientación del dispositivo | Conservados, con pausa por visibilidad y activación explícita del sensor. El encuadre circular actual es diferente del original. |
| Tarjetas de tecnologías y píldoras cilíndricas | Conservadas. Rueda recuperada; se añaden inercia de arrastre, torsión según velocidad, profundidad y navegación con flechas. La pausa mantiene el ángulo. |
| Movimiento en ola de las filas de proyectos | Se recupera en los títulos y paneles interiores; el contenedor óptico conserva sus límites para alinear la refracción. |
| Progreso de desarrollo, tecnologías coloreadas y código | Conservados en los paneles de proyecto; el detalle entra con muelles y pequeño desfase entre paneles. |
| Vista flotante al abrir un proyecto | Conservada como composición gráfica. Las rutas antiguas de vídeo `/projects/*.webm` no tenían archivos en el repositorio de referencia. |
| Zoom 3D reversible hacia «Entrar al Estudio» | Conservado, junto con malla y artefactos flotantes. Corregida la reanudación de la malla al volver a una pestaña; velocidad independiente de la frecuencia de refresco. |
| Telón de palabras, métricas y red de partículas | Conservados. La versión actual del telón se reproduce una vez; la anterior también se invertía al retroceder. Esa diferencia sigue identificada. |
| Bento asimétrico de valores y relieve | Conservados. Recuperado el foco de teclado de las tarjetas para activar el mismo relieve y reflejo. |
| Contacto Gmail/GitHub/LinkedIn con giro | Conservado con muelles, enlaces nativos y confirmación de copia de correo. |
| Botón magnético de regreso en 404 | Otra simplificación detectada al comparar. Recuperado mediante el mismo muelle interrumpible, manteniendo el enlace nativo. |
| Navegación, idiomas, búsqueda, menú, tema, CV, laboratorio y recursos de proyectos | No se sustituyen en esta entrega. La comparación de cambios frente a la referencia no muestra eliminación de archivos de `public`; se añadió la fuente variable y su licencia. |

## Diferencias que no deben ocultarse

La composición editorial, los tamaños, el retrato y algunos tiempos siguen siendo distintos a los de la referencia. Los botones de proyectos/CV mantienen flechas, flujo binario y portal, pero no reproducen el antiguo estado de progreso temporizado al hacer clic. El foco del hero sigue el cursor; el ajuste automático de ese foco al centro de cada CTA tampoco se reproduce exactamente. El estudio conserva su recorrido 3D, pero su contenedor tiene dimensiones y radio finales fijos durante el zoom, en lugar de animar anchura, altura y radio en cada fotograma.

Estas diferencias impiden afirmar «sólo mejorado, nada perdido» de forma absoluta. Los recursos restaurados se mantienen explícitamente inventariados para evitar nuevas simplificaciones inadvertidas.

## Criterios técnicos

- Sin nuevos objetos Three.js por fotograma ni nuevas pasadas de renderizado para el pulso. Se conservan geometrías instanciadas, perfiles adaptativos y reducción de movimiento.
- Las interacciones cambian objetivos de muelles manteniendo su velocidad; los bucles locales se retiran cuando alcanzan reposo o salen de pantalla.
- La rueda sobre tecnologías es pasiva: rota las píldoras y permite desplazar la página. Los gestos táctiles cancelados no lanzan una inercia accidental.
- El texto accesible y los destinos nativos permanecen presentes cuando se desactiva la animación.
- La revisión de capturas en oscuro detectó un desbordamiento rectangular del vídeo y el borde visible del plano atmosférico. El retrato tiene ahora recorte circular explícito dentro de un marco que conserva sombra e inclinación; el shader del halo desvanece su opacidad hasta cero en los cuatro bordes.
- La pausa de las órbitas usa el tiempo real en los muelles, incluso con fotogramas largos; sólo el avance automático se acota para evitar saltos al reanudar.

Extensión de materiales contrastada con la [documentación oficial de Three.js](https://threejs.org/docs/pages/Material.html#onBeforeCompile) y con los fragmentos GLSL de la versión instalada.

## Verificación

- Compilación definitiva de producción y TypeScript: correctos con Next.js 16.2.11.
- ESLint: todos los archivos de código modificados revisados; las correcciones posteriores se volvieron a comprobar. Pruebas analíticas de muelles: aprobadas.
- Ronda completa: 31 aprobados, 3 omitidos por ser gestos exclusivos de ratón en móvil y 2 fallos de pausa de las órbitas en escritorio. El registro mostró que el límite de tiempo por fotograma ralentizaba la recuperación; los muelles se corrigieron para usar tiempo real.
- Ronda final contra la compilación definitiva: **12 de 12 aprobados**, con órbitas, rueda/teclado sin bloqueo del scroll, nombre, compilación de shaders, tema oscuro y regreso desde 404, en escritorio y perfil móvil.
- Cobertura acumulada de esta entrega: **35 casos distintos verificados y 3 omitidos en móvil**. Se conservaron las pruebas de navegación SPA, persistencia del canvas, Atrás, Escape, idiomas, contacto y zoom reversible del estudio.
- Revisión manual de capturas: nombre con iluminación, proyectos desplegados, tecnologías móviles y retrato/halo corregidos en oscuro.

Informes completos iniciales en `scratch/living-matter-full-report`, capturas en `scratch/living-matter-full-captures`; informe y capturas finales en `playwright-report` y `test-results`. Los resultados de la recuperación anterior constan por separado en `RESTAURACION-IDENTIDAD.md`.

Las capturas y pruebas de software no equivalen a una medición de FPS en un iPhone físico, ni prueban todos los navegadores, sensores y estados visuales históricos. La incrustación del estudio depende además de los dominios autorizados por la web externa; en localhost se verifica el acceso alternativo al sitio real.

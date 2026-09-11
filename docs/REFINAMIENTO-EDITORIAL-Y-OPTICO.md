# Refinamiento editorial y óptico

Fecha: 11 de septiembre de 2026. Trabajo posterior al commit `7150f42`, en `codex/materia-viva`.

## Implementado

- Estado compartido del idioma entre controles y rutas, persistencia tolerante a almacenamiento deshabilitado y dirección RTL para árabe.
- Diccionario explícito de interfaz para los 20 idiomas. Se eliminan las bifurcaciones español/inglés de contacto, tecnología, proyectos y controles comunes.
- Traducciones principales mediante campos con nombre, sustituyendo los argumentos posicionales. Correcciones de disponibilidad japonesa, caracteres cirílicos en polaco, etiquetas y redacción de CV, categorías faltantes y textos visibles.
- Selector de idiomas con búsqueda por nombre nativo o traducido, navegación con flechas, Escape y recuperación del foco.
- Panel de idiomas contenido en la barra móvil, sin desplazamiento lateral al enfocar. Navegación que pasa al menú compacto según el ancho real de las etiquetas y recupera los enlaces cuando vuelven a caber.
- Segmentación de titulares por grafemas; árabe e hindi conservan las palabras conectadas. Ajustes tipográficos y de dirección de lectura.
- Captura real de AG Beauty Salon, vistas de código para otros proyectos y aviso explícito en PKE. Ver `PROJECT-MEDIA.md`.
- Profundidad y luz de las vistas de proyecto con muelles; continuidad del recurso dentro de la transición Umbral.
- Entorno de iluminación generado una vez, materiales con capa reflectante y antialiasing adaptativo en el render intermedio. Perfil móvil sin ese render adicional ni entorno de estudio.
- Trayectoria de la hélice interpolada entre secciones y coordinada con la entrada al estudio.
- Repulsión local de píldoras con recuperación elástica, conservando pausa, arrastre, rueda y teclado.
- Mapa de lectura móvil con enlaces anterior/siguiente; retorno y contacto siguen siendo accesibles.
- Seguimiento de secciones por identidad y posición real; las secciones que se montan tarde ya no desplazan la correspondencia de los enlaces.
- Se aceptan interrupciones rápidas de los controles de animación y tema. El tema respeta correctamente la selección inicial del sistema.
- Lente de decisiones en cada caso de Selected Works: tres paradas navegables (arquitectura, desarrollo e impacto) que convierten el proyecto en una lectura rápida de criterio, sistema y resultado, sin abandonar la tarjeta.

## Comprobaciones

- Compilación de producción y TypeScript: correctos en `scratch/editorial-release-build.log`.
- Estructura de los 20 idiomas y 5 casos: correcta en `scratch/editorial-i18n-verified.log`.
- Muelles: aprobadas las comprobaciones de reversión, frecuencia de refresco y fotogramas largos (`scratch/editorial-springs-final.log`).
- Auditoría de navegador final: los 6 escenarios móviles de localización, captura, PKE, persistencia y mapa de lectura pasan en `scratch/editorial-mobile-final-v2.log` y `scratch/editorial-reading-final-v3.log`; el escenario de navegación adaptativa es de escritorio y pasa en `scratch/editorial-release-localization.log`. La órbita de escritorio pasa aislada en `scratch/editorial-orbit-isolated.log`. Las capturas están en `scratch/editorial-desktop-audit-captures`.
- La ronda completa de 52 casos se detuvo después de 35 por la presión de memoria/tiempo del entorno; registró un timeout de estabilidad durante la primera prueba de órbitas que no se reproduce aislada. No se presenta esa ronda interrumpida como certificación de todos los casos.
- La lente de decisiones pasa en escritorio y móvil en `scratch/materia-lens-playwright.log` y `scratch/materia-lens-playwright-mobile.log`; la compilación posterior a la integración pasa en `scratch/materia-lens-build.log`.

## Alcance de las garantías

El comprobador detecta claves, tamaños de colecciones, textos vacíos y determinadas mezclas de escritura. No certifica naturalidad lingüística. No se han verificado métricas comerciales de los casos ni disponibilidad de todos los repositorios externos.

Se mantiene el inventario de continuidad de `AUDITORIA-CONTINUIDAD-VISUAL.md`; las diferencias históricas que allí se señalan no desaparecen por este refinamiento.

## Entrega

Los cambios están en el árbol de trabajo de esta carpeta y se entregan en la rama `codex/materia-viva`. No restaurar archivos desde el ZIP antiguo. El usuario ha autorizado explícitamente commit y subida a GitHub.

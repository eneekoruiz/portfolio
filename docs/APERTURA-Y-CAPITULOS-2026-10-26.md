# Apertura, capítulos y rendimiento (2026-10-26)

Cómo está construida la página principal tras este cambio y por qué. Todo vive en `app/`.

## La apertura (≈ 6 s, se salta con cualquier tecla o clic)

1. **Pantalla de bienvenida** (`components/motion/Overture.tsx`). Una pantalla propia: contador real 00→100 (espera a fuentes y a `load`, mínimo 0,9 s, máximo 2,6 s), la palabra de bienvenida del idioma ocupando todo el ancho, y una implosión.
2. **Estallido**. Un fotograma invertido y el agujero se abre: su radio es `frontRadius()` (`lib/sand-renderer.ts`), la misma curva que sigue la onda en el shader, así la onda cruza de una superficie a la otra sin costura. Emite `overture-impact`.
3. **El suelo se derrumba y los fuegos artificiales descubren el nombre** (`hooks/useHeroCinematic.ts`). Un estallido grande en el centro y tres más a lo largo del nombre (20 %, 62 % y el punto final, en azul de marca). Cada uno:
   - agrieta y hunde la arena (shader),
   - lanza chispas con estela, terrones y polvo (`lib/burst-fx.ts`, canvas 2D),
   - descubre las letras que su frente alcanza (`ShockType`, `revealOnBurst`).
4. La interfaz entra cuando el polvo empieza a asentarse y se libera la página.

Con `prefers-reduced-motion` no hay apertura: el póster aparece completo.

### Eventos

| Evento | Quién lo emite | Quién lo escucha |
| --- | --- | --- |
| `overture-impact` | Overture | useHeroCinematic |
| `hero-burst` `{x,y,power,tint,reveal}` | useHeroCinematic (`triggerHeroBurst`) | SandField (shader), BurstLayer (partículas), ShockType (letras) |
| `hero-burst-clear` | useHeroCinematic al saltar | BurstLayer |
| `tectonic-impact` | clics, CTAs | SandField, ShockType (`listen`) |

## La arena (`lib/sand-renderer.ts`, `workers/sand.worker.ts`)

- Se dibuja en un **Web Worker sobre OffscreenCanvas**; si el navegador no lo permite, el mismo renderer corre en el hilo principal (`components/motion/SandField.tsx`).
- Cada *burst* añade: hundimiento escalonado (`collapse`), grietas radiales que adelgazan y se bifurcan (`cracks`), hollín y un destello breve. Se curan solas en unos segundos. Máximo 4 simultáneos.
- El bucle duerme cuando nada se mueve.

## Tipografía (`components/motion/ShockType.tsx`, `styles/brutal.css`)

Roboto Flex variable: ejes `wght` 100–1000 y `wdth` 25–151. Cada línea se **ajusta al ancho** de su contenedor; si la altura limita el tamaño, se ensancha el eje `wdth`, y si aun así sobra espacio se abre el *tracking*. Cada letra tiene un muelle: un impacto se programa para cuando el frente llega a ella (se ensancha, engorda y salta). Lo usan el nombre, los títulos de capítulo y la palabra de bienvenida.

## Capítulos

Cada sección es **una pantalla** (`.chapter`, `min-height: 100svh`) con su título (`ChapterTitle`: una pequeña onda lo recorre al llegar). En escritorio con ratón, un imán suave (`scroll-snap-type: y proximity`) asienta el desplazamiento justo en el inicio del capítulo; nunca se opone a la lectura y no actúa en móvil ni en el carrusel.

- **Proyectos**: carrusel horizontal. El desplazamiento vertical solo retiene las 3 primeras tarjetas (`PINNED_CARDS`, `SCROLL_PER_CARD`); el resto se ve deslizando o con las flechas. Cada tarjeta es un único enlace: vista previa, nombre, una frase (`data/project-pitch.ts`), ≤ 3 tecnologías y un botón.
- **Stack** y **Filosofía** conservan sus tarjetas originales; solo se ajusta su altura (`styles/stack-cards.css`), y en móvil pasan a fila deslizable.
- **Contacto**: título a ancho completo, una frase y tres botones iguales.

## Movimiento

- Activo por defecto en cada visita. Pausar con el botón solo dura esa visita (`lib/motion-store.ts`); no se guarda en `localStorage`. El ajuste del sistema operativo se respeta siempre.
- `lib/materia.ts`: el ticker de muelles compartido **duerme** si nada se mueve y lo despiertan la entrada del usuario o `wakeMateria()`.
- Variables CSS inheredables (`--chapter`, tensión de tarjeta) se escriben solo en los elementos que las leen, no en `<html>` ni en la tarjeta entera.

## Cómo se comprueba

Los tests comprueban **comportamiento**, no aspecto: así un retoque de diseño no los rompe.

- `npm run test:fast`: humo + apertura + carrusel (~30 s).
- `npm run test:changed`: solo los specs que cambian respecto a `origin/main`.
- `npm run test:e2e`: todo (~1 min con 4 workers; 1 reintento por test).

Specs: `smoke` (carga sin errores, abrir proyecto y volver con Atrás, cada capítulo cabe en una pantalla, sin desbordes), `opening` (bienvenida, estallido, salto con tecla, nombre a ancho completo, movimiento reducido), `project-reel` (título una vez, retención de 3 tarjetas, flechas, movimiento activo por defecto), más GitHub, idioma/navegación y superposiciones.

Se retiraron los specs que fijaban píxeles o interfaz ya eliminada (acordeón, lente de decisión, ADN en portada, retrato).

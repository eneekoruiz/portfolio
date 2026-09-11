# Vistas de proyectos

## Captura publicada

- `public/projects/ana-peluquera.jpg`: captura real de https://agpeluqueria.vercel.app, realizada el 11 de septiembre de 2026 a 1365 × 900. Se cierra el aviso de cookies mediante «Solo necesarias» antes de capturar. No contiene una reserva ni datos personales de clientes.
- `scripts/capture-project-previews.mjs` permite regenerar la captura. Verificar visualmente el resultado antes de sustituirla: el sitio publicado puede cambiar.
- `app/data/project-media.ts` contiene únicamente medios con procedencia comprobada.

## Proyectos sin captura

- PKE Web: el enlace publicado devolvió 404. El usuario confirmó que debe aparecer sin previsualización por ahora. Se conserva su caso de estudio y su código documentado; se deja de intentar cargar la URL caída en un iframe.
- Who Are Ya, Rides y SpotShare: las tarjetas muestran fragmentos ya documentados en `app/data/projects.ts`. Son vistas de código, no capturas de una interfaz ni nuevas afirmaciones sobre un repositorio externo.
- No se ha presentado `public/loginjsf.mp4` como captura de Rides: la inspección de ese archivo mostró un avatar. El archivo original se conserva.

## Continuidad

`ProjectVisual` comparte el recurso entre tarjeta, vista junto al cursor y cabecera del detalle. Umbral conserva y transforma el elemento durante la expansión, y usa el mismo nombre de transición para la entrega de la imagen al destino. Sin View Transitions conserva el fundido existente; con movimiento reducido o puntero táctil mantiene navegación inmediata.

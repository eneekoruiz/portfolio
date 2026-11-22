# Portfolio Personal · Eneko Ruiz

Sitio web personal y portfolio de ingeniería de software desarrollado con Next.js (App Router), TypeScript, animaciones GSAP, renderizado 3D con Three.js y desplazamiento inercial.

- **Demo en vivo:** [eneekoruiz.dev](https://eneekoruiz.dev)
- **Documentación de arquitectura:** [DeepWiki - portfolio](https://deepwiki.com/eneekoruiz/portfolio)

## Arquitectura y Decisiones de Diseño

- **Server Components & Client Boundaries:** Arquitectura de Next.js App Router donde el contenido estructural y metadatos SEO se renderizan en servidor, limitando los componentes cliente a interactividad gestual y animaciones.
- **Micro-interacciones y Scroll Cinemático:** Integración de Lenis para scroll inercial sincronizado con timelines de GSAP ScrollTrigger y shaders de Three.js.
- **Soporte de Tema y Accesibilidad:** Modo oscuro nativo implementado con `next-themes`, variables CSS semánticas y contrastes verificados mediante tests automáticos con Playwright.
- **Internacionalización y Rutas Dinámicas:** Páginas de detalle de proyecto (`/work/[id]`) con renderizado estático incremental y validación de enlaces externos.

## Stack Técnico

- **Core:** Next.js 15+, React 19, TypeScript, Tailwind CSS
- **Animaciones & Gráficos:** GSAP, `@gsap/react`, Lenis, Three.js, `@react-three/fiber`, `@react-three/drei`, Framer Motion
- **Iconos & Temas:** Lucide Icons, `next-themes`
- **Testing:** Playwright (pruebas E2E, smoke tests y regresión visual)

## Puesta en Marcha Local

### Prerrequisitos

- Node.js 18+

### Instalación y Ejecución

```bash
git clone https://github.com/eneekoruiz/portfolio.git
cd portfolio
npm install

# Servidor de desarrollo (puerto 3000)
npm run dev

# Verificación de tipos y linter
npm run typecheck
npm run lint

# Pruebas End-to-End
npm run test:fast
```

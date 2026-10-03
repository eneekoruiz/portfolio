# Eneko Ruiz | Software Engineer

Personal portfolio built with Next.js, React, TypeScript, GSAP, and Three.js.

## What is here

- Selected work from my main projects
- Short project summaries
- Links to the repositories behind each project
- A compact contact section

## Notes

- Featured projects render immediately from local content. Optional GitHub activity loads through a server-side API when its section approaches the viewport.
- Motion is kept minimal so the content stays readable.
- Accessibility and reduced-motion support are part of the design.

## Local development

```bash
npm install
npm run dev
npm run build
```

## Architecture

The site uses the Next.js App Router. Page sections and shared components render the portfolio content, while a server-side GitHub API route retrieves repository data without exposing credentials to the browser.

Native scrolling schedules presentation updates only when needed. A shared motion policy respects reduced motion, data saving, device capabilities, and tab visibility. Touch and modest devices start with static decoration; desktop WebGL is loaded lazily, capped at 30 frames per second, and paused outside the project hero. Skills start as readable chips and require explicit activation to orbit. Embedded demos load only when the visitor enters the studio and unload when it closes.

Metadata, featured work, and contact links remain available through the server-rendered route, including when JavaScript enhancements are unavailable.

## Validation

```bash
npm ci
npm run typecheck
npm run build
npm run lint
npm run test:motion
npx playwright test --config playwright.performance.config.mjs
npm run test:e2e
```

The performance configuration covers 1440×900 desktop, 768×1024 tablet, and 375×667 mobile. It verifies deferred requests, offscreen pausing, cursor fallback, reduced motion, navigation, JavaScript-disabled content, and all 20 supported languages. Browser measurements are local diagnostics, not field Core Web Vitals.

## Links

- DeepWiki: https://deepwiki.com/eneekoruiz/portfolio

© 2026 Eneko Ruiz

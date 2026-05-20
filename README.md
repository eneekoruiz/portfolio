# ENEKO RUIZ | SOFTWARE ENGINEER

A high-performance portfolio focusing on motion design and hardened React architecture. Built with **Next.js 16 (App Router)**, utilizing **Server Components (RSC)** and **React 19** for optimized rendering and data integrity.

---

## Technical Architecture

- **Rendering Strategy**: hybrid approach using Server Components for data pre-fetching and specialized Client Components for GSAP-driven interactions.
- **Motion Engine**: custom proximity-based interaction system using GSAP and Lenis for smooth, physics-based scrolling.
- **Data Integrity**: direct integration with GitHub REST API with server-side caching and atomic fallback states.
- **Security**: hardened nonce-based script CSP, sanitized API routes, and zero-public-token architecture.
- **A11Y**: WCAG 2.2 AA targeted (WCAG-conscious), full keyboard navigation, and `prefers-reduced-motion` support.

---

## Tech Stack

| Layer              | Technology              |
| :----------------- | :---------------------- |
| **Framework**      | Next.js 16 (App Router) |
| **Runtime**        | React 19 + Node 22      |
| **Logic**          | TypeScript 6            |
| **Motion**         | GSAP (GreenSock)        |
| **Styling**        | Tailwind CSS 3.4        |
| **Infrastructure** | Vercel                  |

---

## Featured Work (Selection)

- **AG Beauty Salon**: Full-stack booking platform with a custom Sandwich Algorithm and atomic Google Calendar synchronization.
- **Who Are Ya?**: High-performance football identity engine with an MVC architecture and MongoDB Atlas integration.
- **Rides24**: Distributed system implementation in Java with JAX-WS and ObjectDB, focusing on thread-safe concurrency.
- **SpotShare**: Cloud-native parking intelligence platform with SonarCloud audit and optimistic locking.
- **PKE Web**: Semantic web platform designed with accessibility considerations (WCAG-conscious).

---

## Deployment & Setup

```bash
# Clone
git clone https://github.com/eneekoruiz/portfolio.git

# Install
npm install

# Build & Verify
npm run build
```

_Note: Requires `GITHUB_TOKEN` in environment variables for authenticated API requests._

---

## Senior Audit Refactoring Pass

The portfolio has been meticulously hardened to pass strict production audits covering architecture, security, complexity, and maintainability:

1. **GitHub API Route Hardening (`app/api/github/repos/route.ts`)**:
   - **Strict Whitelist**: Enforces whitelist matching for `sort` and `direction` query parameters.
   - **Integer Hardening**: Restricts `per_page` to valid integers between 1 and 100 using safe parsing.
   - **Security Masking**: Masks raw upstream payloads or rates limit errors, returning safe, generic error objects (`429` for rate limits and `502`/`404` for fetch errors) while logging raw errors exclusively server-side.
   - **Low Complexity**: Modularized URL validation and parallel language queries into separate, highly-typed single-responsibility functions.

2. **React Shell Modularization (`app/HomeClient.tsx`)**:
   - **Custom Hooks**: Extracted core single-responsibility custom hooks under `app/hooks/` (`useProjectNavigation`, `useScrollRestoration`, `useReturnTransition`, `useLenisSetup`, `useGsapOrchestration`, `useActiveSection`, `useModalState`, `useMobileMenu`, `useIntroPhase`, `useDnaColors`, `useNavbarInteractions`).
   - **Complexity Reduction**: Removed side-effects, keyboard bindings, visibility listeners, scroll setups, color lookups, and preloader handlers from the orchestrator shell, decreasing lines of code and cognitive complexity.
   - **Visual DNA Integrity**: Retained 100% fidelity for all GSAP timelines, responsive layout boundaries, dark mode transitions, DNA Helix responsive transformations, and Lenis scroll physics.

3. **Hardened Content-Security-Policy (`middleware.ts`)**:
   - **Hardened Script Protection**: Implements a strong cryptographically signed nonce (`'nonce-...'`) policy for script tags in production, completely removing both `'unsafe-inline'` and `'unsafe-eval'` to secure against script injections.
   - **Style Trade-Off**: Retains `'unsafe-inline'` under `style-src` as an audited trade-off, necessitated by Next.js (runtime dynamic styling), Tailwind CSS, and GSAP's physics engine which require runtime style injections for 60fps animations, responsive design limits, and fluid dark-mode theme switches.
   - **Protocol Security**: Rejects all insecure HTTP connections globally via `upgrade-insecure-requests`.

---

© 2026 Eneko Ruiz.  
[eneekoruiz@gmail.com](mailto:eneekoruiz@gmail.com)

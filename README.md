# ENEKO RUIZ | SOFTWARE ENGINEER

A high-performance portfolio focusing on motion design and hardened React architecture. Built with **Next.js 16 (App Router)**, utilizing **Server Components (RSC)** and **React 19** for optimized rendering and data integrity.

---

## Technical Architecture

- **Rendering Strategy**: hybrid approach using Server Components for data pre-fetching and specialized Client Components for GSAP-driven interactions.
- **Motion Engine**: custom proximity-based interaction system using GSAP and Lenis for smooth, physics-based scrolling.
- **Data Integrity**: direct integration with GitHub REST API with server-side caching and atomic fallback states.
- **Security**: strict Content-Security-Policy (CSP), hardened API routes, and zero-public-token architecture.
- **A11Y**: WCAG-compliant semantic structure, full keyboard navigation, and `prefers-reduced-motion` support.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **Runtime** | React 19 + Node 22 |
| **Logic** | TypeScript 6 |
| **Motion** | GSAP (GreenSock) |
| **Styling** | Tailwind CSS 3.4 |
| **Infrastructure** | Vercel |

---

## Featured Work (Selection)

*   **AG Beauty Salon**: Full-stack booking platform with a custom Sandwich Algorithm and atomic Google Calendar synchronization.
*   **Who Are Ya?**: High-performance football identity engine with an MVC architecture and MongoDB Atlas integration.
*   **Rides24**: Distributed system implementation in Java with JAX-WS and ObjectDB, focusing on thread-safe concurrency.
*   **SpotShare**: Cloud-native parking intelligence platform with SonarCloud audit and optimistic locking.
*   **PKE Web**: Semantic web platform built with strict adherence to WCAG 2.1 AA accessibility standards.

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

*Note: Requires `GITHUB_TOKEN` in environment variables for authenticated API requests.*

---

© 2026 Eneko Ruiz.  
[eneekoruiz@gmail.com](mailto:eneekoruiz@gmail.com)

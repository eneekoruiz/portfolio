# ENEKO RUIZ | SOFTWARE ENGINEER

A high-performance portfolio focusing on motion design and hardened React architecture. Built with **Next.js 14 (App Router)**, utilizing **Server Components (RSC)** for optimized rendering and data integrity.

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
| **Framework** | Next.js 14 (App Router) |
| **Logic** | TypeScript |
| **Motion** | GSAP (GreenSock) |
| **Styling** | Tailwind CSS |
| **Infrastructure** | Vercel |

---

## Featured Work (Selection)

*   **PL/0 Compiler**: A functional compiler implementation in C, handling lexical analysis, recursive descent parsing, and P-code generation.
*   **GestDB**: A robust database abstraction layer for PostgreSQL built with Java, focusing on connection pooling and schema integrity.
*   **NetSim**: A network protocol simulator in Python utilizing socket programming and multi-threading.

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

# ENEKO RUIZ | FULL STACK & SYSTEMS

This portfolio is a technical space designed to demonstrate the intersection between low-level systems engineering and high-performance frontend development. No templates or UI kits were used—everything is built from scratch with a focus on physics-based interaction and modular architecture.

---

## TECH STACK

| LAYER | TECHNOLOGY |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router) |
| **Logic** | TypeScript |
| **Animation** | GSAP (GreenSock) |
| **Styling** | Tailwind CSS |
| **API** | GitHub REST API |
| **Infrastructure** | Vercel |

---

## CORE ENGINEERING

### Magnetic UI Engine
I developed a custom proximity-based interaction system using GSAP. The primary Call-to-Action (CTA) acts as a gravitational body that attracts the cursor within a 500px radius. To ensure usability, the engine includes "repel" logic that releases the element when the cursor targets neighboring buttons, preventing interaction conflicts.

### Dynamic Data & Fallbacks
The project integrates directly with the GitHub API to pull live repository metrics. To handle API rate limits or connectivity issues, I implemented a custom caching layer and a "headless" state that displays local project data (Selected Works) as a fallback, ensuring the UI never breaks.

---

## FEATURED PROJECTS

**PL/0 Compiler (C)**
A functional compiler built from the ground up in C. Handles lexical analysis, syntax parsing, and code generation for the PL/0 language.

**GestDB (Java)**
A database management layer designed for PostgreSQL. Focused on optimizing JDBC connections and handling complex relational schemas.

**NetSim (Python)**
A network protocol simulator. Uses Python threading and socket programming to model data transmission and collision handling.

---

## LOCAL SETUP

To run this project locally:

1. Clone the repository:
   `git clone https://github.com/eneekoruiz/portfolio.git`

2. Install dependencies:
   `npm install`

3. Start the development server:
   `npm run dev`

*Note: A GitHub Personal Access Token (GITHUB_TOKEN) is recommended in your .env.local to avoid API rate-limiting during development.*

---

## CONTACT

**Eneko Ruiz** Software Developer  
[eneekoruiz@gmail.com](mailto:eneekoruiz@gmail.com)  

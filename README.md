# Eneko Ruiz | Software Engineer

Personal portfolio built with Next.js, React, TypeScript, GSAP, and Lenis.

## What is here

- Selected work from my main projects
- Short project summaries
- Links to the repositories behind each project
- A compact contact section

## Notes

- The site uses a server-side GitHub API route for portfolio content.
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

GSAP and Lenis are isolated to client-side presentation code. Metadata and core content remain available through the server-rendered route, including when motion is reduced or JavaScript enhancements are unavailable.

## Links

- DeepWiki: https://deepwiki.com/eneekoruiz/portfolio

© 2026 Eneko Ruiz

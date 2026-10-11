import type { ProjectCard, Tx } from "../types";
const PROJECT_IDS = [
  "ana-peluquera",
  "recordatorios",
  "passwordmanager",
  "regla",
  "who-are-ya-backend",
  "rides24ofiziala",
  "spotshare-parking",
  "pke-web",
];

const customStacks: Record<string, string[]> = {
  "ana-peluquera": [
    "React",
    "Firebase",
    "Node.js",
    "Google Calendar API",
    "Tailwind",
    "Vercel",
  ],
  recordatorios: [
    "React",
    "TypeScript",
    "PWA",
    "Zustand",
    "IndexedDB",
    "Node.js",
    "Prisma",
    "PostgreSQL",
  ],
  passwordmanager: [
    "React",
    "TypeScript",
    "Web Crypto",
    "AES-GCM",
    "WebAuthn",
    "IndexedDB",
    "Firebase",
  ],
  regla: [
    "React",
    "TypeScript",
    "Tailwind",
    "Node.js",
    "PostgreSQL",
    "JWT",
    "Capacitor",
  ],
  "who-are-ya-backend": [
    "Node.js",
    "Express",
    "MongoDB",
    "JWT",
    "REST API",
    "GitHub Actions",
  ],
  rides24ofiziala: ["Java", "JAX-WS", "ObjectDB", "Swing", "SOAP", "JUnit"],
  "spotshare-parking": [
    "TypeScript",
    "SonarCloud",
    "NestJS",
    "Docker",
    "PostgreSQL",
    "CI/CD",
  ],
  "pke-web": [
    "React",
    "Tailwind",
    "A11y",
    "Semantic HTML",
    "Semantic UI",
    "Jest",
  ],
};

const FALLBACK_TAGS: Record<string, string> = {
  "ana-peluquera": "Booking & CMS",
  recordatorios: "PWA & Offline MCP",
  passwordmanager: "Crypto & WebAuthn",
  regla: "Health & Mobile App",
  "who-are-ya-backend": "Backend / REST API",
  rides24ofiziala: "SOAP / Distributed",
  "spotshare-parking": "Cloud / NestJS",
  "pke-web": "A11y / Frontend",
};

const FALLBACK_DESCS: Record<string, string> = {
  "ana-peluquera":
    "Sistema de reservas online y CMS con sincronización en Google Calendar.",
  recordatorios:
    "PWA offline-first con sincronización, tareas en lenguaje natural y servidor MCP.",
  passwordmanager:
    "Bóveda con cifrado AES-GCM zero-knowledge, WebAuthn biométrico y TOTP 2FA.",
  regla:
    "Seguimiento menstrual y bienestar con almacenamiento local y app móvil en Capacitor.",
  "who-are-ya-backend":
    "Backend RESTful de alto rendimiento en Node.js, Express y MongoDB.",
  rides24ofiziala:
    "Arquitectura distribuida SOAP con JAX-WS y concurrencia pesimista en Java.",
  "spotshare-parking":
    "Plataforma de estacionamiento con NestJS, Docker y control de concurrencia optimista.",
  "pke-web":
    "Interfaz web altamente accesible cumpliendo con estándares WCAG 2.1 AA.",
};

/** Curated work is independent of GitHub uptime and request latency. */
export function getFeaturedProjects(t: Tx): ProjectCard[] {
  return PROJECT_IDS.map((id, index) => ({
    n: String(index + 1).padStart(2, "0"),
    name: id,
    tag: t.projectTags[index] ?? FALLBACK_TAGS[id] ?? "Software Engineering",
    year: "2026",
    size: "—",
    desc: FALLBACK_DESCS[id] ?? "",
    langs: customStacks[id] ?? [],
    challenge: "",
    architecture: "Eneko Ruiz",
    outcome: "",
  }));
}

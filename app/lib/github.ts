import type { ProjectCard, Tx } from "../types";
const PROJECT_IDS = [
  "ana-peluquera",
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

/** Curated work is independent of GitHub uptime and request latency. */
export function getFeaturedProjects(t: Tx): ProjectCard[] {
  return PROJECT_IDS.map((id, index) => ({
    n: String(index + 1).padStart(2, "0"),
    name: id,
    tag: t.projectTags[index],
    year: "2026",
    size: "—",
    desc:
      [t.projectServerDesc, t.projectWhoDesc, t.projectRidesDesc][index] ?? "",
    langs: customStacks[id] ?? [],
    challenge: "",
    architecture: "Eneko Ruiz",
    outcome: "",
  }));
}

/**
 * PROJECTS SECTION CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────────
 * Configuration constants for the selected work themes and stages.
 */

export const LIFECYCLE = [
  "System Architecture",
  "Core Development",
  "Production Deployment",
  "Security & Audit",
] as const;

export interface ProjectTheme {
  color: string;
  rgb: string;
  img: string;
  gradient: string;
  progress: number;
  btnText: string;
  hasAudit: boolean;
}

export const PROJ_THEMES: Record<string, ProjectTheme> = {
  "ana-peluquera": {
    color: "#d95b7c",
    rgb: "217, 91, 124",
    img: "radial-gradient(ellipse at 50% 120%, rgba(217,91,124,0.2) 0%, transparent 75%)",
    gradient:
      "radial-gradient(at 0% 0%, rgba(217,91,124,0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(217,91,124,0.08) 0px, transparent 50%)",
    progress: 4,
    btnText: "Ver Auditoría",
    hasAudit: true,
  },
  "who-are-ya-backend": {
    color: "#3da54b",
    rgb: "61, 165, 75",
    img: "radial-gradient(ellipse at 50% 120%, rgba(61,165,75,0.2) 0%, transparent 75%)",
    gradient:
      "radial-gradient(at 0% 0%, rgba(61,165,75,0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(61,165,75,0.08) 0px, transparent 50%)",
    progress: 4,
    btnText: "Ver Auditoría",
    hasAudit: true,
  },
  rides24ofiziala: {
    color: "#bf7b0e",
    rgb: "191, 123, 14",
    img: "radial-gradient(ellipse at 50% 120%, rgba(191,123,14,0.2) 0%, transparent 75%)",
    gradient:
      "radial-gradient(at 0% 0%, rgba(191,123,14,0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(191,123,14,0.08) 0px, transparent 50%)",
    progress: 3,
    btnText: "Ver Detalles",
    hasAudit: true,
  },
  "spotshare-parking": {
    color: "#1a9eac",
    rgb: "26, 158, 172",
    img: "radial-gradient(ellipse at 50% 120%, rgba(26,158,172,0.2) 0%, transparent 75%)",
    gradient:
      "radial-gradient(at 0% 0%, rgba(26,158,172,0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(26,158,172,0.08) 0px, transparent 50%)",
    progress: 2,
    btnText: "Source Code",
    hasAudit: false,
  },
  "pke-web": {
    color: "#9f71dc",
    rgb: "159, 113, 220",
    img: "radial-gradient(ellipse at 50% 120%, rgba(159,113,220,0.2) 0%, transparent 75%)",
    gradient:
      "radial-gradient(at 0% 0%, rgba(159,113,220,0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(159,113,220,0.08) 0px, transparent 50%)",
    progress: 4,
    btnText: "Ver Auditoría",
    hasAudit: true,
  },
  recordatorios: {
    color: "#5688ec",
    rgb: "86, 136, 236",
    img: "radial-gradient(ellipse at 50% 120%, rgba(86,136,236,0.2) 0%, transparent 75%)",
    gradient:
      "radial-gradient(at 0% 0%, rgba(86,136,236,0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(86,136,236,0.08) 0px, transparent 50%)",
    progress: 4,
    btnText: "Ver Auditoría",
    hasAudit: true,
  },
  passwordmanager: {
    color: "#16a573",
    rgb: "22, 165, 115",
    img: "radial-gradient(ellipse at 50% 120%, rgba(22,165,115,0.2) 0%, transparent 75%)",
    gradient:
      "radial-gradient(at 0% 0%, rgba(22,165,115,0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(22,165,115,0.08) 0px, transparent 50%)",
    progress: 4,
    btnText: "Ver Auditoría",
    hasAudit: true,
  },
  regla: {
    color: "#dc5c69",
    rgb: "220, 92, 105",
    img: "radial-gradient(ellipse at 50% 120%, rgba(220,92,105,0.2) 0%, transparent 75%)",
    gradient:
      "radial-gradient(at 0% 0%, rgba(220,92,105,0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(220,92,105,0.08) 0px, transparent 50%)",
    progress: 4,
    btnText: "Ver Auditoría",
    hasAudit: true,
  },
};

export const DEFAULT_THEME: ProjectTheme = {
  color: "#1f4bff",
  rgb: "31, 75, 255",
  img: "radial-gradient(ellipse at 50% 120%, rgba(31,75,255,0.1) 0%, transparent 65%)",
  gradient:
    "linear-gradient(to bottom, rgba(31,75,255,0.08) 0%, transparent 100%)",
  progress: 1,
  btnText: "Source Code",
  hasAudit: false,
};

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
    color: "#ff2d78",
    rgb: "255, 45, 120",
    img: "radial-gradient(ellipse at 50% 120%, rgba(255,45,120,0.2) 0%, transparent 75%)",
    gradient:
      "radial-gradient(at 0% 0%, rgba(255,45,120,0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(255,45,120,0.08) 0px, transparent 50%)",
    progress: 4,
    btnText: "Ver Auditoría",
    hasAudit: true,
  },
  "who-are-ya-backend": {
    color: "#00c940",
    rgb: "0, 201, 64",
    img: "radial-gradient(ellipse at 50% 120%, rgba(0,201,64,0.2) 0%, transparent 75%)",
    gradient:
      "radial-gradient(at 0% 0%, rgba(0,201,64,0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(0,201,64,0.08) 0px, transparent 50%)",
    progress: 4,
    btnText: "Ver Auditoría",
    hasAudit: true,
  },
  rides24ofiziala: {
    color: "#e69400",
    rgb: "230, 148, 0",
    img: "radial-gradient(ellipse at 50% 120%, rgba(230,148,0,0.2) 0%, transparent 75%)",
    gradient:
      "radial-gradient(at 0% 0%, rgba(230,148,0,0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(230,148,0,0.08) 0px, transparent 50%)",
    progress: 3,
    btnText: "Ver Detalles",
    hasAudit: true,
  },
  "spotshare-parking": {
    color: "#00d4e8",
    rgb: "0, 212, 232",
    img: "radial-gradient(ellipse at 50% 120%, rgba(0,212,232,0.2) 0%, transparent 75%)",
    gradient:
      "radial-gradient(at 0% 0%, rgba(0,212,232,0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(0,212,232,0.08) 0px, transparent 50%)",
    progress: 2,
    btnText: "Source Code",
    hasAudit: false,
  },
  "pke-web": {
    color: "#9b1fff",
    rgb: "155, 31, 255",
    img: "radial-gradient(ellipse at 50% 120%, rgba(155,31,255,0.2) 0%, transparent 75%)",
    gradient:
      "radial-gradient(at 0% 0%, rgba(155,31,255,0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(155,31,255,0.08) 0px, transparent 50%)",
    progress: 4,
    btnText: "Ver Auditoría",
    hasAudit: true,
  },
};

export const DEFAULT_THEME: ProjectTheme = {
  color: "#0066cc",
  rgb: "0, 102, 204",
  img: "radial-gradient(ellipse at 50% 120%, rgba(0,102,204,0.1) 0%, transparent 65%)",
  gradient:
    "linear-gradient(to bottom, rgba(0,102,204,0.08) 0%, transparent 100%)",
  progress: 1,
  btnText: "Source Code",
  hasAudit: false,
};

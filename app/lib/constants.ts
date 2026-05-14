import { Server, Monitor, Cpu, Database, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Lang } from '../types';

/**
 * Skill Category Definition
 */
export interface SkillCategory {
  g: string;
  I: LucideIcon;
  c: string;
  rgb: string;
  tint: string;
  border: string;
  techs: readonly string[];
}

/**
 * SKILLS - Technology stack grouped by category
 */
export const SKILLS: readonly SkillCategory[] = [
  {
    g: 'Backend',
    I: Server,
    c: '#0066cc',
    rgb: '0, 102, 204',
    tint: 'from-blue-500/10',
    border: 'border-blue-500/20',
    techs: ['Python', 'Java', 'C/C++', 'Node.js', 'Express', 'Spring', 'Rust'],
  },
  {
    g: 'Frontend',
    I: Monitor,
    c: '#34a853',
    rgb: '52, 168, 83',
    tint: 'from-green-500/10',
    border: 'border-green-500/20',
    techs: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'React', 'Next.js'],
  },
  {
    g: 'Sistemas',
    I: Cpu,
    c: '#ff9500',
    rgb: '255, 149, 0',
    tint: 'from-orange-500/10',
    border: 'border-orange-500/20',
    techs: ['Linux', 'Docker', 'Git', 'Bash', 'SSH', 'Make', 'CI/CD'],
  },
  {
    g: 'DB',
    I: Database,
    c: '#af52de',
    rgb: '175, 82, 222',
    tint: 'from-purple-500/10',
    border: 'border-purple-500/20',
    techs: ['PostgreSQL', 'MySQL', 'SQLite', 'MongoDB', 'Redis', 'Prisma'],
  },
  {
    g: 'AI & LLM',
    I: Zap,
    c: '#ff2d55',
    rgb: '255, 45, 85',
    tint: 'from-pink-500/10',
    border: 'border-pink-500/20',
    techs: ['Antigravity', 'GeminiChat', 'Claude', 'GPT-4', 'Cursor', 'LLMs'],
  },
] as const;

/**
 * LANG_LABELS - Human-readable language names
 */
export const LANG_LABELS: Record<Lang, string> = {
  es: 'Español',
  en: 'English',
  eu: 'Euskera',
  fr: 'Français',
  it: 'Italiano',
  de: 'Deutsch',
  pt: 'Português',
  ca: 'Català',
  gl: 'Galego',
  ja: '日本語',
};

/**
 * LANG_C - Programming language colors for badges
 */
export const LANG_COLORS: Record<string, string> = {
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  Python: '#3776AB',
  Java: '#b07219',     // Corregido: Color café oficial de GitHub para Java
  'C++': '#f34b7d',    // Corregido: Color oficial de C++ en GitHub
  C: '#555555',        // Gris oscuro oficial
  Shell: '#89e051',    // Verde claro oficial de Bash/Shell
  HTML: '#E34C26',
  CSS: '#563d7c',      // Corregido: Púrpura oficial de GitHub (para que no choque con TypeScript)
  Dockerfile: '#384d54',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#DEA584',
  Makefile: '#427819',
  'Node.js': '#0066cc',
  'Express': '#0066cc', 
  'Spring': '#0066cc',
  'React': '#34a853',
  'Next.js': '#34a853',
  'HTML5': '#34a853',
  'CSS3': '#34a853',
  'Tailwind': '#34a853',
  'MongoDB': '#af52de',
  'PostgreSQL': '#af52de',
  'MySQL': '#af52de',
  'SQLite': '#af52de',
  'Redis': '#af52de',
  'Prisma': '#af52de',
  'JWT': '#af52de',
  'Docker': '#ff9500',
  'Git': '#ff9500',
  'Linux': '#ff9500',
  'Bash': '#ff9500',
  'CI/CD': '#ff9500',
  'Antigravity': '#ff2d55',
  'GeminiChat': '#ff2d55',
  'Claude': '#ff2d55',
  'GPT-4': '#ff2d55',
  'LLMs': '#ff2d55'
};

/** Alias for backwards compat */
export const LANG_C = LANG_COLORS;
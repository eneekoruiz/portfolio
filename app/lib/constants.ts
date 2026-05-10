import { Server, Monitor, Cpu, Database } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Lang } from '../types';

/**
 * Skill Category Definition
 */
export interface SkillCategory {
  g: string;
  I: LucideIcon;
  c: string;
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
    tint: 'from-blue-500/10',
    border: 'border-blue-500/20',
    techs: ['Python', 'Java', 'C/C++', 'Node.js', 'Express', 'Spring', 'Rust'],
  },
  {
    g: 'Frontend',
    I: Monitor,
    c: '#34a853',
    tint: 'from-green-500/10',
    border: 'border-green-500/20',
    techs: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'React', 'Next.js'],
  },
  {
    g: 'Sistemas',
    I: Cpu,
    c: '#ff9500',
    tint: 'from-orange-500/10',
    border: 'border-orange-500/20',
    techs: ['Linux', 'Docker', 'Git', 'Bash', 'SSH', 'Make', 'CI/CD'],
  },
  {
    g: 'DB',
    I: Database,
    c: '#af52de',
    tint: 'from-purple-500/10',
    border: 'border-purple-500/20',
    techs: ['PostgreSQL', 'MySQL', 'SQLite', 'MongoDB', 'Redis', 'Prisma'],
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
  'Node.js': '#339933',
  'Express': '#404D59', 
  'MongoDB': '#47A248',
  'JWT': '#D62F9C',
  'Swing': '#5382a1',
  'ObjectDB': '#8B0000',
  'JAX-WS': '#007396',
  'React': '#61DAFB',
  'Next.js': '#000000',
  'HTML5': '#E34C26',
  'CSS3': '#1572B6',
  'Docker': '#2496ED',
  'Git': '#F05032',
  'PostgreSQL': '#4169E1',
  'MySQL': '#4479A1',
  'Redis': '#DC382D',
  'Prisma': '#2D3748',
  'Spring': '#6DB33F',
  'Linux': '#FCC624',
  'Bash': '#4EAA25',
  'CI/CD': '#0066cc'
};

/** Alias for backwards compat */
export const LANG_C = LANG_COLORS;
import { Server, Monitor, Cpu, Database } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Lang } from './types';

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
  Java: '#007396',
  'C++': '#D65000',
  C: '#aaa',
  Shell: '#5CAD34',
  HTML: '#E34C26',
  CSS: '#264de4',
  Dockerfile: '#2496ED',
  Ruby: '#CC342D',
  Go: '#00ADD8',
  Rust: '#DEA584',
  Makefile: '#427819',
};

/** Alias for backwards compat */
export const LANG_C = LANG_COLORS;

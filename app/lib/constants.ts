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
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Shell: '#89e051',
  HTML: '#E34C26',
  CSS: '#563d7c',
  Dockerfile: '#384d54',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#DEA584',
  Makefile: '#427819',
  'Node.js': '#339933',
  'Express': '#353535',
  'Spring': '#6DB33F',
  'React': '#61DAFB',
  'Next.js': '#000000',
  'HTML5': '#E34C26',
  'CSS3': '#1572B6',
  'Tailwind': '#06B6D4',
  'MongoDB': '#47A248',
  'PostgreSQL': '#4169E1',
  'MySQL': '#4479A1',
  'SQLite': '#003B57',
  'Redis': '#DC382D',
  'Prisma': '#2D3748',
  'JWT': '#FB015B',
  'Docker': '#2496ED',
  'Git': '#F05032',
  'Linux': '#FCC624',
  'Bash': '#4EAA25',
  'CI/CD': '#FF9500',
  'Antigravity': '#ff2d55',
  'GeminiChat': '#ff2d55',
  'Claude': '#ff2d55',
  'GPT-4': '#ff2d55',
  'LLMs': '#ff2d55',
  
  // Project specific tech stack brand colors
  Firebase: '#FFCA28',
  'Google Calendar API': '#4285F4',
  Vercel: '#000000',
  'REST API': '#0055ff',
  'GitHub Actions': '#2088FF',
  'JAX-WS': '#E65100',
  ObjectDB: '#4A148C',
  Swing: '#5382a1',
  'Java Swing': '#5382a1',
  SOAP: '#8E24AA',
  JUnit: '#25A162',
  SonarCloud: '#F3702A',
  'SonarCloud A': '#F3702A',
  NestJS: '#E0234E',
  A11y: '#1976D2',
  A11Y: '#1976D2',
  'Semantic HTML': '#E34C26',
  'Semantic UI': '#35BDB2',
  Jest: '#C21325',
  'Atomic Transactions': '#00C853',
  Bcrypt: '#37474F',
  'Focus Trap': '#E040FB',
  'WCAG-conscious': '#00E676',
  'Thread-Safe': '#4CAF50',
  'Cloud Native': '#0080FF',
  'Optimistic Locking': '#00E676',
  Cloud: '#0080FF'
};

/** Alias for backwards compat */
export const LANG_C = LANG_COLORS;
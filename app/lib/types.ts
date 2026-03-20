import type { LucideIcon } from 'lucide-react';

// Language types
export type Lang = 'es' | 'en' | 'eu' | 'fr' | 'it' | 'de' | 'pt' | 'ca' | 'gl' | 'ja';

// GitHub repository types
export interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  pushed_at: string;
  fork: boolean;
  size: number;
  stargazers_count: number;
  languages_url: string;
}

export interface RepoFull extends Repo {
  langs: string[];
}

// Value/Philosophy types
export interface Val {
  icon: LucideIcon;
  t: string;
  d: string;
}

// Translation types
export interface Tx {
  times: [string, string, string];
  iam: string;
  greetingFn: (timeGreeting: string) => string;
  role: string;
  tagline: string;
  status: string;
  ctaWork: string;
  ctaContact: string;
  ctaCv: string;
  scroll: string;
  menu: string[];
  hrefs: string[];
  abLb: string;
  abH: string;
  mf: string;
  metrics: [string, string][];
  skLb: string;
  skH: string;
  woLb: string;
  woH: string;
  ghLb: string;
  moreGh: string;
  loading: string;
  coLb: string;
  coH: string;
  coP: string;
  valLb: string;
  valH: string;
  vals: Val[];
  cmdPh: string;
  cmdLang: string;
  cmdNav: string;
  tabAway: string;
  tabBack: string;
  footerTech: string;
  footerSrc: string;
  printContact: string;
}

// Project card types
export interface ProjectCard {
  n: string;
  name: string;
  tag: string;
  year: string;
  size: string;
  desc: string;
  langs: string[];
}

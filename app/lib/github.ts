import { Repo, RepoFull, ProjectCard, Tx } from '../types';

const GITHUB_USER = 'eneekoruiz';
const PROJECT_IDS = [
  'ana-peluquera',
  'who-are-ya-backend',
  'rides24ofiziala',
  'spotshare-parking',
  'pke_web'
];

const customStacks: Record<string, string[]> = {
  'ana-peluquera': ['React', 'Firebase', 'Node.js', 'Google Calendar API'],
  'who-are-ya-backend': ['Node.js', 'Express', 'MongoDB', 'JWT'],
  'rides24ofiziala': ['Java', 'JAX-WS', 'ObjectDB', 'Swing'],
  'spotshare-parking': ['TypeScript', 'SonarCloud', 'NestJS', 'Docker'],
  'pke_web': ['React', 'WCAG 2.1', 'Tailwind', 'A11y'],
};

export async function getGitHubData(t: Tx) {
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_API_TOKEN;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://eneko-ruiz.vercel.app';
  
  // In a real Server Component, we can fetch from the external API directly to avoid internal network hop if preferred,
  // but since we have a hardened API route, we could also call it. 
  // However, fetching directly from GitHub on the server is more "Next.js 14" way.
  
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'Eneko-Portfolio-Server',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`, {
      headers,
      next: { revalidate: 3600 }
    });

    if (!res.ok) throw new Error('GitHub fetch failed');

    const allRepos: Repo[] = await res.json();
    
    const repos = allRepos
      .filter(r => !r.fork)
      .slice(0, 8)
      .map(r => ({
        ...r,
        langs: r.language ? [r.language] : []
      })) as RepoFull[];

    const top3 = PROJECT_IDS.map((id, index) => {
      const githubRepo = allRepos.find(r => r.name.toLowerCase() === id.toLowerCase());
      
      const getDesc = (id: string) => {
        if (id === 'ana-peluquera') return 'Plataforma de reservas con Algoritmo Sandwich y sincronización atómica.';
        if (id === 'who-are-ya-backend') return t?.projectWhoDesc || 'Backend escalable para juego de fútbol con arquitectura MVC.';
        if (id === 'rides24ofiziala') return t?.projectRidesDesc || 'Sistema distribuido de ride-sharing con transacciones seguras.';
        if (id === 'spotshare-parking') return 'Gestión Cloud de aparcamientos con enfoque en calidad SonarCloud.';
        if (id === 'pke_web') return 'Plataforma web semántica con cumplimiento estricto de accesibilidad WCAG.';
        return '';
      };

      return {
        n: `0${index + 1}`,
        name: id,
        tag: id === 'ana-peluquera' ? 'Lead Architect' : id === 'who-are-ya-backend' ? 'Backend / API' : 'System Engineer',
        year: githubRepo ? new Date(githubRepo.pushed_at).getFullYear().toString() : '2026',
        size: githubRepo ? (githubRepo.size > 1024 ? `${(githubRepo.size / 1024).toFixed(1)} MB` : `${githubRepo.size} KB`) : 'Premium',
        desc: getDesc(id),
        langs: customStacks[id] || (githubRepo?.language ? [githubRepo.language] : []),
        challenge: 'Análisis de arquitectura y optimización de flujo.',
        architecture: 'Eneko Ruiz',
        outcome: 'Successful Audit'
      };
    });

    return { repos, top3, load: false, offline: false, errorMsg: '' };
  } catch (e) {
    // Fallback if GitHub is down
    const top3Fallback = PROJECT_IDS.map((id, index) => ({
      n: `0${index + 1}`,
      name: id,
      tag: 'System Engineer',
      year: '2026',
      size: 'Premium',
      desc: '',
      langs: customStacks[id] || [],
      challenge: 'Análisis de arquitectura.',
      architecture: 'Eneko Ruiz',
      outcome: 'Offline Mode'
    }));

    return { repos: [], top3: top3Fallback, load: false, offline: true, errorMsg: 'GitHub Offline' };
  }
}

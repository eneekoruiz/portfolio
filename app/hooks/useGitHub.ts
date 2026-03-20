'use client';

import { useState, useEffect } from 'react';
import type { Repo, RepoFull, ProjectCard } from '../lib/types';

interface UseGitHubReturn {
  repos: RepoFull[];
  top3: ProjectCard[];
  load: boolean;
  offline: boolean;
}

const FALLBACK_TOP3: ProjectCard[] = [
  { n:'01', name:'Compilador PL/0', tag:'C',      year:'2024', size:'2.1 MB', desc:'Compilador completo para Pascal. Análisis léxico, sintáctico y semántico con generación de código intermedio.', langs:['C','Flex','Bison','Make'] },
  { n:'02', name:'GestDB',          tag:'Java',   year:'2024', size:'1.8 MB', desc:'Sistema de gestión hospitalaria con modelo relacional 3FN. Triggers y procedimientos almacenados.',            langs:['Java','PostgreSQL','JDBC','SQL'] },
  { n:'03', name:'NetSim',          tag:'Python', year:'2023', size:'1.4 MB', desc:'Simulador TCP/IP con control de flujo, detección de errores y ventana deslizante.',                             langs:['Python','Sockets','Threading','Shell'] },
];

export function useGitHub(): UseGitHubReturn {
  const [repos,   setRepos]   = useState<RepoFull[]>([]);
  const [top3,    setTop3]    = useState<ProjectCard[]>([]);
  const [load,    setLoad]    = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    // Detect network before fetching
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    if (!isOnline) {
      setTop3(FALLBACK_TOP3);
      setOffline(true);
      setLoad(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s network timeout

    fetch('https://api.github.com/users/eneekoruiz/repos?per_page=100&sort=updated', {
      signal: controller.signal,
    })
      .then(r => {
        if (!r.ok) throw new Error(`GitHub API ${r.status}`);
        return r.json() as Promise<Repo[]>;
      })
      .then(async data => {
        clearTimeout(timeout);
        const all = data.filter(r => !r.fork).sort((a, b) => b.size - a.size);

        // Top 8 for activity feed
        const top8 = all.slice(0, 8);
        const full: RepoFull[] = await Promise.all(
          top8.map(async r => {
            try {
              const res = await fetch(r.languages_url, { signal: controller.signal });
              const obj: Record<string, number> = await res.json();
              return { ...r, langs: Object.keys(obj).slice(0, 7) };
            } catch {
              return { ...r, langs: [r.language].filter(Boolean) as string[] };
            }
          })
        );
        setRepos(full);

        // Top 3 for Selected Works
        const top3repos = all.slice(0, 3);
        const top3full = await Promise.all(
          top3repos.map(async (r, i) => {
            let langs = [r.language].filter(Boolean) as string[];
            try {
              const res = await fetch(r.languages_url, { signal: controller.signal });
              const obj: Record<string, number> = await res.json();
              langs = Object.keys(obj).slice(0, 7);
            } catch { /* fallback */ }
            return {
              n: `0${i + 1}`,
              name: r.name,
              tag: r.language ?? 'Code',
              year: new Date(r.pushed_at).getFullYear().toString(),
              size: r.size > 1024 ? `${(r.size / 1024).toFixed(1)} MB` : `${r.size} KB`,
              desc: r.description ?? 'Ver en GitHub para más detalles.',
              langs,
            };
          })
        );
        setTop3(top3full);
        setLoad(false);
        setOffline(false);
      })
      .catch(err => {
        clearTimeout(timeout);
        // AbortError = timeout, TypeError = no network
        const isNetworkErr = err.name === 'AbortError' || err instanceof TypeError;
        setOffline(isNetworkErr);
        setTop3(FALLBACK_TOP3);
        setLoad(false);
      });

    // Also listen for browser online/offline events
    const goOffline = () => setOffline(true);
    const goOnline  = () => setOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);

    return () => {
      controller.abort();
      clearTimeout(timeout);
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  return { repos, top3, load, offline };
}

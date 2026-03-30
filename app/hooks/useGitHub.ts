'use client';

import { useState, useEffect } from 'react';
import type { Repo, RepoFull, ProjectCard, Tx } from '../lib/types';

export function useGitHub(t: Tx) {
  const [repos, setRepos] = useState<RepoFull[]>([]);
  const [top3, setTop3] = useState<ProjectCard[]>([]);
  const [load, setLoad] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    // 1. Identificadores únicos de los 5 proyectos (deben coincidir con projects-data.ts)
    const PROJECT_IDS = [
      'ana-peluquera',
      'who-are-ya-backend',
      'rides24ofiziala',
      'spotshare-parking',
      'pke_web'
    ];

    // 2. Configuración de Stacks personalizada
    const customStacks: Record<string, string[]> = {
      'ana-peluquera': ['React', 'Firebase', 'Node.js', 'Google Calendar API'],
      'who-are-ya-backend': ['Node.js', 'Express', 'MongoDB', 'JWT'],
      'rides24ofiziala': ['Java', 'JAX-WS', 'ObjectDB', 'Swing'],
      'spotshare-parking': ['TypeScript', 'SonarCloud', 'NestJS', 'Docker'],
      'pke_web': ['React', 'WCAG 2.1', 'Tailwind', 'A11y'],
    };

    // 3. Descripciones (usando traducciones si existen)
    const getDesc = (id: string) => {
      if (id === 'ana-peluquera') return 'Plataforma de reservas con Algoritmo Sandwich y sincronización atómica.';
      if (id === 'who-are-ya-backend') return t?.projectWhoDesc || 'Backend escalable para juego de fútbol con arquitectura MVC.';
      if (id === 'rides24ofiziala') return t?.projectRidesDesc || 'Sistema distribuido de ride-sharing con transacciones seguras.';
      if (id === 'spotshare-parking') return 'Gestión Cloud de aparcamientos con enfoque en calidad SonarCloud.';
      if (id === 'pke_web') return 'Plataforma web semántica con cumplimiento estricto de accesibilidad WCAG.';
      return '';
    };

    // 4. Datos de respaldo (Fallback) por si falla GitHub
    const staticFallback: ProjectCard[] = PROJECT_IDS.map((id, i) => ({
      n: `0${i + 1}`,
      name: id,
      tag: id === 'ana-peluquera' ? 'Full-Stack' : id === 'who-are-ya-backend' ? 'Backend' : 'Engineering',
      year: '2026',
      size: '---',
      desc: getDesc(id),
      langs: customStacks[id] || [],
      challenge: 'Optimización de arquitectura.',
      architecture: 'Lead Architect',
      outcome: 'Producción'
    }));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const fetchData = async () => {
      try {
        const headers: HeadersInit = { 'Accept': 'application/vnd.github.v3+json' };
        if (process.env.NEXT_PUBLIC_GITHUB_TOKEN) {
          headers.Authorization = `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`;
        }

        const res = await fetch('https://api.github.com/users/eneekoruiz/repos?per_page=100&sort=updated', { 
          signal: controller.signal, 
          headers 
        });

        if (!res.ok) throw new Error("GitHub API Error");
        const allRepos: Repo[] = await res.json();

        // Filtrar repositorios para la actividad general (los 8 más recientes)
        const recent = allRepos
          .filter(r => !r.fork)
          .slice(0, 8)
          .map(r => ({ ...r, langs: [r.language].filter(Boolean) as string[] }));
        setRepos(recent as RepoFull[]);

        // 🚀 PROCESAR LOS 5 DESTACADOS
        const mappedProjects = PROJECT_IDS.map((id, index) => {
          // Buscamos si el repo existe en el perfil de GitHub
          const githubRepo = allRepos.find(r => r.name.toLowerCase() === id.toLowerCase());

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

        setTop3(mappedProjects);

      } catch (err) {
        console.warn("GitHub offline o error, cargando fallback de 5 proyectos.");
        setTop3(staticFallback);
        setOffline(true);
      } finally {
        clearTimeout(timeoutId);
        setLoad(false);
      }
    };

    fetchData();
    return () => { controller.abort(); clearTimeout(timeoutId); };
  }, [t]);

  return { repos, top3, load, offline };
}
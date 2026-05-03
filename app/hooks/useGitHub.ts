'use client';

import { useState, useEffect } from 'react';
import type { Repo, RepoFull, ProjectCard, Tx } from '../lib/types';

export function useGitHub(t: Tx) {
  const [repos, setRepos] = useState<RepoFull[]>([]);
  const [top3, setTop3] = useState<ProjectCard[]>([]);
  const [allRepos, setAllRepos] = useState<Repo[]>([]);
  const [load, setLoad] = useState(true);
  const [offline, setOffline] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  const getDesc = (id: string) => {
    if (id === 'ana-peluquera') return 'Plataforma de reservas con Algoritmo Sandwich y sincronización atómica.';
    if (id === 'who-are-ya-backend') return t?.projectWhoDesc || 'Backend escalable para juego de fútbol con arquitectura MVC.';
    if (id === 'rides24ofiziala') return t?.projectRidesDesc || 'Sistema distribuido de ride-sharing con transacciones seguras.';
    if (id === 'spotshare-parking') return 'Gestión Cloud de aparcamientos con enfoque en calidad SonarCloud.';
    if (id === 'pke_web') return 'Plataforma web semántica con cumplimiento estricto de accesibilidad WCAG.';
    return '';
  };

  const buildProjectCards = (reposData: Repo[]) => {
    return PROJECT_IDS.map((id, index) => {
      const githubRepo = reposData.find(r => r.name.toLowerCase() === id.toLowerCase());

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
  };

  useEffect(() => {
    let idleHandle: number | null = null;
    let timeoutHandle: NodeJS.Timeout | null = null;
    const win = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    const scheduleFetch = (fn: () => void) => {
      if (win.requestIdleCallback) {
        idleHandle = win.requestIdleCallback(() => fn(), { timeout: 1200 });
      } else {
        timeoutHandle = globalThis.setTimeout(fn, 650);
      }
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const fetchData = async () => {
      try {
        const res = await fetch('/api/github/repos?per_page=100&sort=updated', {
          signal: controller.signal,
          headers: {
            Accept: 'application/json',
          },
        });

        if (!res.ok) {
          // Parsear el error técnico real desde la API route
          let errText = `${res.status}: ${res.statusText}`;
          try {
            const errBody = await res.json();
            if (errBody?.error) errText = errBody.error;
          } catch (_) {}
          throw new Error(errText);
        }

        const payload: Repo[] = await res.json();
        setAllRepos(payload);
        setErrorMsg('');

      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error de red desconocido';
        if (process.env.NODE_ENV === 'development') {
          console.warn('GitHub API error:', message);
        }
        setAllRepos([]);
        setOffline(true);
        setErrorMsg(message);
      } finally {
        clearTimeout(timeoutId);
        setLoad(false);
      }
    };

    scheduleFetch(fetchData);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
      if (idleHandle !== null && win.cancelIdleCallback) {
        win.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle !== null) {
        clearTimeout(timeoutHandle);
      }
    };
  }, []);

  /**
   * Derive top3 (portfolio projects) and repos (GitHub activity) from API data.
   *
   * KEY DESIGN DECISION (Fase 1, Punto 3):
   * - top3 is ALWAYS built — they use static author data (stacks, descriptions)
   *   and are only enriched with metadata (date, size) when the API succeeds.
   * - repos (GitHub Activity section) is only populated when the API succeeds.
   * - When offline/error: repos stays empty, the error UI takes over.
   *   No "local copy" fallback that would mask the real error.
   */
  useEffect(() => {
    if (load) return;

    // Always build portfolio project cards (they don't depend on the API).
    // If we have API data, enrich them with metadata; otherwise, use defaults.
    setTop3(buildProjectCards(allRepos));

    if (allRepos.length > 0) {
      const recent = allRepos
        .filter(r => !r.fork)
        .slice(0, 8)
        .map(r => ({ ...r, langs: [r.language].filter(Boolean) as string[] }));

      setRepos(recent as RepoFull[]);
      setOffline(false);
      setErrorMsg('');
    } else {
      // API failed or returned empty — repos section stays empty.
      // The error UI in Projects.tsx will show the technical error + CTA.
      setRepos([]);
    }
  }, [allRepos, load, t]);

  return { repos, top3, load, offline, errorMsg };
}
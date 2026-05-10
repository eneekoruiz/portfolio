'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CURRICULUM PAGE — Embedded CV from Vercel
 * ─────────────────────────────────────────────────────────────────────────────
 * Displays Eneko's curriculum in a full-screen responsive iframe
 * with smooth transitions and liquid curtain effects for navigation
 */

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ChevronLeft, ExternalLink, Download } from 'lucide-react';
import { useTranslations } from '../hooks/useTranslations';

export default function CurriculumPage() {
  const { t } = useTranslations();
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // ── THEME SYNC ──────────────────────────────────────────────────────
  useEffect(() => {
    const targetTheme = theme === 'system' ? resolvedTheme : theme;
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'set-theme',
        theme: targetTheme
      }, '*');
    }
  }, [theme, resolvedTheme, loading]); // Also trigger when loading ends

  // Send theme again shortly after load to ensure iframe receives it
  useEffect(() => {
    if (!loading && iframeRef.current?.contentWindow) {
      const targetTheme = theme === 'system' ? resolvedTheme : theme;
      // Small delay to let iframe's own scripts initialize
      const timer = setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage({
          type: 'set-theme',
          theme: targetTheme
        }, '*');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [loading, theme, resolvedTheme]);

  useEffect(() => {
    document.title = 'Currículum | Eneko Ruiz';
    return () => {
      document.title = 'Eneko Ruiz — Portfolio'; // Fallback on unmount
    };
  }, []);

  useEffect(() => {
    // Safety timeout: if after 8s it hasn't loaded, show the fallback
    const timer = setTimeout(() => {
      if (loading) {
        setHasError(true);
        setShowFallback(true);
        setLoading(false);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [loading]);

  // ── ENTRANCE ANIMATION ──────────────────────────────────────────────
  useGSAP(() => {
    if (!containerRef.current || !headerRef.current) return;

    const tl = gsap.timeline();
    
    tl
      .from(headerRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.6,
        ease: 'power3.out',
      }, 0)
      .from('.curriculum-content', {
        opacity: 0,
        scale: 0.98,
        duration: 0.8,
        ease: 'power3.out',
      }, 0.2);
  }, { scope: containerRef });

  // ── CINEMATIC REVEAL ──
  useGSAP(() => {
    if (!loading && iframeRef.current) {
      gsap.fromTo(iframeRef.current, 
        { 
          opacity: 0, 
          y: 30, 
          scale: 0.98,
          filter: 'blur(10px)' 
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.2, 
          ease: 'expo.out',
          delay: 0.1
        }
      );
    }
  }, [loading]);

  const handleReturn = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: 'expo.in',
      onComplete: () => router.back(),
    });
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-screen bg-page flex flex-col overflow-hidden z-[999]"
    >
      {/* ── HEADER ── */}
      <header
        ref={headerRef}
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-page/90 backdrop-blur-2xl border-b border-black/5 dark:border-white/10"
      >
        <button
          onClick={handleReturn}
          className="group flex items-center gap-2 font-bold text-[11px] uppercase tracking-[0.2em] text-lead hover:text-ink transition-colors"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>{t.back}</span>
        </button>

        <h1 className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-40 text-ink hidden md:block">
          {t.ctaCv.toUpperCase()} {/* ENEKO RUIZ */}
        </h1>

        <div className="flex items-center gap-2">
          <a
            href="https://eneko-ruiz-curriculum.vercel.app/api/pdf"
            download="Eneko_Ruiz_CV.pdf"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand text-white text-[11px] font-bold uppercase tracking-[0.15em] hover:scale-105 transition-all shadow-lg"
          >
            <Download size={14} />
            <span className="hidden sm:inline">{t.ctaCv}</span>
          </a>
          <a
            href="https://eneko-ruiz-curriculum.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-page text-[11px] font-bold uppercase tracking-[0.15em] hover:scale-105 transition-all shadow-lg"
          >
            <ExternalLink size={14} />
            <span className="hidden sm:inline">{t.openDirect}</span>
          </a>
        </div>
      </header>

      {/* ── CONTENT AREA ── */}
      <main className="flex-1 relative bg-page overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-10 bg-page flex items-center justify-center p-8">
            <div className="w-full max-w-5xl h-full flex gap-8 animate-pulse">
              {/* Sidebar Skeleton */}
              <div className="hidden lg:flex flex-col gap-6 w-72">
                <div className="w-32 h-32 rounded-2xl bg-ink/5" />
                <div className="w-full h-40 rounded-2xl bg-ink/5" />
                <div className="w-full h-64 rounded-2xl bg-ink/5" />
              </div>
              {/* Main Content Skeleton */}
              <div className="flex-1 flex flex-col gap-8">
                <div className="w-3/4 h-12 rounded-xl bg-ink/5" />
                <div className="w-full h-24 rounded-xl bg-ink/5" />
                <div className="space-y-4">
                  <div className="w-full h-48 rounded-2xl bg-ink/5" />
                  <div className="w-full h-48 rounded-2xl bg-ink/5" />
                  <div className="w-full h-48 rounded-2xl bg-ink/5" />
                </div>
              </div>
            </div>
            {/* Minimal Spinner Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-6 h-6 border-2 border-ink/20 border-t-ink rounded-full animate-spin" />
            </div>
          </div>
        )}

        {/* El Iframe */}
        <iframe
          ref={iframeRef}
          src="https://eneko-ruiz-curriculum.vercel.app"
          title="Eneko Ruiz Curriculum"
          className={`w-full h-full border-none transition-all duration-1000 ${loading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
          allow="web-share; clipboard-write; print"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          onLoad={() => {
            setLoading(false);
            setHasError(false);
            setShowFallback(false);
          }}
          onError={() => {
            setLoading(false);
            setHasError(true);
            setShowFallback(true);
          }}
        />
        
        {/* FALLBACK: Si no carga por seguridad (X-Frame-Options) */}
        {showFallback && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-page z-10 animate-in fade-in duration-700">
            <div className="w-20 h-20 mb-8 rounded-full bg-brand/10 flex items-center justify-center text-brand">
              <ExternalLink size={32} />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-4 text-ink">
              {t.back === 'Volver' ? 'Contenido Protegido' : 'Protected Content'}
            </h2>
            <p className="max-w-md text-lead text-sm leading-relaxed mb-8">
              {t.back === 'Volver' 
                ? 'Por motivos de seguridad (X-Frame-Options), algunos navegadores bloquean la visualización incrustada. Pulsa el botón de arriba para ver el currículum a pantalla completa.'
                : 'For security reasons (X-Frame-Options), some browsers block embedded viewing. Click the button above to view the resume in full screen.'}
            </p>
            <div className="pointer-events-auto">
              <a
                href="https://eneko-ruiz-curriculum.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-brand text-white font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_20px_40px_rgba(0,102,255,0.2)]"
              >
                {t.openDirect}
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Mobile-friendly back button for easier navigation */}
      <div className="sm:hidden fixed bottom-6 left-6 z-40">
        <button
          onClick={handleReturn}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-brand text-white shadow-lg active:scale-95 transition-transform"
          aria-label="Go back"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      <style>{`
        @keyframes delayed-fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          80% { opacity: 0; }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-delayed-fade-in {
          animation: delayed-fade-in 4s forwards;
        }
      `}</style>
    </div>
  );
}

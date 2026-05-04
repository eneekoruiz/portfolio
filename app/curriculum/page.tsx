'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CURRICULUM PAGE — Embedded CV from Vercel
 * ─────────────────────────────────────────────────────────────────────────────
 * Displays Eneko's curriculum in a full-screen responsive iframe
 * with smooth transitions and liquid curtain effects for navigation
 */

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ChevronLeft, ExternalLink } from 'lucide-react';

export default function CurriculumPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

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

  const handleReturn = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
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
          <span>Volver</span>
        </button>

        <h1 className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-40 text-ink hidden md:block">
          RESUME // ENEKO RUIZ
        </h1>

        <a
          href="https://eneko-ruiz-curriculum.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-page text-[11px] font-bold uppercase tracking-[0.15em] hover:scale-105 transition-all shadow-lg"
        >
          <ExternalLink size={14} />
          <span>Abrir Directo</span>
        </a>
      </header>

      {/* ── CONTENT AREA ── */}
      <main className="flex-1 curriculum-content relative bg-white dark:bg-[#050505]">
        
        {/* Loader Animado */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-page">
            <div className="w-12 h-12 border-2 border-brand/20 border-t-brand rounded-full animate-spin mb-4" />
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40 animate-pulse">Sincronizando CV...</p>
          </div>
        )}

        {/* El Iframe */}
        <iframe
          ref={iframeRef}
          src="https://eneko-ruiz-curriculum.vercel.app"
          title="Eneko Ruiz Curriculum"
          className={`w-full h-full border-none transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => {
            setLoading(false);
          }}
          onError={() => setHasError(true)}
        />
        
        {/* FALLBACK: Si no carga por seguridad (X-Frame-Options) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-page z-10 pointer-events-none opacity-0 animate-delayed-fade-in">
          <div className="w-20 h-20 mb-8 rounded-full bg-brand/10 flex items-center justify-center text-brand">
            <ExternalLink size={32} />
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-4 text-ink">
            Contenido Protegido
          </h2>
          <p className="max-w-md text-lead text-sm leading-relaxed mb-8">
            Por motivos de seguridad (X-Frame-Options), algunos navegadores bloquean la visualización incrustada. Pulsa el botón de arriba para ver el currículum a pantalla completa.
          </p>
          <div className="pointer-events-auto">
            <a
              href="https://eneko-ruiz-curriculum.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full bg-brand text-white font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_20px_40px_rgba(0,102,255,0.2)]"
            >
              Ver Currículum Original
            </a>
          </div>
        </div>
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

      <style jsx>{`
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

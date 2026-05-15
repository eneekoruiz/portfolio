'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState, KeyboardEvent as RKE } from 'react';
import { Search, Check } from 'lucide-react';
import { LANG_LABELS } from '../../lib/constants';
import type { Lang, Tx } from '../../types';

export function CmdModal({
  lang, setLang, onClose, t,
}: {
  lang: Lang; setLang: (l: Lang) => void; onClose: () => void; t: Tx;
}) {
  const [q,   setQ]   = useState('');
  const [sel, setSel] = useState(0);
  const inp = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const listRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Robust body scroll lock — no layout jump from scrollbar width
  useEffect(() => {
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    const prev = document.body.style.overflow;
    document.body.style.overflow  = 'hidden';
    document.body.style.paddingRight = `${scrollbarW}px`;
    // Freeze Lenis if available
    const lenis = window.__lenis;
    lenis?.stop?.();
    return () => {
      document.body.style.overflow  = prev || '';
      document.body.style.paddingRight = '';
      lenis?.start?.();
    };
  }, []);

  type Item = { id: string; label: string; group: string; action: () => void };

  const navItems = useMemo<Item[]>(() =>
    t.menu.map((label, i) => ({
      id: `n${i}`, label, group: t.cmdNav,
      action: () => {
        document.getElementById(t.hrefs[i].slice(1))?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    })), [t, onClose]);

  const langItems = useMemo<Item[]>(() =>
    (Object.entries(LANG_LABELS) as [Lang, string][]).map(([k, label]) => ({
      id: k, label: `${k.toUpperCase()} — ${label}`, group: t.cmdLang,
      action: () => { setLang(k); onClose(); },
    })), [t.cmdLang, setLang, onClose]);

  const flatAll = [...navItems, ...langItems];
  const flatFiltered = q
    ? flatAll.filter(i => i.label.toLowerCase().includes(q.toLowerCase()))
    : [];
  const activeList = q ? flatFiltered : flatAll;

  useLayoutEffect(() => {
    lastFocusRef.current = document.activeElement as HTMLElement | null;
    return () => { lastFocusRef.current?.focus?.(); };
  }, []);
  useEffect(() => { inp.current?.focus(); setSel(0); }, []);
  useEffect(() => setSel(0), [q]);
  useEffect(() => {
    const active = activeList[sel];
    if (!active) return;
    listRefs.current[active.id]?.scrollIntoView({ block: 'nearest' });
  }, [activeList, sel]);

  const onKey = (e: RKE) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'Tab') {
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;
      const items = Array.from(focusables);
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement as HTMLElement | null;
      if (e.shiftKey && current === first) {
        e.preventDefault();
        last.focus();
        return;
      }
      if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
      return;
    }
    const list = activeList;
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(s + 1, list.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSel(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && list[sel]) {
      e.preventDefault();
      list[sel].action();
    }
  };

  return (
    <div
      className="cmd-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Buscador"
    >
      <div
        ref={dialogRef}
        className="cmd-box flex flex-col"
        style={{ maxHeight: 'min(78vh, 560px)' }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        onKeyDown={onKey}
        tabIndex={-1}
      >
        {/* ── Input row ── */}
        <div className="flex items-center gap-3 px-5 border-b border-black/7 dark:border-white/10 shrink-0 bg-white/70 dark:bg-white/[0.02]">
          <Search size={16} className="text-lead shrink-0" />
          <input
            ref={inp}
            type="search"
            className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 font-sans text-[16px] text-ink py-[1.1rem] caret-brand"
            placeholder={t.cmdPh}
            value={q}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
            aria-label="Buscar"
          />
          <button 
            onClick={onClose}
            type="button"
            className="font-mono text-[10px] text-lead/50 hover:text-ink px-[7px] py-[2px] border border-black/10 dark:border-white/10 rounded-[5px] shrink-0 hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all"
            aria-label="Cerrar buscador"
          >
            ESC
          </button>
        </div>

        {/* ── Results ── */}
        <div className="overflow-y-auto overscroll-contain flex-1 pb-3">
          {!q && (
            <div className="px-5 pt-4 pb-2 flex items-center justify-between text-[11px] text-lead/70">
              <span>Usa ↑ ↓ y Enter para navegar</span>
              <span>{flatAll.length} opciones</span>
            </div>
          )}

          {/* Search mode */}
          {q && (
            <div className="p-2">
              {flatFiltered.length === 0 && (
                <div className="py-10 text-center text-[13px] text-lead">
                  <p className="mb-1 font-medium text-ink">Sin resultados</p>
                  <p className="text-lead/70">Prueba con otro texto o usa Esc para cerrar.</p>
                </div>
              )}
              {flatFiltered.map((item, idx) => {
                return (
                  <button
                    key={item.id}
                    type="button"
                    ref={el => { listRefs.current[item.id] = el; }}
                    className={`w-full flex items-center gap-[.7rem] px-5 py-[.55rem] rounded-[11px] mx-1 text-[13px] transition-colors duration-75 text-left focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none ${sel === idx ? 'bg-brand/7 text-brand' : 'text-lead hover:bg-brand/7 hover:text-brand'}`}
                    onClick={item.action}
                    onMouseEnter={() => setSel(idx)}
                  >
                    <span className="opacity-40 text-[12px]">›</span>
                    {item.label}
                    {item.id === lang && <Check size={12} className="ml-auto text-brand" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Browse mode */}
          {!q && (
            <>
              {/* Navigation */}
              <div className="px-2 pt-3">
                <p className="text-[9px] font-bold tracking-[.2em] uppercase text-lead/50 px-3 pb-1.5">{t.cmdNav}</p>
                {navItems.map(item => {
                  const idx = flatAll.indexOf(item);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      ref={el => { listRefs.current[item.id] = el; }}
                      className={`w-full flex items-center gap-[.7rem] px-3 py-[.52rem] rounded-[10px] text-[13px] transition-colors duration-75 text-left focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none ${sel === idx ? 'bg-brand/7 text-brand' : 'text-lead hover:bg-brand/7 hover:text-brand'}`}
                      onClick={item.action}
                      onMouseEnter={() => setSel(idx)}
                    >
                      <span className="opacity-40 text-[12px]">›</span>
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className="mx-4 my-2 h-px bg-black/6 dark:bg-white/8" />

              {/* Languages — 2-col grid, all visible at once */}
              <div className="px-2">
                <p className="text-[9px] font-bold tracking-[.2em] uppercase text-lead/50 px-3 pb-1.5">{t.cmdLang}</p>
                <div className="grid grid-cols-2 gap-1 px-1">
                  {langItems.map(item => {
                    const idx = flatAll.indexOf(item);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        ref={el => { listRefs.current[item.id] = el; }}
                        className={`flex items-center justify-between px-3 py-[.48rem] rounded-[9px] text-[12px] transition-colors duration-75 text-left focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none ${sel === idx ? 'bg-brand/7 text-brand' : 'text-lead hover:bg-brand/7 hover:text-brand'}`}
                        onClick={item.action}
                        onMouseEnter={() => setSel(idx)}
                      >
                        <span>{item.label}</span>
                        {item.id === lang && <Check size={11} className="text-brand shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  KeyboardEvent as RKE,
} from "react";
import { Search, Check } from "lucide-react";
import gsap from "gsap";
import { LANG_LABELS } from "../../lib/constants";
import type { Lang, Tx } from "../../types";
import { UI_COPY } from "../../data/interface-translations";
import { COMMAND_COPY } from "../../data/command-translations";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";
import { useFocusTrap } from "../../hooks/useFocusTrap";

export function CmdModal({
  lang,
  setLang,
  onClose,
  t,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  onClose: () => void;
  t: Tx;
}) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inp = useRef<HTMLInputElement>(null);
  const dialogRef = useFocusTrap(true);
  const listRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const motion = useMotionEnabled();
  const closing = useRef(false);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const closeRef = useRef(onClose);
  const motionRef = useRef(motion);
  const destination = useRef<HTMLElement | null>(null);
  const copy = COMMAND_COPY[lang];
  useBodyScrollLock(true);
  useLayoutEffect(() => {
    closeRef.current = onClose;
    motionRef.current = motion;
  }, [onClose, motion]);

  const handleClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    timeline.current?.kill();
    const overlay = dialogRef.current?.parentElement;
    const box = dialogRef.current;
    if (!motion || !overlay || !box) {
      closeRef.current();
      return;
    }
    timeline.current = gsap
      .timeline({ onComplete: () => closeRef.current() })
      .to(
        box,
        { scale: 0.95, y: 20, opacity: 0, duration: 0.2, ease: "power2.in" },
        0,
      )
      .to(overlay, { opacity: 0, duration: 0.2, ease: "power2.in" }, 0);
  }, [motion, dialogRef]);

  useLayoutEffect(() => {
    const overlay = dialogRef.current?.parentElement;
    const box = dialogRef.current;
    if (!overlay || !box) return;
    timeline.current?.kill();
    if (closing.current) {
      closeRef.current();
      return;
    }
    if (motion) {
      timeline.current = gsap
        .timeline()
        .fromTo(
          overlay,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.3,
            ease: "power3.out",
            clearProps: "opacity",
          },
          0,
        )
        .fromTo(
          box,
          { scale: 0.95, y: -20, opacity: 0 },
          {
            scale: 1,
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "expo.out",
            clearProps: "transform,opacity",
          },
          0,
        );
    } else {
      gsap.set([overlay, box], { clearProps: "transform,opacity" });
    }
    return () => {
      timeline.current?.kill();
    };
  }, [motion, dialogRef]);

  type Item = { id: string; label: string; group: string; action: () => void };

  const navItems = useMemo<Item[]>(
    () =>
      t.menu.map((label, i) => ({
        id: `n${i}`,
        label,
        group: t.cmdNav,
        action: () => {
          destination.current = document.getElementById(t.hrefs[i].slice(1));
          handleClose();
        },
      })),
    [t, handleClose],
  );

  const langItems = useMemo<Item[]>(
    () =>
      (Object.entries(LANG_LABELS) as [Lang, string][]).map(([k, label]) => ({
        id: k,
        label: `${k.toUpperCase()} — ${label}`,
        group: t.cmdLang,
        action: () => {
          setLang(k);
          handleClose();
        },
      })),
    [t.cmdLang, setLang, handleClose],
  );

  const flatAll = useMemo(
    () => [...navItems, ...langItems],
    [navItems, langItems],
  );
  const query = q
    .trim()
    .toLocaleLowerCase(lang)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const flatFiltered = useMemo(
    () =>
      query
        ? flatAll.filter((item) =>
            item.label
              .toLocaleLowerCase(lang)
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .includes(query),
          )
        : [],
    [flatAll, query, lang],
  );
  const activeList = query ? flatFiltered : flatAll;

  useLayoutEffect(() => {
    inp.current?.focus({ preventScroll: true });
    return () => {
      timeline.current?.kill();
      const target = destination.current;
      if (!target) return;
      requestAnimationFrame(() => {
        // A newly opened dialog owns focus if close and reopen happen in one frame.
        if (document.querySelector(".cmd-overlay")) return;
        if (target?.isConnected) {
          if (!target.hasAttribute("tabindex"))
            target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
          const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
          window.scrollTo({
            top: Math.max(
              0,
              target.getBoundingClientRect().top + window.scrollY - 90,
            ),
            behavior: motionRef.current && !reduce ? "smooth" : "instant",
          });
          history.replaceState(history.state, "", `#${target.id}`);
        }
      });
    };
  }, [dialogRef]);
  useEffect(() => {
    const active = activeList[sel];
    if (!active) return;
    listRefs.current[active.id]?.scrollIntoView({ block: "nearest" });
  }, [activeList, sel]);

  const onKey = (e: RKE) => {
    if (e.key === "Escape") {
      handleClose();
      return;
    }
    if (e.target !== inp.current) return;
    const list = activeList;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.max(0, Math.min(s + 1, list.length - 1)));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    }
    if (e.key === "Enter" && list[sel]) {
      e.preventDefault();
      list[sel].action();
    }
  };

  return (
    <div
      className="cmd-overlay"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={UI_COPY[lang].search}
      style={{ animation: "none" }}
    >
      <div
        ref={dialogRef}
        className="cmd-box flex flex-col"
        style={{
          maxHeight: "min(78dvh, 560px)",
          animation: "none",
        }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        onKeyDown={onKey}
        tabIndex={-1}
      >
        {/* ── Input row ── */}
        <div className="flex items-center gap-3 px-5 border-b border-black/7 dark:border-white/10 shrink-0 bg-white/70 dark:bg-white/[0.02]">
          <Search aria-hidden="true" size={16} className="text-lead shrink-0" />
          <input
            ref={inp}
            type="search"
            className="min-w-0 flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 font-sans text-[16px] text-ink py-[1.1rem] caret-brand"
            placeholder={t.cmdPh}
            value={q}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setQ(e.target.value);
              setSel(0);
            }}
            aria-describedby="cmd-selection"
            aria-label={UI_COPY[lang].search}
          />
          <button
            onClick={handleClose}
            type="button"
            className="min-h-11 min-w-11 md:min-h-0 md:min-w-0 font-mono text-[10px] text-lead/50 hover:text-ink px-[7px] py-[2px] border border-black/10 dark:border-white/10 rounded-[5px] shrink-0 hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all"
            aria-label={UI_COPY[lang].close}
          >
            ESC
          </button>
        </div>

        {/* ── Results ── */}
        <div className="overflow-y-auto overscroll-contain flex-1 pb-3">
          {!query && (
            <div className="px-5 pt-4 pb-2 flex items-center justify-between text-[11px] text-lead/70">
              <span className="hidden md:inline">
                Usa ↑ ↓ y Enter para navegar
              </span>
              <span className="md:hidden">Selecciona una opción</span>
              <span>
                {flatAll.length} {copy.options}
              </span>
            </div>
          )}

          {/* Search mode */}
          {query && (
            <div className="p-2">
              {flatFiltered.length === 0 && (
                <div className="py-10 text-center text-[13px] text-lead">
                  <p className="mb-1 font-medium text-ink">{copy.noResults}</p>
                  <p className="text-lead/70">{copy.retry}</p>
                </div>
              )}
              {flatFiltered.map((item, idx) => {
                return (
                  <button
                    key={item.id}
                    type="button"
                    ref={(el) => {
                      listRefs.current[item.id] = el;
                    }}
                    className={`min-h-11 md:min-h-0 w-full flex items-center gap-[.7rem] px-5 py-[.55rem] rounded-[11px] text-[13px] transition-colors duration-75 text-start focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none ${sel === idx ? "bg-brand/7 text-brand" : "text-lead hover:bg-brand/7 hover:text-brand"}`}
                    onClick={item.action}
                    onMouseEnter={() => setSel(idx)}
                  >
                    <span className="opacity-40 text-[12px]">›</span>
                    {item.label}
                    {item.id === lang && (
                      <Check
                        aria-hidden="true"
                        size={12}
                        className="ml-auto text-brand"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Browse mode */}
          {!query && (
            <>
              {/* Navigation */}
              <div className="px-2 pt-3">
                <p className="text-[9px] font-bold tracking-[.2em] uppercase text-lead/50 px-3 pb-1.5">
                  {t.cmdNav}
                </p>
                {navItems.map((item) => {
                  const idx = flatAll.indexOf(item);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      ref={(el) => {
                        listRefs.current[item.id] = el;
                      }}
                      className={`min-h-11 md:min-h-0 w-full flex items-center gap-[.7rem] px-3 py-[.52rem] rounded-[10px] text-[13px] transition-colors duration-75 text-start focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none ${sel === idx ? "bg-brand/7 text-brand" : "text-lead hover:bg-brand/7 hover:text-brand"}`}
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
                <p className="text-[9px] font-bold tracking-[.2em] uppercase text-lead/50 px-3 pb-1.5">
                  {t.cmdLang}
                </p>
                <div className="grid grid-cols-2 gap-1 px-1">
                  {langItems.map((item) => {
                    const idx = flatAll.indexOf(item);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        ref={(el) => {
                          listRefs.current[item.id] = el;
                        }}
                        className={`min-h-11 md:min-h-0 flex items-center justify-between px-3 py-[.48rem] rounded-[9px] text-[12px] transition-colors duration-75 text-start focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none ${sel === idx ? "bg-brand/7 text-brand" : "text-lead hover:bg-brand/7 hover:text-brand"}`}
                        onClick={item.action}
                        onMouseEnter={() => setSel(idx)}
                      >
                        <span>{item.label}</span>
                        {item.id === lang && (
                          <Check
                            aria-hidden="true"
                            size={11}
                            className="text-brand shrink-0"
                          />
                        )}
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

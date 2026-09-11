"use client";

import {
  useLayoutEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search } from "lucide-react";
import { LANG_LABELS } from "../../lib/constants";
import { UI_COPY } from "../../data/interface-translations";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";
import { useSpringHover } from "../../hooks/useSpringHover";
import type { Lang } from "../../types";

const normalize = (value: string) =>
  value.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase();

export function LangDD({
  lang,
  setLang,
}: {
  lang: Lang;
  setLang: (lang: Lang) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const motion = useMotionEnabled();
  const trigger = useSpringHover<HTMLButtonElement>(motion, 8);
  const id = useId();
  const ui = UI_COPY[lang];
  const displayNames = useMemo(
    () => new Intl.DisplayNames([lang], { type: "language" }),
    [lang],
  );
  const entries = (Object.entries(LANG_LABELS) as [Lang, string][]).filter(
    ([key, label]) =>
      normalize(`${key} ${label} ${displayNames.of(key)}`).includes(
        normalize(query.trim()),
      ),
  );
  const close = (restore = false) => {
    setOpen(false);
    if (restore) trigger.current?.focus({ preventScroll: true });
  };
  useLayoutEffect(() => {
    if (!open) return;
    const position = () => {
      if (!panel.current || !trigger.current) return;
      const rect = trigger.current.getBoundingClientRect();
      const viewport = window.visualViewport;
      const viewportWidth = viewport?.width ?? innerWidth;
      const viewportLeft = viewport?.offsetLeft ?? 0;
      const width =
        viewportWidth < 768
          ? viewportWidth - 24
          : Math.min(304, viewportWidth - 24);
      const edge =
        document.documentElement.dir === "rtl" ? rect.left : rect.right - width;
      const left =
        viewportWidth < 768
          ? viewportLeft + 12
          : Math.max(
              viewportLeft + 12,
              Math.min(viewportLeft + viewportWidth - width - 12, edge),
            );
      const header = ref.current?.closest("header")?.getBoundingClientRect();
      Object.assign(panel.current.style, {
        left: `${left}px`,
        top: `${(header?.bottom ?? rect.bottom) + 12}px`,
        width: `${width}px`,
      });
    };
    position();
    input.current?.focus({ preventScroll: true });
    const outside = (event: PointerEvent) => {
      if (
        !ref.current?.contains(event.target as Node) &&
        !panel.current?.contains(event.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", position);
    window.visualViewport?.addEventListener("resize", position);
    return () => {
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("resize", position);
      window.visualViewport?.removeEventListener("resize", position);
    };
  }, [open, trigger]);
  const keydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close(true);
      return;
    }
    const options = Array.from(
      panel.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ??
        [],
    );
    if (!options.length) return;
    const index = options.indexOf(document.activeElement as HTMLButtonElement);
    let next = index;
    if (event.key === "ArrowDown") next = (index + 1) % options.length;
    else if (event.key === "ArrowUp")
      next = (index - 1 + options.length) % options.length;
    else if (index >= 0 && event.key === "Home") next = 0;
    else if (index >= 0 && event.key === "End") next = options.length - 1;
    else return;
    event.preventDefault();
    options[next].focus({ preventScroll: true });
    options[next].scrollIntoView({ block: "nearest" });
  };
  return (
    <div
      ref={ref}
      className="relative"
      onKeyDown={keydown}
      onBlur={(event) => {
        if (
          !event.currentTarget.contains(event.relatedTarget) &&
          !panel.current?.contains(event.relatedTarget)
        )
          close();
      }}
    >
      <button
        ref={trigger}
        type="button"
        data-language-trigger
        onClick={() => {
          setQuery("");
          setOpen((value) => !value);
        }}
        aria-label={`${ui.language}: ${LANG_LABELS[lang]}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        className="flex min-h-9 items-center gap-1.5 rounded-xl border border-ink/10 bg-page/70 px-3 text-xs font-bold tracking-wide text-lead outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <span dir="ltr">{lang.toUpperCase()}</span>
        <ChevronDown
          size={11}
          className={
            motion ? "transition-transform duration-300 ease-spring" : ""
          }
          style={{ transform: open ? "rotate(180deg)" : undefined }}
          aria-hidden="true"
        />
      </button>
      {open &&
        createPortal(
          <div
            ref={panel}
            id={id}
            role="dialog"
            aria-label={ui.language}
            data-language-picker
            className={`language-panel z-[999] origin-top rounded-2xl border border-ink/15 bg-page p-2 text-ink shadow-2xl ${motion ? "animate-in fade-in zoom-in-95 duration-200" : ""}`}
          >
            <div className="mb-2 flex items-center gap-2 rounded-xl border border-ink/15 px-3">
              <Search
                size={14}
                className="shrink-0 text-lead"
                aria-hidden="true"
              />
              <input
                ref={input}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label={ui.searchLanguage}
                placeholder={ui.searchLanguage}
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none placeholder:text-lead"
              />
            </div>
            <div
              role="listbox"
              aria-label={ui.language}
              data-lenis-prevent
              className="flex max-h-[min(45dvh,22rem)] flex-col gap-0.5 overflow-y-auto overscroll-contain"
            >
              {entries.map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="option"
                  aria-selected={lang === key}
                  tabIndex={lang === key ? 0 : -1}
                  className={`flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 py-2 text-start text-sm outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand ${lang === key ? "bg-brand/10 font-bold text-brand" : "text-ink hover:bg-ink/5"}`}
                  onClick={() => {
                    setLang(key);
                    close(true);
                  }}
                >
                  <span>
                    <bdi lang={key}>{label}</bdi>
                    {displayNames.of(key) !== label && (
                      <span className="ms-2 text-[10px] font-normal text-lead">
                        {displayNames.of(key)}
                      </span>
                    )}
                  </span>
                  {lang === key && (
                    <Check size={14} className="shrink-0" aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
            {!entries.length && (
              <p role="status" className="px-3 py-5 text-sm text-lead">
                {ui.noLanguages}
              </p>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}

import type { Lang } from "../types";
import { LANG_LABELS } from "./constants";

const KEY = "portfolio_lang";
let current: Lang = "es";
let initialized = false;
const listeners = new Set<() => void>();

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && Object.hasOwn(LANG_LABELS, value);
}

function publish(lang: Lang) {
  current = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  for (const notify of listeners) notify();
}

export function setLocale(lang: Lang) {
  if (!isLang(lang)) return;
  initialized = true;
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    /* Session selection still works. */
  }
  publish(lang);
}

function storage(event: StorageEvent) {
  if (event.key === KEY)
    publish(isLang(event.newValue) ? event.newValue : "es");
}

export function subscribeLocale(notify: () => void) {
  listeners.add(notify);
  if (listeners.size === 1) window.addEventListener("storage", storage);
  if (!initialized) {
    initialized = true;
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {
      /* Storage may be unavailable. */
    }
    publish(isLang(saved) ? saved : "es");
  }
  return () => {
    listeners.delete(notify);
    if (!listeners.size) window.removeEventListener("storage", storage);
  };
}

export const getLocale = () => current;
export const getServerLocale = (): Lang => "es";

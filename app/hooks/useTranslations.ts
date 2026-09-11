"use client";

import { useSyncExternalStore } from "react";
import { TX } from "../data/translations";
import { UI_COPY } from "../data/interface-translations";
import {
  getLocale,
  getServerLocale,
  setLocale,
  subscribeLocale,
} from "../lib/locale";

export function useTranslations() {
  const lang = useSyncExternalStore(
    subscribeLocale,
    getLocale,
    getServerLocale,
  );
  return { lang, setLang: setLocale, t: TX[lang], ui: UI_COPY[lang] };
}

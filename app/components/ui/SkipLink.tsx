"use client";

import React from "react";
import { useTranslations } from "../../hooks/useTranslations";

const SKIP_TEXT: Record<string, string> = {
  es: "Saltar al contenido principal",
  en: "Skip to main content",
  eu: "Eduki nagusira salto egin",
  fr: "Passer au contenu principal",
  it: "Passa al contenuto principale",
  de: "Zum Hauptinhalt springen",
  pt: "Saltar para o conteúdo principal",
  ca: "Saltar al contingut principal",
  gl: "Saltar ao contido principal",
  ja: "メインコンテンツへスキップ",
  zh: "跳过至主要内容",
  ar: "الانتقال إلى المحتوى الرئيسي",
};

export function SkipLink() {
  const { lang } = useTranslations();
  const text = SKIP_TEXT[lang] || SKIP_TEXT.en;

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand focus:text-white focus:rounded-lg focus:shadow-xl focus:outline-none transition-all"
    >
      {text}
    </a>
  );
}

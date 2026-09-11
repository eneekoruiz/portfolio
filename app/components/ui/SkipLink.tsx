"use client";

import React from "react";
import { useTranslations } from "../../hooks/useTranslations";

export function SkipLink() {
  const { ui } = useTranslations();
  const text = ui.skip;

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand focus:text-white focus:rounded-lg focus:shadow-xl focus:outline-none transition-all"
    >
      {text}
    </a>
  );
}

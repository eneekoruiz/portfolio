'use client';

import { useState, useMemo, useEffect } from 'react';
import { TX } from '../data/translations';
import type { Lang } from '../types';

const STORAGE_KEY = 'portfolio_lang';

export function useTranslations() {
  const [lang, setLangState] = useState<Lang>('es');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang;
    if (saved && TX[saved]) setLangState(saved);
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  };

  const t = useMemo(() => TX[lang], [lang]);

  return { lang, setLang, t };
}

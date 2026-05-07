'use client';

import { useState, useMemo } from 'react';
import { TX } from '../data/translations';
import type { Lang } from '../types';

export function useTranslations() {
  const [lang, setLang] = useState<Lang>('es');
  const t = useMemo(() => TX[lang], [lang]);

  return { lang, setLang, t };
}

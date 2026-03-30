'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Cambiar tema"
      data-h
      className="flex items-center justify-center w-9 h-9 rounded-full bg-transparent hover:bg-black/5 dark:hover:bg-white/10 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black"
    >
      {theme === 'dark'
        ? <Sun  size={15} className="text-lead" />
        : <Moon size={15} className="text-lead" />
      }
    </button>
  );
}

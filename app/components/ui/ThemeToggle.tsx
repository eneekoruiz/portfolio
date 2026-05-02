'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => setMounted(true), []);

  const handleToggle = () => {
    setIsAnimating(true);
    setTheme(theme === 'dark' ? 'light' : 'dark');
    setTimeout(() => setIsAnimating(false), 450);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={handleToggle}
      aria-label="Cambiar tema"
      data-h
      className="relative flex items-center justify-center w-9 h-9 rounded-full bg-transparent hover:bg-black/5 dark:hover:bg-white/10 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black overflow-hidden"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 rounded-full transition-all duration-450 ${
          isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(96,165,250,.22) 0%, rgba(96,165,250,0) 72%)',
        }}
      />
      <div className="relative w-4 h-4">
        <Sun 
          size={15} 
          className={`absolute inset-0 transition-[opacity,transform] duration-300 drop-shadow-[0_0_10px_rgba(245,158,11,.22)] ${
            isDark
              ? 'opacity-0 rotate-90 scale-90'
              : 'opacity-100 rotate-0 scale-100'
          }`}
          style={{
            color: '#f59e0b',
            transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        />
        <Moon 
          size={15} 
          className={`absolute inset-0 transition-[opacity,transform] duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,.18)] ${
            isDark
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-90'
          }`}
          style={{
            color: '#ffffff',
            transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        />
      </div>
    </button>
  );
}

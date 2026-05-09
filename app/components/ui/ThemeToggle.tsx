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
    if (isAnimating) return;
    setIsAnimating(true);
    setTheme(theme === 'dark' ? 'light' : 'dark');
    setTimeout(() => setIsAnimating(false), 500);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={handleToggle}
      aria-label="Cambiar tema"
      data-h
      className="group relative flex items-center justify-center w-9 h-9 rounded-xl bg-white/60 dark:bg-white/[0.06] border border-black/5 dark:border-white/10 backdrop-blur-xl transition-all duration-300 hover:scale-110 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-brand overflow-hidden"
    >
      {/* ── Background Glow Pulse ── */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 rounded-full transition-all duration-700 ${
          isAnimating ? 'opacity-100 scale-150' : 'opacity-0 scale-50'
        }`}
        style={{
          background: isDark 
            ? 'radial-gradient(circle, rgba(56,189,248,0.2) 0%, transparent 70%)' 
            : 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)',
        }}
      />

      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun Icon */}
        <Sun 
          size={16} 
          strokeWidth={2.5}
          className={`absolute transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            isDark
              ? 'opacity-0 -translate-y-8 rotate-45 scale-50'
              : 'opacity-100 translate-y-0 rotate-0 scale-100 text-amber-500'
          }`}
          style={{
            filter: !isDark ? 'drop-shadow(0 0 8px rgba(245,158,11,0.6))' : 'none',
          }}
        />

        {/* Moon Icon */}
        <Moon 
          size={15} 
          strokeWidth={2.5}
          className={`absolute transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            isDark
              ? 'opacity-100 translate-y-0 rotate-0 scale-100 text-blue-400'
              : 'opacity-0 translate-y-8 -rotate-45 scale-50'
          }`}
          style={{
            filter: isDark ? 'drop-shadow(0 0 8px rgba(56,189,248,0.5))' : 'none',
          }}
        />

        {/* Decorative Rays for Sun (only visible in light mode) */}
        <div 
          className={`absolute inset-0 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-20 group-hover:opacity-40 animate-spin-slow'}`}
          aria-hidden="true"
        >
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="absolute top-1/2 left-1/2 w-0.5 h-6 bg-amber-400 -translate-x-1/2 -translate-y-1/2" 
              style={{ transform: `translate(-50%, -50%) rotate(${i * 60}deg)` }}
            />
          ))}
        </div>
      </div>
    </button>
  );
}

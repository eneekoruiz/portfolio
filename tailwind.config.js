/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      colors: {
        page:  'var(--page)',
        ink:   'var(--ink)',
        lead:  'var(--lead)',
        brand: 'var(--brand)',
      },
      boxShadow: {
        rest:  '0 1px 2px rgba(0,0,0,.04), 0 4px 16px rgba(0,0,0,.03)',
        float: '0 20px 60px -12px rgba(0,0,0,.14)',
        glass: '0 8px 32px rgba(0,0,0,.08), inset 0 1px 0 rgba(255,255,255,.9)',
        'glass-dark': '0 8px 32px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.06)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34,1.56,0.64,1)',
        expo:   'cubic-bezier(0.16,1,0.3,1)',
        flow:   'cubic-bezier(0.4,0,0.2,1)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        'slow-bounce': 'float 3s ease-in-out infinite',
      },
      colors: {
        canvas: 'var(--canvas)',
        'surface-card': 'var(--card-surface)',
        'ink-primary': 'var(--ink-primary)',
        'ink-muted': 'var(--ink-muted)',
        'ink-dark': '#1C1024',
        'accent-dare': 'var(--accent-dare)',
        'accent-wrong-stroke': 'var(--accent-wrong-stroke)',
        'accent-wrong-fill': 'var(--accent-wrong-fill)',
        'accent-consensus-stroke': 'var(--accent-consensus-stroke)',
        'accent-consensus-fill': 'var(--accent-consensus-fill)',
        'accent-truth': 'var(--accent-truth)',
        // Mapped equivalents to old tokens so we don't break everything instantly
        'accent-wrong': 'var(--accent-wrong-stroke)',
        'accent-consensus': 'var(--accent-consensus-stroke)',
      },
      boxShadow: {
        'solid': '4px 4px 0px 0px var(--shadow-color)',
        'solid-sm': '2px 2px 0px 0px var(--shadow-color)',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
        meta: ['"Plus Jakarta Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
import multiTheme from './src/tailwind/mulit-theme'
import themes from './src/tailwind/themes'

export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
    },
    fontSize: {
      lg: '4rem',
      md: '2.2rem',
      sm: ['1.25rem', '1.875rem'],
    },
    extend: {
      // Add custom opacity values for SSR-safe animations
      opacity: {
        10: '0.1',
      },
      // Add custom translate values
      translate: {
        2.5: '10px',
      },
      // Add custom screens for SSR-safe media queries
      screens: {
        screen: { raw: 'screen' },
      },
    },
  },
  plugins: [
    multiTheme({
      colorThemes: themes,
    }),
    // Add plugin for SSR-safe animation utilities
    function ({ addUtilities }) {
      const newUtilities = {
        '.animate-line-ssr-safe': {
          opacity: '0.1',
          transform: 'translateY(10px)',
          'will-change': 'opacity, transform',
          transition: 'opacity 0.3s ease-out',
        },
        '@media screen': {
          '.animate-line-ssr-safe': {
            opacity: '0.1',
            transform: 'translateY(10px)',
          },
        },
        '@media print': {
          '.animate-line-ssr-safe': {
            opacity: '1 !important',
            transform: 'none !important',
          },
        },
        '@media (prefers-reduced-motion: reduce)': {
          '.animate-line-ssr-safe': {
            opacity: '0.1',
            transform: 'none',
          },
        },
      }
      addUtilities(newUtilities)
    },
  ],
}

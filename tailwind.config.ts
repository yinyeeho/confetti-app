import type { Config } from 'tailwindcss'

// Screens are styled inline from lib/tokens.ts; these mirror the same palette for any utility classes.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#191919',
        paper: '#FFF7EC',
        cream: '#FFF8EC',
        hibiscus: '#FF4F81',
        cobalt: '#2F5DFF',
        citrus: '#FFC93C',
      },
      fontFamily: {
        display: ['var(--font-fredoka)', 'system-ui', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        script: ['var(--font-caveat)', 'cursive'],
      },
    },
  },
  plugins: [],
}

export default config

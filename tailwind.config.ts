import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        main: 'var(--main-color)',
        'main-dark': 'var(--main-dark)',
        'main-light': 'var(--main-light)',
      }
    },
  },
  plugins: [],
} satisfies Config
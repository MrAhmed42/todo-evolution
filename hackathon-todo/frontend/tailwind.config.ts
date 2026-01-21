import type { Config } from 'tailwindcss'

const config: Config = {
  // Added ./lib and simplified patterns for better reliability
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Adding a custom brand color for Professional Sea Green theme
        brand: {
          50: '#ecfdf5', // Lightest sea green
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Main Primary Sea Green Color
          600: '#059669', // Darker hover state
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
    },
  },
  plugins: [],
}

export default config
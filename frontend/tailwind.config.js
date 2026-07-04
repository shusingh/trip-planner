/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      colors: {
        ink: '#16243a',
        'ink-soft': '#51617a',
        paper: '#fbfaf7',
        panel: '#ffffff',
        line: '#e5e2da',
        accent: {
          DEFAULT: '#e07a3f',
          deep: '#1d3557',
        },
        ok: '#2f7d5c',
      },
    },
  },
  plugins: [],
};

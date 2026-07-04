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
        sans: ['Hanken Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        'card-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
        shimmer: {
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'card-in': 'card-in 0.4s ease both',
        shimmer: 'shimmer 1.3s linear infinite',
      },
      colors: {
        ink: '#1a1a1f',
        'ink-soft': '#4f4a42',
        'ink-muted': '#746e63',
        paper: '#efeae0',
        'paper-bright': '#f8f4ec',
        'paper-deep': '#ded5c5',
        panel: '#f8f4ec',
        line: 'rgba(26, 26, 31, 0.14)',
        accent: {
          DEFAULT: '#567a26',
          deep: '#435f1d',
        },
        ok: '#2f7d5c',
      },
    },
  },
  plugins: [],
};

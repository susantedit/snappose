import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/sections/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0E0C',
        secondaryBg: '#111814',
        surface: '#151D18',
        surfaceBorder: '#233027',
        primary: {
          DEFAULT: '#B7FF00',
          hover: '#CDFF33',
          glow: 'rgba(183, 255, 0, 0.4)',
        },
        cyanAccent: {
          DEFAULT: '#00D9FF',
          glow: 'rgba(0, 217, 255, 0.4)',
        },
        orangeAccent: {
          DEFAULT: '#FF8A00',
          glow: 'rgba(255, 138, 0, 0.4)',
        },
        textPrimary: '#F5F7F5',
        textSecondary: '#9CA3AF',
        textMuted: '#6B7280',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      boxShadow: {
        'neon-lime': '0 0 25px rgba(183, 255, 0, 0.35)',
        'neon-cyan': '0 0 25px rgba(0, 217, 255, 0.35)',
        'neon-orange': '0 0 25px rgba(255, 138, 0, 0.35)',
        'card-dark': '0 10px 30px -5px rgba(0, 0, 0, 0.7)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        // Palm palette - PALMCI Theme
        palm: {
          950: 'var(--palm-950)',
          900: 'var(--palm-900)',
          800: 'var(--palm-800)',
          700: 'var(--palm-700)',
          600: 'var(--palm-600)',
          500: 'var(--palm-500)',
          400: 'var(--palm-400)',
          300: 'var(--palm-300)',
          200: 'var(--palm-200)',
          100: 'var(--palm-100)',
        },
        // PALMCI Brand Colors
        palmci: {
          green: '#009E60',
          'green-light': '#00B86E',
          'green-dark': '#007A4A',
          orange: '#F77F00',
          'orange-light': '#FF9500',
          'orange-dark': '#D46800',
          white: '#FFFFFF',
          cream: '#F5F5DC',
          gold: '#FFD700',
        },
        gold: {
          600: 'var(--gold-500)',
          500: 'var(--gold-500)',
          400: 'var(--gold-400)',
          300: 'var(--gold-300)',
        },
        risk: {
          low: 'var(--risk-low)',
          mid: 'var(--risk-mid)',
          high: 'var(--risk-high)',
          critical: 'var(--risk-critical)',
        },
        surface: {
          0: 'var(--surface-0)',
          1: 'var(--surface-1)',
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
        },
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'calc(var(--radius) - 2px)',
        md: 'var(--radius)',
        lg: 'calc(var(--radius) + 2px)',
        xl: 'calc(var(--radius) + 6px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      backgroundImage: {
        'palm-gradient': 'linear-gradient(135deg, #ecf0ed 0%, rgb(245, 252, 246) 50%, rgb(239, 240, 239) 100%)',
        'card-gradient': 'linear-gradient(135deg, #eaecec1a 0%, hsla(133, 14%, 88%, 0.95) 100%)',
        'risk-gradient': 'linear-gradient(90deg, #00C851 0%, #F77F00 50%, #ff4444 100%)',
        'palmci-flag': 'linear-gradient(135deg, #009E60 0%, #F77F00 50%, #ffffff 100%)',
        'palmci-green': 'linear-gradient(135deg, #009E60 0%, #007A4A 100%)',
        'palmci-orange': 'linear-gradient(135deg, #F77F00 0%, #D46800 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(0, 158, 96, 0.25), 0 0 40px rgba(0, 158, 96, 0.1)',
        'glow-orange': '0 0 20px rgba(247, 127, 0, 0.25)',
        'glow-red': '0 0 15px rgba(255, 68, 68, 0.25)',
        'glow-palmci': '0 0 20px rgba(0, 158, 96, 0.2), 0 0 40px rgba(247, 127, 0, 0.1)',
        'card-dark': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-elevated': '0 8px 32px rgba(0, 0, 0, 0.5)',
        'palmci': '0 4px 15px rgba(0, 158, 96, 0.3)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
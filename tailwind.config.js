/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Application base — dark navy / graphite
        base: {
          900: '#070b14', // deepest background
          850: '#0a0f1c',
          800: '#0d1424', // panel background
          750: '#111a2e',
          700: '#16203a', // raised panel
          650: '#1b2743',
          600: '#22304f', // borders / dividers
          550: '#2c3c60',
          500: '#38496f', // strong border
        },
        // Steel blue / muted — secondary information
        steel: {
          400: '#8ca0c4',
          300: '#a8bad9',
          200: '#c6d2e6',
        },
        ink: {
          DEFAULT: '#eef3fb', // primary information (near-white)
          muted: '#9fb0cc',
          faint: '#63748f',
        },
        // Cyan — selection / active interaction / navigation
        cyan: {
          DEFAULT: '#38e1ff',
          bright: '#5eeaff',
          dim: '#1aa7c6',
          deep: '#0e5f74',
        },
        // Green — confirmed healthy only
        ok: {
          DEFAULT: '#37d99a',
          dim: '#1f8f66',
          deep: '#0f5540',
        },
        // Amber — warning / attention / degraded
        warn: {
          DEFAULT: '#ffb23e',
          dim: '#c47f1c',
          deep: '#5c3c0d',
        },
        // Red — critical / alarm / life-safety
        crit: {
          DEFAULT: '#ff4d55',
          bright: '#ff6b72',
          dim: '#c22b34',
          deep: '#4d0f14',
        },
        // Grey — offline / disabled / unavailable
        gone: {
          DEFAULT: '#6b7890',
          dim: '#495468',
        },
        // No Data / Stale — distinct violet-grey
        nodata: {
          DEFAULT: '#a98bd8',
          dim: '#6f5a94',
        },
      },
      fontFamily: {
        display: ['"Chakra Petch"', 'Rajdhani', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '0.85rem', letterSpacing: '0.02em' }],
      },
      borderRadius: {
        card: '4px',
        panel: '6px',
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.7)',
        'glow-cyan': '0 0 0 1px rgba(56,225,255,0.55), 0 0 18px -2px rgba(56,225,255,0.35)',
        'glow-crit': '0 0 0 1px rgba(255,77,85,0.7), 0 0 22px -2px rgba(255,77,85,0.5)',
        'glow-warn': '0 0 0 1px rgba(255,178,62,0.5), 0 0 16px -4px rgba(255,178,62,0.3)',
      },
      keyframes: {
        'pulse-crit': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'sweep': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'beacon': {
          '0%': { transform: 'scale(1)', opacity: '0.55' },
          '70%': { transform: 'scale(2.4)', opacity: '0' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
      },
      animation: {
        'pulse-crit': 'pulse-crit 1.4s ease-in-out infinite',
        'fade-in': 'fade-in 200ms ease-out',
        'sweep': 'sweep 1.6s ease-in-out infinite',
        'beacon': 'beacon 1.8s ease-out infinite',
      },
    },
  },
  plugins: [],
}

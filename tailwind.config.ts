import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // ─────────────────────────────────────────────────────
      // FONT FAMILY — Source Sans Pro (Coursera's primary font)
      // ─────────────────────────────────────────────────────
      fontFamily: {
        sans: [
          'Source Sans Pro',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },

      // ─────────────────────────────────────────────────────
      // FONT SIZE — Coursera's exact size scale
      // ─────────────────────────────────────────────────────
      fontSize: {
        '2xs':  ['0.6875rem', { lineHeight: '1rem' }],        // 11px
        'xs':   ['0.75rem',   { lineHeight: '1rem' }],        // 12px
        'sm':   ['0.8125rem', { lineHeight: '1.25rem' }],     // 13px
        'base': ['0.875rem',  { lineHeight: '1.5rem' }],      // 14px
        'md':   ['1rem',      { lineHeight: '1.5rem' }],      // 16px
        'lg':   ['1.125rem',  { lineHeight: '1.75rem' }],     // 18px
        'xl':   ['1.25rem',   { lineHeight: '1.75rem' }],     // 20px
        '2xl':  ['1.5rem',    { lineHeight: '2rem' }],        // 24px
        '3xl':  ['1.875rem',  { lineHeight: '2.25rem' }],     // 30px
        '4xl':  ['2.25rem',   { lineHeight: '2.5rem' }],      // 36px
      },

      // ─────────────────────────────────────────────────────
      // COLORS — Coursera's full brand palette
      // ─────────────────────────────────────────────────────
      colors: {
        // shadcn/ui compatibility (keep existing)
        border:      'hsl(var(--border))',
        input:       'hsl(var(--input))',
        ring:        'hsl(var(--ring))',
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // ── Brand blues ────────────────────────────────────
        brand: {
          DEFAULT:   '#0056D2',   // main CTA, links, active nav
          hover:     '#0040A8',   // hover state
          light:     '#E8F1FB',   // chip/badge bg, hover fills
          subtle:    '#F5F9FF',   // page tint, upsell bg
        },

        // ── Neutral greys ──────────────────────────────────
        neutral: {
          50:  '#F9FAFB',   // page background
          100: '#F3F4F6',   // hover fills, input bg
          200: '#E5E7EB',   // borders, dividers, progress track
          300: '#D1D5DB',   // unfocused input borders
          400: '#9CA3AF',   // placeholder, inactive icons
          500: '#6B7280',   // secondary/meta text
          600: '#374151',   // body text
          700: '#1F2937',   // headings, strong text
          800: '#111827',   // darkest text
        },

        // ── Success green ──────────────────────────────────
        success: {
          DEFAULT: '#1DB954',   // progress bar fill
          light:   '#D1FAE5',   // badge bg
          dark:    '#065F46',   // badge text
        },

        // ── Warning amber ──────────────────────────────────
        warning: {
          DEFAULT: '#FBBF24',   // icon colour
          light:   '#FFFBEB',   // banner bg
          dark:    '#92400E',   // banner text
        },

        // ── Destructive red ────────────────────────────────
        danger: {
          DEFAULT: '#EF4444',   // logout, errors
          light:   '#FEF2F2',   // hover bg
        },

        // ── Premium purple ─────────────────────────────────
        premium: {
          DEFAULT: '#7C3AED',   // upgrade CTA text
          light:   '#F3E8FF',   // upgrade strip bg
        },
      },

      // ─────────────────────────────────────────────────────
      // BORDER RADIUS — Coursera's exact radius scale
      // ─────────────────────────────────────────────────────
      borderRadius: {
        none:   '0px',
        chip:   '4px',     // small chips, tag pills
        sm:     '6px',     // inputs, small buttons
        DEFAULT: '8px',    // course cards, info boxes
        md:     '8px',     // alias
        lg:     '12px',    // main cards, modals, panels
        xl:     '16px',    // hero sections, large cards
        full:   '9999px',  // avatars, progress bars, pills
      },

      // ─────────────────────────────────────────────────────
      // BOX SHADOW — Coursera's minimal shadow system
      // ─────────────────────────────────────────────────────
      boxShadow: {
        none:     'none',
        card:     '0 1px 2px rgba(0,0,0,0.04)',
        dropdown: '0 10px 15px rgba(0,0,0,0.10), 0 4px 6px rgba(0,0,0,0.05)',
        modal:    '0 20px 25px rgba(0,0,0,0.10), 0 10px 10px rgba(0,0,0,0.04)',
        header:   '0 1px 2px rgba(0,0,0,0.05)',
        focus:    '0 0 0 3px rgba(0,86,210,0.20)',
        'focus-sm':'0 0 0 2px rgba(0,86,210,0.20)',
        // Keep existing defaults
        sm:  '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md:  '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg:  '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl:  '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },

      // ─────────────────────────────────────────────────────
      // SPACING — additional tokens
      // ─────────────────────────────────────────────────────
      spacing: {
        '4.5': '1.125rem',   // 18px — between standard and larger
        '18':  '4.5rem',     // 72px — large avatar size
        '88':  '22rem',      // 352px — sidebar width
      },

      // ─────────────────────────────────────────────────────
      // TRANSITION — Coursera's 150ms ease-in-out standard
      // ─────────────────────────────────────────────────────
      transitionDuration: {
        DEFAULT: '150ms',
        '150': '150ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'ease-in-out',
      },

      // ─────────────────────────────────────────────────────
      // MAX WIDTH — page container
      // ─────────────────────────────────────────────────────
      maxWidth: {
        page:    '1200px',   // 75rem — main page container
        sidebar: '22rem',    // matches spacing.88
      },

      // ─────────────────────────────────────────────────────
      // HEIGHT — header
      // ─────────────────────────────────────────────────────
      height: {
        header: '64px',   // h-16 alias with semantic name
      },
    },
  },
  plugins: [],
}

export default config

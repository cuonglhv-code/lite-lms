# name: UI/UX Conventions
# description: Design system rules, component patterns, and UX standards for this project.

## Role
You are a UI/UX engineer working on an IELTS learning platform. Your users
are English language learners — many are non-native speakers under exam
pressure. Every design decision should reduce cognitive load and build
confidence. Read `src/components/` and `tailwind.config.*` before writing
any UI code.

---

## Design principles (apply to every component)

1. **Clarity over cleverness** — Labels, buttons, and feedback must be
   immediately understood by a B2 English speaker.
2. **Reduce exam anxiety** — Use calm colours, clear progress indicators,
   and encouraging microcopy.
3. **Mobile-first** — Students often submit essays on phones or tablets.
   Every layout must work at 375px width.
4. **Accessible by default** — WCAG AA minimum. Every interactive element
   needs a keyboard focus state and aria label.
5. **Fast perceived performance** — Show skeletons and optimistic UI.
   A student should never stare at a blank screen waiting for AI scoring.

---

## Colour system (Tailwind tokens)

Define these in `tailwind.config.ts` and never use raw hex values in
components:

```ts
colors: {
  brand: {
    50:  '#f0f9ff',   // lightest background tint
    100: '#e0f2fe',
    500: '#0ea5e9',   // primary actions
    600: '#0284c7',   // primary hover
    700: '#0369a1',   // primary active
  },
  // IELTS band colours — use consistently across all score displays
  band: {
    high:   '#16a34a',   // band 7–9  (green)
    mid:    '#d97706',   // band 5–6.5 (amber)
    low:    '#dc2626',   // band 0–4.5 (red)
  },
  feedback: {
    positive: '#dcfce7',
    warning:  '#fef9c3',
    error:    '#fee2e2',
    neutral:  '#f1f5f9',
  }
}
```

---

## Typography scale

```ts
// tailwind.config.ts
fontSize: {
  'display':  ['2.25rem', { lineHeight: '2.5rem',  fontWeight: '700' }],
  'heading':  ['1.5rem',  { lineHeight: '2rem',    fontWeight: '600' }],
  'subhead':  ['1.125rem',{ lineHeight: '1.75rem', fontWeight: '500' }],
  'body':     ['1rem',    { lineHeight: '1.75rem', fontWeight: '400' }],
  'small':    ['0.875rem',{ lineHeight: '1.5rem',  fontWeight: '400' }],
  'label':    ['0.75rem', { lineHeight: '1rem',    fontWeight: '500' }],
}
```

Rule: Essay text must use `text-body` with `leading-relaxed` — readability
is critical for a writing platform.

---

## Component library conventions

This project uses **shadcn/ui** as the base. Rules:

- Never modify files in `components/ui/` directly — these are shadcn
  primitives. Extend them in `components/` instead.
- Wrap shadcn primitives in domain-specific components:

```
components/
├── ui/                  # shadcn primitives — DO NOT EDIT
├── scoring/             # Scoring-specific components
│   ├── BandScore.tsx    # Displays a single band score with colour
│   ├── ScoreCard.tsx    # Full 4-criterion breakdown card
│   ├── FeedbackPanel.tsx
│   └── BandBadge.tsx
├── writing/             # Essay submission components
│   ├── EssayEditor.tsx
│   ├── WordCounter.tsx
│   ├── TaskPrompt.tsx
│   └── SubmitButton.tsx
├── dashboard/           # Student progress components
│   ├── ProgressChart.tsx
│   ├── SubmissionHistory.tsx
│   └── BandTrend.tsx
└── shared/              # Truly generic components
    ├── LoadingSkeleton.tsx
    ├── EmptyState.tsx
    └── ErrorBoundary.tsx
```

---

## Key component patterns

### Band score display
Always use colour + number + label together. Never show a number alone.

```tsx
// components/scoring/BandScore.tsx
"use client"

type Band = number // 0–9

function getBandColour(band: Band) {
  if (band >= 7) return 'text-band-high bg-green-50'
  if (band >= 5) return 'text-band-mid bg-amber-50'
  return 'text-band-low bg-red-50'
}

export function BandScore({ band, label }: { band: Band; label: string }) {
  return (
    <div className={`rounded-lg px-4 py-3 ${getBandColour(band)}`}>
      <p className="text-label uppercase tracking-wide">{label}</p>
      <p className="text-display font-bold">{band}</p>
    </div>
  )
}
```

### Loading state (AI scoring takes time — always show progress)
```tsx
// components/scoring/ScoringProgress.tsx
"use client"

const STAGES = [
  'Reading your essay...',
  'Analysing task achievement...',
  'Checking coherence and cohesion...',
  'Evaluating vocabulary...',
  'Assessing grammar...',
  'Calculating your band score...',
]

export function ScoringProgress({ stage }: { stage: number }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="h-12 w-12 animate-spin rounded-full border-4
                      border-brand-100 border-t-brand-500" />
      <p className="text-body text-slate-600">{STAGES[stage]}</p>
      <div className="flex gap-1">
        {STAGES.map((_, i) => (
          <div key={i} className={`h-1.5 w-8 rounded-full transition-colors
            ${i <= stage ? 'bg-brand-500' : 'bg-slate-200'}`} />
        ))}
      </div>
    </div>
  )
}
```

### Empty state (never show a blank page)
```tsx
// components/shared/EmptyState.tsx
export function EmptyState({
  title,
  description,
  action
}: {
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="text-heading text-slate-700">{title}</p>
      <p className="text-body text-slate-500 max-w-sm">{description}</p>
      {action}
    </div>
  )
}
```

---

## Microcopy rules

These apply to all button labels, error messages, and feedback text:

| Context | Do | Don't |
|---|---|---|
| Submit button | "Submit my essay" | "Submit" |
| Scoring in progress | "Marking your essay..." | "Loading..." |
| Error message | "Something went wrong. Please try again." | "Error 500" |
| Empty submissions | "You haven't submitted any essays yet. Start your first one!" | "No data" |
| Low band score | "Here is how to improve your score:" | "You failed" |
| Word count warning | "IELTS Task 2 requires at least 250 words." | "Too short" |

---

## Responsive layout rules

```tsx
// Page layout wrapper — use on every page
<main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
  {children}
</main>

// Two-column layout (essay + feedback side by side on desktop)
<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
  <EssayEditor />
  <FeedbackPanel />
</div>
```

Breakpoint rules:
- Mobile (`< 640px`): single column, full-width, larger tap targets (min 44px)
- Tablet (`640–1024px`): relaxed spacing, still single column for essay
- Desktop (`> 1024px`): two-column essay + feedback layout

---

## Accessibility checklist

Apply to every new component before submitting:

- [ ] All images have `alt` text
- [ ] All form inputs have `abel>` or `aria-label`
- [ ] Interactive elements have visible focus ring (`focus-visible:ring-2`)
- [ ] Colour alone is never the only indicator (always add text or icon)
- [ ] Band scores are readable without colour (add numeric + label)
- [ ] Page has a single `<h1>` per route
- [ ] Error messages are linked to inputs via `aria-describedby`
- [ ] Keyboard navigation works for all interactive flows

---

## Animation rules

- Use motion only to communicate state changes, not for decoration.
- Respect `prefers-reduced-motion`:

```tsx
// In tailwind.config.ts
animation: {
  'fade-in': 'fadeIn 0.2s ease-out',
  'slide-up': 'slideUp 0.3s ease-out',
}
// Always pair with: motion-safe:animate-fade-in
```

---

## Checklist before submitting any UI change

- [ ] Mobile layout tested at 375px
- [ ] Band colours used from design tokens (not raw hex)
- [ ] Loading state handled (skeleton or progress indicator)
- [ ] Empty state handled (EmptyState component)
- [ ] Error state handled (ErrorBoundary or index message)
- [ ] Microcopy follows the tone guide above
- [ ] Accessibility checklist passed
- [ ] No hardcoded colours or font sizes (use Tailwind tokens only)

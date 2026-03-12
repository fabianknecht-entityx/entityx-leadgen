# entity x Lead-Gen-Score Funnel

## Project Overview

A multi-step interactive lead qualification funnel for entity x, a Berlin-based performance marketing agency. The funnel calculates a personalized "Lead-Gen-Score" (0-100) based on the user's current lead generation setup, speed-to-lead, sales process, tracking maturity, and marketing-sales alignment. The result page dynamically references the user's specific weak points and drives Calendly bookings.

**Target audience:** Decision-makers at companies with 1M€+ annual revenue (DACH region), both B2B and B2C.

## Tech Stack

- **Framework:** Next.js 14+ (App Router) with TypeScript
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion for page transitions, progress animations, score reveal
- **Deployment:** Vercel
- **Calendar Integration:** Google Calendar embed 
- **Analytics:** Event tracking hooks ready for GTM/Meta Pixel (don't implement actual tracking, just fire custom events via a `trackEvent()` utility)

## Architecture

```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts, metadata
│   ├── page.tsx            # Entry/Hero → redirects to /funnel
│   └── funnel/
│       └── page.tsx        # Main funnel orchestrator
├── components/
│   ├── funnel/
│   │   ├── FunnelContainer.tsx    # State machine, routing, progress
│   │   ├── StepRenderer.tsx       # Renders current step based on config
│   │   ├── QuestionStep.tsx       # Single/multi-select question component
│   │   ├── Interstitial.tsx       # Educational interstitial screens
│   │   ├── ContactStep.tsx        # Final contact form
│   │   └── ResultPage.tsx         # Score display + dynamic insights
│   ├── ui/
│   │   ├── ProgressBar.tsx
│   │   ├── OptionCard.tsx         # Clickable answer card
│   │   ├── ScoreGauge.tsx         # Animated circular score gauge
│   │   ├── BackgroundEffects.tsx  # Subtle radial glows behind content
│   │   └── Button.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/
│   ├── scoring.ts          # Scoring engine (pure functions)
│   ├── funnel-config.ts    # Step definitions, conditional routing
│   ├── insights.ts         # Dynamic insight generation per category
│   └── tracking.ts         # trackEvent() utility
├── context/
│   └── FunnelContext.tsx    # React Context for funnel state
├── types/
│   └── funnel.ts           # TypeScript types for all funnel state
└── styles/
    └── globals.css
```

## Critical Requirements

1. **Conditional Flow:** Step 1 answer determines "Active Path" vs "Starter Path". All subsequent steps serve different questions based on path. See `FUNNEL-SPEC.md` for exact routing logic.

2. **Scoring Engine:** Must be a pure, testable module in `lib/scoring.ts`. All scoring rules, weights, and point assignments are defined in `FUNNEL-SPEC.md`. The scoring function takes all answers as input and returns a detailed score object with per-category breakdowns.

3. **Result Page:** Dynamically generates up to 3 insights based on the user's weakest scoring categories. Each insight references specific data points from studies. Copy for each insight variant is in the spec.

4. **Disqualification Logic:** Certain answer combinations show an alternative CTA (free guide) instead of Calendly. See spec for exact rules.

5. **Mobile-First:** 70%+ traffic will come from mobile (Meta Ads). Everything must work flawlessly on mobile. Touch targets 48px+, single column, no horizontal scroll.

6. **Performance:** Target <2s LCP. Minimal JS bundle. No heavy libraries. Framer Motion is the only animation dependency.

7. **All copy is in German.** The entire UI, all questions, interstitials, results – everything in German. English only in code/comments.

## Design Direction

**Aesthetic:** Premium, confident, data-driven. NOT generic SaaS/AI slop. Think: clean luxury consultancy with a modern, bright feel.

- **Color palette:** Light blue-gray base (#F0F4FA) with vibrant blue accent (#2563EB). White card surfaces (#FFFFFF), dark navy text (#0F172A). All colors are CSS custom properties in `globals.css`, mapped to Tailwind tokens via `@theme inline` in Tailwind CSS 4 — changing the palette only requires editing `globals.css`. Score gauge uses gradient from red (low) through yellow to green (high).
- **Typography:** Playfair Display for headlines/score numbers, DM Sans for body text. Loaded via `next/font/google` in `layout.tsx`. CSS variables: `--font-playfair`, `--font-dm-sans`.
- **Layout:** Full-screen steps, centered content, generous whitespace. Each step occupies full viewport height on mobile.
- **Animations:** Smooth page transitions between steps (slide + fade). Score gauge animates on reveal (counting up). Staggered entrance for insight cards.
- **SSR Animation Pattern:** For above-the-fold framer-motion animations, use a `mounted` state pattern (`useState(false)` + `useEffect(() => setMounted(true), [])`) and pass `animate={mounted ? target : false}`. Do NOT use `whileInView` for content visible on load — it fires instantly during hydration before framer-motion can set up transitions.
- **Interstitials:** Visually distinct from question steps. Large quote-style typography with subtle background pattern or gradient. Statistics displayed as bold, oversized numbers.

**Anti-patterns to avoid:**
- No purple gradients
- No Inter/Roboto/Arial fonts
- No generic card layouts with rounded corners everywhere
- No stock illustration style
- No cookie-cutter progress bars (make it distinctive)
- No dark backgrounds — the design is intentionally light and bright

## Conventions

- All components are functional with hooks
- Use `"use client"` only where needed
- Prefer composition over prop drilling – use React Context for funnel state
- All text content lives in `funnel-config.ts`, not hardcoded in components
- CSS: Tailwind utility classes, no separate CSS files except globals.css
- Commit messages: conventional commits (feat:, fix:, refactor:)

## Key Files to Read First

Before building, read the complete specification:
- `docs/FUNNEL-SPEC.md` — Contains ALL funnel steps, conditional logic, scoring weights, copy for every screen, insight templates, and disqualification rules. This is the source of truth.

## Build Order

1. Set up Next.js project with Tailwind, Framer Motion, fonts
2. Implement types (`types/funnel.ts`)
3. Build funnel config (`lib/funnel-config.ts`) from spec
4. Build scoring engine (`lib/scoring.ts`) with unit tests
5. Build insight generator (`lib/insights.ts`)
6. Build UI components bottom-up: Button → OptionCard → ProgressBar → ScoreGauge
7. Build step components: QuestionStep → Interstitial → ContactStep → ResultPage
8. Build FunnelContainer (state machine + routing)
9. Wire everything together in funnel/page.tsx
10. Polish: animations, transitions, responsive, edge cases

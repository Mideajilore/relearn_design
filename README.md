# Operator's Guide

A personal learning hub and daily habit tracker built around
[`operators-guide-pixels-to-problem-solver.md`](./operators-guide-pixels-to-problem-solver.md) —
six tracks for moving from execution to judgment, plus a tracker whose only real
question is *where did you apply it today.*

Single user, no accounts, no backend. Everything lives in your browser.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

Other scripts:

```bash
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build locally
npm run typecheck  # tsc --noEmit
npm run test       # vitest — streak and completion logic
```

## Deploy to Vercel

The repo is a standard static Vite build.

1. Import the repo at [vercel.com/new](https://vercel.com/new).
2. Vercel detects Vite. If you need to set it by hand:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
3. Deploy.

`vercel.json` rewrites every path to `index.html` so `/guide` and `/history`
survive a hard refresh and direct links.

From the CLI instead:

```bash
npx vercel        # preview
npx vercel --prod # production
```

## The three routes

| Route      | What it does                                                            |
| ---------- | ----------------------------------------------------------------------- |
| `/`        | Today — the three daily actions, the "Applied where" note, streak, focus track, export/reset |
| `/guide`   | All six tracks with their books, videos, reading and people; the bonus pitching section; the consolidated follow list |
| `/history` | Month heatmap and a reverse-chronological log of every day you recorded  |

## How a day "counts"

Reading alone doesn't count. A day is **complete** only when **Apply** is
checked *and* the "Applied where" note is non-empty — that's the whole point of
the guide, so the streak enforces it.

The current streak counts consecutive complete days ending today, with one
deliberate grace: if today isn't complete *yet*, the count runs back from
yesterday, so an unfinished morning doesn't read as a broken streak. A day that
is genuinely missed resets it to zero. See `src/lib/streak.ts` and its tests.

## Month rotation

The focus track follows the calendar:

| Month | Track                                |
| ----- | ------------------------------------ |
| Sept  | Communication & Defending Decisions  |
| Oct   | Sales, Pitching & Negotiation        |
| Nov   | Design Thinking & Problem Framing    |
| Dec   | Decision-Making & Mental Models      |
| Jan   | Business & Product Sense             |
| Feb   | Networking & Personal Brand          |

Outside Sept–Feb it falls back to the manual override, then to track 1. The
override lives on Today and persists.

## Your data

- **Export JSON** on Today downloads every logged day as a portable file.
- **Reset all data** asks for confirmation, then deletes everything permanently.
- Nothing is sent anywhere. Clearing site data clears the tracker — export first.

## Layout

```
src/
  content/guide.ts    # the six tracks, bonus, cadence, follow list — modelled from the .md
  content/links.ts    # every outbound URL, single source of truth
  lib/storage.ts      # typed async key/value wrapper over localStorage
  lib/streak.ts       # completion + streak rules (pure, unit-tested)
  lib/rotation.ts     # date → focus track
  lib/date.ts         # local-time ISO date helpers
  lib/tracker.tsx     # the one piece of shared state, over the storage wrapper
  components/         # Card, ResourceLink, CheckItem, StreakBadge, TrackSection, Nav, …
  routes/             # Today.tsx, Guide.tsx, History.tsx
```

### Fixing a stale link

Every outbound URL is in `src/content/links.ts`. Change it there and every route
picks it up. Links whose current social handle couldn't be verified point at a
search instead of a guessed `@handle` — accounts move, searches don't.

### Swapping storage for a backend

`src/lib/storage.ts` exposes a small async interface (`get`, `set`, `getAll`,
`remove`) and nothing else in the app touches `localStorage`. Entries are stored
one key per day (`entry:YYYY-MM-DD`), which maps directly onto a
`daily_entries` table. Replacing the driver is the whole migration — no
component changes.

## Design system

- **DM Sans**, three weights: 400 body/labels/values, 600 section and track
  titles, 700 *only* the page header on each route.
- Tokens in `tailwind.config.js`: `grey-900/700/500/300/200/50`, `success`,
  `accent`. No pure black anywhere.
- Spacing on a 4px scale, restricted to 4, 8, 12, 16, 24, 32, 48 — no arbitrary
  Tailwind values.
- Card radius 12px, input/button radius 8px, hairlines 1px `grey-200`, input
  borders 1px `grey-300`.

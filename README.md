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
- **Reset all data** asks for confirmation, then deletes everything permanently
  (locally *and* in Supabase, if sync is on).
- With sync off, nothing is sent anywhere and clearing site data clears the
  tracker — export first.

## Cross-device sync (optional)

Without any env vars the app is local-only, exactly as it started. Add the
three below and the same streak and history follow you from phone to laptop.

### 1. Create the tables

In your Supabase project: **SQL Editor → New query**, paste
[`supabase/schema.sql`](./supabase/schema.sql), Run. That creates
`daily_entries` and `settings` and enables RLS.

### 2. Set the env vars

Copy `.env.example` to `.env.local` and fill in:

| Variable                 | Where it comes from                                    |
| ------------------------ | ------------------------------------------------------ |
| `VITE_SUPABASE_URL`      | Supabase → Project Settings → API → Project URL        |
| `VITE_SUPABASE_ANON_KEY` | same page → anon/publishable key (**not** service_role)|
| `VITE_OWNER_KEY`         | any fixed string — `openssl rand -hex 16`              |

`VITE_OWNER_KEY` tags your rows. **Both devices must use the same value**, which
they will, because they load the same deployment.

### 3. Add the same three to Vercel

Project → **Settings → Environment Variables**, add all three to *Production*,
*Preview* and *Development*, then **redeploy** — Vite bakes `VITE_*` vars in at
build time, so an existing deployment won't pick them up until it rebuilds.

### What happens on first load

If you already have v1 history in a browser, the first load after adding these
vars pushes it to Supabase — once, guarded by a flag, and only when Supabase has
no rows for your owner key yet. It can't overwrite data another device already
synced, and if the push fails it retries on the next load rather than marking
itself done. Nothing is lost.

### How sync behaves

- **Writes** hit `localStorage` first, so the UI never waits on the network,
  then upsert to Supabase.
- **Reads** prefer Supabase and fall back to the local cache when it's
  unreachable.
- **Offline** edits are queued and replayed on reconnect.
- **Conflicts** on the same day are settled last-write-wins on `updated_at`.

### Security, honestly

The anon key and the owner key both ship in the JavaScript bundle. RLS is
enabled, but a policy can't verify a secret the client itself supplies — so
`owner_key` separates your rows, it doesn't protect them. Anyone with your site
URL could read or write these two tables, and nothing else in the project.

That's a fair trade for a personal habit tracker. If you ever want real
protection, the upgrade is Supabase Auth — the note at the top of
`supabase/schema.sql` spells it out.

## Layout

```
src/
  content/guide.ts    # the six tracks, bonus, cadence, follow list — modelled from the .md
  content/links.ts    # every outbound URL, single source of truth
  lib/storage.ts      # typed async key/value wrapper: local cache + Supabase
  lib/supabase.ts     # client, built from env only
  lib/remote.ts       # RemoteStore interface + its Supabase implementation
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

### The storage seam

`src/lib/storage.ts` exposes a small async interface (`get`, `set`, `getAll`,
`remove`) and nothing else in the app touches `localStorage`. Entries are keyed
one per day (`entry:YYYY-MM-DD`), mapping directly onto the `daily_entries`
table.

That seam is why adding sync changed no component, route, or style — the whole
feature landed behind those four methods. A different backend later is one new
implementation of `RemoteStore` in `src/lib/remote.ts`, nothing more.

## Design system

- **DM Sans**, three weights: 400 body/labels/values, 600 section and track
  titles, 700 *only* the page header on each route.
- Tokens in `tailwind.config.js`: `grey-900/700/500/300/200/50`, `success`,
  `accent`. No pure black anywhere.
- Spacing on a 4px scale, restricted to 4, 8, 12, 16, 24, 32, 48 — no arbitrary
  Tailwind values.
- Card radius 12px, input/button radius 8px, hairlines 1px `grey-200`, input
  borders 1px `grey-300`.

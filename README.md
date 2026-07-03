# Smart Habit Tracker

A web application that reproduces the "Smart Habit Tracker" interface and turns it
into a fully interactive, hosted habit-tracking app. Built with Claude Code,
strictly following the approved specifications in [`docs/`](./docs).

> **Current status:** Stage A1 · **T01 — Project Foundation** complete.
> No UI has been built yet. The dashboard is implemented in later tasks per
> [`docs/Build-Order.md`](./docs/Build-Order.md).

## Tech Stack

| Concern            | Choice                                      |
| ------------------ | ------------------------------------------- |
| Framework          | Next.js 15 (App Router)                     |
| Language           | TypeScript (strict)                         |
| Styling            | Tailwind CSS v4 + CSS-variable design tokens |
| UI primitives      | shadcn/ui                                   |
| Icons              | lucide-react                                |
| Charts             | Recharts                                    |
| Animation          | Framer Motion (used from A7 onward)         |
| State              | Zustand                                     |
| Tooling            | ESLint + Prettier                           |

## Getting Started

```bash
npm run dev        # start the dev server (http://localhost:3000)
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint
npm run typecheck  # TypeScript (tsc --noEmit)
npm run format     # Prettier write
npm run format:check
```

## Project Structure

```
app/                # Next.js App Router (routes, layout, globals.css)
components/
  ui/               # shadcn/ui primitives
  layout/           # AppShell, ScreenTabs, region wrappers
  dashboard/        # title, KPIs, setup panel, date/plate
  charts/           # ChartPanel, AreaLineChart, ProgressRing
  table/            # HabitGrid, HabitRow, DayCheckbox, header cells
  progress/         # per-habit progress bar
hooks/              # React hooks
lib/                # framework utilities (cn, etc.)
styles/             # design tokens (added in A1-T02)
types/              # shared TypeScript types
store/              # Zustand store, selectors, actions
services/           # cross-cutting app services
domain/             # pure logic: calendar, metrics, validation (no React)
data/               # HabitRepository interface + localStorage impl + seed
public/             # static assets
docs/               # PRD, analyses, design spec, architecture, build order
```

Architecture layers are separated as **presentation ⟂ domain ⟂ data**; `domain/`
and `data/` contain no React/Next imports. See [`docs/Architecture.md`](./docs/Architecture.md).

## Design & Planning Documents

All implementation follows these approved documents, in order:

1. [`docs/Requirement-Analysis.md`](./docs/Requirement-Analysis.md)
2. [`docs/Reference-Analysis.md`](./docs/Reference-Analysis.md)
3. [`docs/Master-Design-Spec.md`](./docs/Master-Design-Spec.md)
4. [`docs/Architecture.md`](./docs/Architecture.md)
5. [`docs/Build-Order.md`](./docs/Build-Order.md)

## Scope (Stage A1–A4)

Interface → Interactivity → Web App → Hosting, stopping at **Gate 1**.
No backend, authentication, database, animations, companion website, or theme
change in this stage — those are later phases (A6/A7/Stage B).

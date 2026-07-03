# Technical Architecture — Smart Habit Tracker (Web App)

> **Complete software architecture, defined before implementation.**
> This document is the engineering blueprint for Stage A. It is designed so that **A1 (Interface) → A2 (Interactivity) → A3 (Web App) → A4 (Hosting)** can be implemented and shipped, and then **A6 (Backend/Auth)**, **A7 (Animation)**, and the **Gate-3 re-theme** can be added **without redesign**. No application code is included here.

| Field | Detail |
|---|---|
| Prepared by / date | Development Team / 3 July 2026 |
| Status | Draft — awaiting founder approval |
| Source-of-truth chain | Video → `Reference-Analysis.md` → `Master-Design-Spec.md` → **this doc** |
| Build tool | Claude Code |
| Assumed stack | **Next.js (App Router) + React + TypeScript** — answers PRD Open Question OQ-07 *(confirm)* |

**Legend:** ✅ *decided/recommended for A1–A4* · 🔒 *seam kept abstract so a later phase slots in without redesign* · ➕ *additive (A7/Stage B), architected now but not built in A1–A4* · ❓ *open PRD question — default chosen so work can proceed.*

---

## 1. High-Level Architecture

A **client-rendered, single-page-style Next.js application** with a strict separation between **presentation**, **domain logic**, and **data access**. For A1–A4 there is **no backend**: all state lives in the browser and persists to `localStorage` behind a repository seam that A6 will replace with an API — with zero changes to components or the store.

```
                          ┌───────────────────────────────────────────┐
                          │                 BROWSER                    │
                          │                                            │
  ┌───────────────┐  UI   │  ┌──────────────┐   selectors  ┌────────┐  │
  │  Presentation │◀──────┼──│  Domain/State│◀─────────────│ Derive │  │
  │  (components) │  events│  │   (store)    │──────────────▶│ metrics│  │
  └───────┬───────┘       │  └──────┬───────┘   actions     └────────┘  │
          │ tokens/styles │         │ read/write                        │
          ▼               │         ▼                                   │
  ┌───────────────┐       │  ┌───────────────────────────────┐          │
  │ Design Tokens │       │  │  HabitRepository (interface) 🔒│          │
  │  (CSS vars)   │       │  └───────┬───────────────┬───────┘          │
  └───────────────┘       │          │A1–A4          │A6 (later)        │
                          │  ┌───────▼──────┐  ┌─────▼───────────┐       │
                          │  │ LocalStorage │  │ ApiRepository ➕ │──────┼──▶ Backend (A6)
                          │  │  Repository ✅│  │  (Supabase/API) │       │    + Auth
                          │  └──────────────┘  └─────────────────┘       │
                          └───────────────────────────────────────────┘
```

**Layer contract**
- **Presentation** never touches storage or the calendar math directly — only the store (via hooks/selectors) and design tokens.
- **Domain/State** holds the canonical `HabitMonth` model, exposes actions and memoized derived selectors, and depends only on the **`HabitRepository` interface** (not a concrete implementation).
- **Data access** is a single swappable seam. A1–A4 = `LocalStorageHabitRepository`; A6 = `ApiHabitRepository`.

Rendering mode ✅: primarily **client components** for the interactive dashboard (state lives in the browser); static shell/SEO chrome may be server-rendered. Charts are **client-only** (see §13).

---

## 2. Folder Structure (target — created at A1, not now)

```
habit-tracker/
├─ docs/                       # PRD, analyses, this architecture (exists)
├─ references/                 # source video + frames (exists)
├─ public/                     # favicon, static assets
├─ src/
│  ├─ app/                             # Next.js App Router
│  │  ├─ layout.tsx                    # root: fonts, ThemeProvider, providers
│  │  ├─ page.tsx                      # "/" Dashboard (the tracker)
│  │  ├─ instructions/page.tsx         # "/instructions"
│  │  ├─ example/page.tsx              # "/example" (read-only demo)  ❓optional
│  │  ├─ globals.css                   # token variables + base reset
│  │  └─ api/                          # 🔒 A6 route handlers (absent in A1–A4)
│  ├─ components/
│  │  ├─ ui/                           # primitives: Checkbox, Dropdown, Banner, Card…
│  │  ├─ layout/                       # AppShell, ScreenTabs, Region wrappers
│  │  ├─ dashboard/                    # AppTitleBlock, SetupPanel, KpiStat, TodayDateCard, MonthTitlePlate
│  │  ├─ grid/                         # HabitGrid, GridHeader, HabitRow, DayCheckbox, ProgressBar, TasksFraction
│  │  └─ charts/                       # ChartPanel, AreaLineChart, ProgressRing (+ adapter)
│  ├─ store/                           # state: habitStore, selectors, actions
│  ├─ domain/                          # pure logic: calendar, metrics, validation (no React)
│  ├─ data/                            # HabitRepository interface + localStorage impl + seed/example data
│  ├─ hooks/                           # useHabitMonth, useDerivedMetrics, useMediaQuery, useReducedMotion
│  ├─ styles/ (or tokens/)             # design tokens source (tokens.ts) + theme files
│  ├─ types/                           # HabitMonth, Habit, Screen, Theme, Repository types
│  ├─ config/                          # constants: MAX_HABITS, breakpoints, routes
│  └─ motion/                          # ➕ A7 motion tokens + wrappers (stubs in A1–A4)
├─ .env.example                        # 🔒 A6 placeholder vars (documented, added at A6)
├─ next.config.mjs · tsconfig.json · tailwind.config.ts · package.json   # created at A1
└─ README.md
```

**Principle:** domain logic (`domain/`) and data access (`data/`) are **framework-agnostic** — no React/Next imports — so they are unit-testable and survive any UI or backend change.

---

## 3. Application Structure

- **Entry / shell:** `app/layout.tsx` mounts global providers in order → `ThemeProvider` (tokens) → `AuthProvider` 🔒 (no-op in A1–A4) → `StoreProvider` (hydrates from repository) → `AppShell`.
- **Screens (map to the reference's 3 sheet tabs):**
  - `/` **Dashboard** — the editable tracker (unifies "Example"/"Empty Template" behaviour; the user's working month).
  - `/instructions` — the Instructions page.
  - `/example` ❓ — an optional read-only seeded demo (December 2024, 153/64) for parity with the reference and for Gate-1 review.
- **Month is state, not a route.** The selected `{year, month}` is store state, reflected in the URL as a shareable query (`/?y=2024&m=12`). Switching months (the reference's "duplicate a sheet") = changing this state; no route-per-month.
- **Single dashboard composition** is reused across `/` and `/example` with different data sources (live store vs. seed), proving the layout is data-driven.

---

## 4. Component Hierarchy

Mirrors `Master-Design-Spec §4`, wrapped in app providers:

```
<RootLayout>
 └─ <ThemeProvider> → <AuthProvider>🔒 → <StoreProvider>
     └─ <AppShell>
        ├─ <ScreenTabs>                       (Instructions | Example | Dashboard)
        ├─ <DashboardScreen>                  (route "/", also "/example" read-only)
        │  ├─ <RegionIdentity>  AppTitleBlock · SetupPanel(StepBanner, YearInput, MonthDropdown) · MonthTitlePlate · TodayDateCard
        │  ├─ <RegionSummary>   KpiStat×2 · ChartPanel(daily) · ChartPanel(cumulative) · ProgressRing(monthly)
        │  ├─ <RegionSteps>     StepBanner×3
        │  └─ <HabitGrid>
        │     ├─ <GridHeader>   HeaderCell · WeekGroupHeader×5 · WeekdayDateHeader(dynamic)
        │     └─ <HabitRow>×≤10 SerialCell · HabitNameCell(/PlaceholderHabit) · DayCheckbox×35 · TasksFraction · ProgressBar
        └─ <InstructionsScreen> InstrHeaderBand · InstrStep×4 · InstrTipBand · InstrDemoCheckboxes · InstrVideoSection · InstrContact
```

Container vs. presentational: **Region\*** and **HabitGrid** are containers (subscribe to store selectors); leaf components (**DayCheckbox**, **ProgressBar**, **KpiStat**) are presentational (props in, events out).

---

## 5. Routing Architecture

- **Next.js App Router**, file-based. Routes: `/`, `/instructions`, `/example` ❓.
- **Shareable state in URL:** `?y=<year>&m=<month>` (and later `?habitFocus=` on mobile). Deep-linkable for Gate-1 review.
- **No auth routes in A1–A4.** 🔒 A6 adds `/login`, `/signup`, and route protection via `AuthProvider` + middleware; the dashboard route is unchanged (it reads the same store, now hydrated from the API).
- **Navigation** = `ScreenTabs` (client nav via `next/link`), preserving the reference's tab model; active tab underlined `--color-progress`.
- **404 / error routes:** `app/not-found.tsx` and `app/error.tsx` (see §21).

---

## 6. State Management Strategy (Frontend only)

**Store:** a lightweight external store with fine-grained subscriptions ✅ (**Zustand recommended**; `useReducer`+Context is the fallback but risks re-rendering the whole 350-cell grid on each toggle). Rationale: a single checkbox toggle must update only the affected cell + derived metrics, not re-render every row.

**Canonical state (single source of truth):**
```
HabitMonth {
  year: number
  month: number            // 1–12
  habits: Habit[]          // ordered, max 10
}
Habit {
  id: string
  name: string             // "" ⇒ inactive/placeholder row
  days: boolean[]          // length = daysInMonth(year, month)
}
UiState { activeScreen, selection?: {range for bulk toggle}, isHydrated }
```

**Derived data is never stored** — it is computed by **memoized selectors** from `HabitMonth` (see §7): totals, per-habit tasksDone/%, daily %, cumulative series, donut fraction, weekday alignment, today's index.

**Actions (the only way to mutate):** `setYear`, `setMonth`, `addHabit`, `renameHabit`, `removeHabit`, `toggleDay(habitId, dayIndex)`, `toggleRange(cells[])` (bulk/Spacebar), `resetMonth`, `hydrate(month)`, `persist()`.

**Persistence:** every mutating action writes through the **`HabitRepository`** (debounced). A1–A4 → localStorage; A6 → API. The store depends on the interface only. 🔒

**Constraints:** `MAX_HABITS = 10`; `days.length` is re-derived whenever `year/month` changes (checked values preserved by day index where the day still exists; extra days dropped/added — matching the reference's auto day-count behaviour).

---

## 7. UI Data Flow

Unidirectional:

```
User event (click / type / Space / drag)
      │
      ▼
Component calls store action ──▶ Store mutates HabitMonth ──▶ Repository.persist() 🔒
      │                                    │
      │                                    ▼
      │                        Memoized selectors recompute (only if inputs changed)
      ▼                                    │
Subscribed components re-render (only those whose selector output changed)
      ▼
KPIs · per-habit bar/fraction · daily chart · cumulative chart · donut  (all reflect new value together)
```

**Derivation pipeline (pure, in `domain/`):**
- `daysInMonth(year,month)`, `firstWeekday(year,month)` → grid alignment + today's column.
- `perHabit(habit)` → `{tasksDone, pct}`; bar colour = `pct===100 ? success : progress`.
- `totals(month)` → `{completed, possible = activeHabits×daysInMonth, uncompleted}`.
- `dailySeries(month)` → % complete per day (for chart 1 + today's %).
- `cumulativeSeries(month)` → running total (chart 2, with data labels).
- `donut(month)` → `{completed, possible}` → green/red split; full-green at max, full-red at zero.

All selectors are **input-memoized** so unaffected charts/rows don't recompute on an unrelated toggle.

---

## 8. Component Communication

- **Props down** for presentational leaves (values + callbacks); **actions up** via store, not deep callback chains.
- **Store selectors** for shared/derived state (KPIs, charts, per-habit) — avoids prop-drilling and keeps re-renders local.
- **Context** only for cross-cutting, low-frequency concerns: `Theme`, `Auth`🔒, `MediaQuery/Breakpoint`, `ReducedMotion`.
- **No component reads another component's internal state.** Bulk-selection (drag range → Spacebar) is coordinated through `UiState.selection` in the store, not sibling refs.
- **Composition over boolean-prop explosion** (per the composition guidelines): variants like `StepBanner variant="full|third"`, `KpiStat variant="completed|uncompleted"`, `DayCheckbox state="checked|unchecked|future|inactive"` — not many booleans.

---

## 9. Design Token Strategy

Implements `Master-Design-Spec §7–§10` and satisfies **NFR-03 (theme swap without rebuild)**.

- **Single source:** `tokens.ts` defines primitive + semantic tokens (colours, type scale, spacing, radius, motion).
- **Emission:** tokens are emitted as **CSS custom properties** on `:root` in `globals.css` (semantic layer). Components consume **semantic tokens only** (`--color-brand`, `--space-3`, …), never raw hex.
- **Tailwind mapping** ✅: `tailwind.config` maps utilities to the CSS variables (e.g. `bg-brand` → `var(--color-brand)`) so utilities stay theme-aware.
- **Theming (Gate-3):** an alternate theme = a second set of variable values selected by `data-theme="<name>"` on `<html>` via `ThemeProvider`. **No component or class changes** — only variable values swap. This is the entire mechanism for Stage B's re-theme.
- **Prohibited:** hardcoded colours/sizes in components; arbitrary Tailwind values (`bg-[#3BBA56]`) except in the token layer.

---

## 10. File Naming Convention

| Kind | Convention | Example |
|---|---|---|
| Folders | kebab-case | `components/grid/` |
| React component file | PascalCase `.tsx` | `HabitRow.tsx` |
| Hook | `use-*.ts` (camel export) | `use-derived-metrics.ts` → `useDerivedMetrics` |
| Domain/util module | camelCase `.ts` | `calendar.ts`, `metrics.ts` |
| Store | camelCase `.ts` | `habitStore.ts` |
| Types | PascalCase or `*.types.ts` | `HabitMonth` in `habit.types.ts` |
| Test | `*.test.ts(x)` co-located | `metrics.test.ts` |
| Token/style | kebab or camel | `tokens.ts`, `globals.css` |
| Route files | Next.js reserved | `page.tsx`, `layout.tsx`, `error.tsx` |

One primary component per file; the file name matches the component name.

---

## 11. Component Naming Convention

- **PascalCase**, descriptive, domain-scoped: `DayCheckbox`, `WeekGroupHeader`, `MonthTitlePlate`, `ProgressRing`.
- **Prefix by domain** where helpful: `Instr*` for Instructions parts, `Grid*`/`Habit*` for the table.
- **Variants via a `variant`/`state` prop**, not boolean soup (§8).
- **Boolean props** are affirmative (`isActive`, `isToday`), never negative (`isNotEditable`).
- **Event props** = `onXxx` (`onToggle`, `onRename`); render callbacks avoided unless needed for flexibility.
- Names must match `Master-Design-Spec §4 / §28` so the mapping stays traceable.

---

## 12. Responsive Strategy

Implements `Master-Design-Spec §20–§23`. **Mobile-first**, Tailwind breakpoints aligned to the spec: `sm=640`, `lg=1024`, `xl=1440`.

- **Container:** dashboard max-width `1440px`, centered, 24px gutters; the **`xl` view is the pixel-perfect fidelity target**.
- **HabitGrid:** always keeps **sticky header row + sticky S/N and HABITS columns**; the day-matrix **horizontal-scrolls** below `xl`. No data is ever hidden.
- **Reflow order:** charts wrap before the grid; KPIs stack on mobile.
- **Mobile grid** ❓ (decide with founder at A2): (a) faithful horizontal-scroll matrix, or (b) week-focus/per-habit view with a week paginator. Architecture supports both — the grid reads the same store; only the layout wrapper differs.
- **Breakpoint access** via a `useBreakpoint` hook (no JS layout thrash; CSS drives most of it).

---

## 13. Chart Architecture

Three charts (`Master-Design-Spec §12/§15`). Fidelity + swappability are the goals.

- **Adapter seam** 🔒: consumers use our `ChartPanel` / `AreaLineChart` / `ProgressRing` API; the underlying library sits behind a thin adapter so it can be swapped (answers OQ-03-adjacent charting choice) without touching the dashboard.
- **Recommendation** ✅: **Recharts** for the two area/line charts (native area+line, point markers, data labels, responsive container). **ProgressRing (donut)** = **hand-rolled SVG** for exact control of stroke width, start angle, green/red split, and centered `completed / total` label. *(Alternative: a single lightweight library or full custom SVG for all three — decision recorded, not blocking.)*
- **Client-only:** charts are `'use client'` and **dynamically imported with SSR disabled** to avoid hydration mismatch and keep them out of the server bundle.
- **Data:** charts receive **derived series from store selectors** (`dailySeries`, `cumulativeSeries`, `donut`) — they hold no state and recompute only when their series changes.
- **Responsive:** `ResponsiveContainer` (or `viewBox` for the SVG donut) so charts scale within their panel across breakpoints.
- **Motion** ➕: A7 animates path morph / arc length via chart props already exposed; disabled under reduced-motion.

---

## 14. Table Architecture (HabitGrid)

- **No virtualization** ✅ — max 10 × 35 = 350 cells is well within DOM budget; virtualization would add complexity and hurt fidelity.
- **Structure:** CSS **grid** (or semantic `<table>` with sticky styles) — `<table>` preferred for a11y (rows/headers), with `position: sticky` header row and first two columns.
- **Dynamic calendar:** header + cell count come from `domain/calendar` (`firstWeekday`, `daysInMonth`); out-of-month cells are omitted/greyed; today's column flagged. Re-render on `{year,month}` change.
- **Cell = controlled checkbox:** `DayCheckbox` is stateless, reads `checked` from its row's `days[i]`, calls `toggleDay`. Selective subscription so only the toggled cell + affected derived views update.
- **Bulk toggle:** pointer-drag sets `UiState.selection` range; Spacebar dispatches `toggleRange`. Keyboard roving-tabindex across the grid (a11y §20).
- **Alternating rows, placeholders, 10th-row activation** handled by row data (`name===""` ⇒ inactive) per the reference.

---

## 15. Reusable Component Library

| Layer | Components |
|---|---|
| **UI primitives** (`components/ui`) | `Checkbox`, `Dropdown`, `TextInput`, `Banner`, `Card`, `Bar`, `Ring`, `Tabs`, `VisuallyHidden` |
| **Layout** (`components/layout`) | `AppShell`, `ScreenTabs`, `Region`, `StickyGridFrame` |
| **Dashboard** (`components/dashboard`) | `AppTitleBlock`, `SetupPanel`, `YearInput`, `MonthDropdown`, `MonthTitlePlate`, `TodayDateCard`, `KpiStat`, `StepBanner` |
| **Grid** (`components/grid`) | `HabitGrid`, `GridHeader`, `WeekGroupHeader`, `WeekdayDateHeader`, `HabitRow`, `SerialCell`, `HabitNameCell`, `PlaceholderHabit`, `DayCheckbox`, `TasksFraction`, `ProgressBar` |
| **Charts** (`components/charts`) | `ChartPanel`, `AreaLineChart`, `ProgressRing` |
| **Instructions** | `InstrHeaderBand`, `InstrStep`, `InstrTipBand`, `InstrDemoCheckboxes`, `InstrVideoSection`, `InstrContact` |

Every component is token-styled, variant-driven, and independently testable. Primitives carry **no domain logic**; domain components compose primitives + store selectors.

---

## 16. Icons Strategy

- **Single tree-shaken icon set** ✅ (**Lucide** recommended) imported per-icon: `Star`, `Check`, `Square`, `ChevronDown`.
- **Preserve literal glyphs** from the reference where they are content, not UI: the `":)"` in STEP 4 copy and `↓↓↓` in the Empty Template hint stay as text.
- Icons are **currentColor**-driven so they inherit token colours (star → gold/orange token; check → `--color-check-mark`).
- No icon fonts; no per-habit icons (not in the reference).

---

## 17. Styling Rules

- **Tailwind + CSS-variable tokens** ✅. Components use **semantic** utilities/vars only.
- **Flat by default:** `elevation-0`, `radius-0` (checkbox `radius-sm`, donut circle). No shadows on dashboard surfaces.
- **Spacing** from the 8px scale (`--space-*`); no ad-hoc margins.
- **Typography** from the type scale tokens; Roboto via **`next/font`** (self-hosted, no layout shift).
- **No hardcoded colours/sizes**, no arbitrary Tailwind values outside the token layer, no inline styles except computed dynamic values (bar width %, donut arc).
- **Global CSS** limited to token variables + a minimal reset; everything else is component-scoped utilities.
- **Class ordering / lint:** enforce with Tailwind/ESLint plugins for consistency.

---

## 18. Animation Architecture ➕ (A7 — architected now, not built in A1–A4)

- A1–A4 ship **static-but-ready**: components expose the state changes (checked, %, series) that motion will animate; **no motion is added yet**, so nothing must be re-architected at A7.
- **Motion layer** in `motion/`: central motion tokens (`Master-Design-Spec §19`) + thin wrappers. **Framer Motion recommended** ❓ (OQ-03) behind our own `motion/` wrappers so the library is swappable.
- **Rules:** motion only reveals value changes that already happen instantly; **never animates layout** or changes palette; every animation gated by `useReducedMotion`.
- **Parallelizable with A6** (per PRD A7 ∥ A6) because motion attaches to existing components/selectors without backend dependence.

---

## 19. Performance Rules

- **Fine-grained store selectors** — a toggle re-renders only the affected cell + changed derived views (no full-grid re-render).
- **Memoize** derived series/metrics (input-memoized selectors); stable component keys (`habit.id`, day index).
- **Code-split charts** (dynamic import, SSR off) to keep initial JS small; charts load after the grid is interactive.
- **`next/font`** for Roboto; **`next/image`** for any raster assets; avoid CLS.
- **Avoid unnecessary Context re-renders** (split low-frequency Theme/Auth from high-frequency habit state).
- **Budget:** interactive dashboard < ~150KB JS gzip target for A4 *(revisit)*; 60fps on toggle; no blocking work on the main thread during check/uncheck.
- **No premature virtualization** (§14); measure before optimizing further.

---

## 20. Accessibility Rules

Implements `Master-Design-Spec §24`.
- **Semantics:** `<table>` grid with header associations; each checkbox `role/aria-checked` + label "{habit} — {weekday date}: checked/unchecked"; KPIs and donut expose text equivalents; charts have a data-table/text alternative.
- **Keyboard:** full operation — Tab to controls, roving arrows within the grid, Space toggles, Space bulk-toggles a selection (mirrors the reference tip), Enter/Esc for dropdown, visible `border-focus` ring everywhere.
- **Colour independence:** state conveyed by glyph + fraction/percentage, not colour alone.
- **Reduced motion:** honour `prefers-reduced-motion`.
- **Targets:** ≥40px on touch; usable at 200% zoom (grid scrolls).
- **CI:** automated a11y checks (axe/lint) in the pipeline.

---

## 21. Error State Strategy

- **Error boundaries** per region: wrap **charts** and the **grid** so a failure in one doesn't blank the dashboard; show an inline fallback ("Couldn't render this chart — retry").
- **Route-level** `app/error.tsx` + `app/not-found.tsx`.
- **Input validation** (`domain/validation`): YEAR within a sane range; MONTH ∈ 1–12; habit name length; MAX_HABITS enforced with a friendly message.
- **A1–A4 has no network** → errors are local (render/validation). 🔒 A6 adds repository/network errors surfaced via a toast/inline pattern **already routed through the store**, so no component rewiring later.
- **Never crash silently**; log to console in dev, to a hook seam for future monitoring.

---

## 22. Empty State Strategy

Implements the reference's zero-states (`Reference-Analysis §17`, `Master-Design-Spec §12/§15`):
- **No habits / all placeholders:** rows show `<Enter Habit N>`; 10th row activates on naming; a gentle hint to start.
- **Nothing checked (0/possible):** daily chart flat at 0%, cumulative chart collapsed axis, **donut solid red**, KPIs 0 / possible, all bars empty.
- **Empty states are derived, not special-cased** — they fall out of the same selectors with zero data, guaranteeing consistency with the reference.

---

## 23. Loading State Strategy

- **A1–A4** reads from `localStorage` after mount. To avoid **hydration mismatch**, the server renders a neutral shell; the store hydrates client-side and flips `isHydrated`. Until then show **lightweight skeletons** (grid rows, chart placeholders) sized to final dimensions to prevent CLS.
- **Suspense boundaries** around dynamically imported charts.
- 🔒 **A6** swaps the synchronous localStorage read for an async API fetch **behind the same `hydrate()` action** — the skeleton/Suspense infrastructure is reused unchanged.

---

## 24. Future Backend Integration Points (A6 — placeholders only)

Seams are defined now; **no implementation in A1–A4**.

- **`HabitRepository` interface** 🔒 — the single seam:
  `getMonth(userId?, year, month) → HabitMonth` · `saveMonth(month)` · `upsertHabit(habit)` · `removeHabit(id)` · `setDay(habitId, dayIndex, value)` · `listMonths(userId?)`.
  A1–A4: `LocalStorageHabitRepository`. A6: `ApiHabitRepository` (Supabase/Firebase/custom — OQ-02 ❓).
- **`AuthProvider`** 🔒 — no-op/local user in A1–A4; real sign-up/login at A6. Dashboard already reads `userId` from context (ignored locally).
- **API route placeholders** — `app/api/*` reserved (absent until A6); the client calls the repository, not `fetch` directly.
- **Env placeholders** — `.env.example` documents `NEXT_PUBLIC_API_URL`, auth/DB keys (added at A6; not committed now).
- **Data model parity** — the localStorage schema equals the intended DB shape (`HabitMonth`), so A6 is a transport swap, not a remodel.
- **Migration** — a one-time "import local data into your account" step is anticipated at A6 (local store → API) but not built now.

---

## 25. Deployment Architecture (A4)

- **Target** ✅: **Vercel** (first-class Next.js support, preview URLs) — recommended answer to OQ-01 ❓; **Netlify** is an equivalent fallback.
- **Build:** Next.js production build. A1–A4 has no server data, so it deploys as a **static/client-rendered** app (no serverless functions needed yet); A6 introduces API routes/serverless on the same platform without re-platforming.
- **CI/CD:** GitHub repo → platform integration → **automatic preview deploy per branch/PR** and production deploy on the main branch. The preview/production **public URL is the Gate-1 deliverable**.
- **Config:** environment via platform dashboard; none required for A1–A4. Node LTS; npm (lockfile committed).
- **Domains/monitoring:** default platform domain for Gate 1; custom domain + analytics/error monitoring deferred.
- **Rollback:** platform immutable deploys enable instant rollback.

---

## 26. Risks

| # | Risk | Mitigation |
|---|---|---|
| R1 | **Hydration mismatch** from localStorage on first paint | Neutral SSR shell + client hydrate + `isHydrated` gating + skeletons (§23) |
| R2 | **Chart fidelity** vs. the reference (donut split, data labels) | Custom SVG donut; adapter seam to swap libs; validate against `AC-6` |
| R3 | **Re-render storms** on frequent toggles | Fine-grained selectors + memoization + no full-grid Context (§6/§19) |
| R4 | **Framework lock-in** complicating A6 | Domain/data are framework-agnostic; repository seam isolates backend |
| R5 | **Theme coupling** blocking Gate-3 re-theme | Semantic-token-only styling; `data-theme` swap (§9) |
| R6 | **Mobile grid UX** undecided | Layout-only variant behind the same store; decide at A2 with founder |
| R7 | **Scope creep** (streaks/analytics not in reference) | Constrained to reference + PRD; additive seams only |
| R8 | **Open stack questions** (OQ-01/02/03/07) delay | Defaults chosen (Vercel/Next/Recharts/Framer) so A1–A4 proceeds; confirm at gates |
| R9 | **Accessibility of a dense checkbox grid** | Roving tabindex, ARIA, keyboard bulk-toggle, CI a11y checks (§20) |

---

## 27. Constraints

1. **Presentation ⟂ domain ⟂ data** separation is mandatory; components never touch storage or calendar math directly.
2. **`HabitRepository` is the only data seam**; no `fetch`/`localStorage` in components or store internals.
3. **Semantic tokens only** in components (NFR-03); no hardcoded colours/sizes.
4. **TypeScript strict**; `domain/` and `data/` have no React/Next imports and are unit-tested.
5. **Reference + Master Design Spec are binding** — no visual or structural deviation (see `Master-Design-Spec §26`).
6. **MAX_HABITS = 10**; day-matrix length derived from `{year,month}`; totals = habits × days.
7. **Additive-only** for A7/Stage B — no restructuring of A1–A4 output.
8. **No backend, no auth, no network** in A1–A4 (Gate-1 discipline).
9. **Flat design** (no shadows, square corners) enforced in styling rules.

---

## 28. Implementation Rules

1. **Build in phase order** — A1 (static interface from the spec) → A2 (wire interactivity to the store) → A3 (routing, responsive, state polish) → A4 (deploy). Do not start A6/A7 work before the respective gate.
2. **Definition of Done per component:** matches the Master Design Spec visually (AC-checked), token-styled, typed, keyboard-accessible, and unit-tested where it holds logic.
3. **Domain-first for logic:** calendar + metrics + validation are written and tested in `domain/` before UI consumes them.
4. **Repository from day one:** even A1 reads/writes through `LocalStorageHabitRepository` so the A6 swap is trivial.
5. **No premature abstraction** beyond the defined seams (repository, theme, auth, chart, motion).
6. **Pixel-perfect gate:** A1 output is diffed against reference frame `sb_00061` per `Master-Design-Spec §27` before A2 begins.
7. **Accessibility & performance are acceptance criteria, not afterthoughts** (§19/§20).
8. **Commit boundaries** follow components/phases; keep A1–A4 changes on a branch; the Gate-1 deploy is a tagged, reviewable URL.
9. **Every file obeys the naming conventions** (§10/§11) and lives in its layer (§2).
10. **Confirm open questions at the right gate** (hosting/backend/animation/framework) — defaults are provisional, not silent decisions.

---

*End of Technical Architecture. Designed so A1–A4 ship without redesign when A6/A7/Stage-B arrive. Awaiting founder approval before any build phase (A1) begins.*

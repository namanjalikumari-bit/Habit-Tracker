# Build Order — Stage A1–A4 (Setup → Gate 1)

> **Exact implementation order for PRD Stage A1–A4 only.** Work proceeds strictly top-to-bottom; a task starts only after the previous task's QA + visual checkpoints pass. Execution begins **after this document is approved** — nothing here is built yet.

| Field | Detail |
|---|---|
| Prepared by / date | Development Team / 3 July 2026 |
| Status | Draft — awaiting founder approval |
| Scope | **A1 (Interface) → A2 (Interactivity) → A3 (Web App) → A4 (Hosting) → STOP at Gate 1** |
| Source of truth | `Reference-Analysis.md`, `Master-Design-Spec.md`, `Architecture.md` |
| Fidelity target frame | `references/screenshots/sb_00061` (December 2024, 153/64) — extract from the video |

### ⛔ Out of scope for this entire document (do NOT build in A1–A4)
- **No backend, no API, no database, no server data** (that is A6).
- **No authentication / accounts / login** (that is A6).
- **No animations / transitions / celebrations** — only the reference's *instant* state updates (that is A7).
- **No companion website** (Stage B).
- **No theme change / re-theme** — the single default theme only (Stage B / Gate 3).
- **No new features** beyond the reference + approved specs (no streaks metric, analytics, social, notifications).

---

## 1. Build Sequence (Setup → Gate 1)

```
A1  Interface Build (static, pixel-perfect Example dashboard)
    T01 Scaffold → T02 Tokens → T03 Primitives → T04 Shell/Regions
    → T05 Identity → T06 KPIs+Charts(static) → T07 Step banners
    → T08 Habit grid(static) → T09 Screen tabs(static) → T10 Pixel-perfect pass
        ▼ (interface matches reference frame)
A2  Interactivity (wire logic; instant updates, no motion)
    T11 Domain logic → T12 Types+Repository(localStorage) → T13 Store
    → T14 Live checkboxes → T15 Bulk toggle → T16 Habit CRUD
    → T17 Year/Month dynamic calendar → T18 Live charts+states → T19 Persistence
    → T20 A2 behaviour-parity pass
        ▼ (behaves like the walkthrough video)
A3  Web Application (routing, screens, responsive, a11y, states, perf)
    T21 Routing/tabs → T22 Instructions screen → T23 Empty-Template state
    → T24 Responsive → T25 Accessibility → T26 Error/Empty/Loading
    → T27 Performance → T28 A3 QA pass
        ▼ (complete, robust interactive app)
A4  Hosting
    T29 Build hardening → T30 Deploy(Vercel) → T31 Hosted verification
    → T32 Gate-1 packaging (tag + shareable URL + review notes)
        ▼
GATE 1 — send hosted link to founder. STOP. Await explicit approval. (No A6/A7/Stage B.)
```

---

## 2. Global Rules (apply to every task)

- **Follow the specs exactly.** Any visual/structural deviation from `Master-Design-Spec` or `Reference-Analysis` is a defect.
- **Layer discipline** (`Architecture §1/§27`): components never touch storage or calendar math directly; `domain/` and `data/` have no React/Next imports.
- **Tokens only** — no hardcoded colours/sizes in components; tokens change **only** in T02.
- **Repository from day one** — any persistence goes through `HabitRepository` (localStorage impl), never raw `localStorage`/`fetch` in components.
- **One task = one focused change set = one commit/branch** named `a{phase}-t{n}-<slug>` (e.g. `a2-t14-live-checkboxes`).
- **No task may touch** the ⛔ out-of-scope areas or edit approved docs in `docs/` (except appending status notes).
- **TypeScript strict**, lint + typecheck clean before a task is "done".

---

## 3. Tasks in Exact Order

Each task lists: **Creates** · **May change** · **Must NOT touch** · **Acceptance** · **QA checkpoint** · **Visual/behaviour comparison** · **Rollback**.

### PHASE A1 — Interface Build (static)

#### A1-T01 — Project scaffold
- **Creates:** `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss` config, `src/app/layout.tsx`, `src/app/page.tsx` (placeholder), `src/app/globals.css` (empty base + reset), the empty folder skeleton from `Architecture §2`, `README.md`, `.gitignore`, `next/font` Roboto wiring.
- **May change:** build/config files only.
- **Must NOT touch:** any UI/domain/data logic yet; no tokens; nothing out of scope.
- **Acceptance:** dev server runs; a blank page renders with Roboto loaded; typecheck + lint pass.
- **QA checkpoint:** `dev` boots with zero console errors; production `build` succeeds.
- **Visual/behaviour comparison:** n/a (blank shell) — capture a baseline screenshot of the empty page.
- **Rollback:** delete scaffold / revert branch; nothing downstream depends on it yet.

#### A1-T02 — Design token layer
- **Creates:** `src/styles/tokens.ts`, token CSS variables in `globals.css` (all `Master-Design-Spec §7–§10` values), Tailwind theme mapping to the variables.
- **May change:** `globals.css`, `tailwind.config.ts`.
- **Must NOT touch:** components (none exist); no per-component colours.
- **Acceptance:** every semantic token from the spec resolves; a token test page shows correct swatches/type sizes.
- **QA checkpoint:** sampled swatch HEX equals spec (green `#3BBA56`, blue `#4684ED`, purple `#7A007C`, red `#E62F36`, wash `#B6E6CB`, alt-row `#EDF7E2`).
- **Visual/behaviour comparison:** swatch/type sheet vs. `Master-Design-Spec §7/§8`.
- **Rollback:** revert token commit; only the (unbuilt) UI would consume it.

#### A1-T03 — UI primitives (static, token-styled)
- **Creates:** `components/ui/` → `Banner`, `Card`, `Checkbox` (visual states only), `Bar`, `Ring`, `Tabs`, `TextInput`, `Dropdown` (visual), `VisuallyHidden`.
- **May change:** `components/ui/*` only.
- **Must NOT touch:** domain/store/data; no interactivity/logic; no motion.
- **Acceptance:** each primitive renders all its visual states (e.g. Checkbox: unchecked/checked/future/inactive) from props.
- **QA checkpoint:** primitives are flat (no shadow), square (except checkbox `radius-sm`), token-styled; storybook-style demo page renders.
- **Visual/behaviour comparison:** primitives vs. `Master-Design-Spec §11/§14/§16` (checkbox check on mint wash, purple/green bar).
- **Rollback:** revert; higher tasks not yet consuming.

#### A1-T04 — App shell + region scaffolding
- **Creates:** `components/layout/` → `AppShell`, `Region`, `StickyGridFrame`; static region placeholders positioned per the blueprint; `page.tsx` composes empty Regions A–F.
- **May change:** `layout/*`, `app/page.tsx`.
- **Must NOT touch:** tokens/primitives internals; no data.
- **Acceptance:** Regions A–F appear in correct order and relative position (empty boxes), max-width 1440 centered.
- **QA checkpoint:** layout matches blueprint at desktop; no overflow.
- **Visual/behaviour comparison:** region skeleton vs. `Master-Design-Spec §3` blueprint.
- **Rollback:** revert; regions get filled in T05–T09.

#### A1-T05 — Region A: Identity (static)
- **Creates:** `components/dashboard/` → `AppTitleBlock`, `SetupPanel` (StepBanner + static `YEAR=2024` / `MONTH=December` visuals), `MonthTitlePlate` ("DECEMBER 2024"), `TodayDateCard` (static "December 25, 2024").
- **May change:** `components/dashboard/*` (these files), Region A slot in `page.tsx`.
- **Must NOT touch:** grid/charts; no live date logic (static string for A1).
- **Acceptance:** Region A visually matches the reference top band.
- **QA checkpoint:** title lockup, STEP 1 banner, plate, and date card render with correct tokens/type.
- **Visual/behaviour comparison:** overlay vs. `sb_00061` top band (±8px, colour ΔE≤3).
- **Rollback:** revert task branch.

#### A1-T06 — Region B: KPIs + Charts (static, seeded)
- **Creates:** `components/dashboard/KpiStat`, `components/charts/` → `ChartPanel`, `AreaLineChart`, `ProgressRing`; charts rendered from **hardcoded December-2024 series** to reproduce the reference; KPIs static 153 / 64; donut static 153/217.
- **May change:** `components/dashboard/KpiStat*`, `components/charts/*`, Region B slot.
- **Must NOT touch:** store/domain (no live data yet); no motion.
- **Acceptance:** two line/area charts + donut + two KPI numbers match the reference frame.
- **QA checkpoint:** chart axes/labels/colours correct; donut split + centered "153 / 217"; charts are client-only (no SSR mismatch).
- **Visual/behaviour comparison:** overlay vs. `sb_00061` chart band (`AC-6`).
- **Rollback:** revert; charts re-bound to store in T18.

#### A1-T07 — Region C: Step banners (static)
- **Creates:** `StepBanner variant="third"` usages for STEP 2/3/4 in Region C.
- **May change:** Region C slot, StepBanner variant styling.
- **Must NOT touch:** grid/logic.
- **Acceptance:** three blue ⭐ banners with exact copy, aligned to the grid's column groups (Step 2 over S/N+HABITS, Step 3 over weeks, Step 4 over Tasks+Total).
- **QA checkpoint:** copy verbatim; blue `#4684ED`; alignment correct.
- **Visual/behaviour comparison:** vs. `sb_00061` row 19.
- **Rollback:** revert branch.

#### A1-T08 — Region D+E: Habit grid (static, seeded)
- **Creates:** `components/grid/` → `HabitGrid`, `GridHeader`, `WeekGroupHeader`, `WeekdayDateHeader`, `HabitRow`, `SerialCell`, `HabitNameCell`, `DayCheckbox` (static), `TasksFraction`, `ProgressBar`; seeded with the **7 reference habits** and their exact Dec-2024 check pattern, fractions (25/31…20/31), bars, % (81…65), today=25 highlighted.
- **May change:** `components/grid/*`, Region D/E slot.
- **Must NOT touch:** store/domain; no toggling behaviour yet (pure visuals).
- **Acceptance:** the full grid matches the reference: headers, dynamic-looking weekday/date row for Dec 2024 (Sun-start), checkbox states, alternating rows, purple/green bars, %.
- **QA checkpoint:** 35 day-cells/row; today column highlighted; bar colour green where 100% seed; numbers reconcile (Σ=153).
- **Visual/behaviour comparison:** overlay vs. `sb_00061` grid (`AC-4/AC-5`).
- **Rollback:** revert branch.

#### A1-T09 — Region F: Screen tabs (static)
- **Creates:** `components/layout/ScreenTabs` (visual only) — "1. Instructions | 2. Example | 3. Empty Template", active underlined `--color-progress`.
- **May change:** ScreenTabs, Region F slot.
- **Must NOT touch:** routing (that is T21); no navigation yet.
- **Acceptance:** tab bar matches the reference bottom bar.
- **QA checkpoint:** active-tab underline colour/position correct.
- **Visual/behaviour comparison:** vs. `sb_00061` tab bar.
- **Rollback:** revert branch.

#### A1-T10 — A1 pixel-perfect pass
- **Creates:** none (adjustments only); a `docs/qa/A1-fidelity.md` note with overlay screenshots.
- **May change:** spacing/size/colour fixes across existing static components (no new structure).
- **Must NOT touch:** logic/data; no new features.
- **Acceptance:** meets `Master-Design-Spec §27` AC-1…AC-11 for the static Example dashboard.
- **QA checkpoint:** side-by-side overlay diff within tolerance; lint/typecheck/build clean.
- **Visual/behaviour comparison:** **full-frame overlay vs. `sb_00061`** — sign-off required before A2.
- **Rollback:** revert individual fix commits; static baseline (T05–T09) remains intact.

**✅ A1 EXIT:** static Example dashboard is pixel-perfect. Proceed to A2.

---

### PHASE A2 — Interactivity (instant updates; no motion)

#### A2-T11 — Domain logic (pure, tested)
- **Creates:** `src/domain/` → `calendar.ts` (`daysInMonth`, `firstWeekday`, weekday alignment, `todayIndex`), `metrics.ts` (`perHabit`, `totals`, `dailySeries`, `cumulativeSeries`, `donut`), `validation.ts`; co-located unit tests.
- **May change:** `domain/*`, test setup.
- **Must NOT touch:** components/UI; no React imports in `domain/`.
- **Acceptance:** all functions unit-tested incl. edge months (Feb 28/29, Sun-start vs Wed-start); totals = habits × days.
- **QA checkpoint:** tests green; e.g. Dec-2024 seed → completed 153, possible 217; Feb-2025 9 habits → 252.
- **Visual/behaviour comparison:** n/a (logic) — validated by tests vs. reference numbers.
- **Rollback:** revert; no UI depends yet.

#### A2-T12 — Types + Repository (localStorage) + seed
- **Creates:** `src/types/` (`HabitMonth`, `Habit`, `Screen`, `Repository` types), `src/data/HabitRepository.ts` (interface), `src/data/LocalStorageHabitRepository.ts`, `src/data/seed.ts` (the Dec-2024 example + Jan-2025 empty template). Tests.
- **May change:** `types/*`, `data/*`.
- **Must NOT touch:** ⛔ no API/network/auth; components unchanged.
- **Acceptance:** repository round-trips a `HabitMonth` to/from localStorage; schema equals the intended future DB shape (`Architecture §24`).
- **QA checkpoint:** save→load returns identical data; seed matches reference values.
- **Visual/behaviour comparison:** n/a.
- **Rollback:** revert; store (T13) not yet wired.

#### A2-T13 — Store + selectors + actions
- **Creates:** `src/store/habitStore.ts`, selectors, actions (`setYear/setMonth/addHabit/renameHabit/removeHabit/toggleDay/toggleRange/hydrate/persist`), `StoreProvider`; hooks `hooks/useHabitMonth`, `useDerivedMetrics`.
- **May change:** `store/*`, `hooks/*`, `app/layout.tsx` (mount provider).
- **Must NOT touch:** ⛔ out-of-scope; component visuals unchanged (still showing seed via store now).
- **Acceptance:** store hydrates from repository with seed; selectors return correct derived metrics; actions mutate + persist.
- **QA checkpoint:** dispatching `toggleDay` in a test updates totals/series correctly; only affected selectors recompute.
- **Visual/behaviour comparison:** dashboard still renders identical to A1 (now store-driven) — regression overlay vs. `sb_00061`.
- **Rollback:** revert; UI falls back to static seed props.

#### A2-T14 — Live checkboxes
- **May change:** `DayCheckbox`, `HabitRow`, `HabitGrid`, `KpiStat`, charts, `ProgressRing`, `ProgressBar` to read/write the store.
- **Creates:** none (wiring).
- **Must NOT touch:** ⛔ scope; no motion (instant state flip only); tokens unchanged.
- **Acceptance:** clicking a checkbox toggles it; cell turns green; **KPIs, that habit's fraction+bar, both charts, and the donut update together instantly** (matches video 74–80s).
- **QA checkpoint:** toggle N cells → counters/percentages reconcile; no full-grid re-render (perf trace).
- **Visual/behaviour comparison:** **video parity** — replicate the 74–80s toggle + recompute.
- **Rollback:** revert wiring commit → back to T13 static-via-store.

#### A2-T15 — Bulk toggle (drag + Spacebar)
- **May change:** grid selection handling, `UiState.selection`, keyboard handler; `toggleRange` action usage.
- **Creates:** `hooks/useGridSelection` (or similar).
- **Must NOT touch:** ⛔ scope; single-toggle behaviour must remain intact.
- **Acceptance:** click-drag selects a range; Spacebar checks/unchecks all selected (matches video 84–94s and the Instructions "IMPORTANT TIP").
- **QA checkpoint:** range toggle updates all derived views once; keyboard-only path works.
- **Visual/behaviour comparison:** **video parity** — 84–94s bulk-check.
- **Rollback:** revert; single-toggle unaffected.

#### A2-T16 — Habit CRUD via cell editing
- **May change:** `HabitNameCell`, `PlaceholderHabit`, grid; `addHabit/renameHabit/removeHabit`.
- **Creates:** `components/grid/PlaceholderHabit` (if not from T08).
- **Must NOT touch:** ⛔ scope; MAX_HABITS rule enforced.
- **Acceptance:** typing a name adds/edits a habit and reveals its checkbox row; clearing/backspace removes it; 10th-row activates on entry; ≤10 enforced (matches video 42–58s, 300–304s).
- **QA checkpoint:** add habit → uncompleted +daysInMonth (e.g. 64→95); delete → reverts; 11th blocked with message.
- **Visual/behaviour comparison:** **video parity** — add "go for a run" then delete.
- **Rollback:** revert; grid returns to fixed seed rows.

#### A2-T17 — Year/Month dynamic calendar
- **May change:** `YearInput`, `MonthDropdown`, `SetupPanel`, `WeekdayDateHeader`, `TodayDateCard` (now real current date), grid/day-count binding.
- **Creates:** none.
- **Must NOT touch:** ⛔ scope.
- **Acceptance:** changing YEAR/MONTH rebuilds weekday alignment, day count, "X / N" denominators, chart X-ranges, and totals; out-of-month cells hidden; Today's Date reflects the real date (matches video 24–42s, 316–340s).
- **QA checkpoint:** Dec-2024 Sun-start vs Jan-2025 Wed-start vs Feb 28 days all correct (`AC-8`).
- **Visual/behaviour comparison:** **video parity** — month cycling Dec→Feb→…; compare Jan-2025 header vs `sb_08701`.
- **Rollback:** revert; app stays on the seeded month.

#### A2-T18 — Live charts + conditional states
- **May change:** charts + donut + bars bound fully to selectors; conditional bar colour (purple→green at 100%); today-column highlight dynamic; empty/max states.
- **Creates:** none.
- **Must NOT touch:** ⛔ scope; no motion.
- **Acceptance:** charts/donut reflect live data; bar turns green at 100%; all-checked → 217/0 green donut; all-clear → red donut + flat charts (matches video 95–205s, 300–312s).
- **QA checkpoint:** threshold at exactly 100% flips bar colour; empty state matches reference.
- **Visual/behaviour comparison:** **video parity** — 118s bar-green, 138s all-green, empty-state vs `empty_tpl`.
- **Rollback:** revert; charts fall back to T06 seed.

#### A2-T19 — Persistence + hydration
- **May change:** repository wiring into store (debounced persist), `isHydrated` gating, skeletons; `app/layout.tsx`.
- **Creates:** loading skeletons in `components/ui`.
- **Must NOT touch:** ⛔ no network; localStorage only.
- **Acceptance:** edits persist across reload; no hydration mismatch (SSR shell → client hydrate → skeleton until ready).
- **QA checkpoint:** reload retains state; no React hydration warnings; no CLS.
- **Visual/behaviour comparison:** reload retains the same dashboard (screenshot before/after reload identical).
- **Rollback:** revert persist wiring; app still works in-memory for the session.

#### A2-T20 — A2 behaviour-parity pass
- **Creates:** `docs/qa/A2-parity.md` (checklist + capture notes).
- **May change:** interaction bug fixes only.
- **Must NOT touch:** ⛔ scope; no visual redesign.
- **Acceptance:** every interaction in the walkthrough video is reproduced (steps 1–4, bulk toggle, CRUD, month recalcs, empty/max states).
- **QA checkpoint:** full manual run-through vs. the video; numbers reconcile everywhere.
- **Visual/behaviour comparison:** **full walkthrough vs. the video** — sign-off required before A3.
- **Rollback:** per-fix revert; A2 feature set intact.

**✅ A2 EXIT:** dashboard behaves like the reference. Proceed to A3.

---

### PHASE A3 — Web Application (routing, screens, responsive, a11y, states, perf)

#### A3-T21 — Routing + tab navigation + URL month state
- **Creates:** `app/instructions/page.tsx`, `app/example/page.tsx`; wire `ScreenTabs` to `next/link`; `?y=&m=` URL sync; `config/routes.ts`.
- **May change:** `app/*` routes, ScreenTabs, store↔URL sync.
- **Must NOT touch:** ⛔ no auth routes/guards; grid/charts internals.
- **Acceptance:** three screens reachable via tabs; month is deep-linkable/shareable; back/forward works.
- **QA checkpoint:** navigating tabs preserves state; URL reflects month.
- **Visual/behaviour comparison:** tab switching mirrors the video's sheet switching (206–250s).
- **Rollback:** revert routing; single-page dashboard remains.

#### A3-T22 — Instructions screen
- **Creates:** `components/dashboard/instructions/*` (`InstrHeaderBand`, `InstrStep`, `InstrTipBand`, `InstrDemoCheckboxes`, `InstrVideoSection`, `InstrContact`).
- **May change:** `/instructions` route content.
- **Must NOT touch:** ⛔ scope; dashboard components.
- **Acceptance:** reproduces `Reference-Analysis §3.1` — header band, 4 numbered steps (B5/B6, B23:B32, daily, view progress), orange "*IMPORTANT TIP*" (spacebar), demo checkboxes, video-tutorial section, contact email.
- **QA checkpoint:** copy verbatim; light-blue + orange bands correct.
- **Visual/behaviour comparison:** vs. `instr_top` frame.
- **Rollback:** revert; tab shows placeholder.

#### A3-T23 — Empty-Template state / screen
- **May change:** dashboard to support the empty/starter state; `/example` = seeded demo (Dec 2024), `/` = user's working month (starts empty/January-style), Empty-Template tab semantics.
- **Creates:** none (reuses grid with empty data + placeholders).
- **Must NOT touch:** ⛔ scope.
- **Acceptance:** matches `Reference-Analysis §3.3` — 9 active rows, `<Enter Habit N>` placeholders, 10th-row hint, 0/possible, red donut, flat charts.
- **QA checkpoint:** empty-state derives correctly (no special-casing); 10th activates on entry.
- **Visual/behaviour comparison:** vs. `empty_tpl` frame.
- **Rollback:** revert; `/` falls back to seeded demo.

#### A3-T24 — Responsive (desktop/tablet/mobile)
- **May change:** layout wrappers, sticky grid frame, breakpoints, chart reflow, mobile grid variant.
- **Creates:** `hooks/useBreakpoint`.
- **Must NOT touch:** ⛔ scope; data/logic; desktop fidelity must not regress.
- **Acceptance:** `Master-Design-Spec §20–§23` — xl pixel-perfect; sticky S/N+HABITS+header; horizontal scroll below xl; KPIs/charts stack on mobile; no data hidden. **Mobile grid variant confirmed with founder (❓) at start of this task.**
- **QA checkpoint:** test at 375 / 768 / 1024 / 1440; no overflow/data loss; targets ≥40px.
- **Visual/behaviour comparison:** desktop overlay vs. `sb_00061` unchanged; tablet/mobile vs. design spec layouts.
- **Rollback:** revert responsive layer; desktop layout intact.

#### A3-T25 — Accessibility
- **May change:** ARIA roles/labels, keyboard handlers (roving tabindex, Space toggle, Space bulk), focus rings, reduced-motion guard, contrast tweaks (text only, not brand hues).
- **Creates:** `hooks/useReducedMotion`.
- **Must NOT touch:** ⛔ scope; brand colour values.
- **Acceptance:** `Master-Design-Spec §24` / `Architecture §20` — full keyboard operation; SR labels on checkboxes/KPIs/donut; visible focus; AA contrast; reduced-motion respected.
- **QA checkpoint:** axe/lint a11y clean; keyboard-only walkthrough passes.
- **Visual/behaviour comparison:** focus-state screenshots; no visual regression to reference.
- **Rollback:** revert; core interactions unaffected.

#### A3-T26 — Error / Empty / Loading states
- **May change:** error boundaries (charts, grid), `app/error.tsx`, `app/not-found.tsx`, validation messages, skeletons.
- **Creates:** boundary + fallback components.
- **Must NOT touch:** ⛔ no network error handling (no backend); scope.
- **Acceptance:** `Architecture §21–§23` — a chart/grid failure shows an inline fallback (dashboard survives); invalid year/month handled; skeletons prevent CLS.
- **QA checkpoint:** force a boundary → graceful fallback; validation blocks bad input with a message.
- **Visual/behaviour comparison:** empty/loading visuals vs. reference zero-state.
- **Rollback:** revert; states degrade to plain render.

#### A3-T27 — Performance
- **May change:** dynamic import of charts (SSR off), memoized selectors, `next/font`, code-split, render audit.
- **Creates:** none.
- **Must NOT touch:** ⛔ scope; behaviour/visuals.
- **Acceptance:** `Architecture §19` — no full-grid re-render on toggle; charts code-split; JS budget target met; 60fps on toggle.
- **QA checkpoint:** React profiler shows localized re-renders; Lighthouse perf acceptable.
- **Visual/behaviour comparison:** no visual change (regression overlay).
- **Rollback:** revert perf commit; functionality unchanged.

#### A3-T28 — A3 QA pass
- **Creates:** `docs/qa/A3-qa.md`.
- **May change:** bug fixes only.
- **Must NOT touch:** ⛔ scope.
- **Acceptance:** cross-browser (Chrome/Firefox/Safari/Edge) + device sizes; full video-parity walkthrough on the built app.
- **QA checkpoint:** all `Master-Design-Spec §27` ACs pass on the built app.
- **Visual/behaviour comparison:** **full walkthrough vs. video across breakpoints** — sign-off before A4.
- **Rollback:** per-fix revert.

**✅ A3 EXIT:** complete, robust, responsive, accessible interactive app. Proceed to A4.

---

### PHASE A4 — Hosting

#### A4-T29 — Production build hardening
- **May change:** metadata/favicon, `README.md`, build config, lint/type fixes; final `docs/qa` notes.
- **Creates:** favicon/OG assets in `public/`.
- **Must NOT touch:** ⛔ scope; feature behaviour.
- **Acceptance:** `next build` clean; no console errors in production mode; typecheck/lint green.
- **QA checkpoint:** local production build served and smoke-tested.
- **Visual/behaviour comparison:** production build overlay vs. `sb_00061` (no regression).
- **Rollback:** revert; dev app unaffected.

#### A4-T30 — Deploy to Vercel (❓ confirm host at this task)
- **Creates:** platform project link (external), production + preview deploys; no secrets needed (no backend).
- **May change:** deployment config only.
- **Must NOT touch:** ⛔ no env/DB/auth config; app code frozen except deploy fixes.
- **Acceptance:** app deploys; **public shareable URL** loads from an external network.
- **QA checkpoint:** hosted URL renders the dashboard; assets/fonts load; no 404s.
- **Visual/behaviour comparison:** hosted screenshot overlay vs. local build.
- **Rollback:** platform immutable deploys — **redeploy the previous good build instantly**; or revert deploy config.

#### A4-T31 — Hosted verification
- **Creates:** `docs/qa/A4-hosted.md` (evidence: URL, screenshots, notes).
- **May change:** hotfix only (then redeploy).
- **Must NOT touch:** ⛔ scope.
- **Acceptance:** all interactions (steps 1–4, bulk toggle, CRUD, month recalcs, persistence, responsive) work **on the hosted URL**; performance acceptable.
- **QA checkpoint:** full walkthrough on the live URL from a clean browser/device.
- **Visual/behaviour comparison:** **hosted app vs. the walkthrough video** (final parity check).
- **Rollback:** redeploy last-known-good; investigate on a preview deploy.

#### A4-T32 — Gate-1 packaging
- **Creates:** git tag `gate-1`, `docs/Gate-1-Review.md` (shareable link, what to test, known limitations = no backend/accounts yet).
- **May change:** docs only.
- **Must NOT touch:** ⛔ everything out of scope; do **not** begin A6/A7/Stage B.
- **Acceptance:** a single reviewable link + concise review notes ready to send to the founder.
- **QA checkpoint:** link opens; review notes accurate.
- **Visual/behaviour comparison:** n/a.
- **Rollback:** re-tag if the link/build changes.

**✅ A4 EXIT → GATE 1.**

---

## 4. Rollback Plan

**Principles**
- **Every task is an isolated, revertible commit/branch** (`a{phase}-t{n}-<slug>`), merged only after its QA + visual checkpoints pass.
- **Git is the primary rollback**: a failed task is reverted with `git revert`/branch-drop; because tasks are ordered and layered, reverting one does not break earlier tasks.
- **Known-good tags at phase exits**: tag `a1-exit`, `a2-exit`, `a3-exit` so any phase can be restored wholesale.
- **Seams limit blast radius**: because logic lives behind the store/repository/chart/theme seams, reverting a UI task cannot corrupt data logic and vice-versa.
- **Hosting rollback (A4)**: the platform keeps **immutable deploys** — restore the previous production deployment instantly; debug forward on **preview deploys**, never on production.
- **Data safety**: localStorage schema equals the future DB shape; a bad write is cleared/reset via the repository's reset (no destructive migrations in A1–A4).
- **Escalation**: if a task fails QA twice, stop, restore the last phase-exit tag, and re-plan the task before retrying — do not push forward with a broken checkpoint.

**Per-task rollback** is stated inline above; default = revert the task's commit and return to the previous green checkpoint.

---

## 5. Gate 1 Stopping Rule

After **A4-T32**:

1. **STOP.** Send the founder the hosted shareable URL + `Gate-1-Review.md`.
2. **Do NOT proceed** to A6 (backend/accounts/database), A7 (animations), or any Stage B (theme change / companion website). These require **explicit founder approval** first (PRD Gate 1 is a hard stop).
3. **Wait** for the founder to test and give explicit approval before any further task begins.
4. If the founder requests changes, treat them as **new A1–A4-scoped tasks** appended to this order (same rules), re-verify, and re-present — still without crossing into A6/A7/Stage B.
5. Only upon **explicit written approval** does the project advance to A6 (which will have its own build-order document).

> The Gate-1 deliverable is a hosted, testable **interactive interface with local persistence only** — no accounts, no server. That limitation is stated up front in the review notes so expectations are correct.

---

*End of Build Order (A1–A4). Strictly sequential; each task gated by QA + visual comparison; hard stop at Gate 1. Awaiting founder approval before A1-T01 begins.*

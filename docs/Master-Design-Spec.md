# Master Design Specification — Smart Habit Tracker (Web App)

> **Single source of truth for the entire project.**
> This document translates the approved **Reference Analysis** (frame-by-frame, video-derived) into an implementable web design system. It is a **design-engineering document only** — no application code, no components, no framework setup.
>
> **Source of truth chain:** the walkthrough video → `Reference-Analysis.md` → **this spec**. Where the reference is a Google Sheets template, this spec re-expresses it as a proper responsive web app while preserving its exact look and behaviour.

| Field | Detail |
|---|---|
| Prepared by / date | Development Team / 3 July 2026 |
| Status | Draft — awaiting founder approval |
| Reference capture space | 1920 × 1088 (the video frame); all "capture px" below are measured in this space |
| Base unit | 8 px grid · root font 16 px (1 rem) |
| Type family | **Roboto** (reference-confirmed) |
| Theme note (PRD NFR-03) | All values are exposed as **tokens** so the theme can be swapped later without a rebuild |

**Legend:** ✅ *observed/measured in the reference* · 📐 *estimate — derived by measuring the capture; refine against the original sheet* · ➕ *additive — not in the reference, required by the PRD (animation/hover/responsive/streaks); designed to layer onto the flat aesthetic without altering the core.*

---

## 1. Design Principles

1. **Faithful first.** The Example dashboard must be visually indistinguishable from the reference at desktop. Fidelity outranks novelty.
2. **One page, four steps.** Preserve the single-scroll dashboard and the STEP 1→4 mental model.
3. **Flat and calm.** Square corners, thin borders, solid fills, no shadows by default. Colour carries meaning, not decoration.
4. **Numbers are heroes.** The two KPI counters are the largest elements; data is celebrated typographically.
5. **Everything updates together, instantly.** A single checkbox toggle recomputes counters, the habit's bar + fraction, both line charts, and the donut in the same beat.
6. **Semantic colour.** Green = identity/success/progress · Blue = instruction · Purple = quantitative bar · Red = shortfall/empty · Orange = the single tip · Grey = inactive.
7. **Token-driven & themeable.** Every colour, size, and motion value is a named token (§8, §7-scale, §19) so a Gate-3 re-theme is a token swap, not a rewrite.
8. **Additive polish, never destructive.** New motion, hover, and responsive behaviour (➕) must never change the reference layout, palette, or data model.

---

## 2. Visual Hierarchy

Priority order the eye should follow (and the type/size system enforces):

1. **KPI numbers** — "153" / "64" (Completed / Uncompleted) → `display-xl`.
2. **Month title plate** — "DECEMBER 2024" → `display-l`.
3. **App title** — "SMART HABIT TRACKER" → `h1` (on green).
4. **Charts + donut** — the three analytics, titled in green.
5. **STEP banners** — blue full-width dividers announcing each phase.
6. **Grid headers** — "HABITS", "WEEK n", "TASKS COMPLETED", "TOTAL".
7. **Habit rows** — names, checkboxes, fractions, bars, %.
8. **Sheet/screen tabs** — Instructions / Example / Empty Template.

Contrast ladder: oversized black numerals > large black caps > green section labels > blue banners > black table headers > regular body > grey placeholders/disabled.

---

## 3. Dashboard Blueprint

Top-to-bottom regions (desktop), mirroring the reference:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ [App Title block]            [ Month Title Plate ]              [Today's Date ] │  Region A: Identity + Date
│ [STEP 1: Year & Month]                                                          │
│ [YEAR ____]  [MONTH ▼]                                                          │
├───────────────────────────────────────────────────────────────────────────────┤
│ Total Completed   [Habits Completed/Day]   [Completed in Month]   [ Monthly    │  Region B: KPIs + Charts
│    153            (area % chart)           (cumulative chart)        Progress ] │
│ Total Uncompleted                                                  ( donut )    │
│    64                                                               153 / 217   │
├───────────────────────────────────────────────────────────────────────────────┤
│ [STEP 2: Enter habits] │ [STEP 3: Check off habits] │ [STEP 4: View progress]  │  Region C: Step banners
├───────────────────────────────────────────────────────────────────────────────┤
│ S/N │ HABITS │ WEEK 1 │ WEEK 2 │ WEEK 3 │ WEEK 4 │ WEEK 5 │ TASKS │ TOTAL       │  Region D: Grid header
│     │        │ Su..Sa │ ...    │ ...    │ ...    │ ...    │ DONE  │ (bar + %)   │
├───────────────────────────────────────────────────────────────────────────────┤
│  1  │ Go to  │ ☑☑☑… │ …      │ …      │ …      │ ☐☐☐  │ 25/31 │ ▓▓▓▓░ 81%  │  Region E: Habit rows (×≤10)
│  …  │        │        │        │        │        │        │       │             │
├───────────────────────────────────────────────────────────────────────────────┤
│ [ 1. Instructions ]  [ 2. Example ]  [ 3. Empty Template ]                       │  Region F: Screen tabs
└───────────────────────────────────────────────────────────────────────────────┘
```

Region proportions (capture-space): A+B ≈ top 50 % (rows 1–18), C ≈ row 19, D ≈ rows 20–22, E ≈ rows 23–32, F ≈ tab bar.

---

## 4. Complete Component Tree

```
<App>
├─ <ScreenTabs>                         (Instructions | Example | Empty Template)
├─ <DashboardScreen>                    (Example / Empty Template share this)
│  ├─ <RegionIdentity>
│  │  ├─ <AppTitleBlock>                (title + author subtitle, green)
│  │  ├─ <SetupPanel>                   (STEP 1)
│  │  │  ├─ <StepBanner variant="full">
│  │  │  ├─ <FieldRow label="YEAR">   → <YearInput>
│  │  │  └─ <FieldRow label="MONTH">  → <MonthDropdown>
│  │  ├─ <MonthTitlePlate>              ("DECEMBER 2024")
│  │  └─ <TodayDateCard>                (auto-updating)
│  ├─ <RegionSummary>
│  │  ├─ <KpiStat variant="completed"> (green label + big number)
│  │  ├─ <KpiStat variant="uncompleted"> (red label + big number)
│  │  ├─ <ChartPanel id="daily">       (<AreaLineChart> %)
│  │  ├─ <ChartPanel id="cumulative">  (<AreaLineChart> running total)
│  │  └─ <ChartPanel id="monthly">     (<ProgressRing> donut)
│  ├─ <RegionSteps>
│  │  ├─ <StepBanner variant="third">  (STEP 2)
│  │  ├─ <StepBanner variant="third">  (STEP 3)
│  │  └─ <StepBanner variant="third">  (STEP 4)
│  └─ <HabitGrid>
│     ├─ <GridHeader>
│     │  ├─ <HeaderCell>  (S/N, HABITS, TASKS COMPLETED, TOTAL)
│     │  ├─ <WeekGroupHeader> ×5  (WEEK 1–5)
│     │  └─ <WeekdayDateHeader>   (dynamic Su–Sa + 1..N, today highlighted)
│     └─ <HabitRow> ×≤10
│        ├─ <SerialCell>
│        ├─ <HabitNameCell>            (editable / <PlaceholderHabit>)
│        ├─ <DayCheckbox> ×35          (states in §14)
│        ├─ <TasksFractionCell>        ("X / N")
│        └─ <ProgressBar>              (purple → green at 100 %, + %)
└─ <InstructionsScreen>
   ├─ <InstrHeaderBand> ("How to use…")
   ├─ <InstrStep> ×4
   ├─ <InstrTipBand> (orange "*IMPORTANT TIP*")
   ├─ <InstrDemoCheckboxes>
   ├─ <InstrVideoSection>
   └─ <InstrContact>
```

---

## 5. Component Dimensions

Desktop, faithful to the reference. Capture px measured at 1920-wide; web values snapped to the 8 px grid.

| Component | Reference (capture px ✅/📐) | Web spec |
|---|---|---|
| Habit row height | ~40 ✅ | **40 px** |
| Day-checkbox cell | ~27–33 × 40 📐 | **32 × 40 px** |
| Checkbox glyph | ~18 × 18 📐 | **18 × 18 px**, radius 2 |
| S/N column | ~80 📐 | **64 px** |
| HABITS column | ~430 📐 | **min 280 / ideal 360 px** (flex) |
| Week group (7 cells) | ~190–230 📐 | **7 × 32 = 224 px** |
| Full day grid (35) | ~950 📐 | **35 × 32 = 1120 px** (scrolls if needed) |
| TASKS COMPLETED column | ~150 📐 | **96 px** |
| TOTAL column | ~260 📐 | **220 px** (bar ~150 + % ~56 + gutters) |
| Progress bar track | ~150 × 22 📐 | **150 × 20 px** |
| Step banner height | ~40 ✅ | **40 px** |
| Grid header block | rows 20–22 ~75 📐 | **WEEK 32 + weekday 20 + date 20 = 72 px** |
| KPI number | glyph ~50 tall 📐 | `display-xl` **64 px** |
| Month title | glyph ~40 tall 📐 | `display-l` **44 px** |
| App title | glyph ~28 tall 📐 | `h1` **28 px** |
| Month title plate | ~855 × 132 📐 | fluid, **min-h 112 px** |
| Today's Date card | ~292 × 127 📐 | **≈280 × 112 px** |
| Progress ring (donut) | Ø ~180, ring ~30, hole ~120 📐 | **Ø 180 px, stroke 28, hole 124** |
| Chart plot area | ~520 × 155 📐 | **≈520 × 160 px** |
| Screen tab | ~150 × 34 📐 | **auto × 40 px** |
| Content max-width (desktop) | frame 1920 | **1440 px** centered, 24 px gutters |

---

## 6. Spacing System

The reference uses spreadsheet row/column metrics, not a formal grid. For the web we impose an **8 px base grid** and map observed spacing to it.

| Token | Value | Typical use |
|---|---|---|
| `space-0` | 0 | flush cell borders |
| `space-0.5` | 4 px | checkbox inset, tight label gaps |
| `space-1` | 8 px | intra-component padding |
| `space-2` | 16 px | card padding, label→value |
| `space-3` | 24 px | region gutters, section padding |
| `space-4` | 32 px | between major regions |
| `space-6` | 48 px | large vertical rhythm (charts block) |
| `space-8` | 64 px | page top/bottom padding (desktop) |

**Observed spacings mapped:** habit row 40 (5×8) · checkbox cell 32 (4×8) · step banner 40 · header block 72 (9×8) · card padding 16. Grid gutters between week-groups ≈ 1 px hairline separators ✅ (kept as `border`, not `space`).

---

## 7. Typography Scale

Roboto. Root 16 px. Sizes 📐 (measured from capture); weights ✅ where the reference is clearly bold.

| Token | Size / line-height | Weight | Case | Use |
|---|---|---|---|---|
| `display-xl` | 64 / 68 | 700 | — | KPI numbers (153 / 64) |
| `display-l` | 44 / 52 | 700 | UPPER | Month title plate |
| `h1` | 28 / 34 | 700 | UPPER, +0.5 tracking | App title |
| `h2` | 22 / 28 | 700 | UPPER | "TOTAL" header |
| `h3` | 18 / 24 | 700 | Title | Section labels, chart titles |
| `label-lg` | 15 / 20 | 700 | UPPER | "HABITS", "WEEK n", "TASKS COMPLETED" |
| `label` | 13 / 16 | 700 | UPPER | STEP banner text, "YEAR"/"MONTH" |
| `body` | 14 / 20 | 400 | — | Habit names, instructions, fractions |
| `body-strong` | 14 / 20 | 700 | — | "25 / 31", "81%" |
| `small` | 12 / 16 | 500 | UPPER | Weekday abbreviations, "Today's Date:" |
| `xs` | 11 / 14 | 400 | — | Date numbers, chart tick labels, author subtitle |

Author subtitle "By Champion Challander (a.k.a Sheet Geek)" = `xs`. Placeholder `<Enter Habit N>` = `body`, colour `text-placeholder`.

---

## 8. Color Tokens

Values are **video-sampled** ✅ unless marked 📐. Grouped as primitive → semantic; consume the **semantic** tokens in UI.

### 8.1 Primitives
| Token | HEX |
|---|---|
| `green-500` | `#3BBA56` ✅ |
| `green-550` | `#3DB45B` ✅ |
| `green-600` | `#33C059` ✅ |
| `green-donut` | `#30C056` ✅ |
| `green-check` | `#33734C` ✅ |
| `green-wash` | `#B6E6CB` ✅ |
| `green-area` | `#B9DEBE` ✅ |
| `green-row` | `#EDF7E2` ✅ |
| `blue-500` | `#4684ED` ✅ |
| `purple-600` | `#7A007C` ✅ |
| `red-500` | `#E62F36` ✅ |
| `red-600` | `#D12935` ✅ |
| `orange-500` | `#E8710A` 📐 |
| `blue-100` | `#C9DAF8` 📐 |
| `grey-700` | `#656565` ✅ |
| `grey-300` | `#D9D9D9` 📐 |
| `grey-400` | `#BDBDBD` 📐 |
| `white` | `#FFFFFF` (cells read `#FDFDFD`) ✅ |
| `black` | `#0C0C0C` ✅ |

### 8.2 Semantic (consume these)
| Token | → primitive | Use |
|---|---|---|
| `--color-brand` | `green-500` | Title block, all grid headers, Today strip |
| `--color-brand-accent` | `green-550` | Section labels, chart titles |
| `--color-success` | `green-donut` | 100 % bars, donut completed, positive |
| `--color-instruction` | `blue-500` | STEP banners |
| `--color-progress` | `purple-600` | Per-habit progress bar (partial) |
| `--color-danger` | `red-500` | Uncompleted counter, donut remainder, zero-donut |
| `--color-tip` | `orange-500` | Instructions "IMPORTANT TIP" band |
| `--color-instr-band` | `blue-100` | Instructions header band |
| `--color-check-mark` | `green-check` | Checkbox check glyph |
| `--color-cell-checked` | `green-wash` | Checked-cell background wash |
| `--color-row-alt` | `green-row` | Alternating row fill |
| `--color-chart-fill` | `green-area` | Chart area fill |
| `--color-chart-line` | `green-600` | Chart line + markers |
| `--color-surface` | `white` | Page / cell background |
| `--color-border` | `grey-300` | Gridlines, thin borders |
| `--color-disabled` | `grey-400` | Out-of-month / future affordance |
| `--color-void` | `grey-700` | Frozen/void band |
| `--color-text` | `black` | Data, headings |
| `--color-text-onbrand` | `white` | Text on green/blue banners |
| `--color-text-placeholder` | `grey-400` | `<Enter Habit N>` |

---

## 9. Border System

| Token | Value |
|---|---|
| `border-hairline` | 1 px solid `--color-border` (cell gridlines) ✅ |
| `border-strong` | 1 px solid `#666` 📐 (table outer, plate/card outline) |
| `border-checkbox` | 1.5 px solid `--color-disabled` (unchecked box) ✅ |
| `border-focus` ➕ | 2 px solid `--color-instruction` (keyboard focus ring) |
| Radius `radius-0` | 0 (cells, banners, plate, cards, bars) ✅ |
| Radius `radius-sm` | 2 px (checkbox glyph only) ✅ |
| Radius `radius-full` | 50 % (donut) ✅ |

The reference is square-cornered. Do **not** introduce card rounding beyond `radius-sm`.

---

## 10. Shadow System

The reference is **flat (no shadows)** ✅. Default all surfaces to elevation-0.

| Token | Value | Use |
|---|---|---|
| `elevation-0` | none | **Default** — all reference surfaces |
| `elevation-1` ➕ | `0 1px 2px rgba(0,0,0,.08)` | Dropdown menu, hover lift (subtle) |
| `elevation-2` ➕ | `0 4px 12px rgba(0,0,0,.12)` | Open month-picker popover only |

Shadows are additive and reserved for **new** interactive affordances; never apply to the dashboard's static surfaces.

---

## 11. Icon System

Reference icons ✅: ⭐ gold star (STEP banners), ☑/☐ checkbox, ▶/▼ chevron, ↓↓↓ arrows, 🙂 ":)". Recommend a single consistent line-icon set (e.g. Lucide) for the web with these mappings:

| Reference glyph | Web token | Notes |
|---|---|---|
| ⭐ star | `icon-step-star` (filled, `orange-500`/gold) | Prefix on every StepBanner |
| ☑ checked | `icon-check` (`green-check` on `green-wash`) | 18×18, radius 2 |
| ☐ unchecked | `icon-checkbox-empty` (`grey-400` border) | 18×18, radius 2 |
| ▼ chevron | `icon-chevron-down` | Month dropdown |
| ":)" | keep as literal glyph in STEP 4 copy | Preserve verbatim |
| ↓↓↓ | keep literal in Empty Template hint | Preserve verbatim |

No per-habit icons in the reference — do not invent them.

---

## 12. Charts Specification

Three charts; colours from §8. Reference behaviour ✅.

**12.1 Habits Completed / Day** — smoothed **area + line**.
- Y axis: 0–100 %, ticks 0/25/50/75/100; X axis: 1…N (days), ticks 5/10/15/20/25/30.
- Line `--color-chart-line`, fill `--color-chart-fill`, point markers on.
- Value = % of that day's active habits checked. Empty-state: flat at 0 % ✅.

**12.2 Habits Completed in Month** — cumulative **area + line** with **per-point data labels**.
- Y axis: auto (0…Σ; **0.00–1.00 when empty** ✅); X axis: 0…N.
- Same line/fill; small green data labels above points.
- Value = running total of completions to date.

**12.3 Monthly Progress** — see §15 (donut).

Common: no gridline clutter beyond axis ticks; titles in `--color-brand-accent` (`h3`); all three re-render on any data change (➕ animate per §18, ≤ `motion-slow`).

---

## 13. Table Specification (HabitGrid)

Columns L→R: **S/N** · **HABITS** (B23:B32, ≤10) · **35 day-cells** in WEEK 1–5 (7 each) · **TASKS COMPLETED** (`X / N`) · **TOTAL** (bar + %). Dimensions in §5.

**Header (3 tiers)** ✅: group row (S/N, HABITS, WEEK 1–5, TASKS COMPLETED, TOTAL) · weekday row (dynamic Su–Sa) · date row (1…N). All on `--color-brand`, text `--color-text` bold.

**Dynamic calendar** ✅:
- Weekday header **realigns to the 1st-of-month weekday** (Dec 2024 → Sun-start; Jan 2025 → Wed-start).
- **Days-in-month** sets N and total (28/29/30/31); out-of-month day-cells are hidden/greyed.
- **Today's column** highlighted: weekday+date in white-italic-underline on brand.

**Row styling** ✅: alternate `--color-surface` / `--color-row-alt`; S/N bold centered; habit name left (or `text-placeholder`); TASKS centered `body-strong`; TOTAL = bar + right-aligned %.

**Cell backgrounds** ✅: checked → `--color-cell-checked` wash; unchecked (past & future) → surface. (See §14.)

---

## 14. Checkbox States

| State | Box | Cell bg | When |
|---|---|---|---|
| **Unchecked** ✅ | empty, `border-checkbox` | surface | past/future day, not done |
| **Checked** ✅ | `icon-check` `green-check`, radius 2 | `green-wash` | day completed |
| **Future** ✅ | empty box | surface | day > today (still togglable) |
| **Inactive** ✅ | no checkbox | surface/greyed | out-of-month day, or 10th row before a habit is named |
| **Hover** ➕ | border → `green-500`, cursor pointer | slight wash | pointer over an active box |
| **Focus** ➕ | `border-focus` ring | — | keyboard focus |
| **Disabled** ➕ | box @ 40 % opacity | — | inactive/out-of-month (non-interactive) |
| **Pressed/toggling** ➕ | check scales 0→1 (§18) | wash fades in | on click/Space |

Interactions ✅: single click toggles + full recompute; **click-drag range + Spacebar** bulk-toggles; adding/removing a habit adds/removes its whole checkbox row.

---

## 15. Progress Ring Specification (Monthly Progress donut)

- Ø **180 px**, stroke **28 px**, hole **124 px** 📐; `radius-full`.
- Track = `--color-danger` (remaining); progress arc = `--color-success` (completed); starts at 12 o'clock, clockwise.
- **Center label**: `completed / total` (e.g. "153 / 217") in `h3`/`body-strong`, `--color-text`.
- States ✅: **all green** at max (217/0) · **all red** at zero (0/279) · split proportionally otherwise.
- Title "Monthly Progress" `h3` `--color-brand-accent` above.
- ➕ Arc animates on change (§18); ➕ optional full-green "celebration" pulse at 100 % (respect reduced-motion).

---

## 16. Progress Bar Specification (per-habit TOTAL)

- Track **150 × 20 px** 📐, left-anchored, square (`radius-0`).
- Fill width = habit completion % (tasksDone / N).
- **Colour is conditional** ✅: `< 100 %` → `--color-progress` (purple); `= 100 %` → `--color-success` (green).
- Track background: transparent/surface (no visible empty track in reference; keep subtle `--color-row-alt` if needed).
- **% label** right-aligned, `body-strong`, `--color-text`.
- ➕ Fill animates width on change with `motion-base`; colour cross-fades at the 100 % threshold.

---

## 17. Dropdown Specification (Setup panel)

- **MONTH** = single-select dropdown, 12 months (January…December) ✅. Trigger cell shows current month + `icon-chevron-down`. Selecting rebuilds the calendar/charts/totals.
- **YEAR** = numeric input (typed) ✅ (e.g. 2024/2025); combines with MONTH to compute weekday alignment + day count.
- Menu: surface, `border-strong`, `elevation-2` ➕, item height 32 px, hover `--color-row-alt`, selected check/`--color-brand`.
- Labels "YEAR"/"MONTH" = `label` on `--color-brand` cells (as reference).
- ➕ Keyboard: open on Enter/Space/↓; navigate ↑↓; select Enter; close Esc.

---

## 18. Animation Specification ➕

The reference has **no intrinsic animation** (only instant recompute + chart redraw) ✅. The PRD (A7) requires micro-interactions. All motion below is **additive**, restrained, and must honour `prefers-reduced-motion` (reduce to instant/opacity-only).

| Interaction | Effect | Token |
|---|---|---|
| Checkbox toggle | check scales 0→1 + wash fades in | `motion-fast` / `ease-out` |
| Bulk toggle (Spacebar) | staggered 15 ms per cell, cap 150 ms total | `motion-fast` |
| KPI counters | count-up/down tween to new value | `motion-base` |
| Per-habit bar | width tween; colour cross-fade at 100 % | `motion-base` |
| Donut arc | arc length tween | `motion-slow` |
| Line/area charts | path morph + point fade on data change | `motion-slow` |
| Streak / 100 % celebration | one-shot pulse/confetti-lite (subtle) | `motion-slow`, once |
| Screen-tab switch | 120 ms cross-fade of panel | `motion-fast` |
| Dropdown/menu open | fade + 4 px rise | `motion-fast` |
| Hover states | 100 ms colour/opacity | `motion-fast` |

Constraint: motion never shifts layout or changes palette; it only reveals value changes that already occur instantly in the reference. No parallax, no long/looping animation.

---

## 19. Motion Timing ➕

| Token | Duration | Curve |
|---|---|---|
| `motion-instant` | 0 ms | — (reduced-motion fallback) |
| `motion-fast` | 120 ms | `ease-out` `cubic-bezier(0,0,.2,1)` |
| `motion-base` | 240 ms | `ease-in-out` `cubic-bezier(.4,0,.2,1)` |
| `motion-slow` | 400 ms | `ease-in-out` |
| `motion-celebrate` | 600 ms, one-shot | `cubic-bezier(.2,.8,.2,1)` |

Never exceed 600 ms for any state change. `prefers-reduced-motion: reduce` ⇒ all → `motion-instant` except essential opacity fades.

---

## 20. Responsive Behaviour ➕

The reference is **not responsive** (mobile = the same sheet panned) ✅. We define genuine behaviour. Breakpoints:

| Name | Range | Strategy |
|---|---|---|
| `mobile` | < 640 px | Single column; stack everything; day-grid horizontal-scroll or week/day view |
| `tablet` | 640–1023 px | Two-column summary; grid horizontal-scroll with sticky S/N+HABITS |
| `desktop` | 1024–1439 px | Full reference layout; grid may horizontal-scroll |
| `wide` | ≥ 1440 px | Full layout at 1440 max-width, centered — matches the reference capture |

Rules: the **HabitGrid header row and the S/N + HABITS columns are sticky** on scroll at all sizes; charts reflow before the grid does; never hide data — prefer scroll/scale over removal.

---

## 21. Desktop Layout (≥1024, target ≥1440 = pixel-perfect)

- Content max-width **1440 px**, centered, 24 px gutters.
- Region A: three-column top row — App title/Setup (left), Month plate (center, flexes), Today card (right).
- Region B: KPI stack (left ~200 px) + three chart panels in a row (daily, cumulative, donut).
- Region C: STEP 2/3/4 as three banners across full width, aligned to the grid's column groups (Step 2 over S/N+HABITS, Step 3 over the weeks, Step 4 over TASKS+TOTAL).
- Region D/E: full HabitGrid, all 35 day-cells visible at ~32 px; horizontal scroll only if viewport < grid width.
- Region F: screen tabs bottom-left, active underlined `--color-progress`.
- **This is the fidelity target** — must match the reference frame.

---

## 22. Tablet Layout (640–1023)

- Region A stacks to two rows: (App title + Setup) over (Month plate + Today card), or Month plate full-width with Today card beneath.
- Region B: KPI counters side-by-side on one row; charts wrap to a 2-up grid (daily + cumulative), donut on its own row.
- Region C: STEP banners may wrap to full-width stacked bars if column alignment breaks.
- HabitGrid: **horizontal scroll**; S/N + HABITS columns and the header stay **sticky**; day-cells keep 32 px.
- Tap targets ≥ 40 px.

---

## 23. Mobile Layout (<640)

- All regions single-column, full-width, generous vertical spacing.
- KPI counters: two stacked cards (or a 2-col mini-grid) at the top.
- Charts: one per row, full-width; donut centered.
- STEP banners: full-width stacked.
- HabitGrid options (pick one at build, confirm with founder):
  - **(a)** Horizontal-scroll matrix with sticky S/N+HABITS and header (most faithful), or
  - **(b)** Per-habit card / current-week focus view with a week paginator (most usable).
- Checkboxes ≥ 40 × 40 px hit area (glyph stays 18–24 px). Bulk-select via long-press-drag ➕.
- Screen tabs become a top segmented control or bottom bar.

---

## 24. Accessibility Considerations ➕

- **Contrast:** verify AA. Watch white-on-green banners and green-on-white labels; darken text or thicken weight if a pair fails 4.5:1 (3:1 for ≥`h3`). Do not change brand hues to pass — adjust text colour/size.
- **Keyboard:** full operation — Tab to reach checkboxes/inputs/tabs; Space/Enter toggles a checkbox; arrow-key roving within the grid; Space bulk-toggles a selected range (mirrors the reference tip); Esc closes menus. Visible `border-focus` ring on every focusable.
- **Screen readers:** each checkbox = `role="checkbox"` `aria-checked`, label "{habit} — {weekday} {date}, {checked/unchecked}". KPIs and donut expose text alternatives ("153 of 217 completed, 70%"). Charts have a text summary / data table alternative.
- **Reduced motion:** honour `prefers-reduced-motion` (§19).
- **Targets:** ≥ 40 px on touch. **Never rely on colour alone** — the check glyph + fraction/percentage carry state alongside colour.
- **Zoom/reflow:** usable to 200 % zoom without loss (grid scrolls).

---

## 25. Design Constraints

1. **Palette is fixed** to §8 tokens (until a Gate-3 re-theme, which is a token swap).
2. **Font = Roboto**; type scale = §7.
3. **Flat** — `elevation-0` default; `radius-0` except checkbox `radius-sm` and circular donut.
4. **Structure preserved** — regions A–F, four steps, grid shape, three charts, donut.
5. **Data model preserved** — habits B23:B32 (≤10), 5×7 day matrix, tasks = Σ checked, total = habits × days-in-month, all metrics recompute together.
6. **Theme-swappable without rebuild** (NFR-03) — consume semantic tokens only.
7. **Additive-only polish** — animation/hover/responsive/streaks must not alter the reference core.
8. **No new features** beyond the reference + PRD scope (no analytics/social/notifications for MVP).

---

## 26. Things That MUST NEVER Change

1. One-page dashboard composition (summary/charts on top, grid below).
2. The four numbered STEP banners and their order/wording intent.
3. Colour **semantics** and the exact §8 palette (pre-theme).
4. The two hero KPI counters (Completed green / Uncompleted red), oversized.
5. The three charts (daily %, cumulative, donut) and donut states (green at max, red at zero).
6. Habit matrix shape: S/N · name · 5 weeks × 7 day-checkboxes · Tasks (X/N) · Total (bar + %).
7. Dynamic weekday/date header realigning to the month; today highlighted; out-of-month hidden.
8. Checkbox as the primary interaction, instant full recompute, click-drag + Spacebar bulk-toggle.
9. Conditional per-habit bar (purple → green at 100 %) + %.
10. Month title plate + auto-updating Today's Date.
11. Flat visual language (square, no shadow, Roboto, bold uppercase headings).
12. Three-screen model (Instructions / Example / Empty Template), incl. `<Enter Habit N>` placeholders, 9 active rows, and 10th-row activation.
13. "Smart Habit Tracker" green title lockup (until the founder's Gate-3 theme).

---

## 27. Pixel-Perfect Acceptance Criteria

Fidelity is judged **at ≥1440 px desktop against the reference frame** (`sb_00061`, December 2024, 153/64).

- **AC-1 Layout:** every Region A–F is present in the same order and relative position; side-by-side overlay with the reference shows region boundaries within **±8 px**.
- **AC-2 Colour:** sampled fills match §8 tokens within **ΔE ≤ 3** (headers `#3BBA56`, banner `#4684ED`, bar `#7A007C`, red `#E62F36`, wash `#B6E6CB`, alt-row `#EDF7E2`).
- **AC-3 Typography:** Roboto; KPI numbers are the largest element; heading sizes follow §7 within **±2 px**; casing matches (UPPER headings).
- **AC-4 Grid:** 5 week-groups × 7 day-cells; day-cell ~32 px; row ~40 px; alternating row fills; today's column highlighted; out-of-month cells hidden for the selected month.
- **AC-5 Checkbox:** checked = green check on mint wash; unchecked = grey-bordered empty box; identical to reference at 100 % zoom.
- **AC-6 Charts:** three charts present with reference titles, axes ranges, green line/fill; cumulative shows data labels; donut shows `completed / total` centered.
- **AC-7 Numbers reconcile:** Completed + Uncompleted = habits × days; donot denominator matches; per-habit % = tasksDone/N (spot-check ≥3 rows, e.g. 25/31 = 81 %).
- **AC-8 Dynamic month:** switching to a month with a different start weekday and day count re-aligns headers and recomputes totals correctly (verify Dec 2024 Sun-start vs Jan 2025 Wed-start; Feb 28 → 9×28 = 252).
- **AC-9 States:** empty state (0 checked) shows flat daily chart, collapsed cumulative axis, solid-red donut; max state (all checked) shows all-green bars + green donut.
- **AC-10 Flat:** no shadows or rounded cards on dashboard surfaces (except checkbox 2 px + circular donut).
- **AC-11 Instructions & Empty Template** reproduce their reference content (§3.1/§3.3), including `<Enter Habit N>` placeholders and the 10th-row hint.
- **AC-12 Responsive** ➕: no data loss at tablet/mobile; sticky S/N+HABITS+header; motion respects reduced-motion.

---

## 28. Reference → Web Mapping (every visual element)

| # | Reference element (sheet) | Web component | Tokens / spec |
|---|---|---|---|
| 1 | "SMART HABIT TRACKER" green block + author | `<AppTitleBlock>` | `--color-brand`, `h1` + `xs`, `text-onbrand` |
| 2 | "STEP 1" blue banner | `<StepBanner variant=full>` | `--color-instruction`, `label`, ⭐ |
| 3 | YEAR (B5) | `<YearInput>` | numeric, `label` cell |
| 4 | MONTH (B6) dropdown | `<MonthDropdown>` | §17, `icon-chevron-down` |
| 5 | "DECEMBER 2024" plate | `<MonthTitlePlate>` | `display-l`, `border-strong`, `radius-0` |
| 6 | "Today's Date:" card | `<TodayDateCard>` | green header strip + body; auto-updates |
| 7 | "Total Habits Completed" + 153 | `<KpiStat completed>` | `h3` green label + `display-xl` |
| 8 | "Total Habits Uncompleted" + 64 | `<KpiStat uncompleted>` | `h3` red label + `display-xl` |
| 9 | "Habits Completed / Day" chart | `<ChartPanel id=daily>` | §12.1 |
| 10 | "Habits Completed in Month" chart | `<ChartPanel id=cumulative>` | §12.2, data labels |
| 11 | "Monthly Progress" donut + 153/217 | `<ProgressRing>` | §15 |
| 12 | "STEP 2/3/4" banners | `<StepBanner variant=third>` ×3 | aligned to column groups |
| 13 | S/N header + numbers | `<HeaderCell>` + `<SerialCell>` | `--color-brand`, bold |
| 14 | "HABITS" header + names (B23:B32) | `<HeaderCell>` + `<HabitNameCell>` | `label-lg` / `body`; placeholder token |
| 15 | WEEK 1–5 group headers | `<WeekGroupHeader>` ×5 | `label-lg` |
| 16 | Weekday + date sub-headers (dynamic) | `<WeekdayDateHeader>` | today highlighted; `small`/`xs` |
| 17 | Day checkboxes (35/row) | `<DayCheckbox>` | §14 states |
| 18 | Checked-cell green wash | `--color-cell-checked` | conditional bg |
| 19 | "TASKS COMPLETED" + X/N | `<TasksFractionCell>` | `body-strong` |
| 20 | "TOTAL" header | `<HeaderCell>` | `h2` |
| 21 | Per-habit purple/green bar + % | `<ProgressBar>` | §16 |
| 22 | Alternating row fill | row style | `--color-row-alt` |
| 23 | Today's column highlight | header modifier | white-italic-underline on brand |
| 24 | Out-of-month / future cells | disabled/hidden state | §14 |
| 25 | Sheet tabs (1/2/3) | `<ScreenTabs>` | active underline `--color-progress` |
| 26 | Instructions header band | `<InstrHeaderBand>` | `--color-instr-band` |
| 27 | Instruction steps 1–4 | `<InstrStep>` ×4 | `body` |
| 28 | "*IMPORTANT TIP*" orange band | `<InstrTipBand>` | `--color-tip` |
| 29 | Instructions demo checkboxes | `<InstrDemoCheckboxes>` | reuse `<DayCheckbox>` |
| 30 | Video tutorial + contact email | `<InstrVideoSection>` / `<InstrContact>` | `body`; mailto |
| 31 | Empty Template `<Enter Habit N>` | `<PlaceholderHabit>` | `text-placeholder` |
| 32 | "Add a 10th habit" hint + ↓↓↓ | hint row in `<HabitGrid>` | preserve verbatim |
| 33 | Empty/zero states (flat chart, red donut) | state variants | §12/§15 |
| 34 | Frozen/void grey band | layout background | `--color-void` (or omit in web) |

---

*End of Master Design Specification. This is the project's single source of truth. Awaiting founder approval before any build phase (A1) begins.*

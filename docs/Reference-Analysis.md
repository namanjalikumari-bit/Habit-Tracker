# Reference Analysis — Smart Habit Tracker (Frame-by-Frame, Video-Derived)

> **Version 2 — supersedes the earlier screenshot-based draft.**
> This analysis is derived from a true frame-by-frame inspection of the **walkthrough video** (the PRIMARY source of truth), not from screenshots. Every screen, layout, component, color, and interaction below was observed directly in the video and, where noted, measured by sampling actual pixels.

| Field | Detail |
|---|---|
| **Primary source** | `C:\Users\naman\Videos\Captures\(483) How to use my Smart Habit Tracker - Google Sheets Template - YouTube - Google Chrome 2026-07-02 18-46-38.mp4` |
| **Duration** | 393.0 s (6 min 33 s) |
| **Resolution** | 1920 × 1088, variable frame rate (~15–30 fps) |
| **Product** | "Smart Habit Tracker" — a **Google Sheets template** by *Champion Challander (a.k.a. Sheet Geek)* |
| **Distribution** | Gumroad `sheetgeekhq.gumroad.com/l/smarthabittracker` (₹1,431.49; 5★, 65 ratings); YouTube `@championchallandertech` |
| **Support contact (from video)** | `championchallander@gmail.com` |
| **Prepared by / date** | Development Team / 3 July 2026 |
| **Status** | Draft — awaiting founder approval |

---

## 0. Methodology (how this was produced)

Because the environment had no `ffmpeg`/OpenCV, frames were extracted with the **installed VLC 3.0.8** headless scene filter (hardware-decoded):

1. **Full-video storyboard** — extracted **403 full-resolution frames (1920×1088)** across the entire 393 s (≈1 frame/second) into PNGs.
2. **Contact sheets** — tiled all frames into 6 timestamped survey sheets to map the timeline; the video has **burned-in captions**, giving the complete narration transcript alongside each on-screen action.
3. **Scene-change detection** — perceptual-hash diffing to locate tab switches, dropdowns, dialogs, and scroll jumps.
4. **Detail pass** — re-read key moments at full resolution (Instructions sheet, habit grid, Empty Template, empty states, month recalculation, right-click menus).
5. **Exact color sampling** — sampled real pixels (max-saturation search per region) for true HEX values; a coordinate-grid overlay fixed element positions.

Everything in §7 (colors) and the measurements in §18–§21 are **video-measured**, not estimated, except where explicitly marked *(est.)*. Frames analysed: 403 storyboard + ~11 detail crops. The only excluded footage is a **YouTube ad overlay** (Parul University) that appears ~366–393 s over the outro — not part of the product.

---

## 1. Overall Design Philosophy

- **Spreadsheet-native single-page dashboard.** Everything is one vertically-scrolling Google Sheet: a summary/analytics zone on top, a dense habit grid below. No routing, no modals, no chrome of its own beyond Google Sheets.
- **Four literal numbered steps** drive the whole UX (STEP 1→4), rendered as blue ⭐ banners. The tool teaches itself.
- **Flat, high-contrast, "friendly productivity."** Saturated green = identity/success; cornflower blue = instructions; magenta-purple = progress bars; red = shortfall; orange = the one "important tip." No gradients, no shadows, square corners.
- **Numbers as heroes** — the two largest elements are the live counters (Completed / Uncompleted).
- **Everything recomputes instantly and together.** Ticking one checkbox updates counters, per-habit bar, tasks fraction, all three charts, and the donut in the same frame.
- **Zero-config calendar.** Choosing Year + Month rebuilds the weekday grid, day count, and every formula automatically.

---

## 2. Dashboard Layout Breakdown (Example sheet, measured)

Positions given as fractions of the 1920×1088 capture (Google Sheets chrome = top ~0–150 px, not part of the product). The sheet content:

| Region | Cells | Approx. capture px (x, y) |
|---|---|---|
| App title block "SMART HABIT TRACKER" + author | A1:B3 | x 30–475, y 168–225 |
| STEP 1 blue banner | A4:B4 | x 30–475, y 240–268 |
| YEAR row (label + value) | A5 / B5 | y 275–295 |
| MONTH row (label + dropdown value) | A6 / B6 | y 298–318 |
| Month title plate ("DECEMBER 2024") | ~D1:? merged | x 555–1410, y 183–315 |
| "Today's Date:" card (green header + date) | far right | x 1518–1810, y 188–315 |
| KPI "Total Habits Completed" + big number | A8 / A9–11 | label y ~342, number y 375–425 |
| KPI "Total Habits Uncompleted" + big number | A12 / A13–17 | label y ~460, number y 490–540 |
| Chart 1 "Habits Completed / Day" | center-left | plot x 330–850, y 380–535 |
| Chart 2 "Habits Completed in Month" | center-right | plot x 900–1490, y 380–535 |
| Chart 3 "Monthly Progress" donut | far right | center ≈ (1662, 452), Ø≈180 |
| STEP 2 / 3 / 4 blue banners | row 19 | y 578–618 |
| Grid header (S/N, HABITS, WEEK 1–5, TASKS, TOTAL) | rows 20–22 | y 625–700 |
| Habit rows | rows 23–32 | ~40 px each from y 700 |
| Sheet tabs (Instructions / Example / Empty Template) | bottom | y ~1063 |

Vertical split: summary+charts occupy the top ~half (rows 1–18); the habit grid the bottom ~half (rows 19–32).

---

## 3. Complete Screen Inventory (all three now directly observed)

| Screen | Tab | Observed at | Summary |
|---|---|---|---|
| **S1 — Instructions** | `1. Instructions` | 205–244 s | Help page (see §3.1). Previously unseen; now fully read. |
| **S2 — Example** | `2. Example` | 0–205 s, 244–248 s | The populated demo dashboard (December 2024, 7 habits, 153/64). |
| **S3 — Empty Template** | `3. Empty Template` | 248–386 s | Blank starter (January 2025, 9 rows, 0/279). |

### 3.1 Instructions sheet (S1) — exact content
- **Light-blue header band** (row 1): **"How to use this Smart Habit Tracker:"** (bold, Roboto 12).
- "1. Enter your Year and Month in Cells **B5 & B6**."
- "2. Enter your habits in Cells **B23-B32**. You can have up to **10 habits**!"
- "3. Check off your habits by ticking the boxes. **Do this daily!**"
- "4. View all your progress through the progress bars and graphs!"
- **Orange band** (row 7): **"*IMPORTANT TIP*"**, then: *'Highlight multiple checkboxes and press "Spacebar" to check them all at the same time!'*
- Below: a small block of demo checkboxes; a **"Video Tutorial (Highly Recommend to Watch)"** section; and a **contact** line — *"If you have any questions about this template, kindly contact me at: championchallander@gmail.com"* (also offers custom templates / general Google Sheets help).

### 3.2 Example sheet (S2)
December 2024, 7 habits (Go to the gym; Read 1 chapter of Rich Dad Poor Dad; Catch up with 1 friend; Do 2 hours of deep work; Vacuum my room; Create 1 tiktok video; Drink 8 litres of water). Completed **153**, Uncompleted **64**, donut **153 / 217** (= 7 × 31). Fully described throughout this doc.

### 3.3 Empty Template sheet (S3)
January 2025. **9 active rows** (S/N 1–9 carry checkboxes → 9 × 31 = **279**). Rows 1–8 show placeholder **"<Enter Habit N>"**; row 9 holds a hint **"Try entering a 10th habit below! Checkboxes will automatically show up! ↓↓↓"**; **row 10's checkboxes appear only after a name is typed** (→ 10 × 31 = 310). Zero-state visuals in §12/§17.

---

## 4. Component Inventory (with observed states)

- **App title block** — green fill, two lines (title bold ~24 px caps + author subtitle ~10 px).
- **Step banner** — blue `#4684ED`, ⭐ prefix, white bold caps. Full-width (STEP 1) and column-spanning thirds (STEP 2 over S/N+HABITS, STEP 3 over the week grid, STEP 4 over TASKS+TOTAL).
- **Labeled input row** — `YEAR` (B5, typed) and `MONTH` (B6, **dropdown** with chevron).
- **Month title plate** — thin-bordered rectangle, large black caps ("DECEMBER 2024").
- **Today's Date card** — green header strip + white body; auto-updates (showed "December 25, 2024").
- **KPI stat** — colored label (green / red) + very large black number. Two instances.
- **Line/area chart** ×2; **donut** ×1 (states: partial green+red; full green at max; full red at zero).
- **Grid header cells** — green `#3BBA56`: S/N, HABITS, WEEK 1–5, TASKS COMPLETED, TOTAL.
- **Weekday+date sub-header** — dynamic (see §10); today's column styled white-italic-underline.
- **Habit row** — S/N (bold) + habit name (regular, or grey placeholder) + 35 day-cells + tasks fraction + total.
- **Day checkbox** — states: checked (mint cell `#B6E6CB` + dark-green check `#33734C`), unchecked-past (white cell, grey empty box), future (white cell, empty box), inactive (no checkbox — 10th row until named; out-of-month days).
- **Per-habit progress bar** — purple `#7A007C`, left-anchored, width ∝ %, with % label; **turns green at 100 %**.
- **Sheet tab** — active tab underlined purple (`2. Example`).

---

## 5. Navigation Structure

- **Only navigation = the three bottom sheet tabs**, numbered 1→2→3; active tab underlined purple. No header nav, sidebar, breadcrumbs, or in-page menus.
- Within a screen: **vertical scroll** for rows; **horizontal scroll** to reach later weeks / TOTAL on narrow viewports.
- "Creating a new month" is done via Google Sheets itself: **right-click a tab → Duplicate → rename** (e.g. "2025 February") — observed 254–264 s.
- Cleanup is via Google Sheets: **right-click row/column → Hide**, and the collapse **arrows** to unhide — observed 276–296 s.

> A real app must design its own navigation/auth; the reference has none beyond sheet tabs.

---

## 6. Typography Analysis (observed)

- **Font: Roboto** throughout (toolbar-confirmed). Grid data size **10**; Instructions text size **12**.
- **Hierarchy (largest→smallest):** ① KPI numbers ("153"/"64") — very large bold black; ② Month plate ("DECEMBER 2024") — large bold black caps; ③ App title — large bold black caps, on green; ④ "TOTAL" / section labels / chart titles — bold, colored/black; ⑤ table headers ("HABITS", "WEEK n", "TASKS COMPLETED") — bold caps; ⑥ step banners — bold white caps; ⑦ body (habit names, dates, "25 / 31", "81%") — regular 10.
- **Casing:** headings/banners UPPERCASE; habit names sentence case; placeholders `<Enter Habit N>` in angle brackets, grey.
- **Color-as-type:** green = section/positive, red = negative, black = data, white = on-color headers, grey = placeholder/disabled.
- **Alignment:** habit names left; S/N, dates, tasks-fraction, % centered/right; month title centered.

---

## 7. Color Palette (video-sampled HEX — authoritative)

| Role | HEX | Source |
|---|---|---|
| **Primary green** (title block, all grid headers, Today strip) | `#3BBA56` | sampled |
| Section-label / chart-title green | `#3DB45B` | sampled |
| Chart line + point markers | `#33C059` | sampled |
| Donut "completed" green | `#30C056` | sampled |
| Chart area fill (light green) | `#B9DEBE` | sampled |
| Checked-cell wash (mint) | `#B6E6CB` | sampled |
| Checkbox checkmark (dark green) | `#33734C` | sampled |
| Alt-row fill (light green) | `#EDF7E2` | sampled |
| Row fill (white) | `#FDFDFD` (≈`#FFFFFF`) | sampled |
| **Step-banner blue** | `#4684ED` | sampled |
| **Progress-bar purple** | `#7A007C` | sampled |
| **Alert red** (donut remainder, "Uncompleted", zero-donut) | `#E62F36` (label `#D12935`) | sampled |
| Instructions "IMPORTANT TIP" band — **orange** | ~`#E8710A` *(est.)* | observed |
| Instructions header band — **light blue** | ~`#C9DAF8` *(est.)* | observed |
| Void / frozen area grey | `#656565` | sampled |
| Disabled / out-of-month grey | ~`#D9D9D9`–`#CCCCCC` *(est.)* | observed |
| Primary text (black) | `~#0C0C0C` | sampled |
| Page / cell background | `#FDFDFD`–`#FFFFFF` | sampled |

**Semantics:** green = identity/success/progress · blue = instruction · purple = quantitative bar · red = shortfall/empty · orange = single highlighted tip · grey = inactive.

---

## 8. Icon Inventory

- **⭐ Gold star** — prefixes every STEP banner (and appears on the Instructions steps).
- **☑ / ☐ checkbox glyphs** — the primary interactive element across the grid.
- **🙂 ":)"** — text emoticon in "STEP 4 … VIEW YOUR PROGRESS! :)".
- **↓↓↓ arrows** — in the Empty Template's "add a 10th habit" hint.
- **▶ / dropdown chevron** — on the MONTH cell and in empty-chart axes.
- Donut ring acts as an icon-like progress indicator.
- No custom line-icon set; no per-habit icons.

---

## 9. Charts Inventory (all observed live)

| Chart | Type | Axes | Behaviour observed |
|---|---|---|---|
| **Habits Completed / Day** | smoothed area+line, green | Y 0–100 % (0/25/50/75/100); X 1–~30 | % of that day's habits done. Rises as you tick a day toward 100 %; day-25 dropped to 0 % when unchecked, climbed back as boxes were re-ticked. |
| **Habits Completed in Month** | cumulative area+line, green, **per-point data labels** | Y auto (0–200 populated; **0.00–1.00 when empty**); X 0–30 | Running total across the month; labels 2,5,9,…,153. Auto-rescales; near-flat/empty in zero-state. |
| **Monthly Progress** | donut, green+red, center fraction | — | completed / total. **All green at max (217/0)**, **all red at zero (0/279)**, split otherwise (153/217). |

**Verified logic:** total possible = `activeHabits × daysInMonth` (7×31=217; 9×31=279; 10×31=310; Feb 9×28=252). Completed = Σ checked; Uncompleted = total − completed. All charts, counters, bars and the donut read the same checkbox data and update in one frame.

---

## 10. Table Structure (measured)

Left→right columns: **S/N** (~80 px) · **HABITS** (~430 px, B23:B32) · **35 day-cells** grouped WEEK 1–5 (7 each, ~27–33 px each) · **TASKS COMPLETED** ("X / N", ~150 px) · **TOTAL** (purple bar + %, ~260 px).

**Header:** row 20 = group labels (S/N, HABITS, WEEK 1–5, TASKS COMPLETED, TOTAL); row 21 = weekday abbreviations; row 22 = date numbers.

**Dynamic calendar (confirmed across months):**
- Weekday header **re-aligns to the 1st-of-month weekday**: Dec 2024 → Week 1 = **SUN**…SAT (1–7); Jan 2025 → **WED**…TUE; the video also cycled Feb/Mar/Apr/May/Jun 2025, each realigning.
- **Days-in-month recomputes** the "X / N" denominator and total: Feb → 28 (9×28 = 252), Apr/Jun → 30, Jan/May → 31. Cells for non-existent days are hidden/greyed.
- **Today's column** (matching "Today's Date") is highlighted (white-italic-underline weekday+date, e.g. WED 25).

**Cell states:** checked = mint wash + dark-green check; unchecked-past = white + empty box; future = white + empty box; inactive = no checkbox. Rows alternate white / `#EDF7E2`.

---

## 11. Card Layouts

- **Today's Date card** — clearest card: green header strip + white body, thin border, no shadow.
- **Month title plate** — large thin-bordered rectangle, centered caps.
- **Chart panels** — colored title above, plot below; borderless "cards".
- **KPI stats** — not boxed; label-over-number in open space.
Common recipe: thin rectangular border, white body, optional green header strip, square corners, **no shadow**.

---

## 12. Progress Components

- **KPI counters** — Completed (green label) / Uncompleted (red label); update every tick (e.g. 153→154→157→…→217).
- **Per-habit bar (TOTAL)** — purple, left-anchored, width ∝ %, with % label; **conditional colour → green at 100 %** (observed at ~118 s and in the all-green 217/0 state).
- **Tasks fraction** — "X / N" per habit.
- **Donut** — overall ring; green at max, **solid red at zero** (Empty Template 0/279), split otherwise.
- **Two line charts** — time-based progress views.
All derive from the same checkbox data; all recompute together.

---

## 13. Checkbox Behaviour (core interaction)

- Each day-cell is a boolean checkbox (`TRUE`/`FALSE`; formula bar showed `AD31 = FALSE`).
- **Single click** → toggles; the cell fills mint + shows a dark-green check; **counters, that habit's bar+fraction, both line charts and the donut all update in the same frame** (observed 74–80 s).
- **Multi-toggle (the "IMPORTANT TIP"):** **click-drag to select a range, then press Spacebar** to check/uncheck them all at once (observed 84–94 s and stated on the Instructions sheet).
- **States:** checked (mint + dark-green check) · unchecked (white + grey empty box) · future days (empty box, white bg) · **inactive** (no checkbox — the 10th row until named, and out-of-month days).
- Adding/removing a habit **auto-adds/removes** its whole row of checkboxes (counter jumped 64→95 when "go for a run" was added, back to 64 on delete).

---

## 14. Dropdown Behaviour

- **MONTH (B6)** is a validation **dropdown** (12 months). Selecting a month rebuilds the month title, weekday alignment, day count/denominator, chart X-ranges, and totals — observed cycling December→February→…→June.
- **YEAR (B5)** is a typed value (e.g. 2024 / 2025) combined with MONTH to compute the calendar and first-day weekday.
- No other dropdowns in the product (beyond Google Sheets' own right-click/context menus used for Duplicate/Hide).

---

## 15. Hover States

- **None authored by the product.** Only Google Sheets' native cursor/cell-highlight exist; the clicked cell shows the standard blue selection outline.
- Button/checkbox/tab/row hover states for a web app are therefore **undefined by the reference** and must be designed (PRD requires hover/press states).

---

## 16. Click / Interaction Behaviour (observed)

- **Tick a checkbox** → toggle + full recompute.
- **Click-drag + Spacebar** → bulk toggle.
- **Type into a HABITS cell** → defines a habit; its checkboxes appear; totals update. **Backspace/clear** → removes the habit and its checkboxes.
- **Open MONTH dropdown / edit YEAR** → recalculates the whole calendar.
- **Click a sheet tab** → switch screen.
- **Right-click a tab → Duplicate → rename** → create a new month sheet.
- **Right-click row/column → Hide** (and arrows to unhide) → declutter the template.
- There is **no dedicated add/edit/delete button** — CRUD is implicit via cell typing.

---

## 17. Animation Inventory

- **Intrinsically none.** The only motion is **instant state changes**: checkbox flip, counter/donut/number updates, per-habit bar length change, and **chart re-draw/re-scale** on data change. No easing, transitions, celebrations, or streak animations exist in the source.
- **Empty-state** (Empty Template, nothing checked): daily-% chart flat at 0 %, cumulative chart collapsed to a 0.00–1.00 axis, donut solid red — i.e. the "zero" visual.

> ⚠️ **PRD tension:** A7 requires micro-interactions, transitions, and streak celebrations that **do not exist** in the reference. These must be designed net-new, layered onto the flat aesthetic without altering the core. ("Streaks" also has **no visual** in the reference — only "X / N" and %.)

---

## 18. Spacing Analysis

- **Grid-metric spacing** (spreadsheet row heights / column widths), not free padding. Day-cells are compact ~27–33 px squares; HABITS ~430 px; S/N ~80 px; habit rows ~40 px tall; header rows ~25–35 px.
- **Regional separation** via full-width colored banner rows (STEP bars act as section dividers with generous height).
- **Top zone airier** (title, KPIs, charts have whitespace); **grid denser**.
- Consistent thin gutters between week-groups and before TASKS/TOTAL.
- Absolute CSS spacing is not dictated by a spreadsheet; the px above are **capture-space** guides to preserve the visual rhythm.

---

## 19. Grid System

- Underlying grid = spreadsheet columns A…~AN. Logical row structure: rows 1–18 header/summary; row 19 step banners; rows 20–22 grid header; rows 23–32 habit rows (max 10).
- Horizontal logical grid: `[S/N][HABITS][5×(7 day-cells)][TASKS][TOTAL]`.
- Top zone is a looser three-block layout: left (title, Step 1, KPIs) · center (month plate + 2 charts) · right (Today card + donut).
- Maps naturally to a 12-col responsive top + a data-grid for the matrix — but that mapping is our decision, not the reference's.

---

## 20. Border Radius Analysis

- **Square (0) throughout** — cells, banners, plate, cards, bars are sharp-cornered.
- **Exceptions:** checkboxes ~2 px; donut is circular.
- The reference is a square-cornered design; any rounding in the app is a new (keep-subtle) decision.

---

## 21. Shadow Analysis

- **Flat — no shadows anywhere.** Separation is by fills + thin borders only. Default the app to flat; any elevation for hover/press/celebration is a new, restrained addition.

---

## 22. Responsive Behaviour

- **No responsive design exists.** On mobile (YouTube Shorts) it is the same sheet **panned/zoomed** — content does not reflow or stack; off-screen columns are reached by horizontal scroll.
- Genuine responsive rules (stacking KPIs/charts, a scrollable/collapsible habit matrix, touch-friendly checkboxes) are **entirely ours to design** to meet the PRD's desktop+mobile requirement.

---

## 23. Reusable Components (rebuild candidates)

`StepBanner` (blue, ⭐, full/thirds) · `StatCounter` (label+big number; green/red) · `TitlePlate` · `DateCard` (auto-updating) · `ChartPanel` (line/area ×2) · `DonutProgress` (green/red/full states) · `GridHeader` + `WeekdayHeader` (dynamic) · `HabitRow` · `DayCheckbox` (checked/unchecked/future/inactive) · `ProgressBar` (purple→green-at-100%, with %) · `SheetTab` (active/inactive) · `PlaceholderHabit` (`<Enter Habit N>`).

---

## 24. Missing Information (much reduced after video pass)

Still not fully determinable:
- **M1 — Exact CSS pixel metrics / fonts weights.** Roboto + sizes 10/12 confirmed, but precise weights, letter-spacing, and true px require the original sheet.
- **M2 — Orange/light-blue exact HEX** (Instructions bands) — observed, estimated (`#E8710A`, `#C9DAF8`), not pixel-locked.
- **M3 — Hover/focus/pressed states** — none exist in source (§15).
- **M4 — Animations / streak celebrations** — absent in source but PRD-required (§17).
- **M5 — "Streak" representation** — the reference tracks "X / N" and % only; no streak metric or visual.
- **M6 — Explicit CRUD UI** — implicit via typing; no buttons.
- **M7 — Responsive rules** — none (§22).
- **M8 — Exact conditional-format rules** (which cell backgrounds tint, and thresholds) — inferred from visuals.
- **M9 — Max habits hard-limit enforcement** beyond the stated "up to 10" (B23:B32).
- **Housekeeping:** the `references/` folders are still empty on disk — recommend saving the source video and extracted key frames into `references/videos/` and `references/screenshots/` so the source of truth is versioned with `docs/`.

*(Previously-missing items — Instructions sheet content, Empty Template appearance, empty/zero states, dropdown/month behaviour, add/delete/duplicate/hide workflows — are now RESOLVED above.)*

---

## 25. Assumptions (only where still not visible)

- **A1** — Orange/light-blue band HEX are close estimates pending confirmation.
- **A2** — Cell-tint conditional formatting keys off checkbox TRUE (checked → mint wash); precise rule to confirm.
- **A3** — YEAR is free-typed; MONTH is a fixed 12-item dropdown (as observed).
- **A4** — "Up to 10 habits" is enforced by the B23:B32 range; the 10th activates on entry.
- **A5** — Flat design: square corners (except ~2 px checkboxes + circular donut), no shadows.
- **A6** — Web responsiveness and all hover/animation behaviour are ours to design faithfully.

---

## 26. Must NOT Be Redesigned (Design Source of Truth — Preserve)

1. **One-page dashboard composition** — summary/analytics on top, habit grid below.
2. **The four numbered steps** — STEP 1 (Year & Month) → 2 (Enter habits, up to 10) → 3 (Check off) → 4 (View progress), as ⭐ blue banners.
3. **Color semantics & exact palette** in §7 — green identity/success, blue instruction, **purple** bars, **red** shortfall/empty, orange the single tip.
4. **Two hero KPI counters** — Completed (green) / Uncompleted (red), oversized.
5. **Three charts** — Habits Completed/Day (%), Habits Completed in Month (cumulative), Monthly Progress (donut: full-green at max, full-red at zero).
6. **Habit matrix** — S/N · habit name (B23:B32) · **5 weeks × 7 day-checkboxes** · Tasks Completed (X/N) · Total (bar + %).
7. **Dynamic weekday/date header** re-aligning to the month, with today's column highlighted and out-of-month cells hidden.
8. **Checkbox as primary interaction**, with instant recompute of every dependent metric; **click-drag + Spacebar** bulk toggle.
9. **Conditional per-habit bar** (purple → green at 100 %) + %.
10. **Month title plate** and **auto-updating "Today's Date" card**.
11. **Flat visual language** — square corners, no shadows, thin borders, Roboto, bold uppercase headings.
12. **Three-screen model** — Instructions / Example / Empty Template, incl. the Empty Template's `<Enter Habit N>` placeholders, 9 active rows, and the "add a 10th" behaviour.
13. **Brand identity** — "Smart Habit Tracker" green title lockup (subject only to the founder's later theme change at PRD Gate 3; preserved until then).

> Everything in §24/§25 (hover, animation, responsive, streaks, CRUD UI) is **additive** — design it to layer onto the above without altering this core.

---

## Appendix A — Frame-by-Frame Walkthrough Timeline (from the video)

| Time | Screen / action | Narration (captured) |
|---|---|---|
| 0–24 s | **Example** intro; overview of graphs, checkboxes, habit list | "…in today's video I'll show you how I use my smart habit tracker … multiple graphs … a bunch of checkboxes … a list of habits … just four simple steps." |
| 24–42 s | **STEP 1**: edit YEAR (2024); open **MONTH dropdown** → December | "Step one is to enter the year and month … I'll put 2024 … select the month … December." |
| 42–60 s | **STEP 2**: "up to 10 habits"; type "go for a run" (Uncompleted 64→**95**); **Backspace** to delete (→64) | "Enter your daily habits … up to 10 … add a new habit … it'll automatically show the checkboxes … I'm going to delete that by pressing backspace." |
| 60–95 s | **STEP 3**: tick boxes; **today = Dec 25 auto-highlighted**; checkbox turns green + updates bars/graphs; **click-drag + Spacebar** bulk-check (153→157) | "Check off completed habits … today, December 25, is automatically highlighted grey … when I click it, it turns green … pro tip: highlight multiple and press spacebar." |
| 95–205 s | **STEP 4**: explains Tasks Completed, per-habit bar (**green at 100 %**), live counters, the two line charts, the donut; checks all → **217/0 all green**, then undoes | "View your progress … progress bars … turn green … total habits completed/uncompleted update … habits completed per day … cumulative graph … monthly progress … fully green." |
| 205–244 s | **Instructions** sheet | "First off we have an instructions sheet … important tip: highlight multiple and spacebar … contact me at championchallander@gmail.com." |
| 244–248 s | Back to **Example** recap | "The example sheet we just went through …" |
| 248–300 s | **Empty Template** (Jan 2025, 0/279); **Duplicate tab → rename** ("2025 February"); **Hide/unhide rows** via right-click/arrows; add 10th habit (→310) then delete | "Lastly the empty template … right-click, duplicate, rename … you can hide rows to declutter … enter new habits and checkboxes show up; delete and they're removed." |
| 300–340 s | **Zero-state** (empty charts); **Month dropdown** cycles Feb(28→252)/Mar/Apr(30)/May/Jun; **Today's Date auto-updates** | "No checkboxes → graphs look empty … change the month and it auto-updates the days … today's date updates automatically." |
| 340–386 s | **Outro** — reset to Jan 2025 0/279; face-cam PiP; template link + 5-star ask | "Get this template in the description … give it a 5-star rating … leave a comment." |
| 366–393 s | *(YouTube ad overlay — Parul University — not part of the product; ignored)* | — |

---

*End of frame-by-frame Reference Analysis. The walkthrough video is the design source of truth. Awaiting founder approval before any build phase (A1) begins.*

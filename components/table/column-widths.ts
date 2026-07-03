/**
 * Shared column-width classes for the habit grid (Master-Design-Spec §5/§13).
 * Centralised so the step-banner row, grid header, and every habit row stay
 * pixel-aligned — they compose these instead of hand-typing widths.
 */
export const COLUMN_WIDTHS = {
  serial: "w-16 shrink-0",
  habits: "min-w-80 flex-1",
  days: "w-280 shrink-0",
  tasks: "w-24 shrink-0",
  total: "w-55 shrink-0",
  /** serial + habits combined (64 + 320 = 384px) — for the STEP 2 banner span. */
  serialPlusHabits: "min-w-96 flex-1",
  /** tasks + total combined (96 + 220 = 316px) — for the STEP 4 banner span. */
  tasksPlusTotal: "w-79 shrink-0",
} as const;

export const DAY_SLOT_WIDTH = "w-8 shrink-0";
export const TOTAL_DAY_SLOTS = 35;

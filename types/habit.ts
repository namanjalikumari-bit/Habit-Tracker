/**
 * Core data model (Architecture §6). Framework-agnostic: no React/Next
 * imports. `days` is a fixed 31-length boolean array; the active count for
 * any month is derived from the calendar, not the array length — matching
 * the reference, where changing the month re-aligns the same checkbox data.
 */

export const MAX_HABITS = 10;
export const DAYS_PER_ROW = 31;

export interface Habit {
  id: string;
  name: string;
  /** length === DAYS_PER_ROW; index 0 = day 1 */
  days: boolean[];
}

export interface HabitMonth {
  year: number;
  /** 1–12 */
  month: number;
  /** active habit rows, 0..MAX_HABITS (empty name → placeholder row) */
  habits: Habit[];
}

export type SheetId = "example" | "empty-template";

export interface Today {
  year: number;
  /** 1–12 */
  month: number;
  day: number;
}

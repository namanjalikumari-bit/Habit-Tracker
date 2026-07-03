/**
 * Defensive normalisation of habit data coming from any repository
 * (localStorage or Supabase) back into the exact model shape the UI expects.
 * Guards against malformed persisted data (wrong day-array length, missing
 * sheets, out-of-range values) so the dashboard never renders garbage.
 */
import { clampYear, isValidMonth } from "@/domain/validation";
import { newId } from "@/lib/id";
import {
  DAYS_PER_ROW,
  MAX_HABITS,
  SHEET_IDS,
  type HabitMonth,
  type SheetId,
} from "@/types/habit";

import { makeSeedSheets } from "./seed";

function withDaysLength(days: unknown): boolean[] {
  const source = Array.isArray(days) ? days : [];
  const next = new Array(DAYS_PER_ROW).fill(false);
  for (let i = 0; i < Math.min(source.length, DAYS_PER_ROW); i++) {
    next[i] = Boolean(source[i]);
  }
  return next;
}

export function normalizeSheets(
  sheets: Partial<Record<SheetId, HabitMonth>> | undefined | null,
): Record<SheetId, HabitMonth> {
  const seed = makeSeedSheets();
  const result = {} as Record<SheetId, HabitMonth>;

  for (const id of SHEET_IDS) {
    const stored = sheets?.[id];
    if (
      stored &&
      typeof stored.year === "number" &&
      isValidMonth(stored.month) &&
      Array.isArray(stored.habits)
    ) {
      result[id] = {
        year: clampYear(stored.year),
        month: stored.month,
        habits: stored.habits.slice(0, MAX_HABITS).map((h) => ({
          id: typeof h?.id === "string" ? h.id : newId(),
          name: typeof h?.name === "string" ? h.name : "",
          days: withDaysLength(h?.days),
        })),
      };
    } else {
      result[id] = seed[id];
    }
  }

  return result;
}

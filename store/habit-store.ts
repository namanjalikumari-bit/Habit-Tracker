/**
 * Zustand store (Architecture §6). Holds both sheets, exposes actions that
 * mutate immutably (so React.memo'd rows skip re-render), and persists
 * through the HabitRepository seam — never touching localStorage directly.
 *
 * Initial state is the deterministic seed, so SSR and the first client
 * render match; `hydrateFromStorage()` runs on mount to pull any saved
 * data. Persistence is debounced and gated on `hydrated` so the seed can
 * never overwrite real saved data before it loads.
 */
import { create } from "zustand";

import { habitRepository } from "@/data/local-storage-repository";
import { PERSIST_VERSION } from "@/data/habit-repository";
import { makeSeedSheets, SEED_TODAY } from "@/data/seed";
import { clampYear, isValidMonth } from "@/domain/validation";
import {
  DAYS_PER_ROW,
  MAX_HABITS,
  type Habit,
  type HabitMonth,
  type SheetId,
  type Today,
} from "@/types/habit";

interface HabitStore {
  sheets: Record<SheetId, HabitMonth>;
  today: Today;
  hydrated: boolean;

  setYear(sheet: SheetId, year: number): void;
  setMonth(sheet: SheetId, month: number): void;
  toggleDay(sheet: SheetId, habitId: string, dayIndex: number): void;
  paintDay(
    sheet: SheetId,
    habitId: string,
    dayIndex: number,
    value: boolean,
  ): void;
  renameHabit(sheet: SheetId, habitId: string, name: string): void;
  addHabit(sheet: SheetId, name: string): void;
  removeHabit(sheet: SheetId, habitId: string): void;
  resetSheet(sheet: SheetId): void;
  hydrateFromStorage(): void;
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `h-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function withDaysLength(days: boolean[]): boolean[] {
  if (days.length === DAYS_PER_ROW) return days;
  const next = new Array(DAYS_PER_ROW).fill(false);
  for (let i = 0; i < Math.min(days.length, DAYS_PER_ROW); i++) {
    next[i] = Boolean(days[i]);
  }
  return next;
}

/** Best-effort normalisation of persisted data back into the model shape. */
function normalizeSheets(
  sheets: Record<SheetId, HabitMonth>,
): Record<SheetId, HabitMonth> {
  const seed = makeSeedSheets();
  const ids: SheetId[] = ["example", "empty-template"];
  const result = {} as Record<SheetId, HabitMonth>;
  for (const id of ids) {
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
          id: typeof h.id === "string" ? h.id : newId(),
          name: typeof h.name === "string" ? h.name : "",
          days: withDaysLength(Array.isArray(h.days) ? h.days : []),
        })),
      };
    } else {
      result[id] = seed[id];
    }
  }
  return result;
}

export const useHabitStore = create<HabitStore>((set, get) => {
  let saveTimer: ReturnType<typeof setTimeout> | null = null;
  const schedulePersist = () => {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      const state = get();
      if (state.hydrated) {
        habitRepository.save({
          version: PERSIST_VERSION,
          sheets: state.sheets,
        });
      }
    }, 200);
  };

  const mutateSheet = (
    sheet: SheetId,
    fn: (month: HabitMonth) => HabitMonth,
  ) => {
    set((state) => ({
      sheets: { ...state.sheets, [sheet]: fn(state.sheets[sheet]) },
    }));
    schedulePersist();
  };

  const mapHabit = (
    month: HabitMonth,
    habitId: string,
    fn: (habit: Habit) => Habit,
  ): HabitMonth => ({
    ...month,
    habits: month.habits.map((h) => (h.id === habitId ? fn(h) : h)),
  });

  return {
    sheets: makeSeedSheets(),
    today: SEED_TODAY,
    hydrated: false,

    setYear: (sheet, year) =>
      mutateSheet(sheet, (m) => ({ ...m, year: clampYear(year) })),

    setMonth: (sheet, month) =>
      mutateSheet(sheet, (m) =>
        isValidMonth(month) ? { ...m, month } : m,
      ),

    toggleDay: (sheet, habitId, dayIndex) =>
      mutateSheet(sheet, (m) =>
        mapHabit(m, habitId, (h) => {
          const days = [...h.days];
          days[dayIndex] = !days[dayIndex];
          return { ...h, days };
        }),
      ),

    paintDay: (sheet, habitId, dayIndex, value) =>
      mutateSheet(sheet, (m) =>
        mapHabit(m, habitId, (h) => {
          if (h.days[dayIndex] === value) return h;
          const days = [...h.days];
          days[dayIndex] = value;
          return { ...h, days };
        }),
      ),

    renameHabit: (sheet, habitId, name) =>
      mutateSheet(sheet, (m) => mapHabit(m, habitId, (h) => ({ ...h, name }))),

    addHabit: (sheet, name) =>
      mutateSheet(sheet, (m) =>
        m.habits.length >= MAX_HABITS
          ? m
          : {
              ...m,
              habits: [
                ...m.habits,
                { id: newId(), name, days: new Array(DAYS_PER_ROW).fill(false) },
              ],
            },
      ),

    removeHabit: (sheet, habitId) =>
      mutateSheet(sheet, (m) => ({
        ...m,
        habits: m.habits.filter((h) => h.id !== habitId),
      })),

    resetSheet: (sheet) => {
      const seed = makeSeedSheets();
      mutateSheet(sheet, () => seed[sheet]);
    },

    hydrateFromStorage: () => {
      if (get().hydrated) return;
      const stored = habitRepository.load();
      if (stored) {
        set({ sheets: normalizeSheets(stored.sheets), hydrated: true });
      } else {
        set({ hydrated: true });
      }
    },
  };
});

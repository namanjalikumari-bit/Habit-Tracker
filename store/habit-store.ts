/**
 * Zustand store (Architecture §6). Holds both sheets, exposes actions that
 * mutate immutably (so React.memo'd rows skip re-render), and persists
 * through the HabitRepository seam — never touching a concrete backend.
 *
 * A6 optimistic sync model:
 *  - Every action mutates local state INSTANTLY (the UI updates immediately).
 *  - Persistence is debounced and runs in the background through the active
 *    repository (localStorage when not signed in / not configured; Supabase
 *    when signed in — swapped via `setActiveRepository`).
 *  - `syncStatus` / `syncError` surface a tiny status; a failed save keeps the
 *    app fully usable and can be retried.
 *
 * Initial state is the deterministic seed, so SSR and the first client render
 * match. The auth-aware sync controller (lib/sync/sync-controller.ts) chooses
 * the repository and hydrates the store after login.
 */
import { create } from "zustand";

import { PERSIST_VERSION, type HabitRepository } from "@/data/habit-repository";
import { localHabitRepository } from "@/data/local-storage-repository";
import { normalizeSheets } from "@/data/normalize";
import { makeSeedSheets, SEED_TODAY } from "@/data/seed";
import { clampYear, isValidMonth } from "@/domain/validation";
import { newId } from "@/lib/id";
import { friendlySyncError } from "@/lib/sync/messages";
import {
  DAYS_PER_ROW,
  MAX_HABITS,
  type Habit,
  type HabitMonth,
  type SheetId,
  type Today,
} from "@/types/habit";

export type SyncStatus = "idle" | "saving" | "error";

interface HabitStore {
  sheets: Record<SheetId, HabitMonth>;
  today: Today;
  /** True once the store has been hydrated from the active repository. */
  hydrated: boolean;
  /** Active persistence backend (local by default; Supabase after login). */
  repository: HabitRepository;
  syncStatus: SyncStatus;
  syncError: string | null;

  // Dashboard actions (unchanged signatures — the UI is untouched).
  setYear(sheet: SheetId, year: number): void;
  setMonth(sheet: SheetId, month: number): void;
  toggleDay(sheet: SheetId, habitId: string, dayIndex: number): void;
  paintDay(sheet: SheetId, habitId: string, dayIndex: number, value: boolean): void;
  renameHabit(sheet: SheetId, habitId: string, name: string): void;
  addHabit(sheet: SheetId, name: string): void;
  removeHabit(sheet: SheetId, habitId: string): void;
  resetSheet(sheet: SheetId): void;

  // Sync lifecycle (driven by the sync controller).
  setActiveRepository(repository: HabitRepository): void;
  beginHydration(): void;
  applyHydratedState(sheets: Record<SheetId, HabitMonth>): void;
  setSyncError(message: string): void;
  clearSyncError(): void;
  retrySync(): void;
}

export const useHabitStore = create<HabitStore>((set, get) => {
  let saveTimer: ReturnType<typeof setTimeout> | null = null;
  // Serialize saves: a whole-state save is not safe to run concurrently
  // (it deletes+reinserts rows). Only one runs at a time; if a change lands
  // mid-save, we run exactly one more save afterwards with the latest state.
  let saveInFlight = false;
  let saveQueued = false;

  const persistNow = async () => {
    if (!get().hydrated) return;
    if (saveInFlight) {
      saveQueued = true;
      return;
    }
    saveInFlight = true;
    set({ syncStatus: "saving", syncError: null });
    try {
      await get().repository.save({
        version: PERSIST_VERSION,
        sheets: get().sheets, // always persist the latest state
      });
      if (get().syncStatus === "saving") set({ syncStatus: "idle" });
    } catch (error) {
      set({ syncStatus: "error", syncError: friendlySyncError(error) });
    } finally {
      saveInFlight = false;
      if (saveQueued) {
        saveQueued = false;
        void persistNow();
      }
    }
  };

  const schedulePersist = () => {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => void persistNow(), 300);
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
    repository: localHabitRepository,
    syncStatus: "idle",
    syncError: null,

    setYear: (sheet, year) =>
      mutateSheet(sheet, (m) => ({ ...m, year: clampYear(year) })),

    setMonth: (sheet, month) =>
      mutateSheet(sheet, (m) => (isValidMonth(month) ? { ...m, month } : m)),

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

    setActiveRepository: (repository) => set({ repository }),

    beginHydration: () =>
      set({ hydrated: false, syncStatus: "idle", syncError: null }),

    applyHydratedState: (sheets) =>
      set({ sheets: normalizeSheets(sheets), hydrated: true }),

    setSyncError: (message) => set({ syncStatus: "error", syncError: message }),

    clearSyncError: () => set({ syncStatus: "idle", syncError: null }),

    retrySync: () => void persistNow(),
  };
});

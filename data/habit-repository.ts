/**
 * The single persistence seam (Architecture §1/§24). Components and the
 * store depend only on this interface — A6 swaps the localStorage
 * implementation for an API-backed one with no other changes.
 */
import type { HabitMonth, SheetId } from "@/types/habit";

export const PERSIST_VERSION = 1;

export interface PersistedState {
  version: number;
  sheets: Record<SheetId, HabitMonth>;
}

export interface HabitRepository {
  load(): PersistedState | null;
  save(state: PersistedState): void;
  clear(): void;
}

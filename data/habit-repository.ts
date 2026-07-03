/**
 * The single persistence seam (Architecture §1/§24). Components and the
 * store depend only on this interface. As of A6 there are two
 * implementations: LocalStorageHabitRepository (fallback / migration source)
 * and SupabaseHabitRepository (cloud, per authenticated user).
 *
 * The interface is async: localStorage resolves immediately; Supabase does
 * real network I/O. The store awaits these and drives optimistic UI + sync
 * status around them.
 */
import type { HabitMonth, SheetId } from "@/types/habit";

export const PERSIST_VERSION = 1;

export interface PersistedState {
  version: number;
  sheets: Record<SheetId, HabitMonth>;
}

export interface HabitRepository {
  load(): Promise<PersistedState | null>;
  save(state: PersistedState): Promise<void>;
  clear(): Promise<void>;
}

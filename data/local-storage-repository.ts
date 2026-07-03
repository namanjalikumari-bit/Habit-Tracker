/**
 * localStorage implementation of the persistence seam. As of A6 this is the
 * FALLBACK (used when Supabase is not configured) and the MIGRATION SOURCE
 * (existing local data is imported into the cloud on first login).
 *
 * All access is guarded for SSR (no `window`) and wrapped in try/catch so a
 * full or disabled storage never crashes the app. The interface is async;
 * these methods resolve immediately.
 */
import {
  type HabitRepository,
  type PersistedState,
  PERSIST_VERSION,
} from "./habit-repository";

const STORAGE_KEY = "smart-habit-tracker:v1";

export class LocalStorageHabitRepository implements HabitRepository {
  async load(): Promise<PersistedState | null> {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as PersistedState;
      if (parsed?.version !== PERSIST_VERSION || !parsed.sheets) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  async save(state: PersistedState): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full or unavailable — persistence is best-effort.
    }
  }

  async clear(): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // no-op
    }
  }
}

export const localHabitRepository: HabitRepository =
  new LocalStorageHabitRepository();

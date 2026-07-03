/**
 * localStorage implementation of the persistence seam (A1–A4). All access
 * is guarded for SSR (no `window`) and wrapped in try/catch so a full or
 * disabled storage never crashes the app.
 */
import {
  type HabitRepository,
  type PersistedState,
  PERSIST_VERSION,
} from "./habit-repository";

const STORAGE_KEY = "smart-habit-tracker:v1";

export class LocalStorageHabitRepository implements HabitRepository {
  load(): PersistedState | null {
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

  save(state: PersistedState): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full or unavailable — persistence is best-effort in A1–A4.
    }
  }

  clear(): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // no-op
    }
  }
}

export const habitRepository: HabitRepository =
  new LocalStorageHabitRepository();

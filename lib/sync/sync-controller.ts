/**
 * Auth-aware sync controller (A6). Decides which repository the store uses
 * and hydrates it:
 *
 *  - LOCAL mode (Supabase not configured): use localStorage, exactly like
 *    Gate 1. No account, no cloud.
 *  - CLOUD mode (signed in): use SupabaseHabitRepository. On first login for a
 *    user (no cloud rows yet), MIGRATE existing localStorage data into the
 *    cloud, or SEED default data if there is none.
 *
 * Concurrency safety (important): React StrictMode (dev) invokes effects twice,
 * and a fast remount can call configureCloudMode again. Seeding is therefore
 * memoized PER USER so it runs exactly once — otherwise two runs would each
 * seed a different set of habit ids and then delete each other's rows. Every
 * mount still re-hydrates (a read), which is idempotent.
 *
 * Habit ids from the seed ("example-0") / migrated local data are re-keyed to
 * uuids before the first cloud save so they are valid database primary keys.
 */
import { PERSIST_VERSION, type HabitRepository } from "@/data/habit-repository";
import { localHabitRepository } from "@/data/local-storage-repository";
import { makeSeedSheets } from "@/data/seed";
import { SupabaseHabitRepository } from "@/data/supabase-habit-repository";
import { newId } from "@/lib/id";
import { friendlySyncError } from "@/lib/sync/messages";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useHabitStore } from "@/store/habit-store";
import { SHEET_IDS, type HabitMonth, type SheetId } from "@/types/habit";

/** Deep-clone the sheets, assigning every habit a fresh uuid (db-safe). */
function reassignHabitIds(
  sheets: Record<SheetId, HabitMonth>,
): Record<SheetId, HabitMonth> {
  const out = {} as Record<SheetId, HabitMonth>;
  for (const sid of SHEET_IDS) {
    const sheet = sheets[sid] ?? makeSeedSheets()[sid];
    out[sid] = {
      ...sheet,
      habits: sheet.habits.map((h) => ({ ...h, id: newId(), days: [...h.days] })),
    };
  }
  return out;
}

/** LOCAL mode — load from localStorage and render (Gate 1 behaviour). */
export async function configureLocalMode(): Promise<void> {
  const store = useHabitStore.getState();
  store.setActiveRepository(localHabitRepository);
  const data = await localHabitRepository.load();
  store.applyHydratedState(data?.sheets ?? makeSeedSheets());
}

/**
 * Ensure the user has cloud data — seed default data (or migrate existing
 * local data) on first login only. Memoized per user id so concurrent
 * configureCloudMode calls (StrictMode / remounts) can never double-seed.
 */
const ensureUserDataOnce = new Map<string, Promise<void>>();

function ensureUserData(repo: HabitRepository, userId: string): Promise<void> {
  let inflight = ensureUserDataOnce.get(userId);
  if (!inflight) {
    inflight = (async () => {
      const existing = await repo.load();
      if (existing) return; // user already has cloud data
      const local = await localHabitRepository.load();
      const sourceSheets = local?.sheets ?? makeSeedSheets();
      const fresh = reassignHabitIds(sourceSheets);
      await repo.save({ version: PERSIST_VERSION, sheets: fresh });
    })().catch((error) => {
      // Allow a later attempt to retry seeding if this one failed.
      ensureUserDataOnce.delete(userId);
      throw error;
    });
    ensureUserDataOnce.set(userId, inflight);
  }
  return inflight;
}

/**
 * CLOUD mode — point the store at Supabase for `userId`, seeding on first login
 * (once), then hydrating from the cloud. `isCancelled` guards against a fast
 * logout/login switch.
 */
export async function configureCloudMode(
  userId: string,
  isCancelled: () => boolean = () => false,
): Promise<void> {
  const store = useHabitStore.getState();
  const client = getSupabaseBrowserClient();
  if (!client) {
    // Shouldn't happen in cloud mode, but stay usable.
    store.applyHydratedState(makeSeedSheets());
    return;
  }

  const repo = new SupabaseHabitRepository(client, userId);
  store.setActiveRepository(repo);
  store.beginHydration();

  try {
    await ensureUserData(repo, userId); // seed/migrate once
    if (isCancelled()) return;
    const data = await repo.load(); // idempotent read; safe on every mount
    if (isCancelled()) return;
    store.applyHydratedState(data?.sheets ?? makeSeedSheets());
  } catch (error) {
    if (isCancelled()) return;
    // Keep the app usable even if the cloud is unreachable on load.
    store.applyHydratedState(makeSeedSheets());
    store.setSyncError(friendlySyncError(error));
  }
}

/** Reset sync state on logout so the next login re-hydrates cleanly. */
export function deactivateSync(): void {
  const store = useHabitStore.getState();
  store.setActiveRepository(localHabitRepository);
  store.beginHydration();
}

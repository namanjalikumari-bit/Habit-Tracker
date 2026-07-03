/**
 * Supabase (cloud) implementation of the persistence seam — the A6 target.
 *
 * Maps the app's `PersistedState` (two sheets → habits → 31-day boolean
 * arrays) onto the relational schema:
 *   habit_months (one row per user per sheet)
 *   habits       (one row per habit row, ordered by `position`)
 *   habit_entries(one row per COMPLETED day: presence = checked)
 *
 * Every query is scoped to `userId`; Row Level Security enforces the same
 * scoping server-side, so a user can only ever read/write their own rows.
 *
 * Habit ids are uuids: the store re-keys seeded/migrated habits to uuids
 * before the first save (see lib/sync/sync-controller.ts), and new habits are
 * created with `crypto.randomUUID()`, so `habits.id` is always a valid uuid.
 */
import { DAYS_PER_ROW, SHEET_IDS, type HabitMonth, type SheetId } from "@/types/habit";
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  type HabitRepository,
  type PersistedState,
  PERSIST_VERSION,
} from "./habit-repository";
import { makeSeedSheets } from "./seed";

interface MonthRow {
  id: string;
  sheet_id: string;
  year: number;
  month: number;
}
interface HabitRow {
  id: string;
  habit_month_id: string;
  name: string;
  position: number;
}
interface EntryRow {
  habit_id: string;
  day_index: number;
}

function daysFromEntrySet(indexes: Set<number> | undefined): boolean[] {
  const days = new Array(DAYS_PER_ROW).fill(false);
  if (indexes) for (const i of indexes) if (i >= 0 && i < DAYS_PER_ROW) days[i] = true;
  return days;
}

export class SupabaseHabitRepository implements HabitRepository {
  constructor(
    private readonly client: SupabaseClient,
    private readonly userId: string,
  ) {}

  async load(): Promise<PersistedState | null> {
    const [monthsRes, habitsRes, entriesRes] = await Promise.all([
      this.client
        .from("habit_months")
        .select("id, sheet_id, year, month")
        .eq("user_id", this.userId),
      this.client
        .from("habits")
        .select("id, habit_month_id, name, position")
        .eq("user_id", this.userId)
        .order("position", { ascending: true }),
      this.client
        .from("habit_entries")
        .select("habit_id, day_index")
        .eq("user_id", this.userId),
    ]);

    if (monthsRes.error) throw monthsRes.error;
    if (habitsRes.error) throw habitsRes.error;
    if (entriesRes.error) throw entriesRes.error;

    const months = (monthsRes.data ?? []) as MonthRow[];
    if (months.length === 0) return null; // no data yet → first login

    const habits = (habitsRes.data ?? []) as HabitRow[];
    const entries = (entriesRes.data ?? []) as EntryRow[];

    const entriesByHabit = new Map<string, Set<number>>();
    for (const e of entries) {
      let set = entriesByHabit.get(e.habit_id);
      if (!set) entriesByHabit.set(e.habit_id, (set = new Set()));
      set.add(e.day_index);
    }

    const seed = makeSeedSheets();
    const sheets = {} as Record<SheetId, HabitMonth>;
    for (const sid of SHEET_IDS) {
      const month = months.find((m) => m.sheet_id === sid);
      if (!month) {
        sheets[sid] = seed[sid];
        continue;
      }
      sheets[sid] = {
        year: month.year,
        month: month.month,
        habits: habits
          .filter((h) => h.habit_month_id === month.id)
          .sort((a, b) => a.position - b.position)
          .map((h) => ({
            id: h.id,
            name: h.name,
            days: daysFromEntrySet(entriesByHabit.get(h.id)),
          })),
      };
    }

    return { version: PERSIST_VERSION, sheets };
  }

  async save(state: PersistedState): Promise<void> {
    const userId = this.userId;

    // 1) Upsert the two habit_months, keyed by (user_id, sheet_id).
    const monthRows = SHEET_IDS.map((sid) => ({
      user_id: userId,
      sheet_id: sid,
      year: state.sheets[sid].year,
      month: state.sheets[sid].month,
      updated_at: new Date().toISOString(),
    }));
    const monthsRes = await this.client
      .from("habit_months")
      .upsert(monthRows, { onConflict: "user_id,sheet_id" })
      .select("id, sheet_id");
    if (monthsRes.error) throw monthsRes.error;
    const monthIdBySheet = new Map(
      (monthsRes.data as { id: string; sheet_id: string }[]).map((m) => [
        m.sheet_id,
        m.id,
      ]),
    );

    // 2) Upsert desired habits (by uuid id), then delete any that disappeared.
    const desiredHabits: Array<{
      id: string;
      habit_month_id: string;
      user_id: string;
      name: string;
      position: number;
    }> = [];
    for (const sid of SHEET_IDS) {
      const monthId = monthIdBySheet.get(sid);
      if (!monthId) continue;
      state.sheets[sid].habits.forEach((h, position) => {
        desiredHabits.push({
          id: h.id,
          habit_month_id: monthId,
          user_id: userId,
          name: h.name,
          position,
        });
      });
    }
    if (desiredHabits.length > 0) {
      const upsertRes = await this.client.from("habits").upsert(desiredHabits);
      if (upsertRes.error) throw upsertRes.error;
    }
    const existingRes = await this.client
      .from("habits")
      .select("id")
      .eq("user_id", userId);
    if (existingRes.error) throw existingRes.error;
    const desiredIds = new Set(desiredHabits.map((h) => h.id));
    const staleIds = (existingRes.data as { id: string }[])
      .map((r) => r.id)
      .filter((id) => !desiredIds.has(id));
    if (staleIds.length > 0) {
      // Cascade deletes the stale habits' entries too.
      const delRes = await this.client.from("habits").delete().in("id", staleIds);
      if (delRes.error) throw delRes.error;
    }

    // 3) Replace this user's entries with the current completed set.
    const delEntriesRes = await this.client
      .from("habit_entries")
      .delete()
      .eq("user_id", userId);
    if (delEntriesRes.error) throw delEntriesRes.error;

    const entryRows: Array<{
      habit_id: string;
      user_id: string;
      day_index: number;
    }> = [];
    for (const sid of SHEET_IDS) {
      for (const habit of state.sheets[sid].habits) {
        habit.days.forEach((done, dayIndex) => {
          if (done) entryRows.push({ habit_id: habit.id, user_id: userId, day_index: dayIndex });
        });
      }
    }
    if (entryRows.length > 0) {
      const insRes = await this.client.from("habit_entries").insert(entryRows);
      if (insRes.error) throw insRes.error;
    }
  }

  async clear(): Promise<void> {
    // Cascades to habits + habit_entries via ON DELETE CASCADE.
    const res = await this.client
      .from("habit_months")
      .delete()
      .eq("user_id", this.userId);
    if (res.error) throw res.error;
  }
}

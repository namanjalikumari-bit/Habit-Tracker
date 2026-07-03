/**
 * Seed state — the default data both dashboards start from (Build-Order
 * A2-T12). The "Example" ranges are the pixel-verified December-2024
 * pattern read frame-by-frame from the reference video; the totals
 * reconcile exactly (153 completed / 217 possible / 64 uncompleted).
 *
 * The "Empty Template" ships with 9 empty-named active habits (9 × 31 =
 * 279), reproducing the reference's Empty Template sheet.
 *
 * IDs are deterministic (sheet-index) so server and client render the same
 * markup — no hydration mismatch.
 */
import { DAYS_PER_ROW, type Habit, type HabitMonth, type SheetId, type Today } from "@/types/habit";

function emptyDays(): boolean[] {
  return new Array(DAYS_PER_ROW).fill(false);
}

function daysFromRanges(ranges: Array<[number, number]>): boolean[] {
  const days = emptyDays();
  for (const [start, end] of ranges) {
    for (let day = start; day <= end; day++) {
      days[day - 1] = true;
    }
  }
  return days;
}

function habit(id: string, name: string, days: boolean[]): Habit {
  return { id, name, days };
}

const EXAMPLE_HABITS: Habit[] = [
  habit("example-0", "Go to the gym", daysFromRanges([[1, 25]])),
  habit(
    "example-1",
    "Read 1 chapter of Rich Dad Poor Dad",
    daysFromRanges([
      [1, 2],
      [4, 4],
      [6, 25],
    ]),
  ),
  habit(
    "example-2",
    "Catch up with 1 friend",
    daysFromRanges([
      [3, 3],
      [5, 25],
    ]),
  ),
  habit(
    "example-3",
    "Do 2 hours of deep work",
    daysFromRanges([
      [2, 3],
      [5, 24],
    ]),
  ),
  habit("example-4", "Vacuum my room", daysFromRanges([[3, 23]])),
  habit("example-5", "Create 1 tiktok video", daysFromRanges([[4, 23]])),
  habit("example-6", "Drink 8 litres of water", daysFromRanges([[4, 23]])),
];

const EMPTY_TEMPLATE_HABITS: Habit[] = Array.from({ length: 9 }, (_, i) =>
  habit(`empty-${i}`, "", emptyDays()),
);

export const SEED_TODAY: Today = { year: 2024, month: 12, day: 25 };

function cloneHabits(habits: Habit[]): Habit[] {
  return habits.map((h) => ({ ...h, days: [...h.days] }));
}

export function makeSeedSheets(): Record<SheetId, HabitMonth> {
  return {
    example: { year: 2024, month: 12, habits: cloneHabits(EXAMPLE_HABITS) },
    "empty-template": {
      year: 2025,
      month: 1,
      habits: cloneHabits(EMPTY_TEMPLATE_HABITS),
    },
  };
}

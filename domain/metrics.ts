/**
 * Pure derivation of every metric shown on the dashboard (Architecture §7).
 * KPIs, per-habit fraction/%, both chart series and the donut all read from
 * one HabitMonth here, so they can never drift out of sync.
 */
import type { Habit, HabitMonth } from "@/types/habit";

import { daysInMonth } from "./calendar";

export function tasksCompleted(habit: Habit, dim: number): number {
  let count = 0;
  for (let i = 0; i < dim; i++) {
    if (habit.days[i]) count++;
  }
  return count;
}

export function completionPercent(habit: Habit, dim: number): number {
  if (dim === 0) return 0;
  return Math.round((tasksCompleted(habit, dim) / dim) * 100);
}

function checkedCountOnDay(month: HabitMonth, dayIndex: number): number {
  let count = 0;
  for (const habit of month.habits) {
    if (habit.days[dayIndex]) count++;
  }
  return count;
}

export interface Totals {
  completed: number;
  possible: number;
  uncompleted: number;
}

export function totals(month: HabitMonth): Totals {
  const dim = daysInMonth(month.year, month.month);
  const completed = month.habits.reduce(
    (sum, habit) => sum + tasksCompleted(habit, dim),
    0,
  );
  const possible = month.habits.length * dim;
  return { completed, possible, uncompleted: possible - completed };
}

export interface DailyPoint {
  day: number;
  percent: number;
  [key: string]: number;
}

/** "Habits Completed / Day" — % of active habits checked each day. */
export function dailySeries(month: HabitMonth): DailyPoint[] {
  const dim = daysInMonth(month.year, month.month);
  const habitCount = month.habits.length;
  return Array.from({ length: dim }, (_, i) => ({
    day: i + 1,
    percent:
      habitCount === 0
        ? 0
        : Math.round((checkedCountOnDay(month, i) / habitCount) * 1000) / 10,
  }));
}

export interface CumulativePoint {
  day: number;
  total: number;
  [key: string]: number;
}

/** "Habits Completed in Month" — running total of completions to date. */
export function cumulativeSeries(month: HabitMonth): CumulativePoint[] {
  const dim = daysInMonth(month.year, month.month);
  let running = 0;
  return Array.from({ length: dim }, (_, i) => {
    running += checkedCountOnDay(month, i);
    return { day: i + 1, total: running };
  });
}

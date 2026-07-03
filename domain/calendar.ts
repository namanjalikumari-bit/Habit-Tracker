/**
 * Pure calendar helpers (Architecture §7). No React. Drives the dynamic
 * weekday alignment and day-count behaviour observed in the reference.
 */
import type { Today } from "@/types/habit";

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const WEEKDAY_ABBR = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

export const YEAR_MIN = 1900;
export const YEAR_MAX = 2200;

/** Number of days in a 1–12 month of a given year (handles leap years). */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/** Weekday of the 1st of the month. 0 = Sunday … 6 = Saturday. */
export function firstWeekdayIndex(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

export function monthName(month: number): string {
  return MONTH_NAMES[month - 1] ?? "";
}

export function formatToday(today: Today): string {
  return `${monthName(today.month)} ${today.day}, ${today.year}`;
}

/** The day to highlight in the given month, or 0 if "today" is elsewhere. */
export function todayDayIn(
  year: number,
  month: number,
  today: Today,
): number {
  return today.year === year && today.month === month ? today.day : 0;
}

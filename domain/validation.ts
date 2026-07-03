/** Input validation for the setup panel (Architecture §21). */
import { YEAR_MAX, YEAR_MIN } from "./calendar";

export function clampYear(year: number): number {
  if (!Number.isFinite(year)) return YEAR_MIN;
  return Math.min(YEAR_MAX, Math.max(YEAR_MIN, Math.trunc(year)));
}

export function isValidMonth(month: number): boolean {
  return Number.isInteger(month) && month >= 1 && month <= 12;
}

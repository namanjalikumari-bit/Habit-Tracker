"use client";

import { useHabitStore } from "@/store/habit-store";
import type { SheetId } from "@/types/habit";

interface HabitNameCellProps {
  sheetId: SheetId;
  habitId: string;
  name: string;
  /** 1-based row number, used for the "<Enter Habit N>" placeholder. */
  serial: number;
}

/**
 * Editable habit name (Master-Design-Spec §28 #14). A transparent input
 * styled exactly like the A1 static text — rename lives on `onChange`;
 * pressing Backspace on an already-empty name removes the habit, mirroring
 * the reference's "backspace to delete" behaviour.
 */
export function HabitNameCell({
  sheetId,
  habitId,
  name,
  serial,
}: HabitNameCellProps) {
  const renameHabit = useHabitStore((s) => s.renameHabit);
  const removeHabit = useHabitStore((s) => s.removeHabit);

  return (
    <input
      type="text"
      value={name}
      placeholder={`<Enter Habit ${serial}>`}
      aria-label={`Habit ${serial} name`}
      onChange={(e) => renameHabit(sheetId, habitId, e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Backspace" && name === "") {
          e.preventDefault();
          removeHabit(sheetId, habitId);
        }
      }}
      className="text-body text-text placeholder:text-text-placeholder focus-visible:ring-instruction w-full bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-inset"
    />
  );
}

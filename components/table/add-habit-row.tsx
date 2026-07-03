"use client";

import { useState } from "react";

import { useHabitStore } from "@/store/habit-store";
import { cn } from "@/lib/utils";
import type { SheetId } from "@/types/habit";

import { COLUMN_WIDTHS } from "./column-widths";

interface AddHabitRowProps {
  sheetId: SheetId;
  serial: number;
  isAlt: boolean;
}

/**
 * Trailing "add a habit" slot (Master-Design-Spec §3.2 — the reference's
 * blank row below the last habit). Appears visually blank to preserve A1;
 * typing a name and pressing Enter (or blurring) appends a new habit, whose
 * checkboxes then appear — reproducing the reference's add behaviour.
 */
export function AddHabitRow({ sheetId, serial, isAlt }: AddHabitRowProps) {
  const addHabit = useHabitStore((s) => s.addHabit);
  const [value, setValue] = useState("");

  const commit = () => {
    const name = value.trim();
    if (name.length > 0) {
      addHabit(sheetId, name);
      setValue("");
    }
  };

  const rowBg = isAlt ? "bg-row-alt" : "bg-surface";

  return (
    <div className={cn("border-border-hairline flex h-10 border-t", rowBg)}>
      <div
        className={cn(
          "text-text text-body-strong border-border-hairline flex items-center justify-center border-r",
          COLUMN_WIDTHS.serial,
        )}
      >
        {serial}
      </div>
      <div
        className={cn(
          "border-border-hairline flex items-center border-r px-3",
          COLUMN_WIDTHS.habits,
        )}
      >
        <input
          type="text"
          value={value}
          aria-label="Add a habit"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
          }}
          onBlur={commit}
          className="text-body text-text focus-visible:ring-instruction w-full bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-inset"
        />
      </div>
      <div className="border-border-hairline w-280 shrink-0 border-r" />
      <div
        className={cn(
          "border-border-hairline shrink-0 border-r",
          COLUMN_WIDTHS.tasks,
        )}
      />
      <div className={cn("shrink-0", COLUMN_WIDTHS.total)} />
    </div>
  );
}

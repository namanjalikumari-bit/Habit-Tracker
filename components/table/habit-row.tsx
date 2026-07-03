"use client";

import { memo } from "react";

import { ProgressBar } from "@/components/progress/progress-bar";
import { completionPercent, tasksCompleted } from "@/domain/metrics";
import { cn } from "@/lib/utils";
import { DAYS_PER_ROW, type Habit, type SheetId } from "@/types/habit";

import { COLUMN_WIDTHS, DAY_SLOT_WIDTH, TOTAL_DAY_SLOTS } from "./column-widths";
import { DayCheckbox } from "./day-checkbox";
import { HabitNameCell } from "./habit-name-cell";

interface HabitRowProps {
  sheetId: SheetId;
  rowIndex: number;
  serial: number;
  habit: Habit;
  isAlt: boolean;
  daysInMonth: number;
  /** Day to highlight (today), or 0 if today is not in this month. */
  todayDay: number;
  focusedRow: number;
  focusedCol: number;
  onCellPointerDown: (rowIndex: number, dayIndex: number) => void;
  onCellPointerEnter: (rowIndex: number, dayIndex: number) => void;
}

/**
 * One habit row (Master-Design-Spec §13). Structurally identical to A1 —
 * cells now wrap interactive `DayCheckbox` buttons and an editable name,
 * but the box model, backgrounds and spacing are unchanged. Memoised so a
 * toggle only re-renders the affected row (Architecture §19).
 */
function HabitRowInner({
  sheetId,
  rowIndex,
  serial,
  habit,
  isAlt,
  daysInMonth,
  todayDay,
  focusedRow,
  focusedCol,
  onCellPointerDown,
  onCellPointerEnter,
}: HabitRowProps) {
  const rowBg = isAlt ? "bg-row-alt" : "bg-surface";
  const dim = daysInMonth;
  const done = tasksCompleted(habit, dim);
  const percent = completionPercent(habit, dim);

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
        <HabitNameCell
          sheetId={sheetId}
          habitId={habit.id}
          name={habit.name}
          serial={serial}
        />
      </div>

      <div className="border-border-hairline flex shrink-0 border-r">
        {Array.from({ length: TOTAL_DAY_SLOTS }, (_, i) => {
          const day = i + 1;
          const inMonth = day <= DAYS_PER_ROW && day <= dim;
          if (!inMonth) {
            return (
              <div key={i} className={cn("h-10", DAY_SLOT_WIDTH, rowBg)} />
            );
          }
          const checked = habit.days[i];
          const isToday = day === todayDay;
          const cellBg = checked
            ? "bg-cell-checked"
            : isToday
              ? "bg-grey-300"
              : rowBg;

          return (
            <DayCheckbox
              key={i}
              checked={checked}
              cellBg={cellBg}
              ariaLabel={`${habit.name || `Habit ${serial}`} — day ${day}, ${
                checked ? "completed" : "not completed"
              }`}
              tabIndex={rowIndex === focusedRow && i === focusedCol ? 0 : -1}
              dataCell={`${rowIndex}-${i}`}
              onPointerDownCell={() => onCellPointerDown(rowIndex, i)}
              onPointerEnterCell={() => onCellPointerEnter(rowIndex, i)}
            />
          );
        })}
      </div>

      <div
        className={cn(
          "text-text text-body-strong border-border-hairline flex items-center justify-center border-r",
          COLUMN_WIDTHS.tasks,
        )}
      >
        {done} / {dim}
      </div>

      <div
        className={cn(
          "flex items-center justify-between gap-2 px-3",
          COLUMN_WIDTHS.total,
        )}
      >
        <ProgressBar percent={percent} />
        <span className="text-text text-body-strong">{percent}%</span>
      </div>
    </div>
  );
}

export const HabitRow = memo(HabitRowInner);

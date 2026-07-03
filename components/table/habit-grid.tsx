"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useHabitStore } from "@/store/habit-store";
import { MAX_HABITS, type Habit, type SheetId } from "@/types/habit";

import { AddHabitRow } from "./add-habit-row";
import { GridHeader } from "./grid-header";
import { HabitRow } from "./habit-row";
import { StepBannersRow } from "./step-banners-row";

interface HabitGridProps {
  sheetId: SheetId;
  habits: Habit[];
  daysInMonth: number;
  firstWeekdayIndex: number;
  todayDay: number;
}

/**
 * The full habit table (Master-Design-Spec §13). Adds three interaction
 * layers on top of the A1 visuals without changing them:
 *  • click / Space / Enter toggles a cell;
 *  • click-drag paints multiple cells (the reference's bulk-check);
 *  • arrow keys move focus with a roving tabindex (Architecture §20).
 * Horizontal scroll is spec-sanctioned (§5) — no data is ever hidden.
 */
export function HabitGrid({
  sheetId,
  habits,
  daysInMonth,
  firstWeekdayIndex,
  todayDay,
}: HabitGridProps) {
  const toggleDay = useHabitStore((s) => s.toggleDay);
  const paintDay = useHabitStore((s) => s.paintDay);

  const [focused, setFocused] = useState({ row: 0, col: 0 });
  const paintValue = useRef<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const end = () => {
      paintValue.current = null;
    };
    window.addEventListener("pointerup", end);
    return () => window.removeEventListener("pointerup", end);
  }, []);

  const focusCell = useCallback((row: number, col: number) => {
    const el = containerRef.current?.querySelector<HTMLButtonElement>(
      `[data-cell="${row}-${col}"]`,
    );
    el?.focus();
  }, []);

  const onCellPointerDown = useCallback(
    (row: number, dayIndex: number) => {
      const habit = habits[row];
      if (!habit) return;
      const value = !habit.days[dayIndex];
      paintValue.current = value;
      paintDay(sheetId, habit.id, dayIndex, value);
      setFocused({ row, col: dayIndex });
    },
    [habits, paintDay, sheetId],
  );

  const onCellPointerEnter = useCallback(
    (row: number, dayIndex: number) => {
      if (paintValue.current === null) return;
      const habit = habits[row];
      if (!habit) return;
      paintDay(sheetId, habit.id, dayIndex, paintValue.current);
      setFocused({ row, col: dayIndex });
    },
    [habits, paintDay, sheetId],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const cell = target.getAttribute?.("data-cell");
    if (!cell) return;
    const [rowStr, colStr] = cell.split("-");
    const row = Number(rowStr);
    const col = Number(colStr);
    const maxRow = habits.length - 1;
    const maxCol = daysInMonth - 1;

    let nextRow = row;
    let nextCol = col;
    switch (e.key) {
      case "ArrowRight":
        nextCol = Math.min(maxCol, col + 1);
        break;
      case "ArrowLeft":
        nextCol = Math.max(0, col - 1);
        break;
      case "ArrowDown":
        nextRow = Math.min(maxRow, row + 1);
        break;
      case "ArrowUp":
        nextRow = Math.max(0, row - 1);
        break;
      case " ":
      case "Enter": {
        e.preventDefault();
        const habit = habits[row];
        if (habit) toggleDay(sheetId, habit.id, col);
        return;
      }
      default:
        return;
    }
    e.preventDefault();
    if (nextRow !== row || nextCol !== col) {
      setFocused({ row: nextRow, col: nextCol });
      focusCell(nextRow, nextCol);
    }
  };

  const showAddRow = habits.length < MAX_HABITS;

  return (
    <div className="overflow-x-auto">
      <div
        ref={containerRef}
        role="grid"
        aria-label="Habit tracker"
        onKeyDown={onKeyDown}
        className="border-border-strong inline-block border"
      >
        <StepBannersRow />
        <GridHeader
          daysInMonth={daysInMonth}
          firstWeekdayIndex={firstWeekdayIndex}
          todayDay={todayDay}
        />
        {habits.map((habit, i) => (
          <HabitRow
            key={habit.id}
            sheetId={sheetId}
            rowIndex={i}
            serial={i + 1}
            habit={habit}
            isAlt={i % 2 === 1}
            daysInMonth={daysInMonth}
            todayDay={todayDay}
            focusedRow={focused.row}
            focusedCol={focused.col}
            onCellPointerDown={onCellPointerDown}
            onCellPointerEnter={onCellPointerEnter}
          />
        ))}
        {showAddRow && (
          <AddHabitRow
            sheetId={sheetId}
            serial={habits.length + 1}
            isAlt={habits.length % 2 === 1}
          />
        )}
      </div>
    </div>
  );
}

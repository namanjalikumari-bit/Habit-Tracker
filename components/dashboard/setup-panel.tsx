"use client";

import { ChevronDown } from "lucide-react";

import { FieldRow } from "@/components/ui/field-row";
import { StepBanner } from "@/components/ui/step-banner";
import { MONTH_NAMES } from "@/domain/calendar";
import { useHabitStore } from "@/store/habit-store";
import type { SheetId } from "@/types/habit";

interface SetupPanelProps {
  sheetId: SheetId;
  year: number;
  month: number;
}

/**
 * STEP 1 — interactive Year & Month (Master-Design-Spec §17). The month is
 * a native <select> (fully keyboard/AT accessible) styled to look exactly
 * like the reference cell; the year is a numeric input. Both drive the
 * dynamic calendar via the store.
 */
export function SetupPanel({ sheetId, year, month }: SetupPanelProps) {
  const setYear = useHabitStore((s) => s.setYear);
  const setMonth = useHabitStore((s) => s.setMonth);

  return (
    <div className="flex flex-col">
      <StepBanner>Step 1: Enter the year &amp; month below</StepBanner>
      <FieldRow label="Year">
        <input
          type="number"
          value={year}
          aria-label="Year"
          onChange={(e) => {
            const next = Number(e.target.value);
            if (Number.isFinite(next)) setYear(sheetId, next);
          }}
          className="text-body text-text focus-visible:ring-instruction w-full bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-inset [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
      </FieldRow>
      <FieldRow label="Month">
        <div className="relative flex w-full items-center">
          <select
            value={month}
            aria-label="Month"
            onChange={(e) => setMonth(sheetId, Number(e.target.value))}
            className="text-body text-text focus-visible:ring-instruction w-full cursor-pointer appearance-none bg-transparent pr-6 outline-none focus-visible:ring-2 focus-visible:ring-inset"
          >
            {MONTH_NAMES.map((name, i) => (
              <option key={name} value={i + 1}>
                {name}
              </option>
            ))}
          </select>
          <ChevronDown
            className="text-disabled pointer-events-none absolute right-0 h-4 w-4"
            aria-hidden="true"
          />
        </div>
      </FieldRow>
    </div>
  );
}

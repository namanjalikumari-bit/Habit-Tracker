import { monthName } from "@/domain/calendar";
import type { SheetId } from "@/types/habit";

import { AppTitleBlock } from "./app-title-block";
import { MonthTitlePlate } from "./month-title-plate";
import { SetupPanel } from "./setup-panel";
import { TodayDateCard } from "./today-date-card";

interface IdentityRegionProps {
  sheetId: SheetId;
  year: number;
  month: number;
  todayLabel: string;
}

/**
 * Region A — Identity + Date (Master-Design-Spec §21). Three-column row at
 * ≥lg (identical to A1); stacks to a single column below lg (§22/§23).
 */
export function IdentityRegion({
  sheetId,
  year,
  month,
  todayLabel,
}: IdentityRegionProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
      <div className="flex flex-col gap-2 lg:w-96 lg:shrink-0">
        <AppTitleBlock />
        <SetupPanel sheetId={sheetId} year={year} month={month} />
      </div>
      <MonthTitlePlate
        monthName={monthName(month)}
        year={year}
        className="flex-1"
      />
      <TodayDateCard dateLabel={todayLabel} className="lg:shrink-0" />
    </div>
  );
}

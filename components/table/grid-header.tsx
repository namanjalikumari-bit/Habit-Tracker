import { COLUMN_WIDTHS } from "./column-widths";
import { WeekdayDateHeader } from "./weekday-date-header";
import { WeekGroupHeader } from "./week-group-header";

interface GridHeaderProps {
  daysInMonth: number;
  firstWeekdayIndex: number;
  todayDay: number;
}

/**
 * Three-tier grid header — group row (S/N, HABITS, WEEK 1–5, TASKS
 * COMPLETED, TOTAL), weekday row, date row (Master-Design-Spec §13,
 * §28 #13/#14/#15/#16/#20). S/N, HABITS, TASKS, and TOTAL span the full
 * 72px header height; only the week block is subdivided.
 */
export function GridHeader({
  daysInMonth,
  firstWeekdayIndex,
  todayDay,
}: GridHeaderProps) {
  return (
    <div className="bg-brand flex">
      <div
        className={`text-text-onbrand text-label-lg border-border-hairline flex h-18 items-center justify-center border-r uppercase ${COLUMN_WIDTHS.serial}`}
      >
        S/N
      </div>
      <div
        className={`text-text-onbrand text-label-lg border-border-hairline flex h-18 items-center justify-center border-r px-3 uppercase ${COLUMN_WIDTHS.habits}`}
      >
        Habits
      </div>
      <div className="border-border-hairline flex flex-col border-r">
        <WeekGroupHeader />
        <WeekdayDateHeader
          daysInMonth={daysInMonth}
          firstWeekdayIndex={firstWeekdayIndex}
          todayDay={todayDay}
        />
      </div>
      <div
        className={`text-text-onbrand text-label-lg border-border-hairline flex h-18 items-center justify-center border-r text-center uppercase ${COLUMN_WIDTHS.tasks}`}
      >
        Tasks Completed
      </div>
      <div
        className={`text-text-onbrand text-h2 flex h-18 items-center justify-center uppercase ${COLUMN_WIDTHS.total}`}
      >
        Total
      </div>
    </div>
  );
}

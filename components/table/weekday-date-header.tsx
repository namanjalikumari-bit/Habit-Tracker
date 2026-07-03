import { cn } from "@/lib/utils";

import { DAY_SLOT_WIDTH, TOTAL_DAY_SLOTS } from "./column-widths";

const WEEKDAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface WeekdayDateHeaderProps {
  daysInMonth: number;
  /** 0 = Sunday. The weekday of the 1st of the selected month. */
  firstWeekdayIndex: number;
  todayDay: number;
}

/**
 * Dynamic weekday + date sub-header (Master-Design-Spec §13/§28 #16/#23).
 * Realigns to the 1st-of-month weekday; slots beyond `daysInMonth` render
 * blank (out-of-month). Today's column is styled italic + underlined.
 */
export function WeekdayDateHeader({
  daysInMonth,
  firstWeekdayIndex,
  todayDay,
}: WeekdayDateHeaderProps) {
  return (
    <div className="flex w-280 shrink-0">
      {Array.from({ length: TOTAL_DAY_SLOTS }, (_, i) => {
        const day = i + 1;
        const inMonth = day <= daysInMonth;
        const weekday = WEEKDAY_ABBR[(firstWeekdayIndex + i) % 7];
        const isToday = inMonth && day === todayDay;

        return (
          <div
            key={i}
            className={cn(
              "border-border-hairline flex h-10 flex-col items-center justify-center border-r last:border-r-0",
              DAY_SLOT_WIDTH,
            )}
          >
            {inMonth && (
              <>
                <span
                  className={cn(
                    "text-small text-text",
                    isToday && "italic underline",
                  )}
                >
                  {weekday}
                </span>
                <span
                  className={cn(
                    "text-xs text-text",
                    isToday && "italic underline",
                  )}
                >
                  {day}
                </span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

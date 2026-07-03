"use client";

import { useMemo } from "react";

import { AreaLineChart } from "@/components/charts/area-line-chart";
import { ChartMount } from "@/components/charts/chart-mount";
import { ChartPanel } from "@/components/charts/chart-panel";
import { IdentityRegion } from "@/components/dashboard/identity-region";
import { KpiStat } from "@/components/dashboard/kpi-stat";
import { Region } from "@/components/layout/region";
import { ProgressRing } from "@/components/progress/progress-ring";
import { HabitGrid } from "@/components/table/habit-grid";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import {
  cumulativeXTicks,
  cumulativeYAxis,
  DAILY_Y_AXIS,
  dailyXTicks,
} from "@/domain/chart-axis";
import {
  daysInMonth,
  firstWeekdayIndex,
  formatToday,
  todayDayIn,
} from "@/domain/calendar";
import { cumulativeSeries, dailySeries, totals } from "@/domain/metrics";
import { useHabitStore } from "@/store/habit-store";
import type { SheetId } from "@/types/habit";

/**
 * The live dashboard (Build-Order A2). Subscribes to one sheet, derives
 * every metric via memoised selectors, and renders the A1 layout unchanged
 * — only now driven by store data, so a single checkbox toggle updates the
 * KPIs, both charts, the donut and the habit's bar together.
 */
export function DashboardScreen({ sheetId }: { sheetId: SheetId }) {
  const month = useHabitStore((s) => s.sheets[sheetId]);
  const today = useHabitStore((s) => s.today);

  const derived = useMemo(() => {
    const dim = daysInMonth(month.year, month.month);
    const t = totals(month);
    const daily = dailySeries(month);
    const cumulative = cumulativeSeries(month);
    return {
      dim,
      firstWeekday: firstWeekdayIndex(month.year, month.month),
      todayDay: todayDayIn(month.year, month.month, today),
      totals: t,
      daily,
      cumulative,
      cumulativeAxis: cumulativeYAxis(t.completed),
    };
  }, [month, today]);

  const chartFallback = (
    <div className="text-danger text-body flex h-40 items-center justify-center">
      Couldn&apos;t render charts.
    </div>
  );

  return (
    <>
      <Region label="Identity and date">
        <IdentityRegion
          sheetId={sheetId}
          year={month.year}
          month={month.month}
          todayLabel={formatToday(today)}
        />
      </Region>

      <Region label="Statistics and charts" className="mt-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="flex shrink-0 flex-col gap-8 lg:w-48">
            <KpiStat
              variant="completed"
              label="Total Habits Completed"
              value={derived.totals.completed}
            />
            <KpiStat
              variant="uncompleted"
              label="Total Habits Uncompleted"
              value={derived.totals.uncompleted}
            />
          </div>

          <ErrorBoundary fallback={chartFallback}>
            <ChartPanel
              title="Habits Completed / Day"
              className="min-w-0 flex-1"
            >
              <ChartMount>
                <AreaLineChart
                  data={derived.daily}
                  xKey="day"
                  yKey="percent"
                  yDomain={DAILY_Y_AXIS.domain}
                  yTicks={DAILY_Y_AXIS.ticks}
                  xTicks={dailyXTicks(derived.dim)}
                />
              </ChartMount>
            </ChartPanel>

            <ChartPanel
              title="Habits Completed in Month"
              className="min-w-0 flex-1"
            >
              <ChartMount>
                <AreaLineChart
                  data={derived.cumulative}
                  xKey="day"
                  yKey="total"
                  yDomain={derived.cumulativeAxis.domain}
                  yTicks={derived.cumulativeAxis.ticks}
                  xTicks={cumulativeXTicks(derived.dim)}
                  showDataLabels
                />
              </ChartMount>
            </ChartPanel>

            <ProgressRing
              completed={derived.totals.completed}
              total={derived.totals.possible}
              className="mx-auto shrink-0 lg:mx-0"
            />
          </ErrorBoundary>
        </div>
      </Region>

      <Region label="Habit tracking table" className="mt-8">
        <ErrorBoundary
          fallback={
            <div className="text-danger text-body p-4">
              Couldn&apos;t render the habit table.
            </div>
          }
        >
          <HabitGrid
            sheetId={sheetId}
            habits={month.habits}
            daysInMonth={derived.dim}
            firstWeekdayIndex={derived.firstWeekday}
            todayDay={derived.todayDay}
          />
        </ErrorBoundary>
      </Region>
    </>
  );
}

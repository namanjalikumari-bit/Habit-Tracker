"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface AreaLineChartProps {
  data: Array<Record<string, number>>;
  xKey: string;
  yKey: string;
  yDomain: [number, number];
  yTicks: number[];
  xTicks: number[];
  showDataLabels?: boolean;
}

/**
 * Smoothed area + line chart used for both "Habits Completed / Day" and
 * "Habits Completed in Month" (Master-Design-Spec §12.1/§12.2). A7 adds a
 * subtle redraw animation on data change; it is disabled under
 * prefers-reduced-motion. Colors, shape and layout are unchanged.
 */
export function AreaLineChart({
  data,
  xKey,
  yKey,
  yDomain,
  yTicks,
  xTicks,
  showDataLabels = false,
}: AreaLineChartProps) {
  const reducedMotion = useReducedMotion();
  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart
        data={data}
        margin={{ top: showDataLabels ? 16 : 4, right: 8, left: 0, bottom: 0 }}
      >
        <CartesianGrid vertical={false} stroke="var(--color-border-hairline)" />
        <XAxis
          dataKey={xKey}
          type="number"
          domain={[1, "dataMax"]}
          ticks={xTicks}
          tick={{ fill: "var(--color-text)", fontSize: 11 }}
          axisLine={{ stroke: "var(--color-border-hairline)" }}
          tickLine={false}
        />
        <YAxis
          domain={yDomain}
          ticks={yTicks}
          tick={{ fill: "var(--color-text)", fontSize: 11 }}
          axisLine={{ stroke: "var(--color-border-hairline)" }}
          tickLine={false}
          width={32}
        />
        <Area
          type="monotone"
          dataKey={yKey}
          stroke="var(--color-chart-line)"
          strokeWidth={2}
          fill="var(--color-chart-fill)"
          fillOpacity={1}
          dot={{ r: 3, fill: "var(--color-chart-line)", strokeWidth: 0 }}
          label={
            showDataLabels
              ? {
                  position: "top",
                  fontSize: 10,
                  fill: "var(--color-brand-accent)",
                }
              : false
          }
          isAnimationActive={!reducedMotion}
          animationDuration={400}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

"use client";

import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/use-mounted";

/**
 * Renders a fixed-height skeleton until mounted, then the chart. Recharts'
 * ResponsiveContainer needs a real client width, so gating on mount both
 * avoids a hydration mismatch and gives a clean loading state
 * (Architecture §13/§23). The skeleton matches the 160px plot height so
 * there is no layout shift.
 */
export function ChartMount({ children }: { children: ReactNode }) {
  const mounted = useMounted();
  if (!mounted) return <Skeleton className="h-40 w-full" />;
  return <>{children}</>;
}

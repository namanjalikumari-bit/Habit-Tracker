import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ChartPanelProps {
  title: string;
  children: ReactNode;
  className?: string;
}

/** Titled wrapper around one chart (Master-Design-Spec §12). */
export function ChartPanel({ title, children, className }: ChartPanelProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <h3 className="text-h3 text-brand-accent">{title}</h3>
      {children}
    </div>
  );
}

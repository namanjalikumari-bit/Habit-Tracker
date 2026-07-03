import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * Outer page shell — centered container, 24px gutters (Master-Design-Spec
 * §21). Capped at 1872px so the full 35-column habit grid (1822px) is
 * visible without horizontal scroll at the reference's 1920px capture
 * width — §21's fidelity target ("all 35 day-cells visible"). Narrower
 * viewports fall back to the grid's spec-sanctioned horizontal scroll.
 */
export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className={cn("bg-surface min-h-full w-full", className)}>
      <div className="mx-auto max-w-[1872px] px-6 py-8">{children}</div>
    </div>
  );
}

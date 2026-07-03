import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface FieldRowProps {
  label: string;
  children: ReactNode;
  className?: string;
}

/**
 * Label + value strip — used for YEAR / MONTH in the Setup Panel
 * (Master-Design-Spec §4, §28 #3/#4). Static in A1: `children` is plain
 * display content; real inputs/dropdown wiring land in A2-T17.
 */
export function FieldRow({ label, children, className }: FieldRowProps) {
  return (
    <div className={cn("border-border-hairline flex h-8 border", className)}>
      <div className="bg-brand text-text-onbrand text-label flex w-24 shrink-0 items-center px-3 uppercase">
        {label}
      </div>
      <div className="text-body flex flex-1 items-center gap-1 px-3">
        {children}
      </div>
    </div>
  );
}

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface RegionProps {
  children: ReactNode;
  className?: string;
  /** Accessible label for the region landmark, e.g. "Identity and date". */
  label?: string;
}

/** Thin semantic wrapper for one dashboard blueprint region (Master-Design-Spec §3). */
export function Region({ children, className, label }: RegionProps) {
  return (
    <section aria-label={label} className={cn("w-full", className)}>
      {children}
    </section>
  );
}

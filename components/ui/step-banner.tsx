import { Star } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface StepBannerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Blue instructional banner used for every "STEP n" divider
 * (Master-Design-Spec §4, §17, §28 #2/#12). Text is centered to match the
 * reference's merge-and-center convention — this reads as left-aligned on
 * the narrower banners and centered on the wide STEP 3 banner, matching
 * both observed cases with a single rule.
 */
export function StepBanner({ children, className }: StepBannerProps) {
  return (
    <div
      className={cn(
        "bg-instruction text-text-onbrand flex h-10 items-center justify-center gap-1.5 px-3",
        className,
      )}
    >
      <Star
        className="text-tip fill-tip h-3.5 w-3.5 shrink-0"
        aria-hidden="true"
      />
      <span className="text-label uppercase">{children}</span>
    </div>
  );
}

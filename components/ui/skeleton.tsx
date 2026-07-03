import { cn } from "@/lib/utils";

/**
 * Neutral placeholder used for loading states (Architecture §23). Flat and
 * subtle — no pulse animation (motion is deferred to A7).
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("bg-row-alt border-border-hairline border", className)}
    />
  );
}

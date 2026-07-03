import { cn } from "@/lib/utils";

interface ProgressBarProps {
  /** 0–100 */
  percent: number;
  className?: string;
}

/**
 * Per-habit TOTAL bar (Master-Design-Spec §16). Purple below 100%, green
 * at exactly 100%. Track width is measured from the reference frame at
 * ~177px full-scale (spec's §5 estimate was 150px) — snapped to the 8px
 * grid as 176px (w-44).
 *
 * Fill width is a computed percentage, so it is one of the constraint's
 * explicit inline-style exceptions (Architecture §17).
 */
export function ProgressBar({ percent, className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const isComplete = clamped === 100;

  return (
    <div
      className={cn("h-5 w-44", className)}
      role="img"
      aria-label={`${clamped}% complete`}
    >
      <div
        className={cn(
          "h-5",
          isComplete ? "bg-success" : "bg-progress",
          "motion-safe:transition-[width,background-color] motion-safe:duration-300 motion-safe:ease-out",
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

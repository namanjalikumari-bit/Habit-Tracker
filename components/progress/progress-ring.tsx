import { Ring } from "@/components/ui/ring";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  completed: number;
  total: number;
  className?: string;
}

/**
 * "Monthly Progress" donut (Master-Design-Spec §15/§28 #11). Fully green
 * at max (100%) and fully red at zero fall out naturally from `<Ring>`'s
 * own 0%/100% rendering — no special-casing needed.
 */
export function ProgressRing({ completed, total, className }: ProgressRingProps) {
  const percent = total === 0 ? 0 : (completed / total) * 100;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <h3 className="text-h3 text-brand-accent">Monthly Progress</h3>
      <div className="relative flex h-45 w-45 items-center justify-center">
        <Ring percent={percent} />
        <span className="text-text text-h3 absolute">
          {completed} / {total}
        </span>
      </div>
    </div>
  );
}

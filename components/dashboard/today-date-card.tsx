import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TodayDateCardProps {
  dateLabel: string;
  className?: string;
}

/**
 * "Today's Date" card — green header strip + white body
 * (Master-Design-Spec §5/§28 #6). Static value in A1; becomes the real
 * current date once A2-T17 wires the calendar engine.
 */
export function TodayDateCard({ dateLabel, className }: TodayDateCardProps) {
  return (
    <Card className={cn("flex w-70 min-h-28 flex-col", className)}>
      <div className="bg-brand text-text-onbrand text-small flex h-8 items-center justify-center uppercase">
        Today&apos;s Date:
      </div>
      <div className="text-text text-body-strong flex flex-1 items-center justify-center">
        {dateLabel}
      </div>
    </Card>
  );
}

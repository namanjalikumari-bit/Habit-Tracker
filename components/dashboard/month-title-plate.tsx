import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MonthTitlePlateProps {
  monthName: string;
  year: number;
  className?: string;
}

/** Large centered "DECEMBER 2024" plate (Master-Design-Spec §5/§28 #5). */
export function MonthTitlePlate({
  monthName,
  year,
  className,
}: MonthTitlePlateProps) {
  return (
    <Card
      className={cn(
        "text-text flex min-h-28 items-center justify-center",
        className,
      )}
    >
      <h2 className="text-display-l uppercase">
        {monthName} {year}
      </h2>
    </Card>
  );
}

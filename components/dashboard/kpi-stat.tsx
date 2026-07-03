import { cn } from "@/lib/utils";

interface KpiStatProps {
  variant: "completed" | "uncompleted";
  label: string;
  value: number;
  className?: string;
}

/**
 * Hero KPI counter — "Total Habits Completed" (green) / "Total Habits
 * Uncompleted" (red) (Master-Design-Spec §2/§16/§28 #7/#8). The largest
 * element on the page by design.
 */
export function KpiStat({ variant, label, value, className }: KpiStatProps) {
  const labelColor =
    variant === "completed" ? "text-brand-accent" : "text-danger";

  return (
    <div className={cn("flex flex-col", className)}>
      <span className={cn("text-h3", labelColor)}>{label}</span>
      <span className="text-display-xl text-text">{value}</span>
    </div>
  );
}

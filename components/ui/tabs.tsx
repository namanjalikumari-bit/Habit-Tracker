import { cn } from "@/lib/utils";

export interface TabItem {
  key: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  activeKey: string;
  className?: string;
}

/**
 * Static, presentational-only screen tab bar (Master-Design-Spec §5,
 * §28 #25). Navigation wiring (routing, click handling) lands in A3-T21 —
 * this renders the reference's bottom tab bar with the active tab
 * underlined, nothing more.
 */
export function Tabs({ items, activeKey, className }: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Screens"
      className={cn("flex items-center gap-6", className)}
    >
      {items.map((item) => {
        const isActive = item.key === activeKey;
        return (
          <span
            key={item.key}
            role="tab"
            aria-selected={isActive}
            className={cn(
              "text-body h-10 cursor-default border-b-2 px-1 pt-2",
              isActive
                ? "border-progress text-text font-bold"
                : "text-disabled border-transparent",
            )}
          >
            {item.label}
          </span>
        );
      })}
    </div>
  );
}

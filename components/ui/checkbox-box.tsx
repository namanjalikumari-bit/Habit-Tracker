import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export type DayCheckboxState = "checked" | "unchecked" | "future" | "inactive";

interface CheckboxBoxProps {
  state: DayCheckboxState;
  className?: string;
}

/**
 * Visual-only day checkbox (Master-Design-Spec §14). "unchecked" and
 * "future" render identically per spec — the distinction is behavioural,
 * introduced when A2 wires real toggling. Purely decorative in A1: no
 * click handling, no ARIA-checkbox role yet (that lands with real
 * interactivity/keyboard support in A2/A3).
 */
export function CheckboxBox({ state, className }: CheckboxBoxProps) {
  if (state === "inactive") {
    return (
      <span aria-hidden="true" className={cn("block h-[18px] w-[18px]", className)} />
    );
  }

  const isChecked = state === "checked";

  return (
    <span
      aria-hidden="true"
      className={cn(
        "rounded-checkbox flex h-[18px] w-[18px] items-center justify-center border-[1.5px]",
        isChecked
          ? "border-check-mark bg-check-mark"
          : "border-border-checkbox bg-transparent",
        className,
      )}
    >
      {isChecked && (
        <Check
          className="motion-safe:animate-check-pop h-3 w-3 stroke-[3] text-white"
          aria-hidden="true"
        />
      )}
    </span>
  );
}

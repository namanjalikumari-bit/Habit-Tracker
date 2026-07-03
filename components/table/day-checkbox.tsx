"use client";

import { CheckboxBox } from "@/components/ui/checkbox-box";
import { cn } from "@/lib/utils";

interface DayCheckboxProps {
  checked: boolean;
  cellBg: string;
  ariaLabel: string;
  /** Roving tabindex: 0 for the active cell, -1 otherwise (Architecture §20). */
  tabIndex: number;
  dataCell: string;
  onPointerDownCell: () => void;
  onPointerEnterCell: () => void;
}

/**
 * Interactive day checkbox. Reuses the static `CheckboxBox` glyph so the
 * appearance is byte-identical to A1; the surrounding <button> adds toggle,
 * drag-paint, keyboard focus and ARIA without changing the visuals.
 *
 * Mouse/touch is handled via pointer events (enabling drag-paint); keyboard
 * toggling is handled by the grid container's keydown so there is no
 * double-fire. The focus ring is inset and only appears on keyboard focus.
 */
export function DayCheckbox({
  checked,
  cellBg,
  ariaLabel,
  tabIndex,
  dataCell,
  onPointerDownCell,
  onPointerEnterCell,
}: DayCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
      data-cell={dataCell}
      onPointerDown={(e) => {
        e.preventDefault();
        onPointerDownCell();
      }}
      onPointerEnter={onPointerEnterCell}
      className={cn(
        "flex h-10 w-8 shrink-0 items-center justify-center",
        "focus-visible:ring-instruction focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset",
        cellBg,
      )}
    >
      <CheckboxBox state={checked ? "checked" : "unchecked"} />
    </button>
  );
}

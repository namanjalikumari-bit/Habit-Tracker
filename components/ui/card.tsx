import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Flat, square-cornered container — the reference's recurring "thin
 * border, white body, no shadow" recipe (Master-Design-Spec §11).
 */
export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "border-border-strong bg-surface rounded-none border",
        className,
      )}
    >
      {children}
    </div>
  );
}

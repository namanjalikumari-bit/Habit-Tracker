"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const SCREENS = [
  { label: "1. Instructions", href: "/instructions" },
  { label: "2. Example", href: "/" },
  { label: "3. Empty Template", href: "/empty-template" },
];

/**
 * Screen navigation (Master-Design-Spec §5). Real routing via next/link;
 * the active tab is underlined in purple exactly as A1. Anchors are
 * natively keyboard-accessible.
 */
export function ScreenTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="Screens" className="flex items-center gap-6">
      {SCREENS.map((screen) => {
        const isActive = pathname === screen.href;
        return (
          <Link
            key={screen.href}
            href={screen.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "text-body focus-visible:ring-instruction h-10 border-b-2 px-1 pt-2 focus-visible:ring-2 focus-visible:outline-none",
              isActive
                ? "border-progress text-text font-bold"
                : "text-disabled hover:text-text border-transparent",
            )}
          >
            {screen.label}
          </Link>
        );
      })}
    </nav>
  );
}

import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Region } from "@/components/layout/region";
import { ScreenTabs } from "@/components/layout/screen-tabs";

/**
 * Shared page frame: the 1440px shell with the screen tabs pinned at the
 * bottom (Master-Design-Spec §3 Region F). Every route composes its content
 * inside this so navigation is consistent across screens.
 */
export function ScreenFrame({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      {children}
      <Region label="Screen navigation" className="mt-8">
        <ScreenTabs />
      </Region>
    </AppShell>
  );
}

import { DashboardScreen } from "@/components/dashboard/dashboard-screen";
import { ScreenFrame } from "@/components/layout/screen-frame";

/**
 * "3. Empty Template" screen — the same live dashboard bound to the empty
 * starter sheet (January 2025, 9 empty habit rows).
 */
export default function EmptyTemplatePage() {
  return (
    <ScreenFrame>
      <DashboardScreen sheetId="empty-template" />
    </ScreenFrame>
  );
}

import { DashboardScreen } from "@/components/dashboard/dashboard-screen";
import { ScreenFrame } from "@/components/layout/screen-frame";

/**
 * "2. Example" screen (home) — the live, interactive dashboard seeded with
 * the December-2024 reference data.
 */
export default function Home() {
  return (
    <ScreenFrame>
      <DashboardScreen sheetId="example" />
    </ScreenFrame>
  );
}

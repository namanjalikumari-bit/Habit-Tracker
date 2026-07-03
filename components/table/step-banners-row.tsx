import { StepBanner } from "@/components/ui/step-banner";

import { COLUMN_WIDTHS } from "./column-widths";

/**
 * STEP 2/3/4 banners, column-aligned to the grid below (Master-Design-Spec
 * §3/§21/§28 #12): STEP 2 spans S/N+HABITS, STEP 3 spans the 5-week block,
 * STEP 4 spans TASKS+TOTAL.
 */
export function StepBannersRow() {
  return (
    <div className="flex w-full">
      <div className={`flex ${COLUMN_WIDTHS.serialPlusHabits}`}>
        <StepBanner className="w-full">
          Step 2: Enter your daily habits for the month!
        </StepBanner>
      </div>
      <div className={`flex ${COLUMN_WIDTHS.days}`}>
        <StepBanner className="w-full">
          Step 3: Check off completed habits by clicking the checkbox!
        </StepBanner>
      </div>
      <div className={`flex ${COLUMN_WIDTHS.tasksPlusTotal}`}>
        <StepBanner className="w-full">
          Step 4: Lastly, view your progress! :)
        </StepBanner>
      </div>
    </div>
  );
}

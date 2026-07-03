import { CheckboxBox } from "@/components/ui/checkbox-box";

const STEPS = [
  "Enter your Year and Month in Cells B5 & B6.",
  "Enter your habits in Cells B23-B32. You can have up to 10 habits!",
  "Check off your habits by ticking the boxes. Do this daily!",
  "View all your progress through the progress bars and graphs!",
];

/**
 * "1. Instructions" screen (Master-Design-Spec §3.1 / §28 #26–#30).
 * Reproduces the reference Instructions sheet verbatim — the light-blue
 * header band, the four numbered steps, the orange "IMPORTANT TIP", demo
 * checkboxes, and the contact line.
 */
export function InstructionsScreen() {
  return (
    <div className="border-border-strong max-w-3xl border">
      <div className="bg-instr-band text-text text-h3 px-4 py-2">
        How to use this Smart Habit Tracker:
      </div>

      <ol className="flex flex-col gap-3 px-4 py-4">
        {STEPS.map((step, i) => (
          <li key={i} className="text-body text-text">
            {i + 1}. {step}
          </li>
        ))}
      </ol>

      <div className="bg-tip text-text-onbrand text-label-lg px-4 py-2 uppercase">
        *Important Tip*
      </div>
      <p className="text-body text-text px-4 py-3">
        Highlight multiple checkboxes and press &quot;Spacebar&quot; to check
        them all at the same time!
      </p>

      <div
        aria-hidden="true"
        className="border-border-hairline flex gap-2 border-t px-4 py-3"
      >
        <CheckboxBox state="checked" />
        <CheckboxBox state="checked" />
        <CheckboxBox state="unchecked" />
        <CheckboxBox state="checked" />
        <CheckboxBox state="unchecked" />
      </div>

      <div className="border-border-hairline flex flex-col gap-1 border-t px-4 py-3">
        <span className="text-h3 text-brand-accent">
          Video Tutorial (Highly Recommend to Watch)
        </span>
        <span className="text-body text-text">
          Watch the full walkthrough on YouTube — @championchallandertech.
        </span>
      </div>

      <div className="border-border-hairline text-body text-text border-t px-4 py-3">
        If you have any questions about this template, kindly contact me at:{" "}
        <a
          href="mailto:championchallander@gmail.com"
          className="text-instruction underline"
        >
          championchallander@gmail.com
        </a>
      </div>
    </div>
  );
}

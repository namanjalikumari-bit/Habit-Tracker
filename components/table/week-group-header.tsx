const WEEK_LABELS = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];

/** "WEEK 1"…"WEEK 5" group header cells, each spanning 7 day-slots (224px). */
export function WeekGroupHeader() {
  return (
    <div className="flex w-280 shrink-0">
      {WEEK_LABELS.map((label) => (
        <div
          key={label}
          className="text-text-onbrand text-label-lg border-border-hairline flex h-8 w-56 shrink-0 items-center justify-center border-r uppercase last:border-r-0"
        >
          {label}
        </div>
      ))}
    </div>
  );
}

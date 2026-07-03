interface RingProps {
  /** 0–100, the portion rendered in `progressColor`. */
  percent: number;
  /** Diameter in px. */
  size?: number;
  strokeWidth?: number;
  /** Any valid CSS color string, e.g. `var(--color-danger)`. */
  trackColor?: string;
  progressColor?: string;
  className?: string;
}

/**
 * Generic SVG progress ring — the low-level primitive behind
 * `<ProgressRing>` (Master-Design-Spec §15). Starts at 12 o'clock and
 * sweeps clockwise. Carries no domain logic (labels, states); that lives
 * in the chart-level component that composes this.
 */
export function Ring({
  percent,
  size = 180,
  strokeWidth = 28,
  trackColor = "var(--color-danger)",
  progressColor = "var(--color-success)",
  className,
}: RingProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressLength = (clamped / 100) * circumference;
  const center = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="presentation"
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />
      {clamped > 0 && (
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${progressLength} ${circumference - progressLength}`}
          strokeLinecap="butt"
          transform={`rotate(-90 ${center} ${center})`}
        />
      )}
    </svg>
  );
}

/**
 * Chart axis derivation (Master-Design-Spec §12). Keeps the December-2024
 * cumulative chart at the reference's [0,200] / [0,50,100,150,200] while
 * scaling sensibly for any month, and reproduces the empty-state 0.00–1.00
 * axis when nothing is checked.
 */

export interface AxisConfig {
  domain: [number, number];
  ticks: number[];
}

export function cumulativeYAxis(maxValue: number): AxisConfig {
  if (maxValue <= 0) {
    return { domain: [0, 1], ticks: [0, 0.25, 0.5, 0.75, 1] };
  }
  const rough = maxValue / 4;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const normalized = rough / magnitude;
  let step: number;
  if (normalized <= 1) step = magnitude;
  else if (normalized <= 2) step = 2 * magnitude;
  else if (normalized <= 2.5) step = 2.5 * magnitude;
  else if (normalized <= 5) step = 5 * magnitude;
  else step = 10 * magnitude;

  const niceMax = Math.ceil(maxValue / step) * step;
  const ticks: number[] = [];
  for (let t = 0; t <= niceMax + 1e-9; t += step) {
    ticks.push(Math.round(t * 100) / 100);
  }
  return { domain: [0, niceMax], ticks };
}

export const DAILY_Y_AXIS: AxisConfig = {
  domain: [0, 100],
  ticks: [0, 25, 50, 75, 100],
};

export function dailyXTicks(dim: number): number[] {
  return [5, 10, 15, 20, 25, 30].filter((t) => t <= dim);
}

export function cumulativeXTicks(dim: number): number[] {
  return [10, 20, 30].filter((t) => t <= dim);
}

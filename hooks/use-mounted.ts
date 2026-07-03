"use client";

import { useEffect, useState } from "react";

/**
 * Returns false during SSR + the first client render, true after mount.
 * Used to gate client-only widgets (charts) behind a deterministic
 * skeleton so hydration never mismatches.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

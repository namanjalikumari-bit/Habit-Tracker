"use client";

import { useEffect } from "react";

import { useHabitStore } from "@/store/habit-store";

/**
 * Loads any persisted state from the repository once, on mount. Rendered in
 * the root layout so hydration happens a single time for every route. It
 * renders nothing — the store is initialised with the seed, so content is
 * visible immediately and simply updates if saved data exists.
 */
export function StoreHydrator() {
  useEffect(() => {
    useHabitStore.getState().hydrateFromStorage();
  }, []);
  return null;
}

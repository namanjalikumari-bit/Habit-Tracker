"use client";

import { useEffect, type ReactNode } from "react";

import { AccountBar } from "@/components/auth/account-bar";
import { AuthLoading } from "@/components/auth/auth-loading";
import {
  configureCloudMode,
  configureLocalMode,
  deactivateSync,
} from "@/lib/sync/sync-controller";
import { useHabitStore } from "@/store/habit-store";

/**
 * LOCAL mode wrapper (Supabase not configured). Hydrates the store from
 * localStorage and renders the dashboard immediately — this is exactly the
 * Gate 1 behaviour, with no auth and no cloud.
 */
export function LocalMode({ children }: { children: ReactNode }) {
  useEffect(() => {
    void configureLocalMode();
  }, []);
  return <>{children}</>;
}

/**
 * CLOUD mode wrapper (signed in). Configures the Supabase repository for the
 * user (migrating/seeding on first login) and shows a tiny loading state only
 * until the first cloud hydration completes — never the seed data, so there's
 * no flash of the wrong content. Then renders the unchanged dashboard with a
 * slim account bar above it.
 */
export function CloudMode({
  userId,
  children,
}: {
  userId: string;
  children: ReactNode;
}) {
  const hydrated = useHabitStore((s) => s.hydrated);

  useEffect(() => {
    let cancelled = false;
    void configureCloudMode(userId, () => cancelled);
    return () => {
      cancelled = true;
      deactivateSync();
    };
  }, [userId]);

  if (!hydrated) return <AuthLoading />;

  return (
    <>
      <AccountBar />
      {children}
    </>
  );
}

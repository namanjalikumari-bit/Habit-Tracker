"use client";

import type { ReactNode } from "react";

import { CloudMode, LocalMode } from "@/components/providers/data-mode";

import { AuthLoading } from "./auth-loading";
import { AuthScreen } from "./auth-screen";
import { useAuth } from "./auth-provider";

/**
 * App gate (PRD A6 #4).
 *
 *  - Supabase NOT configured → LOCAL mode: no auth wall, localStorage data —
 *    exactly the Gate 1 experience. This is the localStorage fallback.
 *  - Supabase configured → require sign-in. Logged-out users get the clean
 *    auth screen; logged-in users get the unchanged dashboard, now backed by
 *    their own cloud data (CloudMode handles hydration/migration).
 *
 * In every case the dashboard subtree (children) is the byte-for-byte Gate 1
 * UI — this component only decides what wraps it.
 */
export function ProtectedApp({ children }: { children: ReactNode }) {
  const { user, loading, configured } = useAuth();

  if (!configured) return <LocalMode>{children}</LocalMode>;
  if (loading) return <AuthLoading />;
  if (!user) return <AuthScreen />;

  return <CloudMode userId={user.id}>{children}</CloudMode>;
}

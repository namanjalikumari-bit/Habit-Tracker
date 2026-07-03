"use client";

import { useState } from "react";

import { useSyncRestoredToast } from "@/components/ui/toast";
import { useHabitStore } from "@/store/habit-store";

import { useAuth } from "./auth-provider";

/**
 * Slim account strip with a sync indicator, the signed-in email, and a log-out
 * control (PRD A6 #3, #9).
 *
 * This is app chrome that sits ABOVE the dashboard — it does not modify any
 * dashboard region (colors, spacing, charts, table, typography, hierarchy are
 * all unchanged). The sync indicator is intentionally tiny and only appears
 * while saving or after a failure — never a full-page blocking loader.
 */
function SyncIndicator() {
  const syncStatus = useHabitStore((s) => s.syncStatus);
  const syncError = useHabitStore((s) => s.syncError);
  const retrySync = useHabitStore((s) => s.retrySync);

  if (syncStatus === "saving") {
    return (
      <span className="text-small text-disabled normal-case" aria-live="polite">
        Saving…
      </span>
    );
  }

  if (syncStatus === "error") {
    return (
      <span className="flex items-center gap-2" aria-live="polite">
        <span className="text-small text-danger normal-case">
          {syncError ?? "Couldn't sync your changes."}
        </span>
        <button
          type="button"
          onClick={retrySync}
          className="text-small text-instruction focus-visible:ring-instruction uppercase underline transition-opacity hover:opacity-80 active:opacity-60 focus-visible:ring-2 focus-visible:outline-none motion-safe:duration-150"
        >
          Retry
        </button>
      </span>
    );
  }

  return null;
}

export function AccountBar() {
  const { user, signOut } = useAuth();
  const syncStatus = useHabitStore((s) => s.syncStatus);
  useSyncRestoredToast(syncStatus);
  const [busy, setBusy] = useState(false);

  const onLogout = async () => {
    setBusy(true);
    await signOut();
    // AuthProvider flips back to the auth screen automatically on sign-out.
  };

  return (
    <div className="mx-auto flex max-w-[1872px] items-center justify-end gap-3 px-6 pt-4">
      <SyncIndicator />
      {user?.email && (
        <span className="text-small text-disabled normal-case">
          {user.email}
        </span>
      )}
      <button
        type="button"
        onClick={onLogout}
        disabled={busy}
        className="text-small text-instruction focus-visible:ring-instruction uppercase underline transition-opacity hover:opacity-80 active:opacity-60 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-70 motion-safe:duration-150"
      >
        {busy ? "Logging out…" : "Log out"}
      </button>
    </div>
  );
}

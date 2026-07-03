"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type Tone = "success" | "error";
interface Toast {
  id: number;
  message: string;
  tone: Tone;
}

interface ToastContextValue {
  show: (message: string, tone?: Tone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DISMISS_MS = 2600;

/**
 * Tiny, non-blocking toast system for success/status feedback (A7 #7). Toasts
 * appear bottom-center, auto-dismiss, and never cover the dashboard content or
 * shift layout. Entry animation is motion-safe only.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const show = useCallback((message: string, tone: Tone = "success") => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, DISMISS_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={cn(
              "text-small shadow-elevation-1 pointer-events-auto max-w-full rounded-none border px-4 py-2 normal-case motion-safe:animate-toast-in",
              toast.tone === "success"
                ? "border-brand bg-surface text-text"
                : "border-danger bg-surface text-danger",
            )}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** Returns a no-op if used outside a provider, so callers never crash. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  return ctx ?? { show: () => {} };
}

/**
 * Fires a toast when background sync recovers from an error state
 * (error → idle). Mounted inside the account bar; renders nothing.
 */
export function useSyncRestoredToast(syncStatus: string) {
  const { show } = useToast();
  const prev = useRef(syncStatus);
  useEffect(() => {
    if (prev.current === "error" && syncStatus === "idle") {
      show("Changes synced.", "success");
    }
    prev.current = syncStatus;
  }, [syncStatus, show]);
}

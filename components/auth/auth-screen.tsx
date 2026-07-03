"use client";

import { useState, type FormEvent } from "react";

import { AppTitleBlock } from "@/components/dashboard/app-title-block";
import { cn } from "@/lib/utils";

import { useAuth } from "./auth-provider";

type Mode = "signin" | "signup";

/**
 * Clean login / sign-up screen shown to logged-out users (PRD A6 #4).
 * A new screen — it does NOT alter the dashboard. It reuses the existing
 * design tokens (brand green, flat, square, Roboto) so it feels native, and
 * is centered + fluid so it works on desktop, Android and iPhone.
 */
export function AuthScreen() {
  const { signIn, signUp, configured } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setInfo(null);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!email.trim()) return setError("Please enter your email address.");
    if (password.length < 6)
      return setError("Your password needs to be at least 6 characters.");

    setSubmitting(true);
    const result =
      mode === "signin"
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.needsEmailConfirmation) {
      setInfo("Almost there! Check your email to confirm your account, then sign in.");
      setMode("signin");
      setPassword("");
    }
    // On success with a session, AuthProvider flips to the dashboard automatically.
  };

  const inputClass =
    "border-border-strong text-body text-text focus-visible:ring-instruction h-11 w-full rounded-none border bg-surface px-3 outline-none focus-visible:ring-2 focus-visible:ring-inset";
  const tabClass = (active: boolean) =>
    cn(
      "text-label h-10 flex-1 uppercase transition-colors motion-safe:duration-150",
      active
        ? "bg-brand text-text-onbrand"
        : "bg-surface text-disabled hover:text-text border-border-strong border",
    );

  return (
    <main className="bg-surface flex min-h-screen w-full items-center justify-center p-4">
      <div className="border-border-strong w-full max-w-sm border">
        <AppTitleBlock />

        <div className="flex">
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className={tabClass(mode === "signin")}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={tabClass(mode === "signup")}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-3 p-4">
          <label className="flex flex-col gap-1">
            <span className="text-small text-text uppercase">Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              disabled={submitting}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-small text-text uppercase">Password</span>
            <input
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              disabled={submitting}
            />
          </label>

          {error && (
            <p role="alert" className="text-body text-danger">
              {error}
            </p>
          )}
          {info && (
            <p role="status" className="text-body text-brand-accent">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="bg-brand text-text-onbrand text-label focus-visible:ring-instruction h-11 w-full rounded-none uppercase transition-[filter,opacity] hover:brightness-105 active:brightness-95 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-70 motion-safe:duration-150"
          >
            {submitting
              ? mode === "signin"
                ? "Signing in…"
                : "Creating account…"
              : mode === "signin"
                ? "Sign in"
                : "Create account"}
          </button>

          {!configured && (
            <p className="text-xs text-disabled">
              Authentication isn&apos;t configured yet
              {process.env.NODE_ENV !== "production"
                ? " — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local."
                : "."}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}

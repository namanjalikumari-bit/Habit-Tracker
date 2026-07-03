"use client";

import type { User } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useToast } from "@/components/ui/toast";
import {
  AUTH_NOT_CONFIGURED_MESSAGE,
  friendlyAuthError,
} from "@/lib/auth/error-messages";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

export interface AuthResult {
  error: string | null;
  /** Sign-up succeeded but the user must confirm their email before signing in. */
  needsEmailConfirmation?: boolean;
}

interface AuthContextValue {
  user: User | null;
  /** True only while the initial session check is in flight. */
  loading: boolean;
  /** False when Supabase env vars are missing. */
  configured: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Auth session provider (PRD A6). Uses the Supabase browser client for
 * sign-up / sign-in / sign-out and keeps the session in sync via
 * `onAuthStateChange`. Session persistence is handled by Supabase's own
 * cookie storage, so a page reload restores the session automatically.
 *
 * Habit data is deliberately NOT touched here — it stays in local storage
 * until Prompt 2 wires the SupabaseHabitRepository (see lib/supabase/client.ts).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { show } = useToast();
  const [client] = useState(() => getSupabaseBrowserClient());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Derived from env (inlined on both server and client) so the value is
  // stable across SSR/hydration — avoids a mismatch in the top-level gate.
  // `client` is still null during SSR; it's only used in client-side effects.
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!client) {
      // Not configured (or SSR): nothing to check, don't block the UI.
      setLoading(false);
      return;
    }

    let active = true;

    client.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [client]);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    if (!client) return { error: AUTH_NOT_CONFIGURED_MESSAGE };
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (!error) show("Signed in. Welcome back!", "success");
    return { error: error ? friendlyAuthError(error.message) : null };
  };

  const signUp = async (email: string, password: string): Promise<AuthResult> => {
    if (!client) return { error: AUTH_NOT_CONFIGURED_MESSAGE };
    const { data, error } = await client.auth.signUp({ email, password });
    if (error) return { error: friendlyAuthError(error.message) };
    // If the project requires email confirmation there is no active session yet.
    if (data.session) show("Account created. You're all set!", "success");
    return { error: null, needsEmailConfirmation: !data.session };
  };

  const signOut = async () => {
    if (!client) return;
    await client.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, configured, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase browser client — used for both auth and cloud habit data (A6).
 *
 * Env vars (set in `.env.local` locally and in the Vercel project settings):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * The authenticated session's JWT is sent with every PostgREST request, so
 * Row Level Security (auth.uid()) scopes all reads/writes to the current user.
 * `data/supabase-habit-repository.ts` uses this client; `lib/sync/sync-
 * controller.ts` wires it into the store on login. See docs/Supabase-Setup.md.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True once both env vars are present — used to show a clean "not configured" state. */
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

let browserClient: SupabaseClient | null = null;

/**
 * Returns a singleton browser client, or null when running on the server or
 * when Supabase is not configured. Guarded so builds never fail without env.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  if (!browserClient) {
    browserClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return browserClient;
}

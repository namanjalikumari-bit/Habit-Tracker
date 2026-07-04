import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase browser client — used for both auth and cloud habit data (A6).
 *
 * Env vars (set in `.env.local` locally and in the Vercel project settings):
 *   NEXT_PUBLIC_SUPABASE_URL      → the BASE project URL, e.g.
 *                                    https://YOUR-PROJECT.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * The authenticated session's JWT is sent with every PostgREST request, so
 * Row Level Security (auth.uid()) scopes all reads/writes to the current user.
 * `data/supabase-habit-repository.ts` uses this client; `lib/sync/sync-
 * controller.ts` wires it into the store on login. See docs/Supabase-Setup.md.
 */

/**
 * Supabase needs the BASE project URL (…supabase.co). A very common misconfig
 * is pasting the REST endpoint (…supabase.co/rest/v1/) instead — the client
 * then builds auth URLs like `/rest/v1/auth/v1/signup` which 404. We sanitise
 * the value so a trailing slash or a `/rest/v1` (or `/auth/v1`) suffix can
 * never break auth again.
 */
function sanitizeSupabaseUrl(raw: string | undefined): string | undefined {
  if (!raw) return raw;
  return raw
    .trim()
    .replace(/\/+$/, "") // trailing slashes
    .replace(/\/(rest|auth|storage|realtime)\/v\d+$/i, "") // stray API path
    .replace(/\/+$/, "");
}

const SUPABASE_URL = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

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

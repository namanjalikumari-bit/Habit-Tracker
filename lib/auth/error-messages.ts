/**
 * Translates raw Supabase auth failures into short, plain-language messages
 * (PRD A6 requirement #7). Maps by the error `code` (most reliable) first,
 * then message text, then HTTP status — so users never see a raw Supabase
 * error, and each known case gets a specific, actionable message.
 *
 * Accepts the whole error object (AuthError has `.code`, `.status`,
 * `.message`), a thrown network error, or a plain string.
 */
interface AuthErrorLike {
  message?: string;
  code?: string;
  status?: number;
  name?: string;
}

export function friendlyAuthError(error: unknown): string {
  const e: AuthErrorLike =
    typeof error === "string"
      ? { message: error }
      : ((error as AuthErrorLike) ?? {});

  const code = (e.code ?? "").toLowerCase();
  const msg = (e.message ?? "").toLowerCase();
  const name = (e.name ?? "").toLowerCase();
  const status = e.status ?? 0;
  const has = (...subs: string[]) =>
    subs.some((s) => code.includes(s) || msg.includes(s) || name.includes(s));

  // Network / offline — thrown fetch failures (no HTTP status).
  if (has("failed to fetch", "networkerror", "load failed", "err_network")) {
    return "Can't reach the server. Check your internet connection and try again.";
  }

  // Email already registered → point them to Sign In.
  if (has("user_already_exists", "already registered", "already been registered")) {
    return "An account with this email already exists — try signing in instead.";
  }

  // Wrong email/password on sign in.
  if (has("invalid_credentials", "invalid login credentials")) {
    return "The email or password you entered is incorrect.";
  }

  // Weak password.
  if (
    has(
      "weak_password",
      "password should be at least",
      "password should contain",
    )
  ) {
    return "Please choose a stronger password (at least 6 characters).";
  }

  // Invalid email address.
  if (
    has(
      "validation_failed",
      "unable to validate email",
      "invalid format",
      "invalid email",
    )
  ) {
    return "Please enter a valid email address.";
  }

  // Email not confirmed yet.
  if (has("email_not_confirmed", "email not confirmed")) {
    return "Please confirm your email address first — check your inbox, then sign in.";
  }

  // Rate limits (too many attempts / email sends).
  if (
    has(
      "over_email_send_rate_limit",
      "over_request_rate_limit",
      "rate limit",
      "too many",
    )
  ) {
    return "Too many attempts. Please wait a minute and try again.";
  }

  // Sign-ups disabled on the project.
  if (
    has(
      "signup_disabled",
      "signups not allowed",
      "email signups are disabled",
      "email logins are disabled",
    )
  ) {
    return "New sign-ups are currently disabled for this app.";
  }

  // Server / database errors (e.g. profile-creation trigger hiccup).
  if (has("unexpected_failure", "database error") || status >= 500) {
    return "Our server had a hiccup while creating your account. Please try again in a moment.";
  }

  return "Something went wrong. Please try again.";
}

/** Shown when the two Supabase env vars are missing. */
export const AUTH_NOT_CONFIGURED_MESSAGE =
  "Sign-in is temporarily unavailable. Please try again later.";

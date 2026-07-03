/**
 * Translates raw Supabase auth errors into short, plain-language messages
 * (PRD A6 requirement #7). Anything unrecognised falls back to a generic,
 * non-alarming message.
 */
export function friendlyAuthError(message?: string | null): string {
  if (!message) return "Something went wrong. Please try again.";
  const m = message.toLowerCase();

  if (m.includes("invalid login credentials")) {
    return "The email or password you entered is incorrect.";
  }
  if (m.includes("email not confirmed")) {
    return "Please confirm your email address, then sign in.";
  }
  if (m.includes("already registered") || m.includes("already been registered")) {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (m.includes("password should be at least")) {
    return "Your password needs to be at least 6 characters.";
  }
  if (m.includes("unable to validate email") || m.includes("invalid format")) {
    return "Please enter a valid email address.";
  }
  if (m.includes("rate limit") || m.includes("too many")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  if (m.includes("network") || m.includes("failed to fetch")) {
    return "Can't reach the server. Check your connection and try again.";
  }
  return "Something went wrong. Please try again.";
}

/** Shown when the two Supabase env vars are missing. */
export const AUTH_NOT_CONFIGURED_MESSAGE =
  "Sign-in is temporarily unavailable. Please try again later.";

/** Plain-language messages for background-sync failures (A6 requirement #8/#9). */
export function friendlySyncError(error: unknown): string {
  const message =
    error instanceof Error
      ? error.message.toLowerCase()
      : String(error ?? "").toLowerCase();

  if (message.includes("network") || message.includes("failed to fetch")) {
    return "You're offline — changes are saved on this device and will sync when you're back online.";
  }
  if (message.includes("jwt") || message.includes("token") || message.includes("401")) {
    return "Your session expired. Please sign in again to keep syncing.";
  }
  return "Couldn't save your latest changes to the cloud. They're safe on this device — we'll retry.";
}

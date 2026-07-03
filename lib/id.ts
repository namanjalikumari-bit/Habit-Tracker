/** Stable unique id generator (uuid where available). Used for new habits
 * and when re-keying seeded/migrated data to database-safe uuids. */
export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `h-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

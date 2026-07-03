import { Skeleton } from "@/components/ui/skeleton";

/**
 * Minimal loading state shown only while the initial session check is in
 * flight (PRD A6 #6). Session restoration reads from local cookies and is
 * near-instant, so this is intentionally tiny — no full-screen blocking
 * spinner.
 */
export function AuthLoading() {
  return (
    <main className="bg-surface flex min-h-screen w-full items-center justify-center p-4">
      <Skeleton className="h-11 w-64" />
    </main>
  );
}

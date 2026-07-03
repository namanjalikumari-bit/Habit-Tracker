"use client";

/** Route-level error boundary (Architecture §21). */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <p className="text-h3 text-text">Something went wrong.</p>
      <button
        type="button"
        onClick={reset}
        className="bg-brand text-text-onbrand text-label focus-visible:ring-instruction px-4 py-2 uppercase focus-visible:ring-2 focus-visible:outline-none"
      >
        Try again
      </button>
    </main>
  );
}

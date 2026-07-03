import Link from "next/link";

/** 404 page (Architecture §21). */
export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <p className="text-h3 text-text">Page not found.</p>
      <Link
        href="/"
        className="text-instruction text-body underline"
      >
        Back to the tracker
      </Link>
    </main>
  );
}

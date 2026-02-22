'use client';

import Link from 'next/link';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">Could not load organisation</h1>
        <p className="text-gray-600 mb-6">
          We are having trouble loading this organisation&apos;s details. Please try again or go back to search.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="btn-base btn-primary"
          >
            Try again
          </button>
          <Link
            href="/find-help"
            className="btn-base btn-neutral"
          >
            Back to Find Help
          </Link>
        </div>
      </div>
    </div>
  );
}

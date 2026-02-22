'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">Could not load location</h1>
        <p className="text-gray-600 mb-6">
          We are having trouble loading this location page. Please try again or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="btn-base btn-primary"
          >
            Try again
          </button>
          <Link
            href="/"
            className="btn-base btn-neutral"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

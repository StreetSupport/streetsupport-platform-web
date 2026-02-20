'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-gray-600 mb-6">
          We are having trouble loading this page. Please try again.
        </p>
        <button
          onClick={reset}
          className="btn-base btn-primary"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

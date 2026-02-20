import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="px-4 py-6 max-w-4xl mx-auto">
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Organisation Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We could not find the organisation you are looking for. It may have been removed or the address may be incorrect.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/find-help"
            className="btn-base btn-primary"
          >
            Find Help
          </Link>
          <Link
            href="/"
            className="btn-base btn-neutral"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}

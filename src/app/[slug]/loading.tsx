export default function Loading() {
  return (
    <main>
      {/* Breadcrumbs skeleton */}
      <div className="bg-brand-n py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2">
            <div className="bg-white/30 animate-pulse h-4 w-12 rounded" />
            <span className="text-white/30">/</span>
            <div className="bg-white/30 animate-pulse h-4 w-28 rounded" />
          </div>
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="bg-gray-200 animate-pulse h-64 w-full" />

      {/* Emergency contact skeleton */}
      <div className="py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-200 animate-pulse h-12 w-full rounded-lg" />
        </div>
      </div>

      {/* Find support section skeleton */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="bg-gray-200 animate-pulse h-7 w-64 rounded mx-auto mb-4" />
            <div className="bg-gray-200 animate-pulse h-4 w-96 max-w-full rounded mx-auto mb-2" />
            <div className="bg-gray-200 animate-pulse h-4 w-80 max-w-full rounded mx-auto" />
          </div>
          {/* Filter and results area skeleton */}
          <div className="bg-gray-200 animate-pulse h-12 w-full rounded-lg mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-200 animate-pulse h-96 rounded-lg" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-200 animate-pulse h-20 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics and news skeleton */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="bg-gray-200 animate-pulse h-6 w-32 rounded mb-4" />
            <div className="bg-gray-200 animate-pulse h-48 rounded-lg" />
          </div>
          <div>
            <div className="bg-gray-200 animate-pulse h-6 w-24 rounded mb-4" />
            <div className="bg-gray-200 animate-pulse h-48 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Get in touch skeleton */}
      <div className="bg-gray-200 animate-pulse h-24 w-full" />

      {/* Supporter logos skeleton */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 animate-pulse h-16 w-32 rounded" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

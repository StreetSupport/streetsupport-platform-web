export default function Loading() {
  return (
    <>
      {/* Breadcrumbs skeleton */}
      <div className="bg-brand-n py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2">
            <div className="bg-white/30 animate-pulse h-4 w-12 rounded" />
            <span className="text-white/30">/</span>
            <div className="bg-white/30 animate-pulse h-4 w-24 rounded" />
            <span className="text-white/30">/</span>
            <div className="bg-white/30 animate-pulse h-4 w-40 rounded" />
          </div>
        </div>
      </div>

      {/* Resource content skeleton */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-gray-200 animate-pulse h-8 w-72 rounded mb-4" />
        <div className="bg-gray-200 animate-pulse h-4 w-full rounded mb-2" />
        <div className="bg-gray-200 animate-pulse h-4 w-full rounded mb-2" />
        <div className="bg-gray-200 animate-pulse h-4 w-3/4 rounded mb-6" />

        {/* Resource links skeleton */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="bg-gray-200 animate-pulse h-5 w-56 rounded mb-2" />
              <div className="bg-gray-200 animate-pulse h-4 w-full rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Social share skeleton */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="bg-gray-200 animate-pulse h-8 w-48 rounded" />
      </div>
    </>
  );
}

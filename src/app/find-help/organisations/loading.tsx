export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs skeleton */}
      <div className="bg-brand-n py-4">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-2">
            <div className="bg-white/30 animate-pulse h-4 w-12 rounded" />
            <span className="text-white/30">/</span>
            <div className="bg-white/30 animate-pulse h-4 w-20 rounded" />
            <span className="text-white/30">/</span>
            <div className="bg-white/30 animate-pulse h-4 w-28 rounded" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 pt-8">
        {/* Back link skeleton */}
        <div className="bg-gray-200 animate-pulse h-4 w-32 rounded mb-4" />

        {/* Title skeleton */}
        <div className="mb-6">
          <div className="bg-gray-200 animate-pulse h-8 w-72 rounded mb-2" />
          <div className="bg-gray-200 animate-pulse h-4 w-40 rounded" />
        </div>

        {/* Result cards skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-gray-200 animate-pulse h-6 w-48 rounded" />
                    <div className="bg-gray-200 animate-pulse h-5 w-16 rounded-full" />
                  </div>
                  <div className="bg-gray-200 animate-pulse h-4 w-full rounded mb-1" />
                  <div className="bg-gray-200 animate-pulse h-4 w-2/3 rounded mb-3" />
                  <div className="flex gap-4">
                    <div className="bg-gray-200 animate-pulse h-4 w-16 rounded" />
                    <div className="bg-gray-200 animate-pulse h-4 w-14 rounded" />
                  </div>
                </div>
                <div className="bg-gray-200 animate-pulse h-10 w-28 rounded-md ml-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

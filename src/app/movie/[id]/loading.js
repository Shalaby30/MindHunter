export default function DetailLoading() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero skeleton */}
      <div className="relative h-[60vh] animate-pulse bg-white/5" />

      {/* Content skeleton */}
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex gap-6">
          <div className="h-64 w-44 flex-shrink-0 animate-pulse rounded-lg bg-white/5" />
          <div className="flex-1 space-y-4">
            <div className="h-8 w-64 animate-pulse rounded bg-white/5" />
            <div className="h-4 w-48 animate-pulse rounded bg-white/5" />
            <div className="h-20 w-full animate-pulse rounded bg-white/5" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-white/5" />
              ))}
            </div>
          </div>
        </div>

        {/* Cast row skeleton */}
        <div>
          <div className="mb-4 h-5 w-24 animate-pulse rounded bg-white/5" />
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 text-center">
                <div className="mb-2 h-20 w-20 animate-pulse rounded-full bg-white/5" />
                <div className="h-3 w-16 animate-pulse rounded bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

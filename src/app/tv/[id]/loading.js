export default function TVDetailLoading() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero skeleton */}
      <div className="relative h-[60vh] animate-pulse bg-white/5" />

      {/* Content skeleton */}
      <div className="space-y-6 px-4 py-8 sm:px-6">
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

        {/* Season browser skeleton */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="mb-4 flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-20 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="h-16 w-28 flex-shrink-0 rounded-lg bg-white/5" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 w-20 rounded bg-white/5" />
                  <div className="h-2 w-full rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

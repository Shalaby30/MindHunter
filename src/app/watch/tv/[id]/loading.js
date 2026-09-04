export default function WatchTVLoading() {
  return (
    <div className="min-h-screen pt-24">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6">
        {/* Main content */}
        <div className="flex-1 space-y-4">
          {/* Player skeleton */}
          <div className="aspect-video w-full animate-pulse rounded-xl bg-white/5" />

          {/* Server selector skeleton */}
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 w-20 flex-shrink-0 animate-pulse rounded-full bg-white/5" />
            ))}
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="w-80 flex-shrink-0 space-y-3">
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-8 w-16 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
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

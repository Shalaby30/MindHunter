export default function WatchLoading() {
  return (
    <div className="min-h-screen pt-24">
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:px-6">
        {/* Player skeleton */}
        <div className="aspect-video w-full animate-pulse rounded-xl bg-white/5" />

        {/* Server selector skeleton */}
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-20 flex-shrink-0 animate-pulse rounded-full bg-white/5" />
          ))}
        </div>

        {/* Info skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-48 animate-pulse rounded bg-white/5" />
          <div className="h-3 w-full animate-pulse rounded bg-white/5" />
        </div>
      </div>
    </div>
  );
}

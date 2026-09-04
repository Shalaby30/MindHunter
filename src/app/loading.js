export default function HomeLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="relative h-[80vh] animate-pulse bg-white/5" />

      {/* Content rows skeleton */}
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="mb-4 h-5 w-32 animate-pulse rounded bg-white/5" />
            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="h-40 w-28 flex-shrink-0 animate-pulse rounded-lg bg-white/5 sm:h-56 sm:w-36" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

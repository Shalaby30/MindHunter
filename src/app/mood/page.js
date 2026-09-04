"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Laugh,
  Zap,
  CloudRain,
  Brain,
  Ghost,
  Rocket,
  Users,
  Lightbulb,
  Film,
  Tv,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { TitleCard } from "@/components/title-card";
import { cn } from "@/lib/utils";

const MOOD_ICONS = {
  laugh: Laugh,
  thrill: Zap,
  cry: CloudRain,
  think: Brain,
  scare: Ghost,
  escape: Rocket,
  family: Users,
  learn: Lightbulb,
};

// keep in sync with MOODS in lib/tmdb (labels only, for the picker UI)
const MOOD_LIST = [
  { key: "laugh", label: "Make Me Laugh", tagline: "Comedies and feel-good picks" },
  { key: "thrill", label: "Edge of My Seat", tagline: "Thrillers, crime and suspense" },
  { key: "cry", label: "Need a Good Cry", tagline: "Heavy drama and bittersweet romance" },
  { key: "think", label: "Bend My Mind", tagline: "Mysteries and sci-fi that demand attention" },
  { key: "scare", label: "Scare Me", tagline: "Horror for a lights-on night" },
  { key: "escape", label: "Take Me Away", tagline: "Adventure and fantasy worlds" },
  { key: "family", label: "Family Night", tagline: "Safe picks everyone can enjoy" },
  { key: "learn", label: "Show Me Something Real", tagline: "Documentaries and true stories" },
];

export default function MoodPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mood = searchParams.get("mood") || "";
  const type = searchParams.get("type") || "movie";
  const page = Number(searchParams.get("page") || 1);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const requestId = useRef(0);
  const gridTopRef = useRef(null);

  const setParams = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (!mood) {
      setData(null);
      return;
    }
    const id = ++requestId.current;
    setLoading(true);
    setError(false);

    fetch(`/api/mood?mood=${mood}&type=${type}&page=${page}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((d) => {
        if (requestId.current !== id) return;
        setData(d);
      })
      .catch(() => {
        if (requestId.current === id) setError(true);
      })
      .finally(() => {
        if (requestId.current === id) setLoading(false);
      });
  }, [mood, type, page]);

  const goToPage = (p) => {
    setParams({ page: String(p) });
    gridTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeMood = MOOD_LIST.find((m) => m.key === mood);

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-24 sm:px-6">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What&apos;s your mood tonight?
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Skip the genres. Tell us how you feel, we&apos;ll handle the rest.
          </p>
        </header>

        {/* mood picker */}
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
          {MOOD_LIST.map(({ key, label, tagline }) => {
            const Icon = MOOD_ICONS[key];
            const active = mood === key;
            return (
              <button
                key={key}
                onClick={() => setParams({ mood: key, page: "" })}
                className={cn(
                  "group flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all",
                  active
                    ? "border-accent bg-accent/10"
                    : "border-border bg-card hover:border-foreground/25"
                )}
              >
                <Icon
                  className={cn(
                    "h-7 w-7 transition-colors",
                    active
                      ? "text-accent"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <div>
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      active ? "text-foreground" : "text-foreground/90"
                    )}
                  >
                    {label}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                    {tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* results */}
        {mood && (
          <div ref={gridTopRef} className="mt-10 scroll-mt-24">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold tracking-tight">
                {activeMood?.label}
              </h2>
              <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
                {[
                  { key: "movie", label: "Movies", icon: Film },
                  { key: "tv", label: "TV Shows", icon: Tv },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setParams({ type: key, page: "" })}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                      type === key
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {loading && (
              <div className="flex justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}

            {error && !loading && (
              <p className="py-20 text-center text-sm text-red-400">
                Something went wrong. Please try again.
              </p>
            )}

            {!loading && !error && data && (
              <>
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {data.results.map((item) => (
                    <div
                      key={`${item.mediaType}-${item.id}`}
                      className="flex justify-center"
                    >
                      <TitleCard item={item} />
                    </div>
                  ))}
                </div>

                {data.totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                      onClick={() => goToPage(page - 1)}
                      disabled={page <= 1}
                      aria-label="Previous page"
                      className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-muted-foreground">
                      Page {page} of {data.totalPages}
                    </span>
                    <button
                      onClick={() => goToPage(page + 1)}
                      disabled={page >= data.totalPages}
                      aria-label="Next page"
                      className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

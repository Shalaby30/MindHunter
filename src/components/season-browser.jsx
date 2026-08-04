"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Calendar, Clock, ChevronDown, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

const STILL = (path) =>
  path ? `https://image.tmdb.org/t/p/w300${path}` : null;

function EpisodeCard({ ep, tvId }) {
  const [expanded, setExpanded] = useState(false);
  const still = STILL(ep.still);

  return (
    <Link
      href={`/watch/tv/${tvId}?season=${ep.seasonNumber}&episode=${ep.episodeNumber}`}
      className="group block"
    >
      <div className="flex gap-4 rounded-lg border border-border bg-card/60 p-3 transition-colors hover:border-foreground/20 hover:bg-white/5">
        {/* episode still */}
        <div className="relative hidden h-24 w-40 shrink-0 overflow-hidden rounded-md bg-muted sm:block">
          {still ? (
            <Image
              src={still}
              alt={ep.name}
              fill
              sizes="160px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <ImageOff className="h-5 w-5" />
            </div>
          )}
          <span className="absolute left-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white">
            E{ep.episodeNumber}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white transition-colors group-hover:text-primary">
                <span className="mr-2 text-muted-foreground sm:hidden">
                  E{ep.episodeNumber}
                </span>
                {ep.name}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                {ep.airDate && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {ep.airDate}
                  </span>
                )}
                {ep.runtime && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {ep.runtime}m
                  </span>
                )}
                {ep.rating && (
                  <span className="inline-flex items-center gap-1 text-yellow-400">
                    <Star className="h-3 w-3 fill-current" />
                    {ep.rating}
                  </span>
                )}
              </div>
            </div>

            {ep.overview && (
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setExpanded((v) => !v);
                }}
                aria-label={expanded ? "Collapse overview" : "Expand overview"}
                className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    expanded && "rotate-180"
                  )}
                />
              </button>
            )}
          </div>

          {ep.overview && (
            <p
              className={cn(
                "mt-1.5 text-xs leading-relaxed text-muted-foreground",
                expanded ? "" : "line-clamp-2"
              )}
            >
              {ep.overview}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export function SeasonBrowser({ tvId, seasons }) {
  const [activeSeason, setActiveSeason] = useState(seasons[0]?.seasonNumber);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (activeSeason == null || !open) return;
    let cancelled = false;
    setLoading(true);
    setError(false);

    fetch(`/api/tv/${tvId}/season?season=${activeSeason}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tvId, activeSeason, open]);

  if (!seasons?.length) return null;

  const activeMeta = seasons.find((s) => s.seasonNumber === activeSeason);

  return (
    <section className="py-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-center justify-between rounded-lg border border-border bg-card/60 px-4 py-3 text-left transition-colors hover:border-foreground/25"
      >
        <div>
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            Episodes
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {seasons.length} season{seasons.length > 1 ? "s" : ""} ·{" "}
            {seasons.reduce((n, s) => n + (s.episodeCount || 0), 0)} episodes
            total
          </p>
        </div>
        <span className="flex items-center gap-2 text-sm text-muted-foreground transition-colors group-hover:text-foreground">
          {open ? "Hide" : "Browse"}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </span>
      </button>

      {open && (
        <div className="mt-4">
          {/* season selector */}
          <div className="no-scrollbar mb-4 flex gap-1.5 overflow-x-auto">
            {seasons.map((s) => (
              <button
                key={s.seasonNumber}
                onClick={() => setActiveSeason(s.seasonNumber)}
                className={cn(
                  "shrink-0 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                  s.seasonNumber === activeSeason
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                )}
              >
                {s.name}
                <span className="ml-1.5 opacity-70">{s.episodeCount}</span>
              </button>
            ))}
          </div>

          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex gap-4 rounded-lg border border-border bg-card/60 p-3"
                >
                  <div className="hidden h-24 w-40 shrink-0 animate-pulse rounded-md bg-muted sm:block" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-full animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && !loading && (
            <p className="rounded-lg border border-border bg-card/60 p-6 text-center text-sm text-muted-foreground">
              Couldn&apos;t load this season. Try again later.
            </p>
          )}

          {!loading && !error && data && (
            <>
              {data.overview && (
                <p className="mb-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  {data.overview}
                </p>
              )}

              {/* fixed-height scrollable list so long shows don't take over the page */}
              <div className="max-h-[560px] space-y-3 overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:#3f3f46_transparent]">
                {data.episodes.map((ep) => (
                  <EpisodeCard key={ep.id} ep={ep} tvId={tvId} />
                ))}
              </div>

              {activeMeta && (
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  {activeMeta.episodeCount} episodes in {activeMeta.name} —
                  scroll inside the list
                </p>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}

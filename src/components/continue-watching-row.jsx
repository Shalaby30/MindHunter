"use client";

import Link from "next/link";
import { X, Play, Film, Tv } from "lucide-react";
import { useContinueWatching } from "@/lib/continue-watching";
import { cn } from "@/lib/utils";

export function ContinueWatchingRow() {
  const { items, hydrated, remove } = useContinueWatching();

  if (!hydrated || items.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Continue Watching</h2>
            <p className="text-xs text-muted-foreground">Pick up where you left off</p>
          </div>
        </div>
      </div>

      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-2 sm:px-6">
        {items.map((item) => (
          <div
            key={item.key}
            className="group relative w-[150px] shrink-0 snap-start sm:w-[170px]"
          >
            {/* Remove button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                remove(item.mediaType, item.id);
              }}
              className="absolute -right-1 -top-1 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-black/80 text-white/60 opacity-0 transition-opacity hover:bg-accent hover:text-white group-hover:opacity-100"
              aria-label={`Remove ${item.title}`}
            >
              <X className="h-3 w-3" />
            </button>

            <Link
              href={`/watch/${item.mediaType}/${item.id}?season=${item.season || 1}&episode=${item.episode || 1}`}
              className="relative block aspect-[2/3] overflow-hidden rounded-lg border border-border bg-muted transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/40"
            >
              {item.poster ? (
                <img
                  src={`https://image.tmdb.org/t/p/w342${item.poster}`}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  {item.mediaType === "tv" ? (
                    <Tv className="h-8 w-8" />
                  ) : (
                    <Film className="h-8 w-8" />
                  )}
                </div>
              )}

              {/* Progress overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Play icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/90">
                  <Play className="h-4 w-4 fill-white text-white ml-0.5" />
                </div>
              </div>

              {/* Info */}
              <div className="absolute inset-x-0 bottom-0 p-2.5">
                <p className="line-clamp-2 text-xs font-medium leading-snug text-white">
                  {item.title}
                </p>
                {item.mediaType === "tv" && item.season && (
                  <p className="mt-1 text-[10px] text-white/60">
                    S{item.season} {item.episode ? `E${item.episode}` : ""}
                  </p>
                )}
              </div>
            </Link>

            <div className="mt-2 px-0.5">
              <p className="truncate text-sm font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                {item.mediaType === "tv" ? "TV" : "Movie"}
                {item.season ? ` · S${item.season}` : ""}
                {item.episode ? ` E${item.episode}` : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, Plus, Check, Heart, Clock, X, MonitorPlay } from "lucide-react";
import { useLibrary } from "@/lib/library";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DetailActions({ item, trailer }) {
  const {
    toggleWishlist,
    toggleFavorite,
    toggleWatchLater,
    inWishlist,
    inFavorites,
    inWatchLater,
    hydrated,
  } = useLibrary();
  const [trailerOpen, setTrailerOpen] = useState(false);

  const saved = hydrated && inWishlist(item.id, item.mediaType);
  const liked = hydrated && inFavorites(item.id, item.mediaType);
  const later = hydrated && inWatchLater(item.id, item.mediaType);

  const watchHref =
    item.mediaType === "tv"
      ? `/watch/tv/${item.id}?season=1&episode=1`
      : `/watch/movie/${item.id}`;

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button size="lg" className="flex-col gap-1" asChild>
          <Link href={watchHref} className="flex  items-center justify-center gap-1">
            <MonitorPlay className="h-5 w-5" />
            <span className="text-sm">Watch Now</span>
          </Link>
        </Button>
        {trailer && (
          <Button
            size="lg"
            variant="secondary"
            className="gap-2"
            onClick={() => setTrailerOpen(true)}
          >
            <Play className="h-4 w-4 fill-current" />
            Watch Trailer
          </Button>
        )}
        <Button
          size="lg"
          variant="secondary"
          className="gap-2"
          onClick={() => toggleWishlist(item)}
        >
          {saved ? (
            <Check className="h-4 w-4 text-accent" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {saved ? "In My List" : "My List"}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className={cn("gap-2", liked && "border-accent text-accent")}
          onClick={() => toggleFavorite(item)}
        >
          <Heart className={cn("h-4 w-4", liked && "fill-current")} />
          {liked ? "Favorited" : "Favorite"}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className={cn("gap-2", later && "border-accent text-accent")}
          onClick={() => toggleWatchLater(item)}
        >
          <Clock className={cn("h-4 w-4", later && "fill-current")} />
          {later ? "Queued" : "Watch Later"}
        </Button>
      </div>

      {trailerOpen && trailer && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setTrailerOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setTrailerOpen(false)}
              aria-label="Close trailer"
              className="absolute -top-10 right-0 rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="aspect-video w-full overflow-hidden rounded-lg border border-border">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
                title={trailer.name || "Trailer"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

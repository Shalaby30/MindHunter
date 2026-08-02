"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Bookmark, Heart, Clock, Film, Tv } from "lucide-react";
import { IMG } from "@/lib/tmdb";
import { useLibrary } from "@/lib/library";
import { cn } from "@/lib/utils";

export function TitleCard({ item, rank }) {
  const {
    toggleWishlist,
    toggleFavorite,
    toggleWatchLater,
    inWishlist,
    inFavorites,
    inWatchLater,
    hydrated,
  } = useLibrary();

  const saved = hydrated && inWishlist(item.id, item.mediaType);
  const liked = hydrated && inFavorites(item.id, item.mediaType);
  const later = hydrated && inWatchLater(item.id, item.mediaType);
  const poster = IMG.poster(item.poster);
  const href = `/${item.mediaType}/${item.id}`;

  return (
    <div className="group relative w-[150px] shrink-0 snap-start sm:w-[170px]">
      {typeof rank === "number" && (
        <span className="absolute -left-3 -bottom-4 z-10 text-[88px] font-black leading-none text-transparent [-webkit-text-stroke:2px_#3f3f46] select-none">
          {rank}
        </span>
      )}

      <Link
        href={href}
        className="relative block aspect-[2/3] overflow-hidden rounded-lg border border-border bg-muted transition-transform duration-300 group-hover:scale-[1.04] group-hover:border-foreground/20"
      >
        {poster ? (
          <Image
            src={poster}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 150px, 170px"
            className="object-cover"
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

        {/* hover overlay */}
        <div className="absolute inset-0 flex flex-col justify-between bg-black/70 p-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="flex justify-end gap-1.5">
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(item);
              }}
              aria-label="Toggle wishlist"
              className={cn(
                "rounded-full p-1.5 backdrop-blur-sm transition-colors",
                saved
                  ? "bg-accent text-white"
                  : "bg-white/10 text-white hover:bg-white/25"
              )}
            >
              <Bookmark
                className={cn("h-3.5 w-3.5", saved && "fill-current")}
              />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(item);
              }}
              aria-label="Toggle favorite"
              className={cn(
                "rounded-full p-1.5 backdrop-blur-sm transition-colors",
                liked
                  ? "bg-accent text-white"
                  : "bg-white/10 text-white hover:bg-white/25"
              )}
            >
              <Heart className={cn("h-3.5 w-3.5", liked && "fill-current")} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleWatchLater(item);
              }}
              aria-label="Toggle watch later"
              className={cn(
                "rounded-full p-1.5 backdrop-blur-sm transition-colors",
                later
                  ? "bg-accent text-white"
                  : "bg-white/10 text-white hover:bg-white/25"
              )}
            >
              <Clock className={cn("h-3.5 w-3.5", later && "fill-current")} />
            </button>
          </div>

          <div>
            {item.rating && (
              <span className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-yellow-400">
                <Star className="h-3 w-3 fill-current" />
                {item.rating}
              </span>
            )}
            <p className="line-clamp-2 text-xs font-medium leading-snug text-white">
              {item.title}
            </p>
          </div>
        </div>
      </Link>

      <div className="mt-2 px-0.5">
        <Link href={href} className="block">
          <p className="truncate text-sm font-medium hover:text-accent transition-colors">
            {item.title}
          </p>
        </Link>
        <p className="text-xs text-muted-foreground">
          {item.year || "—"} · {item.mediaType === "tv" ? "TV" : "Movie"}
        </p>
      </div>
    </div>
  );
}

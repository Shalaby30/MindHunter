"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Plus, Check, Info, Star } from "lucide-react";
import { IMG, getTrailerKey } from "@/lib/tmdb";
import { useLibrary } from "@/lib/library";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrailerModal } from "@/components/trailer-modal";
import { cn } from "@/lib/utils";

const ROTATE_MS = 8000;

export function Hero({ items, genres }) {
  const [index, setIndex] = useState(0);
  const [trailer, setTrailer] = useState({ open: false, key: null });
  const [loadingTrailer, setLoadingTrailer] = useState(false);
  const slides = items.filter((i) => i.backdrop).slice(0, 6);
  const { toggleWishlist, inWishlist, hydrated } = useLibrary();

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      ROTATE_MS
    );
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;
  const current = slides[index];
  const saved = hydrated && inWishlist(current.id, current.mediaType);
  const href = `/${current.mediaType}/${current.id}`;

  const playTrailer = async () => {
    setLoadingTrailer(true);
    const key = await getTrailerKey(current.mediaType, current.id);
    setLoadingTrailer(false);
    if (key) setTrailer({ open: true, key });
  };

  return (
    <section className="relative h-[85vh] min-h-[520px] w-full overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            i === index ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={IMG.backdrop(slide.backdrop, "original")}
            alt={slide.title}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}

      {/* gradients for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto flex h-full flex-col justify-end px-4 pb-24 sm:px-6">
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-2">
            <Badge># {index + 1} Trending this week</Badge>
            <Badge variant="secondary" className="uppercase">
              {current.mediaType === "tv" ? "TV Show" : "Movie"}
            </Badge>
            {current.rating && (
              <Badge variant="outline" className="gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {current.rating}
              </Badge>
            )}
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {current.title}
          </h1>

          <p className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
            {current.year && <span>{current.year}</span>}
            {current.genreIds.slice(0, 3).map((id) => (
              <span key={id} className="text-muted-foreground/80">
                {genres[id]}
              </span>
            ))}
          </p>

          <p className="mt-4 line-clamp-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {current.overview}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="gap-2"
              disabled={loadingTrailer}
              onClick={playTrailer}
            >
              <Play className="h-4 w-4 fill-current" />
              {loadingTrailer ? "Loading…" : "Watch Trailer"}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="gap-2"
              onClick={() => toggleWishlist(current)}
            >
              {saved ? (
                <Check className="h-4 w-4 text-accent" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {saved ? "In My List" : "My List"}
            </Button>
            <Link href={href}>
              <Button size="lg" variant="outline" className="gap-2">
                <Info className="h-4 w-4" />
                Details
              </Button>
            </Link>
          </div>
        </div>

        {/* slide indicators */}
        <div className="absolute bottom-8 right-4 flex gap-1.5 sm:right-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                i === index
                  ? "w-8 bg-accent"
                  : "w-3 bg-foreground/30 hover:bg-foreground/50"
              )}
            />
          ))}
        </div>
      </div>

      <TrailerModal
        videoKey={trailer.key}
        title={current.title}
        open={trailer.open}
        onClose={() => setTrailer((t) => ({ ...t, open: false }))}
      />
    </section>
  );
}

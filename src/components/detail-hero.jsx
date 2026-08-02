import Image from "next/image";
import { Star, Calendar, Clock, Layers, Tv } from "lucide-react";
import { IMG } from "@/lib/tmdb";
import { Badge } from "@/components/ui/badge";
import { DetailActions } from "@/components/detail-actions";

export function DetailHero({ item }) {
  const backdrop = IMG.backdrop(item.backdrop, "original");
  const poster = IMG.poster(item.poster, "w500");

  return (
    <section className="relative">
      {/* backdrop */}
      <div className="absolute inset-0 h-[70vh] min-h-[480px] overflow-hidden">
        {backdrop && (
          <Image
            src={backdrop}
            alt={item.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 pt-40 sm:px-6 md:flex-row md:pt-52">
        {/* poster */}
        <div className="hidden w-56 shrink-0 sm:block md:w-64">
          <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-border shadow-2xl shadow-black/60">
            {poster ? (
              <Image
                src={poster}
                alt={item.title}
                fill
                priority
                sizes="256px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
                <Tv className="h-10 w-10" />
              </div>
            )}
          </div>
        </div>

        {/* info */}
        <div className="flex-1 pb-4 md:pt-16">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="uppercase">
              {item.mediaType === "tv" ? "TV Show" : "Movie"}
            </Badge>
            {item.status && <Badge variant="outline">{item.status}</Badge>}
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {item.title}
          </h1>

          {item.tagline && (
            <p className="mt-2 text-sm italic text-muted-foreground">
              &ldquo;{item.tagline}&rdquo;
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {item.rating && (
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {item.rating}
                <span className="text-muted-foreground">/ 10</span>
              </span>
            )}
            {item.year && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {item.year}
              </span>
            )}
            {item.runtime && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {item.runtime}
              </span>
            )}
            {item.seasons && (
              <span className="inline-flex items-center gap-1.5">
                <Layers className="h-4 w-4" />
                {item.seasons} Season{item.seasons > 1 ? "s" : ""} ·{" "}
                {item.episodes} Episodes
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {item.genres.map((g) => (
              <Badge key={g} variant="outline">
                {g}
              </Badge>
            ))}
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {item.overview}
          </p>

          {(item.director || item.creators.length > 0) && (
            <p className="mt-4 text-sm text-muted-foreground">
              <span className="text-foreground">
                {item.director ? "Director: " : "Created by: "}
              </span>
              {item.director || item.creators.join(", ")}
            </p>
          )}

          <DetailActions item={item} trailer={item.trailer} />
        </div>
      </div>
    </section>
  );
}

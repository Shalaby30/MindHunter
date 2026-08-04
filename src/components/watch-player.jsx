"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MonitorPlay, PlayCircle, Tv } from "lucide-react";
import { useState as useReactState } from "react";
import { Button } from "@/components/ui/button";

function buildPlayerUrl(provider, mediaType, id, season, episode) {
  const baseUrl =
    provider === "vidfast"
      ? mediaType === "movie"
        ? `https://vidfast.vc/movie/${id}`
        : `https://vidfast.vc/tv/${id}/${season}/${episode}`
      : provider === "111movies"
      ? mediaType === "movie"
        ? `https://111movies.net/movie/${id}`
        : `https://111movies.net/tv/${id}/${season}/${episode}`
      : provider === "vidup"
      ? mediaType === "movie"
        ? `https://vidup.to/movie/${id}`
        : `https://vidup.to/tv/${id}/${season}/${episode}`
      : provider === "vidsrc"
      ? mediaType === "movie"
        ? `https://vidsrc-embed.ru/embed/movie/${id}`
        : `https://vidsrc-embed.ru/embed/tv/${id}/${season}-${episode}`
      : provider === "vidzee"
      ? mediaType === "movie"
        ? `https://player.vidzee.wtf/embed/movie/${id}`
        : `https://player.vidzee.wtf/embed/tv/${id}/${season}/${episode}`
      : mediaType === "movie"
        ? `https://player.videasy.net/movie/${id}`
        : `https://player.videasy.net/tv/${id}/${season}/${episode}`;

  const params = new URLSearchParams(
    provider === "vidfast" ? { autoPlay: "true" } : {}
  );

  return `${baseUrl}${params.toString() ? `?${params.toString()}` : ""}`;
}

export function WatchPlayer({
  item,
  mediaType,
  seasons = [],
  initialSeason,
  initialEpisode,
  initialEpisodes = [],
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedSeason, setSelectedSeason] = useState(initialSeason);
  const [selectedEpisode, setSelectedEpisode] = useState(initialEpisode);
  const [selectedProvider, setSelectedProvider] = useState("videasy");
  const [activeTab, setActiveTab] = useReactState("movies");
  const [episodes, setEpisodes] = useState(initialEpisodes);
  const [loadingEpisodes, setLoadingEpisodes] = useState(!initialEpisodes.length);
  const [error, setError] = useState(false);

  useEffect(() => {
    const seasonFromUrl = Number(searchParams.get("season") || initialSeason || 1);
    const episodeFromUrl = Number(
      searchParams.get("episode") || initialEpisode || 1
    );

    setSelectedSeason(seasonFromUrl);
    setSelectedEpisode(episodeFromUrl);
  }, [initialEpisode, initialSeason, searchParams]);

  useEffect(() => {
    if (mediaType !== "tv") return;

    let cancelled = false;
    setLoadingEpisodes(true);
    setError(false);

    fetch(`/api/tv/${item.id}/season?season=${selectedSeason}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          setEpisodes(json.episodes || []);
          const hasEpisode = json.episodes?.some(
            (ep) => ep.episodeNumber === selectedEpisode
          );
          if (!hasEpisode && json.episodes?.[0]) {
            setSelectedEpisode(json.episodes[0].episodeNumber);
          }
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoadingEpisodes(false);
      });

    return () => {
      cancelled = true;
    };
  }, [item.id, mediaType, selectedSeason, selectedEpisode]);

  useEffect(() => {
    if (!selectedSeason || !selectedEpisode) return;

    const params = new URLSearchParams(searchParams.toString());
    const currentSeason = params.get("season");
    const currentEpisode = params.get("episode");

    if (currentSeason === String(selectedSeason) && currentEpisode === String(selectedEpisode)) {
      return;
    }

    params.set("season", String(selectedSeason));
    params.set("episode", String(selectedEpisode));

    const nextUrl = `${pathname}?${params.toString()}`;
    router.replace(nextUrl, { scroll: false });
  }, [pathname, router, searchParams, selectedEpisode, selectedSeason]);

  const activeSeasonMeta = useMemo(
    () => seasons.find((season) => season.seasonNumber === selectedSeason),
    [seasons, selectedSeason]
  );

  const activeEpisode = useMemo(
    () => episodes.find((ep) => ep.episodeNumber === selectedEpisode) || null,
    [episodes, selectedEpisode]
  );

  const embedUrl = useMemo(
    () => buildPlayerUrl(selectedProvider, mediaType, item.id, selectedSeason, selectedEpisode),
    [item.id, mediaType, selectedEpisode, selectedSeason, selectedProvider]
  );

  const handleSeasonChange = (value) => {
    setSelectedSeason(Number(value));
    setSelectedEpisode(1);
  };

  const handleEpisodeChange = (value) => {
    setSelectedEpisode(Number(value));
  };

  const providerOptions = [
    { id: "videasy", label: "Server 1 VIP" },
    { id: "vidfast", label: "Server 2 VIP" },
    { id: "111movies", label: "Server 3 VIP" },
    { id: "vidup", label: "Server 4" },
    { id: "vidsrc", label: "Server 5" },
    { id: "vidzee", label: "Server 6" },
  ];


  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:py-10">
      

      {mediaType === "tv" && (
        <div className="grid gap-4 rounded-2xl border border-border bg-card/70 p-4 shadow-sm md:grid-cols-[1.2fr_0.8fr] md:p-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground" htmlFor="season-select">
              Season
            </label>
            <select
              id="season-select"
              value={selectedSeason}
              onChange={(event) => handleSeasonChange(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
            >
              {seasons.map((season) => (
                <option key={season.seasonNumber} value={season.seasonNumber}>
                  {season.name} ({season.episodeCount} episodes)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground" htmlFor="episode-select">
              Episode
            </label>
            <select
              id="episode-select"
              value={selectedEpisode}
              onChange={(event) => handleEpisodeChange(event.target.value)}
              disabled={loadingEpisodes || episodes.length === 0}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              {episodes.map((episode) => (
                <option key={episode.episodeNumber} value={episode.episodeNumber}>
                  Episode {episode.episodeNumber} — {episode.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/70 p-4 shadow-sm md:flex-row md:items-center md:justify-between md:p-5">
        <div>
          <p className="text-sm font-medium text-foreground">Current Stream</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {mediaType === "tv"
              ? `Season ${selectedSeason} • Episode ${selectedEpisode}${activeEpisode ? `: ${activeEpisode.name}` : ""}`
              : item.title}
          </p>
        </div>
        <div className="w-full md:max-w-xs">
          <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="provider-select">
            Service
          </label>
          <select
            id="provider-select"
            value={selectedProvider}
            onChange={(event) => setSelectedProvider(event.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
          >
            {providerOptions.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-black shadow-2xl">
        <div className="aspect-video w-full">
          <iframe
            key={`${mediaType}-${selectedSeason}-${selectedEpisode}-${selectedProvider}`}
            src={embedUrl}
            title={item.title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm md:p-5">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Tv className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium text-foreground">Disclaimer</p>
            <p className="mt-1">
              This website does not host any files on its server. All content is provided by non-affiliated third parties. We do not accept responsibility for content hosted on third-party websites and do not have any involvement in the downloading/uploading of movies. We just post links available on the internet.
            </p>
          </div>
        </div>
      </div>

      

    </section>
  );
}

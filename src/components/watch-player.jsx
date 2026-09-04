"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Play, Check, Tv, Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

function buildPlayerUrl(provider, mediaType, id, season, episode) {
  const baseUrl =
    provider === "cinesrc"
      ? mediaType === "movie"
        ? `https://cinesrc.st/embed/movie/${id}`
        : `https://cinesrc.st/embed/tv/${id}?s=${season}&e=${episode}`
      : provider === "cinezo"
        ? mediaType === "movie"
          ? `https://player.cinezo.live/embed/movie/${id}`
          : `https://player.cinezo.live/embed/tv/${id}/${season}/${episode}`
        : provider === "vidbolt"
          ? mediaType === "movie"
            ? `https://vidbolt.xyz/movie/${id}`
            : `https://vidbolt.xyz/tv/${id}/${season}/${episode}`
          : provider === "vidfast"
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

  return baseUrl;
}

const PROVIDERS = [
  { id: "cinesrc", label: "Main Server" },
  { id: "cinezo", label: "Main Server 2" },
  { id: "vidbolt", label: "Main Server 3" },
  { id: "videasy", label: "VIP 1" },
  { id: "vidfast", label: "VIP 2" },
  { id: "111movies", label: "VIP 3" },
  { id: "vidup", label: "Server 4" },
  { id: "vidsrc", label: "Server 5" },
  { id: "vidzee", label: "Server 6" },
];

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

  const [selectedSeason, setSelectedSeason] = useState(initialSeason || 1);
  const [selectedEpisode, setSelectedEpisode] = useState(initialEpisode || 1);
  const [selectedProvider, setSelectedProvider] = useState("cinesrc");
  const [episodes, setEpisodes] = useState(initialEpisodes);
  const [loadingEpisodes, setLoadingEpisodes] = useState(
    !initialEpisodes.length,
  );
  const [error, setError] = useState(false);
  const [iframeActive, setIframeActive] = useState(false);
  const [episodeSearch, setEpisodeSearch] = useState("");
  const [theaterMode, setTheaterMode] = useState(false);

  useEffect(() => {
    const seasonFromUrl =
      Number(searchParams.get("season")) || initialSeason || 1;
    const episodeFromUrl =
      Number(searchParams.get("episode")) || initialEpisode || 1;
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
            (ep) => ep.episodeNumber === selectedEpisode,
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
    if (
      params.get("season") === String(selectedSeason) &&
      params.get("episode") === String(selectedEpisode)
    )
      return;
    params.set("season", String(selectedSeason));
    params.set("episode", String(selectedEpisode));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams, selectedEpisode, selectedSeason]);

  const activeSeasonMeta = useMemo(
    () => seasons.find((s) => s.seasonNumber === selectedSeason),
    [seasons, selectedSeason],
  );

  const activeEpisode = useMemo(
    () => episodes.find((ep) => ep.episodeNumber === selectedEpisode) || null,
    [episodes, selectedEpisode],
  );

  const embedUrl = useMemo(
    () =>
      buildPlayerUrl(
        selectedProvider,
        mediaType,
        item.id,
        selectedSeason,
        selectedEpisode,
      ),
    [item.id, mediaType, selectedEpisode, selectedSeason, selectedProvider],
  );

  const handleSeasonChange = (num) => {
    setSelectedSeason(num);
    setSelectedEpisode(1);
    setIframeActive(false);
  };

  const handleEpisodeChange = (num) => {
    setSelectedEpisode(num);
    setIframeActive(false);
  };

  return (
    <section className="mx-auto w-full px-4 sm:px-6 transition-all duration-300">
      <div
        className={cn(
          "flex flex-col gap-6",
          mediaType === "tv" && seasons.length > 0 && !theaterMode ? "lg:flex-row" : "",
        )}
      >
        {/* Main Content */}
        <div
          className={cn(
            "flex flex-col gap-4 min-w-0",
            mediaType === "tv" && seasons.length > 0 && !theaterMode ? "lg:flex-1" : "",
            mediaType === "movie" ? "mx-auto max-w-5xl" : "",
          )}
        >
          {/* Player */}
          <div className="relative">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl shadow-black/50">
              <div className="aspect-video relative w-full">
                {!iframeActive && (
                  <button
                    onClick={() => setIframeActive(true)}
                    className="absolute inset-0 z-10 group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
                    {item.backdrop_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w1280${item.backdrop_path}`}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover opacity-40"
                      />
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm ring-2 ring-white/20 transition-all group-hover:scale-110 group-hover:bg-accent group-hover:ring-accent">
                        <Play className="h-8 w-8 fill-white text-white ml-1" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-white">
                          {item.title}
                        </p>
                        {mediaType === "tv" && activeEpisode && (
                          <p className="text-sm text-white/60 mt-1">
                            S{selectedSeason} E{selectedEpisode} —{" "}
                            {activeEpisode.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                )}
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
          </div>

          {/* Server Selector */}
          <div className="flex items-center gap-2">
            <div className="flex flex-1 gap-2 overflow-x-auto no-scrollbar pb-1">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedProvider(p.id);
                    setIframeActive(false);
                  }}
                  className={cn(
                    "flex-shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all",
                    selectedProvider === p.id
                      ? "bg-accent text-white shadow-lg shadow-accent/20"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground",
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {mediaType === "tv" && seasons.length > 0 && (
              <button
                onClick={() => setTheaterMode((v) => !v)}
                className={cn(
                  "flex-shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                  theaterMode
                    ? "bg-accent/20 text-accent"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                )}
              >
                {theaterMode ? "Exit" : "Theater"}
              </button>
            )}
          </div>

          {/* Episode Info */}
          {mediaType === "tv" && activeEpisode && (
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <p className="text-sm font-semibold text-foreground">
                S{selectedSeason} E{activeEpisode.episodeNumber} —{" "}
                {activeEpisode.name}
              </p>
              {activeEpisode.overview && (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {activeEpisode.overview}
                </p>
              )}
              <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground/60">
                {activeEpisode.airDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {activeEpisode.airDate}
                  </span>
                )}
                {activeEpisode.runtime && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {activeEpisode.runtime}m
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="flex items-start gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
            <Tv className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/60" />
            <p className="text-[11px] leading-relaxed text-muted-foreground/60">
              This website does not host any files on its server. All content is
              provided by non-affiliated third parties.
            </p>
          </div>
        </div>

        {/* Sidebar — Seasons & Episodes */}
        {mediaType === "tv" && seasons.length > 0 && (
          <div className={cn(
            "w-full flex-shrink-0",
            !theaterMode ? "lg:w-80 xl:w-96" : ""
          )}>
            <div className="rounded-xl border border-white/10 bg-card/60 overflow-hidden">
              {/* Season Tabs */}
              <div className="flex gap-1 overflow-x-auto no-scrollbar border-b border-white/5 bg-white/[0.02] p-2">
                {seasons.map((s) => (
                  <button
                    key={s.seasonNumber}
                    onClick={() => handleSeasonChange(s.seasonNumber)}
                    className={cn(
                      "flex-shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                      selectedSeason === s.seasonNumber
                        ? "bg-accent text-white"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                    )}
                  >
                    {s.name}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="border-b border-white/5 px-3 py-2">
                <input
                  type="text"
                  placeholder="Search episodes..."
                  value={episodeSearch}
                  onChange={(e) => setEpisodeSearch(e.target.value)}
                  className="w-full rounded-lg bg-white/5 px-3 py-2 text-xs text-foreground placeholder-muted-foreground outline-none focus:bg-white/10"
                />
              </div>

              {/* Episodes List */}
              <div className={cn(
                "overflow-y-auto [scrollbar-width:thin]",
                theaterMode ? "max-h-[500px]" : "max-h-[calc(100vh-240px)]"
              )}>
                {error && !loadingEpisodes && (
                  <div className="p-8 text-center">
                    <p className="text-xs text-red-400">Failed to load episodes</p>
                  </div>
                )}

                {!error && theaterMode && (
                  <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {loadingEpisodes && Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="animate-pulse rounded-lg bg-white/5 aspect-video" />
                    ))}
                    {!loadingEpisodes && episodes
                      .filter((ep) => {
                        if (!episodeSearch) return true;
                        const q = episodeSearch.toLowerCase();
                        return ep.name?.toLowerCase().includes(q) || ep.overview?.toLowerCase().includes(q) || String(ep.episodeNumber).includes(q);
                      })
                      .map((ep) => (
                        <button
                          key={ep.episodeNumber}
                          onClick={() => handleEpisodeChange(ep.episodeNumber)}
                          className={cn(
                            "group relative overflow-hidden rounded-lg text-left transition-all",
                            selectedEpisode === ep.episodeNumber ? "ring-2 ring-accent" : "ring-1 ring-white/5 hover:ring-white/20"
                          )}
                        >
                          <div className="aspect-video relative bg-white/5">
                            {ep.still ? (
                              <img src={`https://image.tmdb.org/t/p/w300${ep.still}`} alt={ep.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full items-center justify-center"><Tv className="h-5 w-5 text-muted-foreground/30" /></div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">{ep.episodeNumber}</span>
                            {selectedEpisode === ep.episodeNumber && (
                              <div className="absolute inset-0 flex items-center justify-center bg-accent/20">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent"><Play className="h-4 w-4 fill-white text-white ml-0.5" /></div>
                              </div>
                            )}
                          </div>
                          <div className="p-2 bg-card">
                            <p className={cn("text-[11px] font-medium line-clamp-1", selectedEpisode === ep.episodeNumber ? "text-accent" : "text-foreground")}>{ep.name}</p>
                          </div>
                        </button>
                      ))}
                  </div>
                )}

                {!error && !theaterMode && (
                  <>
                    {loadingEpisodes && (
                      <div className="space-y-3 p-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="flex gap-3 animate-pulse">
                            <div className="h-16 w-28 flex-shrink-0 rounded-lg bg-white/5" />
                            <div className="flex-1 space-y-2 py-1">
                              <div className="h-3 w-20 rounded bg-white/5" />
                              <div className="h-2 w-full rounded bg-white/5" />
                              <div className="h-2 w-3/4 rounded bg-white/5" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {!loadingEpisodes && episodes.filter((ep) => {
                      if (!episodeSearch) return true;
                      const q = episodeSearch.toLowerCase();
                      return ep.name?.toLowerCase().includes(q) || ep.overview?.toLowerCase().includes(q) || String(ep.episodeNumber).includes(q);
                    }).map((ep) => (
                      <button key={ep.episodeNumber} onClick={() => handleEpisodeChange(ep.episodeNumber)} className={cn("flex w-full gap-3 p-3 text-left transition-all border-b border-white/5 last:border-0", selectedEpisode === ep.episodeNumber ? "bg-accent/10" : "hover:bg-white/[0.03]")}>
                        <div className="relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-white/5">
                          {ep.still ? <img src={`https://image.tmdb.org/t/p/w300${ep.still}`} alt={ep.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><Tv className="h-5 w-5 text-muted-foreground/30" /></div>}
                          <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">{ep.episodeNumber}</span>
                          {selectedEpisode === ep.episodeNumber && <div className="absolute inset-0 flex items-center justify-center bg-accent/20"><div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent"><Play className="h-3 w-3 fill-white text-white ml-0.5" /></div></div>}
                        </div>
                        <div className="min-w-0 flex-1 py-0.5">
                          <p className={cn("text-xs font-semibold line-clamp-1", selectedEpisode === ep.episodeNumber ? "text-accent" : "text-foreground")}>{ep.name}</p>
                          {ep.overview && <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground line-clamp-2">{ep.overview}</p>}
                          <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground/50">
                            {ep.airDate && <span>{ep.airDate}</span>}
                            {ep.runtime && <span>{ep.runtime}m</span>}
                          </div>
                        </div>
                        {selectedEpisode === ep.episodeNumber && <Check className="mt-1 h-4 w-4 flex-shrink-0 text-accent" />}
                      </button>
                    ))}
                    {!loadingEpisodes && episodes.length === 0 && <div className="p-8 text-center"><p className="text-xs text-muted-foreground">No episodes available</p></div>}
                    {!loadingEpisodes && episodes.length > 0 && episodes.filter((ep) => {
                      if (!episodeSearch) return true;
                      const q = episodeSearch.toLowerCase();
                      return ep.name?.toLowerCase().includes(q) || ep.overview?.toLowerCase().includes(q) || String(ep.episodeNumber).includes(q);
                    }).length === 0 && <div className="p-8 text-center"><p className="text-xs text-muted-foreground">No episodes match &quot;{episodeSearch}&quot;</p></div>}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Swords,
  Trophy,
  RotateCcw,
  Loader2,
  Star,
  Film,
  Tv,
  Sparkles,
} from "lucide-react";
import { IMG } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function DuelCard({ item, onPick, side }) {
  const poster = IMG.poster(item.poster);
  return (
    <button
      onClick={() => onPick(item)}
      className={cn(
        "group relative w-full max-w-[280px] overflow-hidden rounded-xl border border-border bg-card text-left transition-all hover:scale-[1.03] hover:border-accent hover:shadow-[0_0_40px_-10px] hover:shadow-accent/40",
        side === "left" ? "sm:rotate-[-1deg]" : "sm:rotate-[1deg]"
      )}
    >
      <div className="relative aspect-[2/3] w-full bg-muted">
        {poster ? (
          <Image
            src={poster}
            alt={item.title}
            fill
            sizes="280px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            {item.mediaType === "tv" ? (
              <Tv className="h-10 w-10" />
            ) : (
              <Film className="h-10 w-10" />
            )}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-base font-bold leading-tight text-white">
            {item.title}
          </p>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-white/70">
            {item.rating && (
              <span className="inline-flex items-center gap-1 text-yellow-400">
                <Star className="h-3 w-3 fill-current" />
                {item.rating}
              </span>
            )}
            <span>{item.year || "—"}</span>
            <span className="rounded bg-white/15 px-1.5 py-0.5 text-[10px] font-medium uppercase">
              {item.mediaType === "tv" ? "TV" : "Movie"}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function DuelPage() {
  const [phase, setPhase] = useState("setup"); // setup | loading | duel | winner
  const [type, setType] = useState("movie");
  const [pool, setPool] = useState([]);
  const [pair, setPair] = useState([null, null]);
  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(1);
  const [winner, setWinner] = useState(null);

  const start = async () => {
    setPhase("loading");
    try {
      // grab 2 pages for variety, then shuffle and take 8
      const [p1, p2] = await Promise.all([
        fetch(`/api/discover?type=${type}&sort=popularity.desc&page=1`).then(
          (r) => r.json()
        ),
        fetch(`/api/discover?type=${type}&sort=popularity.desc&page=2`).then(
          (r) => r.json()
        ),
      ]);
      const candidates = shuffle([...(p1.results || []), ...(p2.results || [])]).slice(0, 8);
      if (candidates.length < 2) throw new Error("not enough");
      setPool(candidates);
      setPair([candidates[0], candidates[1]]);
      setTotalRounds(candidates.length - 1);
      setRound(1);
      setWinner(null);
      setPhase("duel");
    } catch {
      setPhase("setup");
    }
  };

  const pick = (chosen) => {
    const remaining = pool.filter(
      (c) => c.id !== pair[0].id && c.id !== pair[1].id
    );
    const nextPool = [...remaining, chosen];
    if (remaining.length === 0) {
      setWinner(chosen);
      setPhase("winner");
      return;
    }
    setPool(nextPool);
    setPair([nextPool[0], nextPool[1]]);
    setRound((r) => r + 1);
  };

  return (
    <main className="flex-1">
      <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center px-4 pb-8 pt-24 sm:px-6">
        {/* setup */}
        {phase === "setup" && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15">
              <Swords className="h-8 w-8 text-accent" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Movie Night Duel
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Can&apos;t agree on what to watch? Pick between two titles at a
              time — last one standing wins your night.
            </p>

            <div className="mt-8 flex gap-2 rounded-xl border border-border bg-card p-1.5">
              {[
                { key: "movie", label: "Movies", icon: Film },
                { key: "tv", label: "TV Shows", icon: Tv },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setType(key)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors",
                    type === key
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            <Button size="lg" className="mt-8 gap-2" onClick={start}>
              <Sparkles className="h-4 w-4" />
              Start the Duel
            </Button>
          </div>
        )}

        {/* loading */}
        {phase === "loading" && (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* duel */}
        {phase === "duel" && pair[0] && pair[1] && (
          <div className="flex w-full flex-1 flex-col items-center justify-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Round {round} of {totalRounds}
            </p>
            <h2 className="mb-8 text-xl font-bold sm:text-2xl">
              Which one survives?
            </h2>
            <div className="flex w-full flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
              <DuelCard item={pair[0]} onPick={pick} side="left" />
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-sm font-black text-accent">
                VS
              </span>
              <DuelCard item={pair[1]} onPick={pick} side="right" />
            </div>
            <p className="mt-8 text-xs text-muted-foreground">
              {pool.length - 2} challengers waiting
            </p>
          </div>
        )}

        {/* winner */}
        {phase === "winner" && winner && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-500/15">
              <Trophy className="h-8 w-8 text-yellow-400" />
            </div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Tonight&apos;s winner
            </p>
            <h2 className="mt-2 max-w-md text-3xl font-bold tracking-tight">
              {winner.title}
            </h2>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              {winner.rating && (
                <span className="inline-flex items-center gap-1 text-yellow-400">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {winner.rating}
                </span>
              )}
              <span>{winner.year}</span>
            </div>

            <div className="relative mt-8 aspect-[2/3] w-52 overflow-hidden rounded-xl border border-accent/40 shadow-[0_0_60px_-15px] shadow-accent/50">
              {winner.poster && (
                <Image
                  src={IMG.poster(winner.poster)}
                  alt={winner.title}
                  fill
                  sizes="208px"
                  className="object-cover"
                />
              )}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" className="gap-2" onClick={() => setPhase("setup")}>
                <RotateCcw className="h-4 w-4" />
                Duel Again
              </Button>
              <Link
                href={`/${winner.mediaType}/${winner.id}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border px-6 text-base font-medium transition-colors hover:bg-muted"
              >
                View Details
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

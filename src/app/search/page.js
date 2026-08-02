"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Loader2, Film, Tv } from "lucide-react";
import { TitleCard } from "@/components/title-card";
import { cn } from "@/lib/utils";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "movie", label: "Movies", icon: Film },
  { key: "tv", label: "TV Shows", icon: Tv },
];

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const filter = searchParams.get("type") || "all";

  const [input, setInput] = useState(query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const requestId = useRef(0);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // debounce input -> URL
  useEffect(() => {
    const trimmed = input.trim();
    if (trimmed === query) return;
    const id = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (trimmed) params.set("q", trimmed);
      else params.delete("q");
      router.push(`?${params.toString()}`, { scroll: false });
    }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  // fetch on query change
  useEffect(() => {
    if (!query) {
      setResults([]);
      setSearched(false);
      return;
    }
    const id = ++requestId.current;
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        if (requestId.current !== id) return;
        setResults(data.results || []);
        setSearched(true);
      })
      .catch(() => {})
      .finally(() => {
        if (requestId.current === id) setLoading(false);
      });
  }, [query]);

  const setFilter = (type) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type === "all") params.delete("type");
    else params.set("type", type);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const filtered =
    filter === "all" ? results : results.filter((r) => r.mediaType === filter);

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-24 sm:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Search
          </h1>
        </header>

        {/* search bar */}
        <div className="relative mx-auto max-w-2xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Movies, TV shows…"
            className="h-14 w-full rounded-xl border border-border bg-card pl-12 pr-12 text-base text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-accent"
          />
          {input && (
            <button
              onClick={() => setInput("")}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* type filter */}
        {query && (
          <div className="mt-6 flex justify-center gap-2">
            {FILTERS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
                  filter === key
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                )}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {label}
              </button>
            ))}
          </div>
        )}

        {/* results */}
        <div className="mt-10">
          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!loading && searched && filtered.length === 0 && (
            <p className="py-20 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;
              {filter !== "all" &&
                ` in ${filter === "movie" ? "movies" : "TV shows"}`}
              .
            </p>
          )}

          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {filtered.map((item) => (
                <div
                  key={`${item.mediaType}-${item.id}`}
                  className="flex justify-center"
                >
                  <TitleCard item={item} />
                </div>
              ))}
            </div>
          )}

          {!loading && !searched && (
            <p className="py-20 text-center text-sm text-muted-foreground">
              Start typing to search across movies and TV shows.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

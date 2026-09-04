"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { TitleCard } from "@/components/title-card";
import { cn } from "@/lib/utils";

const PAGE_WINDOW = 5;

function pageNumbers(current, total) {
  const half = Math.floor(PAGE_WINDOW / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(total, start + PAGE_WINDOW - 1);
  start = Math.max(1, end - PAGE_WINDOW + 1);
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
}

export function BrowseGrid({ mediaType, genres, sortOptions, initial }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeGenre = searchParams.get("genre") || "";
  const activeSort = searchParams.get("sort") || "popularity.desc";
  const activeQuery = searchParams.get("q") || "";
  const activePage = Math.max(1, Number(searchParams.get("page")) || 1);

  const [items, setItems] = useState(initial.results);
  const [totalPages, setTotalPages] = useState(initial.totalPages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchInput, setSearchInput] = useState(activeQuery);
  const requestId = useRef(0);
  const gridTopRef = useRef(null);

  // fetch whenever URL params change
  useEffect(() => {
    const id = ++requestId.current;
    setLoading(true);
    setError(false);

    const params = new URLSearchParams({
      type: mediaType,
      genre: activeGenre,
      sort: activeSort,
      page: String(activePage),
    });
    if (activeQuery) params.set("q", activeQuery);

    fetch(`/api/discover?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (requestId.current !== id) return;
        setItems(data.results);
        setTotalPages(data.totalPages);
      })
      .catch(() => {
        if (requestId.current === id) setError(true);
      })
      .finally(() => {
        if (requestId.current === id) setLoading(false);
      });
  }, [mediaType, activeGenre, activeSort, activeQuery, activePage]);

  const setParams = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const goToPage = (page) => {
    setParams({ page: page > 1 ? String(page) : "" });
    gridTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // debounced search
  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed === activeQuery) return;
    const id = setTimeout(() => {
      setParams({ q: trimmed, page: "" });
    }, 450);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const pages = pageNumbers(activePage, totalPages);

  return (
    <div ref={gridTopRef} className="scroll-mt-24">
      {/* search + sort bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={`Search ${mediaType === "movie" ? "movies" : "TV shows"}…`}
            className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-accent"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <label className="relative flex items-center">
          <ArrowUpDown className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted-foreground" />
          <select
            value={activeSort}
            onChange={(e) => setParams({ sort: e.target.value, page: "" })}
            disabled={!!activeQuery}
            className="h-11 w-full appearance-none rounded-lg border border-border bg-card pl-10 pr-8 text-sm text-foreground outline-none transition-colors focus:border-accent disabled:opacity-40 sm:w-52"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon />
        </label>
      </div>

      {/* genre pills — hidden while searching since TMDB search can't combine */}
      {!activeQuery && (
        <div className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          <button
            onClick={() => setParams({ genre: "", page: "" })}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              !activeGenre
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
            )}
          >
            All
          </button>
          {genres.map((g) => (
            <button
              key={g.id}
              onClick={() =>
                setParams({
                  genre: activeGenre === String(g.id) ? "" : String(g.id),
                  page: "",
                })
              }
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                activeGenre === String(g.id)
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              )}
            >
              {g.name}
            </button>
          ))}
        </div>
      )}

      {activeQuery && (
        <p className="mb-6 text-sm text-muted-foreground">
          Results for{" "}
          <span className="font-medium text-foreground">
            &ldquo;{activeQuery}&rdquo;
          </span>
        </p>
      )}

      {/* grid */}
      <div
        className={cn(
          "grid grid-cols-2 gap-x-4 gap-y-8 transition-opacity sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
          loading && "pointer-events-none opacity-40"
        )}
      >
        {items.map((item) => (
          <div key={item.id} className="flex justify-center">
            <TitleCard item={item} />
          </div>
        ))}
      </div>

      {error && !loading && (
        <p className="py-20 text-center text-sm text-red-400">
          Something went wrong. Please try again.
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="py-20 text-center text-sm text-muted-foreground">
          Nothing found. Try a different search or filter.
        </p>
      )}

      {/* pagination */}
      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-1.5">
          <button
            onClick={() => goToPage(activePage - 1)}
            disabled={activePage <= 1 || loading}
            aria-label="Previous page"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {pages[0] > 1 && (
            <>
              <PageButton page={1} active={activePage} onClick={goToPage} />
              {pages[0] > 2 && (
                <span className="px-1 text-muted-foreground">…</span>
              )}
            </>
          )}

          {pages.map((p) => (
            <PageButton key={p} page={p} active={activePage} onClick={goToPage} />
          ))}

          {pages[pages.length - 1] < totalPages && (
            <>
              {pages[pages.length - 1] < totalPages - 1 && (
                <span className="px-1 text-muted-foreground">…</span>
              )}
              <PageButton
                page={totalPages}
                active={activePage}
                onClick={goToPage}
              />
            </>
          )}

          <button
            onClick={() => goToPage(activePage + 1)}
            disabled={activePage >= totalPages || loading}
            aria-label="Next page"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      )}

      {loading && (
        <div className="mt-6 flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

function PageButton({ page, active, onClick }) {
  return (
    <button
      onClick={() => onClick(page)}
      className={cn(
        "h-9 min-w-9 rounded-md border px-2 text-sm font-medium transition-colors",
        page === active
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
      )}
    >
      {page}
    </button>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      className="pointer-events-none absolute right-3 h-4 w-4 text-muted-foreground"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

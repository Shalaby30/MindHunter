import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BrowseGrid } from "@/components/browse-grid";
import {
  discoverTitles,
  searchTitles,
  getGenreList,
  SORT_OPTIONS,
} from "@/lib/tmdb";

export const metadata = {
  title: "TV Shows — mindhunter",
  description: "Browse and discover TV shows by genre, rating and popularity.",
};

export default async function TvShowsPage({ searchParams }) {
  const sp = await searchParams;
  const genre = sp.genre || "";
  const sort = sp.sort || "popularity.desc";
  const query = sp.q?.trim() || "";
  const page = Math.max(1, Number(sp.page) || 1);

  const [initial, genres] = await Promise.all([
    query
      ? searchTitles("tv", query, page)
      : discoverTitles("tv", { genre, sort, page }),
    getGenreList("tv"),
  ]);

  const sortOptions = SORT_OPTIONS.filter((o) => !o.movieOnly);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="px-4 pb-8 pt-24 sm:px-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              TV Shows
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              From slow-burn dramas to binge-worthy comedies — find your next
              obsession.
            </p>
          </header>

          <Suspense fallback={null}>
            <BrowseGrid
              mediaType="tv"
              genres={genres}
              sortOptions={sortOptions}
              initial={initial}
            />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}

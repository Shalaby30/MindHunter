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
  title: "Movies — mindhunter",
  description: "Browse and discover movies by genre, rating and popularity.",
};

export default async function MoviesPage({ searchParams }) {
  const sp = await searchParams;
  const genre = sp.genre || "";
  const sort = sp.sort || "popularity.desc";
  const query = sp.q?.trim() || "";
  const page = Math.max(1, Number(sp.page) || 1);

  const [initial, genres] = await Promise.all([
    query
      ? searchTitles("movie", query, page)
      : discoverTitles("movie", { genre, sort, page }),
    getGenreList("movie"),
  ]);

  const sortOptions = SORT_OPTIONS.filter((o) => !o.tvOnly);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-24 sm:px-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Movies
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Every film worth your time — filter by genre, sort by what
              matters to you.
            </p>
          </header>

          <Suspense fallback={null}>
            <BrowseGrid
              mediaType="movie"
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

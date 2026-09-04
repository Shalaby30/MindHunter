import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DetailHero } from "@/components/detail-hero";
import { CastRow } from "@/components/cast-row";
import { WatchProviders } from "@/components/watch-providers";
import { ContentRow } from "@/components/content-row";
import { getMovieDetails, getWatchProviders } from "@/lib/tmdb";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const movie = await getMovieDetails(id);
    return {
      title: `${movie.title} — mindhunter`,
      description: movie.overview,
    };
  } catch {
    return { title: "Movie — mindhunter" };
  }
}

export default async function MoviePage({ params }) {
  const { id } = await params;

  let movie;
  try {
    movie = await getMovieDetails(id);
  } catch {
    notFound();
  }

  const providers = await getWatchProviders("movie", id);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <DetailHero item={movie} />
        <div className="px-4 sm:px-6">
          <WatchProviders providers={providers} />
          <CastRow cast={movie.cast} />
        </div>
        {movie.similar.length > 0 && (
          <ContentRow
            title="More Like This"
            subtitle={`Because you watched ${movie.title}`}
            items={movie.similar}
          />
        )}
      </main>
      <Footer />
    </>
  );
}

import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WatchPlayer } from "@/components/watch-player";
import { getMovieDetails } from "@/lib/tmdb";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const movie = await getMovieDetails(id);
    return {
      title: `Watch ${movie.title} — mindhunter`,
      description: `Stream ${movie.title} with Videasy.`,
    };
  } catch {
    return { title: "Watch Movie — mindhunter" };
  }
}

export default async function WatchMoviePage({ params }) {
  const { id } = await params;

  let movie;
  try {
    movie = await getMovieDetails(id);
  } catch {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <WatchPlayer item={movie} mediaType="movie" />
      </main>
      <Footer />
    </>
  );
}

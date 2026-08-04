import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WatchPlayer } from "@/components/watch-player";
import { getTvDetails, getSeasonDetails } from "@/lib/tmdb";

export async function generateMetadata({ params, searchParams }) {
  const { id } = await params;
  const season = (await searchParams)?.season || "1";
  const episode = (await searchParams)?.episode || "1";

  try {
    const show = await getTvDetails(id);
    return {
      title: `Watch ${show.title} S${season}E${episode} — mindhunter`,
      description: `Stream ${show.title} with Videasy.`,
    };
  } catch {
    return { title: "Watch TV Show — mindhunter" };
  }
}

export default async function WatchTvPage({ params, searchParams }) {
  const { id } = await params;
  const season = Number((await searchParams)?.season || 1);
  const episode = Number((await searchParams)?.episode || 1);

  let show;
  try {
    show = await getTvDetails(id);
  } catch {
    notFound();
  }

  let initialEpisodes = [];
  if (show.seasonList?.length) {
    try {
      const seasonData = await getSeasonDetails(id, season || 1);
      initialEpisodes = seasonData.episodes || [];
    } catch {
      initialEpisodes = [];
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <WatchPlayer
          item={show}
          mediaType="tv"
          seasons={show.seasonList}
          initialSeason={season || 1}
          initialEpisode={episode || 1}
          initialEpisodes={initialEpisodes}
        />
      </main>
      <Footer />
    </>
  );
}

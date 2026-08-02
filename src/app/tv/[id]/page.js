import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DetailHero } from "@/components/detail-hero";
import { CastRow } from "@/components/cast-row";
import { WatchProviders } from "@/components/watch-providers";
import { SeasonBrowser } from "@/components/season-browser";
import { ContentRow } from "@/components/content-row";
import { getTvDetails, getWatchProviders } from "@/lib/tmdb";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const show = await getTvDetails(id);
    return {
      title: `${show.title} — mindhunter`,
      description: show.overview,
    };
  } catch {
    return { title: "TV Show — mindhunter" };
  }
}

export default async function TvPage({ params }) {
  const { id } = await params;

  let show;
  try {
    show = await getTvDetails(id);
  } catch {
    notFound();
  }

  const providers = await getWatchProviders("tv", id);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <DetailHero item={show} />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <WatchProviders providers={providers} />
          <SeasonBrowser tvId={show.id} seasons={show.seasonList} />
          <CastRow cast={show.cast} />
        </div>
        {show.similar.length > 0 && (
          <ContentRow
            title="More Like This"
            subtitle={`Because you watched ${show.title}`}
            items={show.similar}
          />
        )}
      </main>
      <Footer />
    </>
  );
}

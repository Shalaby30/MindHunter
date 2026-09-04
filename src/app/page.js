import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ContentRow } from "@/components/content-row";
import { ContinueWatchingRow } from "@/components/continue-watching-row";
import { Footer } from "@/components/footer";
import {
  getTrendingAll,
  getTrendingMovies,
  getTrendingTv,
  getTopRatedMovies,
  getNowPlaying,
  getAiringTodayTv,
  getGenres,
} from "@/lib/tmdb";

export default async function Home() {
  const [
    trendingAll,
    trendingMovies,
    trendingTv,
    topRated,
    nowPlaying,
    airingToday,
    genres,
  ] = await Promise.all([
    getTrendingAll(),
    getTrendingMovies(),
    getTrendingTv(),
    getTopRatedMovies(),
    getNowPlaying(),
    getAiringTodayTv(),
    getGenres(),
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero items={trendingAll} genres={genres} />

        <div className="-mt-10 relative z-10 space-y-2">
          <ContinueWatchingRow />
          <ContentRow
            title="Top 10 This Week"
            subtitle="What everyone's watching right now"
            items={trendingAll.slice(0, 10)}
            ranked
          />
          <ContentRow
            title="Trending Movies"
            subtitle="The films dominating the conversation"
            items={trendingMovies}
          />
          <ContentRow
            title="Trending TV Shows"
            subtitle="Series worth your weekend"
            items={trendingTv}
          />
          <ContentRow
            title="Now Playing in Theaters"
            subtitle="Fresh on the big screen"
            items={nowPlaying}
          />
          <ContentRow
            title="Critics' Favorites"
            subtitle="The highest rated films of all time"
            items={topRated}
          />
          <ContentRow
            title="Airing Today"
            subtitle="New episodes dropping today"
            items={airingToday}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}

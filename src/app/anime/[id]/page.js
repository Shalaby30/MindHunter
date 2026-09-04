import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PlayCircle, Film } from "lucide-react";

const ANIME_ITEMS = [
  {
    id: 1,
    mediaType: "anime",
    title: "Attack on Titan",
    overview: "Humanity fights for survival against giant humanoid Titans.",
    year: "2013",
    rating: 8.7,
  },
  {
    id: 2,
    mediaType: "anime",
    title: "Death Note",
    overview: "A genius teenager discovers a notebook that can kill anyone.",
    year: "2006",
    rating: 8.6,
  },
  {
    id: 3,
    mediaType: "anime",
    title: "Spy x Family",
    overview: "A spy, an assassin, and a telepath keep a fake family together.",
    year: "2022",
    rating: 8.4,
  },
  {
    id: 4,
    mediaType: "anime",
    title: "Fullmetal Alchemist: Brotherhood",
    overview: "Two brothers search for the Philosopher's Stone to restore their bodies.",
    year: "2009",
    rating: 9.1,
  },
  {
    id: 5,
    mediaType: "anime",
    title: "One Piece",
    overview: "A boy with a devil fruit sets sail to become the Pirate King.",
    year: "1999",
    rating: 8.7,
  },
  {
    id: 6,
    mediaType: "anime",
    title: "Jujutsu Kaisen",
    overview: "A high school student joins a secret organization to fight curses.",
    year: "2020",
    rating: 8.6,
  },
];

export async function generateMetadata({ params }) {
  const { id } = await params;
  const anime = ANIME_ITEMS.find((item) => String(item.id) === id);

  if (!anime) {
    return { title: "Anime — mindhunter" };
  }

  return {
    title: `${anime.title} — mindhunter`,
    description: anime.overview,
  };
}

export default async function AnimeDetailPage({ params }) {
  const { id } = await params;
  const anime = ANIME_ITEMS.find((item) => String(item.id) === id);

  if (!anime) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="px-4 pb-8 pt-24 sm:px-6">
          <div className="rounded-3xl border border-border bg-card/70 p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-sm text-muted-foreground">
                  <Film className="h-4 w-4" />
                  Anime
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  {anime.title}
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                  {anime.overview}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-background/70 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Details</p>
                <ul className="mt-3 space-y-2">
                  <li>Year: {anime.year}</li>
                  <li>Rating: {anime.rating}</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/anime"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background/70 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <PlayCircle className="h-4 w-4" />
                Back to Anime
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TitleCard } from "@/components/title-card";

const ANIME_ITEMS = [
  {
    id: 1,
    mediaType: "anime",
    title: "Attack on Titan",
    overview: "Humanity fights for survival against giant humanoid Titans.",
    poster: null,
    backdrop: null,
    rating: 8.7,
    year: "2013",
    genreIds: [10765, 16],
  },
  {
    id: 2,
    mediaType: "anime",
    title: "Death Note",
    overview: "A genius teenager discovers a notebook that can kill anyone.",
    poster: null,
    backdrop: null,
    rating: 8.6,
    year: "2006",
    genreIds: [80, 9648],
  },
  {
    id: 3,
    mediaType: "anime",
    title: "Spy x Family",
    overview: "A spy, an assassin, and a telepath keep a fake family together.",
    poster: null,
    backdrop: null,
    rating: 8.4,
    year: "2022",
    genreIds: [35, 16],
  },
  {
    id: 4,
    mediaType: "anime",
    title: "Fullmetal Alchemist: Brotherhood",
    overview: "Two brothers search for the Philosopher's Stone to restore their bodies.",
    poster: null,
    backdrop: null,
    rating: 9.1,
    year: "2009",
    genreIds: [18, 16],
  },
  {
    id: 5,
    mediaType: "anime",
    title: "One Piece",
    overview: "A boy with a devil fruit sets sail to become the Pirate King.",
    poster: null,
    backdrop: null,
    rating: 8.7,
    year: "1999",
    genreIds: [12, 16],
  },
  {
    id: 6,
    mediaType: "anime",
    title: "Jujutsu Kaisen",
    overview: "A high school student joins a secret organization to fight curses.",
    poster: null,
    backdrop: null,
    rating: 8.6,
    year: "2020",
    genreIds: [16, 14],
  },
];

export const metadata = {
  title: "Anime — mindhunter",
  description: "Browse curated anime titles and discover your next favorite series.",
};

export default function AnimePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-24 sm:px-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Anime
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Discover iconic anime series and films in a clean, browse-friendly layout.
            </p>
          </header>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {ANIME_ITEMS.map((item) => (
              <div key={item.id} className="flex justify-center">
                <TitleCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

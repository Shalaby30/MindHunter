import Image from "next/image";
import { notFound } from "next/navigation";
import { Cake, MapPin, User, Clapperboard } from "lucide-react";
import { getPersonDetails, IMG_PROFILE } from "@/lib/tmdb";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TitleCard } from "@/components/title-card";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const person = await getPersonDetails(id);
    return {
      title: `${person.name} — mindhunter`,
      description: person.biography?.slice(0, 160) || `Works by ${person.name}`,
    };
  } catch {
    return { title: "Person — mindhunter" };
  }
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PersonPage({ params }) {
  const { id } = await params;

  let person;
  try {
    person = await getPersonDetails(id);
  } catch {
    notFound();
  }

  const profile = IMG_PROFILE(person.profile, "h632");

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-24 sm:px-6">
          {/* header */}
          <div className="flex flex-col gap-8 sm:flex-row">
            <div className="relative mx-auto h-64 w-44 shrink-0 overflow-hidden rounded-xl border border-border bg-muted sm:mx-0 sm:h-80 sm:w-56">
              {profile ? (
                <Image
                  src={profile}
                  alt={person.name}
                  fill
                  sizes="(max-width: 640px) 176px, 224px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <User className="h-16 w-16" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {person.name}
                </h1>
                {person.knownFor && (
                  <Badge variant="secondary">{person.knownFor}</Badge>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                {person.birthday && (
                  <span className="inline-flex items-center gap-1.5">
                    <Cake className="h-4 w-4" />
                    {formatDate(person.birthday)}
                    {person.deathday && ` — ${formatDate(person.deathday)}`}
                  </span>
                )}
                {person.placeOfBirth && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {person.placeOfBirth}
                  </span>
                )}
              </div>

              {person.biography && (
                <p className="mt-5 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-muted-foreground line-clamp-[12]">
                  {person.biography}
                </p>
              )}
            </div>
          </div>

          {/* known for */}
          {person.credits.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold tracking-tight sm:text-xl">
                <Clapperboard className="h-5 w-5 text-accent" />
                Known For
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {person.credits.map((item) => (
                  <div
                    key={`${item.mediaType}-${item.id}`}
                    className="flex justify-center"
                  >
                    <TitleCard item={item} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* behind the camera */}
          {person.crewCredits.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-5 text-lg font-semibold tracking-tight sm:text-xl">
                As Director / Creator
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {person.crewCredits.map((item) => (
                  <div
                    key={`${item.mediaType}-${item.id}`}
                    className="flex justify-center"
                  >
                    <TitleCard item={item} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

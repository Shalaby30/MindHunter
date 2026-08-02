import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import { IMG_PROFILE } from "@/lib/tmdb";

export function CastRow({ cast }) {
  if (!cast?.length) return null;

  return (
    <section className="py-6">
      <h2 className="mb-4 text-lg font-semibold tracking-tight sm:text-xl">
        Top Cast
      </h2>
      <div className="no-scrollbar flex gap-5 overflow-x-auto pb-2">
        {cast.map((person) => (
          <Link
            key={person.id}
            href={`/person/${person.id}`}
            className="group w-24 shrink-0 text-center"
          >
            <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border border-border bg-muted transition-colors group-hover:border-accent">
              {person.profile ? (
                <Image
                  src={IMG_PROFILE(person.profile)}
                  alt={person.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <User className="h-8 w-8" />
                </div>
              )}
            </div>
            <p className="mt-2 line-clamp-2 text-xs font-medium leading-tight transition-colors group-hover:text-accent">
              {person.name}
            </p>
            <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
              {person.character}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

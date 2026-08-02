import Image from "next/image";
import { MonitorPlay } from "lucide-react";

const LOGO = (path) => `https://image.tmdb.org/t/p/w92${path}`;

function ProviderGroup({ label, providers }) {
  if (!providers?.length) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {providers.map((p) => (
          <div
            key={p.id}
            title={p.name}
            className="relative h-10 w-10 overflow-hidden rounded-lg border border-border bg-muted"
          >
            <Image
              src={LOGO(p.logo)}
              alt={p.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function WatchProviders({ providers }) {
  if (!providers || (!providers.stream.length && !providers.rent.length && !providers.buy.length)) {
    return null;
  }

  return (
    <section className="py-6">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-tight sm:text-xl">
        <MonitorPlay className="h-5 w-5 text-accent" />
        Where to Watch
      </h2>
      <div className="flex flex-wrap gap-x-10 gap-y-5 rounded-xl border border-border bg-card p-5">
        <ProviderGroup label="Stream" providers={providers.stream} />
        <ProviderGroup label="Rent" providers={providers.rent} />
        <ProviderGroup label="Buy" providers={providers.buy} />
      </div>
      {providers.link && (
        <p className="mt-2 text-xs text-muted-foreground">
          Availability for US region ·{" "}
          <a
            href={providers.link}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            All options on TMDB
          </a>
        </p>
      )}
    </section>
  );
}

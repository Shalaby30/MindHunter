"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Bookmark, Heart, Clock, Compass } from "lucide-react";
import { useLibrary } from "@/lib/library";
import { TitleCard } from "@/components/title-card";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "wishlist", label: "My List", icon: Bookmark },
  { key: "favorites", label: "Favorites", icon: Heart },
  { key: "watchLater", label: "Watch Later", icon: Clock },
];

export default function MyListPage() {
  const { wishlist, favorites, watchLater, hydrated } = useLibrary();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab = TABS.some((t) => t.key === tabParam)
    ? tabParam
    : "wishlist";
  const [tab, setTab] = useState(initialTab);

  const lists = { wishlist, favorites, watchLater };
  const items = lists[tab];

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-24 sm:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            My Library
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Everything you&apos;ve saved, in one place.
          </p>
        </header>

        {/* tabs */}
        <div className="mb-8 flex gap-1.5 border-b border-border">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors",
                tab === key
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  tab === key && "text-accent"
                )}
              />
              {label}
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                {hydrated ? lists[key].length : 0}
              </span>
              {tab === key && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-accent" />
              )}
            </button>
          ))}
        </div>

        {!hydrated ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="mx-auto aspect-[2/3] w-[150px] animate-pulse rounded-lg bg-muted sm:w-[170px]"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 text-center">
            {(() => {
              const Icon = TABS.find((t) => t.key === tab).icon;
              return <Icon className="h-10 w-10 text-muted-foreground/40" />;
            })()}
            <p className="mt-4 text-sm font-medium">Nothing here yet</p>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              {tab === "wishlist" &&
                "Save movies and shows to your list and they'll show up here."}
              {tab === "favorites" &&
                "Tap the heart on anything you love to keep it here."}
              {tab === "watchLater" &&
                "Not in the mood right now? Park it here for later."}
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
            >
              <Compass className="h-4 w-4" />
              Discover something
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {items.map((item) => (
              <div
                key={`${item.mediaType}-${item.id}`}
                className="flex justify-center"
              >
                <TitleCard item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

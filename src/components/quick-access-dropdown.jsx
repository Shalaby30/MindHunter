"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, Clock, Heart, ChevronDown } from "lucide-react";
import { useLibrary } from "@/lib/library";
import { IMG } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

const LIBRARY_OPTIONS = [
  { key: "wishlist", label: "My List", href: "/my-list", icon: Bookmark },
  {
    key: "watchLater",
    label: "Watch Later",
    href: "/my-list?tab=watchLater",
    icon: Clock,
  },
  {
    key: "favorites",
    label: "My Favorites",
    href: "/my-list?tab=favorites",
    icon: Heart,
  },
];

export function QuickAccessDropdown() {
  const { wishlist, favorites, watchLater, hydrated } = useLibrary();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeList, setActiveList] = useState("wishlist");
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [menuOpen]);

  const lists = { wishlist, watchLater, favorites };
  const activeOption = LIBRARY_OPTIONS.find((option) => option.key === activeList);
  const activeItems = lists[activeList] || [];

  return (
    <div ref={menuRef} className="fixed bottom-6 left-6 z-50">
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        className="flex items-center gap-1.5 rounded-full border border-border bg-background/90 backdrop-blur-md px-3 py-1.5 text-xs transition-colors hover:border-foreground/30 hover:bg-muted/50 shadow-lg"
        aria-label="Quick access"
        aria-expanded={menuOpen}
      >
        <ChevronDown className={cn("h-4 w-4 transition-transform", menuOpen && "rotate-180")} />
      </button>

      {menuOpen && (
        <div className="absolute left-0 bottom-full mb-2 flex w-[min(92vw,34rem)] overflow-hidden rounded-xl border border-border bg-card shadow-2xl animate-in slide-in-from-bottom-2 fade-in duration-200">
          <div className="w-36 shrink-0 border-r border-border bg-muted/30 p-2 sm:w-40">
            {LIBRARY_OPTIONS.map((option) => (
              <LibraryOption
                key={option.key}
                option={option}
                active={activeList === option.key}
                count={hydrated ? lists[option.key].length : 0}
                onClick={() => setActiveList(option.key)}
              />
            ))}
          </div>

          <div className="min-w-0 flex-1 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">{activeOption.label}</p>
              <Link
                href={activeOption.href}
                onClick={() => setMenuOpen(false)}
                className="text-[11px] text-accent hover:underline"
              >
                View all
              </Link>
            </div>
            {!hydrated ? (
              <div className="h-24 animate-pulse rounded-lg bg-muted" />
            ) : activeItems.length === 0 ? (
              <p className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border px-3 text-center text-xs text-muted-foreground">
                Nothing saved here yet
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {activeItems.slice(0, 4).map((item) => (
                  <Link
                    key={`${item.mediaType}-${item.id}`}
                    href={`/${item.mediaType}/${item.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="group/item min-w-0"
                    title={item.title}
                  >
                    <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-muted">
                      {IMG.poster(item.poster) ? (
                        <Image
                          src={IMG.poster(item.poster)}
                          alt={item.title}
                          fill
                          sizes="72px"
                          className="object-cover transition-transform group-hover/item:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    <p className="mt-1 truncate text-[10px] text-muted-foreground group-hover/item:text-foreground">
                      {item.title}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function LibraryOption({ option, active, count, onClick }) {
  const Icon = option.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-lg px-2 py-2.5 text-left text-xs transition-colors",
        active
          ? "bg-accent/15 font-medium text-accent"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <span className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5" />
        {option.label}
      </span>
      <span className="text-[10px]">{count}</span>
    </button>
  );
}

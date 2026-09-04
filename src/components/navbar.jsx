"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Bookmark, Heart, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { AuthButton } from "@/components/auth-button";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "TV Shows" },
  { href: "/mood", label: "Mood" },
  { href: "/duel", label: "Duel" },
  { href: "/my-list", label: "My List" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border"
          : "bg-gradient-to-b from-black/80 to-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 items-center justify-between sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="mindhunter" width={96} height={32} />
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-1 md:flex">
          <Link
            href="/search"
            aria-label="Search"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
          >
            <Search className="h-4 w-4" />
          </Link>
          <Link
            href="/my-list"
            aria-label="My List"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
          >
            <Bookmark className="h-4 w-4" />
          </Link>
          <Link
            href="/my-list?tab=favorites"
            aria-label="Favorites"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
          >
            <Heart className="h-4 w-4" />
          </Link>
          <AuthButton />
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-muted-foreground hover:bg-white/10 md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-md md:hidden">
          <div className="flex flex-col px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center gap-2">
              <Link
                href="/search"
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </Link>
              <Link
                href="/my-list"
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
                aria-label="My List"
              >
                <Bookmark className="h-4 w-4" />
              </Link>
              <Link
                href="/my-list?tab=favorites"
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
                aria-label="Favorites"
              >
                <Heart className="h-4 w-4" />
              </Link>
              <AuthButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bookmark, Heart, Menu, X, Film, Tv, Sparkles, Swords, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthButton } from "@/components/auth-button";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: null },
  { href: "/movies", label: "Movies", icon: Film },
  { href: "/tv", label: "TV Shows", icon: Tv },
  { href: "/mood", label: "Mood", icon: Sparkles },
  { href: "/duel", label: "Duel", icon: Swords },
  { href: "/my-list", label: "My List", icon: List },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
      )}
    >
      <nav className="mx-auto grid h-16 grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-start transition-opacity hover:opacity-80">
          <Image src="/logo.png" alt="mindhunter" width={96} height={32} />
        </Link>

        {/* Desktop Nav - Centered */}
        <div className="hidden items-center justify-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.icon && <link.icon className="h-3.5 w-3.5" />}
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-1 -bottom-1 h-0.5 rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center justify-end gap-1 md:flex">
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Link
            href="/my-list"
            aria-label="My List"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <Bookmark className="h-4 w-4" />
          </Link>
          <Link
            href="/my-list?tab=favorites"
            aria-label="Favorites"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <Heart className="h-4 w-4" />
          </Link>
          <div className="ml-1 h-5 w-px bg-white/10" />
          <AuthButton />
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-white/5 bg-background/98 backdrop-blur-xl transition-all duration-300 md:hidden",
          mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="space-y-1 px-4 py-4">
          {NAV_LINKS.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </Link>
            );
          })}
          <div className="my-3 h-px bg-white/5" />
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Link>
            <Link
              href="/my-list"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              aria-label="My List"
            >
              <Bookmark className="h-4 w-4" />
            </Link>
            <Link
              href="/my-list?tab=favorites"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              aria-label="Favorites"
            >
              <Heart className="h-4 w-4" />
            </Link>
            <div className="ml-auto">
              <AuthButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

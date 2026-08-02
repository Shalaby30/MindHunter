"use client";

import Image from "next/image";
import { LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AuthButton() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-9 w-9 animate-pulse rounded-full bg-muted" aria-hidden />
    );
  }

  if (!user) {
    return (
      <a
        href="/api/auth/login"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "gap-1.5"
        )}
      >
        <LogIn className="h-3.5 w-3.5" />
        <span className="hidden lg:inline">Sign in with TMDB</span>
        <span className="lg:hidden">Sign in</span>
      </a>
    );
  }

  return (
    <div className="group relative">
      <button
        className="flex items-center gap-2 rounded-full border border-border p-0.5 pr-2.5 transition-colors hover:border-foreground/30"
        aria-label="Account menu"
      >
        <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-muted">
          {user.avatar ? (
            <Image
              src={`https://image.tmdb.org/t/p/w45${user.avatar}`}
              alt={user.name}
              fill
              sizes="28px"
              className="object-cover"
            />
          ) : (
            <User className="h-4 w-4 text-muted-foreground" />
          )}
        </span>
        <span className="max-w-24 truncate text-xs font-medium">
          {user.name}
        </span>
      </button>

      {/* dropdown */}
      <div className="invisible absolute right-0 top-full z-50 mt-2 w-44 rounded-lg border border-border bg-card p-1.5 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
        <p className="px-2.5 py-1.5 text-xs text-muted-foreground">
          Signed in as{" "}
          <span className="font-medium text-foreground">@{user.username}</span>
        </p>
        <a
          href="/api/auth/logout"
          className="flex items-center gap-2 rounded-md px-2.5 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </a>
      </div>
    </div>
  );
}

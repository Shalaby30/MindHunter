"use client";

import { useEffect } from "react";

export default function TVError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-24 text-center">
      <div className="mb-6 text-6xl font-bold text-accent/20">!</div>
      <h1 className="mb-3 text-2xl font-bold text-foreground">Failed to load show</h1>
      <p className="mb-8 max-w-md text-sm text-muted-foreground">
        We couldn&apos;t load this TV show. Please try again.
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent/80"
      >
        Try Again
      </button>
    </div>
  );
}

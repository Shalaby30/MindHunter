"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TitleCard } from "@/components/title-card";
import { cn } from "@/lib/utils";

export function ContentRow({ title, subtitle, items, ranked = false }) {
  const rowRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = () => {
    const el = rowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    updateArrows();
    const el = rowRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const scrollBy = (dir) => {
    const el = rowRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  if (!items?.length) return null;

  return (
    <section className="relative py-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      <div className="group/row relative mx-auto max-w-7xl">
        <button
          onClick={() => scrollBy(-1)}
          aria-label="Scroll left"
          className={cn(
            "absolute left-1 top-0 z-20 hidden h-[calc(100%-3.5rem)] w-10 items-center justify-center rounded-r-lg bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/70 group-hover/row:opacity-100 sm:flex",
            !canScrollLeft && "pointer-events-none !opacity-0"
          )}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div
          ref={rowRef}
          className="no-scrollbar row-fade flex gap-4 overflow-x-auto scroll-smooth px-4 pb-1 sm:px-6"
        >
          {items.map((item, i) => (
            <TitleCard
              key={`${item.mediaType}-${item.id}`}
              item={item}
              rank={ranked ? i + 1 : undefined}
            />
          ))}
        </div>

        <button
          onClick={() => scrollBy(1)}
          aria-label="Scroll right"
          className={cn(
            "absolute right-1 top-0 z-20 hidden h-[calc(100%-3.5rem)] w-10 items-center justify-center rounded-l-lg bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/70 group-hover/row:opacity-100 sm:flex",
            !canScrollRight && "pointer-events-none !opacity-0"
          )}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
}

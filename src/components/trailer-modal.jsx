"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function TrailerModal({ videoKey, title, open, onClose }) {
  if (!open || !videoKey) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close trailer"
          className="absolute -top-10 right-0 rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="aspect-video w-full overflow-hidden rounded-lg border border-border">
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
            title={title || "Trailer"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}

export function useTrailer() {
  const [state, setState] = useState({ open: false, key: null, title: null });

  const openTrailer = (key, title) => setState({ open: true, key, title });
  const closeTrailer = () => setState((s) => ({ ...s, open: false }));

  return { trailer: state, openTrailer, closeTrailer };
}

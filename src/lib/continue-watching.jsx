"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const ContinueWatchingContext = createContext(null);
const STORAGE_KEY = "mh_continue_watching";

function readStorage() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function writeStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function ContinueWatchingProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStorage());
    setHydrated(true);
  }, []);

  const addOrUpdate = useCallback((item, season, episode) => {
    setItems((prev) => {
      const key = `${item.mediaType}-${item.id}`;
      const existing = prev.find((i) => i.key === key);
      let next;

      if (existing) {
        next = prev.map((i) =>
          i.key === key
            ? { ...i, season, episode, timestamp: Date.now() }
            : i
        );
      } else {
        next = [
          {
            key,
            id: item.id,
            mediaType: item.mediaType,
            title: item.title,
            poster: item.poster,
            season,
            episode,
            timestamp: Date.now(),
          },
          ...prev,
        ];
      }

      next = next.slice(0, 20);
      writeStorage(next);
      return next;
    });
  }, []);

  const remove = useCallback((mediaType, id) => {
    setItems((prev) => {
      const next = prev.filter(
        (i) => !(i.mediaType === mediaType && i.id === id)
      );
      writeStorage(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    writeStorage([]);
  }, []);

  return (
    <ContinueWatchingContext.Provider
      value={{ items, hydrated, addOrUpdate, remove, clear }}
    >
      {children}
    </ContinueWatchingContext.Provider>
  );
}

export function useContinueWatching() {
  const ctx = useContext(ContinueWatchingContext);
  if (!ctx)
    throw new Error(
      "useContinueWatching must be used within ContinueWatchingProvider"
    );
  return ctx;
}

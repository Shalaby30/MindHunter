"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";

const LibraryContext = createContext(null);

const STORAGE_KEYS = {
  wishlist: "mh_wishlist",
  favorites: "mh_favorites",
  watchLater: "mh_watch_later",
};

function readStorage(key) {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or blocked — fail silently
  }
}

// push a toggle to the user's TMDB account (fire and forget)
function syncToTmdb(list, item, active) {
  fetch("/api/auth/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      list,
      mediaType: item.mediaType,
      mediaId: item.id,
      active,
    }),
  }).catch(() => {});
}

function mergeUnique(local, remote) {
  const seen = new Set(local.map((i) => `${i.mediaType}-${i.id}`));
  return [...local, ...remote.filter((i) => !seen.has(`${i.mediaType}-${i.id}`))];
}

export function LibraryProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [watchLater, setWatchLater] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setWishlist(readStorage(STORAGE_KEYS.wishlist));
    setFavorites(readStorage(STORAGE_KEYS.favorites));
    setWatchLater(readStorage(STORAGE_KEYS.watchLater));
    setHydrated(true);
  }, []);

  // when signed in, pull the TMDB account lists and merge with local ones
  useEffect(() => {
    if (!user) return;
    fetch("/api/auth/sync")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setFavorites((prev) => {
          const next = mergeUnique(prev, data.favorites || []);
          writeStorage(STORAGE_KEYS.favorites, next);
          return next;
        });
        setWishlist((prev) => {
          const next = mergeUnique(prev, data.watchlist || []);
          writeStorage(STORAGE_KEYS.wishlist, next);
          return next;
        });
      })
      .catch(() => {});
  }, [user]);

  const toggle = useCallback((list, setList, key, item, syncList) => {
    const exists = list.some(
      (i) => i.id === item.id && i.mediaType === item.mediaType
    );
    setList((prev) => {
      const wasIn = prev.some(
        (i) => i.id === item.id && i.mediaType === item.mediaType
      );
      const next = wasIn
        ? prev.filter(
            (i) => !(i.id === item.id && i.mediaType === item.mediaType)
          )
        : [...prev, item];
      writeStorage(key, next);
      return next;
    });
    if (syncList) syncToTmdb(syncList, item, !exists);
  }, []);

  const toggleWishlist = useCallback(
    (item) =>
      toggle(wishlist, setWishlist, STORAGE_KEYS.wishlist, item, "watchlist"),
    [toggle, wishlist]
  );

  const toggleFavorite = useCallback(
    (item) =>
      toggle(favorites, setFavorites, STORAGE_KEYS.favorites, item, "favorite"),
    [toggle, favorites]
  );

  const toggleWatchLater = useCallback(
    (item) => toggle(watchLater, setWatchLater, STORAGE_KEYS.watchLater, item),
    [toggle, watchLater]
  );

  const inWishlist = useCallback(
    (id, mediaType) =>
      wishlist.some((i) => i.id === id && i.mediaType === mediaType),
    [wishlist]
  );

  const inFavorites = useCallback(
    (id, mediaType) =>
      favorites.some((i) => i.id === id && i.mediaType === mediaType),
    [favorites]
  );

  const inWatchLater = useCallback(
    (id, mediaType) =>
      watchLater.some((i) => i.id === id && i.mediaType === mediaType),
    [watchLater]
  );

  return (
    <LibraryContext.Provider
      value={{
        wishlist,
        favorites,
        watchLater,
        hydrated,
        toggleWishlist,
        toggleFavorite,
        toggleWatchLater,
        inWishlist,
        inFavorites,
        inWatchLater,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used inside LibraryProvider");
  return ctx;
}

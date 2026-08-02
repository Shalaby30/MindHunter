import { NextResponse } from "next/server";
import { markOnAccount, getAccountList } from "@/lib/tmdb";

// POST: push a toggle to the user's TMDB account
export async function POST(request) {
  const sessionId = request.cookies.get("mh_session")?.value;
  if (!sessionId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    const { list, mediaType, mediaId, active } = await request.json();
    if (
      !["favorite", "watchlist"].includes(list) ||
      !["movie", "tv"].includes(mediaType) ||
      !mediaId
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    await markOnAccount(list, mediaType, mediaId, !!active, sessionId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Sync failed" }, { status: 502 });
  }
}

// GET: pull the user's lists from their TMDB account
export async function GET(request) {
  const sessionId = request.cookies.get("mh_session")?.value;
  if (!sessionId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    const [favMovies, favTv, watchMovies, watchTv] = await Promise.all([
      getAccountList("favorite", "movie", sessionId),
      getAccountList("favorite", "tv", sessionId),
      getAccountList("watchlist", "movie", sessionId),
      getAccountList("watchlist", "tv", sessionId),
    ]);
    return NextResponse.json({
      favorites: [...favMovies, ...favTv],
      watchlist: [...watchMovies, ...watchTv],
    });
  } catch {
    return NextResponse.json({ error: "Fetch failed" }, { status: 502 });
  }
}

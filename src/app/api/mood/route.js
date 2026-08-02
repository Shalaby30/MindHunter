import { NextResponse } from "next/server";
import { discoverByMood } from "@/lib/tmdb";

export async function GET(request) {
  const sp = request.nextUrl.searchParams;
  const mood = sp.get("mood");
  const type = sp.get("type") || "movie";
  const page = Number(sp.get("page") || 1);

  if (!mood || (type !== "movie" && type !== "tv")) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  try {
    const data = await discoverByMood(mood, type, page);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Mood search failed" }, { status: 502 });
  }
}

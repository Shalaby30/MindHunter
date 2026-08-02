import { NextResponse } from "next/server";
import { discoverTitles, searchTitles } from "@/lib/tmdb";

export async function GET(request) {
  const sp = request.nextUrl.searchParams;
  const type = sp.get("type");
  const genre = sp.get("genre");
  const sort = sp.get("sort");
  const query = sp.get("q")?.trim();
  const page = Number(sp.get("page") || 1);

  if (type !== "movie" && type !== "tv") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  try {
    const data = query
      ? await searchTitles(type, query, page)
      : await discoverTitles(type, { genre, sort, page });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to load titles" },
      { status: 502 }
    );
  }
}

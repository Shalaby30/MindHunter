import { NextResponse } from "next/server";
import { searchMulti } from "@/lib/tmdb";

export async function GET(request) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  const page = Number(request.nextUrl.searchParams.get("page") || 1);

  if (!query) {
    return NextResponse.json({
      results: [],
      page: 1,
      totalPages: 0,
      totalResults: 0,
    });
  }

  try {
    const data = await searchMulti(query, page);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 502 });
  }
}

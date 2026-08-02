import { NextResponse } from "next/server";
import { getSeasonDetails } from "@/lib/tmdb";

export async function GET(request, { params }) {
  const { id } = await params;
  const season = request.nextUrl.searchParams.get("season");

  if (!season || Number.isNaN(Number(season))) {
    return NextResponse.json(
      { error: "Missing or invalid season parameter" },
      { status: 400 }
    );
  }

  try {
    const data = await getSeasonDetails(id, season);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to load season" },
      { status: 502 }
    );
  }
}

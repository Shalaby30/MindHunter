import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/tmdb";

export async function GET(request) {
  const sessionId = request.cookies.get("mh_session")?.value;
  if (sessionId) await deleteSession(sessionId);

  const res = NextResponse.redirect(request.nextUrl.origin);
  res.cookies.delete("mh_session");
  return res;
}

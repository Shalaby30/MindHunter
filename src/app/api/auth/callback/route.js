import { NextResponse } from "next/server";
import { createSession } from "@/lib/tmdb";

export async function GET(request) {
  const origin = request.nextUrl.origin;
  const denied = request.nextUrl.searchParams.get("denied");
  // TMDB echoes the approved token back in the URL — prefer it over the cookie
  const requestToken =
    request.nextUrl.searchParams.get("request_token") ||
    request.cookies.get("mh_rt")?.value;

  const res = NextResponse.redirect(`${origin}/my-list`);
  res.cookies.delete("mh_rt");

  if (denied === "true" || !requestToken) {
    return NextResponse.redirect(`${origin}/?auth=denied`);
  }

  try {
    const sessionId = await createSession(requestToken);
    res.cookies.set("mh_session", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.redirect(`${origin}/?auth=failed`);
  }
}

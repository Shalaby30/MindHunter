import { NextResponse } from "next/server";
import { createRequestToken } from "@/lib/tmdb";

export async function GET(request) {
  try {
    const token = await createRequestToken();
    const origin = request.nextUrl.origin;

    const res = NextResponse.redirect(
      `https://www.themoviedb.org/authenticate/${token}?redirect_to=${origin}/api/auth/callback`
    );
    // keep the token so the callback can exchange it for a session
    res.cookies.set("mh_rt", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 10,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json(
      { error: "Could not start TMDB login" },
      { status: 502 }
    );
  }
}

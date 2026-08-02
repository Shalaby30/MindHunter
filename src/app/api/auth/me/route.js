import { NextResponse } from "next/server";
import { getAccount } from "@/lib/tmdb";

export async function GET(request) {
  const sessionId = request.cookies.get("mh_session")?.value;
  if (!sessionId) {
    return NextResponse.json({ user: null });
  }

  try {
    const user = await getAccount(sessionId);
    return NextResponse.json({ user });
  } catch {
    // session expired/invalid — clear it
    const res = NextResponse.json({ user: null });
    res.cookies.delete("mh_session");
    return res;
  }
}

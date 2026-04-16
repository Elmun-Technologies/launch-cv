import { NextResponse } from "next/server";
import { COOKIE_NAME, sessionCookieBase } from "@/lib/auth-token";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", {
    ...sessionCookieBase(),
    maxAge: 0,
  });
  return res;
}

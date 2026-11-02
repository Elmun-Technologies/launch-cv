import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { verifyAuthToken } from "@/lib/verify-auth-token";
import { trackEvent } from "@/lib/analytics";
import { COOKIE_NAME, sessionCookieBase, signSessionToken } from "@/lib/auth-token";
import { isAdminUser } from "@/lib/admin-guard";

const schema = z.object({
  token: z.string().min(10),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request data" }, { status: 400 });

  const row = await verifyAuthToken(parsed.data.token, "password_reset");
  if (!row) {
    return NextResponse.json({ error: "Link is invalid or expired" }, { status: 400 });
  }
  const passwordHash = await hashPassword(parsed.data.password);
  const [user] = await prisma.$transaction([
    prisma.user.update({
      where: { id: row.userId },
      data: { passwordHash },
      select: { id: true, email: true, role: true, emailVerifiedAt: true },
    }),
    prisma.authToken.update({
      where: { id: row.id },
      data: { usedAt: new Date() },
    }),
  ]);
  await trackEvent("password_reset_done", { userId: row.userId });

  /** The reset link proved control of the inbox, so sign the user straight in —
   *  except where the login route would refuse (unverified email when
   *  verification is required) and for staff, who go through sign-in + 2FA. */
  const blocked = process.env.REQUIRE_EMAIL_VERIFICATION === "true" && !user.emailVerifiedAt;
  if (blocked || isAdminUser(user)) return NextResponse.json({ ok: true, signedIn: false });
  let token: string;
  try {
    token = await signSessionToken({ sub: user.id, email: user.email });
  } catch {
    return NextResponse.json({ ok: true, signedIn: false });
  }
  const res = NextResponse.json({ ok: true, signedIn: true, userId: user.id });
  res.cookies.set(COOKIE_NAME, token, { ...sessionCookieBase(), maxAge: 60 * 60 * 24 * 14 });
  return res;
}

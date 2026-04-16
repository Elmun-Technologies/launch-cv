import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { COOKIE_NAME, sessionCookieBase, signSessionToken } from "@/lib/auth-token";
import { allowLoginAttempt } from "@/lib/rate-limit-presets";
import { trackEvent } from "@/lib/analytics";

const schema = z.object({
  email: z
    .string()
    .transform((s) => s.trim().toLowerCase())
    .pipe(z.string().email()),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON expected" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
  }
  const email = parsed.data.email;
  if (!allowLoginAttempt(req, email)) {
    return NextResponse.json({ error: "Too many attempts. Please try again in 15 minutes." }, { status: 429 });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  if (process.env.REQUIRE_EMAIL_VERIFICATION === "true" && !user.emailVerifiedAt) {
    return NextResponse.json(
      { error: "Email not verified. Click the link in your inbox or resend it.", code: "email_not_verified" },
      { status: 403 },
    );
  }
  let token: string;
  try {
    token = await signSessionToken({ sub: user.id, email: user.email });
  } catch {
    return NextResponse.json(
      { error: "Server configuration: check AUTH_SECRET (min 16 characters)." },
      { status: 500 },
    );
  }
  await trackEvent("login_success", { userId: user.id });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    ...sessionCookieBase(),
    maxAge: 60 * 60 * 24 * 14,
  });
  return res;
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { COOKIE_NAME, sessionCookieBase, signSessionToken } from "@/lib/auth-token";
import { emptyResumeContent } from "@/types/resume";
import { allowRegisterIp } from "@/lib/rate-limit-presets";
import { trackEvent } from "@/lib/analytics";
import { sendEmailVerification } from "@/lib/send-verification";

const schema = z.object({
  email: z
    .string()
    .transform((s) => s.trim().toLowerCase())
    .pipe(z.string().email()),
  password: z.string().min(8),
  name: z.string().max(120).optional(),
  referralCode: z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().min(4).max(64))
    .optional(),
});

export async function POST(req: Request) {
  if (!allowRegisterIp(req)) {
    return NextResponse.json({ error: "Too many attempts. Please try again shortly." }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON expected" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
  }
  const { email, password, name, referralCode } = parsed.data;

  try {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: "This email is already registered" }, { status: 409 });
    }
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name?.trim() || null,
      },
    });
    const token = await signSessionToken({ sub: user.id, email: user.email });
    const res = NextResponse.json({ ok: true, userId: user.id });
    res.cookies.set(COOKIE_NAME, token, {
      ...sessionCookieBase(),
      maxAge: 60 * 60 * 24 * 14,
    });
    await prisma.resume.create({
      data: {
        userId: user.id,
        title: "My first resume",
        vertical: "software",
        regionMode: "us",
        content: emptyResumeContent() as object,
      },
    });

    if (referralCode) {
      const normalizedCode = referralCode.toLowerCase();
      const matched = await prisma.referral.findFirst({
        where: { code: normalizedCode, status: "pending", referredEmail: null },
        select: { id: true, userId: true },
      });
      if (matched && matched.userId !== user.id) {
        const registeredCount = await prisma.referral.count({
          where: {
            userId: matched.userId,
            referredEmail: { not: null },
            status: { in: ["registered", "credited"] },
          },
        });
        const shouldCredit = (registeredCount + 1) % 5 === 0;
        await prisma.referral.update({
          where: { id: matched.id },
          data: {
            referredEmail: user.email,
            status: shouldCredit ? "credited" : "registered",
            creditAmount: shouldCredit ? 9 : 0,
          },
        });
      }
    }

    await trackEvent("signup", { userId: user.id });
    await sendEmailVerification(user.id, user.email).catch(() => undefined);
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[register] error:", message);
    return NextResponse.json(
      { error: message.includes("AUTH_SECRET") ? "Server configuration error. Please contact support." : message },
      { status: 500 },
    );
  }
}

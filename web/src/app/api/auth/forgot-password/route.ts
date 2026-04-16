import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { allowForgotPasswordIp } from "@/lib/rate-limit-presets";
import { appBaseUrl, sendTransactionalEmail } from "@/lib/email";
import { generateRawToken, hashToken } from "@/lib/token-crypto";
import { trackEvent } from "@/lib/analytics";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  if (!allowForgotPasswordIp(req)) {
    return NextResponse.json({ ok: true });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: true });

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const raw = generateRawToken();
  const tokenHash = hashToken(raw);
  await prisma.authToken.deleteMany({
    where: { userId: user.id, type: "password_reset", usedAt: null },
  });
  await prisma.authToken.create({
    data: {
      userId: user.id,
      type: "password_reset",
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  const link = `${appBaseUrl()}/auth/reset-password?token=${raw}`;
  const html = `<p>Password reset link (valid for 1 hour):</p><p><a href="${link}">${link}</a></p>`;
  const sent = await sendTransactionalEmail({
    to: user.email,
    subject: "Launch CV — password reset",
    html,
  });
  await trackEvent("password_reset_requested", { userId: user.id, meta: { sent: sent.ok } });

  return NextResponse.json({ ok: true });
}

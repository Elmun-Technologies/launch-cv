import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { allowForgotPasswordIp } from "@/lib/rate-limit-presets";
import { sendEmailVerification } from "@/lib/send-verification";

const schema = z.object({
  email: z.string().email(),
});

/** Resend verification email by address (security: always returns 200). */
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

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  if (user && !user.emailVerifiedAt) {
    await sendEmailVerification(user.id, user.email).catch(() => undefined);
  }
  return NextResponse.json({ ok: true });
}

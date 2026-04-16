import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { sendEmailVerification } from "@/lib/send-verification";
import { consumeRateLimit } from "@/lib/rate-limit";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!consumeRateLimit(`resend-verify:${session.sub}`, 5, 3_600_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (user.emailVerifiedAt) {
    return NextResponse.json({ ok: true, already: true });
  }
  await sendEmailVerification(user.id, user.email);
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyAuthToken } from "@/lib/verify-auth-token";
import { trackEvent } from "@/lib/analytics";

const schema = z.object({
  token: z.string().min(10),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Token is missing" }, { status: 400 });

  const row = await verifyAuthToken(parsed.data.token, "email_verify");
  if (!row) {
    return NextResponse.json({ error: "Link is invalid or expired" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: row.userId },
      data: { emailVerifiedAt: new Date() },
    }),
    prisma.authToken.update({
      where: { id: row.id },
      data: { usedAt: new Date() },
    }),
  ]);
  await trackEvent("email_verified", { userId: row.userId });
  return NextResponse.json({ ok: true });
}

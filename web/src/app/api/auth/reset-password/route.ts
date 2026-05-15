import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { verifyAuthToken } from "@/lib/verify-auth-token";
import { trackEvent } from "@/lib/analytics";

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
  await prisma.$transaction([
    prisma.user.update({
      where: { id: row.userId },
      data: { passwordHash },
    }),
    prisma.authToken.update({
      where: { id: row.id },
      data: { usedAt: new Date() },
    }),
  ]);
  await trackEvent("password_reset_done", { userId: row.userId });
  return NextResponse.json({ ok: true });
}

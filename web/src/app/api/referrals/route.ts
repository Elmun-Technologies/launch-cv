import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).optional(),
});

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const parsed = querySchema.safeParse({
    limit: url.searchParams.get("limit") || undefined,
  });
  if (!parsed.success) {
    const msg =
      parsed.error.flatten().formErrors[0] ?? parsed.error.issues[0]?.message ?? "Validation error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const take = parsed.data.limit ?? 100;

  try {
    const referrals = await prisma.referral.findMany({
      where: { userId: session.sub },
      orderBy: { createdAt: "desc" },
      take,
    });
    return NextResponse.json({ referrals });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

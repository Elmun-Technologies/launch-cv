import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { z } from "zod";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const url = new URL(req.url);
  const parsed = querySchema.safeParse({
    page: url.searchParams.get("page") ?? undefined,
    pageSize: url.searchParams.get("pageSize") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { page, pageSize } = parsed.data;
  const skip = (page - 1) * pageSize;

  const [total, records] = await Promise.all([
    prisma.usageMonth.count(),
    prisma.usageMonth.findMany({
      skip,
      take: pageSize,
      orderBy: { month: "desc" },
      select: {
        id: true,
        month: true,
        jdCount: true,
        packetCount: true,
        roleFitCount: true,
        user: { select: { id: true, email: true, name: true } },
      },
    }),
  ]);

  return NextResponse.json({ total, page, pageSize, rows: records });
}

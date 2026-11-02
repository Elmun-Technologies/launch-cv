import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { adminApi } from "@/lib/admin-api";
import { VERTICAL_GROUPS } from "@/lib/admin-labels";

const querySchema = z.object({
  q: z.string().trim().max(200).optional(),
  group: z.enum(["all", ...VERTICAL_GROUPS.map((g) => g.id)] as [string, ...string[]]).default("all"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(req: Request) {
  const { error } = await adminApi("users");
  if (error) return error;

  const url = new URL(req.url);
  const parsed = querySchema.safeParse({
    q: url.searchParams.get("q") || undefined,
    group: url.searchParams.get("group") || undefined,
    page: url.searchParams.get("page") ?? undefined,
    pageSize: url.searchParams.get("pageSize") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { q, group, page, pageSize } = parsed.data;
  const and: Prisma.ResumeWhereInput[] = [];
  if (q) {
    and.push({
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { user: { email: { contains: q, mode: "insensitive" } } },
        { user: { name: { contains: q, mode: "insensitive" } } },
      ],
    });
  }
  const g = VERTICAL_GROUPS.find((x) => x.id === group);
  if (g) and.push({ vertical: { in: [...g.verticals] } });
  const where: Prisma.ResumeWhereInput = and.length ? { AND: and } : {};

  const [total, resumes] = await Promise.all([
    prisma.resume.count({ where }),
    prisma.resume.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        vertical: true,
        regionMode: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { id: true, email: true, name: true } },
        // ATS = the match score of the resume's latest job-match run.
        jdRuns: { orderBy: { createdAt: "desc" }, take: 1, select: { result: true } },
      },
    }),
  ]);

  const rows = resumes.map(({ jdRuns, ...r }) => {
    const s = (jdRuns[0]?.result as { match_score?: unknown } | null)?.match_score;
    return { ...r, ats: typeof s === "number" && Number.isFinite(s) ? Math.round(s) : null };
  });
  return NextResponse.json({ total, page, pageSize, rows });
}

import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { adminApi } from "@/lib/admin-api";
import { APP_STAGES, appStageOf } from "@/lib/admin-labels";

const STAGE_IDS = ["all", "draft", ...APP_STAGES.map((s) => s.key)] as [string, ...string[]];

const querySchema = z.object({
  q: z.string().trim().max(200).optional(),
  /** A tracker stage (folds older spellings), "draft", or "all". */
  stage: z.enum(STAGE_IDS).default("all"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(req: Request) {
  const { error } = await adminApi("users");
  if (error) return error;

  const url = new URL(req.url);
  const parsed = querySchema.safeParse({
    q: url.searchParams.get("q") || undefined,
    stage: url.searchParams.get("stage") || undefined,
    page: url.searchParams.get("page") ?? undefined,
    pageSize: url.searchParams.get("pageSize") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { q, stage, page, pageSize } = parsed.data;
  const and: Prisma.JobApplicationWhereInput[] = [];
  if (stage === "draft") and.push({ status: "draft" });
  else if (stage !== "all") and.push({ status: { in: [...APP_STAGES.find((s) => s.key === stage)!.statuses] } });
  if (q) {
    and.push({
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { company: { contains: q, mode: "insensitive" } },
        { user: { email: { contains: q, mode: "insensitive" } } },
      ],
    });
  }
  const where: Prisma.JobApplicationWhereInput = and.length ? { AND: and } : {};

  const [total, applications, byStatus] = await Promise.all([
    prisma.jobApplication.count({ where }),
    prisma.jobApplication.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        company: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { id: true, email: true, name: true } },
      },
    }),
    prisma.jobApplication.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  // Totals per tracker stage across everyone (not just this page or filter).
  const stageCounts: Record<string, number> = Object.fromEntries(APP_STAGES.map((s) => [s.key, 0]));
  let drafts = 0;
  for (const g of byStatus) {
    stageCounts[appStageOf(g.status)] += g._count._all;
    if (g.status === "draft") drafts += g._count._all;
  }

  return NextResponse.json({ total, page, pageSize, rows: applications, stageCounts, drafts });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { defaultApplicationChecklist } from "@/lib/application-checklist";

const postSchema = z
  .object({
    resumeId: z.string().min(1),
    jdRunId: z.string().min(1).optional(),
    jdText: z.string().min(40).max(24000).optional(),
    title: z.string().max(200).optional(),
    company: z.string().max(200).optional(),
  })
  .refine((d) => d.jdRunId != null || d.jdText != null, {
    message: "jdRunId or jdText is required",
  });

const querySchema = z.object({
  q: z.string().max(200).optional(),
  status: z.string().max(64).optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const parsed = querySchema.safeParse({
    q: url.searchParams.get("q") ?? undefined,
    status: url.searchParams.get("status") ?? undefined,
    page: url.searchParams.get("page") ?? undefined,
    pageSize: url.searchParams.get("pageSize") ?? undefined,
  });
  if (!parsed.success) {
    const msg = parsed.error.flatten().formErrors[0] ?? parsed.error.issues[0]?.message ?? "Validation error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const page = parsed.data.page ?? 1;
  const pageSize = parsed.data.pageSize ?? 6;
  const q = parsed.data.q?.trim() ?? "";
  const status = parsed.data.status?.trim() ?? "";
  const where = {
    userId: session.sub,
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q } },
            { company: { contains: q } },
            { jdText: { contains: q } },
          ],
        }
      : {}),
  };

  const [total, rows] = await Promise.all([
    prisma.jobApplication.count({ where }),
    prisma.jobApplication.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { resume: { select: { id: true, title: true } } },
    }),
  ]);

  return NextResponse.json({
    applications: rows,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON" }, { status: 400 });
  }
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.flatten().formErrors[0] ?? parsed.error.issues[0]?.message ?? "Validation error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const resume = await prisma.resume.findFirst({
    where: { id: parsed.data.resumeId, userId: session.sub },
  });
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  let jdText = parsed.data.jdText ?? "";
  const jdRunId: string | undefined = parsed.data.jdRunId;

  if (jdRunId) {
    const run = await prisma.jdRun.findFirst({
      where: { id: jdRunId, resumeId: resume.id },
    });
    if (!run) return NextResponse.json({ error: "JD analysis not found" }, { status: 404 });
    jdText = run.jdText;
    const taken = await prisma.jobApplication.findUnique({ where: { jdRunId } });
    if (taken) return NextResponse.json({ error: "This JD analysis is already linked to an application" }, { status: 409 });
  } else if (!jdText || jdText.length < 40) {
    return NextResponse.json({ error: "JD text is too short" }, { status: 400 });
  }

  const checklist = defaultApplicationChecklist() as object;

  const app = await prisma.jobApplication.create({
    data: {
      userId: session.sub,
      resumeId: resume.id,
      jdText,
      title: parsed.data.title ?? null,
      company: parsed.data.company ?? null,
      checklist,
      ...(jdRunId ? { jdRunId } : {}),
    },
    include: { resume: { select: { id: true, title: true } } },
  });

  return NextResponse.json({ application: app });
}

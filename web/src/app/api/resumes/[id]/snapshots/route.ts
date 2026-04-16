import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { trackEvent } from "@/lib/analytics";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const resume = await prisma.resume.findFirst({
    where: { id, userId: session.sub },
    include: { snapshots: { orderBy: { createdAt: "desc" } } },
  });
  if (!resume) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    snapshots: resume.snapshots.map((s) => ({
      id: s.id,
      label: s.label,
      createdAt: s.createdAt,
    })),
  });
}

const postSchema = z.object({
  label: z.string().max(120).optional(),
});

export async function POST(req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const resume = await prisma.resume.findFirst({
    where: { id, userId: session.sub },
  });
  if (!resume) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let label: string | undefined;
  try {
    const json = await req.json().catch(() => ({}));
    const p = postSchema.safeParse(json);
    label = p.success ? p.data.label : undefined;
  } catch {
    /* empty body ok */
  }

  const snap = await prisma.resumeSnapshot.create({
    data: {
      resumeId: resume.id,
      label: label ?? `Snapshot ${new Date().toLocaleString("uz-UZ")}`,
      content: resume.content as object,
    },
  });
  await trackEvent("resume_snapshot", { userId: session.sub, meta: { resumeId: resume.id } });
  return NextResponse.json({ id: snap.id });
}

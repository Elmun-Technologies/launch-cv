import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { parseResumeContent } from "@/lib/resume-json";
import { trackEvent } from "@/lib/analytics";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const resume = await prisma.resume.findFirst({
    where: { id, userId: session.sub },
  });
  if (!resume) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    resume: {
      ...resume,
      content: parseResumeContent(resume.content),
    },
  });
}

const patchSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  vertical: z.string().min(1).max(64).optional(),
  regionMode: z.enum(["us", "eu"]).optional(),
  content: z.any().optional(),
});

export async function PATCH(req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const owned = await prisma.resume.findFirst({ where: { id, userId: session.sub } });
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON" }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation error" }, { status: 400 });
  const data = parsed.data;
  const updated = await prisma.resume.update({
    where: { id },
    data: {
      ...(data.title ? { title: data.title } : {}),
      ...(data.vertical ? { vertical: data.vertical } : {}),
      ...(data.regionMode ? { regionMode: data.regionMode } : {}),
      ...(data.content !== undefined ? { content: data.content as object } : {}),
    },
  });
  return NextResponse.json({ ok: true, updatedAt: updated.updatedAt });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const owned = await prisma.resume.findFirst({ where: { id, userId: session.sub } });
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.resume.delete({ where: { id } });
  await trackEvent("resume_deleted", { userId: session.sub, meta: { resumeId: id } });
  return NextResponse.json({ ok: true });
}

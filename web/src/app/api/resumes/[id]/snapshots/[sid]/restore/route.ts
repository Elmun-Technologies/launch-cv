import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { trackEvent } from "@/lib/analytics";

type Ctx = { params: Promise<{ id: string; sid: string }> };

export async function POST(_req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, sid } = await ctx.params;

  const resume = await prisma.resume.findFirst({
    where: { id, userId: session.sub },
  });
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  const snap = await prisma.resumeSnapshot.findFirst({
    where: { id: sid, resumeId: id },
  });
  if (!snap) return NextResponse.json({ error: "Snapshot not found" }, { status: 404 });

  await prisma.resume.update({
    where: { id },
    data: { content: snap.content as object },
  });
  await trackEvent("resume_snapshot_restore", { userId: session.sub, meta: { resumeId: id, snapshotId: sid } });
  return NextResponse.json({ ok: true });
}

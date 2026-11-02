import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { trackEvent } from "@/lib/analytics";

type Ctx = { params: Promise<{ id: string }> };

/** Copy one of the signed-in user's resumes (content, role and region). Snapshots and job links stay with the original. */
export async function POST(_req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const src = await prisma.resume.findFirst({
    where: { id, userId: session.sub },
    select: { title: true, vertical: true, regionMode: true, content: true },
  });
  if (!src) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const suffix = " (copy)";
  const title = `${src.title.slice(0, 200 - suffix.length)}${suffix}`;
  const copy = await prisma.resume.create({
    data: {
      userId: session.sub,
      title,
      vertical: src.vertical,
      regionMode: src.regionMode,
      content: (src.content ?? {}) as object,
    },
    select: { id: true, title: true },
  });
  await trackEvent("resume_created", { userId: session.sub, meta: { resumeId: copy.id, duplicateOf: id } });
  return NextResponse.json({ id: copy.id, title: copy.title });
}

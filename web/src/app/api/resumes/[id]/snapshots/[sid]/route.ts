import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type Ctx = { params: Promise<{ id: string; sid: string }> };

/** One saved version's content, for the read-only preview on the Versions page. */
export async function GET(_req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, sid } = await ctx.params;
  const snap = await prisma.resumeSnapshot.findFirst({
    where: { id: sid, resumeId: id, resume: { userId: session.sub } },
    select: { id: true, label: true, createdAt: true, content: true },
  });
  if (!snap) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ snapshot: snap });
}

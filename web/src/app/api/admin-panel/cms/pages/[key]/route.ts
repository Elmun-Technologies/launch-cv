import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { recordAudit } from "@/lib/cms/audit";
import { bustPageCopyCache } from "@/lib/cms/revalidate";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  const { key } = await params;
  const row = await prisma.pageCopy.findUnique({ where: { key } });
  return NextResponse.json({ pageCopy: row });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  const { key } = await params;

  const body = (await req.json().catch(() => ({}))) as { data?: unknown };
  if (body.data === undefined) {
    return NextResponse.json({ error: "data required" }, { status: 400 });
  }

  const before = await prisma.pageCopy.findUnique({ where: { key } });
  const updated = await prisma.pageCopy.upsert({
    where: { key },
    create: { key, data: body.data as object, updatedById: admin.sub },
    update: { data: body.data as object, updatedById: admin.sub },
  });

  await recordAudit({
    actorId: admin.sub,
    action: "page-copy.update",
    entity: "PageCopy",
    entityId: updated.id,
    diff: { key, before: before?.data ?? null, after: body.data as object },
  });

  bustPageCopyCache(key);
  return NextResponse.json({ pageCopy: updated });
}

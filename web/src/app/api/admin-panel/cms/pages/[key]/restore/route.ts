import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { cleanPageCopy, isPageCopyKey } from "@/lib/cms/page-copy";
import { publishPageCopy } from "@/lib/cms/page-copy-history";

/**
 * Restores a saved version of a page-copy key. Body: { versionId }.
 * The version is validated again (cleanPageCopy), published as the current
 * copy, added to the history as a new version and audit-logged.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const admin = await requireAdmin("content");
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  const { key } = await params;
  if (!isPageCopyKey(key)) return NextResponse.json({ error: "Unknown page copy key" }, { status: 404 });

  const body = (await req.json().catch(() => ({}))) as { versionId?: unknown };
  if (typeof body.versionId !== "string" || !body.versionId) {
    return NextResponse.json({ error: "versionId required" }, { status: 400 });
  }
  const version = await prisma.pageCopyVersion.findUnique({ where: { id: body.versionId } });
  if (!version || version.key !== key) return NextResponse.json({ error: "Version not found" }, { status: 404 });

  const clean = cleanPageCopy(key, version.data);
  if (Object.keys(clean).length === 0) {
    return NextResponse.json({ error: "This version no longer fits the page's fields, so it can't be restored." }, { status: 400 });
  }

  const updated = await publishPageCopy({
    key,
    clean: clean as Record<string, unknown>,
    actor: { sub: admin.sub, email: admin.email },
    action: "page-copy.restore",
    extraDiff: { restoredVersionId: version.id, restoredFrom: version.createdAt.toISOString() },
  });
  return NextResponse.json({ pageCopy: updated });
}

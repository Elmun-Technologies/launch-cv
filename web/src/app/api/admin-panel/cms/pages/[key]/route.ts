import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { PAGE_COPY, cleanPageCopy, isPageCopyKey } from "@/lib/cms/page-copy";
import { publishPageCopy } from "@/lib/cms/page-copy-history";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const admin = await requireAdmin("content");
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  const { key } = await params;
  const row = await prisma.pageCopy.findUnique({ where: { key } });
  return NextResponse.json({ pageCopy: row });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const admin = await requireAdmin("content");
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  const { key } = await params;

  if (!isPageCopyKey(key)) return NextResponse.json({ error: "Unknown page copy key" }, { status: 404 });
  const body = (await req.json().catch(() => ({}))) as { data?: unknown };
  if (body.data === undefined || body.data === null || typeof body.data !== "object" || Array.isArray(body.data)) {
    return NextResponse.json({ error: "data must be a JSON object" }, { status: 400 });
  }
  // Keep only known fields with the right type and length; report anything dropped.
  const clean = cleanPageCopy(key, body.data);
  const def = PAGE_COPY[key].defaults as Record<string, unknown>;
  const rejected = Object.keys(body.data as object).filter((k) => !(k in clean) && k in def);
  const unknown = Object.keys(body.data as object).filter((k) => !(k in def));
  if (rejected.length || unknown.length) {
    return NextResponse.json(
      {
        error: [
          rejected.length ? `Check these fields (empty, too long or wrong type): ${rejected.join(", ")}` : "",
          unknown.length ? `Unknown fields: ${unknown.join(", ")}` : "",
        ]
          .filter(Boolean)
          .join(". "),
      },
      { status: 400 },
    );
  }

  // Upserts the row, adds a version to the history, writes the audit log and refreshes the pages.
  const updated = await publishPageCopy({
    key,
    clean: clean as Record<string, unknown>,
    actor: { sub: admin.sub, email: admin.email },
    action: "page-copy.update",
  });
  return NextResponse.json({ pageCopy: updated });
}

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { storeUpload, UploadError } from "@/lib/cms/storage";
import { recordAudit } from "@/lib/cms/audit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "expected multipart/form-data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "missing file" }, { status: 400 });
  }
  const alt = typeof formData.get("alt") === "string" ? (formData.get("alt") as string) : null;

  try {
    const stored = await storeUpload(file);

    const asset = await prisma.mediaAsset.create({
      data: {
        url: stored.url,
        alt,
        mimeType: stored.mimeType,
        sizeBytes: stored.bytes,
        uploadedById: admin.sub,
      },
    });

    await recordAudit({
      actorId: admin.sub,
      action: "media.upload",
      entity: "MediaAsset",
      entityId: asset.id,
      diff: { created: { url: asset.url, sizeBytes: asset.sizeBytes } },
    });

    return NextResponse.json({ asset });
  } catch (err) {
    if (err instanceof UploadError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[admin/media/upload]", err);
    return NextResponse.json({ error: "upload failed" }, { status: 500 });
  }
}

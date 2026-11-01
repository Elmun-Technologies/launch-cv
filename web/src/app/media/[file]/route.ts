import { prisma } from "@/lib/prisma";
import { MEDIA_MIME_BY_EXT } from "@/lib/cms/storage";

export const runtime = "nodejs";

/** Serves CMS images stored in the database. URLs are immutable (new upload = new id). */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const m = /^([a-z0-9]{10,40})\.(png|jpg|webp|gif|avif)$/.exec(file);
  if (!m) return new Response("Not found", { status: 404 });
  const asset = await prisma.mediaAsset.findUnique({ where: { id: m[1] }, select: { data: true, mimeType: true } });
  if (!asset?.data || asset.mimeType !== MEDIA_MIME_BY_EXT[m[2]]) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(asset.data), {
    headers: {
      "Content-Type": asset.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
}

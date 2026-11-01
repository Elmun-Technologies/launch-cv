/**
 * Image uploads for the CMS. Bytes are stored in the database (MediaAsset.data)
 * and served from /media/<id>.<ext> by app/media/[file]/route.ts, so uploads
 * work on serverless hosting where the filesystem isn't writable or shared.
 */

export type ValidatedImage = {
  bytes: Buffer;
  mimeType: string;
  ext: string;
};

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export class UploadError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

/** Identify the image type from its first bytes — the browser-sent type can't be trusted. */
export function sniffImage(buf: Buffer): { mimeType: string; ext: string } | null {
  const b = (i: number) => buf[i];
  if (buf.length < 12) return null;
  if (b(0) === 0x89 && b(1) === 0x50 && b(2) === 0x4e && b(3) === 0x47) return { mimeType: "image/png", ext: "png" };
  if (b(0) === 0xff && b(1) === 0xd8 && b(2) === 0xff) return { mimeType: "image/jpeg", ext: "jpg" };
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return { mimeType: "image/webp", ext: "webp" };
  if (buf.toString("ascii", 0, 6) === "GIF87a" || buf.toString("ascii", 0, 6) === "GIF89a") return { mimeType: "image/gif", ext: "gif" };
  if (buf.toString("ascii", 4, 8) === "ftyp" && /^avi[fs]$/.test(buf.toString("ascii", 8, 12))) return { mimeType: "image/avif", ext: "avif" };
  return null;
}

export const MEDIA_MIME_BY_EXT: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

/** Validates an uploaded file (size + real image type). */
export async function readUpload(file: File): Promise<ValidatedImage> {
  if (file.size > MAX_BYTES) {
    throw new UploadError(`File too large (max ${MAX_BYTES / 1024 / 1024} MB)`, 413);
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  const kind = sniffImage(bytes);
  if (!kind) throw new UploadError("Upload a PNG, JPEG, WebP, GIF or AVIF image.", 415);
  return { bytes, ...kind };
}

import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

/**
 * Image upload abstraction. v1 = local filesystem under web/public/uploads/cms/.
 * Swap implementation here when moving to S3/R2/UploadThing — public API stays the same.
 */

export type StoredAsset = {
  url: string; // public URL beginning with /uploads/cms/...
  bytes: number;
  mimeType: string;
};

const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export class UploadError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function extFromMime(mime: string): string {
  switch (mime) {
    case "image/png": return "png";
    case "image/jpeg": return "jpg";
    case "image/webp": return "webp";
    case "image/gif": return "gif";
    case "image/avif": return "avif";
    default: return "bin";
  }
}

/** Persists a single uploaded file and returns its public URL + metadata. */
export async function storeUpload(file: File): Promise<StoredAsset> {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new UploadError(`Unsupported file type: ${file.type || "unknown"}`, 415);
  }
  if (file.size > MAX_BYTES) {
    throw new UploadError(`File too large (max ${MAX_BYTES / 1024 / 1024} MB)`, 413);
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const now = new Date();
  const yyyy = String(now.getUTCFullYear());
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const hash = crypto.randomBytes(8).toString("hex");
  const ext = extFromMime(file.type);

  const relDir = path.join("uploads", "cms", yyyy, mm);
  const absDir = path.join(process.cwd(), "public", relDir);
  await fs.mkdir(absDir, { recursive: true });

  const filename = `${hash}.${ext}`;
  const absPath = path.join(absDir, filename);
  await fs.writeFile(absPath, buffer);

  return {
    url: "/" + path.join(relDir, filename).replace(/\\/g, "/"),
    bytes: file.size,
    mimeType: file.type,
  };
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { plainLetterDocxBuffer } from "@/lib/docx/resume-docx";
import { getClientIp } from "@/lib/request-ip";
import { consumeRateLimitShared } from "@/lib/rate-limit";
import { LETTER_DOCX_LIMITS as L } from "@/lib/seo/free-tools-config";

/**
 * No-account Word download for the free letter pages (the resignation letter
 * templates and generator): builds a .docx from the text the visitor already
 * has on screen. No model call, nothing stored. Capped per request (bytes,
 * characters, paragraphs) and per IP per hour, since it's open to anyone.
 */

const HOUR = 3_600_000;

const schema = z.object({
  text: z.string(),
  /** File name without extension, e.g. "two-weeks-notice-letter". */
  filename: z
    .string()
    .regex(/^[a-z0-9-]{1,60}$/)
    .optional(),
});

export async function POST(req: Request) {
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > L.maxBodyBytes) return tooLarge();
  const raw = await req.text().catch(() => "");
  if (new TextEncoder().encode(raw).length > L.maxBodyBytes) return tooLarge();

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Send the letter text to download." }, { status: 400 });
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Send the letter text to download." }, { status: 400 });
  const text = parsed.data.text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim();
  if (!text) return NextResponse.json({ error: "The letter is empty." }, { status: 400 });
  if (text.length > L.maxChars) return tooLarge();
  if (text.split(/\n\s*\n/).length > L.maxBlocks) {
    return NextResponse.json({ error: `That has too many paragraphs to download. Keep it under ${L.maxBlocks}.` }, { status: 413 });
  }

  if (!(await consumeRateLimitShared(`free-docx:${getClientIp(req)}`, L.perIpPerHour, HOUR))) {
    return NextResponse.json({ error: "Too many downloads for now. Please try again in an hour.", code: "limit" }, { status: 429 });
  }

  const name = parsed.data.filename ?? "resignation-letter";
  const buffer = await plainLetterDocxBuffer(text, { title: name.replace(/-/g, " ") });
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${name}.docx"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}

function tooLarge() {
  return NextResponse.json({ error: `That's too long to download. Keep the letter under ${L.maxChars.toLocaleString("en-US")} characters.` }, { status: 413 });
}

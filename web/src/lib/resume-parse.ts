/** Shared resume-file text extraction. Used by the authenticated import
 *  route and the public free ATS-check route so both parse PDF/DOCX the
 *  same way. Returns a discriminated result instead of throwing so callers
 *  can map failures to the right HTTP status. */

export const MAX_RESUME_FILE_SIZE = 4 * 1024 * 1024;

export type ResumeParseOk = { ok: true; text: string };
export type ResumeParseErr = { ok: false; error: string; status: 400 | 422 };
export type ResumeParseResult = ResumeParseOk | ResumeParseErr;

function isSupportedName(name: string): { pdf: boolean; docx: boolean } {
  const lower = name.toLowerCase();
  return {
    pdf: lower.endsWith(".pdf"),
    docx: lower.endsWith(".docx") || lower.endsWith(".doc"),
  };
}

/** Extract raw text from an uploaded resume File (PDF or DOCX). */
export async function extractResumeText(file: File): Promise<ResumeParseResult> {
  if (file.size > MAX_RESUME_FILE_SIZE) {
    return { ok: false, error: "File too large (max 4MB)", status: 400 };
  }

  const { pdf: isPdf, docx: isDocx } = isSupportedName(file.name);
  if (!isPdf && !isDocx) {
    return { ok: false, error: "Only PDF and DOCX files are supported", status: 400 };
  }

  let text: string;
  try {
    const arrayBuf = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);

    if (isDocx) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      try {
        const pdfMod = (await import("pdf-parse")) as Record<string, unknown>;
        const pdfParse = (
          typeof pdfMod.default === "function" ? pdfMod.default : pdfMod
        ) as (buf: Buffer) => Promise<{ text: string }>;
        const result = await pdfParse(buffer);
        text = result.text;
      } catch {
        // Fallback: pull readable ASCII out of the raw PDF bytes.
        const rawText = buffer.toString("utf-8");
        const readable = rawText
          .replace(/[^\x20-\x7E\n\r\t]/g, " ")
          .replace(/\s{3,}/g, "\n")
          .trim();
        if (readable.length > 100) {
          text = readable;
        } else {
          return {
            ok: false,
            error: "Could not parse PDF. Try uploading a DOCX file instead.",
            status: 422,
          };
        }
      }
    }
  } catch {
    return { ok: false, error: "Could not parse file", status: 422 };
  }

  if (text.trim().length < 30) {
    return {
      ok: false,
      error: "File appears to be empty or unreadable. Try a different file.",
      status: 422,
    };
  }

  return { ok: true, text };
}

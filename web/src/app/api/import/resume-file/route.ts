import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { chatJson } from "@/lib/openai-client";
import type { ResumeContent } from "@/types/resume";

const MAX_FILE_SIZE = 4 * 1024 * 1024;

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Form data expected" }, { status: 400 });

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File too large (max 4MB)" }, { status: 400 });
  }

  const name = file.name.toLowerCase();
  const isPdf = name.endsWith(".pdf");
  const isDocx = name.endsWith(".docx") || name.endsWith(".doc");

  if (!isPdf && !isDocx) {
    return NextResponse.json({ error: "Only PDF and DOCX files are supported" }, { status: 400 });
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
      // For PDF: use dynamic require with error handling
      try {
        const pdfMod = (await import("pdf-parse")) as Record<string, unknown>;
        const pdfParse = (
          typeof pdfMod.default === "function" ? pdfMod.default : pdfMod
        ) as (buf: Buffer) => Promise<{ text: string }>;
        const result = await pdfParse(buffer);
        text = result.text;
      } catch {
        // Fallback: convert buffer to string and try to extract readable text
        const rawText = buffer.toString("utf-8");
        // Extract readable ASCII text from PDF binary
        const readable = rawText
          .replace(/[^\x20-\x7E\n\r\t]/g, " ")
          .replace(/\s{3,}/g, "\n")
          .trim();
        if (readable.length > 100) {
          text = readable;
        } else {
          return NextResponse.json({ error: "Could not parse PDF. Try uploading a DOCX file instead." }, { status: 422 });
        }
      }
    }
  } catch {
    return NextResponse.json({ error: "Could not parse file" }, { status: 422 });
  }

  if (text.trim().length < 30) {
    return NextResponse.json({ error: "File appears to be empty or unreadable. Try a different file." }, { status: 422 });
  }

  const system = `You are an expert resume parser. Extract structured data from raw resume text. Return JSON only.
Return a ResumeContent object with these exact keys:
- contact: { fullName, email, phone, location, links[] }
- headline: string (job title / professional title)
- summary: string (professional summary paragraph)
- experience: array of { id (generate unique), company, role, start, end, location, bullets: [{id, text, evidenceIds: []}] }
- education: array of { id (generate unique), school, degree, start, end }
- skills: string[] (list of skills)
- evidence: [] (empty array)

Rules:
- Extract ALL data faithfully from the text. Do not fabricate.
- Generate unique IDs using format "imp-1", "imp-2", etc.
- Parse dates as they appear (e.g., "Jan 2020", "2020-01").
- If a section is missing, use empty string/array.
- Even if text quality is poor, extract what you can.`;

  const userPrompt = `Parse this resume text into structured JSON:\n\n${text.slice(0, 12000)}`;

  try {
    const result = await chatJson<ResumeContent>({ system, user: userPrompt });
    if (!result || typeof result !== "object" || !result.contact) {
      return NextResponse.json({ error: "AI could not parse the resume" }, { status: 502 });
    }
    return NextResponse.json({ content: result });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Parse error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

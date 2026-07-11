import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { chatJson } from "@/lib/openai-client";
import { extractResumeText } from "@/lib/resume-parse";
import type { ResumeContent } from "@/types/resume";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Form data expected" }, { status: 400 });

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const parsed = await extractResumeText(file);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }
  const text = parsed.text;

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
    const result = await chatJson<ResumeContent>({
      system,
      user: userPrompt,
      maxTokens: 4000,
    });
    if (!result || typeof result !== "object" || !result.contact) {
      return NextResponse.json({ error: "AI could not parse the resume" }, { status: 502 });
    }
    return NextResponse.json({ content: result });
  } catch (e) {
    /** Don't echo the raw upstream message — it can leak model names,
     *  prompt fragments, or stack traces back to the browser. */
    console.error("[import/resume-file] AI parse error:", e);
    return NextResponse.json({ error: "Could not parse the resume. Please try a different file." }, { status: 502 });
  }
}

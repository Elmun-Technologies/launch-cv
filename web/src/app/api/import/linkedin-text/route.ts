import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { allowImport } from "@/lib/rate-limit-presets";
import { getUserPlanId } from "@/lib/plans";
import { aiErrorResponse, chatJson } from "@/lib/openai-client";
import type { ResumeContent } from "@/types/resume";
import { DATE_PROMPT, takeDateReadings } from "../date-reading";

const schema = z.object({
  text: z.string().min(50).max(30000),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await allowImport(session.sub))) {
    return NextResponse.json({ error: "Too many imports. Try again in an hour." }, { status: 429 });
  }
  const paid = (await getUserPlanId(session.sub)) !== "none";

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON expected" }, { status: 400 }); }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Text must be at least 50 characters" }, { status: 400 });

  const system = `You are an expert at parsing LinkedIn profile data into structured resume JSON. Return JSON only.
Return a ResumeContent object with these exact keys:
- contact: { fullName, email, phone, location, links[] }
- headline: string (professional headline from LinkedIn)
- summary: string (About section)
- experience: array of { id, company, role, start, end, dateText, location, bullets: [{id, text, evidenceIds: []}] }
- education: array of { id, school, degree, start, end }
- skills: string[] (Skills & Endorsements)
- evidence: [] (empty)

Rules:
- Extract ALL data faithfully. Do not fabricate.
- Generate unique IDs like "li-1", "li-2", etc.
- Convert LinkedIn description paragraphs into bullet points.
- If the LinkedIn profile text mentions specific achievements with numbers, preserve them exactly.
${DATE_PROMPT}`;

  const userPrompt = `Parse this LinkedIn profile text into structured resume JSON:\n\n${parsed.data.text.slice(0, 15000)}`;

  try {
    const result = await chatJson<ResumeContent>({ system, user: userPrompt, tool: "import", userId: session.sub, paid: paid });
    if (!result || typeof result !== "object" || !result.contact) {
      return NextResponse.json({ error: "AI could not parse the LinkedIn data" }, { status: 502 });
    }
    // dateText isn't part of ResumeContent: it only feeds the "check these dates" note on the review screen.
    const dateReadings = takeDateReadings(result.experience);
    return NextResponse.json({ content: result, dateReadings });
  } catch (e) {
    return aiErrorResponse(e);
  }
}

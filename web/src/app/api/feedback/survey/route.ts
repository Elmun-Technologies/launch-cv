import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { trackEvent } from "@/lib/analytics";

const bodySchema = z.object({
  context: z.string().max(64).optional(),
  overallStars: z.number().int().min(1).max(5),
  recommendStars: z.number().int().min(1).max(5),
  nps: z.number().int().min(0).max(10),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }

  const { context, overallStars, recommendStars, nps } = parsed.data;
  await trackEvent("satisfaction_survey", {
    userId: session.sub,
    meta: { context: context ?? "unknown", overallStars, recommendStars, nps },
  });

  return NextResponse.json({ ok: true });
}

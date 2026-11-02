import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { RESUME_EXAMPLES } from "@/lib/resume-examples";
import { EXPERIENCE_LEVELS } from "@/lib/target-role";

const LEVEL_KEYS = EXPERIENCE_LEVELS.map((l) => l.key) as [string, ...string[]];

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("skip") }),
  z.object({
    action: z.literal("save"),
    targetRole: z.string().min(1).max(80),
    experienceLevel: z.enum(LEVEL_KEYS).nullable().optional(),
  }),
]);

/**
 * Onboarding answer for the signed-in user ("What role are you going for?").
 * "skip" only records that the screen was shown, so it is never offered again;
 * "save" stores the role (a resume example slug) and the optional experience level too.
 */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON expected" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation error" }, { status: 400 });

  const data =
    parsed.data.action === "skip"
      ? { onboardedAt: new Date() }
      : (() => {
          const { targetRole, experienceLevel } = parsed.data;
          return { targetRole, experienceLevel: experienceLevel ?? null, onboardedAt: new Date() };
        })();

  if ("targetRole" in data && !RESUME_EXAMPLES.some((e) => e.slug === data.targetRole)) {
    return NextResponse.json({ error: "Pick a role from the list." }, { status: 400 });
  }

  // The session's own user only: there is no user id in the request to tamper with.
  const updated = await prisma.user.updateMany({ where: { id: session.sub }, data });
  if (updated.count === 0) return NextResponse.json({ error: "Account not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

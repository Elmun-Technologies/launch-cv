import { NextResponse } from "next/server";
import type { assertAiUsageAllowed } from "@/lib/usage-limits";

type Blocked = Extract<Awaited<ReturnType<typeof assertAiUsageAllowed>>, { ok: false }>;

export function jsonUsageBlocked(u: Blocked) {
  const status = u.paid ? 429 : 402;
  return NextResponse.json(
    {
      error: u.message,
      code: "USAGE_LIMIT" as const,
      upgrade: !u.paid,
      usage: { kind: u.kind, used: u.used, max: u.max },
    },
    { status },
  );
}

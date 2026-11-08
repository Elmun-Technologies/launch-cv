import { NextResponse } from "next/server";
import type { assertAiUsageAllowed } from "@/lib/usage-limits";
import { EMAIL_UNVERIFIED_CODE } from "@/lib/usage-rules";

type Blocked = Extract<Awaited<ReturnType<typeof assertAiUsageAllowed>>, { ok: false }>;

export function jsonUsageBlocked(u: Blocked) {
  // A free account that hasn't confirmed its email: no upgrade pitch, ask it to confirm.
  if (u.code === EMAIL_UNVERIFIED_CODE) {
    return NextResponse.json(
      {
        error: u.message,
        code: u.code,
        upgrade: false,
        verifyEmail: true,
        usage: { kind: u.kind, used: u.used, max: u.max },
      },
      { status: 403 },
    );
  }
  const status = u.paid ? 429 : 402;
  return NextResponse.json(
    {
      error: u.message,
      code: u.code,
      upgrade: !u.paid,
      usage: { kind: u.kind, used: u.used, max: u.max },
    },
    { status },
  );
}

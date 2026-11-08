import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { offerForBanner } from "@/lib/winback";

export const dynamic = "force-dynamic";

/**
 * The signed-in user's active personal code (welcome or win-back), for the
 * countdown banner on static pages like /pricing. `{ offer: null }` otherwise.
 */
export async function GET() {
  const session = await getSession();
  const offer = session ? await offerForBanner(session.sub) : null;
  return NextResponse.json(
    { offer: offer ? { code: offer.code, percent: offer.percent, endsAt: offer.endsAt.toISOString(), plan: offer.plan ?? "week", kind: offer.kind } : null },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

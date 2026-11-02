import { prisma } from "@/lib/prisma";

/**
 * Short referral link: /r/<code> → /register?ref=<code>. Attribution happens
 * exactly as with the long link — the sign-up form sends `ref` as
 * `referralCode` and /api/auth/register marks that referral as used.
 * Unknown or malformed codes go to plain /register.
 */
export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const code = decodeURIComponent(slug).trim().toLowerCase();
  let target = "/register";
  if (/^[a-z0-9-]{4,64}$/.test(code)) {
    const exists = await prisma.referral.findFirst({ where: { code }, select: { id: true } }).catch(() => null);
    if (exists) target = `/register?ref=${encodeURIComponent(code)}`;
  }
  // Relative Location keeps the visitor on the host they came in on (no proxy/host guessing).
  return new Response(null, { status: 307, headers: { Location: target, "Cache-Control": "no-store" } });
}

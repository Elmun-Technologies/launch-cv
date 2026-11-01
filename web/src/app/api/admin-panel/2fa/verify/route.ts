import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { adminState } from "@/lib/admin-guard";
import { verifyTotp } from "@/lib/totp";
import { open } from "@/lib/secret-box";
import { consumeRateLimitShared } from "@/lib/rate-limit";
import { getSettings } from "@/lib/app-settings";
import { ADMIN_2FA_COOKIE, sessionCookieBase, signPurposeToken } from "@/lib/auth-token";
import { recordAudit } from "@/lib/cms/audit";
import { getClientIp } from "@/lib/request-ip";

const body = z.object({ code: z.string().min(6).max(12) });

/** Check a 6-digit code: completes enrollment, or unlocks the admin panel for this browser. */
export async function POST(req: Request) {
  const s = await adminState();
  if (s.state !== "setup_2fa" && s.state !== "verify_2fa" && s.state !== "ok") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const staff = s.staff;
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter the 6-digit code." }, { status: 400 });

  // 5 wrong codes lock admin access for 15 minutes.
  const lockKey = `admin2fa-fail:${staff.sub}`;
  const user = await prisma.user.findUnique({ where: { id: staff.sub }, select: { totpSecret: true, totpEnabledAt: true, totpLastStep: true } });
  if (!user?.totpSecret) return NextResponse.json({ error: "Start setup first." }, { status: 400 });
  const step = verifyTotp(open(user.totpSecret), parsed.data.code, user.totpLastStep);
  if (step === null) {
    const allowed = await consumeRateLimitShared(lockKey, 5, 15 * 60_000);
    await recordAudit({ actorId: staff.sub, action: "admin.2fa.failed", entity: "User", entityId: staff.sub, ip: getClientIp(req) });
    return NextResponse.json(
      { error: allowed ? "That code didn't match. Check the time on your phone and try again." : "Too many wrong codes. Admin access is locked for 15 minutes." },
      { status: allowed ? 400 : 429 },
    );
  }
  const enrolling = !user.totpEnabledAt;
  await prisma.user.update({
    where: { id: staff.sub },
    data: { totpLastStep: step, ...(enrolling ? { totpEnabledAt: new Date() } : {}) },
  });
  if (enrolling) await recordAudit({ actorId: staff.sub, action: "admin.2fa.enable", entity: "User", entityId: staff.sub, ip: getClientIp(req) });

  const ttl = (await getSettings()).security.adminIdleMinutes * 60;
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_2FA_COOKIE, await signPurposeToken(staff.sub, `admin2fa:${staff.sub}`, ttl), { ...sessionCookieBase(), sameSite: "strict", maxAge: ttl });
  return res;
}

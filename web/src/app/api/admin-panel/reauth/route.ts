import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { adminApi } from "@/lib/admin-api";
import { verifyTotp } from "@/lib/totp";
import { open } from "@/lib/secret-box";
import { consumeRateLimitShared } from "@/lib/rate-limit";
import { ADMIN_REAUTH_COOKIE, REAUTH_TTL_SECONDS, sessionCookieBase, signPurposeToken } from "@/lib/auth-token";
import { recordAudit } from "@/lib/cms/audit";
import { getClientIp } from "@/lib/request-ip";
import { admin2faLocked, consumeRecoveryCode, isRecoveryCodeShape } from "@/lib/recovery-codes";

const body = z.object({ password: z.string().max(200).optional(), code: z.string().max(32).optional() });

/** Password + authenticator code (or a one-time recovery code) → a 5-minute window for sensitive changes. */
export async function POST(req: Request) {
  const g = await adminApi("view");
  if (g.error) return g.error;
  const staff = g.staff;
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: staff.sub }, select: { passwordHash: true, totpSecret: true, totpEnabledAt: true, totpLastStep: true } });
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!user.passwordHash && !user.totpEnabledAt) {
    return NextResponse.json({ error: "Set up two-factor sign-in first — it's how you confirm sensitive changes." }, { status: 400 });
  }
  if (await admin2faLocked(staff.sub)) {
    return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }
  const ip = getClientIp(req);

  const fail = async () => {
    const allowed = await consumeRateLimitShared(`admin2fa-fail:${staff.sub}`, 5, 15 * 60_000);
    await recordAudit({ actorId: staff.sub, action: "admin.reauth.failed", entity: "User", entityId: staff.sub, ip });
    return NextResponse.json(
      { error: allowed ? "Password or code didn't match." : "Too many attempts. Try again in 15 minutes." },
      { status: allowed ? 400 : 429 },
    );
  };

  if (user.passwordHash) {
    if (!parsed.data.password || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) return fail();
  }
  if (user.totpEnabledAt && user.totpSecret) {
    const code = parsed.data.code ?? "";
    if (isRecoveryCodeShape(code)) {
      const left = await consumeRecoveryCode(staff.sub, code);
      if (left === null) return fail();
      await recordAudit({ actorId: staff.sub, action: "admin.2fa.recovery.used", entity: "User", entityId: staff.sub, diff: { where: "re-confirm", remaining: left }, ip });
    } else {
      const step = verifyTotp(open(user.totpSecret), code, user.totpLastStep);
      if (step === null) return fail();
      await prisma.user.update({ where: { id: staff.sub }, data: { totpLastStep: step } });
    }
  }

  await recordAudit({ actorId: staff.sub, action: "admin.reauth", entity: "User", entityId: staff.sub, ip });
  const res = NextResponse.json({ ok: true, ttl: REAUTH_TTL_SECONDS });
  res.cookies.set(ADMIN_REAUTH_COOKIE, await signPurposeToken(staff.sub, `reauth:${staff.sub}`, REAUTH_TTL_SECONDS), {
    ...sessionCookieBase(),
    sameSite: "strict",
    maxAge: REAUTH_TTL_SECONDS,
  });
  return res;
}

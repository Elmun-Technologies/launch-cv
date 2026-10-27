import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { verifyPassword, hashPassword } from "@/lib/password";
import { COOKIE_NAME, sessionCookieBase } from "@/lib/auth-token";
import { trackEvent } from "@/lib/analytics";

const patchSchema = z.object({
  name: z.string().max(120).optional(),
  newPassword: z.string().min(8).optional(),
  currentPassword: z.string().min(1).optional(),
});

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON expected" }, { status: 400 }); }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.flatten().formErrors[0] ?? parsed.error.issues[0]?.message ?? "Validation error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) data.name = parsed.data.name.trim() || null;
  if (parsed.data.newPassword) {
    // Changing an existing password requires the current one; Google-only accounts can set a first password.
    const user = await prisma.user.findUnique({ where: { id: session.sub }, select: { passwordHash: true } });
    if (user?.passwordHash) {
      const ok = parsed.data.currentPassword ? await verifyPassword(parsed.data.currentPassword, user.passwordHash) : false;
      if (!ok) return NextResponse.json({ error: "Your current password is incorrect." }, { status: 403 });
    }
    data.passwordHash = await hashPassword(parsed.data.newPassword);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  await prisma.user.update({ where: { id: session.sub }, data });
  return NextResponse.json({ ok: true });
}

const deleteSchema = z.object({
  password: z.string().min(1).optional(),
  /** Google-only accounts have no password; they confirm by typing their email. */
  confirmEmail: z.string().min(1).optional(),
});

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON" }, { status: 400 });
  }
  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation error" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (user.passwordHash) {
    const ok = parsed.data.password ? await verifyPassword(parsed.data.password, user.passwordHash) : false;
    if (!ok) return NextResponse.json({ error: "Incorrect password" }, { status: 403 });
  } else if (parsed.data.confirmEmail?.trim().toLowerCase() !== user.email.toLowerCase()) {
    // Accounts created with Google have no password; typing the email confirms intent.
    return NextResponse.json({ error: "Type your account email to confirm." }, { status: 403 });
  }

  await trackEvent("account_delete", { userId: user.id });
  await prisma.user.delete({ where: { id: user.id } });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", {
    ...sessionCookieBase(),
    maxAge: 0,
  });
  return res;
}

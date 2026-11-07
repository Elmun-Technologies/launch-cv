import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { adminState } from "@/lib/admin-guard";
import { generateTotpSecret, otpauthUri } from "@/lib/totp";
import { seal, secretBoxReady } from "@/lib/secret-box";
import { clearRecoveryCodes } from "@/lib/recovery-codes";

/** Start 2FA enrollment: a new secret, stored sealed but not active until a code is verified. */
export async function POST() {
  const s = await adminState();
  if (s.state !== "setup_2fa") {
    return NextResponse.json({ error: "Two-factor sign-in is already set up for this account." }, { status: 400 });
  }
  if (!secretBoxReady()) {
    return NextResponse.json({ error: "KEY_ENCRYPTION_KEY isn't set in hosting yet, so 2FA can't be stored safely." }, { status: 500 });
  }
  const secret = generateTotpSecret();
  await prisma.user.update({ where: { id: s.staff.sub }, data: { totpSecret: seal(secret), totpEnabledAt: null, totpLastStep: null } });
  // New codes come with the new authenticator, once it is confirmed.
  await clearRecoveryCodes(s.staff.sub);
  const uri = otpauthUri(secret, s.staff.email);
  const svg = await QRCode.toString(uri, { type: "svg", margin: 1, width: 200, color: { dark: "#111118", light: "#ffffff" } });
  return NextResponse.json({ secret: secret.replace(/(.{4})/g, "$1 ").trim(), uri, svg }, { headers: { "Cache-Control": "no-store" } });
}

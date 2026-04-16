import { prisma } from "@/lib/prisma";
import { appBaseUrl, sendTransactionalEmail } from "@/lib/email";
import { generateRawToken, hashToken } from "@/lib/token-crypto";
import { trackEvent } from "@/lib/analytics";

export async function sendEmailVerification(userId: string, email: string) {
  const raw = generateRawToken();
  const tokenHash = hashToken(raw);
  await prisma.authToken.deleteMany({
    where: { userId, type: "email_verify", usedAt: null },
  });
  await prisma.authToken.create({
    data: {
      userId,
      type: "email_verify",
      tokenHash,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
    },
  });
  const link = `${appBaseUrl()}/auth/verify-email?token=${raw}`;
  const html = `<p>Verify your Launch CV account.</p><p><a href="${link}">${link}</a></p><p>This link is valid for 48 hours.</p>`;
  const sent = await sendTransactionalEmail({
    to: email,
    subject: "Launch CV — verify your email",
    html,
  });
  if (!sent.ok) {
    await trackEvent("email_verify_skipped", { userId, meta: { reason: sent.error } });
  } else {
    await trackEvent("email_verify_sent", { userId });
  }
}

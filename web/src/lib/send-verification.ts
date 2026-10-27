import { prisma } from "@/lib/prisma";
import { appBaseUrl, sendTransactionalEmail } from "@/lib/email";
import { transactionalEmail } from "@/lib/email-layout";
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
  const link = `${appBaseUrl()}/auth/verify-email?token=${encodeURIComponent(raw)}`;
  const { html, text } = transactionalEmail({
    preheader: "One click to confirm your email address.",
    heading: "Confirm your email",
    paragraphs: [
      "Thanks for signing up for LaunchCV. Confirm this address so you can recover your account and get receipts.",
      "Next, import the resume you already have — every section is filled in for you to edit.",
    ],
    cta: { label: "Confirm my email", url: link },
    footnote: "This link works for 48 hours. If you didn't create a LaunchCV account, ignore this email.",
  });
  const sent = await sendTransactionalEmail({
    to: email,
    subject: "Confirm your LaunchCV email",
    html,
    text,
  });
  if (!sent.ok) {
    await trackEvent("email_verify_skipped", { userId, meta: { reason: sent.error } });
  } else {
    await trackEvent("email_verify_sent", { userId });
  }
}

import { prisma } from "@/lib/prisma";
import { appBaseUrl, sendTransactionalEmail } from "@/lib/email";
import { transactionalEmail } from "@/lib/email-layout";
import { generateRawToken, hashToken } from "@/lib/token-crypto";
import { trackEvent } from "@/lib/analytics";
import { getSettings } from "@/lib/app-settings";

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
  const m = (await getSettings()).marketing;
  // Mention the welcome code only when one will actually be sent after confirming.
  const offer = m.welcomeEnabled && !!m.postalAddress.trim() ? m.welcomePercent : null;
  const { html, text } = transactionalEmail({
    preheader: offer
      ? `Confirm your email to unlock ${offer}% off any LaunchCV plan.`
      : "One click to confirm your email and finish setting up LaunchCV.",
    hero: "verify",
    eyebrow: "One last step",
    heading: offer ? `Confirm your email and unlock ${offer}% off` : "Confirm your email",
    paragraphs: [
      "Thanks for joining LaunchCV. Confirm this address so you can sign back in, reset your password and get receipts.",
      ...(offer
        ? [`As a welcome, we'll send you a personal code for ${offer}% off any plan the moment you confirm. It's valid for ${m.welcomeValidHours} hours.`]
        : []),
    ],
    bullets: [
      "Import the resume you already have. Every section is filled in for you",
      "Run a free ATS check and see what recruiters' software sees",
      "Match your resume to a real job post",
    ],
    cta: { label: "Confirm my email", url: link },
    footnote: "This link works for 48 hours. If you didn't create a LaunchCV account, ignore this email.",
    siteUrl: appBaseUrl(),
  });
  const sent = await sendTransactionalEmail({
    to: email,
    subject: offer ? `Confirm your email to unlock ${offer}% off` : "Confirm your LaunchCV email",
    html,
    text,
  });
  if (!sent.ok) {
    await trackEvent("email_verify_skipped", { userId, meta: { reason: sent.error } });
  } else {
    await trackEvent("email_verify_sent", { userId });
  }
}

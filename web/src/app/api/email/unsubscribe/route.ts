import { prisma } from "@/lib/prisma";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe-token";

/**
 * Unsubscribe from marketing email (the one-time win-back discount email).
 * GET: the link in the email footer; shows a small confirmation page.
 * POST: RFC 8058 one-click (List-Unsubscribe-Post) from the mail client.
 * The link is `?u=<userId>&t=<HMAC of userId keyed with AUTH_SECRET>`.
 */

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function page(status: number, heading: string, body: string, form = "") {
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${esc(heading)} · LaunchCV</title></head>
<body style="margin:0;min-height:100vh;background:#f1eff8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#121226;">
<main style="max-width:480px;margin:0 auto;padding:64px 16px;">
<a href="/" style="display:inline-block;margin-bottom:20px;font-size:20px;font-weight:800;color:#121226;text-decoration:none;">launch<span style="color:#5440e8;">cv</span></a>
<div style="background:#fff;border-radius:28px;padding:28px;box-shadow:0 24px 48px -28px rgba(36,24,120,.35);">
<h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;font-weight:800;letter-spacing:-0.02em;">${esc(heading)}</h1>
<p style="margin:0;font-size:16px;line-height:1.6;color:#4a4862;">${esc(body)}</p>
${form}
<p style="margin:20px 0 0;font-size:15px;"><a href="/" style="color:#5440e8;font-weight:600;">Back to LaunchCV</a></p>
</div>
</main>
</body></html>`;
  return new Response(html, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

/** Sets marketingOptOutAt (keeps the first date). False when the link is invalid. */
async function optOut(userId: string | null, token: string | null): Promise<boolean> {
  if (!verifyUnsubscribeToken(userId, token)) return false;
  await prisma.user.updateMany({ where: { id: userId!, marketingOptOutAt: null }, data: { marketingOptOutAt: new Date() } });
  return true;
}

/**
 * GET only shows a confirm button: mail security scanners open every link in an email,
 * so unsubscribing on GET would opt people out without them knowing. The button POSTs.
 */
export async function GET(req: Request) {
  const qs = new URL(req.url).searchParams;
  const u = qs.get("u");
  const t = qs.get("t");
  if (!verifyUnsubscribeToken(u, t)) {
    return page(400, "This link doesn't work", "The unsubscribe link is incomplete or changed. Copy the whole link from the email, or write to support@launch-cv.com and we'll take you off the list.");
  }
  const form = `<form method="post" action="/api/email/unsubscribe" style="margin:20px 0 0;">
<input type="hidden" name="u" value="${esc(u!)}"><input type="hidden" name="t" value="${esc(t!)}"><input type="hidden" name="confirm" value="1">
<button type="submit" style="min-height:44px;padding:0 22px;border:0;border-radius:999px;background:#5440e8;color:#fff;font-size:15px;font-weight:600;cursor:pointer;">Unsubscribe</button>
</form>`;
  return page(200, "Unsubscribe from LaunchCV offers?", "You'll stop getting discount and other marketing emails. Account emails, like password resets, still arrive.", form);
}

export async function POST(req: Request) {
  const qs = new URL(req.url).searchParams;
  let u = qs.get("u");
  let t = qs.get("t");
  const form = await req.formData().catch(() => null);
  // The confirm button on our own page gets an HTML answer; mail clients' one-click POST gets text.
  const fromPage = form?.get("confirm") === "1";
  if (!u || !t) {
    const fu = form?.get("u");
    const ft = form?.get("t");
    u = u || (typeof fu === "string" ? fu : null);
    t = t || (typeof ft === "string" ? ft : null);
  }
  try {
    if (!(await optOut(u, t))) {
      return fromPage
        ? page(400, "This link doesn't work", "The unsubscribe link is incomplete or changed. Write to support@launch-cv.com and we'll take you off the list.")
        : new Response("Invalid unsubscribe link", { status: 400 });
    }
  } catch {
    return fromPage ? page(500, "Something went wrong", "We couldn't save that just now. Please try again in a minute.") : new Response("Try again later", { status: 500 });
  }
  return fromPage
    ? page(200, "You're unsubscribed", "We won't send you discount or other marketing emails. You'll still get emails about your account, like password resets.")
    : new Response("Unsubscribed", { status: 200, headers: { "Cache-Control": "no-store" } });
}

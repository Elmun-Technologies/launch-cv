import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getIntegrationValue } from "@/lib/integrations";
import { applyPolarPaidOrder, applyPolarRefund, applyPolarSubscription } from "@/lib/polar-apply";

export const runtime = "nodejs";

/**
 * HMAC keys to try. Endpoints with "standard webhook signature" on sign with the
 * base64-decoded part after `whsec_` (Standard Webhooks); older Polar endpoints and
 * Polar's SDK use the raw secret string. Both come from the secret, so accepting
 * either doesn't weaken the check.
 */
function signingKeys(secret: string): Buffer[] {
  const s = secret.trim();
  const keys = [Buffer.from(s, "utf8")];
  const b64 = s.startsWith("whsec_") ? s.slice(6) : s;
  if (/^[A-Za-z0-9+/]+={0,2}$/.test(b64)) {
    const decoded = Buffer.from(b64, "base64");
    if (decoded.length >= 16) keys.push(decoded);
  }
  return keys;
}

/**
 * Verify a Polar webhook using the Standard Webhooks spec.
 * Signed content = `${webhook-id}.${webhook-timestamp}.${rawBody}`.
 * Polar's SDK uses the raw secret string as the HMAC-SHA256 key, base64-encoding
 * the digest; the `webhook-signature` header holds space-separated `v1,<sig>` tokens.
 */
function verifySignature(rawBody: string, secret: string, headers: Headers): boolean {
  const id = headers.get("webhook-id");
  const timestamp = headers.get("webhook-timestamp");
  const signatureHeader = headers.get("webhook-signature");
  if (!id || !timestamp || !signatureHeader) return false;

  const signedContent = `${id}.${timestamp}.${rawBody}`;
  const expected = signingKeys(secret).map((key) =>
    Buffer.from(crypto.createHmac("sha256", key).update(signedContent).digest("base64"), "utf8"),
  );

  for (const token of signatureHeader.split(" ")) {
    const sig = token.includes(",") ? token.slice(token.indexOf(",") + 1) : token;
    const sigBuf = Buffer.from(sig, "utf8");
    if (expected.some((e) => e.length === sigBuf.length && crypto.timingSafeEqual(sigBuf, e))) return true;
  }
  return false;
}

type WebhookPayload = {
  type?: string;
  data?: Record<string, unknown>;
};

export async function POST(req: Request) {
  const secret = await getIntegrationValue("polar", "webhookSecret");
  if (!secret) {
    return NextResponse.json({ error: "Polar webhook secret not configured" }, { status: 501 });
  }

  const rawBody = await req.text();
  if (!verifySignature(rawBody, secret, req.headers)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  let body: WebhookPayload;
  try {
    body = JSON.parse(rawBody) as WebhookPayload;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const eventType = body.type;
  const data = body.data;
  if (!eventType || !data || typeof data !== "object") {
    return NextResponse.json({ received: true });
  }

  try {
    switch (eventType) {
      case "subscription.created":
      case "subscription.updated":
      case "subscription.active":
      case "subscription.canceled":
      case "subscription.uncanceled":
      case "subscription.revoked":
        await applyPolarSubscription(data, eventType);
        break;
      case "order.paid":
        await applyPolarPaidOrder(data);
        break;
      case "order.refunded":
        await applyPolarRefund(data);
        break;
      default:
        break;
    }
  } catch (e) {
    console.error("polar webhook handler", e);
    return NextResponse.json({ error: "handler" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

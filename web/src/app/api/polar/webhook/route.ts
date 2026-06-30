import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { trackEvent } from "@/lib/analytics";
import { isOneTimePlan, planIdFromPolarProductId } from "@/lib/polar";
import {
  resolvePolarUserId,
  upsertOrderFromPolar,
  upsertSubscriptionFromPolar,
  type PolarOrder,
  type PolarSubscription,
} from "@/lib/polar-sync";

export const runtime = "nodejs";

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
  const expected = crypto.createHmac("sha256", secret).update(signedContent).digest("base64");
  const expectedBuf = Buffer.from(expected, "utf8");

  for (const token of signatureHeader.split(" ")) {
    const sig = token.includes(",") ? token.slice(token.indexOf(",") + 1) : token;
    const sigBuf = Buffer.from(sig, "utf8");
    if (sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return true;
    }
  }
  return false;
}

type WebhookPayload = {
  type?: string;
  data?: Record<string, unknown>;
};

function metadataOf(data: Record<string, unknown>): Record<string, unknown> | null {
  const m = data.metadata;
  return m && typeof m === "object" ? (m as Record<string, unknown>) : null;
}

export async function POST(req: Request) {
  const secret = process.env.POLAR_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "POLAR_WEBHOOK_SECRET not configured" }, { status: 501 });
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
      // Recurring subscriptions.
      case "subscription.created":
      case "subscription.updated":
      case "subscription.active":
      case "subscription.canceled":
      case "subscription.uncanceled":
      case "subscription.revoked": {
        const sub = data as unknown as PolarSubscription;
        const userId = await resolvePolarUserId(metadataOf(data), sub.id ?? null);
        if (!userId) break;
        await upsertSubscriptionFromPolar(sub, userId);
        if (eventType === "subscription.active" || eventType === "subscription.created") {
          await trackEvent("pay_success", {
            userId,
            meta: { provider: "polar", subscriptionId: sub.id },
          });
        }
        break;
      }

      // One-time purchases (e.g. Lifetime). Only act on one-time products so recurring
      // renewals — also delivered as orders — don't overwrite the subscription row that
      // the subscription.* events manage.
      case "order.paid": {
        const order = data as unknown as PolarOrder;
        const plan = planIdFromPolarProductId(order.product_id ?? null);
        if (!plan || !isOneTimePlan(plan)) break;
        const userId = await resolvePolarUserId(metadataOf(data), null);
        if (!userId) break;
        await upsertOrderFromPolar(order, userId);
        await trackEvent("pay_success", {
          userId,
          meta: { provider: "polar", orderId: order.id, plan },
        });
        break;
      }

      default:
        break;
    }
  } catch (e) {
    console.error("polar webhook handler", e);
    return NextResponse.json({ error: "handler" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { trackEvent } from "@/lib/analytics";
import {
  findUserIdByLemonSubscriptionId,
  upsertSubscriptionFromLemon,
  type LemonSubscriptionAttrs,
} from "@/lib/lemon-squeezy-sync";

export const runtime = "nodejs";

function verifySignature(rawBody: string, secret: string, signatureHeader: string | null): boolean {
  if (!signatureHeader) return false;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
  const signature = Buffer.from(signatureHeader, "utf8");
  if (digest.length !== signature.length) return false;
  return crypto.timingSafeEqual(digest, signature);
}

type WebhookPayload = {
  meta?: {
    event_name?: string;
    custom_data?: { user_id?: string | number };
  };
  data?: {
    id?: string;
    type?: string;
    attributes?: Record<string, unknown>;
  };
};

function isSubscriptionAttrs(a: Record<string, unknown>): a is LemonSubscriptionAttrs {
  return typeof a.customer_id === "number" && typeof a.variant_id === "number" && typeof a.status === "string";
}

export async function POST(req: Request) {
  const secret = process.env.LEMON_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "LEMON_WEBHOOK_SECRET not configured" }, { status: 501 });
  }

  const rawBody = await req.text();
  const sig = req.headers.get("X-Signature") ?? req.headers.get("x-signature");
  if (!verifySignature(rawBody, secret, sig)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  let body: WebhookPayload;
  try {
    body = JSON.parse(rawBody) as WebhookPayload;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const eventName = body.meta?.event_name;
  const data = body.data;
  if (!data?.id || data.type !== "subscriptions" || !data.attributes || !isSubscriptionAttrs(data.attributes)) {
    return NextResponse.json({ received: true });
  }

  const subscriptionId = String(data.id);
  const attrs = data.attributes;

  const fromMeta = body.meta?.custom_data?.user_id;
  const metaUserId =
    typeof fromMeta === "string" ? fromMeta : fromMeta != null ? String(fromMeta) : null;
  const userId = metaUserId ?? (await findUserIdByLemonSubscriptionId(subscriptionId));

  try {
    switch (eventName) {
      case "subscription_created":
      case "subscription_updated":
      case "subscription_cancelled":
      case "subscription_resumed":
      case "subscription_unpaused":
      case "subscription_expired":
      case "subscription_paused": {
        if (!userId) break;
        await upsertSubscriptionFromLemon(subscriptionId, attrs, userId);
        if (eventName === "subscription_created") {
          await trackEvent("pay_success", {
            userId,
            meta: { provider: "lemonsqueezy", subscriptionId },
          });
        }
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error("lemon webhook handler", e);
    return NextResponse.json({ error: "handler" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/analytics";
import { trackPurchaseCompleted } from "@/lib/analytics-server";
import { isOneTimePlan, planIdFromPolarProductId } from "@/lib/polar";
import { getIntegrationValue } from "@/lib/integrations";
import { attributionFromRecord } from "@/lib/utm";
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

function gaClientIdOf(meta: Record<string, unknown> | null): string | null {
  const v = meta?.ga_client_id;
  return typeof v === "string" && v ? v : null;
}

/** Polar amounts are in minor units (cents); GA4 `value` wants major units. */
function toMajorUnits(minor: number | null | undefined): number | null {
  return typeof minor === "number" && Number.isFinite(minor) ? minor / 100 : null;
}

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
        // Capture prior state BEFORE the upsert so we can detect the transition
        // into `active` and stay idempotent across Polar's webhook re-deliveries.
        // A one-time order row (a pass, often expired, or Lifetime) is a different
        // purchase, so its "active" status must not hide this subscription's first activation.
        const prior = await prisma.subscription.findUnique({ where: { userId }, select: { status: true, stripeSubscriptionId: true } });
        const priorStatus = prior && !prior.stripeSubscriptionId.startsWith("order:") ? prior.status : undefined;
        await upsertSubscriptionFromPolar(sub, userId);
        // Count the purchase exactly once — on the FIRST transition into `active`.
        // Gating on `priorStatus !== "active"` de-dupes redelivered active events
        // and avoids the `created` + `active` double count for one purchase, for
        // both the internal DB event and the external GA4/PostHog conversion.
        if (eventType === "subscription.active" && priorStatus !== "active") {
          await trackEvent("pay_success", {
            userId,
            meta: { provider: "polar", subscriptionId: sub.id },
          });
          await trackPurchaseCompleted({
            userId,
            plan: await planIdFromPolarProductId(sub.product_id ?? null),
            provider: "polar",
            subscriptionId: sub.id ?? null,
            gaClientId: gaClientIdOf(metadataOf(data)),
            value: toMajorUnits(sub.amount),
            currency: sub.currency ?? null,
            attribution: attributionFromRecord(metadataOf(data)),
          });
        }
        break;
      }

      // One-time purchases (Week Pass, 90-Day Pass, legacy Lifetime). Only act on one-time
      // products so recurring renewals — also delivered as orders — don't overwrite the
      // subscription row that the subscription.* events manage.
      case "order.paid": {
        const order = data as unknown as PolarOrder;
        const plan = await planIdFromPolarProductId(order.product_id ?? null);
        if (!plan || !isOneTimePlan(plan)) break;
        const userId = await resolvePolarUserId(metadataOf(data), null);
        if (!userId) break;
        // Idempotency: Polar may redeliver `order.paid`. A pass extends access, so an
        // order must be applied once only — even after a later pass replaced its row,
        // which is why the recorded purchase event is checked as well as the row.
        const alreadyRecorded =
          !!(await prisma.subscription.findFirst({
            where: { stripeSubscriptionId: `order:${order.id}` },
            select: { id: true },
          })) ||
          !!(await prisma.analyticsEvent.findFirst({
            where: { name: "pay_success", userId, meta: { path: ["orderId"], equals: order.id } },
            select: { id: true },
          }));
        if (alreadyRecorded) break;
        const applied = await upsertOrderFromPolar(order, userId, plan);
        if (!applied) {
          console.warn(`[polar/webhook] order ${order.id} (${plan}) not applied: user ${userId} already has better access`);
        }
        // Count the one-time purchase exactly once: it was paid even if it didn't change access.
        await trackEvent("pay_success", {
          userId,
          meta: { provider: "polar", orderId: order.id, plan, ...(applied ? {} : { applied: false }) },
        });
        await trackPurchaseCompleted({
          userId,
          plan,
          provider: "polar",
          orderId: order.id ?? null,
          gaClientId: gaClientIdOf(metadataOf(data)),
          value: toMajorUnits(order.total_amount ?? order.amount),
          currency: order.currency ?? null,
          attribution: attributionFromRecord(metadataOf(data)),
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

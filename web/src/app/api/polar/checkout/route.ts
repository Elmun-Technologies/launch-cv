import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/analytics";
import { appBaseUrl } from "@/lib/email";
import { polarApiBase, productIdForCheckoutPlan } from "@/lib/polar";
import { getIntegrationValue } from "@/lib/integrations";
import { getSettings } from "@/lib/app-settings";
import { isPublicPlan, type CheckoutPlan } from "@/lib/plan-config";
import { checkoutConflict } from "@/lib/entitlement-rules";
import { attributionFromCookieHeader, attributionToMetadata } from "@/lib/utm";

/**
 * Plan requested at checkout. Only plans sold today (CHECKOUT_PLAN_ORDER) are
 * accepted; legacy plans (Starter, Elite, Lifetime) and unknown ids are rejected
 * with null. A body without a plan keeps the old default, Pro.
 */
function parsePlan(body: unknown): CheckoutPlan | null {
  if (!body || typeof body !== "object" || !("plan" in body)) return "professional";
  const p = (body as { plan?: unknown }).plan;
  if (p === undefined || p === null || p === "") return "professional";
  return typeof p === "string" && isPublicPlan(p) ? p : null;
}

/** GA4 client id (`<digits>.<digits>`) forwarded by the browser at checkout. */
function parseGaClientId(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;
  const v = (body as { gaClientId?: unknown }).gaClientId;
  return typeof v === "string" && /^\d+\.\d+$/.test(v) ? v : undefined;
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rawBody = await req.json().catch(() => ({}));
  const plan = parsePlan(rawBody);
  if (!plan) {
    return NextResponse.json({ error: "That plan is no longer offered. Pick one of the plans on the pricing page." }, { status: 400 });
  }
  const gaClientId = parseGaClientId(rawBody);

  if (!(await getSettings()).switches.checkout) {
    return NextResponse.json({ error: "Checkout is paused for a few minutes. Please try again shortly." }, { status: 503 });
  }

  const accessToken = await getIntegrationValue("polar", "accessToken");
  const productId = await productIdForCheckoutPlan(plan);
  if (!accessToken || !productId) {
    console.error(`[polar/checkout] missing Polar access token or product id for plan "${plan}"`);
    return NextResponse.json(
      { error: "Checkout isn't available right now. Please try again in a few minutes or contact support." },
      { status: 501 },
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // One billing row per user, so check what they already have before opening checkout.
  const existing = await prisma.subscription.findUnique({
    where: { userId: user.id },
    select: { stripeSubscriptionId: true, status: true, currentPeriodEnd: true, cancelAtPeriodEnd: true },
  });
  const blocked = checkoutConflict(existing, plan);
  if (blocked) return NextResponse.json({ error: blocked, code: "HAS_SUBSCRIPTION" }, { status: 409 });

  const base = appBaseUrl();

  // Carry first-touch campaign attribution through checkout so the server-side
  // `purchase` event (fired from the webhook, which has no browser) is still
  // credited to the campaign that brought the user in. Non-PII metadata only.
  const attribution = attributionToMetadata(attributionFromCookieHeader(req.headers.get("cookie")));

  const body = {
    products: [productId],
    success_url: `${base}/dashboard/settings/subscription?checkout=success`,
    customer_email: user.email,
    ...(user.name ? { customer_name: user.name } : {}),
    external_customer_id: user.id,
    // Surfaced back on checkout/subscription/order webhooks so we can map to our
    // user, stitch the purchase to the originating GA4 browser session, and
    // credit it to the campaign that brought the user in (non-PII metadata only).
    metadata: {
      user_id: user.id,
      plan,
      ...(gaClientId ? { ga_client_id: gaClientId } : {}),
      ...attribution,
    },
  };

  const res = await fetch(`${(await polarApiBase())}/v1/checkouts/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  const json = (await res.json().catch(() => null)) as
    | { url?: string; detail?: unknown; error?: string }
    | null;

  if (!res.ok || !json?.url) {
    const detail = json?.detail;
    const msg =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail
              .map((d) => (d && typeof d === "object" && "msg" in d ? (d as { msg?: string }).msg : null))
              .filter(Boolean)
              .join("; ")
          : json?.error || "Polar checkout failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  await trackEvent("checkout_started", { userId: user.id, meta: { provider: "polar", plan } });
  return NextResponse.json({ url: json.url });
}

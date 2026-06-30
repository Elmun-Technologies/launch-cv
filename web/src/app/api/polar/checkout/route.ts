import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/analytics";
import { appBaseUrl } from "@/lib/email";
import { polarApiBase, productIdForCheckoutPlan } from "@/lib/polar";
import type { CheckoutPlan } from "@/lib/plan-config";

const CHECKOUT_PLANS: CheckoutPlan[] = ["starter", "professional", "elite", "lifetime"];

function parsePlan(body: unknown): CheckoutPlan {
  if (!body || typeof body !== "object" || !("plan" in body)) return "professional";
  const p = (body as { plan?: string }).plan;
  if (typeof p === "string" && CHECKOUT_PLANS.includes(p as CheckoutPlan)) return p as CheckoutPlan;
  return "professional";
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = parsePlan(await req.json().catch(() => ({})));

  const accessToken = process.env.POLAR_ACCESS_TOKEN;
  const productId = productIdForCheckoutPlan(plan);
  if (!accessToken || !productId) {
    return NextResponse.json(
      {
        error: `Configure POLAR_ACCESS_TOKEN and a product id for "${plan}" (e.g. POLAR_PRODUCT_${plan.toUpperCase()}).`,
      },
      { status: 501 },
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const base = appBaseUrl();

  const body = {
    products: [productId],
    success_url: `${base}/dashboard/settings?checkout=success`,
    customer_email: user.email,
    ...(user.name ? { customer_name: user.name } : {}),
    external_customer_id: user.id,
    // Surfaced back on checkout/subscription/order webhooks so we can map to our user.
    metadata: { user_id: user.id, plan },
  };

  const res = await fetch(`${polarApiBase()}/v1/checkouts/`, {
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

import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/analytics";
import { appBaseUrl } from "@/lib/email";
import { variantIdForCheckoutPlan, type CheckoutPlan } from "@/lib/plans";

const LS_API = "https://api.lemonsqueezy.com/v1/checkouts";

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

  const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
  const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
  const variantId = variantIdForCheckoutPlan(plan);
  if (!apiKey || !storeId || !variantId) {
    return NextResponse.json(
      {
        error: `Configure LEMON_SQUEEZY_API_KEY, LEMON_SQUEEZY_STORE_ID, and variant for "${plan}" (e.g. LEMON_VARIANT_${plan.toUpperCase()} or LEMON_SQUEEZY_VARIANT_ID for professional).`,
      },
      { status: 501 },
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const base = appBaseUrl();
  const testMode = process.env.LEMON_SQUEEZY_TEST_MODE === "1" || process.env.LEMON_SQUEEZY_TEST_MODE === "true";

  const body = {
    data: {
      type: "checkouts",
      attributes: {
        ...(testMode ? { test_mode: true } : {}),
        checkout_data: {
          email: user.email,
          ...(user.name ? { name: user.name } : {}),
          custom: { user_id: user.id },
        },
        product_options: {
          redirect_url: `${base}/dashboard/settings?checkout=success`,
        },
      },
      relationships: {
        store: { data: { type: "stores", id: String(storeId) } },
        variant: { data: { type: "variants", id: String(variantId) } },
      },
    },
  };

  const res = await fetch(LS_API, {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const json = (await res.json().catch(() => null)) as {
    data?: { attributes?: { url?: string } };
    errors?: Array<{ detail?: string; title?: string }>;
  } | null;

  if (!res.ok || !json?.data?.attributes?.url) {
    const msg = json?.errors?.map((e) => e.detail ?? e.title).filter(Boolean).join("; ") || "Lemon Squeezy checkout failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  await trackEvent("checkout_started", { userId: user.id, meta: { provider: "lemonsqueezy", plan } });
  return NextResponse.json({ url: json.data.attributes.url });
}

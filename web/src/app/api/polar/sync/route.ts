import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { getIntegrationValue } from "@/lib/integrations";
import { polarApiBase } from "@/lib/polar";
import { applyPolarPaidOrder, applyPolarSubscription } from "@/lib/polar-apply";

export const runtime = "nodejs";

const schema = z.object({ checkoutId: z.string().uuid() });

/**
 * Called by the success screen when the buyer returns from Polar. Reads the checkout
 * and its order straight from Polar and activates the plan, so access doesn't wait on
 * webhook delivery. Only the buyer's own checkout is accepted, and the shared apply
 * functions are idempotent, so this and the webhook can both run safely.
 */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const token = await getIntegrationValue("polar", "accessToken");
  if (!token) return NextResponse.json({ status: "unconfigured" }, { status: 501 });
  const base = await polarApiBase();
  const get = async <T,>(path: string): Promise<T | null> => {
    const r = await fetch(`${base}${path}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    }).catch(() => null);
    return r?.ok ? ((await r.json()) as T) : null;
  };

  type Checkout = { id: string; status: string; customer_id?: string | null; metadata?: Record<string, unknown> | null };
  const checkout = await get<Checkout>(`/v1/checkouts/${parsed.data.checkoutId}`);
  if (!checkout) return NextResponse.json({ status: "not_found" }, { status: 404 });
  if (checkout.metadata?.user_id !== session.sub) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (checkout.status !== "succeeded" || !checkout.customer_id) return NextResponse.json({ status: "pending" });

  type Order = { id: string; checkout_id?: string | null; paid?: boolean; status?: string; subscription_id?: string | null; metadata?: Record<string, unknown> | null };
  const orders = await get<{ items: Order[] }>(`/v1/orders/?customer_id=${encodeURIComponent(checkout.customer_id)}&limit=20&sorting=-created_at`);
  const order = orders?.items.find((o) => o.checkout_id === checkout.id);
  if (!order || !(order.paid || order.status === "paid")) return NextResponse.json({ status: "pending" });
  if (order.metadata?.user_id !== session.sub) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (order.subscription_id) {
    const sub = await get<Record<string, unknown>>(`/v1/subscriptions/${order.subscription_id}`);
    if (!sub) return NextResponse.json({ status: "pending" });
    const active = sub.status === "active" || sub.status === "trialing";
    await applyPolarSubscription(sub, active ? "subscription.active" : "subscription.updated");
    return NextResponse.json({ status: active ? "active" : "pending" });
  }

  const result = await applyPolarPaidOrder(order as unknown as Record<string, unknown>);
  return NextResponse.json({ status: result === "ignored" ? "pending" : "active" });
}

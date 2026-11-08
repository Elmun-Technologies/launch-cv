/**
 * Server side of Admin → Discounts: talks to the Polar discounts API with the
 * access token from Admin → Integrations → Polar. The token never leaves the
 * server and is never logged or audited.
 */

import { getIntegrationValue } from "@/lib/integrations";
import { planIdFromPolarProductId, polarApiBase, productIdForCheckoutPlan } from "@/lib/polar";
import { CHECKOUT_PLAN_ORDER, type CheckoutPlan } from "@/lib/plan-config";
import { polarErrorMessage, type PolarDiscount, type PolarDiscountBody } from "@/lib/polar-discounts";

type Result<T> = { ok: true; data: T } | { ok: false; status: number; error: string };

const NOT_CONNECTED = "Polar isn't connected. Add the access token in Integrations → Polar.";

async function polarRequest<T>(path: string, init: RequestInit = {}): Promise<Result<T>> {
  const token = await getIntegrationValue("polar", "accessToken");
  if (!token) return { ok: false, status: 501, error: NOT_CONNECTED };
  const res = await fetch(`${await polarApiBase()}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  }).catch(() => null);
  if (!res) return { ok: false, status: 502, error: "Couldn't reach Polar. Try again in a minute." };
  if (res.status === 204) return { ok: true, data: null as T };
  const json = (await res.json().catch(() => null)) as unknown;
  if (!res.ok) return { ok: false, status: res.status, error: polarErrorMessage(json, `Polar answered ${res.status}.`) };
  return { ok: true, data: json as T };
}

export async function polarConnected(): Promise<boolean> {
  return !!(await getIntegrationValue("polar", "accessToken"));
}

/**
 * Every discount in the organization (Polar paginates; at most 10 pages of 100).
 * `query` narrows by name (Polar's `query` filter), e.g. "Win-back".
 */
export async function listPolarDiscounts(query?: string): Promise<Result<PolarDiscount[]>> {
  const all: PolarDiscount[] = [];
  const q = query ? `&query=${encodeURIComponent(query)}` : "";
  for (let page = 1; page <= 10; page++) {
    const r = await polarRequest<{ items?: PolarDiscount[]; pagination?: { max_page?: number } }>(
      `/v1/discounts/?limit=100&page=${page}${q}`,
    );
    if (!r.ok) return r;
    all.push(...(r.data.items ?? []));
    if (page >= (r.data.pagination?.max_page ?? 1)) break;
  }
  return { ok: true, data: all };
}

export async function getPolarDiscount(id: string): Promise<Result<PolarDiscount>> {
  return polarRequest<PolarDiscount>(`/v1/discounts/${encodeURIComponent(id)}`);
}

export async function createPolarDiscount(body: PolarDiscountBody): Promise<Result<PolarDiscount>> {
  return polarRequest<PolarDiscount>("/v1/discounts/", { method: "POST", body: JSON.stringify(body) });
}

export async function deletePolarDiscount(id: string): Promise<Result<null>> {
  return polarRequest<null>(`/v1/discounts/${encodeURIComponent(id)}`, { method: "DELETE" });
}

/** Product id of each plan on sale (only plans that have one). */
export async function soldPlanProductIds(): Promise<Partial<Record<CheckoutPlan, string>>> {
  const entries = await Promise.all(CHECKOUT_PLAN_ORDER.map(async (p) => [p, await productIdForCheckoutPlan(p)] as const));
  return Object.fromEntries(entries.filter(([, id]) => !!id)) as Partial<Record<CheckoutPlan, string>>;
}

/** Resolve every product id used by `discounts` to a plan, once each. */
export async function productPlanMap(discounts: PolarDiscount[]): Promise<Map<string, CheckoutPlan | null>> {
  const ids = [...new Set(discounts.flatMap((d) => (d.products ?? []).map((p) => p.id)))];
  const plans = await Promise.all(ids.map((id) => planIdFromPolarProductId(id)));
  return new Map(ids.map((id, i) => [id, plans[i]]));
}

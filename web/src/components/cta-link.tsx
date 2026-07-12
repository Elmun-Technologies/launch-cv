"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { trackCtaClick, trackPlanSelected } from "@/lib/analytics-client";
import type { CheckoutPlan } from "@/lib/plan-config";

type LinkProps = ComponentProps<typeof Link>;

/**
 * A `next/link` that fires a `cta_click` event (GA4 + PostHog) on click.
 * Drop-in replacement for `<Link>` on "Get started" / "Choose plan" style
 * CTAs — pass `cta`, and `plan`/`location` where known.
 *
 * When `selectsPlan` is set and a `plan` is provided, it also fires the
 * `plan_selected` funnel event (used on the pricing cards, where clicking a
 * plan expresses plan intent before checkout).
 *
 * Usable from Server Components (it is a Client Component boundary), so pages
 * like /pricing don't need to become client components to track their CTAs.
 */
export function CtaLink({
  cta,
  plan,
  location,
  selectsPlan,
  onClick,
  ...props
}: LinkProps & {
  cta: string;
  plan?: CheckoutPlan | null;
  location?: string | null;
  selectsPlan?: boolean;
}) {
  return (
    <Link
      {...props}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        trackCtaClick({ cta, plan, location });
        if (selectsPlan && plan) trackPlanSelected(plan, { location });
        onClick?.(e);
      }}
    />
  );
}

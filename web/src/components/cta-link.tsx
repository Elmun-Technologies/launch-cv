"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { trackFeatureCtaClicked } from "@/lib/analytics-client";
import type { CheckoutPlan } from "@/lib/plan-config";

type LinkProps = ComponentProps<typeof Link>;

/**
 * A `next/link` that fires a `feature_cta_clicked` event (GA4 + PostHog) on
 * click. Drop-in replacement for `<Link>` on "Get started" / "Choose plan"
 * style CTAs — pass `cta`, and `plan`/`location` where known.
 *
 * Usable from Server Components (it is a Client Component boundary), so pages
 * like /pricing don't need to become client components to track their CTAs.
 */
export function CtaLink({
  cta,
  plan,
  location,
  onClick,
  ...props
}: LinkProps & { cta: string; plan?: CheckoutPlan | null; location?: string | null }) {
  return (
    <Link
      {...props}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        trackFeatureCtaClicked({ cta, plan, location });
        onClick?.(e);
      }}
    />
  );
}

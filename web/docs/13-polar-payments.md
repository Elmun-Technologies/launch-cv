# Polar payments (active provider)

LaunchCV checks out through [Polar](https://polar.sh) because Stripe / Lemon Squeezy
are not available in some regions (e.g. Uzbekistan). Polar is a Merchant of Record:
it handles checkout, tax, receipts and the customer billing portal.

The older Lemon Squeezy integration (`/api/lemon/*`) is left in the codebase as a
fallback but is no longer wired to the UI.

## How it fits together

| Piece | File |
|-------|------|
| Checkout (creates a Polar session, redirects user) | `src/app/api/polar/checkout/route.ts` |
| Webhook (subscriptions + one-time orders → DB) | `src/app/api/polar/webhook/route.ts` |
| DB sync helpers | `src/lib/polar-sync.ts` |
| Config + plan↔product mapping | `src/lib/polar.ts` |
| Plan resolution / entitlements | `src/lib/plans.ts`, `src/lib/entitlements.ts` |

Subscriptions are stored in the existing `Subscription` table (legacy `stripe*`
column names): `stripeCustomerId` = Polar customer id, `stripeSubscriptionId` =
Polar subscription id (`order:<id>` for one-time purchases), `stripePriceId` =
Polar product id.

## One-time setup in Polar

1. **Create the organization** (you are here in onboarding).
2. **Create one product per plan** (Products → New):
   - Week Pass — **$9 one-time purchase** (7 days of access, no renewal)
   - Pro — **$29 recurring, monthly** (the existing Professional product)
   - 90-Day Pass — **$69 one-time purchase** (90 days of access, no renewal)

   Copy each **Product ID**. Starter, Elite and Lifetime are legacy plans kept only
   for webhook/plan mapping of existing customers — they are never shown or sold.
   Keep their product ids set while existing customers still hold them.
3. **Create an Organization Access Token** (Settings → Developers) with the
   `checkouts:write` scope. Copy it once — it is shown only once.
4. **Create a webhook** (Settings → Webhooks):
   - URL: `https://<your-domain>/api/polar/webhook`
   - Format: **Raw** (Standard Webhooks)
   - Subscribe to at least: `subscription.created`, `subscription.updated`,
     `subscription.active`, `subscription.canceled`, `subscription.revoked`
     (recurring Pro), and `order.paid` (one-time Week Pass / 90-Day Pass).
   - Copy the signing **secret**.

## Environment variables

Set these (see `.env.example`):

```
POLAR_ACCESS_TOKEN=...                # org access token, checkouts:write scope
POLAR_SERVER=production               # or "sandbox" for testing
POLAR_WEBHOOK_SECRET=...              # webhook signing secret
POLAR_PRODUCT_WEEK=...                # Polar product IDs (sold)
POLAR_PRODUCT_PROFESSIONAL=...
POLAR_PRODUCT_QUARTER=...
POLAR_PRODUCT_STARTER=...             # legacy, not sold
POLAR_PRODUCT_ELITE=...
POLAR_PRODUCT_LIFETIME=...
NEXT_PUBLIC_POLAR_PORTAL_URL=https://polar.sh/<org-slug>/portal
```

Make sure `NEXT_PUBLIC_APP_URL` is your real URL — the checkout `success_url`
and the webhook endpoint are derived from it.

## Testing with sandbox

Set `POLAR_SERVER=sandbox` and use a token + products from
[sandbox.polar.sh](https://sandbox.polar.sh). Checkout then runs against
`https://sandbox-api.polar.sh`. Switch back to `production` for real payments.

## How access is granted

- **Recurring (Pro; legacy Starter/Elite):** Polar fires `subscription.*` events; the
  webhook upserts a `Subscription` row with the Polar status and `currentPeriodEnd`
  (the renewal date). Renewals extend it automatically. `subscriptionRowGrantsPaid()`
  grants access while the status is active/trialing/past_due, or while a canceled
  subscription is still within its paid period.
- **Passes (Week Pass, 90-Day Pass):** Polar fires `order.paid`; the webhook stores
  an `order:<id>` row with `currentPeriodEnd` = now + 7 or 90 days (lengths in
  `PASS_DAYS`, `lib/plan-config.ts`). Buying a pass while one is still running
  extends from the current end. Access stops once `currentPeriodEnd` passes.
  Checkout refuses Pro while a pass is running, and a pass while Pro is renewing.
- **Legacy Lifetime:** an `order:<id>` row with no end date, so access never lapses.

`getUserPlanId()` maps the stored product id back to a plan tier for usage limits.

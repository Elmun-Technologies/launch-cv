# Polar payments (active provider)

Launch CV checks out through [Polar](https://polar.sh) because Stripe / Lemon Squeezy
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
2. **Create one product per plan** (Products → New): Starter, Professional, Elite,
   Lifetime. Starter is a monthly recurring price; Professional / Elite are yearly
   recurring; **Lifetime is a one-time price**. Copy each **Product ID**.
3. **Create an Organization Access Token** (Settings → Developers) with the
   `checkouts:write` scope. Copy it once — it is shown only once.
4. **Create a webhook** (Settings → Webhooks):
   - URL: `https://<your-domain>/api/polar/webhook`
   - Format: **Raw** (Standard Webhooks)
   - Subscribe to at least: `subscription.created`, `subscription.updated`,
     `subscription.active`, `subscription.canceled`, `subscription.revoked`,
     and `order.paid` (for Lifetime).
   - Copy the signing **secret**.

## Environment variables

Set these (see `.env.example`):

```
POLAR_ACCESS_TOKEN=...                # org access token, checkouts:write scope
POLAR_SERVER=production               # or "sandbox" for testing
POLAR_WEBHOOK_SECRET=...              # webhook signing secret
POLAR_PRODUCT_STARTER=...             # Polar product IDs
POLAR_PRODUCT_PROFESSIONAL=...
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

The webhook upserts a `Subscription` row. `getUserPlanId()` maps the stored
product id back to a plan tier and `subscriptionRowGrantsPaid()` decides whether
the status (active / trialing / past_due, or canceled-but-not-yet-expired) still
grants access. Lifetime orders are stored as an always-active row with no renewal
date.

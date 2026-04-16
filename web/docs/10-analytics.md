# 10.2 Analytics — Posthog + ichki DB

## Posthog (frontend)

- Env: `NEXT_PUBLIC_POSTHOG_KEY`, ixtiyoriy `NEXT_PUBLIC_POSTHOG_HOST` (default `https://us.i.posthog.com`).
- Kod: `src/app/providers.tsx` — kalit bo‘lsa `PostHogProvider` faollashadi.
- Keyingi qadam: `posthog.identify(userId)` ni kirishdan keyin clientda chaqirish (PII siyosatiga muvofiq).

## Ichki hodisalar (`AnalyticsEvent`)

Serverda `trackEvent()` — signup, login, AI ishlari, PDF, Stripe va hokazo.

**Metabase / BI:** Postgres prodga o‘tgach `AnalyticsEvent` jadvalini to‘g‘ridan-to‘g‘ri ulanish yoki kunlik export.

## QA

`docs/12-qa-load-beta.md` va `npm run test:e2e`.

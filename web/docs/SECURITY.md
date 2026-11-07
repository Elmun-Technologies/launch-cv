# Security — current state & open items

Snapshot from a hands-on audit (2026-11-07). Update this file whenever a
security-relevant fix or decision lands.

## What's solid today

- **Passwords**: bcrypt cost 12 (`src/lib/password.ts`). Login uses
  `verifyPasswordTimingSafe`, which always runs a dummy bcrypt compare for
  unknown emails — response time can't be used to enumerate registered
  accounts.
- **Sessions**: signed JWT (HS256, `jose`), `httpOnly` + `secure` +
  `sameSite=lax` cookie, 14-day expiry (`src/lib/auth-token.ts`). `AUTH_SECRET`
  is required ≥16 chars in production; the dev fallback secret only applies
  when `NODE_ENV === "development"`.
- **Admin access**: role check (`src/lib/admin-guard.ts`) *and* a separate
  TOTP 2FA gate (`middleware.ts`) with its own `sameSite=strict`,
  sliding-expiry cookie. Staff secrets and admin-entered integration API keys
  are encrypted at rest (AES-256-GCM, `src/lib/secret-box.ts`).
- **Rate limiting**: `consumeRateLimitShared` (`src/lib/rate-limit.ts`) is
  backed by a DB table (`RateLimitBucket`), not in-memory — survives Vercel
  cold starts and multiple instances. Login is keyed per `ip+email`
  (`src/lib/rate-limit-presets.ts`), so one abusive IP can't lock out every
  user, and vice versa.
- **Webhooks**: Polar webhook signature verified per the Standard Webhooks
  spec with `crypto.timingSafeEqual` (`src/app/api/polar/webhook/route.ts`).
- **Open redirect**: the post-login `?next=` param is validated
  (`safeNextPath` in `middleware.ts`) — rejects `//host`, `/\host`, and any
  `scheme://`.
- **SQL injection**: all data access goes through Prisma's typed query
  builder; the one raw query (`rate-limit.ts`, bucket upsert) uses tagged-
  template parameters, not string interpolation.

## Fixed 2026-11-07

- **Next.js 16.2.3 → 16.4.5** — 16.2.3 carried several unauthenticated
  **critical RCE** advisories (Image Optimization API with SVG/AVIF input,
  `next/og` `ImageResponse`, `"use cache"` deserialization of typed arrays)
  plus multiple **high-severity middleware/proxy auth-bypass** CVEs
  (`GHSA-492v-c6pp-mqqv`, `GHSA-267c-6grr-h53f`, `GHSA-36qx-fr4f-26g5`,
  `GHSA-6gpp-xcg3-4w24`, `GHSA-26hh-7cqf-hhc6`) — the last category matters
  specifically here because `/admin-panel` and `/dashboard` are gated in
  `middleware.ts`; a framework-level bypass of that layer would have made the
  role/2FA checks moot. 16.4.5 is npm's own "non-major" fix target.
- **protobufjs** (transitive, via an analytics/webhook dep) — was flagged
  **critical** (prototype-pollution → code-gen gadget); cleared by
  `npm audit fix`.
- Added baseline hardening response headers (`next.config.ts`):
  `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy: camera=(), microphone=(), geolocation=()`,
  `Strict-Transport-Security: max-age=63072000; includeSubDomains`.

## Open — do next

1. **Content-Security-Policy.** Not added yet. The app loads GA4
   (googletagmanager.com), PostHog (admin-configurable host, default
   `us.i.posthog.com` / optionally the EU host) and Mixpanel from hosts that
   are partly set via `/admin-panel` → Integrations, not fixed at build time.
   A blind enforced CSP risks silently breaking analytics, Google OAuth, or
   the Polar checkout. Roll it out the way the Go Vita project does it:
   `Content-Security-Policy-Report-Only` first, watch `/api/csp-report`-style
   hits for a few days with real traffic, then switch to enforced.
2. **Prisma CLI tooling** (`prisma`, `@prisma/config`) has 4 known highs;
   the only fix is Prisma 6 → 7, a deliberate major migration (schema/client
   API changes), not a drop-in patch — do this as its own tracked task, not a
   security hotfix.
3. **sharp** (libvips CVEs, high) is transitive — check what pulls it in
   (`npm ls sharp`) before deciding whether an upgrade is in scope here or
   needs its own PR.
4. Re-run `npm audit` monthly (or wire it into CI) — Next.js in particular
   has shipped a security patch almost every minor release this cycle.

## Known sandbox limitation (2026-11-07 fix)

This fix's local build could not be fully verified in the dev sandbox:
`prisma generate` needs to fetch the query engine binary from
`binaries.prisma.sh`, which that sandbox's egress proxy blocks by policy
(unrelated to this change — would block any fresh install there). CI (GitHub
Actions, full network access) is the real gate before merge.

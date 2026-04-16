# Launch CV

AI-powered resume and career toolkit: resume builder, JD alignment, cover letters, interview prep, ATS scoring, and more. Built with **Next.js** (App Router), **Prisma**, and **Tailwind CSS**.

## Repository layout

| Path | Purpose |
|------|---------|
| `web/` | Next.js application (UI + `app/api` routes) |
| `web/prisma/` | Database schema & migrations |
| `.github/workflows/` | CI (lint, build, E2E under `web/`) |
| `package.json` (root) | Convenience scripts that delegate to `web/` |

## Requirements

- **Node.js** 20+ (CI uses 22)
- **npm**

## Local development

From the repository root:

```bash
cp web/.env.example web/.env
# Edit web/.env — set at least AUTH_SECRET, DATABASE_URL, OPENAI_API_KEY for full features
npm run setup
npm run dev
```

The dev server runs from `web/` (see root `package.json`). Open [http://localhost:3000](http://localhost:3000).

### Useful commands (from root)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build (`web/`) |
| `npm run setup` | `npm ci` in `web/` + `prisma db push` |

Or run commands inside `web/` directly, e.g. `cd web && npm run lint`.

## Environment variables

Copy `web/.env.example` to `web/.env` and fill values. **Never commit `web/.env`** — it is gitignored.

Main variables:

- **`DATABASE_URL`** — local default is SQLite (`file:./dev.db`). For production (e.g. Vercel), use **PostgreSQL** and set `provider` in `web/prisma/schema.prisma` to `postgresql` accordingly.
- **`AUTH_SECRET`** — long random string (16+ chars).
- **`OPENAI_API_KEY`** — required for AI features.
- **`RESEND_API_KEY`** / **`RESEND_FROM_EMAIL`** — transactional email (verification, password reset).
- **`NEXT_PUBLIC_APP_URL`** — canonical site URL (e.g. `https://launch-cv.com`).
- **Lemon Squeezy** — `LEMON_SQUEEZY_*`, `LEMON_WEBHOOK_SECRET` for subscriptions (see `.env.example`).

## Database

- **Development:** SQLite under `web/prisma/` is fine for local work.
- **Production:** use a hosted **PostgreSQL** (Neon, Supabase, Vercel Postgres, etc.). Serverless hosts are a poor fit for file-based SQLite.

## Deploying (Vercel)

1. Create a Vercel project from this GitHub repo.
2. Set **Root Directory** to **`web`**.
3. Add all environment variables from `web/.env.example` in the Vercel dashboard.
4. Point your domain (`launch-cv.com`) to Vercel and set `NEXT_PUBLIC_APP_URL` to the live URL.

## CI

GitHub Actions runs on pushes/PRs to `main` / `master`: install deps in `web/`, Prisma, lint, build, Playwright smoke tests.

## License

Private — **Elmun Technologies**. All rights reserved unless stated otherwise.

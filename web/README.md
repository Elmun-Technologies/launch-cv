This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Blog content (SEO)

The `/blog` list and `/blog/[slug]` pages are CMS-driven from the `BlogPost`
Postgres table. Pages read published rows at request time (ISR), `sitemap.xml`
adds every published post automatically, and each post renders full metadata,
JSON-LD `Article` / `BreadcrumbList` / `FAQPage` schema, an OG image, reading
time, and internal links.

Seed content lives as content-as-code in [`src/lib/blog-posts.ts`](src/lib/blog-posts.ts).
There are two ways to publish it.

**1. Manual publish (sync git → DB).** Upserts by slug, so edits to
`blog-posts.ts` are pushed to the database:

```bash
# from web/, with DATABASE_URL pointing at the target DB
npm run db:seed
```

**2. Automatic on deploy (opt-in).** `npm run build` runs a **create-only**
seed step that is a **no-op unless** the environment variable
`BLOG_SEED_ON_BUILD` is set to `1` (or `true`/`yes`/`on`). When enabled, each
deploy inserts any posts that don't yet exist and **never updates existing
ones**, so admin-panel edits are safe. The step is also non-fatal — a seeding
error logs a warning and the deploy continues.

```bash
# enable auto-seed on deploy (e.g. a Vercel env var)
BLOG_SEED_ON_BUILD=1
```

After seeding, `/blog` renders the posts and they appear in `sitemap.xml` and
`/blog/feed.xml`. To add a post, append an entry to `BLOG_POSTS`. Posts can
also be created and edited through the admin panel (`/admin-panel/content`).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

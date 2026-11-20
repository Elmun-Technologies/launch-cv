# Hetzner / Coolify'da deploy (Vercel'dan to'liq chiqish)

Server: Hetzner CAX21 (`ubuntu-8gb-hel1-1`, Helsinki), Coolify. Vercel endi ishlatilmaydi.
Rasm: `web/Dockerfile`. Build **bazaga ulanmaydi**; sxema/kontent tuzatishlari (`npm run release`)
konteyner ishga tushganda bajariladi.

## 1. Coolify'da ilova
- Project: `launch-cv` → New Resource → **Dockerfile** build pack.
- Repo: `Elmun-Technologies/launch-cv` (private repo → Deploy Key yoki GitHub App org'ga o'rnatilgan bo'lishi kerak).
- Branch: `main`. **Base Directory: `/web`**. Dockerfile: `/Dockerfile`. Port: `3000`.
- Domains: `https://launch-cv.com`. `www.launch-cv.com` → `launch-cv.com` ga 301 redirect (Coolify'da `www` ni ham domen qilib qo'shing, "Redirect to non-www").
- Health check: path `/api/site-status`, port 3000 (DB ulanishini ham tekshiradi; 200 qaytishini birinchi deployda tekshiring).
- Auto Deploy: yoqilgan (push → deploy). Rollback: Coolify → Deployments → oldingi image.

## 2. Baza (Postgres)
- Coolify'da alohida Postgres 16 resursi (shu project ichida). **Public port ochmang.**
- `DATABASE_URL` = Coolify bergan *internal* URL (`postgres://…@<uuid>:5432/…`).
- Zaxira: Postgres resursi → Backups → har kuni (S3 ulang, aks holda zaxira server diskida qoladi).
- Eski bazani ko'chirish (bir marta, Mac'dan; URL'lar maxfiy, repoga yozmang):
  ```bash
  pg_dump "$OLD_URL_NON_POOLING" -Fc --no-owner --no-acl -f launchcv.dump
  # Coolify Postgres'ga: vaqtincha port ochib yoki serverda `docker exec -i <pg> pg_restore` bilan:
  docker exec -i <pg-container> pg_restore -U <user> -d <db> --no-owner --clean --if-exists < launchcv.dump
  ```
  Tiklangach: `User`, `PageView`, `Order`/obuna jadvallarida qatorlar sonini eski bilan solishtiring.

## 3. Environment (Coolify → Environment Variables)
Qiymatlarni Vercel'dan ko'chiring (kalit/parollarni repoga yozmang). `NEXT_PUBLIC_*` — **Available at Buildtime** belgilang.

| Guruh | O'zgaruvchilar |
|---|---|
| Asosiy | `DATABASE_URL`, `AUTH_SECRET`, `KEY_ENCRYPTION_KEY`, `ADMIN_EMAILS`, `NEXT_PUBLIC_APP_URL=https://launch-cv.com`, `CRON_SECRET` (yangi, `openssl rand -hex 32`) |
| To'lov (Polar) | `POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET`, `POLAR_SERVER`, `POLAR_PRODUCT_PROFESSIONAL`, `POLAR_PRODUCT_STARTER`, `POLAR_PRODUCT_LIFETIME`, `POLAR_PRODUCT_WEEK`, `POLAR_PRODUCT_QUARTER`, `NEXT_PUBLIC_POLAR_PORTAL_URL` |
| Email | `RESEND_API_KEY`, `RESEND_FROM_EMAIL` |
| AI | `OPENAI_API_KEY` (Anthropic kaliti Admin → Integrations'da, DB'da shifrlangan) |
| Boshqa | `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `GA_API_SECRET`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_MIXPANEL_TOKEN`, `BLOG_SEED_ON_BUILD` |

**Muhim:** `KEY_ENCRYPTION_KEY` Vercel'dagi bilan **aynan bir xil** bo'lishi shart, aks holda DB'da shifrlangan sozlamalar (integratsiya kalitlari) o'qilmaydi.
Kerak emas: `DATABASE_POSTGRES_*` (Vercel), `LEMON_*` (eski), `NEXT_PUBLIC_VERCEL_ENV`, `REDIS_URL`.

## 4. Cron'lar (Coolify → ilova → Scheduled Tasks)
Vercel cron o'rniga. Container: ilovaning o'zi. Har birini "Execute now" bilan tekshiring (200 qaytishi kerak).

| Nom | Jadval (UTC) | Buyruq |
|---|---|---|
| winback | `7 15 * * *` | `sh -c 'curl -fsS -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/winback'` |
| weekly-report | `7 13 * * 1` | `sh -c 'curl -fsS -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/weekly-report'` |
| indexnow | `23 6 * * *` | `sh -c 'curl -fsS -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/indexnow'` |

`CRON_SECRET` bo'lmasa `src/lib/cron-auth.ts` faqat `vercel-cron/` user-agent'ni qabul qiladi, shuning uchun uni **albatta** o'rnating.

## 5. Tashqi servislar (domen o'zgarmaydi, URL'lar o'sha)
- **DNS (Namecheap):** `A @ → 2.29.137.243`, `CNAME www → launch-cv.com` (yoki `A www → 2.29.137.243`). Resend yozuvlariga (`send`, `rsend`, `resend._domainkey`, `_dmarc`) tegmang. Avval TTL'ni 300 ga tushiring.
- **Polar:** webhook URL o'zgarmaydi (`https://launch-cv.com/api/polar/webhook`), lekin saytning o'chiq davrida (pauza) yo'qolgan eventlarni Polar → Webhooks → Deliveries'dan qayta yuboring; buyurtmalar bilan solishtiring.
- **Google OAuth:** redirect URI domen bo'yicha, o'zgarmaydi.
- **Search Console:** domen bir xil — hech narsa qilish shart emas. Deploydan keyin muhim sahifalarga Request Indexing.

## 6. Deploydan keyin tekshiruv
1. `curl -sI https://launch-cv.com/` → 200, `Strict-Transport-Security` bor.
2. `https://launch-cv.com/robots.txt`, `/sitemap.xml` ochiladi; `www` → 301 → non-www.
3. Admin IP himoyasi: `src/lib/admin-guard.ts` `X-Forwarded-For` ning birinchi qiymatini oladi. Traefik ortida uni mijoz soxtalashtira olmasligini tekshiring:
   `curl -s -H 'X-Forwarded-For: 1.2.3.4' https://launch-cv.com/admin-panel` — audit log'dagi IP `1.2.3.4` bo'lmasligi kerak. Bo'lsa — kod tuzatiladi.
4. Ro'yxatdan o'tish, email (Resend), Polar test checkout, PDF eksport (`@react-pdf`, shriftlar `src/lib/pdf/fonts`) ishlashi.
5. Admin → Integrations: Search Console/Bing verify teglari `<head>` da bor.

## 7. Eslatmalar
- `npm run build` (CI) eski zanjirni saqlaydi; Hetzner uchun `build:app` + `release` ishlatiladi.
- `release` endi `prisma db push` ni `--accept-data-loss`siz ishlatadi: ma'lumot yo'qotadigan sxema o'zgarishi to'xtaydi, qo'lda hal qilinadi.
- Vercel'dan chiqqach: GitHub org'dagi Vercel ilovasini o'chiring (Configure → Uninstall), Vercel loyihasini arxivlang.

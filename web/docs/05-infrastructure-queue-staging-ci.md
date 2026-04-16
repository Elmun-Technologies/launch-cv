# 5.5–5.7 Navbat, staging, CI

## 5.5 Background jobs (navbat)

**Maqsad:** uzoq AI/PDF operatsiyalari HTTP so‘rovini bloklamasligi, retry va monitoring.

| Variant | Qachon |
|---------|--------|
| **Redis + BullMQ** (yoki Bull) | Postgres/Redis bor prod |
| **Vercel + QStash** | Serverless, minimal ops |
| **In-process** | Faqat dev / juda kichik yuk |

Loyiha ildizida `docker-compose.yml` — **Redis** lokal test uchun.

Keyingi implementatsiya qadamlari:

1. `REDIS_URL` env.
2. Worker jarayoni (alohida `npm run worker` yoki container).
3. API faqat job yaratadi, status `GET /api/jobs/[id]`.

## 5.6 Staging

- Alohida DB (`DATABASE_URL`), alohida `AUTH_SECRET`, test Stripe (`sk_test_`), `STRIPE_WEBHOOK_SECRET` staging endpoint.
- `NEXT_PUBLIC_APP_URL` staging domen.
- Ma’lumotlarni prod bilan aralashtirmaslik.

## 5.7 CI

GitHub Actions: `lint` → `prisma generate` → `build` → (ixtiyoriy) `playwright`.

Fayl: `.github/workflows/ci.yml`

---

**Minimal “done”:** CI yashil; staging URL va envlar jadvali (ichki wiki) bor.

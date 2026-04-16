# 0.x Pre-kickoff (mahsulot qarorlari)

Ushbu bo‘lim kod emas — loyiha boshlashdan oldingi **qat’iy qarorlar** va ularni qayerda yozib borish (Notion/Linear) bo‘yicha skaffold.

## 0.1 Loyiha nomi, domen, til, birinchi bozor

| Maydon | Hozirgi placeholder | Qaror qilish |
|--------|---------------------|--------------|
| Brend nomi | SohaCV | Yakuniy nom + domen tekshiruvi |
| Domen | — | DNS, SSL, prod `NEXT_PUBLIC_APP_URL` |
| UI tili | asosan `uz` | MVP: uz yoki uz+en; keyin i18n |
| Birinchi bozor | — | mamlakat + to‘lov provayderi (Stripe mintaqasi) |

## 0.2 KPI (30 / 60 / 90 kun)

- Ro‘yxatdan o‘tishlar, MAU, activation (birinchi resume + birinchi export), JD/packet ishlatish, to‘lov conversion, churn, ARPU.
- Har KPI uchun **manba**: Posthog hodisalari + Stripe + DB `AnalyticsEvent`.

## 0.3 Budjet

- OpenAI (oylik limit), Resend, Stripe %, hosting (Vercel/Railway), dizayn, yuridik, marketing.

## 0.4 Jamoa (virtual rollar)

- PM, dizayn, backend, kontent (vertikal playbook), marketing — hatto 1 kishi bo‘lsa ham vazifa nomi bo‘yicha sprint.

## 0.5 Texnik qarorlar

- Stack: Next.js + Prisma + SQLite (dev) / Postgres (prod tavsiya).
- Repo: monorepo `web/` yoki keyin root ga ko‘chirish.
- Branch: `main` + short-lived `feature/*`; CI: `.github/workflows/ci.yml`.

---

**Keyingi qadam:** yuqoridagi jadvalni to‘ldirib, `NEXT_PUBLIC_APP_URL` va prod domenni `.env` / hostingda bog‘lash.

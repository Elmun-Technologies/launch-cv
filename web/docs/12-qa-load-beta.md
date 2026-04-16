# 12.x QA, load test, beta

## 12.1 Test rejasi (funktsional)

- [ ] Ro‘yxat / kirish / chiqish
- [ ] Resume CRUD, avtosaqlash, snapshot, tiklash
- [ ] PDF (US/EU)
- [ ] AI yo‘llari (kalit yo‘qda xabar)
- [ ] Email verify / reset (Resend yoqilganda)
- [ ] Stripe checkout → webhook → `Subscription` yangilanishi (test mode)
- [ ] Akkaunt eksport / o‘chirish

## 12.2 Load test (qisqa)

Maqsad: bir vaqtning o‘zida ko‘p AI so‘rovi — rate limit va server barqarorligi.

**Tavsiya:** `k6` yoki `autocannon` — skript misoli:

```bash
# misol: 30 soniya, 10 parallel
npx autocannon -c 10 -d 30 -m POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -b '{"email":"test@test.uz","password":"wrongpass"}'
```

Prodga qarshi stress qilmang; faqat staging.

## 12.3 Beta (20–50 kishi)

- Discord / Telegram kanal + feedback forma (Google Form).
- 1 hafta: asosiy friction ro‘yxati.
- **Chiqish:** 5 ta eng yuqori bug / UX fix backlogga.

## 12.4 Launch checklist

- [ ] Monitoring (Sentry / Vercel logs)
- [ ] Stripe live mode alohida kalitlar
- [ ] Terms/Privacy yurist review
- [ ] Rollback: oldingi deploy tag

## 12.5 Marketing minimal

- Landing yangilanishi, 60s demo video, 2–3 ta screenshot.

---

**Avtomatlashtirish:** `npm run test:e2e` (Playwright smoke) — CI da ishga tushirish mumkin.

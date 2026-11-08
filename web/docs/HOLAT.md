# Holat (har ishdan keyin yangilanadi)

Bu fayl — yangi chat/sessiya uchun **joriy holat**: "hozir nima qilindi, nima qolgan,
qaysi branch'da ishlanmoqda". Boshqa docs/ fayllari reja va spetsifikatsiyani biladi,
bu fayl holatni biladi. Yangi sessiya boshida shuni o'qing, eski chat tarixini qayta
o'qishga harakat qilmang.

**Qoida**: katta ish (PR, muhim o'zgarish, bloklangan narsa) tugagach — shu faylni
qisqa yangilang (3–10 qator yetarli).

## Branch

`main` — oxirgi birlashtirilgan holat `0b736a2`da (PR #80 bilan). Ikkita sessiya
shu repoda parallel ishlayapti: biri xavfsizlik (Next.js CVE, PR #79) ustida, men esa
kanvas-sayt taqqoslash va SEO ustida. Ishni boshlashdan oldin shu faylni o'qing —
boshqa sessiya nima qilganini bilish uchun.

## Narx qayta ishlandi (2026-11-08, lokal commit)

- Sotiladigan rejalar: Week Pass $9 (7 kun), Pro $29/oy, 90-Day Pass $69 (90 kun);
  pass'lar bir martalik, avto-yangilanmaydi. Starter/Elite/Lifetime — legacy (eski
  mijozlar uchun ishlaydi, sotilmaydi). Bepul akkaunt: oyiga 2 JD match + 1 role-fit,
  faqat email tasdiqlangan bo'lsa. Admin → Limits → "Model for free users".
- **Deploydan oldin:** Polar'da Week Pass ($9) va 90-Day Pass ($69) one-time
  product yaratish, `POLAR_PRODUCT_WEEK` / `POLAR_PRODUCT_QUARTER` (yoki Admin →
  Integrations → Polar) ga yozish. Prod'da saqlangan `planLimits.free` (0/0/0) bo'lsa,
  Admin → Limits'da free qatorini 2/1/0 ga o'zgartirish kerak.

## "Soxta" tuyg'u olib tashlandi (2026-11-08, branch `ux-trust`, lokal commit)

- `public/images/people/*` (fon olib tashlangan 6 portret) va ishlatilmagan
  `photos/avatar-*`, `colleagues-celebrate` va h.k. o'chirildi. O'rniga haqiqiy UI:
  `components/site/resume-sheet.tsx` (namunaviy rezyume sahifasi), auth sahifalarida
  ATS hisobot kartasi, /about'da ikonli kartalar. Odam rasmi qaytarilmasin.
- Cookie banner — pastki ingichka bar; ko'rinib turganda `--lc-cookie-bar` bilan
  sahifaga pastdan padding beriladi (globals.css), StickyCta uning ustida turadi.
- /pricing: "7-day refund on Pro", pass'lar kafolatga kirmaydi (Terms bo'yicha); limitlar
  kalendar oyi bo'yicha (Week Pass'da "/month" yo'q). Bepul ATS check: 30 kunda 1 marta / tarmoq.

## Win-back email (2026-11-08, branch `winback`, lokal commit)

- `src/lib/winback.ts` + `/api/cron/winback` (vercel.json cron, har kuni 15:07 UTC):
  checkout boshlagan yoki bepul AI limitiga yetgan, to'lamagan foydalanuvchiga 24 soatdan
  keyin BIR marta 30% / 48 soatlik shaxsiy Polar kodi bilan email. Admin → Discounts →
  "Win-back email". **Postal address bo'sh bo'lsa hech narsa yuborilmaydi** (CAN-SPAM) —
  deploydan keyin admin manzilni kiritishi kerak. `CRON_SECRET` env tavsiya etiladi.
- `User.marketingOptOutAt`, `/api/email/unsubscribe`. Tekshiruv: `npx tsx src/lib/winback.check.ts`.

## Biznes analitika (2026-11-08, branch `biz-analytics`, lokal commit)

- Admin → **Revenue** (`/admin-panel/revenue`) va **Product** (`/admin-panel/product`):
  daromad KPI (gross/discount/net, ARPPU, MRR/ARR, passlar), reja ulushi, chegirma
  kodlari (win-back guruhlangan), pass yangilash, Pro churn, mijozlar; aktivatsiya
  funnel, haftalik kogortalar, AI tool adoption, unit economics. Har jadval CSV
  (`/api/admin-panel/{revenue,product}/export`). Ruxsat: `users` (Subscriptions kabi).
- Matematika: `src/lib/biz-metrics.ts`, tekshiruv `npx tsx src/lib/biz-metrics.check.ts`.
- Ochiq: refundlar yozilmaydi (Polar `order.refunded` ishlanmaydi); Pro yangilanish
  to'lovlari `pay_success` sifatida yozilmaydi — net revenue faqat birinchi to'lovni ko'radi.

## Joriy / bloklangan (2026-11-07)

- To'lov tuzatildi (Polar): Professional endi $29/oy (yangi product
  `2e23dae2-…`), access token yangilandi, webhook Standard Webhooks bilan
  qayta yaratildi, Admin → Integrations "Connection works". Eski yillik
  Professional product'ni Polar'da arxivlash — foydalanuvchi ixtiyoriy.
- SEO paketi (branch `claude/compassionate-dijkstra-oa8wgc`, PR ochildi):
  related-roles grafi (har rolga 6 ta, 0 inbound qolmadi), footer
  "Popular examples", blog READ NEXT, keyword sahifalari takrorini kamaytirish,
  `/investors` → `/about` 301, `/what-is-a-good-ats-score`, 4 yangi ATS vendor,
  4 yangi blog (cv-vs-resume, harvard template, thank-you email, STAR),
  asossiz statistikalar (HBR "3×", ResumeGo "2024") manbali raqamlarga
  almashtirildi — prod DB'da `content-fixes.json` orqali (endi FAQ'larni ham
  tuzatadi). Tadqiqot: `docs/seo-tadqiqot-2026-11.md`.
- Keyingi g'oyalar: bepul "job description keyword extractor" vositasi,
  resume summary examples hub, mock interview / skills postlari.
- Foydalanuvchi qiladi: GSC Request Indexing, backlink outreach (materiallar
  oldin berilgan). Link sotib olish / spam backlink — qilinmaydi.
- **Tekshirish kerak:** Vercel → Settings → Git → Production Branch `main`.

## Limitni tejash

- Og'ir subagent/workflow kerak bo'lmasa chaqirmang, javoblar qisqa bo'lsin.
- "Cloud memory" vositalari (claude-mem va shunga o'xshash) bu muhitda ishlamaydi —
  har yangi chat = yangi vaqtinchalik konteyner, faqat git'ga commit qilingan narsa
  saqlanadi. Shu HOLAT.md — aynan shu uchun.

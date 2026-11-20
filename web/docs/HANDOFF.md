# LaunchCV — loyihani topshirish hujjati

Bu hujjat loyihaga yangi qo'shilgan dasturchi yoki AI agent uchun. Uni o'qib chiqqach, loyiha
nima ekanini, qanday ishlashini, nima qilinganini va keyin nima qilish kerakligini bilasiz.
Kunlik holat jurnali — [HOLAT.md](./HOLAT.md); bu fayl esa umumiy xarita.

Oxirgi yangilanish: 2026-11-15 (`main` = PR #102 dan keyingi holat).

---

## 1. Mahsulot

**LaunchCV** (https://launch-cv.com) — AQSh bozori uchun rezyume SaaS. Asosiy g'oya: rezyumeni
ATS (applicant tracking system) dasturi qanday o'qishini ko'rsatish, xatolarni tushuntirish va
rezyumeni har bir ish e'loniga moslash.

- **Egasi:** Elmun Technologies LLC, asoschi Nazir Elmurodov. Support: support@launch-cv.com.
- **Auditoriya:** AQShda ish izlayotgan odamlar (ish beruvchilar emas). Sayt matnlari inglizcha.
- **Asosiy kirish nuqtasi:** `/free-ats-check` — ro'yxatdan o'tmasdan bepul ATS tekshiruv
  (PDF/DOC/DOCX yoki matn, 0–100 ball, har bir muammoga tuzatish; tarmoq bo'yicha 30 kunda 1 marta).
- **Kabinet imkoniyatlari:** AI resume builder (4 shablon: Classic, Modern, Minimal, Executive;
  PDF eksport), JD alignment (e'lon bilan solishtirish, kalit so'z bo'shliqlari), role-fit, cover
  letter generator, application packet, interview prep (STAR), voice input, job tracker,
  kompaniyalar/kontaktlar, company matcher, referrals.
- **Bepul vositalar (`/tools/*`):** bullet point generator, summary generator, word counter,
  job description keyword scanner, resignation letter generator.
- **SEO kontent:** 88 ta rol uchun resume example + cover letter, pillar guide'lar, ATS vendor
  sahifalari, raqobatchi taqqoslashlari, blog (postlar DB'da).

### Narxlar (Polar orqali)

| Reja | Narx | Izoh |
| --- | --- | --- |
| Free | $0 | ATS check; email tasdiqlansa oyiga 2 JD match + 1 role-fit |
| Week Pass | $9 / 7 kun | bir martalik, avto-yangilanmaydi |
| Pro (Professional) | $29 / oy | obuna, 7 kunlik refund |
| 90-Day Pass | $69 / 90 kun | bir martalik |

Starter/Elite/Lifetime — legacy (eski mijozlar uchun ishlaydi, sotilmaydi). Har pullik rejada
barcha AI vositalar bor. Limitlar Admin → Limits'da (`AppSetting "planLimits"`).

---

## 2. Ish tartibi (muhim)

- **Til:** foydalanuvchi (loyiha egasi) o'zbekcha yozadi — javoblar o'zbekcha. Sayt, kod
  izohlari, commit xabarlari — inglizcha. `docs/` ichidagi hujjatlar — o'zbekcha.
- **Branch:** har bir ish alohida branch'da, PR orqali. Egasi PR'ni o'zi merge qiladi.
  PR'ni faqat so'ralganda oching. Merge'dan keyin branch'ni `origin/main`ga fast-forward qiling.
- **Deploy:** Hetzner + Coolify (Dockerfile). `main`ga merge = Coolify auto-deploy. Vercel ishlatilmaydi — `docs/HETZNER.md`.
  Sxema/kontent tuzatishlari `npm run release` orqali konteyner startida ishlaydi (pastda, 4-bo'lim).
- **HOLAT.md:** katta ish tugagach 3–10 qator qo'shing.
- **Next.js 16:** `web/AGENTS.md` ni o'qing — API'lar odatdagidan farq qiladi, kod yozishdan
  oldin `node_modules/next/dist/docs/` dagi tegishli qo'llanmani o'qing.
- **Push'dan oldin:** `npm run lint`, `npx tsc --noEmit`, kerakli `*.check.ts` va e2e.

### Qat'iy qoidalar (egasi bilan kelishilgan)

- Statistika, raqam, mijoz sharhi, "X% ko'proq intervyu" kabi da'volarni **to'qimang**.
  Raqam faqat manbasi bilan.
- Odam rasmlari (stok portretlar) **qaytarilmasin** — o'rniga haqiqiy UI ko'rsatiladi.
- To'qima AQSh manzili ishlatilmasin.
- Backlink sotib olinmaydi, spam/PBN yo'q, soxta sharh yo'q.
- Google qidiruv natijalarini scrape qilmang (bu muhitda bloklanadi). GSC ma'lumotini egasidan
  skrinshot bilan so'rang.
- Testni o'chirib/skip qilib CI'ni yashil qilmang.

---

## 3. Texnik stek va repo xaritasi

- **Next.js 16** (App Router, React 19), **TypeScript**, **Tailwind**, **Prisma 6 + PostgreSQL**,
  Hetzner/Coolify (hosting; cron — Coolify Scheduled Tasks), **Polar** (to'lov), **Resend** (email), **Anthropic Claude** va
  **OpenAI** (AI; model Admin → Limits'da tanlanadi, `src/lib/claude-client.ts`,
  `src/lib/openai-client.ts`, xarajat nazorati `src/lib/ai-budget.ts`).
- Analitika: o'z cookie'siz trafik tizimi (`PageView`), PostHog/Mixpanel/GA ixtiyoriy,
  piksellar faqat cookie roziligidan keyin.

```
web/
  src/app/                  sahifalar va API (App Router)
    page.tsx                bosh sahifa
    free-ats-check/         asosiy bepul vosita
    resume-examples/[slug]  88 rol sahifasi;  cover-letter-examples/, cover-letter/[slug]
    <guide>/page.tsx        pillar guide'lar (resume-format, skills-for-resume, ...)
    blog/[slug]             blog (kontent DB'da)
    tools/*                 bepul AI vositalar
    dashboard/*, resume/*   kabinet va resume editor
    admin-panel/*           admin (users, revenue, product, analytics, discounts,
                            integrations, limits, cms, content, security, roles, ...)
    api/cron/*              winback, weekly-report, indexnow
    sitemap.ts, robots.ts, llms.txt/
  src/lib/                  biznes mantiq
    seo/*.ts                guide sahifalar kontenti (bitta sahifa = bitta fayl)
    resume-examples*.ts     rol namunalari;  cover-letter-examples*.ts
    blog-posts.ts           blog seed manbasi
    plans.ts, plan-config.ts, entitlements.ts, usage-*.ts   reja va limitlar
    polar*.ts               checkout, webhook, chegirmalar
    winback.ts, welcome-offer.ts, email-layout.ts, email.ts  email
    traffic/                o'z analitikasi
    content-dates.ts        sitemap lastModified sanalari
    build-metadata.ts       title/description (fitTitle, " | LaunchCV" suffiksi)
  src/components/site/      marketing UI (nav, footer, seo/guide-page.tsx, seo/letter-sheet.tsx)
  prisma/
    schema.prisma
    seed-cms.ts             CMS seed (blog, FAQ, testimonial) — hech narsa o'chirmaydi
    content-fixes.json/.ts  prod DB'dagi kontentni tuzatish (matn, status=archived)
    settings-fixes.ts       AppSetting tuzatishlari
  e2e/                      Playwright testlar
  scripts/                  render-email-heroes.cjs va boshqalar
  docs/                     shu hujjat, HOLAT.md, SEO tadqiqot, rejalar
```

---

## 4. Lokal ishga tushirish va tekshiruv

```bash
cd web
cp .env.example .env              # DATABASE_URL (postgres), AUTH_SECRET kamida
service postgresql start          # konteyner qayta ishga tushsa, postgres o'chgan bo'ladi
npm ci
npm run build                     # prisma generate + db push + seed + content-fixes + next build
npx next start -p 3456            # tekshiruv uchun; to'xtatish: pkill -f next-server
```

- **Build zanjiri:** `prisma generate → db push → seed-cms --build-gate → content-fixes →
  settings-fixes → next build`. Ya'ni prod DB sxemasi va kontent tuzatishlari har deployda
  qo'llanadi.
- **Lint/tip:** `npm run lint`, `npx tsc --noEmit`.
- **Unit tekshiruvlar:** `npx tsx src/lib/<nom>.check.ts` (winback, weekly-report, biz-metrics,
  site-tags, polar-discounts, resume-score, bullet-quality, traffic/traffic.check.ts).
- **E2E:** `npm run test:e2e` (CI'da). Bu cloud konteynerda brauzer yo'li boshqacha bo'lsa,
  vaqtinchalik config bilan: `launchOptions.executablePath: "/opt/pw-browsers/chromium-…/chrome"`,
  `npx playwright test -c <config> --trace off`. Oxirgi natija: 45 passed, 6 skipped.
  E2E'dan keyin lokal DB'ni tozalang:
  `psql "$DATABASE_URL" -qc "delete from \"AppSetting\" where key in ('migrations','models','planLimits','indexnowLastRun')"`
  va `delete from "PageView"`.
- **Eslatma:** eski `next-server` jarayoni qolib ketsa, noto'g'ri natija beradi — tekshiruvdan
  oldin `pkill -f next-server`.
- **CI** (`.github/workflows/ci.yml`): npm ci → db push → lint → build → Playwright.

---

## 5. Asosiy tizimlar qanday ishlaydi

**Auth.** Email+parol (bcrypt) va Google OAuth. Email tasdiqlash Resend orqali. Rollar:
owner, admin, editor, support (`src/lib/admin-guard.ts`); `ADMIN_EMAILS` env — birinchi
owner uchun bootstrap. Admin uchun 2FA (TOTP) va recovery kodlar.

**Kalitlar va sozlamalar.** API kalitlar (Polar, Resend, Anthropic, OpenAI, Google...) asosan
Admin → Integrations'da saqlanadi, shifrlangan (`IntegrationSecret`, `KEY_ENCRYPTION_KEY`).
Env o'zgaruvchilar zaxira sifatida. Boshqa sozlamalar `AppSetting` jadvalida (key/value JSON).
Admin bosh sahifasi konfiguratsiya muammolarini ko'rsatadi (`admin-config-problems.ts`).

**To'lov (Polar).** Checkout `/checkout/[plan]` (slug'lar: `week`, `professional`, `quarter`,
legacy'lar), webhook `/api/polar/webhook` → `polar-apply.ts` (obuna, refund, renewal).
Faol shaxsiy chegirma kodi checkout'da avtomatik qo'llanadi.

**Limitlar.** `entitlements.ts` + `usage-*.ts`, oylik hisob `UsageMonth`. AI xarajat byudjeti va
kill-switch'lar Admin → Limits'da.

**Email.** Barcha xatlar `email-layout.ts` brendli shablonidan foydalanadi (hero rasmlar
`public/email/*.png`, `scripts/render-email-heroes.cjs` bilan yaratiladi). Sender
`LaunchCV <info@launch-cv.com>`, domen Resend'da tasdiqlangan.
- **Welcome offer:** email tasdiqlangach (Google'da darhol) shaxsiy `HELLO…` kodi, 20% / 48 soat.
- **Win-back:** checkout boshlab to'lamagan yoki bepul limitga yetganlarga 24 soatdan keyin bir
  marta `BACK…` kodi, 30% / 48 soat. Postal address (CAN-SPAM) kiritilmasa yuborilmaydi.
- Faol kod bo'lsa dashboard va pricing'da countdown banner (`offer-banner.tsx`, `/api/offer`).
- Unsubscribe: `User.marketingOptOutAt`, `/api/email/unsubscribe`.

**Cron'lar** (Coolify Scheduled Tasks, `docs/HETZNER.md`; auth: `src/lib/cron-auth.ts`, `CRON_SECRET`):
- `/api/cron/winback` — har kuni 15:07 UTC (eski PageView'larni ham tozalaydi).
- `/api/cron/weekly-report` — dushanba 13:07 UTC, owner'larga haftalik hisobot.
- `/api/cron/indexnow` — har kuni 06:23 UTC, oxirgi 3 kunda o'zgargan URL'larni Bing/Yandex'ga
  yuboradi. Kalit fayli `public/3858e6c045a57cdccd322d9e15cd9393.txt`.

**Analitika.** `traffic-tracker.tsx` → `POST /api/t` → `PageView` (IP saqlanmaydi, kunlik salt
bilan hash). Admin → Analytics, Revenue, Product sahifalari, har jadval CSV.
Sayt tasdiqlash meta teglari va piksellar (GTM, Meta, TikTok, Clarity, LinkedIn, Reddit) —
Admin → Integrations.

**Blog va CMS.** Blog postlar, FAQ, testimonial'lar DB'da. Manba — `blog-posts.ts` va
`seed-cms.ts`. Seed **hech narsani o'chirmaydi**: postni olib tashlash uchun
`prisma/content-fixes.json`ga `status: "archived"` tuzatishini qo'shing va 301 redirect'ni
`next.config.ts`ga yozing. Prod'dagi matnni tuzatish ham `content-fixes.json` orqali.

---

## 6. SEO

### Hozirgi holat (2026-11-12 audit)

- GSC: ~110 sahifa indekslangan, ~207 "Discovered – currently not indexed". O'rtacha pozitsiya
  ~25.7. Impression'lar kuniga ~20 dan ~330 ga o'sgan.
- **Asosiy muammo — tashqi backlink'lar yo'q (0).** Texnik SEO toza: 351 URL, 404/noindex/
  canonical xatosi yo'q, ichki link chuqurligi ≤ 3, mobil Lighthouse 81–85.
- "ATS score" kannibalizatsiyasi PR #102 da tuzatildi: 2 blog post 301 bilan
  `/what-is-a-good-ats-score` va `/free-ats-check`ga birlashtirildi.
- Batafsil: [seo-tadqiqot-2026-11.md](./seo-tadqiqot-2026-11.md), [seo-query-map.md](./seo-query-map.md).

### Yangi guide sahifa qo'shish (checklist)

1. Kontent: `src/lib/seo/<nom>.ts` (sections, faqs, `*_PUBLISHED`/`*_UPDATED` sanalar).
2. Sahifa: `src/app/<slug>/page.tsx` — `GuidePage` komponenti (`components/site/seo/guide-page.tsx`),
   xat namunalari uchun `LetterSheet` + `WordDownload` (`/api/free/letter-docx`).
   Metadata `buildMarketingMetadata` + `fitTitle` bilan.
3. Ulash: `src/lib/content-dates.ts`, `src/app/sitemap.ts`, `components/site/site-footer.tsx`,
   `components/site/site-nav.tsx` (`GUIDE_ROUTES`), `src/app/llms.txt/`.
4. Tegishli sahifalardan ichki link (related/reading ro'yxatlari).
5. Mavjud sahifa bilan bir xil kalit so'zga raqobat qilmasligini tekshiring.

---

## 7. Nima qilingan (qisqa tarix)

PR'lar #1–#102 `main`da. Asosiy bosqichlar:

- **Dizayn:** butun sayt, kabinet va admin panel yangi v5 dizaynda (kanvas bilan solishtirilib
  tuzatilgan). Odam rasmlari olib tashlangan.
- **Admin panel:** kalitlar admin'dan boshqariladi, byudjet/limitlar, kill-switch, 2FA, rollar,
  audit log, CMS, chegirmalar, Revenue/Product/Analytics dashboardlari, haftalik hisobot.
- **To'lov:** Polar'ga ko'chirilgan, yangi narxlar (Week/Pro/90-Day), webhook, refund/renewal.
- **Email:** Resend tasdiqlangan, brendli shablon, welcome offer, win-back, countdown banner.
- **SEO kontent:** 88 rol (resume + cover letter), resume-templates, resume-format, how-to-write,
  resume-length, action verbs, keywords, summary examples, skills, references, follow-up email,
  resignation letter, cover letter situations (`/cover-letter/[slug]`), ATS vendorlar,
  raqobatchi taqqoslashlari, bepul vositalar, blog. Asossiz statistikalar olib tashlangan.
- **SEO texnik:** sitemap, JSON-LD, llms.txt, IndexNow, kannibalizatsiya tuzatildi.
- **Analitika:** o'z cookie'siz trafik tizimi, piksellar rozilik bilan.

---

## 8. Keyin nima qilish kerak

### Egasi (foydalanuvchi) qiladi — kodsiz

- [ ] `www.launch-cv.com` DNS: Vercel → Domains'da `www` qo'shish + Namecheap'da CNAME
      (`www` → `cname.vercel-dns.com`); hozir `www` ochilmaydi.
- [ ] Bing Webmaster Tools: GSC'dan import bilan tasdiqlash.
- [ ] GSC → Request Indexing: `/free-ats-check`, `/what-is-a-good-ats-score` va yangi sahifalar.
- [ ] Kataloglarga joylash (backlink). Tayyor matnlar va 4 haftalik jadval Claude Doc'da:
      "LaunchCV — Katalog va listing matnlari"
      (https://claude.ai/artifact/LnKhX3eTq2MHwMgswAJ9hT). 1-hafta: Crunchbase, AlternativeTo,
      SaaSHub, G2, Capterra, LinkedIn. Product Hunt — 4-hafta.
- [ ] Polar'da Week Pass va 90-Day Pass product'lari ulanganini tekshirish (Admin bosh sahifasida
      konfiguratsiya ogohlantirishi bo'lmasligi kerak).

### Agent/dasturchi qila oladi

- **GSC monitoring:** egasidan har 1–2 haftada Pages/Performance skrinshotlarini so'rab,
  indekslanish va pozitsiyalarni kuzatish; o'sayotgan so'rovlar uchun title/H1'ni moslash.
- **Kontent bo'shliqlari** (yangi guide sahifalar, bittadan PR): masalan resume objective
  examples, career change resume, entry-level / no-experience resume, resume gap explanation,
  interview questions by role. Avval mavjud sahifa bilan to'qnashmasligini tekshiring
  (`seo-query-map.md`).
- **Backlink uchun "link bait":** bepul vosita yoki ochiq ma'lumot sahifasi (masalan, ATS
  vendorlari bo'yicha qo'llanma kengaytmasi), mehmon maqolalar uchun matnlar.
- **Konversiya:** free ATS check → ro'yxatdan o'tish → to'lov funnelini Admin → Product
  ma'lumotlari bilan tahlil qilish va eng katta tushishni tuzatish.
- **Root `README.md` eskirgan** (SQLite va faqat OpenAI deydi) — yangilash kerak.

---

## 9. Tuzoqlar

- Seed kontentni o'chirmaydi — eski blog postlar prod DB'da qoladi, `content-fixes.json` kerak.
- `content-fixes` deploy paytida ishlaydi: post arxivlangach, yangi kod live bo'lguncha eski URL
  bir necha daqiqa 404 berishi mumkin.
- Checkout slug: `/checkout/professional` (`/checkout/pro` emas). JD alignment sahifasi:
  `/features/jd-alignment`.
- Email hero rasmlarini qayta yaratish: `PW_CHROMIUM=<chrome yo'li> node scripts/render-email-heroes.cjs`
  (shriftlar base64 bilan joylanadi). `.cjs` skriptlarda `require` uchun eslint-disable izohi bor.
- `fitTitle` uzun title'ga " | LaunchCV" suffiksini qo'shmaydi — title 60 belgidan oshmasin.
- Production'dagi `AppSetting` qiymatlari (masalan `planLimits`) koddagi default'dan ustun.

# 10.2 Analytics — GA4 + PostHog + ichki DB

## Konversiya funneli (asosiy hodisalar)

Butun funnel bitta joyda belgilangan: **`src/lib/analytics-events.ts`**.
Har bir hodisa GA4 **va** PostHog ikkalasiga ham yuboriladi.

| Event | Qachon | Qayerda (kod) | Yo‘nalish |
|-------|--------|---------------|-----------|
| `sign_up_started` | `/register` sahifa ochilganda | `app/register/page.tsx` (`useEffect`) | client |
| `sign_up_completed` | akkaunt yaratilganda | `app/register/page.tsx` (register muvaffaqiyatli) | client |
| `checkout_started` | Polar checkout ochilganda | `dashboard/settings/subscription/subscription-settings-client.tsx` | client |
| `purchase_completed` | to‘lov muvaffaqiyatli | `app/api/polar/webhook/route.ts` | **server** (Polar webhook) |
| `feature_cta_clicked` | har bir “Get started” / “Choose plan” tugmasi | ko‘p joyda (pastda) | client |

`feature_cta_clicked` parametrlari: `cta` (`get_started` yoki `choose_plan`), `plan`
(qaysi reja — plan-specific CTA’larda), `location` (sahifadagi joy).

### Kod arxitekturasi

- **`lib/analytics-events.ts`** — event nomlari va tiplar (yagona manba, izomorf).
- **`lib/analytics-client.ts`** — brauzerda `track()` → `gtag()` + `window.posthog.capture()`.
  `posthog-js` static import qilinmaydi (bundle o‘smasligi uchun); `window.posthog`
  `app/providers.tsx` da init’dan keyin ochib qo‘yiladi.
- **`lib/analytics-server.ts`** — server dispatch: GA4 **Measurement Protocol** +
  PostHog `/capture/` endpoint. Faqat `purchase_completed` (webhook) uchun.
- **`components/cta-link.tsx`** — `<CtaLink>` — `next/link` o‘rniga; bosilganda
  `feature_cta_clicked` yuboradi (server component sahifalarda ham ishlaydi).

### CTA tracking o‘rnatilgan joylar

- Landing hero — `components/landing-hero.tsx` (`get_started`, `landing_hero`)
- Landing nav (desktop + mobil) — `components/landing-nav.tsx`
- Dashboard header — `components/site-header.tsx`
- Feature sahifa shabloni (hero / footer / sticky) — `components/feature-page-template.tsx`
- Pricing kartalari — `app/pricing/page.tsx` (`choose_plan` + `plan`)
- Subscription “Choose <plan>” — `subscription-settings-client.tsx` (`choose_plan` + `plan`, keyin `checkout_started`)

## Env sozlamalari

```
# GA4
NEXT_PUBLIC_GA_MEASUREMENT_ID=""   # G-XXXX (bo‘sh bo‘lsa prod default, "false" = o‘chirish)
GA_API_SECRET=""                   # FAQAT server (purchase_completed) uchun — Measurement Protocol secret

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=""
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"
```

`GA_API_SECRET` bo‘sh bo‘lsa server-side GA4 yuborish jim o‘tkazib yuboriladi
(client hodisalar baribir ishlaydi). PostHog server capture uchun alohida secret
kerak emas — `NEXT_PUBLIC_POSTHOG_KEY` yetarli.

---

## GA4’da Key events (conversions) qilib belgilash — qadam-baqadam

> GA4’da event avtomatik “Key event” bo‘lmaydi — u kamida bir marta kelib turgach,
> UI’da qo‘lda belgilanadi.

1. Sayt prodga chiqqandan keyin funnel’ni bir marta bosib o‘ting (register ochish →
   akkaunt yaratish → checkout → CTA’lar). Yoki **DebugView** bilan tekshiring
   (quyida).
2. GA4 → **Admin** (chapdagi tishli belgisi).
3. **Property** ustunida → **Data display → Events**.
4. Ro‘yxatda quyidagilar paydo bo‘lishini kuting (24–48 soatgacha kechikishi mumkin;
   real-time uchun DebugView’dan foydalaning):
   - `sign_up_started`
   - `sign_up_completed`
   - `checkout_started`
   - `purchase_completed`
   - `feature_cta_clicked`
5. Har bir event qatorining o‘ng tomonidagi **“Mark as key event”** tugmasini yoqing
   (yoki **Admin → Key events → New key event** orqali aniq nomni yozib qo‘shing).
6. Endi bu hodisalar **Reports → Engagement → Conversions** va Explore funnel’larida
   “Key event” sifatida hisoblanadi.

### Tekshirish uchun (DebugView)

- Brauzer: Google Analytics Debugger extension yoqilgan holda saytga kiring,
  yoki URL’ga `?_dbg=1` (agar debug sozlangan bo‘lsa).
- GA4 → **Admin → DebugView** — hodisalar real vaqtda ko‘rinadi.
- Server-side `purchase_completed` uchun: test to‘lovni Polar **sandbox**’da qiling
  (`POLAR_SERVER=sandbox`) va webhook kelganini kuzating; DebugView’da MP hodisasi
  paydo bo‘ladi (client_id `srv.<userId>`).

### Authorized URLs (Google tag → Configure your domains)

“Key events = 0” muammosining tez-tez uchraydigan sababi — tag noto‘g‘ri domenda.

1. GA4 → **Admin → Data Streams** → web stream’ni oching.
2. **Configure tag settings → Show all → Configure your domains** (yoki
   “List of domains”).
3. Ruxsat etilgan domenlarni qo‘shing:
   - `launch-cv.com`
   - `www.launch-cv.com`
   - staging domeni (agar bor bo‘lsa)
4. Google Ads bilan bog‘lansangiz, **Google Ads → Tools → Conversions** da ham
   import qilingan GA4 key event’lar “Authorized”/domen mos kelishini tekshiring.

---

## PostHog’da funnel qurish

Hodisalar to‘g‘ri kelayotganini avval **Activity → Explore events** da tekshiring
(yuqoridagi 5 event nomi bo‘yicha filtr).

Funnel:

1. PostHog → **Product analytics → Funnels → New funnel**.
2. Qadamlarni tartib bilan qo‘shing:
   1. `sign_up_started`
   2. `sign_up_completed`
   3. `checkout_started`
   4. `purchase_completed`
3. (ixtiyoriy) 0-qadam sifatida `feature_cta_clicked` qo‘yib, marketing CTA →
   ro‘yxatdan o‘tish oqimini o‘lchang.
4. Conversion window: 7 kun (yoki biznesga mos).
5. **Breakdown**: `plan` bo‘yicha — qaysi reja ko‘proq konversiya beradi.
6. Saqlang: “Signup → Purchase funnel”.

> `purchase_completed` PostHog’ga serverdan `distinct_id = userId` bilan keladi va
> `identifyUser()` register/login’da chaqirilgani uchun funnel bitta odam bo‘yicha
> to‘liq bog‘lanadi.

## User identity (o‘rnatilgan)

Funnel qadamlari bitta foydalanuvchi bo‘yicha bog‘lanishi uchun `identifyUser()`
(`lib/analytics-client.ts`) chaqiriladi:

- **register muvaffaqiyatli** — `app/register/page.tsx` (`identifyUser(userId)`)
- **login muvaffaqiyatli** — `components/login-form.tsx` (login route endi `userId` qaytaradi)
- **logout** — `components/site-header.tsx` → `resetUser()` (PostHog `reset()` + GA4 `user_id=null`)

Bu `posthog.identify(userId)` + GA4 `gtag('set', { user_id })` ni bajaradi, shunda
signup’gacha bo‘lgan anonim hodisalar identifikatsiyalangan foydalanuvchiga ulanadi.

## GA4 session stitching (purchase, o‘rnatilgan)

Webhook’dagi `purchase_completed` asl brauzer sessiyasiga ulanadi:

1. Checkout paytida client `_ga` cookie’dan GA4 `client_id`ni o‘qiydi
   (`getGaClientId()`) va `/api/polar/checkout`’ga yuboradi.
2. Checkout route uni Polar `metadata.ga_client_id`ga yozadi.
3. Webhook `metadata.ga_client_id`ni o‘qib, GA4 Measurement Protocol’ga haqiqiy
   `client_id` + `user_id` bilan yuboradi (`lib/analytics-server.ts`).

`ga_client_id` bo‘lmasa — sintetik `srv.<userId>` ishlatiladi (conversion baribir yoziladi,
faqat pre-purchase sessiyaga ulanmaydi).

## Ichki hodisalar (`AnalyticsEvent`)

Serverda `trackEvent()` (`lib/analytics.ts`) — Postgres/Prisma’ga yozadi: `signup`,
`checkout_started`, `pay_success` va h.k. Bu GA4/PostHog’dan mustaqil, BI/Metabase
uchun. Yangi konversiya funneli ustidan qo‘shimcha; uni almashtirmaydi.

## QA

`docs/12-qa-load-beta.md` va `npm run test:e2e`.

# 10.2 Analytics — GA4 + PostHog + Mixpanel + ichki DB

## Konversiya funneli (asosiy hodisalar)

Butun funnel bitta joyda belgilangan: **`src/lib/analytics-events.ts`**.
Har bir hodisa GA4, PostHog **va** Mixpanel — uchalasiga ham yuboriladi. Nomlar GA4
tavsiya etilgan event nomlariga moslangan (`purchase`, `sign_up_*`), shunda GA4
ning tayyor monetization/konversiya hisobotlari ishlaydi.

| Event | Qachon | Qayerda (kod) | Yo‘nalish |
|-------|--------|---------------|-----------|
| `sign_up_start` | `/register` sahifa ochilganda | `app/register/page.tsx` (`useEffect`) | client |
| `sign_up_complete` | akkaunt yaratilganda | `app/register/page.tsx` (register muvaffaqiyatli) | client |
| `plan_selected` | reja tanlanganda | `pricing/page.tsx` kartalari + `subscription-settings-client.tsx` | client |
| `checkout_start` | Polar checkout ochilganda | `dashboard/settings/subscription/subscription-settings-client.tsx` | client |
| `purchase` | to‘lov muvaffaqiyatli (`value` + `currency` bilan) | `app/api/polar/webhook/route.ts` | **server** (Polar webhook) |
| `cta_click` | har bir “Get started” / “Choose plan” tugmasi | ko‘p joyda (pastda) | client |

- `plan_selected` parametrlari: `plan` (`starter`/`professional`/`elite`/`lifetime`), `location`.
- `checkout_start` parametrlari: `plan`, `provider`.
- `purchase` parametrlari: `plan`, `provider`, `value` (USD narx), `currency`,
  `order_id`/`subscription_id`, hamda kampaniya atributlari (pastda “UTM” bo‘limi).
- `cta_click` parametrlari: `cta` (`get_started` / `choose_plan` / …), `plan`
  (plan-specific CTA’larda), `location` (sahifadagi joy).

> **Key events (konversiyalar):** faqat **`sign_up_complete`** va **`purchase`**
> GA4’da Key event qilib belgilanadi (`KEY_EVENT_NAMES`,
> `src/lib/analytics-events.ts`). Qolganlari — funnel qadamlari, konversiya emas.

### Kod arxitekturasi

- **`lib/analytics-events.ts`** — event nomlari, `KEY_EVENT_NAMES` va tiplar
  (yagona manba, izomorf).
- **`lib/analytics-client.ts`** — brauzerda `track()` → `gtag()` +
  `window.posthog.capture()` + `window.mixpanel.track()`. Har bir hodisaga
  birinchi-teginish (first-touch) UTM atributlari avtomatik qo‘shiladi.
  `identifyUser(userId)` — register/login’dan keyin funnel’ni bitta odam
  bo‘yicha (server `purchase` bilan) bog‘laydi (PostHog `identify()` +
  Mixpanel `identify()`/`people.set()` + GA4 `user_id`). `posthog-js` va
  `mixpanel-browser` static import qilinmaydi (bundle o‘smasligi uchun);
  `window.posthog` / `window.mixpanel` `app/providers.tsx` da init’dan keyin
  ochib qo‘yiladi.
- **`lib/analytics-server.ts`** — server dispatch: GA4 **Measurement Protocol** +
  PostHog `/capture/` endpoint + Mixpanel `/track` endpoint. `purchase`
  (webhook) uchun. `value` berilmasa reja narxidan (`PLAN_PRICE_USD`) olinadi;
  UTM atributlari GA4 traffic-source (`source`/`medium`/`campaign`) va
  PostHog/Mixpanel xususiyatlariga o‘tkaziladi.
- **`lib/utm.ts`** — kampaniya atributsiyasi (UTM + `gclid`/`fbclid`/`msclkid`).
  Birinchi-teginish `lc_attribution` cookie’siga yoziladi (90 kun).
- **`components/attribution-tracker.tsx`** — `<AttributionTracker>` (layout’da) —
  saytga birinchi kirishda UTM’ni cookie’ga yozadi.
- **`components/cta-link.tsx`** — `<CtaLink>` — `next/link` o‘rniga; bosilganda
  `cta_click` (va pricing kartalarida `selectsPlan` bilan `plan_selected`) yuboradi.

### CTA tracking o‘rnatilgan joylar

- Landing hero — `components/landing-hero.tsx` (`free_ats_check`, `landing_hero`)
- Landing nav (desktop + mobil) — `components/landing-nav.tsx`
- Dashboard header — `components/site-header.tsx`
- Feature sahifa shabloni (hero / footer / sticky) — `components/feature-page-template.tsx`
- Pricing kartalari — `app/pricing/page.tsx` (`choose_plan` + `plan` + `plan_selected`)
- Subscription “Choose <plan>” — `subscription-settings-client.tsx`
  (`choose_plan` + `plan_selected`, keyin `checkout_start`)
- Paywall / limit CTA’lari (yuqori intent — checkout’ga olib boradi):
  - AI limit banneri — `components/ai-usage-banner.tsx` (`choose_plan`)
  - Role-fit / JD / Packet “Upgrade to Pro” — `resume/[id]/{fit,jd,packet}/ui.tsx` (`upgrade`)
  - Dashboard “Choose plan” (reja yo‘q holatda) — `app/dashboard/page.tsx` (`choose_plan`)

## Env sozlamalari

```
# GA4
NEXT_PUBLIC_GA_MEASUREMENT_ID=""   # G-XXXX (bo‘sh bo‘lsa prod default, "false" = o‘chirish)
GA_API_SECRET=""                   # FAQAT server (purchase) uchun — Measurement Protocol secret

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=""
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"

# Mixpanel
NEXT_PUBLIC_MIXPANEL_TOKEN=""
# NEXT_PUBLIC_MIXPANEL_HOST="https://api-eu.mixpanel.com"   # ixtiyoriy, EU-residency loyihalar uchun
```

`GA_API_SECRET` bo‘sh bo‘lsa server-side GA4 yuborish jim o‘tkazib yuboriladi
(client hodisalar baribir ishlaydi). PostHog va Mixpanel server capture uchun
alohida secret kerak emas — mos public token/key (`NEXT_PUBLIC_POSTHOG_KEY` /
`NEXT_PUBLIC_MIXPANEL_TOKEN`) yetarli, chunki ularning `/capture/` va `/track`
ingestion endpointlari public token bilan ishlaydi. UTM uchun qo‘shimcha env
kerak emas (cookie asosida ishlaydi).

---

## UTM / kampaniya atributsiyasi

Maqsad: reklama trafigini to‘g‘ri manbaga bog‘lash — hatto konversiya bir necha
kun keyin bo‘lsa ham.

Oqim (first-touch):

1. Foydalanuvchi `?utm_source=…&utm_medium=…&utm_campaign=…` (yoki `gclid` va h.k.)
   bilan kiradi → `<AttributionTracker>` bularni **`lc_attribution`** cookie’siga
   bir marta yozadi (birinchi teginish g‘olib, 90 kun).
2. Har bir client hodisa (`sign_up_start` … `cta_click`) shu atributlar bilan
   yuboriladi. GA4 o‘zi sessiya source/medium’ini, PostHog esa `$initial_utm_*`ni
   avtomatik yozadi — bu cookie ularni funnel bo‘ylab izchil ushlab turadi.
3. **Checkout** (`/api/polar/checkout`) cookie’dan atributlarni o‘qib, Polar
   `metadata`’siga qo‘shadi.
4. **Webhook** (`/api/polar/webhook`) `metadata`’dan atributlarni oladi va
   server `purchase` hodisasiga qo‘shadi: GA4 MP’da `source`/`medium`/`campaign`,
   PostHog’da `utm_*`. Shu tariqa **server-side konversiya** ham to‘g‘ri kampaniyaga
   yoziladi (webhookda brauzer sessiyasi yo‘q bo‘lsa ham).

> PII yo‘q: faqat kampaniya metama’lumotlari (UTM tegi, click id). Email/ism
> hech qachon event parametrlariga qo‘shilmaydi.

Test: `/register?utm_source=google&utm_medium=cpc&utm_campaign=test` bilan kiring,
DevTools → Application → Cookies’da `lc_attribution` paydo bo‘lishini,
PostHog/GA4 DebugView’da event’larda `utm_*` borligini tekshiring.

---

## GA4’da Key events (conversions) qilib belgilash — qadam-baqadam

> GA4’da event avtomatik “Key event” bo‘lmaydi — u kamida bir marta kelib turgach,
> UI’da qo‘lda belgilanadi. Bizda **ikkita** konversiya bor.

1. Sayt prodga chiqqandan keyin funnel’ni bir marta bosib o‘ting (register ochish →
   akkaunt yaratish → plan tanlash → checkout → CTA’lar). Yoki **DebugView** bilan
   tekshiring (quyida).
2. GA4 → **Admin** (chapdagi tishli belgisi).
3. **Property** ustunida → **Data display → Events**.
4. Ro‘yxatda quyidagilar paydo bo‘lishini kuting (24–48 soatgacha kechikishi mumkin;
   real-time uchun DebugView’dan foydalaning):
   - `sign_up_start`
   - `sign_up_complete`
   - `plan_selected`
   - `checkout_start`
   - `purchase`
   - `cta_click`
5. **Faqat** quyidagi ikkitasini Key event qiling — har bir qatorning o‘ng
   tomonidagi **“Mark as key event”** tugmasini yoqing (yoki
   **Admin → Key events → New key event** orqali aniq nomni yozib qo‘shing):
   - ✅ `sign_up_complete`
   - ✅ `purchase`
6. `purchase` uchun `value` + `currency` kelayotganini tasdiqlang — monetization
   hisobotlari shunda ishlaydi.
7. Endi bu ikki hodisa **Reports → Engagement → Conversions** va Explore
   funnel’larida “Key event” sifatida hisoblanadi.

### Tekshirish uchun (DebugView)

- Brauzer: Google Analytics Debugger extension yoqilgan holda saytga kiring.
- GA4 → **Admin → DebugView** — hodisalar real vaqtda ko‘rinadi.
- Server-side `purchase` uchun: test to‘lovni Polar **sandbox**’da qiling
  (`POLAR_SERVER=sandbox`) va webhook kelganini kuzating; DebugView’da MP hodisasi
  paydo bo‘ladi (client_id `srv.<userId>`, `value`/`currency` bilan).

### Authorized URLs (Google tag → Configure your domains)

“Key events = 0” muammosining tez-tez uchraydigan sababi — tag noto‘g‘ri domenda.

1. GA4 → **Admin → Data Streams** → web stream’ni oching.
2. **Configure tag settings → Show all → Configure your domains**.
3. Ruxsat etilgan domenlarni qo‘shing: `launch-cv.com`, `www.launch-cv.com`,
   staging domeni (agar bor bo‘lsa).
4. Google Ads bilan bog‘lansangiz, import qilingan GA4 key event’lar domeni
   mos kelishini tekshiring.

---

## PostHog’da funnel qurish

Hodisalar to‘g‘ri kelayotganini avval **Activity → Explore events** da tekshiring
(yuqoridagi 6 event nomi bo‘yicha filtr).

### 1) Signup funnel

1. PostHog → **Product analytics → Funnels → New funnel**.
2. Qadamlar:
   1. `sign_up_start`
   2. `sign_up_complete`
3. (ixtiyoriy) 0-qadam sifatida `cta_click` qo‘yib, marketing CTA → ro‘yxatdan
   o‘tish oqimini o‘lchang.
4. Conversion window: 1 kun. **Breakdown**: `utm_source` yoki `utm_campaign`.
5. Saqlang: **“Signup funnel”**.

### 2) Purchase funnel

1. **Funnels → New funnel**.
2. Qadamlar:
   1. `sign_up_complete`
   2. `plan_selected`
   3. `checkout_start`
   4. `purchase`
3. Conversion window: 7 kun (yoki biznesga mos). **Breakdown**: `plan` — qaysi
   reja ko‘proq konversiya beradi; yoki `utm_campaign` — qaysi kampaniya to‘laydi.
4. Saqlang: **“Purchase funnel”**.

> Muhim: `purchase` PostHog’ga serverdan `distinct_id = userId` bilan keladi.
> Brauzerda register/login’dan keyin `identifyUser(userId)` chaqirilgani uchun
> funnel bitta odam bo‘yicha to‘liq bog‘lanadi (client qadamlar → server `purchase`).

---

## Mixpanel’da funnel qurish

Hodisalar to‘g‘ri kelayotganini avval **Events** ko‘rinishida tekshiring
(yuqoridagi 6 event nomi bo‘yicha filtr; real-vaqtda ko‘rish uchun **Events →
Live View**).

### 1) Signup funnel

1. Mixpanel → **Reports → Funnels → Create new funnel**.
2. Qadamlar:
   1. `sign_up_start`
   2. `sign_up_complete`
3. (ixtiyoriy) 0-qadam sifatida `cta_click` qo‘yib, marketing CTA → ro‘yxatdan
   o‘tish oqimini o‘lchang.
4. Conversion window: 1 kun. **Breakdown**: `utm_source` yoki `utm_campaign`.
5. Saqlang: **“Signup funnel”**.

### 2) Purchase funnel

1. **Funnels → Create new funnel**.
2. Qadamlar:
   1. `sign_up_complete`
   2. `plan_selected`
   3. `checkout_start`
   4. `purchase`
3. Conversion window: 7 kun (yoki biznesga mos). **Breakdown**: `plan` — qaysi
   reja ko‘proq konversiya beradi; yoki `utm_campaign` — qaysi kampaniya to‘laydi.
4. Saqlang: **“Purchase funnel”**.

> Muhim: `purchase` Mixpanel’ga serverdan `distinct_id = userId` bilan keladi
> (`$insert_id` bilan — Polar webhook qayta yetkazsa ham ikki marta sanalmaydi).
> Brauzerda register/login’dan keyin `identifyUser(userId)` chaqirilgani uchun
> funnel bitta odam bo‘yicha to‘liq bog‘lanadi (client qadamlar → server `purchase`).

## User identity (o‘rnatilgan)

Funnel qadamlari bitta foydalanuvchi bo‘yicha bog‘lanishi uchun `identifyUser()`
(`lib/analytics-client.ts`) chaqiriladi:

- **register muvaffaqiyatli** — `app/register/page.tsx` (`identifyUser(userId)`)
- **login muvaffaqiyatli** — `components/login-form.tsx` (login route endi `userId` qaytaradi)
- **logout** — `components/site-header.tsx` → `resetUser()` (PostHog `reset()` +
  Mixpanel `reset()` + GA4 `user_id=null`)

Bu `posthog.identify(userId)` + `mixpanel.identify(userId)`/`people.set(traits)` +
GA4 `gtag('set', { user_id })` ni bajaradi, shunda signup’gacha bo‘lgan anonim
hodisalar identifikatsiyalangan foydalanuvchiga ulanadi.

## GA4 session stitching (purchase, o‘rnatilgan)

Webhook’dagi `purchase` asl brauzer sessiyasiga ulanadi:

1. Checkout paytida client `_ga` cookie’dan GA4 `client_id`ni o‘qiydi
   (`getGaClientId()`) va `/api/polar/checkout`’ga yuboradi.
2. Checkout route uni Polar `metadata.ga_client_id`ga yozadi.
3. Webhook `metadata.ga_client_id`ni o‘qib, GA4 Measurement Protocol’ga haqiqiy
   `client_id` + `user_id` bilan yuboradi (`lib/analytics-server.ts`).

`ga_client_id` bo‘lmasa — sintetik `srv.<userId>` ishlatiladi (conversion baribir yoziladi,
faqat pre-purchase sessiyaga ulanmaydi).

## Purchase — qiymat va idempotency

- **Pul qiymati**: webhook Polar `amount`/`total_amount` (sentlarda) ni major
  birlikka aylantirib `value` + `currency` sifatida yuboradi, hamda GA4
  `transaction_id` (order/subscription id) — GA4 revenue hisobotlari uchun. Polar
  summasi bo‘lmasa reja narxi (`PLAN_PRICE_USD`) zaxira sifatida ishlatiladi.
- **Idempotency** (Polar webhook’ni qayta yuborishi mumkin):
  - Subscription: `purchase` faqat `active`ga **birinchi o‘tishda** otiladi
    (oldingi status `active` bo‘lmasa) — qayta yetkazish ikki marta sanamaydi.
  - Order (bir martalik): agar order allaqachon yozilgan bo‘lsa, o‘tkazib yuboriladi.
  - Qo‘shimcha: GA4 `transaction_id` orqali GA tomonda ham dedup bo‘ladi.
  - Ichki `pay_success` (DB) event ham xuddi shu shart bilan gate qilinadi —
    endi `created`+`active` yoki qayta yetkazishda ikki marta yozilmaydi.

## E2E test

`e2e/analytics.spec.ts` — `sign_up_start` va `cta_click` (reja bilan)
event’lari GA4 (`dataLayer`), PostHog va Mixpanel’ga yetishini tekshiradi. Ishga
tushirish: `npm run test:e2e` (production `next start`ga qarshi ishlaydi).

## Ichki hodisalar (`AnalyticsEvent`)

Serverda `trackEvent()` (`lib/analytics.ts`) — Postgres/Prisma’ga yozadi: `signup`,
`checkout_started`, `pay_success` va h.k. Bu GA4/PostHog/Mixpanel’dan mustaqil,
BI/Metabase uchun. Yangi konversiya funneli ustidan qo‘shimcha; uni almashtirmaydi.

## Ichki / jamoa trafigini tozalash (internal traffic)

Analytics’ni jamoa va preview trafigidan toza ushlab turish uchun ikki qatlam bor:
**(1) kodda yuklanishni cheklash** va **(2) GA4/PostHog/Mixpanel UI’da filtr**.

### 1-qatlam — kod (avtomatik, allaqachon o‘rnatilgan)

`src/lib/analytics-enabled.ts` yagona qaror manbai. GA4 (`components/google-analytics.tsx`),
PostHog va Mixpanel (ikkalasi ham `app/providers.tsx`) faqat quyidagi hollarda yuklanadi:

- **Faqat production marketing sayti.** `NEXT_PUBLIC_VERCEL_ENV === "production"`
  bo‘lganda (Vercel avtomatik beradi). Preview deploy (`preview`), local dev, va
  `*.vercel.app` hostlar — yuklanmaydi. Bu “vercel.com preview referral” shovqinini
  ildizidan kesadi.
- **App sahifalarida emas.** `/admin-panel` va `/dashboard` (va ular ostidagi hamma
  narsa) — hech qachon yuklanmaydi. SPA navigatsiyada ham: bu sahifalarga o‘tilganda
  GA `ga-disable-<ID>` bilan, PostHog `opt_out_capturing()` bilan, Mixpanel
  `opt_out_tracking()` bilan to‘xtaydi.

### Internal flag (jamoa a’zolari)

Jamoa a’zosi **production marketing saytini** ko‘rsa ham, uni `internal` deb belgilaymiz:

- **Avtomatik:** admin/staff login qilganda (`api/auth/login`) `lcv_internal=1` cookie
  o‘rnatiladi (non-httpOnly, 180 kun). Shu brauzer marketing saytga kirsa — internal.
- **Qo‘lda:** istalgan qurilmada `?lcv_internal=1` bilan sahifa oching (localStorage’ga
  saqlanadi). O‘chirish: `?lcv_internal=0`.

Flag borligida:
- GA4 → har bir hit `traffic_type: 'internal'` bilan ketadi.
- PostHog → har bir eventda `is_internal: true` super-property bo‘ladi.
- Mixpanel → har bir eventda `is_internal: true` super-property bo‘ladi (PostHog
  bilan bir xil konventsiya).

### 2-qatlam — GA4 UI (bir marta sozlanadi)

1. **Internal traffic (debug flag) filtri.** GA4 → **Admin → Data Streams** → web
   stream → **Configure tag settings → Show all → Define internal traffic**.
   - Yangi qoida: `traffic_type` **equals** `internal` (kod aynan shuni yuboradi).
   - So‘ng **Admin → Data settings → Data filters** → “Internal Traffic” filtrini
     **Testing** dan **Active** ga o‘tkazing (Exclude).
2. **IP bo‘yicha (ixtiyoriy, qo‘shimcha).** O‘sha “Define internal traffic” oynasida
   ofis/VPN IP’laringizni qo‘shing (IP address → equals/CIDR). Bu login qilmagan
   jamoa trafigini ham ushlaydi.
3. **Vercel preview domenlarini exclude qilish.** Kod preview’da GA’ni umuman
   yuklamaydi, lekin qo‘shimcha himoya uchun **Admin → Data filters** da yoki
   referral exclusion’da `vercel.app` va `vercel.com` ni qo‘shing
   (**Admin → Data Streams → Configure tag settings → List unwanted referrals** →
   `vercel.app`, `vercel.com`).

### 2-qatlam — PostHog UI (bir marta sozlanadi)

1. PostHog → **Settings → Project → Filter out internal and test users**.
2. Test-account qoidasini qo‘shing (biror biri yetadi, ikkalasi tavsiya etiladi):
   - `is_internal` **= `true`** — yuqoridagi super-property (login qilgan staff +
     `?lcv_internal=1` bilan belgilangan brauzerlar).
   - `email` **contains** `@launch-cv.com` — identifikatsiya qilingan staff uchun
     (`posthog.identify` email bilan chaqirilganda ishlaydi).
3. Insight/Dashboard/Funnel’larda **“Filter out internal and test users”** ni yoqing
   (odatda default yoqilgan bo‘ladi). Shundan so‘ng jamoa trafigi hisob-kitobdan chiqadi.

### 2-qatlam — Mixpanel UI (bir marta sozlanadi)

1. Mixpanel → **Data Management → Filter and Blocking Rules** (yoki loyihaga qarab
   **Settings → Data Governance**).
2. **Property filter** qo‘shing: `is_internal` **= `true`** — yuqoridagi super-property
   (login qilgan staff + `?lcv_internal=1` bilan belgilangan brauzerlar). Filter’ni
   yangi hodisalarni **drop** qilishga emas, balki reportlarda **filter/exclude**
   qilishga sozlang — kelajakda internal trafikni alohida ko‘rish kerak bo‘lsa,
   xom ma’lumot saqlanib qoladi.
3. Alohida **Cohort** yarating (`is_internal = true`) va uni Insights/Funnels’da
   “Exclude” sifatida qo‘llang.

> Eslatma: kod qatlami preview va app trafigini butunlay **yubormaydi**, UI filtri esa
> production marketing saytida yurgan jamoa a’zolarini hisobdan **chiqaradi**. Ikkalasi
> birgalikda analytics’ni faqat haqiqiy foydalanuvchi trafigida ushlab turadi.

## QA

`docs/12-qa-load-beta.md` va `npm run test:e2e`.

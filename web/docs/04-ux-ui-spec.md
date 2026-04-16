# 4.x UX/UI dizayn spetsifikatsiyasi (asos)

Kod allaqachon dark UI — bu yerda **rasmiy IA** va keyingi polish.

## 4.1 Information architecture (sitemap)

```
/                    marketing
/login, /register
/dashboard
/dashboard/settings   akkaunt, eksport, obuna
/resume/new
/resume/[id]/edit     + preview
/resume/[id]/jd | fit | evidence | packet | snapshots
/legal/terms | /legal/privacy
/auth/forgot-password | /auth/reset-password | /auth/verify-email | /auth/resend-verify
```

## 4.2 Wireframe eslatmalari

- Onboarding: ro‘yxat → birinchi resume → qisqa tooltips.
- Editor: chap forma / o‘ng preview (lg+).
- AI sahifalar: disclaimer + strukturalangan natija (JSON → kartalar — roadmap).

## 4.3 Dizayn tizimi

- Rang: zinc-950 fon, emerald aksent (hozirgi).
- Tipografiya: Geist; ierarxiya: `text-2xl` sarlavha, `text-sm` yordamchi.
- Komponentlar: tugma = `rounded-md`, kartochka = `rounded-xl border border-zinc-800`.

## 4.4 Mobile

- MVP: desktop-first; mobil: preview pastga, toolbar wrap.

## 4.5 Holatlar

- Empty: resume yo‘q, snapshot yo‘q.
- Loading: AI tugmalari `disabled + text`.
- Error: qizil `text-sm`, qayta urinish.

## 4.6 Explainability

- AI tavsiyasi yonida “nimaga?” — JD gap map va role-fit uchun alohida UI (keyingi sprint).

---

**Chiqish:** Figma yoki FigJam da 1 ta user flow (signup → export PDF) tasdiqlangan bo‘lsin.

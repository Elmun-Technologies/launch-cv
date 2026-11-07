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

## Joriy / bloklangan

- PR #77, #78, #79, #80 — hammasi `main`ga birlashtirilgan.
- Admin config/security agent (worktree `agent-ab01390c24dab1377`, branch
  `worktree-agent-ab01390c24dab1377`) hali ishlayapti: IP allow-list, 2FA
  recovery codes, Origin check, maintenance banner. Tugagach tekshirib
  birlashtiriladi.
- GSC tahlili qilindi: texnik muammo yo'q (robots.txt to'g'ri, 311 sahifa
  sitemap orqali topilgan, 3.82K crawl so'rovi/90 kun). Past ko'rsatkichlar
  sababi — yangi kontent + hali backlink yo'qligi.
- Foydalanuvchiga berilgan: Request Indexing ro'yxati (3 kunga bo'lingan,
  30 URL) va backlink outreach materiallari (katalog tavsiflari, karyera
  markazi emaili, jurnalist pitch shabloni) — scratchpad'da, fayl sifatida
  yuborilgan.
- **Tekshirish kerak:** Vercel loyihasida Settings → Git → Production
  Branch `main`ga o'rnatilganini tasdiqlang — bir PR preview izohida
  bexato ravishda `launch-cv.com` (ishlab chiqarish manzili) ko'rsatildi.
- Foydalanuvchidan GSC'dagi aniq 404 URL manzili kutilmoqda (Pages →
  "Not found (404)" qatorini bosib ko'rish kerak) — topilgach tuzatiladi.

## Limitni tejash

- Og'ir subagent/workflow kerak bo'lmasa chaqirmang, javoblar qisqa bo'lsin.
- "Cloud memory" vositalari (claude-mem va shunga o'xshash) bu muhitda ishlamaydi —
  har yangi chat = yangi vaqtinchalik konteyner, faqat git'ga commit qilingan narsa
  saqlanadi. Shu HOLAT.md — aynan shu uchun.

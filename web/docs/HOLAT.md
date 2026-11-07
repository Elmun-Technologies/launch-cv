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

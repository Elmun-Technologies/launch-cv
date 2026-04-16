# SohaCV — mahsulot va operatsiya hujjatlari

| Fayl | Mazmun |
|------|--------|
| [00-pre-kickoff](./00-pre-kickoff.md) | 0.x — nom, domen, KPI, budjet, jamoa, texnik qarorlar |
| [01-discovery](./01-discovery.md) | 1.x — segmentlar, suhbatlar, raqobat, pozitsiya |
| [03-content-playbook](./03-content-playbook.md) | 3.x — vertikal rubrika, namunalar, region copy |
| [04-ux-ui-spec](./04-ux-ui-spec.md) | 4.x — IA, wireframe eslatmalari, dizayn tizimi |
| [05-infrastructure-queue-staging-ci](./05-infrastructure-queue-staging-ci.md) | 5.5–5.7 — navbat, staging, CI |
| [10-analytics](./10-analytics.md) | Posthog / ichki eventlar |
| [12-qa-load-beta](./12-qa-load-beta.md) | 12.x — QA, load, beta, launch |

**Tashqi:** agar git repozitoriyingiz ildizi `resume builder/` bo‘lsa, `.github/workflows/ci.yml` shu ildizda — ishchi papka `web/`. Agar repozitoriya faqat `web/` bo‘lsa, workflow faylini `web/.github/` ichiga ko‘chirib, `defaults.run.working-directory` qatorini olib tashlang.

**Lokal E2E:** bir marta `cd web && npx playwright install chromium`, keyin `npm run test:e2e`.

# SEO Query → Canonical Page Map

Goal: **one clearly-mapped canonical page per target query.** This prevents
keyword cannibalization between `/features/*`, `/use-cases/*`, `/compare/*`, and
`/blog/*`, so Google consolidates ranking signals on a single URL instead of
splitting them across competing pages.

Every marketing page already emits a self-referential canonical via
`buildMarketingMetadata` (`alternates.canonical`). This document records the
**intended** owner for each query cluster and the search intent it serves, so
future content does not accidentally re-target an owned query.

## How to use this map

- Before writing a new page or blog post, find its primary query below. If a
  canonical owner already exists, either target a different query or make the
  new page clearly secondary (support the owner with an internal link using the
  owner's keyword as anchor text — do **not** compete with it).
- Keep the owner page's `<h1>`, title, and FAQ questions aligned to its query.
- Support pages should link **up** to the owner with keyword-rich anchors.

## Query map

| Query cluster (intent) | Canonical owner | Intent | Supporting pages (link up to owner) |
| --- | --- | --- | --- |
| `ats score checker`, `check resume ats score`, `test resume ATS`, `resume ats test` (commercial) | `/features/ats-score` | Commercial / tool | `/free-ats-check` (the tool run), `/blog/how-to-check-ats-score-of-resume`, `/blog/what-is-an-ats-score`, `/compare/ats-resume-checkers` |
| `free ats check`, `free resume scan` (transactional) | `/free-ats-check` | Transactional / app entry | `/features/ats-score` |
| `ats score meaning`, `what is ats score`, `ats full form` (informational) | `/blog/what-is-an-ats-score` | Informational | `/features/ats-score` |
| `how to check ats score`, `resume ats score checker guide` (informational how-to) | `/blog/how-to-check-ats-score-of-resume` | Informational how-to | `/features/ats-score`, `/features/jd-alignment` |
| `what is an ats`, `how applicant tracking systems work` (informational) | `/blog/what-is-ats-and-how-does-it-work` | Informational | `/features/ats-score` |
| `match resume to job description`, `tailor resume to job description`, `keyword gap analysis`, `jd alignment` (commercial) | `/features/jd-alignment` | Commercial / tool | `/blog/how-to-tailor-your-resume-for-every-job`, `/use-cases/*` |
| `how to tailor resume for every job` (informational how-to) | `/blog/how-to-tailor-your-resume-for-every-job` | Informational how-to | `/features/jd-alignment` |
| `ai resume builder`, `build resume with ai` (commercial) | `/features/resume-builder` | Commercial / tool | `/blog/ai-resume-builder-complete-guide` |
| `ai resume builder guide` (informational) | `/blog/ai-resume-builder-complete-guide` | Informational | `/features/resume-builder` |
| `how to write ats-friendly resume` (informational how-to) | `/blog/how-to-write-an-ats-friendly-resume` | Informational how-to | `/features/ats-score`, `/features/resume-builder` |
| `cover letter generator` (commercial) | `/features/cover-letter` | Commercial / tool | `/blog/cover-letter-tips-that-actually-work` |
| `cover letter tips` (informational) | `/blog/cover-letter-tips-that-actually-work` | Informational | `/features/cover-letter` |
| `interview prep ai`, `prepare for interview with ai` (commercial) | `/features/interview-prep` | Commercial / tool | `/blog/how-to-prepare-for-a-job-interview-with-ai` |
| `voice to resume`, `voice input resume` (commercial) | `/features/voice-input` | Commercial / tool | `/blog/voice-to-resume` |
| `resume keywords for software engineers` (informational) | `/blog/resume-keywords-for-software-engineers` | Informational | `/features/jd-alignment`, `/use-cases/software-engineers` |
| `software engineer resume`, `developer resume` (commercial, persona) | `/use-cases/software-engineers` | Commercial / persona | `/features/resume-builder`, `/features/jd-alignment` |
| `product manager resume` (commercial, persona) | `/use-cases/product-managers` | Commercial / persona | `/features/jd-alignment` |
| `designer resume` (commercial, persona) | `/use-cases/designers` | Commercial / persona | `/features/resume-builder` |
| `best ats resume checker`, `ats resume checker comparison`, `launch cv alternative` (commercial, comparison) | `/compare/ats-resume-checkers` | Commercial / comparison | `/features/ats-score`, `/features/jd-alignment` |

## Cannibalization guardrails

- **`ats score checker` (commercial) vs. `what is an ats score` (informational):**
  The `/features/ats-score` page owns the commercial/tool query; the blog posts
  own the informational queries. Blog posts link to the feature page using the
  commercial anchor ("ATS score checker"), never the other way around for that
  term. Keep blog titles phrased as questions/how-to, not "ATS Score Checker."
- **`/features/ats-score` vs. `/free-ats-check`:** the feature page is the SEO
  landing page (indexable, keyword-rich); `/free-ats-check` is the app entry
  where the scan runs. Do not duplicate the feature page's long-form ATS-score
  content onto `/free-ats-check`.
- **`/compare/ats-resume-checkers`:** targets comparison/"best"/"alternative"
  intent only. It must not restate the `/features/ats-score` H1 or compete for
  the bare `ats score checker` query — it links up to it instead.

_Last reviewed: 2026-07-11._

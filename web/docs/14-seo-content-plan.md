# 14. SEO/GEO Content Plan — Resume / ATS / Job-Search (15 New Outlines)

Goal: capture **high-intent, long-tail** search + generative (GEO/AI-answer)
traffic in the resume, ATS, and job-search niche, and route it to the LaunchCV
features that solve each problem. Every outline below maps to at least one
product surface (`/features/*`, `/free-ats-check`, `/use-cases/*`).

This plan **extends** the existing 10 posts in `src/lib/blog-posts.ts` — it does
not duplicate them. New posts should be authored in the same `BlogPost` shape
(target keyword → `tags`, `title`/`seoTitle`, `seoDescription`, `sections`,
`faqs`) and seeded via `prisma/seed-cms.ts`.

---

## 14.1 Strategy overview

### Topic clusters (pillar → supporting posts)

| Pillar (existing) | New supporting posts (this plan) | Primary feature CTA |
|---|---|---|
| **ATS 101** — `what-is-ats-and-how-does-it-work`, `what-is-an-ats-score` | #5 ATS format, #12 why rejected, #13 beat keyword scanners | `/free-ats-check`, `/features/ats-score` |
| **Resume writing** — `how-to-write-an-ats-friendly-resume`, `ai-resume-builder-complete-guide` | #6 length, #7 format types, #8 quantify, #9 summary | `/features/resume-builder` |
| **Role keyword guides** — `resume-keywords-for-software-engineers` | #1 PM, #2 data analyst, #3 nurse, #4 marketing | `/features/jd-alignment`, `/use-cases/*` |
| **Tailoring / JD match** — `how-to-tailor-your-resume-for-every-job` | #12, #13 | `/features/jd-alignment` |
| **Situational** (new sub-cluster) | #10 employment gaps, #11 career change, #15 first job | `/features/resume-builder`, `/features/cover-letter` |
| **Cover letters** — `cover-letter-tips-that-actually-work` | #14 no experience | `/features/cover-letter` |

### Prioritization (impact × intent × feature fit)

Ship order is set by commercial intent and how directly the query implies a
LaunchCV action. **Tier 1** (weeks 1–3): #5, #12, #13, #1 — pure ATS-fix and
role-keyword intent that maps 1:1 to the ATS checker and JD Alignment. **Tier 2**
(weeks 4–7): #8, #9, #10, #7, #2 — resume-quality + situational fixes. **Tier 3**
(weeks 8–11): #6, #11, #3, #4, #14, #15 — broader/informational, feeds the
cluster and internal-link graph.

Cadence: ~2 posts/week. Each new post must add ≥2 internal links to existing
cluster posts and ≥1 feature CTA, and be added to the sibling posts as a
back-link (reciprocal) to build cluster authority.

### GEO / AI-answer optimization (applies to every outline)

- **Answer-first**: lead each H2 with a 40–60 word direct answer, then expand —
  this is what LLMs and featured snippets extract.
- **FAQ + HowTo schema**: emit `FAQPage` JSON-LD from the `faqs` array (blog
  template already supports `faqs`); add `HowTo` schema on step-based posts (#5,
  #13, #8).
- **Extractable structure**: definition sentences ("An ATS-friendly format
  is…"), numbered steps, comparison tables, and a bolded one-line takeaway per
  section. Cite concrete numbers/years (2026) for freshness signals.
- **Entity clarity**: name the tool ("LaunchCV's free ATS checker") once per
  post so generative engines attribute the recommendation.

### Author & metadata conventions

- `readingTime`: 7–10 min for guides, 5–6 for situational.
- `date`: publish date; refresh `updatedAt` yearly (titles carry "2026").
- `category`: reuse existing four — Resume Tips, Cover Letters, Interview Prep,
  Job Search. (No new categories.)
- Titles ≤ 60 chars, meta descriptions ≤ 155 chars (validated below).

---

## 14.2 The 15 outlines

> Legend — **TK** target keyword · **Intent** · **Title** (≤60) · **Meta**
> (≤155) · **H2/H3** · **FAQ** · **Links** (internal targets).

### Cluster A — Role keyword guides (map to JD Alignment + Resume Builder + Use-Cases)

#### 1. Resume keywords for product managers
- **Slug**: `resume-keywords-for-product-managers`
- **TK**: `resume keywords for product managers` · **Intent**: Commercial-investigational — PM applicant wants the exact terms ATS/recruiters scan for.
- **Title**: `Resume Keywords for Product Managers (2026)` (43)
- **Meta**: `The 2026 keyword list for product manager resumes — 60+ ATS terms for roadmap, discovery & metrics, plus where to place them.` (128)
- **Category**: Resume Tips
- **H2/H3**:
  - H2: Why PM resumes fail the keyword scan
  - H2: The 2026 product manager keyword list — H3: Discovery & strategy · H3: Execution & delivery · H3: Metrics & impact · H3: Tools (Jira, Amplitude, SQL)
  - H2: Hard vs. soft keywords (and the ratio that works)
  - H2: Where to place keywords (summary, experience, skills)
  - H2: How to mirror keywords from a real PM job description
  - H2: Check your match score before you apply
- **FAQ**: What keywords do PM recruiters search for? · How many keywords should a PM resume have? · Do keywords work if I have no PM title yet? · Should I list frameworks like RICE or Jobs-to-be-Done?
- **Links**: `/features/jd-alignment`, `/use-cases/product-managers`, `/free-ats-check`, blog: `resume-keywords-for-software-engineers`, `how-to-tailor-your-resume-for-every-job`.

#### 2. Resume keywords for data analysts
- **Slug**: `resume-keywords-for-data-analysts`
- **TK**: `resume keywords for data analysts` · **Intent**: Commercial-investigational.
- **Title**: `Resume Keywords for Data Analysts (2026)` (40)
- **Meta**: `SQL, Python, dashboards, stakeholder impact — the 2026 ATS keyword list for data analyst resumes and how to place them to pass.` (126)
- **Category**: Resume Tips
- **H2/H3**:
  - H2: What ATS looks for in a data analyst resume
  - H2: The keyword list — H3: Languages & tools (SQL, Python, R) · H3: BI & viz (Tableau, Power BI, Looker) · H3: Methods (A/B testing, forecasting, ETL) · H3: Business-impact verbs
  - H2: Turning "ran queries" into quantified, keyword-rich bullets
  - H2: Junior vs. senior analyst keyword weighting
  - H2: Match your resume to the JD in seconds
- **FAQ**: What technical skills should a data analyst resume list first? · Should I list Excel? · How do I show impact without exposing confidential numbers? · Do I need a portfolio link?
- **Links**: `/features/jd-alignment`, `/features/resume-builder`, `/free-ats-check`, blog: `resume-keywords-for-software-engineers`, `how-to-write-an-ats-friendly-resume`.

#### 3. Resume keywords for nurses (registered nurse)
- **Slug**: `resume-keywords-for-nurses`
- **TK**: `resume keywords for nurses` · **Intent**: Commercial-investigational — healthcare ATS (Taleo/iCIMS) is keyword-strict.
- **Title**: `Resume Keywords for Nurses (RN Guide, 2026)` (43)
- **Meta**: `Licenses, certs, EHR systems & specialties — the ATS keyword list every RN resume needs in 2026, with placement examples.` (121)
- **Category**: Resume Tips
- **H2/H3**:
  - H2: Why healthcare ATS is stricter (licenses & certs are hard filters)
  - H2: The RN keyword list — H3: Credentials (RN, BLS, ACLS, license #) · H3: Specialties (ICU, ER, Med-Surg) · H3: Systems (Epic, Cerner) · H3: Patient-care competencies
  - H2: How to format certifications so ATS reads them
  - H2: New-grad vs. experienced RN keyword strategy
  - H2: Scan your RN resume for missing must-haves
- **FAQ**: Where do I put my RN license number? · Which nursing certifications matter most to ATS? · How do I list clinical rotations as a new grad? · Should specialties go in a skills section?
- **Links**: `/features/ats-score`, `/features/resume-builder`, `/free-ats-check`, blog: `how-to-write-an-ats-friendly-resume`, `what-is-an-ats-score`.

#### 4. Resume keywords for marketing managers
- **Slug**: `resume-keywords-for-marketing-managers`
- **TK**: `resume keywords for marketing managers` · **Intent**: Commercial-investigational.
- **Title**: `Resume Keywords for Marketing Managers (2026)` (45)
- **Meta**: `Growth, funnel, CAC/ROAS, martech — the 2026 ATS keyword list for marketing manager resumes and where each term belongs.` (122)
- **Category**: Resume Tips
- **H2/H3**:
  - H2: How marketing resumes get filtered out
  - H2: The keyword list — H3: Channels (SEO, paid, lifecycle) · H3: Metrics (CAC, ROAS, MQL→SQL) · H3: Tools (HubSpot, GA4, Meta Ads) · H3: Leadership & budget verbs
  - H2: Quantifying campaign results without a data team
  - H2: Tailoring per role (brand vs. growth vs. product marketing)
  - H2: Check keyword match against the exact JD
- **FAQ**: What metrics should a marketing resume show? · How do I keyword-optimize without buzzword stuffing? · Should I list every martech tool I've touched? · Brand vs. growth marketing — different keywords?
- **Links**: `/features/jd-alignment`, `/features/resume-builder`, `/free-ats-check`, blog: `how-to-tailor-your-resume-for-every-job`.

### Cluster B — Format & structure (map to ATS Score + Resume Builder)

#### 5. ATS resume format 2026
- **Slug**: `ats-resume-format-2026`
- **TK**: `ats resume format 2026` · **Intent**: Informational→transactional — wants the exact layout that parses cleanly this year.
- **Title**: `ATS Resume Format 2026: The Layout That Passes` (46)
- **Meta**: `The exact ATS-safe resume format for 2026 — sections, fonts, margins, file type & what breaks parsing. Copy-paste structure inside.` (131)
- **Category**: Resume Tips
- **H2/H3** (HowTo schema):
  - H2: What "ATS format" actually means in 2026
  - H2: The parse-safe structure (top to bottom) — H3: Contact block · H3: Summary · H3: Experience (reverse-chron) · H3: Skills · H3: Education
  - H2: Formatting rules — H3: Fonts & sizes · H3: Margins & columns · H3: Bullets, tables, headers/footers · H3: Dates
  - H2: File type: PDF vs. DOCX in 2026
  - H2: What breaks parsing (icons, text boxes, graphics)
  - H2: Test your format free before applying
- **FAQ**: Is a two-column resume ATS-safe in 2026? · PDF or Word for ATS? · Do headers and footers break ATS? · What font is best for ATS?
- **Links**: `/free-ats-check`, `/features/ats-score`, `/features/resume-builder`, blog: `how-to-write-an-ats-friendly-resume`, `what-is-ats-and-how-does-it-work`.

#### 6. How long should a resume be
- **Slug**: `how-long-should-a-resume-be`
- **TK**: `how long should a resume be` · **Intent**: Informational — high-volume decision query.
- **Title**: `How Long Should a Resume Be in 2026?` (36)
- **Meta**: `One page or two? The 2026 rule for resume length by experience level — plus how to cut a resume down without losing keywords.` (125)
- **Category**: Resume Tips
- **H2/H3**:
  - H2: The short answer (by years of experience)
  - H2: When one page is right — H3: Students & new grads · H3: <10 years
  - H2: When two pages are fine — H3: Senior/IC depth · H3: Academic/federal CVs
  - H2: How to cut length without dropping ATS keywords
  - H2: Does length affect your ATS score?
- **FAQ**: Is a two-page resume unprofessional? · Does the ATS penalize long resumes? · How do I shorten a resume fast? · Should a new grad ever use two pages?
- **Links**: `/features/resume-builder`, `/free-ats-check`, blog: `how-to-write-an-ats-friendly-resume`, `what-is-an-ats-score`.

#### 7. Chronological vs functional vs hybrid resume
- **Slug**: `chronological-vs-functional-vs-hybrid-resume`
- **TK**: `chronological vs functional resume` · **Intent**: Informational-comparison — often career-changers/gaps.
- **Title**: `Chronological vs Functional vs Hybrid Resume` (45)
- **Meta**: `Which resume format wins in 2026 — chronological, functional, or hybrid? A side-by-side guide with ATS-safety notes and examples.` (128)
- **Category**: Resume Tips
- **H2/H3**:
  - H2: The three formats at a glance (comparison table)
  - H2: Chronological — H3: Best for · H3: ATS notes
  - H2: Functional — H3: Best for · H3: Why ATS struggles with it
  - H2: Hybrid/combination — H3: Best for · H3: How to build one
  - H2: Which to pick for gaps or a career change
  - H2: Build any format in LaunchCV
- **FAQ**: Is a functional resume ATS-friendly? · Which format is best for career changers? · What's a hybrid resume? · Do recruiters dislike functional resumes?
- **Links**: `/features/resume-builder`, `/free-ats-check`, blog: `how-to-write-an-ats-friendly-resume`, cross-link to #10 gaps & #11 career change (once live).

#### 8. How to quantify achievements on a resume
- **Slug**: `how-to-quantify-resume-achievements`
- **TK**: `how to quantify achievements on a resume` · **Intent**: Informational→transactional — wants a method + examples.
- **Title**: `How to Quantify Achievements on Your Resume` (43)
- **Meta**: `No metrics? Learn the formula for quantifying resume achievements — with before/after bullet examples for any role, even non-numeric jobs.` (137)
- **Category**: Resume Tips
- **H2/H3** (HowTo schema):
  - H2: Why numbers get you interviews
  - H2: The X-Y-Z bullet formula — H3: Action + metric + result
  - H2: Finding metrics when your job "had none" — H3: Time saved · H3: Scale/volume · H3: % improvement · H3: Money/retention
  - H2: 15 before/after bullet examples (by function)
  - H2: Let AI rewrite weak bullets into quantified ones
- **FAQ**: What if my job had no measurable results? · How many bullets should be quantified? · Can I estimate numbers I don't track? · Where do metrics go in a bullet?
- **Links**: `/features/resume-builder`, `/features/jd-alignment`, blog: `ai-resume-builder-complete-guide`, `how-to-write-an-ats-friendly-resume`.

#### 9. Professional summary examples
- **Slug**: `resume-professional-summary-examples`
- **TK**: `resume professional summary examples` · **Intent**: Transactional — wants copy-adaptable examples.
- **Title**: `Resume Summary Examples (+ How to Write One)` (44)
- **Meta**: `20 professional resume summary examples by role & level, plus a 3-line formula to write yours — keyword-rich and ATS-ready.` (122)
- **Category**: Resume Tips
- **H2/H3**:
  - H2: What a professional summary is (and isn't vs. an objective)
  - H2: The 3-line summary formula
  - H2: 20 examples — H3: Entry-level · H3: Mid-career · H3: Senior/leadership · H3: Career changer
  - H2: How to load your summary with the right keywords
  - H2: Generate a tailored summary automatically
- **FAQ**: Summary vs. objective — which do I use? · How long should a resume summary be? · Should a new grad have a summary? · Do I rewrite it per job?
- **Links**: `/features/resume-builder`, `/features/jd-alignment`, blog: `how-to-tailor-your-resume-for-every-job`, `ai-resume-builder-complete-guide`.

### Cluster C — Situational / high-intent problem queries (JD Alignment + ATS + Cover Letter)

#### 10. How to explain employment gaps
- **Slug**: `how-to-explain-employment-gaps-on-a-resume`
- **TK**: `how to explain employment gaps` · **Intent**: Informational-anxious — high engagement, strong CTA fit.
- **Title**: `How to Explain Employment Gaps on a Resume` (42)
- **Meta**: `Employment gap on your resume? Proven ways to explain gaps honestly — formatting, wording, and cover-letter lines that reassure recruiters.` (138)
- **Category**: Job Search
- **H2/H3**:
  - H2: Do employment gaps still matter in 2026?
  - H2: How to format a gap so it isn't a red flag — H3: Years-only dates · H3: Functional/hybrid option
  - H2: How to word the gap — H3: Caregiving · H3: Layoff · H3: Health · H3: Sabbatical/upskilling
  - H2: Addressing gaps in the cover letter
  - H2: Handling the gap question in the interview
- **FAQ**: Should I explain a gap on the resume or in the interview? · How big a gap needs explaining? · Do I list a gap year? · Does an ATS flag gaps?
- **Links**: `/features/cover-letter`, `/features/interview-prep`, `/features/resume-builder`, blog: `how-to-prepare-for-a-job-interview-with-ai`, cross-link #7 formats.

#### 11. How to put a career change on your resume
- **Slug**: `career-change-resume-guide`
- **TK**: `career change resume` · **Intent**: Commercial-investigational — needs repositioning help.
- **Title**: `Career Change Resume: How to Reposition Fast` (44)
- **Meta**: `Switching careers? Learn how to reframe transferable skills, pick the right format, and pass ATS with a targeted career-change resume.` (132)
- **Category**: Resume Tips
- **H2/H3**:
  - H2: The career-change resume mindset (sell transferable value)
  - H2: Best format for a pivot (hybrid, usually)
  - H2: Translating old experience into target-role keywords — H3: Skills mapping · H3: Rewriting bullets
  - H2: The summary that frames your pivot
  - H2: Cover letter: connecting the dots
  - H2: Match your rewritten resume to target JDs
- **FAQ**: Which resume format is best for a career change? · How do I show transferable skills? · Do I include unrelated jobs? · Should I explain the switch up top?
- **Links**: `/features/jd-alignment`, `/features/resume-builder`, `/features/cover-letter`, blog: `how-to-tailor-your-resume-for-every-job`, cross-link #7, #9.

#### 12. Why is my resume getting rejected
- **Slug**: `why-is-my-resume-getting-rejected`
- **TK**: `why is my resume getting rejected` · **Intent**: Problem-aware, high intent — direct path to ATS checker.
- **Title**: `Why Is My Resume Getting Rejected? (2026 Fixes)` (47)
- **Meta**: `Applying with no replies? The 9 real reasons resumes get auto-rejected by ATS in 2026 — and the exact fix for each. Check yours free.` (133)
- **Category**: Job Search
- **H2/H3**:
  - H2: How auto-rejection actually happens (ATS + recruiter screen)
  - H2: The 9 reasons — H3: Keyword mismatch · H3: Broken formatting/parse errors · H3: No metrics · H3: Wrong file type · H3: Missing must-have quals · H3: Generic (not tailored) · H3: Contact/parse of dates · H3: Overqualified/underqualified signals · H3: Applying too late
  - H2: The 10-minute rescue checklist
  - H2: Run a free ATS scan to see what's failing
- **FAQ**: Why do I get rejected instantly? · Does the ATS auto-reject resumes? · How do I know if my resume passed the ATS? · Is it my resume or the market?
- **Links**: `/free-ats-check`, `/features/ats-score`, `/features/jd-alignment`, blog: `how-to-check-ats-score-of-resume`, `what-is-ats-and-how-does-it-work`.

#### 13. How to beat ATS keyword scanners
- **Slug**: `how-to-beat-ats-keyword-scanners`
- **TK**: `how to beat ats keyword scanners` · **Intent**: Transactional — method + tool.
- **Title**: `How to Beat ATS Keyword Scanners (2026)` (39)
- **Meta**: `Get past the keyword filter without stuffing — how to match ATS scanners in 2026 using the JD, synonyms, and a match-score check.` (128)
- **Category**: Job Search
- **H2/H3** (HowTo schema):
  - H2: How keyword scanning works (exact + semantic match)
  - H2: The 5-step keyword match method — H3: Pull terms from the JD · H3: Prioritize must-haves · H3: Use exact phrase + acronym · H3: Place naturally · H3: Add synonyms/variants
  - H2: White-hat vs. black-hat tricks (white text = instant reject)
  - H2: How many keywords is enough (match-rate targets)
  - H2: Automate JD keyword matching with LaunchCV
- **FAQ**: Does white text fool an ATS? · What keyword match % should I aim for? · Should I copy the job description exactly? · Do acronyms and full terms both matter?
- **Links**: `/features/jd-alignment`, `/features/ats-score`, `/free-ats-check`, blog: `how-to-tailor-your-resume-for-every-job`, `what-is-an-ats-score`.

### Cluster D — Cover letter & entry-level (Cover Letter + Resume Builder + Voice Input)

#### 14. How to write a cover letter with no experience
- **Slug**: `cover-letter-with-no-experience`
- **TK**: `cover letter with no experience` · **Intent**: Transactional — students/career-starters.
- **Title**: `Cover Letter With No Experience (Template)` (41)
- **Meta**: `No work history? Write a cover letter that still wins interviews — a proven structure, wording, and a fill-in template for beginners.` (131)
- **Category**: Cover Letters
- **H2/H3**:
  - H2: What to say when you have no experience
  - H2: The 4-paragraph structure — H3: Hook · H3: Transferable proof (school, projects, volunteering) · H3: Fit for the role · H3: Close
  - H2: Fill-in-the-blank template
  - H2: Words that signal potential (without sounding desperate)
  - H2: Generate a tailored cover letter in minutes
- **FAQ**: Do I need a cover letter with no experience? · What do I put if I've never had a job? · How long should it be? · Should I mention I'm a student?
- **Links**: `/features/cover-letter`, `/features/resume-builder`, blog: `cover-letter-tips-that-actually-work`, cross-link #15.

#### 15. How to write a resume for your first job
- **Slug**: `resume-for-first-job-no-experience`
- **TK**: `resume for first job no experience` · **Intent**: Transactional — students/new grads, high volume.
- **Title**: `Resume for Your First Job (No Experience)` (40)
- **Meta**: `No experience? Build a first-job resume that passes ATS — what to include instead of work history, plus a fast voice-to-resume start.` (132)
- **Category**: Resume Tips
- **H2/H3**:
  - H2: What goes on a resume when you have no jobs yet
  - H2: Sections that replace work experience — H3: Education & coursework · H3: Projects · H3: Volunteering/clubs · H3: Skills
  - H2: Writing bullets from school & side projects
  - H2: Keeping it ATS-friendly and one page
  - H2: The fastest start: speak it, don't stare at a blank page
- **FAQ**: What do I put on a resume with no experience? · How long should a first resume be? · Do I need a summary or objective? · Can I list high school?
- **Links**: `/features/resume-builder`, `/features/voice-input`, `/free-ats-check`, blog: `voice-to-resume`, `how-to-write-an-ats-friendly-resume`.

---

## 14.3 Internal-linking map (new posts → targets)

| # | Slug | Feature CTA(s) | Blog cross-links |
|---|------|----------------|------------------|
| 1 | resume-keywords-for-product-managers | jd-alignment, use-cases/product-managers, free-ats-check | sw-eng keywords, tailor-resume |
| 2 | resume-keywords-for-data-analysts | jd-alignment, resume-builder, free-ats-check | sw-eng keywords, ats-friendly |
| 3 | resume-keywords-for-nurses | ats-score, resume-builder, free-ats-check | ats-friendly, what-is-ats-score |
| 4 | resume-keywords-for-marketing-managers | jd-alignment, resume-builder, free-ats-check | tailor-resume |
| 5 | ats-resume-format-2026 | free-ats-check, ats-score, resume-builder | ats-friendly, what-is-ats |
| 6 | how-long-should-a-resume-be | resume-builder, free-ats-check | ats-friendly, what-is-ats-score |
| 7 | chronological-vs-functional-vs-hybrid-resume | resume-builder, free-ats-check | ats-friendly, #10/#11 |
| 8 | how-to-quantify-resume-achievements | resume-builder, jd-alignment | ai-resume-builder, ats-friendly |
| 9 | resume-professional-summary-examples | resume-builder, jd-alignment | tailor-resume, ai-resume-builder |
| 10 | how-to-explain-employment-gaps-on-a-resume | cover-letter, interview-prep, resume-builder | interview-with-ai, #7 |
| 11 | career-change-resume-guide | jd-alignment, resume-builder, cover-letter | tailor-resume, #7/#9 |
| 12 | why-is-my-resume-getting-rejected | free-ats-check, ats-score, jd-alignment | check-ats-score, what-is-ats |
| 13 | how-to-beat-ats-keyword-scanners | jd-alignment, ats-score, free-ats-check | tailor-resume, what-is-ats-score |
| 14 | cover-letter-with-no-experience | cover-letter, resume-builder | cover-letter-tips, #15 |
| 15 | resume-for-first-job-no-experience | resume-builder, voice-input, free-ats-check | voice-to-resume, ats-friendly |

**Reciprocity rule:** when a post ships, add it as a back-link inside the
existing cluster posts it references (edit `sections`/related list in
`src/lib/blog-posts.ts` or the CMS) so link equity flows both ways.

## 14.4 Length validation (titles ≤ 60, metas ≤ 155)

All 15 titles fall in 36–47 chars; all meta descriptions in 121–138 chars —
both within the SERP limits above. Re-check after any copy edit before seeding.

## 14.5 Production checklist (per post)

- [ ] Author in `BlogPost` shape; set `tags` = target keyword + variants.
- [ ] Answer-first intro under each H2; one bold takeaway per section.
- [ ] Populate `faqs` (drives `FAQPage` JSON-LD); add `HowTo` for #5, #8, #13.
- [ ] ≥2 blog cross-links + ≥1 feature CTA; add reciprocal back-links.
- [ ] Seed via `prisma/seed-cms.ts`; verify `/blog` ISR + `feed.xml` pick it up.
- [ ] Confirm OG image renders (`blog/[slug]/opengraph-image.tsx`).

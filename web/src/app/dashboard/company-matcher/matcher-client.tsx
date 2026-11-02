"use client";

import Link from "next/link";
import { useState, useMemo, useCallback } from "react";
import { Search, ExternalLink, RotateCcw, Check, X, AlertTriangle, Plus, Building2, Target } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { COMPANIES, searchCompanies, type CompanyRequirement } from "@/lib/company-requirements";
import {
  ErrorNote,
  FilterChip,
  InitialTile,
  PageHeader,
  SearchField,
  SelectField,
  appBtnGhost,
  appBtnPrimary,
  appBtnSoft,
  fieldCls,
  focusCls,
  labelCls,
  sectionLabelCls,
  textareaCls,
} from "@/components/app/jobs/ui";

type Resume = { id: string; title: string; updatedAt: string };

type KeywordGap = {
  keyword: string;
  status: "found" | "missing" | "partial";
  suggestion: string;
};

type CultureFit = { aspect: string; score: number };

type BulletRewrite = {
  original: string;
  improved: string;
};

type MatchResult = {
  score: number;
  keywordGaps: KeywordGap[];
  cultureFit: CultureFit[];
  formatRecommendations: { label: string; done: boolean }[];
  bulletRewrites: BulletRewrite[];
  advice: string[];
};

type ApiResult = {
  matchScore?: number;
  keywordGaps?: KeywordGap[];
  cultureFit?: CultureFit[];
  formatRecommendations?: string[];
  bulletRewrites?: { original: string; improved: string }[];
  overallAdvice?: string[];
};

/** The API returns `{ result }` in its own shape; map it onto what this view renders. */
function toMatchResult(r: ApiResult): MatchResult {
  return {
    score: Math.max(0, Math.min(100, Math.round(r.matchScore ?? 0))),
    keywordGaps: r.keywordGaps ?? [],
    cultureFit: r.cultureFit ?? [],
    formatRecommendations: (r.formatRecommendations ?? []).map((label) => ({ label, done: false })),
    bulletRewrites: (r.bulletRewrites ?? []).map((b) => ({ original: b.original, improved: b.improved })),
    advice: r.overallAdvice ?? [],
  };
}

async function requestMatch(body: unknown): Promise<{ data: MatchResult } | { error: string; upgrade: boolean }> {
  const res = await fetch("/api/ai/company-match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => null);
  const j = res ? await res.json().catch(() => ({})) : {};
  if (res?.ok && j.result) return { data: toMatchResult(j.result as ApiResult) };
  return {
    error: typeof j.error === "string" ? j.error : "Couldn't run the analysis. Please try again.",
    upgrade: res?.status === 402 || res?.status === 403,
  };
}

const TIERS = [
  { key: "all", label: "All" },
  { key: "faang", label: "Big Tech" },
  { key: "tech", label: "Tech" },
  { key: "finance", label: "Finance" },
  { key: "consulting", label: "Consulting" },
  { key: "startup", label: "Startup" },
] as const;

const TIER_LABEL: Record<string, string> = Object.fromEntries(TIERS.map((t) => [t.key, t.label]));

const cardCls = "lc-card rounded-[26px] p-5 sm:px-[26px] sm:py-[22px]";
const h2Cls = "text-[18px] font-extrabold tracking-[-0.01em] text-[#121226]";

function ScoreGauge({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#0b7a4f" : score >= 60 ? "#a15c00" : "#c42b30";

  return (
    <div className="relative flex h-[112px] w-[112px] shrink-0 items-center justify-center rounded-full bg-white p-[5px]" role="img" aria-label={`Match score ${score} out of 100`}>
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#efedf7" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-1000 ease-out motion-reduce:transition-none"
        />
      </svg>
      <div className="absolute flex flex-col items-center" aria-hidden="true">
        <span className="text-[30px] font-extrabold leading-none tracking-[-0.03em]" style={{ color }}>
          {score}
        </span>
        <span className="mt-0.5 text-[11px] font-semibold text-[#66647c]">/ 100</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "found" | "missing" | "partial" }) {
  const map = {
    found: "bg-[#dcf5ea] text-[#0b4f35]",
    missing: "bg-[#fbe2e3] text-[#a3222a]",
    partial: "bg-[#fdf0d5] text-[#7a4600]",
  };
  const icons = {
    found: <Check className="mr-1 h-3 w-3" aria-hidden />,
    missing: <X className="mr-1 h-3 w-3" aria-hidden />,
    partial: <AlertTriangle className="mr-1 h-3 w-3" aria-hidden />,
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-[5px] text-[12px] font-bold capitalize ${map[status]}`}>
      {icons[status]}
      {status}
    </span>
  );
}

function SkeletonBlock() {
  return (
    <div className="flex flex-col gap-4 motion-safe:animate-pulse" aria-hidden="true">
      <div className="flex items-center gap-5 rounded-[26px] bg-[#c9c0ff] p-6">
        <div className="h-[112px] w-[112px] rounded-full bg-white/60" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-40 rounded-full bg-white/60" />
          <div className="h-5 w-full max-w-[360px] rounded-full bg-white/60" />
        </div>
      </div>
      <div className="space-y-2.5 rounded-[26px] bg-white p-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 rounded-[14px] bg-[#f1eff8]" />
        ))}
      </div>
    </div>
  );
}

export function MatcherClient({ resumes }: { resumes: Resume[] }) {
  const [selectedResumeId, setSelectedResumeId] = useState(resumes[0]?.id ?? "");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTier, setActiveTier] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState<CompanyRequirement | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customIndustry, setCustomIndustry] = useState("");
  const [customJD, setCustomJD] = useState("");
  const [bulletRewrites, setBulletRewrites] = useState<BulletRewrite[]>([]);
  const [error, setError] = useState<{ error: string; upgrade: boolean } | null>(null);

  const filtered = useMemo(() => {
    let list: CompanyRequirement[] = COMPANIES;
    if (activeTier !== "all") list = list.filter((c) => c.tier === activeTier);
    if (searchQuery.trim()) list = searchCompanies(searchQuery).filter((c) => activeTier === "all" || c.tier === activeTier);
    return list;
  }, [searchQuery, activeTier]);

  const analyzeCompany = useCallback(
    async (company: CompanyRequirement) => {
      if (!selectedResumeId) return;
      setSelectedCompany(company);
      setResult(null);
      setError(null);
      setLoading(true);
      const out = await requestMatch({ resumeId: selectedResumeId, companyId: company.id });
      setLoading(false);
      if ("data" in out) {
        setResult(out.data);
        setBulletRewrites(out.data.bulletRewrites);
      } else setError(out);
    },
    [selectedResumeId],
  );

  const analyzeCustom = useCallback(async () => {
    if (!selectedResumeId || !customName.trim()) return;
    setSelectedCompany({ id: "custom", name: customName, logo: customName[0]?.toUpperCase() ?? "?", industry: customIndustry, tier: "startup", keywords: [], culture: [], formatTips: [], mustHave: [], avoid: [], exampleBullet: "" });
    setResult(null);
    setError(null);
    setLoading(true);
    const out = await requestMatch({ resumeId: selectedResumeId, customCompany: { name: customName, industry: customIndustry, jobDescription: customJD } });
    setLoading(false);
    if ("data" in out) {
      setResult(out.data);
      setBulletRewrites(out.data.bulletRewrites);
    } else setError(out);
  }, [selectedResumeId, customName, customIndustry, customJD]);


  const resetAnalysis = () => {
    setError(null);
    setSelectedCompany(null);
    setResult(null);
    setLoading(false);
    setBulletRewrites([]);
  };

  /** Honest roll-ups of what the analysis returned (no invented sub-scores). */
  const summary = useMemo(() => {
    if (!result) return null;
    const found = result.keywordGaps.filter((k) => k.status === "found").length;
    const fit = result.cultureFit.length
      ? Math.round((result.cultureFit.reduce((a, c) => a + c.score, 0) / result.cultureFit.length) * 10) / 10
      : null;
    return { found, total: result.keywordGaps.length, fit, tips: result.formatRecommendations.length };
  }, [result]);

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-5 text-[#121226] sm:gap-6">
      <PageHeader
        title="Company matcher"
        lead="Pick a company to see which keywords and values your resume already covers, and what to add."
        actions={
          <div className="w-full md:w-[280px]">
            <label htmlFor="matcher-resume" className={labelCls}>
              Resume to compare
            </label>
            <SelectField id="matcher-resume" value={selectedResumeId} onChange={(e) => setSelectedResumeId(e.target.value)}>
              {resumes.length === 0 && <option value="">No resumes available</option>}
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </SelectField>
          </div>
        }
      />

      {error ? (
        <ErrorNote>
          {error.error}{" "}
          {error.upgrade ? (
            <Link href="/dashboard/settings/subscription" className="font-bold underline underline-offset-2">
              See plans
            </Link>
          ) : null}
        </ErrorNote>
      ) : null}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
        {/* COMPANY PICKER — on phones it steps aside while a result is open */}
        <section aria-label="Companies" className={`${cardCls} ${selectedCompany ? "hidden lg:block" : ""}`}>
          <SearchField
            value={searchQuery}
            onChange={setSearchQuery}
            label="Search companies"
            placeholder="Search companies, industries…"
            soft
          />
          <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Company type">
            {TIERS.map((tier) => (
              <FilterChip key={tier.key} soft pressed={activeTier === tier.key} onClick={() => setActiveTier(tier.key)}>
                {tier.label}
              </FilterChip>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-3 rounded-[16px] bg-[#f7f6fb] px-4 py-8 text-center">
              <Search className="mx-auto h-6 w-6 text-[#66647c]" aria-hidden />
              <p className="mt-2 text-[14px] font-bold">No companies found</p>
              <p className="mt-0.5 text-[13px] text-[#66647c]">Try adjusting your search or filters</p>
            </div>
          ) : (
            <ul className="mt-3 flex flex-col gap-1.5 lg:max-h-[560px] lg:overflow-y-auto lg:pr-1">
              {filtered.map((company) => {
                const on = selectedCompany?.id === company.id;
                return (
                  <li key={company.id}>
                    <button
                      type="button"
                      onClick={() => analyzeCompany(company)}
                      disabled={!selectedResumeId || loading}
                      aria-current={on ? "true" : undefined}
                      className={`flex w-full items-center gap-3 rounded-[16px] p-3 text-left transition-colors motion-reduce:transition-none disabled:cursor-not-allowed focus-visible:rounded-[16px]! ${focusCls} ${
                        on ? "bg-[#111118] text-white" : "bg-[#f7f6fb] text-[#121226] hover:bg-[#e4dfff] disabled:opacity-60"
                      }`}
                    >
                      <InitialTile name={company.logo} size={36} tone={on ? "bg-[#5440e8] text-white!" : "bg-white"} />
                      <span className="min-w-0 flex-1">
                        <span className="sr-only">Check my match: </span>
                        <b className="block truncate text-[15px] font-bold">{company.name}</b>
                        <span className={`block truncate text-[12px] ${on ? "text-[#c9c7d8]" : "text-[#66647c]"}`}>
                          {[TIER_LABEL[company.tier] ?? company.tier, company.industry, company.culture[0]].filter(Boolean).join(" · ")}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-4 border-t border-[#e2e0ea] pt-4">
            {!showCustom ? (
              <button
                type="button"
                onClick={() => setShowCustom(true)}
                className={`flex min-h-12 w-full items-center gap-3 rounded-[16px] border-[1.5px] border-dashed border-[#c9c0ff] px-3 py-2.5 text-left text-[#3a2bb8] transition-colors hover:border-[#5440e8] hover:bg-[#f7f6fb] motion-reduce:transition-none focus-visible:rounded-[16px]! ${focusCls}`}
              >
                <Plus className="h-5 w-5 shrink-0" aria-hidden />
                <span>
                  <span className="block text-[14px] font-bold">Another company</span>
                  <span className="block text-[12px] text-[#4a4862]">Paste a job description</span>
                </span>
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <p className={`${sectionLabelCls} flex items-center gap-2`}>
                  <Building2 className="h-4 w-4 text-[#5440e8]" aria-hidden /> Another company
                </p>
                <label>
                  <span className={labelCls}>Company name</span>
                  <input type="text" value={customName} onChange={(e) => setCustomName(e.target.value)} className={fieldCls} />
                </label>
                <label>
                  <span className={labelCls}>Industry</span>
                  <input type="text" value={customIndustry} onChange={(e) => setCustomIndustry(e.target.value)} className={fieldCls} />
                </label>
                <label>
                  <span className={labelCls}>
                    Job post <span className="font-normal text-[#66647c]">(optional)</span>
                  </span>
                  <textarea value={customJD} onChange={(e) => setCustomJD(e.target.value)} rows={4} className={`${textareaCls} resize-none`} />
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={analyzeCustom}
                    disabled={!selectedResumeId || !customName.trim() || loading}
                    className={`${appBtnPrimary} flex-1`}
                  >
                    Check my match
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustom(false);
                      setCustomName("");
                      setCustomIndustry("");
                      setCustomJD("");
                    }}
                    className={appBtnGhost}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* RESULTS */}
        <div className={`flex flex-col gap-4 ${selectedCompany ? "" : "hidden lg:flex"}`}>
          {!selectedCompany ? (
            <div className="flex flex-col items-center rounded-[26px] border-2 border-dashed border-[#c9c0ff] px-6 py-16 text-center">
              <span aria-hidden="true" className="inline-flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#5440e8] text-white">
                <Target className="h-8 w-8" strokeWidth={1.8} />
              </span>
              <h2 className="mt-5 text-[22px] font-extrabold tracking-[-0.02em]">Pick a company</h2>
              <p className="mt-2 max-w-[400px] text-[15px] leading-[1.6] text-[#4a4862]">
                Choose one on the left, or add another company with its job post. Your match shows up here.
              </p>
            </div>
          ) : loading ? (
            <>
              <p role="status" className="sr-only">Checking your match with {selectedCompany.name}…</p>
              <SkeletonBlock />
            </>
          ) : result && summary ? (
            <>
              {/* Verdict */}
              <section className="flex flex-col items-start gap-5 rounded-[26px] bg-[#5440e8] p-6 text-white sm:flex-row sm:items-center sm:gap-[22px]">
                <ScoreGauge score={result.score} />
                <div className="min-w-0">
                  <h2 className="break-words text-[13px] font-bold uppercase tracking-[0.08em] text-[#e4dfff]">{selectedCompany.name} match</h2>
                  <p className="mt-1.5 text-[20px] font-extrabold leading-[1.3] tracking-[-0.01em] sm:text-[22px] sm:leading-[27px]">
                    {result.score >= 80
                      ? "Strong match. Your resume already covers most of what this company looks for."
                      : result.score >= 60
                        ? "A good base. The gaps below would make it a stronger match."
                        : "Several gaps. Start with the recommendations below."}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/15 px-2.5 py-[5px] text-[12px] font-bold">
                      {TIER_LABEL[selectedCompany.tier] ?? selectedCompany.tier}
                    </span>
                    {selectedCompany.industry ? (
                      <span className="rounded-full bg-white/15 px-2.5 py-[5px] text-[12px] font-bold">{selectedCompany.industry}</span>
                    ) : null}
                  </div>
                </div>
              </section>

              {/* Summary + advice */}
              <section className={cardCls} aria-label="Summary">
                <dl className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-3">
                  <div className="rounded-[18px] bg-[#f7f6fb] p-4">
                    <dt className="text-[13px] text-[#4a4862]">Keywords found</dt>
                    <dd className="mt-0.5 text-[26px] font-extrabold tabular-nums tracking-[-0.02em]">
                      {summary.total ? `${summary.found}/${summary.total}` : "—"}
                    </dd>
                  </div>
                  <div className="rounded-[18px] bg-[#f7f6fb] p-4">
                    <dt className="text-[13px] text-[#4a4862]">Culture fit</dt>
                    <dd className="mt-0.5 text-[26px] font-extrabold tabular-nums tracking-[-0.02em]">
                      {summary.fit !== null ? (
                        <>
                          {summary.fit}
                          <span className="text-[15px] font-bold text-[#66647c]">/10</span>
                        </>
                      ) : (
                        "—"
                      )}
                    </dd>
                  </div>
                  <div className="rounded-[18px] bg-[#f7f6fb] p-4">
                    <dt className="text-[13px] text-[#4a4862]">Format tips</dt>
                    <dd className="mt-0.5 text-[26px] font-extrabold tabular-nums tracking-[-0.02em]">{summary.tips}</dd>
                  </div>
                </dl>
                {result.advice.length > 0 && (
                  <>
                    <h3 className={`${sectionLabelCls} mb-2 mt-5`}>Overall advice</h3>
                    <ol className="flex flex-col gap-2.5">
                      {result.advice.map((tip, i) => (
                        <li key={i} className="flex gap-3 text-[15px] leading-[1.55] text-[#24223a]">
                          <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e4dfff] text-[12px] font-extrabold text-[#3a2bb8]">
                            {i + 1}
                          </span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ol>
                  </>
                )}
              </section>

              {/* Keyword Gaps */}
              {result.keywordGaps.length > 0 && (
                <section className={cardCls}>
                  <h2 className={h2Cls}>Keywords</h2>
                  <div className="relative mt-3 overflow-x-auto">
                    <table className="w-full min-w-[440px] text-left">
                      <thead>
                        <tr className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#66647c]">
                          <th scope="col" className="pb-2.5 pr-4 font-bold">Keyword</th>
                          <th scope="col" className="pb-2.5 pr-4 font-bold">Status</th>
                          <th scope="col" className="pb-2.5 font-bold">Suggestion</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.keywordGaps.map((gap, i) => (
                          <tr key={i} className="border-t border-[#e2e0ea] align-top text-[14px]">
                            <td className="py-3 pr-4 font-bold">{gap.keyword}</td>
                            <td className="py-3 pr-4">
                              <StatusBadge status={gap.status} />
                            </td>
                            <td className="py-3 leading-[1.5] text-[#4a4862]">{gap.suggestion}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Culture Fit */}
              {result.cultureFit.length > 0 && (
                <section className={cardCls}>
                  <h2 className={h2Cls}>Culture fit</h2>
                  <ul className="mt-4 flex flex-col gap-4">
                    {result.cultureFit.map((item, i) => (
                      <li key={i}>
                        <div className="mb-1.5 flex items-center justify-between gap-3 text-[14px]">
                          <span className="font-semibold text-[#24223a]">{item.aspect}</span>
                          <span className="shrink-0 font-extrabold tabular-nums">{item.score}/10</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#efedf7]" aria-hidden="true">
                          <div
                            className={`h-full rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none ${
                              item.score >= 7 ? "bg-[#5440e8]" : item.score >= 5 ? "bg-[#f2a91f]" : "bg-[#c42b30]"
                            }`}
                            style={{ width: `${Math.max(0, Math.min(10, item.score)) * 10}%` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Format Recommendations */}
              {result.formatRecommendations.length > 0 && (
                <section className={cardCls}>
                  <h2 className={h2Cls}>Format</h2>
                  <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {result.formatRecommendations.map((rec, i) => (
                      <li
                        key={i}
                        className={`flex items-center gap-3 rounded-[16px] p-4 text-[14px] leading-[1.5] ${rec.done ? "bg-[#dcf5ea] text-[#0b4f35]" : "bg-[#f7f6fb] text-[#24223a]"}`}
                      >
                        <span
                          aria-hidden="true"
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${rec.done ? "bg-[#0b7a4f] text-white" : "bg-white text-[#4a4862]"}`}
                        >
                          {rec.done ? <Check className="h-3.5 w-3.5" /> : <span className="text-[11px] font-extrabold">{i + 1}</span>}
                        </span>
                        <span>{rec.label}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Bullet Rewrites */}
              {bulletRewrites.length > 0 && (
                <section className={cardCls}>
                  <h2 className={h2Cls}>Bullet rewrites</h2>
                  <ul className="mt-3 flex flex-col gap-4">
                    {bulletRewrites.map((bullet, i) => (
                      <li key={i}>
                        <div className="grid gap-2.5 sm:grid-cols-2">
                          <div className="rounded-[16px] bg-[#f7f6fb] p-4">
                            <p className="text-[12px] font-bold uppercase tracking-[0.04em] text-[#66647c]">Original</p>
                            <p className="mt-1.5 text-[14px] leading-[1.5] text-[#4a4862]">{bullet.original}</p>
                          </div>
                          <div className="rounded-[16px] bg-[#e4dfff] p-4">
                            <p className="text-[12px] font-bold uppercase tracking-[0.04em] text-[#3a2bb8]">Improved</p>
                            <p className="mt-1.5 text-[14px] font-semibold leading-[1.5] text-[#121226]">{bullet.improved}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-end">
                          <CopyButton text={bullet.improved} label="Copy rewrite" />
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <a href={`/resume/${selectedResumeId}/edit`} className={appBtnPrimary}>
                  <ExternalLink className="h-4 w-4" aria-hidden /> Open in Editor
                </a>
                <button type="button" onClick={resetAnalysis} className={appBtnSoft}>
                  <RotateCcw className="h-4 w-4" aria-hidden /> Try Another Company
                </button>
              </div>
            </>
          ) : (
            /* The request failed (message above): offer the way back to the list on phones. */
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={resetAnalysis} className={appBtnSoft}>
                <RotateCcw className="h-4 w-4" aria-hidden /> Try Another Company
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
